// EDIT ME: confirm these before launch. Set endpoint to a form/sheet URL to receive sign-ups.
const EVENT={date:'2026-11-14T10:00:00+05:30',confirmed:false,venue:'IIIT Bhopal campus (venue to be confirmed)',endpoint:''};
const $=s=>document.querySelector(s);
const CREW=[['Red','#F45858'],['Yellow','#FFD166'],['Green','#8DD982'],['Cyan','#67C9F5'],['Purple','#B8A5F5'],['Pink','#F59BC4']];
const cm=c=>`<svg style="color:${c}"><use href="#cm"/></svg>`;
const esc=s=>s.replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const D=new Date(EVENT.date),RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
$('#when').textContent=D.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+(EVENT.confirmed?'':' (tentative)');
$('#where').textContent=EVENT.venue;

const cd=$('#cd');
function tick(){const t=D-Date.now();if(t<=0){cd.innerHTML='<p class="sg">The ship has launched.</p>';return}
const v=[['days',864e5,1e4],['hours',36e5,24],['mins',6e4,60],['secs',1e3,60]];
cd.innerHTML=v.map(([n,m,k])=>`<div><b>${String(Math.floor(t/m)%k).padStart(2,'0')}</b><small>${n}</small></div>`).join('')}
tick();setInterval(tick,1000);

const cv=$('#stars'),x=cv.getContext('2d');let S=[];
function size(){cv.width=innerWidth;cv.height=innerHeight;S=Array.from({length:Math.round(innerWidth/9)},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.6+.3,v:Math.random()*.25+.05}))}
function draw(){x.clearRect(0,0,cv.width,cv.height);x.fillStyle='#fff';for(const s of S){if(!RM){s.x-=s.v;if(s.x<0)s.x=cv.width}x.globalAlpha=.4+s.r/3;x.beginPath();x.arc(s.x,s.y,s.r,0,7);x.fill()}if(!RM)requestAnimationFrame(draw)}
addEventListener('resize',()=>{size();if(RM)draw()});size();draw();

const ROLES=[['Crewmate','#8DD982','Finish your tasks and watch everyone.'],['Crewmate','#67C9F5','Stick with a buddy. Alibis matter.'],['Impostor','#F45858','Stay calm. Act natural. Sabotage.']];
$('#roleBtn').onclick=()=>{const [n,c,t]=ROLES[Math.floor(Math.random()*3)],f=$('#roleFace');f.classList.remove('pop');void f.offsetWidth;f.innerHTML=`${cm(c)}<h3 style="color:${c}">${n}</h3><p>${t}</p>`;f.classList.add('pop')};

const mt=$('#meet'),mb=$('#mb');
function meet(){mt.hidden=false;mb.innerHTML=`<h2>Emergency meeting</h2><p>Someone is acting sus. Who gets ejected?</p><div class="sus">${CREW.map(([n,c],i)=>`<button data-i="${i}">${cm(c)}${n}</button>`).join('')}</div><button class="btn ghost" data-close>Skip vote</button>`;document.body.classList.add('flash');setTimeout(()=>document.body.classList.remove('flash'),900);mb.querySelector('button').focus()}
$('#emBtn').onclick=meet;
mt.onclick=e=>{const b=e.target.closest('button');if(e.target===mt||(b&&'close'in b.dataset)){mt.hidden=true;return}
if(b&&b.dataset.i){const [n,c]=CREW[b.dataset.i],imp=Math.random()<.4;mb.innerHTML=`<div class="eject">${cm(c)}</div><h2>${n} ${imp?'was':'was not'} the impostor.</h2><p>${imp?'Good call. The crew breathes easier.':'Wrong call. The impostor is still among you.'}</p><button class="btn" data-close>Back to the ship</button>`}};
addEventListener('keydown',e=>{if(e.key==='Escape')mt.hidden=true});

const sw=$('#sw');
sw.innerHTML=CREW.map(([n,c],i)=>`<label title="${n}"><input type="radio" name="suit" value="${n}" ${i?'':'required'}>${cm(c)}</label>`).join('');
sw.onchange=e=>{$('#bigCm').style.color=CREW.find(a=>a[0]===e.target.value)[1]};
if(!EVENT.endpoint)$('#note').textContent='Preview mode: connect a sign-up endpoint in js/script.js before launch. Sign-ups are only kept in this browser.';
$('#f').onsubmit=async e=>{e.preventDefault();const f=e.target,d=Object.fromEntries(new FormData(f)),err=$('#err');err.textContent='';
d.id='SK-'+Math.floor(1000+Math.random()*9000);
try{if(EVENT.endpoint){const r=await fetch(EVENT.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});if(!r.ok)throw 0}
else{const a=JSON.parse(localStorage.getItem('spark-crew')||'[]');a.push(d);localStorage.setItem('spark-crew',JSON.stringify(a))}}
catch(_){err.textContent='Transmission failed. Check your connection and try again.';return}
f.outerHTML=`<div class="ticket">${cm(CREW.find(a=>a[0]===d.suit)[1])}<h3>You're on the crew, ${esc(d.name)}.</h3><p>Suit: ${d.suit}. Crew ID: <b>${d.id}</b>. Screenshot this and bring it to check-in.</p></div>`};
