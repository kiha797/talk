import {presenceStatuses} from '../../../lib/presence';
import {directory} from '../../../lib/directory';
import {raw} from '../../../db/raw';
import {account,publicUser,ApiError,checkOrigin,payload,clean,errorResponse,type Account} from '../../../lib/auth';
import {ensureRoomMemberships} from '../../../lib/room-memberships';

export const dynamic='force-dynamic';

function roomMembers(value:string){
 try{const parsed=JSON.parse(value);return Array.isArray(parsed)?parsed.filter((id):id is string=>typeof id==='string'):[]}catch{return []}
}

async function membership(room:string,userId:string){
 return raw().prepare('SELECT joined_at FROM room_memberships WHERE room=? AND user_id=?').bind(room,userId).first<{joined_at:number}>();
}

export async function GET(req:Request){
 try{
  const user=await account(req),u=new URL(req.url),room=u.searchParams.get('room'),db=raw();
  await ensureRoomMemberships();
  if(room){
   const r=await db.prepare('SELECT members FROM rooms WHERE id=?').bind(room).first<{members:string}>();
   if(!r||!roomMembers(r.members).includes(user.id))throw new ApiError('참여 중인 대화가 아닙니다.',403);
   const joined=await membership(room,user.id);
   if(!joined)throw new ApiError('대화 참여 정보를 확인할 수 없습니다.',403);
   const before=u.searchParams.get('before');
   let cursor:{created:number;id:string}|null=null;
   if(before){try{cursor=JSON.parse(before);if(!cursor||!Number.isFinite(cursor.created)||typeof cursor.id!=='string')throw Error()}catch{throw new ApiError('대화 조회 위치를 확인해주세요.')}}
   const result=cursor
    ?await db.prepare('SELECT m.*,n.kind AS notice_kind,n.entity_id AS notice_entity,n.actor AS notice_actor FROM messages m LEFT JOIN notifications n ON n.id=m.id AND n.user_id=? WHERE m.room=? AND m.created>=? AND (m.created<? OR (m.created=? AND m.id<?)) ORDER BY m.created DESC,m.id DESC LIMIT 101').bind(user.id,room,joined.joined_at,cursor.created,cursor.created,cursor.id).all()
    :await db.prepare('SELECT m.*,n.kind AS notice_kind,n.entity_id AS notice_entity,n.actor AS notice_actor FROM messages m LEFT JOIN notifications n ON n.id=m.id AND n.user_id=? WHERE m.room=? AND m.created>=? ORDER BY m.created DESC,m.id DESC LIMIT 101').bind(user.id,room,joined.joined_at).all();
   const hasMore=result.results.length>100;
   return Response.json({messages:result.results.slice(0,100).reverse(),hasMore},{headers:{'Cache-Control':'no-store'}});
  }
  const rows=await db.prepare(`SELECT r.*,
   (SELECT COUNT(*) FROM messages m LEFT JOIN room_reads rr ON rr.room=m.room AND rr.user_id=? WHERE m.room=r.id AND m.sender<>? AND m.created>=rm.joined_at AND (m.created>COALESCE(rr.last_created,0) OR (m.created=COALESCE(rr.last_created,0) AND m.id>COALESCE(rr.last_id,'')))) as unread,
   (SELECT body FROM messages WHERE room=r.id AND created>=rm.joined_at ORDER BY created DESC,id DESC LIMIT 1) as last
   FROM rooms r JOIN room_memberships rm ON rm.room=r.id AND rm.user_id=?
   WHERE EXISTS (SELECT 1 FROM json_each(r.members) WHERE value=?) ORDER BY r.updated DESC`).bind(user.id,user.id,user.id,user.id).all();
  const users=await db.prepare("SELECT * FROM users WHERE status='approved' OR id IN (SELECT m.value FROM rooms r,json_each(r.members) m WHERE EXISTS (SELECT 1 FROM json_each(r.members) WHERE value=?))").bind(user.id).all<Account>();
  return Response.json({directory:await directory(),rooms:rows.results.map(r=>({...r,members:roomMembers(r.members as string)})),people:users.results.map(publicUser),presence:await presenceStatuses()},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return errorResponse(e)}
}

export async function POST(req:Request){
 try{
  checkOrigin(req);
  const user=await account(req),p=await payload(req),db=raw(),now=Date.now();
  await ensureRoomMemberships();

  if(p.action==='read'){
   const room=clean(p.room,200),r=await db.prepare('SELECT members FROM rooms WHERE id=?').bind(room).first<{members:string}>();
   if(!r||!roomMembers(r.members).includes(user.id)||!await membership(room,user.id))throw new ApiError('참여 중인 대화가 아닙니다.',403);
   if(typeof p.id!=='string'||!Number.isFinite(p.created))throw new ApiError('읽은 메시지 위치를 확인해주세요.');
   const m=await db.prepare('SELECT id FROM messages WHERE room=? AND id=? AND created=?').bind(room,p.id,p.created).first();
   if(!m)throw new ApiError('메시지를 찾을 수 없습니다.',404);
   await db.prepare('INSERT INTO room_reads (room,user_id,last_created,last_id) VALUES (?,?,?,?) ON CONFLICT(room,user_id) DO UPDATE SET last_created=excluded.last_created,last_id=excluded.last_id WHERE excluded.last_created>room_reads.last_created OR (excluded.last_created=room_reads.last_created AND excluded.last_id>room_reads.last_id)').bind(room,user.id,p.created,p.id).run();
   return Response.json({ok:true});
  }
  if(user.access_role==='viewer')throw new ApiError('조회전용 사용자는 메시지 발송과 대화 생성이 제한됩니다.',403);

  if(p.action==='create'){
   const members=[...new Set([user.id,...(Array.isArray(p.members)?p.members:[])])];
   if(members.length<2||members.length>200||members.some(id=>typeof id!=='string'))throw new ApiError('대화 상대를 1~199명 선택해주세요.');
   for(const id of members){if(!await db.prepare("SELECT id FROM users WHERE id=? AND status='approved'").bind(id).first())throw new ApiError('승인된 직원만 대화에 참여할 수 있습니다.')}
   const kind=members.length===2?'direct':'group';let id=kind==='direct'?'dm-'+members.slice().sort().join('-'):crypto.randomUUID();
   if(kind==='direct'){
    const base=id;
    for(let suffix=0;suffix<1000;suffix++){
     const candidate=suffix===0?base:`${base}-${suffix}`;
     const found=await db.prepare('SELECT kind,members FROM rooms WHERE id=?').bind(candidate).first<{kind:string;members:string}>();
     if(!found||found.kind==='direct'&&JSON.stringify(roomMembers(found.members).slice().sort())===JSON.stringify(members.slice().sort())){id=candidate;break}
    }
   }
   await db.batch([
    db.prepare('INSERT OR IGNORE INTO rooms (id,title,members,kind,updated) VALUES (?,?,?,?,?)').bind(id,clean(p.title,60),JSON.stringify(members),kind,now),
    ...members.map(member=>db.prepare('INSERT OR IGNORE INTO room_memberships (room,user_id,joined_at) SELECT ?,?,0 WHERE EXISTS (SELECT 1 FROM rooms WHERE id=?)').bind(id,member,id))
   ]);
   return Response.json({id});
  }

  if(p.action==='invite'){
   const room=clean(p.room,200),r=await db.prepare('SELECT members,kind FROM rooms WHERE id=?').bind(room).first<{members:string;kind:string}>();
   const existing=roomMembers(r?.members||'[]');
   if(!r||!existing.includes(user.id)||!await membership(room,user.id))throw new ApiError('참여 중인 대화가 아닙니다.',403);
   if(r.kind==='notification')throw new ApiError('안내 전용 대화에는 참석자를 초대할 수 없습니다.',400);
   if(r.kind!=='direct'&&r.kind!=='group')throw new ApiError('이 대화에는 참석자를 초대할 수 없습니다.',400);
   const requested=Array.isArray(p.members)?p.members:[];
   if(requested.length>199||requested.some(id=>typeof id!=='string'))throw new ApiError('초대할 직원을 확인해주세요.');
   const invited=[...new Set(requested as string[])].filter(id=>!existing.includes(id));
   if(!invited.length)throw new ApiError('새로 초대할 직원을 선택해주세요.');
   if(existing.length+invited.length>200)throw new ApiError('단체 대화 참여자는 최대 200명입니다.');
   for(const id of invited){if(!await db.prepare("SELECT id FROM users WHERE id=? AND status='approved'").bind(id).first())throw new ApiError('승인된 직원만 대화에 초대할 수 있습니다.')}
   const updated=[...existing,...invited];
   await db.batch([
    db.prepare("UPDATE rooms SET members=?,kind='group',updated=MAX(?,COALESCE((SELECT MAX(created) FROM messages WHERE room=?),0)) WHERE id=? AND members=? AND kind IN ('direct','group')").bind(JSON.stringify(updated),now,room,room,r.members),
    ...invited.map(id=>db.prepare('INSERT OR IGNORE INTO room_memberships (room,user_id,joined_at) SELECT ?,?,MAX(?,COALESCE((SELECT MAX(created)+1 FROM messages WHERE room=?),0)) WHERE EXISTS (SELECT 1 FROM rooms r,json_each(r.members) m WHERE r.id=? AND m.value=?)').bind(room,id,now,room,room,id))
   ]);
   const final=await db.prepare('SELECT members FROM rooms WHERE id=?').bind(room).first<{members:string}>();
   const joined=await Promise.all(invited.map(id=>membership(room,id)));
   if(!final||invited.some(id=>!roomMembers(final.members).includes(id))||joined.some(row=>!row))throw new ApiError('대화가 동시에 변경되었습니다. 새로고침 후 다시 초대해주세요.',409);
   return Response.json({ok:true,added:invited.length});
  }

  const room=clean(p.room,200),r=await db.prepare('SELECT members,kind FROM rooms WHERE id=?').bind(room).first<{members:string;kind:string}>();
  if(!r||!roomMembers(r.members).includes(user.id)||!await membership(room,user.id))throw new ApiError('참여 중인 대화가 아닙니다.',403);
  if(r.kind==='notification')throw new ApiError('인사이트 알림은 안내 전용 대화입니다.',403);
  const body=typeof p.body==='string'?p.body.trim():'';
  if(!body||body.length>4000)throw new ApiError('메시지를 4,000자 이내로 입력해주세요.');
  const id=typeof p.id==='string'&&/^[\w-]{1,80}$/.test(p.id)?p.id:crypto.randomUUID();
  const prev=await db.prepare('SELECT room,sender FROM messages WHERE id=?').bind(id).first<{room:string;sender:string}>();
  if(prev&&(prev.room!==room||prev.sender!==user.id))throw new ApiError('메시지 식별자가 중복되었습니다.',409);
  await db.batch([
   db.prepare('INSERT OR IGNORE INTO messages (id,room,sender,body,created) VALUES (?,?,?,?,MAX(?,COALESCE((SELECT MAX(created)+1 FROM messages WHERE room=?),0)))').bind(id,room,user.id,body,now,room),
   db.prepare('UPDATE rooms SET updated=MAX(?,COALESCE((SELECT MAX(created) FROM messages WHERE room=?),0)) WHERE id=?').bind(now,room,room)
  ]);
  return Response.json({ok:true});
 }catch(e){return errorResponse(e)}
}
