(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
document.body.classList.add('page-enter');
// page wipe
const wipe=document.createElement('div');wipe.className='wipe out';document.body.append(wipe);
addEventListener('pageshow',e=>{if(e.persisted){wipe.className='wipe out'}});
$$('a[href]').forEach(a=>{const h=a.getAttribute('href');if(!h||h[0]==='#'||h.startsWith('mailto:')||h.startsWith('tel:')||a.target)return;
 a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||reduce)return;e.preventDefault();wipe.className='wipe in';setTimeout(()=>location.href=h,480)})});
// header
const hd=$('.site-header'),setHeader=()=>hd&&hd.classList.toggle('scrolled',scrollY>8);addEventListener('scroll',setHeader,{passive:true});setHeader();
const mt=$('.menu-toggle'),nav=$('.nav');
mt&&mt.addEventListener('click',()=>{const o=nav.classList.toggle('open');mt.setAttribute('aria-expanded',o)});
// reveal + counters
const count=el=>{const t=parseFloat(el.dataset.to),suf=el.dataset.suf||'';if(reduce){el.textContent=t+suf;return}
 const s=performance.now(),d=1600;(function f(n){const p=Math.min((n-s)/d,1),e=1-Math.pow(1-p,4);el.textContent=Math.round(t*e)+suf;if(p<1)requestAnimationFrame(f)})(s)};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');$$('[data-to]',e.target).forEach(count);if(e.target.dataset.to)count(e.target);io.unobserve(e.target)}),{threshold:.2});
$$('[data-reveal],.draw').forEach(el=>io.observe(el));
$$('.panel [data-to]').forEach(el=>setTimeout(()=>count(el),900));
// footer
$$('#year').forEach(y=>y.textContent=new Date().getFullYear());
$$('.sub-form').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const i=$('input',f),m=$('.msg',f);
 if(!i.checkValidity()){m.textContent='Enter a valid email address.';m.style.color='#ff9b94';i.focus();return}
 m.style.color='';m.textContent='Subscribed. Check your inbox to confirm.';f.reset()}));
// services tabs
const tabs=$$('.tab');if($('.detail')){const show=id=>{tabs.forEach(t=>t.setAttribute('aria-selected',t.dataset.t===id));$$('.detail').forEach(d=>d.classList.toggle('on',d.id===id))};
 tabs.forEach(t=>t.addEventListener('click',()=>{show(t.dataset.t);history.replaceState(null,'','#'+t.dataset.t)}));
 const h=location.hash.slice(1);show(tabs.some(t=>t.dataset.t===h)?h:tabs[0].dataset.t);}
// enquiry form
const form=$('#enquiry');if(form){
 const serviceContent={
  managed:{name:'Managed IT Services',title:'Tell us about your Managed IT needs',copy:'Tell us what needs attention and we will help you plan the next step.',label:'What would you like help with?',needLabel:'Tell us about your Managed IT requirements',placeholder:'For example: the number of users, devices, current support challenges, or the help you need.',options:['Day-to-day IT support','Device and user management','Network or Wi-Fi support','Ongoing IT management']},
  cyber:{name:'Cybersecurity',title:'Strengthen your cyber security',copy:'Share what you want to protect, assess, or improve and our specialists will guide you.',label:'What security support do you need?',needLabel:'Tell us about your security priorities',placeholder:'For example: your current risks, a recent incident, compliance needs, or the systems you need to protect.',options:['Security assessment','Email and phishing protection','Endpoint and device security','Backup, recovery or compliance']},
  cloud:{name:'Cloud Solutions',title:'Plan your cloud solution',copy:'Tell us how your team works today and where you want cloud technology to take you.',label:'What cloud project are you planning?',needLabel:'Tell us about your cloud goals',placeholder:'For example: the tools you use, users to support, data to move, or the outcome you want.',options:['Microsoft 365 or Google Workspace','Cloud migration','Secure remote working','Cloud backup and storage']},
  consult:{name:'IT Consulting',title:'Talk through your technology plans',copy:'Bring us your challenge, project, or growth plan and we will help you make a clear decision.',label:'What would you like to discuss?',needLabel:'Tell us about your technology project',placeholder:'For example: your business goal, the project scope, current challenges, and your expected timeline.',options:['IT strategy and planning','Technology project advice','Systems review','Budget and roadmap planning']}
 };
 const focus=$('#service-focus',form),title=$('#service-form-title',form),kicker=$('#service-kicker',form),copy=$('#service-form-copy',form),needLabel=$('#need-label',form),need=$('#need',form),focusLabel=$('#service-focus-label',form);
 let svc='managed';
 const setService=id=>{const item=serviceContent[id]||serviceContent.managed;svc=id;$$('.tab').forEach(t=>t.setAttribute('aria-selected',t.dataset.t===id));kicker.textContent=item.name;title.textContent=item.title;copy.textContent=item.copy;focusLabel.textContent=item.label;needLabel.textContent=item.needLabel;need.placeholder=item.placeholder;focus.innerHTML='<option value="" selected disabled>Select an option</option>'+item.options.map(option=>'<option>'+option+'</option>').join('');form.classList.remove('service-changing');void form.offsetWidth;form.classList.add('service-changing');history.replaceState(null,'','#'+id)};
 $$('.tab').forEach(t=>t.addEventListener('click',()=>setService(t.dataset.t)));
 const requested=new URLSearchParams(location.search).get('service'),hashed=location.hash.slice(1),selected=[requested,hashed].find(id=>serviceContent[id]);setService(selected||'managed');
 const rules={name:v=>v.trim().length>1,email:v=>/^\S+@\S+\.\S+$/.test(v),company:v=>v.trim().length>1,focus:v=>v.trim().length>0,need:v=>v.trim().length>9};
 $$('input,textarea,select',form).forEach(i=>i.addEventListener('input',()=>i.closest('.field').classList.remove('bad')));
 form.addEventListener('submit',e=>{e.preventDefault();let first;
  Object.keys(rules).forEach(k=>{const i=form.elements[k],ok=rules[k](i.value);i.closest('.field').classList.toggle('bad',!ok);if(!ok&&!first)first=i});
  if(first){first.focus();return}
  const b=$('button[type=submit]',form);b.disabled=true;b.innerHTML='<span class="spin"></span> Sending';
  const no='NX-'+new Date().getFullYear()+'-'+String(Math.floor(Math.random()*9000)+1000);
  sessionStorage.setItem('stackly_enquiry',JSON.stringify({no,svc:serviceContent[svc].name,name:form.elements.name.value.trim().split(' ')[0]}));
  setTimeout(()=>{wipe.className='wipe in';setTimeout(()=>location.href='enquiry-confirmation.html',480)},900)})}
// sign-up form
const signup=$('#signup');if(signup){signup.addEventListener('submit',e=>{e.preventDefault();if(!signup.checkValidity()){signup.reportValidity();return}const b=$('button',signup),m=$('.signup-message',signup);b.disabled=true;b.textContent='Account created';m.textContent='Thanks! Your account request is ready and our team will be in touch shortly.';m.style.color='var(--mint-d)'})}
// confirmation
const tn=$('#ticket-no');if(tn){let d={};try{d=JSON.parse(sessionStorage.getItem('stackly_enquiry'))||{}}catch(e){}
 tn.textContent=d.no||'NX-'+new Date().getFullYear()+'-0187';if(d.svc)$('#chip').textContent=d.svc;else $('#chip').hidden=true;
 if(d.name)$('#who').textContent='Thanks, '+d.name+'. ';
 $('.copy').addEventListener('click',e=>{navigator.clipboard&&navigator.clipboard.writeText(tn.textContent);e.currentTarget.textContent='Copied';setTimeout(()=>e.target.textContent='Copy',1800)});
 const c=$('.confetti');['#7df0b0','#11171c','#b07a7d','#3fcf8a','#0c2a26'].forEach((col,k)=>{for(let i=0;i<5;i++){const a=(k*5+i)/25*Math.PI*2,r=90+Math.random()*80,s=document.createElement('i');s.style.cssText=`--c:${col};--x:${Math.cos(a)*r}px;--y:${Math.sin(a)*r}px`;c.append(s)}})}
})();
