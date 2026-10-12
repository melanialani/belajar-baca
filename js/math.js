/* ============ berhitung: angka, belajar + game ============ */
const NUMW=['nol','satu','dua','tiga','empat','lima','enam','tujuh','delapan','sembilan','sepuluh','sebelas'];
// number as Indonesian words (0–20), so TTS never depends on the voice reading digits
const numW=n=>n<12?NUMW[n]:n<20?NUMW[n-10]+' belas':n===20?'dua puluh':String(n);
const COUNTEMO=['🍎','🍊','🍌','🍓','🍒','🐟','🐥','⭐','🎈','🌸','🐞','🦋','🧁','🐱','🚗','🐶','🍩','🦆'].filter(e=>EMO.has(nk(e)));
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
// n pictures in rows of `cols`; the last `cross` ones are crossed out (subtraction)
function objsEl(n,e,{cols=5,cross=0,cls=''}={}){const o=h('div','objs '+cls+(n>10?' many':''));o.style.gridTemplateColumns=`repeat(${Math.max(1,Math.min(n,cols))},auto)`;
  for(let i=0;i<n;i++)o.append(h('span',i>=n-cross?'x':'',ico(e)));return o;}
const mrow=(...els)=>{const r=h('div','mrow');r.append(...els);return r;};
const msign=t=>h('div','msign',t);
const opWord=op=>op==='+'?'tambah':'kurang';

/* --- Belajar angka --- */
function numItem(n,cols){const e=COUNTEMO[(n-1)%COUNTEMO.length];
  return {k:'num',n,e,label:String(n),say:n<=10?[numW(n),...range(1,n).map(numW)]:[numW(n),'sepuluh tambah '+numW(n-10)],
    render(c){const num=h('div','mnum',String(n));const o=objsEl(n,e,{cols});c.append(mrow(num,o));return n<=10?[num,...o.children]:[num,o];}};}
function opItem(a,b,op){const e=COUNTEMO[(a*3+b)%COUNTEMO.length],r=op==='+'?a+b:a-b;
  return {k:'op',e,label:`${a} ${op==='+'?'+':'−'} ${b}`,say:[`${numW(a)} ${opWord(op)} ${numW(b)}`,'sama dengan '+numW(r)],
    render(c){const pics=op==='+'?mrow(objsEl(a,e),msign('+'),objsEl(b,e)):mrow(objsEl(a,e,{cross:b}));
      const ex=h('div','meq',`${a} ${op==='+'?'+':'−'} ${b}`),res=h('div','meq res',`= ${r}`);c.append(pics,mrow(ex,res));return [ex,res];}};}
const ADDS=[[1,1],[2,1],[1,2],[3,1],[2,2],[1,3],[4,1],[3,2],[2,3],[1,4]];
const SUBS=[[2,1],[3,1],[3,2],[4,1],[4,2],[4,3],[5,1],[5,2],[5,3],[5,4]];
const MATH_STAGES=[
 {id:'m1',home:'berhitung',title:'Angka 1–10',c:'mint',art:chips(['1','2','3'])+'<span class="br"></span>'+ems(['🍎','🍎','🍎']),play:[['mhitung',1],['msuara',1],['mpasang',1]],items:()=>range(1,10).map(n=>numItem(n,5))},
 {id:'m2',home:'berhitung',title:'Angka 11–20',c:'sky',art:chips(['11','15','20']),play:[['msuara',16],['murut',16],['mbanyak',11]],items:()=>range(11,20).map(n=>numItem(n,10))},
 {id:'m3',home:'berhitung',title:'Penjumlahan',c:'sun',art:chips(['2','+','1'])+'<span class="br"></span>'+ems(['🍓','🍓','🍓']),play:[['mtambah',1],['mhitung',6],['mpasang',6]],items:()=>ADDS.map(([a,b])=>opItem(a,b,'+'))},
 {id:'m4',home:'berhitung',title:'Pengurangan',c:'coral',art:chips(['3','−','1'])+'<span class="br"></span>'+ems(['🎈','🎈']),play:[['mkurang',1],['mbanyak',6],['murut',6]],items:()=>SUBS.map(([a,b])=>opItem(a,b,'-'))}
];

/* --- Game angka (same level engine + feedback as the reading games) --- */
// numbers lo..hi, easiest first within a level (bySeg walks the list as questions advance)
function takeNum(D,lo,hi){const all=range(lo,hi),fr=all.filter(n=>!D.used.has(n));const n=bySeg(D,fr.length?fr:all);D.used.add(n);return n;}
// wrong number choices: random ones early, close/look-alike ones in later bands; shown in ascending order
function numOpts(ans,cnt,lo,hi,similar){let c=range(lo,hi).filter(x=>x!==ans);
  if(similar)c=shuffle(c).sort((x,y)=>Math.abs(x-ans)-Math.abs(y-ans)).slice(0,cnt-1);else c=sample(c,cnt-1);return [ans,...c].sort((x,y)=>x-y);}
const numBtns=(st,api,q,ans,list,onRight)=>{const a=h('div','a');
  a.append(optsEl(list,String,(n,b)=>{if(n===ans){b.classList.add('right');onRight&&onRight();api.ok();}else{TTS.say([numW(n)]);api.bad(b);}}));st.append(q,a);};
const maxCount=D=>Math.min(10,3+Math.ceil(D.L*7/25)); // 4 → 10 pictures over the 25 levels
const maxNum=[5,10,10,15,20];
function opQ(D,op){
  const top=[4,5,7,10,10][D.b];let a,b,guard=0;
  do{if(op==='+'){a=1+(rnd()*(top-1)|0);b=1+(rnd()*(top-a)|0);}else{a=2+(rnd()*(top-1)|0);b=1+(rnd()*(a-1)|0);}}while(D.used.has(a+op+b)&&guard++<30);
  D.used.add(a+op+b);const r=op==='+'?a+b:a-b,e=pick(COUNTEMO),sign=op==='+'?'+':'−';
  const say=[`${numW(a)} ${opWord(op)} ${numW(b)}, sama dengan berapa?`];
  const q=h('div','q');
  if(D.b<4)q.append(op==='+'?mrow(objsEl(a,e),msign('+'),objsEl(b,e)):mrow(objsEl(a,e,{cross:b})));
  const ex=h('div','meq',`${a} ${sign} ${b} = <span class="blank">?</span>`);q.append(ex,spkBtn(()=>TTS.say(say)));
  return {q,ans:r,list:numOpts(r,OPT[D.b],op==='+'?2:0,top,D.b>=2),say,onRight:()=>{ex.querySelector('.blank').textContent=r;}};}
function opQuestion(st,api,D,op){const o=opQ(D,op);numBtns(st,api,o.q,o.ans,o.list,o.onRight);return o.say;}

const MATH_GAMES=[
 {id:'mhitung',home:'berhitung',title:'Hitung Benda',c:'mint',ins:'Ada berapa gambar?',art:ems(['🐥','🐥','🐥'])+'<span class="br"></span>'+chips(['2','3','4']),
  fn(st,api,D){const max=maxCount(D),n=takeNum(D,D.b>=3?3:1,max);const q=h('div','q');q.append(objsEl(n,pick(COUNTEMO)));
   numBtns(st,api,q,n,numOpts(n,OPT[D.b],1,max,D.b>=2));}},
 {id:'msuara',home:'berhitung',title:'Tebak Suara Angka',c:'lilac',ins:'Dengarkan, lalu pilih angkanya.',art:ems(['🔊'])+'<span class="br"></span>'+chips(['3','7','9']),
  fn(st,api,D){const max=maxNum[D.b],n=takeNum(D,D.b>=3?6:1,max);const q=h('div','q');q.append(spkBtn(()=>TTS.say([numW(n)]),true));
   numBtns(st,api,q,n,numOpts(n,OPT[D.b],1,max,D.b>=2));return [numW(n)];}},
 {id:'mbanyak',home:'berhitung',title:'Mana Lebih Banyak',c:'peach',ins:'Ayo bandingkan.',art:ems(['🍎','🍎','🍎'])+'<span class="br"></span>'+ems(['🍎']),
  fn(st,api,D){const max=maxCount(D),gap=Math.max(1,[4,3,2,1,1][D.b]-(D.q>=3?1:0));
   const x=1+(rnd()*(max-gap)|0),y=Math.min(max,x+gap+(rnd()*Math.min(2,max-x-gap+1)|0));
   const more=D.b<2||rnd()<.5,ans=more?y:x,txt=more?'Mana yang lebih banyak?':'Mana yang lebih sedikit?',e=pick(COUNTEMO);
   const q=h('div','q');q.append(h('div','chipw',more?'Lebih banyak':'Lebih sedikit'),spkBtn(()=>TTS.say([txt])));
   const a=h('div','a');a.append(optsEl(shuffle([x,y]),n=>objsEl(n,e).outerHTML,(n,b)=>{if(n===ans){b.classList.add('right');api.ok();}else api.bad(b);},'pic grp'));
   st.append(q,a);return [txt];}},
 {id:'murut',home:'berhitung',title:'Angka Hilang',c:'sky',ins:'Angka berapa yang hilang?',art:chips(['1','2','?','4','5']),
  fn(st,api,D){const end=maxNum[D.b],s0=takeNum(D,1,end-4),seq=range(s0,s0+4);
   const left=new Set(sample(D.b>=3?[0,1,2,3,4]:D.b>=2?[0,1,2,3]:[1,2,3],[1,1,1,2,2][D.b]));
   const ans=[...left].map(k=>seq[k]),dis=sample(range(Math.max(1,s0-3),s0+7).filter(n=>!seq.includes(n)),Math.max(OPT[D.b],ans.length+1)-ans.length);
   const q=h('div','q'),row=h('div','slots');seq.forEach((n,i)=>row.append(h('div','slot'+(left.has(i)?'':' fill'),left.has(i)?'?':String(n))));
   q.append(row,spkBtn(()=>TTS.say(seq.map((n,i)=>left.has(i)?'hmm':numW(n)),{rate:.75})));
   const a=h('div','a');a.append(optsEl([...ans,...dis].sort((x,y)=>x-y),String,(n,b)=>{TTS.say([numW(n)]);const k=seq.indexOf(n);
     if(left.has(k)){left.delete(k);b.classList.add('right');b.disabled=true;const sl=row.children[k];sl.textContent=n;sl.classList.add('fill','pop');if(!left.size)api.ok();}else api.bad(b);}));
   st.append(q,a);}},
 {id:'mtambah',home:'berhitung',title:'Penjumlahan',c:'sun',ins:'Ayo menjumlah.',art:chips(['1','+','2','=','?']),fn(st,api,D){return opQuestion(st,api,D,'+');}},
 {id:'mkurang',home:'berhitung',title:'Pengurangan',c:'coral',ins:'Ayo mengurangi.',art:chips(['3','−','1','=','?']),fn(st,api,D){return opQuestion(st,api,D,'-');}},
 {id:'mpasang',home:'berhitung',title:'Sambung Angka',c:'rose',ins:'Pilih gambar, lalu pilih angkanya.',art:ems(['🐟','🐟'])+chips(['2'])+'<span class="br"></span>'+ems(['🐟'])+chips(['1']),
  fn(st,api,D){const max=maxCount(D),e=pick(COUNTEMO),ns=sample(range(1,max),[2,2,3,3,3][D.b]);
   matchGame(st,api,ns.map(n=>({w:String(n),say:numW(n),n})),x=>objsEl(x.n,e,{cls:'sm'}).outerHTML,null,'grp');}}
];
function buildMathCards(){buildCards($('#mathCards'),[...MATH_STAGES,...MATH_GAMES],m=>m.items?openStage(m):openLevels(m),m=>{
  if(m.items){const tot=m.items().length,got=Math.min(tot,store.get('lp:'+m.id,0));return `<span class="num">${ico('📚')}</span>`+(got>=tot?'<span class="badge">✓</span>':got>0?`<span class="badge">${got}/${tot}</span>`:'');}
  const s=gameStars(m.id);return `<span class="num">${ico('🎮')}</span>`+(s?`<span class="badge">⭐ ${s}/75</span>`:'');});}
