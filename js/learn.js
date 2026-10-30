/* ============ navigasi ============ */
let L=null,G=null;
function show(id){
  TTS.stop();if(L){L.auto=false;L.tok++;}if(G)G.tok++;rnd=Math.random;
  onScreen(id);hideFb();['endov','gridov','parentov','practov','voiceov','profov'].forEach(o=>$('#'+o).classList.remove('on'));
  if(id==='belajar')buildLearnCards();if(id==='bermain')buildGameCards();if(id==='stiker')buildStickers();if(id==='belhitung')buildMathLearnCards();if(id==='mainhitung')buildMathGameCards();if(id==='belsains')buildSciLearnCards();if(id==='mainsains')buildSciGameCards();if(id==='sciGroup')buildGroupCards();if(id==='beleksp')buildExpCards();if(id==='jagadiri')buildJdCards();if(id==='sikecil')buildKecilCards();if(id==='belen'){buildEnLearnCards();$('#enNote').hidden=!TTS.ok||!!TTS.voiceEn;}if(id==='mainen')buildEnGameCards();if(id==='cerita')buildTales();if(id==='home')updateDaily();
  updateStars();}
document.querySelectorAll('.back').forEach(b=>b.innerHTML=IC.back);document.querySelectorAll('.gear').forEach(b=>b.innerHTML=IC.gear);
// any [data-go] button opens that screen; data-say speaks its name (home and the Belajar / Main hubs)
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){sfx.tap();show(b.dataset.go);if(b.dataset.say)TTS.say([b.dataset.say]);}});
$('#goStk').onclick=()=>{sfx.tap();show('stiker');TTS.say(['Stiker']);};
const levelStars=id=>store.get('lv:'+id,[]);
const gameStars=id=>levelStars(id).reduce((a,b)=>a+(b||0),0);
const totalStars=()=>ALLGAMES.reduce((t,g)=>t+gameStars(g.id),0);
const starBadge=g=>{const s=gameStars(g.id);return s?`<span class="badge">⭐ ${s}/${maxLevel()*3}</span>`:'';};
function updateStars(){const t='⭐ '+totalStars();document.querySelectorAll('.js-stars').forEach(e=>e.textContent=t);}
function buildCards(el,list,onPick,extra){el.innerHTML='';
  list.forEach((m,i)=>{const [c,d]=PAL[m.c];const b=h('button','card');b.style.setProperty('--c',c);b.style.setProperty('--d',d);
    b.innerHTML=`<div class="art">${m.art}</div><div class="lbl">${m.title}</div>${extra?extra(m,i):''}`;b.onclick=()=>{sfx.tap();onPick(m);};el.append(b);});}
// [items seen, items total] of a learn card; a group card adds up its smaller cards
const stageProg=m=>m.sub?m.sub.map(stageProg).reduce((a,b)=>[a[0]+b[0],a[1]+b[1]],[0,0]):(n=>[Math.min(n,store.get('lp:'+m.id,0)),n])(m.items().length);
let GRP=null;
function openGroup(g){GRP=g;show('sciGroup');TTS.say([g.say||g.title]);}
function buildGroupCards(){if(!GRP)return show('belsains');$('#grpTitle').textContent=GRP.title;$('#sciGroup .back').dataset.go=GRP.home;buildLearnCards($('#grpCards'),GRP.sub);}
function buildLearnCards(el=$('#learnCards'),list=STAGES){const pl=store.get('place',null);buildCards(el,list,m=>m.sub?openGroup(m):openStage(m),(m,i)=>{const [got,tot]=stageProg(m);
  // the card suggested by Tes Awal
  return `<span class="num">${i+1}</span>`+(pl&&(pl.read===m.id||pl.math===m.id)?'<span class="start">Mulai di sini</span>':'')+(got>=tot?'<span class="badge">✓</span>':got>0?`<span class="badge">${got}/${tot}</span>`:'');});
  const sg=el.querySelector('.start');if(sg)sg.closest('.card').scrollIntoView({block:'center'});}
function buildStickers(page){
  const s=totalStars(),n=stkCount(s);$('#stkcount').textContent=`${n}/${STICKERS.length}`;
  const prev=n?stkNeed(n):0,nxt=n<STICKERS.length?stkNeed(n+1):prev;$('#stkbar').style.width=(n>=STICKERS.length?100:Math.round((s-prev)/(nxt-prev)*100))+'%';
  $('#stknext').textContent=n<STICKERS.length?`${nxt-s}⭐ lagi`:'Lengkap!';
  // albums of 50; the album with the next sticker to earn opens first
  const per=50,pages=Math.ceil(STICKERS.length/per),tabs=$('#stktabs');if(page==null)page=Math.min(pages-1,Math.floor(n/per));tabs.innerHTML='';
  for(let p=0;p<pages;p++){const t=h('button',p===page?'on':'',ico(STICKERS[p*per])+' '+(p+1)),got=Math.max(0,Math.min(per,n-p*per));if(got)t.append(h('small','',got===per?'✓':String(got)));
    t.onclick=()=>{sfx.tap();buildStickers(p);};tabs.append(t);}
  const g=$('#stkgrid');g.innerHTML='';g.scrollTop=0;
  STICKERS.forEach((e,i)=>{if(i<page*per||i>=(page+1)*per)return;const b=h('button','stk'+(i<n?'':' locked'),i<n?ico(e):'?');b.onclick=()=>{if(i<n){b.classList.remove('wiggle');void b.offsetWidth;b.classList.add('wiggle');sfx.ok();}else{sfx.no();TTS.say(['Kumpulkan bintang untuk membuka stiker ini']);}};g.append(b);});}

/* ============ belajar ============ */
$('#lprev').innerHTML=IC.back;$('#lnext').innerHTML=IC.next;$('#lgrid').innerHTML=IC.grid;$('#lsay').innerHTML=IC.spk;
function openStage(stage){const items=stage.items();
  L={stage,items,i:Math.min(store.get('li:'+stage.id,0),items.length-1),auto:false,tok:0,hl:[]};
  onScreen('learn');$('#learn .back').dataset.go=stage.home||'belajar';$('#lauto').hidden=!SET.extra;$('#lauto').classList.remove('on');langBtn();
  renderLearn(false);TTS.say([stage.say||stage.title],{onEnd:()=>sayItem()});}
function renderItem(it,c){c.innerHTML='';if(it.render)return it.render(c);const hl=[];
  const addPic=(e,small)=>{if(e)c.append(h('div',small?'pic sm':'pic',ico(e)));};
  const exChip=ex=>h('div','ex',`<span>${ico(ex[1])}</span><span>${caseWord(ex[0])}</span>`);
  if(it.k==='letter'){const col=COL[L.i%6];const r=h('div','lettercard');
    r.innerHTML=`<div class="t" style="color:${col}">${it.up}</div><div class="colon"><i></i><i></i></div><div class="t" style="color:${col}">${it.low}</div>`;c.append(r,exChip(it.ex));}
  else if(it.k==='big'){const t=h('div','bigtxt');
    if(it.multi)[...it.text].forEach((ch,i)=>{const s=h('span','',caseUnit(ch));s.style.color=COL[i%6];t.append(s);});else{t.textContent=caseUnit(it.text);t.style.color=it.color||COL[0];}
    c.append(t);hl.push(t);if(it.ex)c.append(exChip(it.ex));}
  else if(it.k==='syl'){addPic(it.e,true);const s=h('div','syls'+(it.s.length>=4||it.w.length>=9?' long':''));
    it.s.forEach((x,i)=>{const sp=h('span','',casePart(x,i));sp.style.color=COL[i%6];s.append(sp);hl.push(sp);});c.append(s);}
  else if(it.k==='pic'){if(it.hex){const sw=h('div','swatch');sw.style.background=it.hex;c.append(sw);}else addPic(it.e);
    const s=h('div','syls tight'+(it.w.length>=9?' long':''));let n=0;
    it.s.forEach(x=>{if(x==='_'){s.append(h('span','gap'));return;}const sp=h('span','',casePart(x,n));sp.style.color=n%2?'#7CC62A':'#F2703A';n++;s.append(sp);hl.push(sp);});c.append(s);}
  return hl;}
// every page is one card: the arrows sit next to the speaker and the card can also be swiped
function renderLearn(speak,dir){TTS.stop();const it=L.items[L.i],c=$('#lcontent');L.hl=renderItem(it,c);
  c.classList.remove('slin','slinb','back');c.style.transform='';if(dir){void c.offsetWidth;c.classList.add(dir>0?'slin':'slinb');}
  const n=L.items.length;$('#progbar').style.width=((L.i+1)/n*100)+'%';$('#progtxt').textContent=(L.i+1)+'/'+n;$('#lprev').disabled=L.i===0;
  store.set('li:'+L.stage.id,L.i);if(L.i+1>store.get('lp:'+L.stage.id,0))store.set('lp:'+L.stage.id,L.i+1);
  const nx=L.items[L.i+1];if(nx)preloadEmo(nx.e,nx.ex&&nx.ex[1]);
  if(typeof updateRecBtn==='function')updateRecBtn();
  if(speak)sayItem();}
function sayItem(after){const it=L.items[L.i],hl=L.hl;
  if(it.karaoke)return sayKaraoke(it,hl,after);
  TTS.say(it.say,{rate:it.k==='letter'?.8:.72,
    onPart:i=>{hl.forEach(x=>x.classList.remove('hi'));if(i<hl.length&&it.say.length>1&&it.k!=='big'){hl[i].classList.add('hi');if(it.k==='exp')hl[i].scrollIntoView({block:'nearest',behavior:'smooth'});}else hl.forEach(x=>x.classList.add('hi'));},
    onEnd:()=>{hl.forEach(x=>x.classList.remove('hi'));after&&after();}});}
// story pages: the word being read lights up; voices without word boundaries are followed by an estimate from the text length
function sayKaraoke(it,words,after){let got=false,timer=null,tok0;const s0=it.say[0],rate=.72*(SET.slow?.82:1);
  const mark=ci=>words.forEach(w=>w.classList.toggle('hi',+w.dataset.s<=ci&&ci<+w.dataset.e+1));
  TTS.say([s0],{rate:.72,onPart:()=>{const t0=Date.now(),msc=72/rate;tok0=TTS.token;clearInterval(timer);timer=setInterval(()=>{if(got||TTS.token!==tok0)return clearInterval(timer);mark((Date.now()-t0)/msc);},100);},
    onBound:(i,ci)=>{got=true;mark(ci);},onEnd:()=>{clearInterval(timer);words.forEach(w=>w.classList.remove('hi'));after&&after();}});}
function go(i){const n=L.items.length;
  if(i<0)return;
  if(i>=n){if(L.auto){L.i=0;renderLearn(false);autoStep();return;}L.auto=false;sfx.win();confetti();if(L.stage.play.length)openPractice(L.stage,true);else show(L.stage.home);return;}
  const dir=i>L.i?1:-1;L.i=i;if(L.auto){renderLearn(false,dir);autoStep();}else renderLearn(true,dir);}
function autoStep(){const tok=++L.tok;sayItem(()=>{if(!L.auto||tok!==L.tok)return;setTimeout(()=>{if(!L.auto||tok!==L.tok)return;go(L.i+1);},1400);});}
$('#lprev').onclick=()=>{sfx.tap();go(L.i-1);};
$('#lnext').onclick=()=>{sfx.tap();go(L.i+1);};
$('#lsay').onclick=()=>{L.tok++;if(L.auto)autoStep();else sayItem();};
$('#lcontent').onclick=()=>{if(swiped){swiped=false;return;}L.tok++;if(L.auto)autoStep();else sayItem();};
// bilingual stories: switch Indonesian / English on the page being read
function langBtn(){const b=$('#llang');b.hidden=!L.stage.bi;const en=SET.slang==='en';b.innerHTML=`<span class="${en?'':'on'}">ID</span><span class="${en?'on':''}">EN</span>`;}
$('#llang').onclick=()=>{sfx.tap();SET.slang=SET.slang==='en'?'id':'en';saveSet();L.tok++;L.items=L.stage.items();L.i=Math.min(L.i,L.items.length-1);langBtn();renderLearn(true);};
$('#lauto').onclick=()=>{L.auto=!L.auto;$('#lauto').classList.toggle('on',L.auto);L.tok++;if(L.auto)autoStep();else TTS.stop();};
$('#lgrid').onclick=()=>{sfx.tap();TTS.stop();L.tok++;const box=$('#gridbox');box.innerHTML='';
  L.items.forEach((it,i)=>{const b=h('button',i===L.i?'cur':'',it.label);b.onclick=()=>{sfx.tap();$('#gridov').classList.remove('on');go(i);};box.append(b);});
  $('#gridov').classList.add('on');const cur=box.querySelector('.cur');if(cur)cur.scrollIntoView({block:'center'});};
$('#gridx').onclick=()=>$('#gridov').classList.remove('on');
// swipe (touch) or drag (mouse) sideways to change card; a mostly vertical move is a scroll, not a swipe
// the card follows the finger; a short drag or a quick flick is enough, then the card flies out to that side,
// otherwise it springs back
let swX=null,swY=0,swT=0,swiped=false,swBusy=false;
const swCard=()=>$('#lcontent');
const swStart=(x,y)=>{if(swBusy)return;swX=x;swY=y;swT=Date.now();swiped=false;swCard().classList.remove('back');};
const swMove=(x,y)=>{if(swX==null)return;const dx=x-swX,dy=y-swY;
  if(Math.abs(dx)>Math.abs(dy))swCard().style.transform=`translateX(${dx}px) rotate(${dx/40}deg)`;};
const swEnd=(x,y,e)=>{if(swX==null)return;const dx=x-swX,dy=y-swY,c=swCard(),fast=Math.abs(dx)/Math.max(1,Date.now()-swT)>.35;swX=null;
  c.classList.add('back');
  if((Math.abs(dx)>40||(fast&&Math.abs(dx)>20))&&Math.abs(dx)>Math.abs(dy)){swiped=true;e.preventDefault();
    const d=dx<0?1:-1,to=L.i+d;if(to<0){c.style.transform='';return;}
    swBusy=true;c.style.transform=`translateX(${-d*120}%) rotate(${-d*8}deg)`;setTimeout(()=>{swBusy=false;go(to);},160);}
  else c.style.transform='';};
$('#lcontent').addEventListener('touchstart',e=>swStart(e.touches[0].clientX,e.touches[0].clientY),{passive:true});
$('#lcontent').addEventListener('touchmove',e=>swMove(e.touches[0].clientX,e.touches[0].clientY),{passive:true});
$('#lcontent').addEventListener('touchend',e=>swEnd(e.changedTouches[0].clientX,e.changedTouches[0].clientY,e));
$('#lcontent').addEventListener('mousedown',e=>swStart(e.clientX,e.clientY));
$('#lcontent').addEventListener('mousemove',e=>swMove(e.clientX,e.clientY));
$('#lcontent').addEventListener('mouseup',e=>swEnd(e.clientX,e.clientY,e));
$('#lcontent').addEventListener('mouseleave',e=>swEnd(e.clientX,e.clientY,e));

/* --- hubungan Belajar → Bermain --- */
function openPractice(stage,finished){
  const msg=finished?'Tahap selesai! Ayo latihan!':'Ayo latihan!';$('#practmsg').textContent=(finished?'🎉 ':'🎮 ')+msg;
  const row=$('#practrow');row.innerHTML='';
  stage.play.forEach(([gid,lv])=>{const g=ALLGAMES.find(x=>x.id===gid);const [c,d]=PAL[g.c];
    const b=h('button','eb wide',`<b>${ico('🎮')}</b>${g.title}<span>Level ${lv}</span>`);b.style.setProperty('--c',c);b.style.setProperty('--d',d);
    b.onclick=()=>{sfx.tap();$('#practov').classList.remove('on');TTS.stop();G={g,tok:nextTok()};$('#lvtitle').textContent=g.title;startLevel(lv);};row.append(b);});
  $('#practov').classList.add('on');TTS.say([msg]);}
$('#practx').onclick=()=>{$('#practov').classList.remove('on');};

