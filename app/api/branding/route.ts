import {env} from 'cloudflare:workers';
import {account,checkOrigin,ApiError,errorResponse} from '../../../lib/auth';
import {raw} from '../../../db/raw';

type Branding={object_key:string;mime:string;revision:number};
const MAX_SIZE=2*1024*1024;
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
async function current(){return raw().prepare("SELECT object_key,mime,revision FROM hub_branding WHERE id='primary'").first<Branding>()}
function view(row:Branding|null){return {logoUrl:row?.object_key?`/api/branding/image?v=${row.revision}`:null,revision:row?.revision||0}}
function bucket(){const storage=(env as typeof env & {BUCKET?:R2Bucket}).BUCKET;if(!storage)throw new ApiError('로고 저장소가 준비되지 않았습니다.',503);return storage}
function mimeOf(bytes:Uint8Array){if(bytes.length>=8&&[137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n))return 'image/png';if(bytes.length>=3&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'image/jpeg';if(bytes.length>=12&&String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP')return 'image/webp';return ''}

export async function GET(){try{return Response.json(view(await current()),{headers})}catch(e){return errorResponse(e)}}
export async function POST(req:Request){try{checkOrigin(req);await account(req,true);if(Number(req.headers.get('content-length')||0)>MAX_SIZE+8192)throw new ApiError('로고는 2MB 이하로 선택해주세요.',413);const form=await req.formData(),file=form.get('logo');if(!(file instanceof File)||!file.size||file.size>MAX_SIZE)throw new ApiError('2MB 이하의 이미지 파일을 선택해주세요.');const bytes=new Uint8Array(await file.arrayBuffer()),mime=mimeOf(bytes);if(!mime||file.type!==mime)throw new ApiError('PNG, JPG 또는 WebP 이미지를 선택해주세요.');const key='branding/'+crypto.randomUUID(),storage=bucket();await storage.put(key,bytes,{httpMetadata:{contentType:mime}});try{await raw().prepare("INSERT INTO hub_branding (id,object_key,mime,revision,updated) VALUES ('primary',?,?,1,?) ON CONFLICT(id) DO UPDATE SET object_key=excluded.object_key,mime=excluded.mime,revision=hub_branding.revision+1,updated=excluded.updated").bind(key,mime,Date.now()).run()}catch(e){await storage.delete(key);throw e}return Response.json(view(await current()),{headers})}catch(e){return errorResponse(e)}}
export async function DELETE(req:Request){try{checkOrigin(req);await account(req,true);await raw().prepare("INSERT INTO hub_branding (id,object_key,mime,revision,updated) VALUES ('primary','','',1,?) ON CONFLICT(id) DO UPDATE SET object_key='',mime='',revision=hub_branding.revision+1,updated=excluded.updated").bind(Date.now()).run();return Response.json(view(await current()),{headers})}catch(e){return errorResponse(e)}}
