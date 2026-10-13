import {env} from 'cloudflare:workers';
import {raw} from '../db/raw';
let initialized=false;
export async function provisionAdmin(){
 if(initialized)return;
 const hash=(env as unknown as {PRIMARY_ADMIN_HASH?:string}).PRIMARY_ADMIN_HASH;
 if(!hash)return;
 const existing=await raw().prepare('SELECT id FROM users WHERE username=? OR id=?').bind('admin','initial-admin').first();
 if(existing){initialized=true;return}
 const now=Date.now();
 await raw().prepare('INSERT OR IGNORE INTO users (id,username,password,name,company,branch,dept,job,access_role,status,must_change,created,updated) VALUES (?,?,?,?,?,?,?,?,?,?,0,?,?)').bind('initial-admin','admin',hash,'관리자','그룹 직속','','전략기획실','관리자','admin','approved',now,now).run();
 initialized=true;
}
