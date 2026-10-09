/* ============ navigasi ============ */
let L=null,G=null;
function show(id){
  TTS.stop();if(L){L.auto=false;L.tok++;}if(G)G.tok++;rnd=Math.random;
  onScreen(id);['endov','gridov','parentov','practov'].forEach(o=>$('#'+o).classList.remove('on'));
  if(id==='belajar')buildLearnCards();if(id==='bermain')buildGameCards();if(id==='stiker')buildStickers();
  updateStars();}
document.querySelectorAll('.back').forEach(b=>b.innerHTML=IC.back);
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){sfx.tap();show(b.dataset.go);}});
$('#goLearn').onclick=()=>{sfx.tap();show('belajar');TTS.say(['Belajar']);};
$('#goPlay').onclick=()=>{sfx.tap();show('bermain');TTS.say(['Bermain']);};
$('#goStk').onclick=()=>{sfx.tap();show('stiker');TTS.say(['Stiker']);};
const levelStars=id=>store.get('lv:'+id,[]);
const gameStars=id=>levelStars(id).reduce((a,b)=>a+(b||0),0);
const totalStars=()=>GAMES.reduce((t,g)=>t+gameStars(g.id),0);
function updateStars(){const t='⭐ '+totalStars();document.querySelectorAll('.js-stars').forEach(e=>e.textContent=t);}
function buildCards(el,list,onPick,extra){el.innerHTML='';
  list.forEach((m,i)=>{const [c,d]=PAL[m.c];const b=h('button','card'+(m.kamus?' kamus':''));b.style.setProperty('--c',c);b.style.setProperty('--d',d);
    b.innerHTML=`<div class="art">${m.art}</div><div class="lbl">${m.title}</div>${extra?extra(m,i):''}`;b.onclick=()=>{sfx.tap();onPick(m);};el.append(b);});}
function buildLearnCards(){buildCards($('#learnCards'),STAGES,openStage,(m,i)=>{const tot=m.items().length,got=Math.min(tot,store.get('lp:'+m.id,0));
  return (m.kamus?`<span class="num">${ico('📖')}</span>`:`<span class="num">${i+1}</span>`)+(got>=tot?'<span class="badge">✓</span>':got>0?`<span class="badge">${got}/${tot}</span>`:'');});}
function buildStickers(){
  const s=totalStars(),n=stkCount(s);$('#stkcount').textContent=`${n}/${STICKERS.length}`;
  const prev=n?stkNeed(n):0,nxt=n<STICKERS.length?stkNeed(n+1):prev;$('#stkbar').style.width=(n>=STICKERS.length?100:Math.round((s-prev)/(nxt-prev)*100))+'%';
  $('#stknext').textContent=n<STICKERS.length?`${nxt-s}⭐ lagi`:'Lengkap!';
  const g=$('#stkgrid');g.innerHTML='';
  STICKERS.forEach((e,i)=>{const b=h('button','stk'+(i<n?'':' locked'),i<n?ico(e):'?');b.onclick=()=>{if(i<n){b.classList.remove('wiggle');void b.offsetWidth;b.classList.add('wiggle');sfx.ok();}else{sfx.no();TTS.say(['Kumpulkan bintang untuk membuka stiker ini']);}};g.append(b);});}

/* ============ belajar ============ */
$('#lprev').innerHTML=IC.back;$('#lnext').innerHTML=IC.next;$('#lgrid').innerHTML=IC.grid;$('#lsay').innerHTML=IC.spk;
function openStage(stage){const items=stage.items();
  L={stage,items,i:Math.min(store.get('li:'+stage.id,0),items.length-1),auto:false,tok:0,hl:[]};
  onScreen('learn');$('#lauto').hidden=!SET.extra;$('#lauto').classList.remove('on');
  renderLearn(false);TTS.say([stage.title],{onEnd:()=>sayItem()});}
function renderItem(it,c){c.innerHTML='';const hl=[];
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
    it.s.forEach(x=>{if(x==='_'){s.append(h('span','gap'));return;}const sp=h('span','',casePart(x,n));sp.style.color=n%2?'#7CC62A':'#FF9A62';n++;s.append(sp);hl.push(sp);});c.append(s);}
  return hl;}
function renderLearn(speak){TTS.stop();const it=L.items[L.i];L.hl=renderItem(it,$('#lcontent'));
  const n=L.items.length;$('#progbar').style.width=((L.i+1)/n*100)+'%';$('#progtxt').textContent=(L.i+1)+'/'+n;$('#lprev').disabled=L.i===0;
  store.set('li:'+L.stage.id,L.i);if(L.i+1>store.get('lp:'+L.stage.id,0))store.set('lp:'+L.stage.id,L.i+1);
  if(speak)sayItem();}
function sayItem(after){const it=L.items[L.i],hl=L.hl;
  TTS.say(it.say,{rate:it.k==='letter'?.8:.72,
    onPart:i=>{hl.forEach(x=>x.classList.remove('hi'));if(i<hl.length&&it.say.length>1&&it.k!=='big')hl[i].classList.add('hi');else hl.forEach(x=>x.classList.add('hi'));},
    onEnd:()=>{hl.forEach(x=>x.classList.remove('hi'));after&&after();}});}
function go(i){const n=L.items.length;
  if(i<0)return;
  if(i>=n){if(L.auto){L.i=0;renderLearn(false);autoStep();return;}L.auto=false;sfx.win();confetti();openPractice(L.stage,true);return;}
  L.i=i;if(L.auto){renderLearn(false);autoStep();}else renderLearn(true);}
function autoStep(){const tok=++L.tok;sayItem(()=>{if(!L.auto||tok!==L.tok)return;setTimeout(()=>{if(!L.auto||tok!==L.tok)return;go(L.i+1);},1400);});}
$('#lprev').onclick=()=>{sfx.tap();go(L.i-1);};
$('#lnext').onclick=()=>{sfx.tap();go(L.i+1);};
$('#lsay').onclick=()=>{L.tok++;if(L.auto)autoStep();else sayItem();};
$('#lcontent').onclick=()=>{L.tok++;if(L.auto)autoStep();else sayItem();};
$('#lauto').onclick=()=>{L.auto=!L.auto;$('#lauto').classList.toggle('on',L.auto);L.tok++;if(L.auto)autoStep();else TTS.stop();};
$('#lgrid').onclick=()=>{sfx.tap();TTS.stop();L.tok++;const box=$('#gridbox');box.innerHTML='';
  L.items.forEach((it,i)=>{const b=h('button',i===L.i?'cur':'',it.label);b.onclick=()=>{sfx.tap();$('#gridov').classList.remove('on');go(i);};box.append(b);});
  $('#gridov').classList.add('on');const cur=box.querySelector('.cur');if(cur)cur.scrollIntoView({block:'center'});};
$('#gridx').onclick=()=>$('#gridov').classList.remove('on');
let touchX=null;
$('#lcontent').addEventListener('touchstart',e=>{touchX=e.touches[0].clientX;},{passive:true});
$('#lcontent').addEventListener('touchend',e=>{if(touchX==null)return;const dx=e.changedTouches[0].clientX-touchX;touchX=null;if(Math.abs(dx)>60){e.preventDefault();go(L.i+(dx<0?1:-1));}});

/* --- hubungan Belajar → Bermain --- */
function openPractice(stage,finished){
  const msg=finished?'Tahap selesai! Ayo latihan!':'Ayo latihan!';$('#practmsg').textContent=(finished?'🎉 ':'🎮 ')+msg;
  const row=$('#practrow');row.innerHTML='';
  stage.play.forEach(([gid,lv])=>{const g=GAMES.find(x=>x.id===gid);const [c,d]=PAL[g.c];
    const b=h('button','eb wide',`<b>${ico('🎮')}</b>${g.title}<span>Level ${lv}</span>`);b.style.setProperty('--c',c);b.style.setProperty('--d',d);
    b.onclick=()=>{sfx.tap();$('#practov').classList.remove('on');TTS.stop();G={g,tok:0};$('#lvtitle').textContent=g.title;startLevel(lv);};row.append(b);});
  $('#practov').classList.add('on');TTS.say([msg]);}
$('#practx').onclick=()=>{$('#practov').classList.remove('on');};

