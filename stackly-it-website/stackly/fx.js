(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const touch=matchMedia('(hover:none)').matches;
const LOGO='<svg viewBox="0 0 30 30" aria-hidden="true"><rect class="s1" x="3" y="4" width="20" height="6" rx="3" fill="#7df0b0"/><rect class="s2" x="7" y="12" width="20" height="6" rx="3" fill="#fff"/><rect class="s3" x="3" y="20" width="20" height="6" rx="3" fill="#7df0b0"/></svg>';
// branded intro runs on every page visit
if(!reduce){const s=document.createElement('div');s.className='splash';s.innerHTML='<div class="splash-in">'+LOGO+'<b>stackly<i>IT</i></b><div class="bar"></div></div>';document.body.append(s);
 const kill=()=>{s.classList.add('hide');setTimeout(()=>s.remove(),800)};setTimeout(kill,1450);}
// logo and company name appear during every page transition
const wipe=$('.wipe');if(wipe){wipe.style.display='grid';wipe.style.placeItems='center';wipe.innerHTML='<div class="splash-in transition-brand">'+LOGO.replace(/class="s\d"/g,'style="opacity:1"')+'<b>stackly<i>IT</i></b></div>'}
// scroll progress
const pr=document.createElement('div');pr.className='progress';document.body.prepend(pr);
const onScroll=()=>{const h=document.documentElement.scrollHeight-innerHeight;pr.style.transform='scaleX('+(h>0?scrollY/h:0)+')'};
addEventListener('scroll',onScroll,{passive:true});onScroll();
// cursor glow
if(!touch&&!reduce){const g=document.createElement('div');g.className='glow';document.body.prepend(g);let x=0,y=0,tx=0,ty=0;
 addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;g.classList.add('on')},{passive:true});
 (function loop(){x+=(tx-x)*.12;y+=(ty-y)*.12;g.style.transform='translate('+x+'px,'+y+'px)';requestAnimationFrame(loop)})();}
// network particles in hero
const hero=$('.hero');if(hero&&!reduce){const c=document.createElement('canvas');c.id='net';hero.prepend(c);const ctx=c.getContext('2d');let W,H,P=[];
 const size=()=>{const r=hero.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;c.width=W*d;c.height=H*d;ctx.setTransform(d,0,0,d,0,0);
  const n=Math.round(Math.min(60,W*H/16000));P=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}))};
 size();addEventListener('resize',size);let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(hero);
 (function draw(){requestAnimationFrame(draw);if(!vis)return;ctx.clearRect(0,0,W,H);
  P.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
   ctx.fillStyle='rgba(63,207,138,.7)';ctx.beginPath();ctx.arc(p.x,p.y,2,0,6.3);ctx.fill();
   for(let j=i+1;j<P.length;j++){const q=P[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<120){ctx.strokeStyle='rgba(63,207,138,'+(.22*(1-d/120))+')';ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}}})})();}
// 3D tilt on panel + cards
if(!touch&&!reduce){$$('.panel,.stat,.vm article,.detail,.form-card').forEach(el=>{el.classList.add('tilt');
 el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;el.style.transform='perspective(900px) rotateY('+px*7+'deg) rotateX('+-py*7+'deg) translateZ(0)'});
 el.addEventListener('mouseleave',()=>el.style.transform='')});
 // magnetic buttons
 $$('.btn:not(.btn-sm)').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform='translate('+(e.clientX-r.left-r.width/2)*.15+'px,'+(e.clientY-r.top-r.height/2)*.25+'px)'});b.addEventListener('mouseleave',()=>b.style.transform='')});}
// click ripple (works on touch too)
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn,.tab');if(!b||reduce)return;const r=b.getBoundingClientRect(),d=Math.max(r.width,r.height)/2,s=document.createElement('span');
 s.className='ripple';s.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';if(getComputedStyle(b).position==='static')b.style.position='relative';b.style.overflow='hidden';b.append(s);setTimeout(()=>s.remove(),650)});
// stagger reveal delays
$$('.features .feature,.steps .step').forEach((el,i)=>el.style.setProperty('--d',(i%5)*.08+'s'));
// ===== real-time dashboard (home) =====
const panel=$('.panel');if(panel){
 const num=$('.panel-num',panel),bars=$$('.bars i',panel),sub=$('.panel-sub',panel),toast=$('.toast',panel);
 const feed=document.createElement('div');feed.className='feed';feed.setAttribute('aria-live','off');panel.insertBefore(feed,toast);
 const msgs=['Password reset completed','Laptop patched and secured','VPN access restored','Backup verified successfully','Phishing email blocked','Printer back online','New user onboarded','Cloud storage synced','Ticket closed in 6 minutes','Threat scan: all clear'];
 const t=()=>new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'});
 let k=0;const add=()=>{const d=document.createElement('div');d.innerHTML='<i></i><time>'+t()+'</time><span>'+msgs[k++%msgs.length]+'</span>';feed.prepend(d);while(feed.children.length>3)feed.lastChild.remove();
  let v=parseInt(num.textContent)||16;if(k>2&&k%3===0){num.textContent=++v;num.dataset.to=v}
  const last=bars[5];if(last){const h=Math.min(98,parseFloat(last.style.getPropertyValue('--h'))+1.5);last.style.setProperty('--h',h+'%');last.style.height=h+'%'}
  const mins=[9,6,12,8,5,7][k%6];toast.lastChild.textContent='Ticket closed in '+mins+' minutes'};
 setTimeout(()=>{add();setInterval(add,2600)},2400);
 // slight live jitter on the other bars
 if(!reduce)setInterval(()=>{const i=Math.floor(Math.random()*5),b=bars[i],h=Math.max(20,Math.min(80,parseFloat(b.style.getPropertyValue('--h'))+(Math.random()*8-4)));b.style.setProperty('--h',h+'%');b.style.height=h+'%'},1800);
 // status strip
 const strip=document.createElement('div');strip.className='status';
 strip.innerHTML='<span><i class="dot"></i><b>All systems operational</b></span><span>Local time <b id="clk"></b></span><span>Uptime <b id="up">99.98%</b></span><span>Avg response <b id="rt">9 min</b></span><span>Monitoring <b>24/7</b></span>';
 const mq=$('.marquee');mq&&mq.before(strip);
 const clk=$('#clk'),rt=$('#rt');setInterval(()=>{clk.textContent=t()},1000);clk.textContent=t();
 setInterval(()=>{rt.textContent=(7+Math.floor(Math.random()*5))+' min'},3500);}
})();
