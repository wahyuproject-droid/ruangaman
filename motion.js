(()=>{
 'use strict';
 const intro=document.getElementById('ra-intro');
 const curtain=document.getElementById('ra-curtain');
 if(!intro||!curtain)return;
 const skip=document.getElementById('ra-intro-skip');

 const label=document.getElementById('ra-curtain-label');
 const sessionKey='ra_intro_seen_v2', travelKey='ra_curtain_travel_v2';
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
 const routes={'index.html':'Beranda','edukasi.html':'Kenali Bullying','angket.html':'Angket','laporan.html':'Lapor & Cek ID','tindakan.html':'Penanganan','punishment.html':'Punishment','hukum.html':'Dasar Hukum','kelompok.html':'Kelompok 3'};
 let introTimer=0, curtainTimer=0, navigating=false, introOpen=false;
 const ss={get(k){try{return sessionStorage.getItem(k)}catch{return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch{}},del(k){try{sessionStorage.removeItem(k)}catch{}}};
 const locked=()=>document.body.classList.toggle('ra-motion-locked',introOpen||navigating||curtain.classList.contains('is-active'));
 const lowMotion=()=>Boolean(reduced?.matches);
 function hideIntro(){clearTimeout(introTimer);introOpen=false;intro.classList.add('is-hidden');intro.setAttribute('aria-hidden','true');intro.inert=true;locked();}
 function showIntro(){if(lowMotion()||navigating)return;clearTimeout(introTimer);introOpen=true;ss.set(sessionKey,'1');intro.inert=false;intro.setAttribute('aria-hidden','false');intro.classList.add('is-hidden');void intro.offsetWidth;intro.classList.remove('is-hidden');locked();introTimer=setTimeout(hideIntro,3650);}
 function clearCurtain(){clearTimeout(curtainTimer);navigating=false;curtain.className='ra-curtain';curtain.setAttribute('aria-hidden','true');locked();}
 function arrive(){if(lowMotion()){clearCurtain();return}navigating=true;curtain.className='ra-curtain is-active is-holding';curtain.setAttribute('aria-hidden','false');label.textContent='Selamat datang';locked();requestAnimationFrame(()=>requestAnimationFrame(()=>curtain.className='ra-curtain is-active is-opening'));curtainTimer=setTimeout(clearCurtain,900);}
 function depart(url){if(lowMotion()){location.assign(url.href);return}if(navigating)return;navigating=true;hideIntro();label.textContent=routes[url.pathname.split('/').pop()]||'Ruang Aman';curtain.className='ra-curtain is-active';curtain.setAttribute('aria-hidden','false');locked();void curtain.offsetWidth;requestAnimationFrame(()=>curtain.className='ra-curtain is-active is-closing');curtainTimer=setTimeout(()=>{curtain.className='ra-curtain is-active is-holding';curtainTimer=setTimeout(()=>{ss.set(travelKey,'1');location.assign(url.href);},440);},740);setTimeout(()=>{if(navigating)clearCurtain()},4200);}
 skip?.addEventListener('click',hideIntro);

 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&introOpen)hideIntro()});
 document.addEventListener('click',e=>{if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey)return;const a=e.target instanceof Element?e.target.closest('a[href]'):null;if(!a||a.hasAttribute('download')||a.target&&a.target!=='_self')return;let u;try{u=new URL(a.href,location.href)}catch{return}if(u.origin!==location.origin)return;const page=u.pathname.split('/').pop()||'index.html';if(!(page in routes)||u.pathname===location.pathname&&u.search===location.search)return;e.preventDefault();depart(u)},true);
 window.addEventListener('pageshow',e=>{if(e.persisted){hideIntro();clearCurtain();}});
 window.addEventListener('pagehide',()=>{clearTimeout(introTimer);clearTimeout(curtainTimer)});
 reduced?.addEventListener?.('change',()=>{if(lowMotion()){hideIntro();clearCurtain();}});
 intro.inert=true;
 if(lowMotion()){ss.set(sessionKey,'1');ss.del(travelKey);hideIntro();clearCurtain();}
 else if(ss.get(travelKey)){ss.del(travelKey);arrive();}
 else if(!ss.get(sessionKey)){showIntro();}
})();