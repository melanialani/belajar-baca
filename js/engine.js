/* ============ level engine: levels, questions, hearts, feedback, shared game patterns ============ */
const QN=5,OPT=[2,3,3,4,4],HEARTS=5;
function makeD(L){const t=3+(L-1)*10/24;const hi=Math.round(t);return {L,b:(L-1)/5|0,hi,lo:Math.max(3,hi-1),used:new Set(),q:0,cur:[],review:false,revTried:false};}
function bySeg(D,arr){const n=arr.length,a=Math.floor(D.q*n/QN),b=Math.max(a+1,Math.floor((D.q+1)*n/QN));return arr[Math.min(n-1,a+(rnd()*(b-a)|0))];}
const P=e=>h('div','gpic',ico(e));
function spkBtn(fn,big){const b=h('button','spk'+(big?' big':''),IC.spk);b.setAttribute('aria-label','Dengarkan');b.onclick=()=>fn();return b;}
// shared confirm button for games where the child decides when they are done (drum, feeding, paying)
function okBtn(html,fn){const b=h('button','okb',html);b.onclick=()=>{if(!G.done)fn(b);};return b;}
function optsEl(list,render,onPick,cls=''){const wrap=h('div','opts');list.forEach(v=>{const b=h('button','opt '+cls,render(v));b.onclick=()=>{if(G.done)return;onPick(v,b);};wrap.append(b);});return wrap;}

function openLevels(g){G={g,tok:0};onScreen('levels');$('#lvtitle').textContent=g.title;buildLevelGrid();TTS.say([g.title]);}
function buildLevelGrid(){const g=G.g,st=levelStars(g.id),box=$('#lvgrid');$('#levels .back').dataset.go=g.home||'bermain';box.innerHTML='';$('#lvstars').textContent=`⭐ ${gameStars(g.id)}/75`;
  for(let L=1;L<=25;L++){const [c,d]=BANDPAL[(L-1)/5|0];const s=st[L-1]||0;
    const b=h('button','lv'+(s?' done':''),`${L}<small>${s?'⭐'.repeat(s):''}</small>`);b.style.setProperty('--c',c);b.style.setProperty('--d',d);
    b.setAttribute('aria-label','Level '+L);b.onclick=()=>{sfx.tap();startLevel(L);};box.append(b);}}
function startLevel(L){rnd=G.g.daily?Math.random:mulberry32(hashStr(G.g.id)+L*7919);Object.assign(G,{L,q:0,err:0,hearts:HEARTS,D:makeD(L),stars0:totalStars()});
  onScreen('game');$('#endov').classList.remove('on');$('#gtitle').textContent=G.g.daily?'Latihan':'Level '+L;drawHearts();nextQ();}
function drawHearts(lost){$('#ghearts').innerHTML=Array.from({length:HEARTS},(_,i)=>`<span class="${i<G.hearts?'':'lost'}${i===lost?' pop':''}">${ico('❤️')}</span>`).join('');}
// big feedback layer over the game; it also blocks taps while shown
function showFb(kind,text){const f=$('#gfb');f.className='gfb on '+kind;f.querySelector('.fbx').innerHTML=kind==='ok'?'':IC.bigx;f.querySelector('.fbt').textContent=text;}
const hideFb=()=>{$('#gfb').className='gfb';};
const qnOf=()=>G.g.qn||QN;
function dots(){const d=$('#gdots');d.innerHTML='';for(let i=0;i<qnOf();i++)d.append(h('i',i<G.q?'done':i===G.q?'now':''));}
function nextQ(){
  const tok=++G.tok;G.done=false;G.qerr=0;TTS.stop();hideFb();
  if(G.q>=qnOf())return endLevel();
  Object.assign(G.D,{q:G.q,cur:[],review:false,revTried:false});
  dots();const st=$('#stage');st.innerHTML='';
  const api={
    ok(){if(G.done||tok!==G.tok)return;G.done=true;
      if(!G.qerr){let ch=false;G.D.cur.forEach(w=>{if(MISS[w]){MISS[w]--;if(MISS[w]<=0)delete MISS[w];ch=true;}});if(ch)saveMiss();}
      sfx.ok();confetti();const t0=Date.now(),txt=pickM(PRAISE);showFb('ok',txt);
      TTS.say([txt],{keep:true,onEnd:()=>setTimeout(()=>{if(tok===G.tok){G.q++;nextQ();}},Math.max(150,1000-(Date.now()-t0)))});},
    bad(el,word){if(G.done||tok!==G.tok)return;G.err++;G.qerr++;sfx.no();
      const w=word||G.D.cur[0];if(w&&BYW[w]){MISS[w]=Math.min(5,(MISS[w]||0)+1);saveMiss();}
      if(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}
      G.hearts--;drawHearts(G.hearts);
      if(G.hearts<=0){G.done=true;const txt=pickM(GAMEOVER);showFb('out',txt);TTS.say([txt],{onEnd:()=>setTimeout(()=>{if(tok===G.tok)leaveGame();},400)});return;}
      const txt=pickM(OOPS);showFb('no',txt);TTS.say([txt]);setTimeout(()=>{if(tok===G.tok&&!G.done)hideFb();},900);}};
  const auto=G.g.fn(st,api,G.D)||[];
  $('#grev').hidden=!G.D.review;
  const intro=G.q===0?[G.g.ins]:G.D.review?['Ayo ulang kata ini']:[];
  if(intro.length||auto.length)TTS.say([...intro,...auto]);}
function endLevel(){
  rnd=Math.random;const g=G.g,L=G.L;const s=G.err===0?3:G.err<=2?2:1;
  if(g.daily)g.finish();else{const arr=levelStars(g.id);arr[L-1]=Math.max(arr[L-1]||0,s);store.set('lv:'+g.id,arr);}updateStars();
  $('#endstars').innerHTML=[0,1,2].map(i=>`<span class="${i<s?'':'dim'}">⭐</span>`).join('');
  const msg=s===3?'Hebat sekali!':s===2?'Bagus!':'Selesai! Ayo coba lagi.';
  $('#endmsg').textContent=msg;$('#eNext').style.visibility=!g.daily&&L<25?'visible':'hidden';
  $('#eMap').innerHTML=g.daily?`<b>${ico('🏠')}</b>Rumah`:`<b>${ico('🗺️')}</b>Level`;
  const before=stkCount(G.stars0),after=stkCount(totalStars());const sp=[msg,s+' bintang'];
  if(after>before){const nw=STICKERS.slice(before,after);$('#endstk').innerHTML=`<b>${nw.slice(-3).map(ico).join('')}</b><span>${nw.length>3?'+'+(nw.length-3)+' ':''}Stiker baru!</span>`;$('#endstk').hidden=false;sp.push('Hore! Kamu dapat stiker baru!');}
  else $('#endstk').hidden=true;
  $('#endov').classList.add('on');sfx.win();confetti();TTS.say(sp);}
$('#eAgain').onclick=()=>{sfx.tap();startLevel(G.L);};
$('#eNext').onclick=()=>{sfx.tap();startLevel(Math.min(25,G.L+1));};
$('#eMap').onclick=()=>{sfx.tap();if(G.g.daily)return show('home');$('#endov').classList.remove('on');onScreen('levels');$('#lvtitle').textContent=G.g.title;buildLevelGrid();};
function leaveGame(){TTS.stop();G.tok++;hideFb();rnd=Math.random;if(G.g.daily)return show('home');onScreen('levels');$('#lvtitle').textContent=G.g.title;buildLevelGrid();}
$('#gback').onclick=()=>{sfx.tap();leaveGame();};

/* --- pola game --- */
function arrange(st,api,{word,target,pieces,prefill=0,pic=true,unit='l',upper=false,speak=null}){
  const f=(s,i)=>upper?s.toUpperCase():i==null?caseUnit(s):casePart(s,i); // slots use word position, tiles stay standalone
  const q=h('div','q');if(pic&&word.e)q.append(P(word.e));q.append(spkBtn(()=>TTS.say([word.w])));
  const slots=h('div','slots');target.forEach((t,i)=>{const s=h('div','slot',i<prefill?f(t,i):'');if(i<prefill)s.classList.add('fill');slots.append(s);});q.append(slots);
  const pl=[...pieces];for(let i=0;i<prefill;i++){const k=pl.indexOf(target[i]);if(k>-1)pl.splice(k,1);}
  const a=h('div','a'),tiles=h('div','tiles');let pos=prefill;
  pl.forEach(p=>{const b=h('button','tile',f(p));
    b.onclick=()=>{if(pos>=target.length||G.done)return;const spoken=speak?speak(p):unit==='l'?LN[p]:p;
      if(p===target[pos]){b.classList.add('gone');b.disabled=true;const sl=slots.children[pos];sl.textContent=f(p,pos);sl.classList.add('fill','pop');pos++;TTS.say([spoken]);if(pos===target.length)api.ok();}
      else{TTS.say([spoken]);api.bad(b);}};tiles.append(b);});
  a.append(tiles);st.append(q,a);}
function matchGame(st,api,words,leftRender,onLeft,leftCls=''){
  const Lc=h('div','col'),Rc=h('div','col');let sel=null,done=0;const pal=['#FF5FA2','#A47CFF','#2EC4A6','#FF9A62'];
  shuffle(words).forEach(w=>{const b=h('button','mt '+leftCls,leftRender(w));
    b.onclick=()=>{if(b.classList.contains('ok'))return;[...Lc.children].forEach(x=>x.classList.remove('sel'));b.classList.add('sel');sel={w,b};sfx.tap();onLeft&&onLeft(w);};Lc.append(b);});
  shuffle(words).forEach(w=>{const b=h('button','mt'+(w.w.length>7?' long':''),caseWord(w.w));
    b.onclick=()=>{if(b.classList.contains('ok')||G.done)return;
      if(!sel){b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');TTS.say(['Pilih yang kiri dulu']);return;}
      if(sel.w===w){const c=pal[done%4];[sel.b,b].forEach(x=>{x.classList.add('ok');x.classList.remove('sel');x.style.setProperty('--m',c);});
        sel=null;done++;if(done===words.length)api.ok();else{sfx.tap();TTS.say([w.say||w.w]);}}
      else api.bad(b,sel.w.w);};Rc.append(b);});
  const wrap=h('div','match');wrap.append(Lc,Rc);st.append(wrap);}
