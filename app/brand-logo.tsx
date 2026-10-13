'use client';
import {useEffect,useState} from 'react';
import {MessageCircle} from 'lucide-react';

export type Branding={logoUrl:string|null;revision:number};
export async function readBranding():Promise<Branding>{const r=await fetch('/api/branding',{cache:'no-store'});if(!r.ok)throw Error('로고 정보를 불러오지 못했습니다.');return r.json()}

export function BrandLogo(){const [logo,setLogo]=useState<string|null>(null),[failed,setFailed]=useState<string|null>(null);
 useEffect(()=>{let active=true;const load=()=>{readBranding().then(d=>{if(active)setLogo(d.logoUrl)}).catch(()=>{})};load();const timer=setInterval(()=>{if(!document.hidden)load()},60000);window.addEventListener('focus',load);return()=>{active=false;clearInterval(timer);window.removeEventListener('focus',load)}},[]);
 const image=logo&&failed!==logo;return <div className={'brand'+(image?' brand-custom':'')} title="동원HUB">{image?<img src={logo} alt="동원HUB 로고" onError={()=>setFailed(logo)}/>:<MessageCircle size={25} fill="currentColor"/>}</div>;
}
