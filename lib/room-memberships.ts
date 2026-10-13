import {raw} from '../db/raw';

let ready:Promise<void>|null=null;

export function ensureRoomMemberships(){
 if(!ready)ready=(async()=>{
  const db=raw();
  await db.batch([
   db.prepare('CREATE TABLE IF NOT EXISTS room_memberships (room TEXT NOT NULL,user_id TEXT NOT NULL,joined_at INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(room,user_id))'),
   db.prepare('CREATE INDEX IF NOT EXISTS room_memberships_user ON room_memberships(user_id,room)'),
   db.prepare("INSERT OR IGNORE INTO room_memberships (room,user_id,joined_at) SELECT r.id,j.value,0 FROM rooms r,json_each(r.members) j WHERE j.type='text'")
  ]);
 })().catch(e=>{ready=null;throw e});
 return ready;
}
