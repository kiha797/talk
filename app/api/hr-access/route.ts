import {readSessionToken} from '../../../lib/session-token';
import {env} from 'cloudflare:workers';
import {createHash,randomBytes,timingSafeEqual} from 'node:crypto';
import {raw} from '../../../db/raw';
import {account,ApiError,checkOrigin,payload,usernameValid,passwordMatches,rateLimit,newSession,Account,errorResponse} from '../../../lib/auth';
import {ensureHrAccess} from '../../../lib/hr-access';
export const dynamic='force-dynamic';
const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
function trusted(req:Request){const expected=String((env as any).DW_PEOPLE_SYNC_TOKEN||''),provided=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');if(!expected||expected.length!==provided.length||!timingSafeEqual(Buffer.from(digest(expected)),Buffer.from(digest(provided))))throw new ApiError('HR 연동 인증이 필요합니다.',401)}
async function manager(username:string){return !!await raw().prepare('SELECT username FROM hr_managers WHERE username=?').bind(username).first()}
function publicHr(u:Account){return {username:u.username,name:u.name,company:u.company,branch:u.branch,dept:u.dept,job:u.job,accessRole:u.access_role}}
async function verifyRef(ref:string){if(!/^[a-f0-9]{64}$/.test(ref))throw new ApiError('로그인이 필요합니다.',401);const u=await raw().prepare('SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires>? AND s.mfa_verified=1 AND EXISTS (SELECT 1 FROM user_mfa m WHERE m.user_id=u.id AND m.generation=s.mfa_generation)').bind(ref,Date.now()).first<Account>();if(!u||u.status!=='approved')throw new ApiError('동원톡 로그인이 만료되었거나 계정이 중지되었습니다.',401);if(!await manager(u.username))throw new ApiError('HR 담당자 권한이 없습니다.',403);return u}
function refFromCookie(req:Request){return readSessionToken(req)}
export async function POST(req:Request){try{const p=await payload(req),db=raw();await ensureHrAccess();if(p.action==='handoff'){
 checkOrigin(req);const u=await account(req);if(!await manager(u.username))throw new ApiError('HR 담당자 권한이 없습니다.',403);const state=String(p.state||'');if(!/^[a-f0-9-]{32,64}$/i.test(state))throw new ApiError('로그인 요청 상태를 확인해주세요.',400);const rawToken=refFromCookie(req);if(!rawToken)throw new ApiError('로그인이 필요합니다.',401);const code=randomBytes(32).toString('hex');await db.batch([db.prepare('DELETE FROM hr_handoffs WHERE expires<? OR used=1').bind(Date.now()),db.prepare('INSERT INTO hr_handoffs (code,session_ref,state_hash,expires,used) VALUES (?,?,?,?,0)').bind(digest(code),digest(rawToken),digest(state),Date.now()+60000)]);return Response.json({code},{headers:{'Cache-Control':'no-store'}})
 }
 trusted(req);
 if(p.action==='login')throw new ApiError('동원HUB에서 OTP 인증 후 로그인 연결을 이용해주세요.',401);
if(p.action==='exchange'){
  const code=String(p.code||''),state=String(p.state||'');if(!/^[a-f0-9]{64}$/.test(code)||!/^[a-f0-9-]{32,64}$/i.test(state))throw new ApiError('로그인 연결 코드가 유효하지 않습니다.',401);const row=await db.prepare('UPDATE hr_handoffs SET used=1 WHERE code=? AND state_hash=? AND expires>? AND used=0 RETURNING session_ref').bind(digest(code),digest(state),Date.now()).first<{session_ref:string}>();if(!row)throw new ApiError('로그인 연결 코드가 만료되었습니다. 다시 로그인해주세요.',401);const u=await verifyRef(row.session_ref);return Response.json({sessionRef:row.session_ref,user:publicHr(u)},{headers:{'Cache-Control':'no-store'}})
 }
 if(p.action==='verify'&&typeof p.sessionRef==='string'){const u=await verifyRef(p.sessionRef);return Response.json({user:publicHr(u)},{headers:{'Cache-Control':'no-store'}})}
 if(p.action==='logout'&&typeof p.sessionRef==='string'){await db.prepare('DELETE FROM sessions WHERE token=?').bind(p.sessionRef).run();return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}})}
 throw new ApiError('지원하지 않는 요청입니다.');
 }catch(e){return errorResponse(e)}}
