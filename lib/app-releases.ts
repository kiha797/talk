import {env} from 'cloudflare:workers';
import {ApiError} from './auth';
import {raw} from '../db/raw';
export const APP_PART_SIZE=8*1024*1024;
export type AppRelease={platform:string;version_code:number;version:string;object_key:string;sha256:string;size:number;notes:string;updated:number};
export type AppUpload=AppRelease&{id:string;owner:string;upload_id:string;created:number};
export function appBucket(){const b=(env as typeof env & {BUCKET?:R2Bucket}).BUCKET;if(!b)throw new ApiError('앱 저장소가 준비되지 않았습니다.',503);return b}
export function releaseView(r:AppRelease){return {platform:r.platform,versionCode:r.version_code,version:r.version,sha256:r.sha256,size:r.size,notes:r.notes,updated:r.updated,downloadPath:'/api/app-download?platform='+r.platform+'&versionCode='+r.version_code}}
export async function appUpload(id:string,owner:string){const u=await raw().prepare('SELECT * FROM hub_app_uploads WHERE id=? AND owner=?').bind(id,owner).first<AppUpload>();if(!u||u.created<Date.now()-86400000)throw new ApiError('업로드 요청이 없거나 만료됐습니다.',404);return u}
