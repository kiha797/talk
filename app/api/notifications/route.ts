import {listNotifications,readNotification} from '../../../lib/notifications';
import {account,ApiError,checkOrigin,payload,errorResponse} from '../../../lib/auth';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{const user=await account(req);return Response.json(await listNotifications(user.id),{headers:{'Cache-Control':'no-store'}})}catch(e){return errorResponse(e)}}
export async function POST(req:Request){try{checkOrigin(req);const user=await account(req),p=await payload(req);if(p.action==='readAll')await readNotification(user.id);else if(p.action==='read'&&typeof p.id==='string')await readNotification(user.id,p.id);else throw new ApiError('알림을 확인해주세요.');return Response.json({ok:true})}catch(e){return errorResponse(e)}}
