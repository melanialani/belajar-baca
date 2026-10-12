/* ============ belajar hitung: number stages, from 1–5 up to sums with tens ============ */
const BR='<span class="br"></span>';
const emoOf=n=>COUNTEMO[((n-1)%COUNTEMO.length+COUNTEMO.length)%COUNTEMO.length];
// picture with a small number under it (10 and 2 in "12 = 10 and 2")
const labeled=(el,t)=>{const w=h('div','glab');w.append(el,h('span','',numHtml(t)));return w;};

// 1–10: the numeral, then count every picture
function numItem(n){const e=emoOf(n);
  return {k:'num',n,e,label:String(n),say:[numW(n),...range(1,n).map(numW)],
    render(c){const num=numEl(n),o=objsEl(n,e);c.append(mrow(num,o));return [num,...o.children];}};}
function zeroItem(){return {k:'num',n:0,e:'🍽️',label:'0',say:['nol','nol artinya tidak ada','piringnya kosong'],
  render(c){const num=numEl(0),p=h('div','pic',ico('🍽️'));c.append(mrow(num,p));return [num,num,p];}};}
// 11–19: a full ten plus some more, so "dua belas" is ten and two
function teenItem(n){const e=emoOf(n),u=n-10;
  return {k:'num',n,e,label:String(n),say:[numW(n),'sepuluh','dan '+numW(u),numW(n)],
    render(c){const num=numEl(n),ten=labeled(objsEl(10,e,{cls:'many'}),10),one=labeled(objsEl(u,e,{cls:'many'}),u);
      c.append(num,mrow(ten,msign('+'),one));return [num,ten,one];}};}
// tens: count the rods "sepuluh, dua puluh, ..."; 10 itself shows ten pictures becoming one rod
function tensItem(n){const t=n/10;
  if(t===1){const e=emoOf(10);return {k:'num',n,e,label:'10',say:['sepuluh','ada sepuluh','jadi satu batang sepuluh'],
    render(c){const num=numEl(10),o=objsEl(10,e,{cls:'many'}),b=blocksEl(10);c.append(num,mrow(o,msign('='),b));return [num,o,b];}};}
  return {k:'num',n,label:String(n),say:[numW(n),...range(1,t).map(k=>numW(k*10)),numW(n)],
    render(c){const num=numEl(n),b=blocksEl(n);c.append(mrow(num,b));return [num,...b.rods.children];}};}
// 21–100: tens rods and single cubes, read as "dua puluh, dan dua"
function bigItem(n){if(n%10===0)return tensItem(n);const t=n-n%10,u=n%10;
  return {k:'num',n,label:String(n),say:[numW(n),numW(t),'dan '+numW(u),numW(n)],
    render(c){const num=numEl(n),b=blocksEl(n),r=labeled(b.rods,t),cu=labeled(b.cubes,u);b.replaceChildren(r,cu);c.append(mrow(num,b));return [num,r,cu];}};}
// 2 · 12 · 20 · 22: the same digit, read differently by its place (1 uses se-: sebelas, sepuluh, seratus)
function readItem(d){const ns=d===1?[1,11,10,100]:[d,10+d,d*10,d*11];
  return {k:'num',label:ns.join(' · '),say:ns.map(numW),
    render(c){const row=h('div','rcards'),hl=ns.map(n=>{const b=h('div','rcard',`<div class="mnum">${numHtml(n)}</div><div class="rw">${caseWord(numW(n))}</div>`);row.append(b);return b;});
      c.append(row);return hl;}};}
// more / fewer / same, with both amounts counted
function cmpItem(a,b,kind){const e=emoOf(a+b),word={more:'Lebih banyak',less:'Lebih sedikit',same:'Sama banyak'}[kind];
  const txt=kind==='same'?`${numW(a)} dan ${numW(b)}, sama banyak`:`${numW(a)} ${word.toLowerCase()} dari ${numW(b)}`;
  return {k:'num',e,label:`${a} ${kind==='same'?'=':kind==='more'?'>':'<'} ${b}`,say:[numW(a),numW(b),txt],
    render(c){const g=n=>{const w=h('div','cgrp');w.append(objsEl(n,e),numEl(n,'mnum sm'));return w;};const x=g(a),y=g(b);
      c.append(h('div','chipw',word),mrow(x,y));return [x,y];}};}
// before / after on a short number row
function seqItem(x,after){const ns=[x-1,x,x+1],txt=after?`sesudah ${numW(x)} adalah ${numW(x+1)}`:`sebelum ${numW(x)} adalah ${numW(x-1)}`;
  return {k:'num',label:after?`${x} → ${x+1}`:`${x-1} ← ${x}`,say:[...ns.map(numW),txt],
    render(c){const row=h('div','slots'),hl=ns.map(n=>{const s=h('div','slot fill'+(n===x?' cur':''),String(n));row.append(s);return s;});
      c.append(h('div','chipw',after?'Sesudah':'Sebelum'),row);return hl;}};}
// a sum with its picture; vis 'frame' forces ten frames (friends of ten)
function opItem(a,b,op,vis){const e=emoOf(a*3+b),r=op==='+'?a+b:a-b;
  return {k:'op',e,label:`${a} ${opSign(op)} ${b}`,say:[`${numW(a)} ${opWord(op)} ${numW(b)}`,'sama dengan '+numW(r)],
    render(c){const pics=vis==='frame'?framesEl(a,b):opVisual(a,b,op,e);
      const ex=h('div','meq',`${a} ${opSign(op)} ${b}`),res=h('div','meq res',`= ${r}`);c.append(pics,mrow(ex,res));return [ex,res];}};}

const ADD5=[[1,1],[2,1],[1,2],[3,1],[2,2],[1,3],[4,1],[3,2],[2,3],[1,4]];
const SUB5=[[2,1],[3,1],[3,2],[4,1],[4,2],[4,3],[5,1],[5,2],[5,3],[5,4]];
const ADD10=[[5,1],[4,3],[6,2],[5,3],[7,2],[4,4],[6,3],[5,5],[8,2],[7,3]];
const SUB10=[[6,1],[7,2],[8,3],[6,4],[9,2],[10,3],[8,5],[9,4],[10,5],[10,6]];
const OP20=[[10,2,'+'],[10,5,'+'],[12,3,'+'],[14,4,'+'],[9,3,'+'],[8,5,'+'],[15,5,'-'],[17,3,'-'],[13,10,'-'],[18,6,'-']];
const OPTENS=[[20,10,'+'],[30,20,'+'],[40,10,'+'],[50,20,'-'],[34,10,'+'],[23,4,'+'],[45,3,'+'],[58,5,'-'],[67,20,'-'],[70,30,'+']];
// ids m1–m4 are the original stages (kept so saved progress still counts)
const MATH_STAGES=[
 {id:'m1',title:'Angka 1–5',c:'mint',art:chips(['1','2','3'])+BR+ems(['🍎','🍎','🍎']),play:[['mhitung',1],['msuara',1],['mmakan',1]],items:()=>range(1,5).map(numItem)},
 {id:'m1b',title:'Angka 6–10 & 0',c:'sky',art:chips(['6','8','10'])+BR+chips(['0']),play:[['mhitung',6],['msuara',6],['mkilat',6]],items:()=>[...range(6,10).map(numItem),zeroItem()]},
 {id:'mcmp',title:'Banyak & Sedikit',c:'peach',art:ems(['🍓','🍓','🍓'])+BR+ems(['🍓']),play:[['mbanyak',1],['mbuaya',1],['murutb',1]],
  items:()=>[cmpItem(5,2,'more'),cmpItem(2,6,'less'),cmpItem(4,4,'same'),cmpItem(7,3,'more'),cmpItem(1,4,'less'),cmpItem(3,3,'same'),seqItem(4,true),seqItem(7,false),seqItem(9,true),seqItem(3,false)]},
 {id:'m2',title:'Belasan 11–19',c:'lilac',art:chips(['11','12','15']),play:[['msuara',11],['mhitung',11],['msusun',1]],items:()=>range(11,19).map(teenItem)},
 {id:'mtens',title:'Puluhan 10–100',c:'grape',art:chips(['10','20','30'])+BR+chips(['100']),play:[['mbangun',6],['murut',23],['mkatak',21]],items:()=>range(1,10).map(t=>tensItem(t*10))},
 {id:'mbaca',title:'Cara Baca Angka',c:'rose',art:chips(['2','12'])+BR+chips(['20','22']),play:[['msusun',6],['msuara',16],['mmemori',16]],items:()=>range(1,9).map(readItem)},
 {id:'m21',title:'Angka 21–50',c:'sun',art:chips(['21','35','50']),play:[['msuara',16],['mhitung',16],['mbangun',11]],items:()=>range(21,50).map(bigItem)},
 {id:'m51',title:'Angka 51–100',c:'coral',art:chips(['51','77','100']),play:[['msuara',21],['murut',16],['mbuaya',16]],items:()=>range(51,100).map(bigItem)},
 {id:'m3',title:'Tambah sampai 5',c:'sun',art:chips(['2','+','1'])+BR+ems(['🍓','🍓','🍓']),play:[['mtambah',1],['mkatak',1],['mpasang',3]],items:()=>ADD5.map(([a,b])=>opItem(a,b,'+'))},
 {id:'m4',title:'Kurang sampai 5',c:'coral',art:chips(['3','−','1'])+BR+ems(['🎈','🎈']),play:[['mkurang',1],['mkatak',11],['mparade',12]],items:()=>SUB5.map(([a,b])=>opItem(a,b,'-'))},
 {id:'mt10',title:'Tambah sampai 10',c:'mint',art:chips(['5','+','3']),play:[['mtambah',6],['mtoko',6],['mparade',16]],items:()=>ADD10.map(([a,b])=>opItem(a,b,'+'))},
 {id:'mk10',title:'Kurang sampai 10',c:'peach',art:chips(['9','−','4']),play:[['mkurang',6],['mkatak',13],['mparade',18]],items:()=>SUB10.map(([a,b])=>opItem(a,b,'-'))},
 {id:'mteman',title:'Teman Sepuluh',c:'sky',art:chips(['7','+','3'])+BR+chips(['10']),play:[['mteman',6],['mteman',11],['mtambah',11]],items:()=>range(1,9).map(a=>opItem(a,10-a,'+','frame'))},
 {id:'m20',title:'Hitung sampai 20',c:'lilac',art:chips(['10','+','5']),play:[['mtambah',16],['mkurang',16],['mteman',21]],items:()=>OP20.map(([a,b,op])=>opItem(a,b,op))},
 {id:'mopt',title:'Tambah Kurang Puluhan',c:'grape',art:chips(['20','+','30']),play:[['mtambah',21],['mkurang',21],['mkatak',21]],items:()=>OPTENS.map(([a,b,op])=>opItem(a,b,op))}
];
