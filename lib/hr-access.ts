import {raw} from '../db/raw';

let ready:Promise<void>|null=null;
export function ensureHrAccess(){
 if(!ready)ready=(async()=>{
  const db=raw();
  await db.batch([
   db.prepare('CREATE TABLE IF NOT EXISTS hr_managers (username TEXT PRIMARY KEY, granted_by TEXT NOT NULL, created INTEGER NOT NULL)'),
   db.prepare('CREATE TABLE IF NOT EXISTS hr_handoffs (code TEXT PRIMARY KEY, session_ref TEXT NOT NULL, state_hash TEXT NOT NULL, expires INTEGER NOT NULL, used INTEGER NOT NULL DEFAULT 0)'),
   db.prepare('INSERT OR IGNORE INTO hr_managers (username,granted_by,created) VALUES (?,?,?)').bind('admin','initial-policy',Date.now()),
   db.prepare('INSERT OR IGNORE INTO hr_managers (username,granted_by,created) VALUES (?,?,?)').bind('dw380','initial-policy',Date.now()),
  ]);
 })().catch(e=>{ready=null;throw e});
 return ready;
}
