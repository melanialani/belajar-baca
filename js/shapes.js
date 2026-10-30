/* ============ bentuk & pola: shapes and patterns (learn stages + games) ============ */
const STARPTS=range(0,9).map(i=>{const r=i%2?19:46,a=Math.PI/5*i-Math.PI/2;return `${(50+r*Math.cos(a)).toFixed(1)},${(54+r*Math.sin(a)).toFixed(1)}`;}).join(' ');
const SHAPES=[
 {id:'lingkaran',fact:'lingkaran itu bulat, tidak punya sudut',ex:[['bola','⚽'],['donat','🍩'],['kue kering','🍪']],svg:'<circle cx="50" cy="50" r="44"/>'},
 {id:'segitiga',fact:'segitiga punya tiga sisi',ex:[['keju','🧀'],['tenda','⛺']],svg:'<path d="M50 8L94 88H6Z"/>'},
 {id:'persegi',fact:'persegi punya empat sisi yang sama panjang',ex:[['kado','🎁'],['dadu','🎲']],svg:'<rect x="10" y="10" width="80" height="80" rx="3"/>'},
 {id:'persegi panjang',fact:'persegi panjang punya dua sisi panjang dan dua sisi pendek',ex:[['pintu','🚪'],['batu bata','🧱'],['cokelat','🍫']],svg:'<rect x="3" y="26" width="94" height="48" rx="3"/>'},
 {id:'oval',fact:'oval itu lonjong',ex:[['telur','🥚'],['kentang','🥔']],svg:'<ellipse cx="50" cy="50" rx="30" ry="45"/>'},
 {id:'belah ketupat',fact:'belah ketupat punya empat sisi yang sama panjang, bentuknya seperti ketupat',ex:[['ketupat','#ketupat']],svg:'<path d="M50 3L86 50L50 97L14 50Z"/>'},
 {id:'bintang',fact:'bintang punya lima ujung',ex:[['stiker bintang','⭐']],svg:`<polygon points="${STARPTS}"/>`},
 {id:'hati',fact:'hati tanda sayang',ex:[['stiker hati','💖']],svg:'<path d="M50 90C22 70 4 52 10 30C15 12 40 8 50 28C60 8 85 12 90 30C96 52 78 70 50 90Z"/>'}];
// shapes a child mixes up, used as wrong choices in later levels
const SHSIM={lingkaran:['oval'],oval:['lingkaran'],persegi:['persegi panjang','belah ketupat'],'persegi panjang':['persegi'],'belah ketupat':['persegi','segitiga'],segitiga:['belah ketupat'],bintang:['hati'],hati:['bintang']};
const shapeEl=(s,color,rot=0)=>`<svg class="shp" viewBox="0 0 100 100"${rot?` style="transform:rotate(${rot}deg)"`:''}><g fill="${color}" stroke="rgba(0,0,0,.16)" stroke-width="3" stroke-linejoin="round">${s.svg}</g></svg>`;
// later levels turn some shapes so the child looks at the form, not the position
const shapeRot=(s,on)=>on&&(s.id==='segitiga'||s.id==='persegi panjang')?pick([0,90,180]):0;

/* --- pattern pieces: each has the spoken name and its picture --- */
const PAT_FRUIT=[['apel','🍎'],['pisang','🍌'],['jeruk','🍊'],['anggur','🍇'],['stroberi','🍓'],['semangka','🍉']].map(([say,e])=>({say,e,html:ico(e)}));
const PAT_ANIMAL=[['kucing','🐱'],['anjing','🐶'],['kelinci','🐰'],['ayam','🐔'],['ikan','🐟'],['bebek','🦆']].map(([say,e])=>({say,e,html:ico(e)}));
const PAT_COLOR=[['merah','#FF5F5F'],['biru','#4FB3FF'],['kuning','#FFBE1A'],['hijau','#2EC4A6'],['ungu','#A47CFF']].map(([say,c])=>({say,html:shapeEl(SHAPES[0],c)}));
const PAT_SHAPE=[0,1,2,6,7].map(i=>({say:SHAPES[i].id,html:shapeEl(SHAPES[i],'#E8467C')}));
const patSeq=(els,unit,n)=>range(0,n-1).map(i=>els[unit.charCodeAt(i%unit.length)-97]);
const patRow=cells=>{const r=h('div','pat');cells.forEach(c=>r.append(c));return r;};
const patCell=(html,cls='')=>h('div','pi'+(cls?' '+cls:''),html);

/* --- learn items --- */
function shapeItem(s,i){const [exw,exe]=s.ex[0];
  return {k:'shape',e:exe,label:caseWord(s.id),say:[s.id,s.fact,'seperti '+exw],
    render(c){const sh=h('div','shpwrap',shapeEl(s,COL[i%6])),nm=h('div','qword',caseWord(s.id)),ex=h('div','ex',`<span>${ico(exe)}</span><span>${caseWord(exw)}</span>`);
      c.append(sh,nm,ex);return [nm,sh,ex];}};}
function patItem(set,idx,unit,n){const els=idx.map(i=>set[i]),seq=patSeq(els,unit,n);
  return {k:'pat',e:els[0].e,label:[...unit.toUpperCase()].join(' '),say:[...seq.map(x=>x.say),[...unit].map(ch=>els[ch.charCodeAt(0)-97].say).join(', ')+', lagi dan lagi'],
    render(c){const cells=seq.map(x=>patCell(x.html));c.append(h('div','chipw',[...unit.toUpperCase()].join(' ')),patRow(cells));return cells;}};}
function numPatItem(ns,desc){
  return {k:'pat',label:ns.slice(0,4).join(' '),say:[...ns.map(numW),desc],
    render(c){const cells=ns.map(n=>patCell(numHtml(n),'num'));c.append(patRow(cells));return cells;}};}

SCI_STAGES.push(
 {id:'mbentuk',title:'Bentuk',c:'pink',art:`<span class="em">${shapeEl(SHAPES[0],'#fff')}</span><span class="em">${shapeEl(SHAPES[1],'#fff')}</span>`+BR+`<span class="em">${shapeEl(SHAPES[2],'#fff')}</span>`,
  play:[['mbentuk',1],['mhbentuk',1],['mbentuk',21]],items:()=>SHAPES.map(shapeItem)},
 {id:'mpola',title:'Pola',c:'sun',art:ems(['🍎','🍌','🍎'])+BR+ems(['🍌','🍎','❓']),play:[['mpola',1],['mpola',6],['mpola',11]],
  items:()=>[patItem(PAT_FRUIT,[0,1],'ab',6),patItem(PAT_COLOR,[0,1],'ab',6),patItem(PAT_ANIMAL,[0,4],'aab',6),patItem(PAT_SHAPE,[1,0],'abb',6),
   patItem(PAT_FRUIT,[2,3,4],'abc',6),patItem(PAT_COLOR,[2,3],'aabb',8),numPatItem([1,2,1,2,1,2],'satu, dua, lagi dan lagi'),
   numPatItem([1,2,3,4,5,6],'selalu tambah satu'),numPatItem([2,4,6,8,10],'loncat dua'),numPatItem([10,20,30,40,50],'loncat sepuluh')]}
);

/* --- games --- */
const PATTYPES=[['ab'],['ab','aab','abb'],['aab','abb','abc','aabb'],['ab','aab','abb','abc','aabb'],['abc','aabb','aab','abb']],PATTYPES_X=[['abc','aabb','abb'],['abc','aabc','abcc'],['abcd','aabc','abbc','aabb'],['abcd','aabbc','abcc','abbc']];
// number patterns for the last band: count on by 1, 2, 5 or 10; from level 26 also by 3, 4, 25, 100 and counting down
function numPattern(st,api,D){const step=D.x?pick(D.x<=5?[2,3,5,10]:D.x<=10?[3,4,25,50]:[4,25,100,250]):pick([1,2,5,10]),down=D.x>=4&&rnd()<.5;
  const s0=step*rint(step===1?1:0,step===10?5:step===5?6:step>=25?8:8)+(down?4*step:0),ns=range(0,4).map(i=>s0+(down?-i:i)*step),miss=D.x?rint(1,4):rint(2,4),ans=ns[miss];
  const cells=ns.map((n,i)=>patCell(i===miss?'?':numHtml(n),'num'+(i===miss?' miss':'')));
  const say=[ns.map((n,i)=>i===miss?'berapa':numW(n)).join(', ')+'?'];
  const q=h('div','q');q.append(patRow(cells),spkBtn(()=>TTS.say(say,{rate:.75})));
  numBtns(st,api,q,ans,numOpts(ans,optN(D),Math.max(0,ans-3*step),ans+3*step,true,step),()=>{cells[miss].innerHTML=numHtml(ans);cells[miss].classList.remove('miss');});
  return say;}

SCI_GAMES.push(
 {id:'mbentuk',title:'Tebak Bentuk',c:'pink',ins:'Dengarkan, lalu pilih bentuknya.',art:`<span class="em">${shapeEl(SHAPES[1],'#fff')}</span>`+BR+chips(['segitiga']),
  fn(st,api,D){const pool=SHAPES.slice(0,bv(D,[3,4,8,8,8],[8])),fresh=pool.filter(s=>!D.used.has(s.id)),rk=redoPick(D,k=>pool.some(s=>s.id===k)&&!D.used.has(k));
   const t=rk?pool.find(s=>s.id===rk):pick(fresh.length?fresh:pool);D.used.add(t.id);D.key=t.id;
   let others=shuffle(pool.filter(s=>s!==t));
   if(D.b>=3){const sim=others.filter(s=>(SHSIM[t.id]||[]).includes(s.id));others=[...sim,...others.filter(s=>!sim.includes(s))];}
   const list=shuffle([t,...others.slice(0,bv(D,[2,3,3,4,3],[4,4,5])-1)]),real=D.b===4&&(!D.x||D.q%2===0);
   const say=[real?`Mana yang bentuknya ${t.id}?`:`Mana ${t.id}?`];
   const q=h('div','q');q.append(h('div','chipw',caseWord(t.id)),spkBtn(()=>TTS.say(say)));
   const a=h('div','a');a.append(optsEl(list,s=>real?ico(pick(s.ex)[1]):shapeEl(s,pick(COL),shapeRot(s,D.b>=3)),(s,b)=>{
     if(s===t){b.classList.add('right');api.ok();}else{TTS.say([s.id]);api.bad(b);}},'pic',s=>s===t));
   api.ans([t.id]);st.append(q,a);return say;}},
 {id:'mhbentuk',title:'Hitung Bentuk',c:'grape',ins:'Hitung bentuk yang diminta.',art:`<span class="em">${shapeEl(SHAPES[0],'#fff')}${shapeEl(SHAPES[1],'#fff')}${shapeEl(SHAPES[0],'#fff')}</span>`+BR+chips(['2']),
  fn(st,api,D){const pool=SHAPES.slice(0,bv(D,[3,4,6,8,8],[8])),t=pick(pool),others=pool.filter(s=>s!==t),n=takeNum(D,D.x?3:1,bv(D,[3,4,5,6,8],[8,9,10,10,12]));
   const items=shuffle([...Array(n).fill(t),...range(1,bv(D,[2,3,4,5,6],[6,7,8,9,10])).map(()=>pick(others))]);
   const mix=h('div','shmix');items.forEach(s=>mix.append(h('span','',shapeEl(s,pick(COL),shapeRot(s,D.b>=3)))));
   const say=[`Ada berapa ${t.id}?`];
   const q=h('div','q');q.append(mrow(h('div','chipw',`<span class="shpi">${shapeEl(t,'#6B7299')}</span> ${caseWord(t.id)}`),spkBtn(()=>TTS.say(say))),mix);
   numBtns(st,api,q,n,numOpts(n,optN(D),1,Math.max(4,n+2),D.b>=2));return say;}},
 {id:'mpola',title:'Lanjutkan Pola',c:'sun',ins:'Lihat polanya. Apa yang hilang?',art:ems(['🍎','🍌','🍎'])+BR+ems(['🍌','❓']),
  fn(st,api,D){if((D.b===4||D.x)&&D.q%2===1)return numPattern(st,api,D);
   const unit=pick(bv(D,PATTYPES,PATTYPES_X)),set=pick(D.b<1?[PAT_FRUIT,PAT_ANIMAL,PAT_COLOR]:[PAT_FRUIT,PAT_ANIMAL,PAT_COLOR,PAT_SHAPE]);
   const els=sample(set,new Set(unit).size),n=unit.length===2?6:unit.length*2+1,seq=patSeq(els,unit,n);
   const miss=D.b>=3&&rnd()<.5?rint(unit.length,n-2):n-1,ans=seq[miss];
   const cells=seq.map((x,i)=>patCell(i===miss?'?':x.html,i===miss?'miss':''));
   const say=[seq.map((x,i)=>i===miss?'apa':x.say).join(', ')+'?'];
   const q=h('div','q');q.append(patRow(cells),spkBtn(()=>TTS.say(say,{rate:.75})));
   const list=shuffle([...els,...sample(set.filter(x=>!els.includes(x)),Math.max(0,optN(D)-els.length))]);
   const a=h('div','a');a.append(optsEl(list,x=>x.html,(x,b)=>{
     if(x===ans){b.classList.add('right');cells[miss].innerHTML=x.html;cells[miss].classList.remove('miss');api.ok();}else{TTS.say([x.say]);api.bad(b);}},'pic',x=>x===ans));
   api.ans([ans.say],()=>{cells[miss].innerHTML=ans.html;cells[miss].classList.remove('miss');});st.append(q,a);return say;}}
);
