/* ============ mesin level ============ */
const QN=5,OPT=[2,3,3,4,4];
function makeD(L){const t=3+(L-1)*10/24;const hi=Math.round(t);return {L,b:(L-1)/5|0,hi,lo:Math.max(3,hi-1),used:new Set(),q:0,cur:[],review:false,revTried:false};}
const LET=x=>/^[a-z]+$/.test(x.w);
const HASE=x=>!!x.e;
function pool(D,f=()=>true,min=10){let lo=D.lo,hi=D.hi,p;for(;;){p=BANK.filter(w=>w.t>=lo&&w.t<=hi&&f(w));if(p.length>=min||(lo<=3&&hi>=13))return p;if(lo>3)lo--;else hi++;}}
// soal 1→5 dalam satu level: makin sulit; soal ke-2 & ke-4 bisa berisi kata yang pernah salah
function takeWord(D,f=()=>true,min=10){
  if((D.q===1||D.q===3)&&!D.revTried){D.revTried=true;
    const cand=Object.entries(MISS).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([w])=>BYW[w]).filter(x=>x&&f(x)&&!D.used.has(x.w));
    if(cand.length){const w=cand[0];D.used.add(w.w);D.cur.push(w.w);D.review=true;return w;}}
  const p=pool(D,f,min).slice().sort(byDiff);const fr=p.filter(w=>!D.used.has(w.w));const arr=fr.length?fr:p;
  const n=arr.length,a=Math.floor(D.q*n/QN),b=Math.max(a+1,Math.floor((D.q+1)*n/QN));
  const w=arr[Math.min(n-1,a+(rnd()*(b-a)|0))];D.used.add(w.w);D.cur.push(w.w);return w;}
const sim=(a,b)=>(a.w[0]===b.w[0]?2:0)+(a.s.length===b.s.length?1:0)+(a.w.slice(-1)===b.w.slice(-1)?1:0)+(Math.abs(a.w.length-b.w.length)<=1?1:0);
function distract(w,n,D,f=()=>true){const okx=x=>f(x)&&x.w!==w.w&&!(w.e&&x.e===w.e);
  let c=pool(D,okx,n+6);if(c.length<n)c=BANK.filter(okx);
  if(D.b>=2)c=shuffle(c).sort((a,b)=>sim(w,b)-sim(w,a)).slice(0,Math.max(n*2,n+1));
  const out=[],seenE=new Set();for(const x of shuffle(c)){if(x.e&&seenE.has(x.e))continue;if(x.e)seenE.add(x.e);out.push(x);if(out.length===n)break;}return out;}
function pickDistinct(D,n,f){const out=[],es=new Set();let guard=0;
  while(out.length<n&&guard++<60){const w=takeWord(D,x=>f(x)&&!out.includes(x)&&!(x.e&&es.has(x.e)),n+4);if(out.includes(w)||(w.e&&es.has(w.e)))continue;out.push(w);if(w.e)es.add(w.e);}return out;}
const onset=s=>s.match(/^[^aiueo]*/)[0],nucl=s=>(s.match(/[aiueo]+/)||[''])[0];
function sylPool(b){if(b===0)return 'bmpst'.split('').flatMap(CVsyl);if(b===1)return CV.flatMap(CVsyl);if(b===2)return [...CV.flatMap(CVsyl),...['ng','ny'].flatMap(CVsyl)];
  const t=b===3?8:13;return [...new Set(BANK.filter(w=>w.t<=t&&w.t>=5).flatMap(w=>w.s))];}
function sylDistract(ans,n,pl,similar){let c=[...new Set(pl)].filter(s=>s!==ans);
  if(similar){const close=c.filter(s=>onset(s)===onset(ans)||nucl(s)===nucl(ans));if(close.length>=n)c=close;}
  if(c.length<n)c=ALLSYL.filter(s=>s!==ans);return sample(c,n);}
function bySeg(D,arr){const n=arr.length,a=Math.floor(D.q*n/QN),b=Math.max(a+1,Math.floor((D.q+1)*n/QN));return arr[Math.min(n-1,a+(rnd()*(b-a)|0))];}
const P=e=>h('div','gpic',ico(e));
function spkBtn(fn,big){const b=h('button','spk'+(big?' big':''),IC.spk);b.setAttribute('aria-label','Dengarkan');b.onclick=()=>fn();return b;}
function optsEl(list,render,onPick,cls=''){const wrap=h('div','opts');list.forEach(v=>{const b=h('button','opt '+cls,render(v));b.onclick=()=>{if(G.done)return;onPick(v,b);};wrap.append(b);});return wrap;}

function openLevels(g){G={g,tok:0};onScreen('levels');$('#lvtitle').textContent=g.title;buildLevelGrid();TTS.say([g.title]);}
function buildLevelGrid(){const g=G.g,st=levelStars(g.id),box=$('#lvgrid');box.innerHTML='';$('#lvstars').textContent=`⭐ ${gameStars(g.id)}/75`;
  for(let L=1;L<=25;L++){const [c,d]=BANDPAL[(L-1)/5|0];const s=st[L-1]||0;
    const b=h('button','lv'+(s?' done':''),`${L}<small>${s?'⭐'.repeat(s):''}</small>`);b.style.setProperty('--c',c);b.style.setProperty('--d',d);
    b.setAttribute('aria-label','Level '+L);b.onclick=()=>{sfx.tap();startLevel(L);};box.append(b);}}
function startLevel(L){rnd=mulberry32(hashStr(G.g.id)+L*7919);Object.assign(G,{L,q:0,err:0,D:makeD(L),stars0:totalStars()});
  onScreen('game');$('#endov').classList.remove('on');$('#gtitle').textContent='Level '+L;nextQ();}
function dots(){const d=$('#gdots');d.innerHTML='';for(let i=0;i<QN;i++)d.append(h('i',i<G.q?'done':i===G.q?'now':''));}
function nextQ(){
  const tok=++G.tok;G.done=false;G.qerr=0;TTS.stop();
  if(G.q>=QN)return endLevel();
  Object.assign(G.D,{q:G.q,cur:[],review:false,revTried:false});
  dots();const st=$('#stage');st.innerHTML='';
  const api={
    ok(parts=[]){if(G.done||tok!==G.tok)return;G.done=true;
      if(!G.qerr){let ch=false;G.D.cur.forEach(w=>{if(MISS[w]){MISS[w]--;if(MISS[w]<=0)delete MISS[w];ch=true;}});if(ch)saveMiss();}
      sfx.ok();confetti();const t0=Date.now();
      TTS.say([...parts,pickM(PRAISE)],{keep:true,onEnd:()=>setTimeout(()=>{if(tok===G.tok){G.q++;nextQ();}},Math.max(300,1300-(Date.now()-t0)))});},
    bad(el,word){if(G.done)return;G.err++;G.qerr++;sfx.no();
      const w=word||G.D.cur[0];if(w&&BYW[w]){MISS[w]=Math.min(5,(MISS[w]||0)+1);saveMiss();}
      if(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}}};
  const auto=G.g.fn(st,api,G.D)||[];
  $('#grev').hidden=!G.D.review;
  const intro=G.q===0?[G.g.ins]:G.D.review?['Ayo ulang kata ini']:[];
  if(intro.length||auto.length)TTS.say([...intro,...auto]);}
function endLevel(){
  rnd=Math.random;const g=G.g,L=G.L;const s=G.err===0?3:G.err<=2?2:1;
  const arr=levelStars(g.id);arr[L-1]=Math.max(arr[L-1]||0,s);store.set('lv:'+g.id,arr);updateStars();
  $('#endstars').innerHTML=[0,1,2].map(i=>`<span class="${i<s?'':'dim'}">⭐</span>`).join('');
  const msg=s===3?'Hebat sekali!':s===2?'Bagus!':'Selesai! Ayo coba lagi.';
  $('#endmsg').textContent=msg;$('#eNext').style.visibility=L<25?'visible':'hidden';
  const before=stkCount(G.stars0),after=stkCount(totalStars());const sp=[msg,s+' bintang'];
  if(after>before){const nw=STICKERS.slice(before,after);$('#endstk').innerHTML=`<b>${nw.slice(-3).map(ico).join('')}</b><span>${nw.length>3?'+'+(nw.length-3)+' ':''}Stiker baru!</span>`;$('#endstk').hidden=false;sp.push('Hore! Kamu dapat stiker baru!');}
  else $('#endstk').hidden=true;
  $('#endov').classList.add('on');sfx.win();confetti();TTS.say(sp);}
$('#eAgain').onclick=()=>{sfx.tap();startLevel(G.L);};
$('#eNext').onclick=()=>{sfx.tap();startLevel(Math.min(25,G.L+1));};
$('#eMap').onclick=()=>{sfx.tap();$('#endov').classList.remove('on');onScreen('levels');$('#lvtitle').textContent=G.g.title;buildLevelGrid();};
$('#gback').onclick=()=>{sfx.tap();TTS.stop();G.tok++;rnd=Math.random;onScreen('levels');$('#lvtitle').textContent=G.g.title;buildLevelGrid();};

/* --- pola game --- */
function arrange(st,api,{word,target,pieces,prefill=0,pic=true,unit='l',upper=false}){
  const f=(s,i)=>upper?s.toUpperCase():i==null?caseUnit(s):casePart(s,i); // slots use word position, tiles stay standalone
  const q=h('div','q');if(pic&&word.e)q.append(P(word.e));q.append(spkBtn(()=>TTS.say([word.w])));
  const slots=h('div','slots');target.forEach((t,i)=>{const s=h('div','slot',i<prefill?f(t,i):'');if(i<prefill)s.classList.add('fill');slots.append(s);});q.append(slots);
  const pl=[...pieces];for(let i=0;i<prefill;i++){const k=pl.indexOf(target[i]);if(k>-1)pl.splice(k,1);}
  const a=h('div','a'),tiles=h('div','tiles');let pos=prefill;
  pl.forEach(p=>{const b=h('button','tile',f(p));
    b.onclick=()=>{if(pos>=target.length||G.done)return;const spoken=unit==='l'?LN[p]:p;
      if(p===target[pos]){b.classList.add('gone');b.disabled=true;const sl=slots.children[pos];sl.textContent=f(p,pos);sl.classList.add('fill','pop');pos++;TTS.say([spoken]);if(pos===target.length)api.ok([word.w]);}
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
        sel=null;done++;if(done===words.length)api.ok([w.w]);else{sfx.tap();TTS.say([w.w]);}}
      else api.bad(b,sel.w.w);};Rc.append(b);});
  const wrap=h('div','match');wrap.append(Lc,Rc);st.append(wrap);}
const LGROUP=[['b','d','p'],['m','n'],['s','z','c'],['k','g','h'],['t','d'],['f','v','p'],['j','l','i'],['u','o'],['a','e'],['r','l'],['w','y']];
function letterDistract(ans,n,set,similar){let c=set.filter(l=>l!==ans);
  if(similar){const g=LGROUP.filter(x=>x.includes(ans)).flat().filter(l=>l!==ans&&c.includes(l));c=[...shuffle(g),...shuffle(c.filter(l=>!g.includes(l)))];return c.slice(0,n);}
  return sample(c,n);}
const CONSL='bcdfghjklmnprstwyz'.split('');
const maxLen=[4,5,5,6,6];

const GAMES=[
 {id:'puzzle',title:'Puzzle Benda',c:'sun',ins:'Susun hurufnya jadi nama gambar.',art:ems(['🍊'])+'<span class="br"></span>'+chips(['j','e','r','u','k']),
  fn(st,api,D){const w=takeWord(D,x=>HASE(x)&&LET(x)&&x.w.length<=maxLen[D.b]);const ex=sample('abdeghiklmnoprstu'.split('').filter(l=>!w.w.includes(l)),[0,0,1,1,2][D.b]);
   arrange(st,api,{word:w,target:[...w.w],pieces:shuffle([...w.w,...ex])});}},
 {id:'lengkapi',title:'Lengkapi Kata',c:'mint',ins:'Pilih suku kata yang hilang.',art:ems(['🍅'])+'<span class="br"></span>'+chips(['to','?']),
  fn(st,api,D){const w=takeWord(D,x=>x.s.length>=2&&x.s.length<=4&&(D.b>=3||HASE(x)));const k=rnd()*w.s.length|0,ans=w.s[k];
   const q=h('div','q');if(w.e)q.append(P(w.e));const row=h('div','slots');w.s.forEach((s,i)=>row.append(h('div','slot'+(i===k?'':' fill'),i===k?'?':casePart(s,i))));q.append(row);
   const a=h('div','a');a.append(optsEl(shuffle([ans,...sylDistract(ans,OPT[D.b]-1,ALLSYL,D.b>=2)]),s=>casePart(s,k),(s,b)=>{TTS.say([s]);
     if(s===ans){const sl=row.children[k];sl.textContent=casePart(s,k);sl.classList.add('fill','pop');b.classList.add('right');api.ok([w.w]);}else api.bad(b);}));st.append(q,a);}},
 {id:'pzsuku',title:'Puzzle Suku Kata',c:'sky',ins:'Susun suku katanya jadi nama gambar.',art:ems(['🐘'])+'<span class="br"></span>'+chips(['ga','jah']),
  fn(st,api,D){const w=takeWord(D,x=>x.s.length>=2&&x.s.length<=3&&(D.b>=3||HASE(x)));
   arrange(st,api,{word:w,target:w.s,unit:'s',pieces:shuffle([...w.s,...sylDistract('',[0,1,1,2,2][D.b],ALLSYL.filter(x=>!w.s.includes(x)),false)])});}},
 {id:'sambung',title:'Sambung Kata Benda',c:'rose',ins:'Pilih gambar, lalu pilih katanya.',art:ems(['🍎'])+chips(['apel'])+'<span class="br"></span>'+ems(['🐔'])+chips(['ayam']),
  fn(st,api,D){matchGame(st,api,pickDistinct(D,[2,2,3,3,3][D.b],x=>HASE(x)&&x.w.length<=9),w=>`<span class="em">${ico(w.e)}</span>`);}},
 {id:'hitung',title:'Hitung Suku Kata',c:'mint',ins:'Ada berapa suku kata?',art:chips(['sa','pu'])+'<span class="br"></span>'+chips(['1','2','3']),
  fn(st,api,D){const w=takeWord(D,x=>x.s.length<=4);const q=h('div','q');if(w.e)q.append(P(w.e));const word=h('div','qword',caseWord(w.w));q.append(word,spkBtn(()=>TTS.say([w.w])));
   const max=Math.max([3,3,4,4,4][D.b],w.s.length);const nums=Array.from({length:max},(_,i)=>i+1);
   const a=h('div','a');a.append(optsEl(nums,n=>n,(n,b)=>{if(n===w.s.length){b.classList.add('right');word.innerHTML=w.s.map((s,i)=>`<span style="color:${COL[i%6]}">${casePart(s,i)}</span>`).join(' ');api.ok([...w.s,n+' suku kata']);}
     else{TTS.say([String(n)]);api.bad(b);}}));st.append(q,a);return [w.w];}},
 {id:'tsuku',title:'Tebak Suara Suku Kata',c:'lilac',ins:'Dengarkan, lalu pilih suku katanya.',art:ems(['🔊'])+'<span class="br"></span>'+chips(['fu','ra','bo']),
  fn(st,api,D){const pl=[...new Set(sylPool(D.b))].sort((a,b)=>sylScore(a)-sylScore(b)||a.localeCompare(b));const fresh=pl.filter(s=>!D.used.has(s));const ans=bySeg(D,fresh.length?fresh:pl);D.used.add(ans);
   const q=h('div','q');q.append(spkBtn(()=>TTS.say([ans],{rate:.7}),true));
   const a=h('div','a');a.append(optsEl(shuffle([ans,...sylDistract(ans,OPT[D.b]-1,pl,D.b>=2)]),caseUnit,(s,b)=>{if(s===ans){b.classList.add('right');api.ok([s]);}else{TTS.say([s]);api.bad(b);}}));
   st.append(q,a);return [ans];}},
 {id:'tbenda',title:'Tebak Suara Nama Benda',c:'coral',ins:'Dengarkan, lalu pilih nama bendanya.',art:ems(['🔊'])+'<span class="br"></span>'+chips(['bola','sapu']),
  fn(st,api,D){const w=takeWord(D,HASE);const q=h('div','q');const ph=h('div','gpic','❓');q.append(ph,spkBtn(()=>TTS.say([w.w]),true));
   const a=h('div','a');a.append(optsEl(shuffle([w,...distract(w,OPT[D.b]-1,D,HASE)]),x=>caseWord(x.w),(x,b)=>{
     if(x===w){b.classList.add('right');ph.innerHTML=ico(w.e);ph.classList.add('pop');api.ok([w.w]);}else{TTS.say([x.w]);api.bad(b);}}));st.append(q,a);return [w.w];}},
 {id:'akhir',title:'Tebak Akhir Nama Benda',c:'berry',ins:'Huruf apa di akhir nama benda ini?',art:chips(['jeru','?'])+'<span class="br"></span>'+chips(['a','k','r']),
  fn(st,api,D){const w=takeWord(D,x=>LET(x)&&HASE(x));const last=w.w.slice(-1);const set=VOW.includes(last)?VOW:CONSL;
   const q=h('div','q');q.append(P(w.e));const word=h('div','qword',`${casePart(w.w.slice(0,-1),0)}<span class="blank">?</span>`);q.append(word,spkBtn(()=>TTS.say([w.w])));
   const a=h('div','a');a.append(optsEl(shuffle([last,...letterDistract(last,[3,3,4,4,4][D.b]-1,set,D.b>=2)]),caseUnit,(l,b)=>{TTS.say([LN[l]]);
     if(l===last){b.classList.add('right');word.querySelector('.blank').textContent=caseUnit(l);api.ok([w.w]);}else api.bad(b);}));st.append(q,a);}},
 {id:'tnama',title:'Tebak Nama Benda',c:'sun',ins:'Apa nama gambar ini?',art:ems(['🥕'])+'<span class="br"></span>'+chips(['?']),
  fn(st,api,D){const w=takeWord(D,HASE);const q=h('div','q');q.append(P(w.e));
   const a=h('div','a');a.append(optsEl(shuffle([w,...distract(w,OPT[D.b]-1,D)]),x=>caseWord(x.w),(x,b)=>{if(x===w){b.classList.add('right');api.ok([w.w]);}else{TTS.say([x.w]);api.bad(b);}}));st.append(q,a);}},
 {id:'pasang',title:'Pasangkan Suara',c:'mint',ins:'Dengarkan suaranya, lalu pilih katanya.',art:chips(['Sapi'])+ems(['🔊'])+'<span class="br"></span>'+chips(['Lemon'])+ems(['🔊']),
  fn(st,api,D){matchGame(st,api,pickDistinct(D,[2,2,3,3,3][D.b],x=>x.w.length<=9),()=>IC.spk,w=>TTS.say([w.w]),'spkb');}},
 {id:'awal',title:'Tebak Huruf Awal Kata',c:'sky',ins:'Huruf apa di awal kata?',art:ems(['🥕'])+'<span class="br"></span>'+chips(['L','M','W']),
  fn(st,api,D){const w=takeWord(D,x=>LET(x)&&(D.b>=3||HASE(x)));const first=w.w[0];const q=h('div','q');if(w.e)q.append(P(w.e));q.append(spkBtn(()=>TTS.say([w.w]),!w.e));
   const a=h('div','a');a.append(optsEl(shuffle([first,...letterDistract(first,OPT[D.b]-1,'abcdefghijklmnoprstuwyz'.split(''),D.b>=2)]),l=>l.toUpperCase(),(l,b)=>{TTS.say([LN[l]]);
     if(l===first){b.classList.add('right');api.ok([w.w]);}else api.bad(b);}));st.append(q,a);return [w.w];}},
 {id:'cari',title:'Cari Kata',c:'pink',ins:'Cari kata ini di kotak huruf. Ketuk hurufnya berurutan.',art:ems(['🍊'])+'<span class="br"></span>'+chips(['J','U','K']),
  fn(st,api,D){const w=takeWord(D,x=>LET(x)&&x.w.length>=3&&x.w.length<=4);const T=w.w.toUpperCase();const N=4;
   const grid=Array(N*N).fill(null);const d=pick(D.b<2?[[0,1]]:[[0,1],[1,0]]);
   const r0=d[0]?rnd()*(N-T.length+1)|0:rnd()*N|0,c0=d[1]?rnd()*(N-T.length+1)|0:rnd()*N|0;
   for(let i=0;i<T.length;i++)grid[(r0+d[0]*i)*N+c0+d[1]*i]=T[i];
   const AL=D.b>=3?(T+'AEIOU').split(''):'ABDEGHIJKLMNOPRSTUWY'.split('');for(let i=0;i<grid.length;i++)if(!grid[i])grid[i]=pick(AL);
   const q=h('div','q');if(w.e)q.append(P(w.e));q.append(h('div','chipw',caseWord(w.w)),spkBtn(()=>TTS.say([w.w])));
   const ws=h('div','ws');ws.style.gridTemplateColumns=`repeat(${N},auto)`;let sel=[],dir=null;const cells=[];
   const clear=()=>{sel.forEach(j=>cells[j].classList.remove('sel'));sel=[];dir=null;};
   grid.forEach((ch,i)=>{const b=h('button','',ch);cells.push(b);
     b.onclick=()=>{if(G.done)return;TTS.say([LN[ch.toLowerCase()]]);if(sel.includes(i)){clear();return;}
       const k=sel.length,r=i/N|0,c=i%N;let okStep=ch===T[k];
       if(okStep&&k>=1){const p=sel[k-1],pr=p/N|0,pc=p%N;
         if(k===1){const dr=r-pr,dc=c-pc;if((dr===0&&dc===1)||(dr===1&&dc===0))dir=[dr,dc];else okStep=false;}
         else if(r!==pr+dir[0]||c!==pc+dir[1])okStep=false;}
       if(!okStep){if(ch===T[0]){clear();sel=[i];b.classList.add('sel');return;}clear();api.bad(b);return;}
       sel.push(i);b.classList.add('sel');if(sel.length===T.length){sel.forEach(j=>cells[j].classList.add('found'));api.ok([w.w]);}};ws.append(b);});
   const a=h('div','a');a.append(ws);st.append(q,a);}},
 {id:'urutk',title:'Urutkan Huruf Konsonan',c:'mint',ins:'Suku kata apa yang hilang?',art:chips(['ba','bi','?','be','bo']),
  fn(st,api,D){const bases=[['b','m','p','s','t'],['d','k','l','n','r'],['g','j','h','c','w'],['f','y','z','ng','ny'],[...CVORDER,'ng','ny']][D.b];
   const fresh=bases.filter(x=>!D.used.has(x));const c=bySeg(D,fresh.length?fresh:bases);D.used.add(c);const seq=VOW.map(v=>c+v);
   const miss=sample([0,1,2,3,4],[1,1,1,2,2][D.b]).sort();const left=new Set(miss);
   const total=Math.max(OPT[D.b],miss.length+1);const others=[...CV,'ng','ny'].filter(x=>x!==c);const dis=[];let guard=0;
   while(dis.length<total-miss.length&&guard++<50){const o=pick(others)+VOW[pick(miss)];if(!dis.includes(o)&&!seq.includes(o))dis.push(o);}
   const q=h('div','q');const row=h('div','slots');seq.forEach((s,i)=>row.append(h('div','slot'+(left.has(i)?'':' fill'),left.has(i)?'?':caseUnit(s))));
   q.append(row,spkBtn(()=>TTS.say(seq.map((s,i)=>left.has(i)?'hmm':s),{rate:.75})));
   const a=h('div','a');a.append(optsEl(shuffle([...miss.map(k=>seq[k]),...dis]),caseUnit,(s,b)=>{TTS.say([s]);const k=seq.indexOf(s);
     if(left.has(k)){left.delete(k);b.classList.add('right');b.disabled=true;const sl=row.children[k];sl.textContent=caseUnit(s);sl.classList.add('fill','pop');if(!left.size)api.ok(seq);}else api.bad(b);}));
   st.append(q,a);}},
 {id:'uruth',title:'Urutkan Huruf',c:'grape',ins:'Dengarkan katanya, lalu susun hurufnya.',art:chips(['S','?','?','?'])+'<span class="br"></span>'+chips(['A','P','U']),
  fn(st,api,D){const w=takeWord(D,x=>LET(x)&&x.w.length<=maxLen[D.b]);const ex=sample('abdeghiklmnoprstu'.split('').filter(l=>!w.w.includes(l)),[0,0,0,1,1][D.b]);
   arrange(st,api,{word:w,target:[...w.w],pieces:shuffle([...w.w,...ex]),prefill:[1,1,1,0,0][D.b],pic:false,upper:true});return [w.w];}},
 {id:'bacaan',title:'Puzzle Bacaan Benda',c:'coral',ins:'Baca katanya, lalu pilih gambarnya.',art:chips(['Monyet'])+'<span class="br"></span>'+ems(['🐒','🍊']),
  fn(st,api,D){const w=takeWord(D,HASE);const q=h('div','q');q.append(h('div','qword'+(w.w.length>9?' long':''),SET.case==='upper'?w.w.toUpperCase():cap(w.w)));
   const a=h('div','a');a.append(optsEl(shuffle([w,...distract(w,OPT[D.b]-1,D,HASE)]),x=>ico(x.e),(x,b)=>{if(x===w){b.classList.add('right');api.ok([w.w]);}else{TTS.say([x.w]);api.bad(b);}},'pic'));st.append(q,a);}},
 {id:'jumlah',title:'Tebak Jumlah Huruf',c:'berry',ins:'Ada berapa huruf di kata ini?',art:chips(['?'])+'<span class="br"></span>'+chips(['3','4','5']),
  fn(st,api,D){const w=takeWord(D,x=>LET(x)&&x.w.length<=8);const n=w.w.length;const q=h('div','q');if(w.e)q.append(P(w.e));
   if(D.b<2){const lb=h('div','lboxes');[...w.w].forEach((ch,i)=>{const s=h('span','',casePart(ch,i));s.style.color=COL[i%6];lb.append(s);});q.append(lb);}else q.append(h('div','qword',caseWord(w.w)));
   q.append(spkBtn(()=>TTS.say([w.w])));const cnt=[3,3,4,4,4][D.b];const start=Math.max(1,n-(rnd()*cnt|0));
   const a=h('div','a');a.append(optsEl(Array.from({length:cnt},(_,i)=>start+i),x=>x,(x,b)=>{if(x===n){b.classList.add('right');api.ok([n+' huruf']);}else{TTS.say([String(x)]);api.bad(b);}}));st.append(q,a);}}
];
function buildGameCards(){buildCards($('#gameCards'),GAMES,openLevels,g=>{const s=gameStars(g.id);return s?`<span class="badge">⭐ ${s}/75</span>`:'';});}

