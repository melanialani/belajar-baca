/* ============ level engine: levels, questions, hearts, feedback, shared game patterns ============ */
const QN=5,OPT=[2,3,3,4,4],HEARTS=5,MAXL=100,PAGEL=25;
// difficulty of a level: b = band 0–4 (levels 1–25, unchanged); x = 0 up to 25, then 1–15 (five levels each) for levels 26–100
// hi/lo = word tiers: 3–13 for levels 1–25, then the harder tiers 14–18 step by step
function makeD(L){const t=3+(Math.min(L,25)-1)*10/24,x=L>25?Math.ceil((L-25)/5):0;const hi=L>25?Math.min(MAXT,13+Math.ceil((L-25)/15)):Math.round(t);
  return {L,b:Math.min(4,(L-1)/5|0),x,qn:L>75?7:L>50?6:QN,hi,lo:L>25?Math.max(3,hi-2):Math.max(3,hi-1),used:new Set(),q:0,cur:[],review:false,revTried:false};}
// number of answer choices: 2–4 in levels 1–25, 4 up to level 50, then 5
const optN=D=>SET.tod?Math.min(3,OPT[D.b]):D.x?(D.L>50?5:4):OPT[D.b];
// per-band value: a = the five values of levels 1–25, x = values for levels 26–100 (indexed by D.x-1, last one repeats)
const bv=(D,a,x)=>D.x&&x?x[Math.min(x.length,D.x)-1]:a[Math.min(4,D.b)];
function bySeg(D,arr){const N=D.qn||QN,n=arr.length,a=Math.floor(D.q*n/N),b=Math.max(a+1,Math.floor((D.q+1)*n/N));return arr[Math.min(n-1,a+(rnd()*(b-a)|0))];}
const P=e=>h('div','gpic',ico(e));
function spkBtn(fn,big){const b=h('button','spk'+(big?' big':''),IC.spk);b.setAttribute('aria-label','Dengarkan');b.onclick=()=>fn();return b;}
// shared confirm button for games where the child decides when they are done (drum, feeding, paying)
function okBtn(html,fn){const b=h('button','okb',html);b.onclick=()=>{if(!G.done)fn(b);};return b;}
// answer buttons; isOk marks the right one(s) so a wrong tap can show the right answer
function optsEl(list,render,onPick,cls='',isOk){const wrap=h('div','opts');list.forEach(v=>{const b=h('button','opt '+cls,render(v));if(isOk&&isOk(v))b.dataset.ok=1;b.onclick=()=>{if(G.done)return;onPick(v,b);};wrap.append(b);});return wrap;}

/* --- questions to repeat later: a wrong question comes back in a later level until answered right twice ---
   words use MISS (shared by all word games); other games keep their own keys here (number, sum, question) */
const REDO=store.get('redo',{});
const saveRedo=()=>store.set('redo',REDO);
function redoAdd(gid,key,L){if(key==null||!gid)return;const m=REDO[gid]=REDO[gid]||{};m[key]={n:2,L};saveRedo();}
// on question 2 and 4 of a level: a key missed in an earlier (easier) level (ok = still fits this question type)
function redoPick(D,ok=()=>true){if(!(D.q===1||D.q===3)||D.rdTried||!D.gid)return null;D.rdTried=true;
  const m=REDO[D.gid]||{},k=Object.keys(m).filter(k=>m[k].L<D.L&&ok(k)).sort((a,b)=>m[a].n-m[b].n||a.localeCompare(b))[0];
  if(k==null)return null;D.review=true;D.rkey=k;return k;}
function redoDone(gid,key){const m=REDO[gid];if(!m||!m[key])return;if(--m[key].n<=0)delete m[key];saveRedo();}

// a new game keeps counting tokens, so a timer left from the previous game can never match
const nextTok=()=>(G&&G.tok||0)+1;
function openLevels(g){G={g,tok:nextTok()};onScreen('levels');$('#lvtitle').textContent=g.title;$('#lvins').textContent=g.ins||'';buildLevelGrid();TTS.say([g.title]);}
// stars of the last try per level (lvl:) are shown; totals and stickers use the best try (lv:), so nothing earned is lost
const lastStars=id=>store.get('lvl:'+id,[]);
const maxLevel=()=>SET.tod?PAGEL:MAXL;
// 100 levels in pages of 25; the page of the last level played opens first
function buildLevelGrid(page){const g=G.g,best=levelStars(g.id),last=lastStars(g.id),box=$('#lvgrid'),tabs=$('#lvtabs'),pages=Math.ceil(maxLevel()/PAGEL);
  if(page==null)page=Math.min(pages-1,store.get('lvp:'+g.id,0));store.set('lvp:'+g.id,page);
  $('#levels .back').dataset.go=g.home||'bermain';box.innerHTML='';tabs.innerHTML='';$('#lvstars').textContent=`⭐ ${gameStars(g.id)}/${maxLevel()*3}`;
  tabs.hidden=pages<2;
  for(let p=0;p<pages;p++){const t=h('button',p===page?'on':'',`${p*PAGEL+1}–${(p+1)*PAGEL}`),done=best.slice(p*PAGEL,(p+1)*PAGEL).filter(Boolean).length;
    if(done)t.append(h('small','',done===PAGEL?'✓':`${done}`));t.onclick=()=>{sfx.tap();buildLevelGrid(p);};tabs.append(t);}
  for(let L=page*PAGEL+1;L<=(page+1)*PAGEL;L++){const [c,d]=BANDPAL[(L-1)/5%BANDPAL.length|0];const s=last[L-1]||best[L-1]||0;
    const b=h('button','lv'+(best[L-1]?' done':''),`${L}<small>${s?'⭐'.repeat(s):''}</small>`);b.style.setProperty('--c',c);b.style.setProperty('--d',d);
    b.setAttribute('aria-label','Level '+L);b.onclick=()=>{sfx.tap();startLevel(L);};box.append(b);}
  box.scrollTop=0;}
function startLevel(L){rnd=G.g.daily?Math.random:mulberry32(hashStr(G.g.id)+L*7919);Object.assign(G,{L,q:0,err:0,hearts:HEARTS,D:Object.assign(makeD(L),{gid:G.g.id}),stars0:totalStars()});
  onScreen('game');$('#endov').classList.remove('on');$('#gtitle').textContent=G.g.daily?'Latihan':'Level '+L;gameInfo();drawHearts();nextQ();}
function drawHearts(lost){$('#ghearts').hidden=!!SET.tod||!!G.g.test;$('#ghearts').innerHTML=Array.from({length:HEARTS},(_,i)=>`<span class="${i<G.hearts?'':'lost'}${i===lost?' pop':''}">${ico('❤️')}</span>`).join('');}
// big feedback layer over the game; it also blocks taps while shown
function showFb(kind,text){const f=$('#gfb');f.className='gfb on '+kind;f.querySelector('.fbx').innerHTML=kind==='no'||kind==='out'?IC.bigx:'';f.querySelector('.fbt').textContent=text;}
const hideFb=()=>{$('#gfb').className='gfb';};
const qnOf=()=>G.g.qn||G.D.qn||QN;
function dots(){const d=$('#gdots');d.innerHTML='';for(let i=0;i<qnOf();i++)d.append(h('i',i<G.q?'done':i===G.q?'now':''));}
// after a wrong answer: show the right answer, then a new question (the wrong one does not count and comes back in a later level)
function revealAnswer(tok){const st=$('#stage');if(tok!==G.tok)return;hideFb();
  if(G.reveal)G.reveal();st.querySelectorAll('[data-ok]').forEach(e=>e.classList.add('right','reveal'));st.classList.add('revealed');
  const say=G.ansSay;TTS.say(say&&say.length?['Yang benar',...say]:[],{onEnd:()=>setTimeout(()=>{if(tok===G.tok)nextQ();},say&&say.length?700:1300)});}
function nextQ(){
  const tok=++G.tok;G.done=false;G.qerr=0;G.reveal=null;G.ansSay=null;G.solve=null;TTS.stop();hideFb();$('#stage').classList.remove('revealed');
  if(G.q>=qnOf())return endLevel();
  Object.assign(G.D,{q:G.q,cur:[],review:false,revTried:false,rdTried:false,rkey:null,key:null});
  dots();const st=$('#stage');st.innerHTML='';
  const api={
    // the game tells what the right answer is: spoken words and an optional function that shows it on screen
    ans(say,show){G.ansSay=say==null?null:[].concat(say);G.reveal=show||null;},
    // multi-step games give a way to solve the question (used by the automated checks only)
    solve(fn){G.solve=fn;},
    ok(){if(G.done||tok!==G.tok)return;G.done=true;if(G.g.test)G.g.answer(true);else todayAdd('ok');
      if(!G.qerr){let ch=false;G.D.cur.forEach(w=>{if(MISS[w]){MISS[w]--;if(MISS[w]<=0)delete MISS[w];ch=true;}});if(ch)saveMiss();if(G.D.rkey!=null)redoDone(G.D.gid,G.D.rkey);}
      sfx.ok();confetti();const t0=Date.now(),txt=pickM(PRAISE);showFb('ok',txt);
      TTS.say([txt],{keep:true,onEnd:()=>setTimeout(()=>{if(tok===G.tok){G.q++;nextQ();}},Math.max(150,1000-(Date.now()-t0)))});},
    bad(el,word){if(G.done||tok!==G.tok)return;
      // Tes Awal: a wrong answer just moves on (no heart, no answer shown)
      if(G.g.test){G.done=true;G.g.answer(false);sfx.tap();showFb('skip','Tidak apa-apa');setTimeout(()=>{if(tok===G.tok){G.q++;nextQ();}},900);return;}
      G.err++;G.qerr++;sfx.no();todayAdd('bad');
      const w=word||G.D.cur[0];if(w&&BYW[w]){MISS[w]=Math.min(5,(MISS[w]||0)+1);saveMiss();}
      else if(word!=null||G.D.key!=null)redoAdd(G.D.gid,String(word!=null?word:G.D.key),G.D.L);
      if(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}
      if(!SET.tod){G.hearts--;drawHearts(G.hearts);}
      if(G.hearts<=0){G.done=true;const txt=pickM(GAMEOVER);showFb('out',txt);TTS.say([txt],{onEnd:()=>setTimeout(()=>{if(tok===G.tok)leaveGame();},400)});return;}
      const txt=SET.tod?'Ayo lihat yang benar':pickM(OOPS);showFb('no',txt);
      // memory cards and the microphone game keep the board: a mismatch there is not guessing
      if(G.g.keep||G.D.keep){TTS.say([txt]);setTimeout(()=>{if(tok===G.tok&&!G.done)hideFb();},900);return;}
      G.done=true;const t0=Date.now();TTS.say([txt],{onEnd:()=>setTimeout(()=>revealAnswer(tok),Math.max(0,900-(Date.now()-t0)))});}};
  const auto=G.g.fn(st,api,G.D)||[];
  $('#grev').hidden=!G.D.review;
  const intro=G.q===0&&!G.D.started?[G.g.ins]:G.D.review?['Ayo ulang ini']:[];G.D.started=true;
  if(intro.length||auto.length)TTS.say([...intro,...auto]);}
function endLevel(){
  rnd=Math.random;const g=G.g,L=G.L;const s=G.err===0?3:G.err<=2?2:1;
  const fin=g.daily?g.finish():null;if(!g.daily){const arr=levelStars(g.id);arr[L-1]=Math.max(arr[L-1]||0,s);store.set('lv:'+g.id,arr);const la=lastStars(g.id);la[L-1]=s;store.set('lvl:'+g.id,la);}updateStars();
  $('#endstars').innerHTML=[0,1,2].map(i=>`<span class="${i<s?'':'dim'}">⭐</span>`).join('');
  const msg=fin?'Selesai!':s===3?'Hebat sekali!':s===2?'Bagus!':'Selesai! Ayo coba lagi.';
  $('#endmsg').innerHTML=fin?[msg,...fin].map(x=>`<span>${x}</span>`).join('<br>'):msg;$('#endstars').hidden=!!(fin&&g.test);$('#eNext').style.visibility=!g.daily&&L<maxLevel()?'visible':'hidden';
  $('#eMap').innerHTML=g.daily?`<b>${ico('🏠')}</b>Rumah`:`<b>${ico('🗺️')}</b>Level`;
  const before=stkCount(G.stars0),after=stkCount(totalStars());const sp=fin&&g.test?[msg,...fin]:[msg,s+' bintang'];
  if(after>before){const nw=STICKERS.slice(before,after);$('#endstk').innerHTML=`<b>${nw.slice(-3).map(ico).join('')}</b><span>${nw.length>3?'+'+(nw.length-3)+' ':''}Stiker baru!</span>`;$('#endstk').hidden=false;sp.push('Hore! Kamu dapat stiker baru!');}
  else $('#endstk').hidden=true;
  $('#endov').classList.add('on');sfx.win();confetti();TTS.say(sp);}
$('#eAgain').onclick=()=>{sfx.tap();startLevel(G.L);};
$('#eNext').onclick=()=>{sfx.tap();startLevel(Math.min(maxLevel(),G.L+1));};
const toLevels=()=>{onScreen('levels');$('#lvtitle').textContent=G.g.title;$('#lvins').textContent=G.g.ins||'';buildLevelGrid(Math.floor((G.L-1)/PAGEL));};
$('#eMap').onclick=()=>{sfx.tap();if(G.g.daily)return show('home');$('#endov').classList.remove('on');toLevels();};
function leaveGame(){TTS.stop();G.tok++;hideFb();rnd=Math.random;if(G.g.daily)return show('home');toLevels();}
$('#gback').onclick=()=>{sfx.tap();leaveGame();};

/* --- shared game patterns: arrange tiles in order, match pairs --- */
function arrange(st,api,{word,target,pieces,prefill=0,pic=true,unit='l',upper=false,speak=null}){
  const f=(s,i)=>upper?s.toUpperCase():i==null?caseUnit(s):casePart(s,i); // slots use word position, tiles stay standalone
  const q=h('div','q');if(pic&&word.e)q.append(P(word.e));q.append(spkBtn(()=>TTS.say([word.w])));
  const slots=h('div','slots');target.forEach((t,i)=>{const s=h('div','slot',i<prefill?f(t,i):'');if(i<prefill)s.classList.add('fill');slots.append(s);});q.append(slots);
  const pl=[...pieces];for(let i=0;i<prefill;i++){const k=pl.indexOf(target[i]);if(k>-1)pl.splice(k,1);}
  const a=h('div','a'),tiles=h('div','tiles');let pos=prefill;
  api.ans(word.w?[word.w]:null,()=>{target.forEach((t,i)=>{const sl=slots.children[i];if(!sl.classList.contains('fill')){sl.textContent=f(t,i);sl.classList.add('fill','shown');}});});
  api.solve(()=>{for(let i=pos;i<target.length;i++)[...tiles.children].find(b=>!b.disabled&&b.textContent===f(target[i])).click();});
  pl.forEach(p=>{const b=h('button','tile',f(p));
    b.onclick=()=>{if(pos>=target.length||G.done)return;const spoken=speak?speak(p):unit==='l'?LN[p]:p;
      if(p===target[pos]){b.classList.add('gone');b.disabled=true;const sl=slots.children[pos];sl.textContent=f(p,pos);sl.classList.add('fill','pop');pos++;TTS.say([spoken]);if(pos===target.length)api.ok();}
      else{TTS.say([spoken]);api.bad(b);}};tiles.append(b);});
  a.append(tiles);st.append(q,a);}
function matchGame(st,api,words,leftRender,onLeft,leftCls=''){
  const Lc=h('div','col'),Rc=h('div','col');let sel=null,done=0;const pal=['#E8467C','#7B5CF0','#12A08C','#F2703A'];
  shuffle(words).forEach(w=>{const b=h('button','mt '+leftCls,leftRender(w));b._w=w;
    b.onclick=()=>{if(b.classList.contains('ok')||G.done)return;[...Lc.children].forEach(x=>x.classList.remove('sel'));b.classList.add('sel');sel={w,b};sfx.tap();onLeft&&onLeft(w);};Lc.append(b);});
  shuffle(words).forEach(w=>{const b=h('button','mt'+(w.w.length>7?' long':''),caseWord(w.w));b._w=w;
    b.onclick=()=>{if(b.classList.contains('ok')||G.done)return;
      if(!sel){b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');TTS.say(['Pilih yang kiri dulu']);return;}
      if(sel.w===w){const c=pal[done%4];[sel.b,b].forEach(x=>{x.classList.add('ok');x.classList.remove('sel');x.style.setProperty('--m',c);});
        sel=null;done++;if(done===words.length)api.ok();else{sfx.tap();TTS.say([w.say||w.w]);}}
      else api.bad(b,sel.w.w);};Rc.append(b);});
  api.solve(()=>{[...Lc.children].forEach(l=>{if(l.classList.contains('ok'))return;l.click();[...Rc.children].find(x=>x._w===l._w).click();});});
  // wrong pair: every pair lights up in its own color
  api.ans(null,()=>{let k=done;[...Lc.children].forEach(l=>{if(l.classList.contains('ok'))return;const w=l._w,r=[...Rc.children].find(x=>x._w===w),c=pal[k++%4];
    [l,r].forEach(x=>{x.classList.add('ok','shown');x.classList.remove('sel');x.style.setProperty('--m',c);});});});
  const wrap=h('div','match');wrap.append(Lc,Rc);st.append(wrap);}
