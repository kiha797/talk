import {env} from 'cloudflare:workers';
import {raw} from '../../../../db/raw';
import {errorResponse,ApiError} from '../../../../lib/auth';

export async function GET(){try{const row=await raw().prepare("SELECT object_key,mime FROM hub_branding WHERE id='primary'").first<{object_key:string;mime:string}>();if(!row?.object_key)throw new ApiError('로고가 없습니다.',404);const storage=(env as typeof env & {BUCKET?:R2Bucket}).BUCKET;if(!storage)throw new ApiError('로고 저장소가 준비되지 않았습니다.',503);const image=await storage.get(row.object_key);if(!image)throw new ApiError('로고가 없습니다.',404);return new Response(image.body,{headers:{'Content-Type':row.mime,'Cache-Control':'public, max-age=60','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"}})}catch(e){return errorResponse(e)}}
