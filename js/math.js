/* ============ hitung: number words, visuals, shared question helpers, number games ============ */
const NUMW=['nol','satu','dua','tiga','empat','lima','enam','tujuh','delapan','sembilan','sepuluh','sebelas'];
// number as Indonesian words (0–100), so TTS never depends on the voice reading digits
const numW=n=>n<12?NUMW[n]:n<20?NUMW[n-10]+' belas':n>=100?'seratus':NUMW[n/10|0]+' puluh'+(n%10?' '+NUMW[n%10]:'');
const COUNTEMO=['🍎','🍊','🍌','🍓','🍒','🐟','🐥','⭐','🎈','🌸','🐞','🦋','🧁','🐱','🚗','🐶','🍩','🦆'].filter(e=>EMO.has(nk(e)));
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const rint=(a,b)=>a+(rnd()*(b-a+1)|0);
// digits colored by place (ones pink, tens lilac, hundreds sky), the same everywhere so the child sees the positions
const numHtml=n=>[...String(n)].map((d,i,a)=>`<span class="d${a.length-i}">${d}</span>`).join('');
const numEl=(n,cls='mnum')=>h('div',cls,numHtml(n));
// n pictures in rows of `cols`; the last `cross` ones are crossed out (subtraction)
function objsEl(n,e,{cols=5,cross=0,cls=''}={}){const o=h('div','objs '+cls+(n>10?' many':''));o.style.gridTemplateColumns=`repeat(${Math.max(1,Math.min(n,cols))},auto)`;
  for(let i=0;i<n;i++)o.append(h('span',i>=n-cross?'cx':'',ico(e)));return o;}
// ten frames (rows of 5): `a` pink dots, then `b` mint dots; the last `cross` of a are crossed out
function framesEl(a,b=0,{cross=0,size=10,frames=0,cls=''}={}){const w=h('div','frames '+cls),tot=a+b,n=frames||Math.max(1,Math.ceil(tot/size));
  for(let f=0;f<n;f++){const fr=h('div','frame'+(size===5?' five':''));
    for(let i=0;i<size;i++){const k=f*size+i;fr.append(h('i',k<a?(k>=a-cross?'a cx':'a'):k<tot?'b':''));}w.append(fr);}return w;}
// single cube i of a stack, filled bottom-up in columns of 5
const cubeEl=(i,cls='',tag='span')=>{const c=h(tag,'cube'+cls);c.style.gridArea=`${5-i%5}/${1+(i/5|0)}`;return c;};
// base-ten blocks: rods of ten + single cubes; the last crossT rods / crossU cubes are crossed out
function blocksEl(n,{crossT=0,crossU=0,cls=''}={}){const b=h('div','blocks '+cls),t=n/10|0,u=n%10;
  b.rods=h('div','rods');b.cubes=h('div','cubes');
  for(let i=0;i<t;i++)b.rods.append(h('span','rod'+(i>=t-crossT?' cx':''),'<i></i>'.repeat(10)));
  for(let i=0;i<u;i++)b.cubes.append(cubeEl(i,i>=u-crossU?' cx':''));
  if(t)b.append(b.rods);if(u)b.append(b.cubes);return b;}
// the right picture for an amount: objects up to 10, ten frames up to 20, blocks beyond
const qtyEl=(n,e,sm)=>n<=10?objsEl(n,e,{cls:sm?'sm':''}):n<=20?framesEl(n,0,{cls:sm?'sm':''}):blocksEl(n,{cls:sm?'sm':''});
const mrow=(...els)=>{const r=h('div','mrow');r.append(...els);return r;};
const msign=t=>h('div','msign',t);
const opWord=op=>op==='+'?'tambah':'kurang';
const opSign=op=>op==='+'?'+':'−';
// picture for a sum: objects up to 10, ten frames up to 20, blocks for tens
function opVisual(a,b,op,e){const top=op==='+'?a+b:a;
  if(top<=10)return op==='+'?mrow(objsEl(a,e),msign('+'),objsEl(b,e)):mrow(objsEl(a,e,{cross:b}));
  if(top<=20)return op==='+'?framesEl(a,b):framesEl(a,0,{cross:b});
  return op==='+'?mrow(blocksEl(a),msign('+'),blocksEl(b)):blocksEl(a,{crossT:b/10|0,crossU:b%10});}

/* --- level ladder: 25 levels from "1 2 3" to 100 --- */
const NUMR=[[1,3],[1,4],[1,5],[1,5],[1,6],[1,7],[1,8],[1,9],[1,10],[0,10],[10,13],[10,15],[11,19],[11,20],[1,20],
  [20,30],[20,40],[10,50],[30,60],[1,60],[50,80],[60,100],[20,100],[1,100],[1,100]];
const numRange=D=>NUMR[D.L-1];
const maxCount=D=>[3,4,5,5,6,7,8,9,10,10][Math.min(9,D.L-1)];
// amounts shown as pictures: up to 10 objects, then ten frames (teens), then blocks (20–100)
const QTYR=[[10,13],[10,15],[11,18],[11,20],[11,20]];
const qtyRange=D=>D.L<=10?[1,maxCount(D)]:D.L<=15?QTYR[D.L-11]:[21,NUMR[D.L-1][1]];

// numbers lo..hi, easiest first within a level (bySeg walks the list as questions advance)
function takeNum(D,lo,hi){const all=range(lo,hi),fr=all.filter(n=>!D.used.has(n));const n=bySeg(D,fr.length?fr:all);D.used.add(n);return n;}
// numbers a child mixes up with n: swapped digits (12/21), belas vs puluh (12/20/22), the tens, ±10, ±1
function confusers(n){const t=n/10|0,u=n%10,c=[];
  if(n>=10&&n<100){if(u&&u!==t)c.push(u*10+t);c.push(t>=2?10+u:u*10,u?t*10:n+1,u&&t===1?u*11:n+10);}
  c.push(n+10,n-10,n+1,n-1);return [...new Set(c)].filter(x=>x>=0&&x<=100&&x!==n);}
// wrong number choices: random early, look-alike later; `step` keeps them on the same grid (e.g. tens); shown ascending
function numOpts(ans,cnt,lo,hi,similar,step=1){let c=range(lo,hi).filter(x=>x!==ans&&(x-lo)%step===0);
  if(similar){const cf=shuffle(confusers(ans).filter(x=>c.includes(x)));c=[...cf,...shuffle(c.filter(x=>!cf.includes(x))).sort((x,y)=>Math.abs(x-ans)-Math.abs(y-ans))].slice(0,cnt-1);}
  else c=sample(c,cnt-1);return [ans,...c].sort((x,y)=>x-y);}
const numBtns=(st,api,q,ans,list,onRight)=>{const a=h('div','a');
  a.append(optsEl(list,String,(n,b)=>{if(n===ans){b.classList.add('right');onRight&&onRight();api.ok();}else{TTS.say([numW(n)]);api.bad(b);}}));st.append(q,a);};

// a op b for an arithmetic level 1–25: ≤5 → ≤10 (pictures), ≤10 numbers only, ten-and-some, ≤20, tens, two digits without carrying
function opPair(L,op){let a,b;const add=op==='+';
  if(L<=15){const top=L<=5?[3,4,5,5,5][L-1]:L<=10?[6,7,8,9,10][L-6]:10;if(add){a=rint(1,top-1);b=rint(1,top-a);}else{a=rint(2,top);b=rint(1,a-1);}}
  else if(L<=17){if(add){a=10;b=rint(1,9);if(rnd()<.5)[a,b]=[b,a];}else{a=rint(11,19);b=rnd()<.5?a-10:rint(1,a-10);}}
  else if(L<=20){if(add){a=rint(2,12);b=rint(2,20-a);}else{a=rint(11,20);b=rint(2,a-2);}}
  else if(L<=22){if(add){a=10*rint(1,8);b=10*rint(1,10-a/10);}else{a=10*rint(2,10);b=10*rint(1,a/10-1);}}
  else if(L===23){if(add){a=rint(11,89);b=10*rint(1,(99-a)/10|0);}else{a=rint(21,99);b=10*rint(1,(a/10|0)-1);}}
  else if(add){a=10*rint(1,8)+rint(0,7);b=rint(1,9-a%10);}else{a=10*rint(1,9)+rint(1,9);b=rint(1,a%10);}
  return [a,b];}
// pictures help up to 10 and again for teens/tens; levels 11–15 and two-digit sums are numbers only
const opPicLevel=L=>L<=10||(L>=16&&L<=22);
function opQ(D,op,L=D.L,cnt=OPT[D.b]){let a,b,guard=0;
  do{[a,b]=opPair(L,op);}while(D.used.has(a+op+b)&&guard++<30);
  D.used.add(a+op+b);const r=op==='+'?a+b:a-b;
  const say=[`${numW(a)} ${opWord(op)} ${numW(b)}, sama dengan berapa?`];
  const q=h('div','q');if(opPicLevel(L))q.append(opVisual(a,b,op,pick(COUNTEMO)));
  const ex=h('div','meq',`${a} ${opSign(op)} ${b} = <span class="blank">?</span>`);q.append(ex,spkBtn(()=>TTS.say(say)));
  const span=L<=5?3:L<=15?5:L<=20?6:20;
  return {q,ans:r,list:numOpts(r,cnt,Math.max(0,r-span),Math.min(100,r+span),L>=8),say,onRight:()=>{ex.querySelector('.blank').textContent=r;}};}
function opQuestion(st,api,D,op){const o=opQ(D,op);numBtns(st,api,o.q,o.ans,o.list,o.onRight);return o.say;}

const MATH_GAMES=[
 {id:'mhitung',title:'Hitung Benda',c:'mint',ins:'Ada berapa gambar?',art:ems(['🐥','🐥','🐥'])+'<span class="br"></span>'+chips(['2','3','4']),
  fn(st,api,D){const [lo,hi]=qtyRange(D),n=takeNum(D,D.L>=6&&D.L<=10?3:lo,hi);const q=h('div','q');q.append(qtyEl(n,pick(COUNTEMO)));
   numBtns(st,api,q,n,numOpts(n,OPT[D.b],Math.max(1,lo-3),Math.min(100,hi+3),D.L>=8));}},
 {id:'msuara',title:'Tebak Suara Angka',c:'lilac',ins:'Dengarkan, lalu pilih angkanya.',art:ems(['🔊'])+'<span class="br"></span>'+chips(['12','20','22']),
  fn(st,api,D){const [lo,hi]=numRange(D),n=takeNum(D,lo,hi);const q=h('div','q');q.append(spkBtn(()=>TTS.say([numW(n)]),true));
   numBtns(st,api,q,n,numOpts(n,OPT[D.b],Math.max(0,lo-2),Math.min(100,hi+2),D.L>=6));return [numW(n)];}},
 {id:'mbanyak',title:'Mana Lebih Banyak',c:'peach',ins:'Ayo bandingkan.',art:ems(['🍎','🍎','🍎'])+'<span class="br"></span>'+ems(['🍎']),
  fn(st,api,D){const [lo,hi]=qtyRange(D);let x,y;
   if(D.L<=15){const gap=Math.max(1,[4,3,2,1,1][D.b]-(D.q>=3?1:0));x=lo+(rnd()*(hi-lo-gap+1)|0);y=Math.min(hi,x+gap+(rnd()*Math.min(2,hi-x-gap+1)|0));}
   else{x=takeNum(D,lo,hi);const near=confusers(x).filter(n=>n>=lo&&n<=hi);const far=range(lo,hi).filter(n=>Math.abs(n-x)>=5);y=near.length&&D.L>=21?pick(near):far.length?pick(far):x===hi?x-1:x+1;}
   const more=D.b<2||rnd()<.5,ans=more?Math.max(x,y):Math.min(x,y),txt=more?'Mana yang lebih banyak?':'Mana yang lebih sedikit?',e=pick(COUNTEMO);
   const q=h('div','q');q.append(h('div','chipw',more?'Lebih banyak':'Lebih sedikit'),spkBtn(()=>TTS.say([txt])));
   const a=h('div','a');a.append(optsEl(shuffle([x,y]),n=>qtyEl(n,e).outerHTML,(n,b)=>{if(n===ans){b.classList.add('right');api.ok();}else api.bad(b);},'pic grp'));
   st.append(q,a);return [txt];}},
 {id:'murut',title:'Angka Hilang',c:'sky',ins:'Angka berapa yang hilang?',art:chips(['1','2','?','4','5']),
  fn(st,api,D){const L=D.L;let step=1,top;
   if(L<=5)top=[5,6,7,8,10][L-1];else if(L<=10)top=20;else if(L<=15)top=50;else if(L<=20)top=100;else{step=L<=23?[2,5,10][L-21]:pick([2,5,10]);top=step===2?30:100;}
   const s0=step*takeNum(D,step>1?0:1,top/step-4),seq=range(0,4).map(i=>s0+i*step);
   const left=new Set(sample(L>=8?[0,1,2,3,4]:[1,2,3],L>=11?2:1));
   const ans=[...left].map(k=>seq[k]);
   const dis=sample(range(Math.max(0,s0-3*step),s0+7*step).filter(n=>(n-s0)%step===0&&!seq.includes(n)&&n<=100),Math.max(OPT[D.b],ans.length+1)-ans.length);
   const q=h('div','q'),row=h('div','slots');seq.forEach((n,i)=>row.append(h('div','slot'+(left.has(i)?'':' fill'),left.has(i)?'?':String(n))));
   q.append(row,spkBtn(()=>TTS.say(seq.map((n,i)=>left.has(i)?'hmm':numW(n)),{rate:.75})));
   const a=h('div','a');a.append(optsEl([...ans,...dis].sort((x,y)=>x-y),String,(n,b)=>{TTS.say([numW(n)]);const k=seq.indexOf(n);
     if(left.has(k)){left.delete(k);b.classList.add('right');b.disabled=true;const sl=row.children[k];sl.textContent=n;sl.classList.add('fill','pop');if(!left.size)api.ok();}else api.bad(b);}));
   st.append(q,a);}},
 {id:'mtambah',title:'Penjumlahan',c:'sun',ins:'Ayo menjumlah.',art:chips(['1','+','2','=','?']),fn(st,api,D){return opQuestion(st,api,D,'+');}},
 {id:'mkurang',title:'Pengurangan',c:'coral',ins:'Ayo mengurangi.',art:chips(['3','−','1','=','?']),fn(st,api,D){return opQuestion(st,api,D,'-');}},
 {id:'mpasang',title:'Sambung Angka',c:'rose',ins:'Pilih gambar, lalu pilih angkanya.',art:ems(['🐟','🐟'])+chips(['2'])+'<span class="br"></span>'+ems(['🐟'])+chips(['1']),
  fn(st,api,D){const [lo,hi]=qtyRange(D),e=pick(COUNTEMO),ns=sample(range(lo,hi),[2,2,3,3,3][D.b]);
   matchGame(st,api,ns.map(n=>({w:String(n),say:numW(n),n})),x=>qtyEl(x.n,e,true).outerHTML,null,'grp');}}
];
const buildMathLearnCards=()=>buildLearnCards($('#mathLearnCards'),MATH_STAGES);
function buildMathGameCards(){buildCards($('#mathGameCards'),MATH_GAMES,openLevels,starBadge);}
