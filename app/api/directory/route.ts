import {directory} from '../../../lib/directory';
import {errorResponse} from '../../../lib/auth';
export const dynamic='force-dynamic';
export async function GET(){try{const d=await directory();return Response.json({revision:d.revision,nodes:d.nodes.map(({id,path})=>({id,path,count:0})),jobs:d.jobs.map(({id,name,grade})=>({id,name,grade,count:0}))},{headers:{'Cache-Control':'no-store'}})}catch(e){return errorResponse(e)}}
