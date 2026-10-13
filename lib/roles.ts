import {companies} from './people';
export const roleLabels:Record<string,string>={admin:'전산관리자',group_admin:'그룹관리자',user:'일반사용자',viewer:'조회전용 사용자'};
export function parseScope(raw:string|undefined):string[]{try{const v=JSON.parse(raw||'[]');return Array.isArray(v)&&v.every(x=>typeof x==='string')?v:[]}catch{return []}}
export function validScope(v:unknown){if(!Array.isArray(v)||v.length<1||v.length>3||v[0]!=='동원약품그룹'||v.some(x=>typeof x!=='string'||!x||x.length>80))throw Error('그룹·법인·부서 범위를 확인해주세요.');return v as string[]}
export function scopeLabel(role:string,scope:string[]){return role==='admin'?'그룹 전체':scope.length?scope.join(' / '):'본인 접수·협업 지정 내역'}
export function employeeId(username:string){return username==='hizuno'?'ORG-ROW-2':username==='dungchcap'?'ORG-ROW-3':username.toUpperCase()}
