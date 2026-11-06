const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const root=document.documentElement,body=document.body;

/* ---------- Theme: light / default (follows system) / dark ---------- */
const mq=matchMedia('(prefers-color-scheme: light)');
function applyTheme(t){
  let saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
  t=t||saved||'default';
  root.dataset.theme=t;
  root.dataset.mode=t==='default'?(mq.matches?'light':'dark'):t;
  $$('.theme button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
}
$$('.theme button').forEach(b=>b.onclick=()=>{try{localStorage.setItem('theme',b.dataset.t)}catch(e){}applyTheme(b.dataset.t)});
mq.addEventListener('change',()=>applyTheme());applyTheme();

/* ---------- Opening animation ---------- */
const cnt=$('#count');let n=0;
const tick=setInterval(()=>{n+=Math.ceil(Math.random()*9);if(n>=100){n=100;clearInterval(tick);setTimeout(()=>{body.classList.remove('loading');body.classList.add('go')},300)}cnt.textContent=String(n).padStart(2,'0')},70);

/* ---------- Nav ---------- */
$('#burger').onclick=()=>$('#links').classList.toggle('open');
$$('#links a').forEach(a=>a.onclick=()=>$('#links').classList.remove('open'));

/* ---------- Cursor, magnetic buttons, tilt ---------- */
const cur=$('#cursor');
addEventListener('mousemove',e=>{cur.style.opacity=1;cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px'});
$$('a,button,figure,.tilt').forEach(el=>{el.addEventListener('mouseenter',()=>cur.classList.add('big'));el.addEventListener('mouseleave',()=>cur.classList.remove('big'))});
$$('.mag').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`});b.addEventListener('mouseleave',()=>b.style.transform='')});
$$('.tilt').forEach(t=>{t.style.transition='transform .2s';t.addEventListener('mousemove',e=>{const r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;t.style.transform=`perspective(800px) rotateY(${x*10}deg) rotateX(${-y*10}deg)`});t.addEventListener('mouseleave',()=>t.style.transform='')});

/* ---------- Scroll reveal + hero parallax + ghost titles ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));
const cut=$('.cut'),big=$('.big'),ghosts=$$('.ghost');
addEventListener('scroll',()=>{
  const y=scrollY;
  if(y<innerHeight*1.2){big.style.transform=`translateY(${y*.25}px)`}
  ghosts.forEach(g=>{const r=g.parentElement.getBoundingClientRect();g.style.transform=`translateY(${r.top*-.12}px)`});
},{passive:true});

/* ---------- Tools: iPhone-camera style ---------- */
const T={
 'Media Editing':[['Canva','canva'],['CapCut','capcut'],['Lightroom','lightroom'],['IbisPaint','ibis']],
 'Communication':[['Teams','teams'],['WhatsApp','whatsapp'],['Slack','slack'],['Telegram','telegram']],
 'Google Workspace':[['Gmail','gmail'],['Calendar','gcal'],['Drive','gdrive'],['Docs','gdocs'],['Meet','gmeet']],
 'Microsoft Suite':[['Outlook','outlook'],['OneDrive','onedrive'],['Word','word'],['Excel','excel'],['PowerPoint','ppt'],['OneNote','onenote'],['SharePoint','sharepoint'],['Teams','teams2'],['Yammer','yammer']],
 'AI Tools':[['ChatGPT','chatgpt'],['Gemini','gemini'],['Claude AI','claude'],['Copilot','copilot'],['Grammarly','grammarly']],
 'Productivity':[['Notion','notion'],['GoHighLevel','ghl'],['Trello','trello']],
 'CRM Tools':[['Salesforce','salesforce'],['HubSpot','hubspot'],['Astra','astra']]
};
const modes=$('#modes'),lenses=$('#lenses'),focus=$('#focus');
const zoomButton=$('#zoom');let currentZoom=1;
function setZoom(value){
  currentZoom=Math.min(3,Math.max(1,value));
  focus.style.setProperty('--tool-zoom',currentZoom);
  const label=`${Number.isInteger(currentZoom)?currentZoom:currentZoom.toFixed(1)}×`;
  zoomButton.textContent=label;zoomButton.setAttribute('aria-label',`Zoom: ${currentZoom} times`);
  zoomButton.title=currentZoom>=3?'Click to reset zoom':'Click to zoom in';
}
zoomButton.onclick=()=>setZoom(currentZoom>=3?1:currentZoom+.5);
const toolLogo=$('#fImg');
function zoomLogo(){setZoom(currentZoom>=3?1:currentZoom+.5)}
toolLogo.onclick=zoomLogo;
toolLogo.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();zoomLogo()}};
function show(cat,i){
  const [name,img]=T[cat][i];
  $('#fImg').src=`img/${img}.png`;$('#fImg').alt=name;$('#fName').textContent=name;$('#fCat').textContent=cat;
  focus.classList.remove('pop');void focus.offsetWidth;focus.classList.add('pop');
  setZoom(Math.min(3,1+i*.5));
  $$('button',lenses).forEach((b,j)=>b.classList.toggle('on',j===i));
}
function mode(cat){
  $$('button',modes).forEach(b=>b.classList.toggle('on',b.textContent===cat));
  lenses.innerHTML='';
  T[cat].forEach(([nm,img],i)=>{const b=document.createElement('button');b.title=nm;b.style.animationDelay=i*.05+'s';b.innerHTML=`<img src="img/${img}.png" alt="${nm}">`;b.onclick=()=>{show(cat,i);b.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'})};lenses.append(b)});
  show(cat,0);
}
Object.keys(T).forEach(c=>{const b=document.createElement('button');b.textContent=c;b.onclick=()=>mode(c);modes.append(b)});
mode('Media Editing');

/* ---------- Gallery filter + lightbox ---------- */
$$('#filters button').forEach(b=>b.onclick=()=>{
  $$('#filters button').forEach(x=>x.classList.toggle('on',x===b));
  $$('#gallery figure').forEach(f=>f.classList.toggle('hide',b.dataset.f!=='all'&&f.dataset.c!==b.dataset.f));
});
const lb=$('#lb');
$$('#gallery img,.rail img').forEach(i=>i.onclick=()=>{$('img',lb).src=i.src;lb.classList.add('on')});
lb.onclick=()=>lb.classList.remove('on');addEventListener('keydown',e=>e.key==='Escape'&&lb.classList.remove('on'));
