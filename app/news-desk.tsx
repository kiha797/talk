'use client';
import {useEffect,useState} from 'react';
import {Newspaper,ArrowLeft,ExternalLink,RefreshCw,Maximize2,Minimize2} from 'lucide-react';

const NEWS_URL='https://news.ipharmkorea.com/';
export function NewsDesk({onReturn}:{onReturn:()=>void}){
 const [attempt,setAttempt]=useState(0),[loaded,setLoaded]=useState(false),[slow,setSlow]=useState(false),[fullscreen,setFullscreen]=useState(false);
 useEffect(()=>{setLoaded(false);setSlow(false);const timer=setTimeout(()=>setSlow(true),18000);return()=>clearTimeout(timer)},[attempt]);
 return <section className={'cs-workspace news-workspace '+(fullscreen?'cs-fullscreen':'')} aria-label="약업뉴스 데스크"><header className="cs-workspace-header"><div className="cs-workspace-brand"><span><Newspaper size={22}/></span><div><h1>약업뉴스 데스크</h1><p>의약품 유통과 약업계 소식을 한곳에서</p></div></div><div className="cs-header-actions"><button className="cs-back" onClick={onReturn}><ArrowLeft size={16}/><span>동원HUB로</span></button><button className="icon-btn" title="새로고침" aria-label="약업뉴스 새로고침" onClick={()=>setAttempt(v=>v+1)}><RefreshCw size={18}/></button><button className="icon-btn" aria-label={fullscreen?'전체 화면 닫기':'약업뉴스 전체 화면'} onClick={()=>setFullscreen(v=>!v)}>{fullscreen?<Minimize2 size={18}/>:<Maximize2 size={18}/>}</button><a className="icon-btn" href={NEWS_URL} target="_blank" rel="noopener noreferrer" title="새 창으로 열기" aria-label="약업뉴스 새 창으로 열기"><ExternalLink size={18}/></a></div></header><div className="cs-connection"><span>{slow&&!loaded?'연결이 지연되면 새로고침하거나 새 창으로 열어주세요.':'약업뉴스 데스크 원본 사이트를 연결합니다.'}</span></div><div className="cs-frame-container"><iframe key={attempt} src={NEWS_URL} title="약업뉴스 데스크" referrerPolicy="strict-origin-when-cross-origin" onLoad={()=>{setLoaded(true);setSlow(false)}} onError={()=>setSlow(true)}/>{!loaded&&!slow&&<div className="cs-loading"><Newspaper size={30}/><strong>약업뉴스를 불러오고 있습니다</strong><p>약업계 소식을 연결합니다.</p></div>}</div></section>;
}
