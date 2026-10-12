/* ============ counting games: feeding, quick dots, shop ============ */
const FEED=[['kelinci','🐰','wortel','🥕'],['monyet','🐵','pisang','🍌'],['kucing','🐱','ikan','🐟'],['ayam','🐔','jagung','🌽'],['anjing','🐶','tulang','🦴'],['tikus','🐭','keju','🧀'],['beruang','🐻','madu','🍯']];
// dot layouts: dice faces up to 6 (3x3 cells), ten-frame (2x5) for bigger numbers, scattered (4x4) in the last band
const DICE={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
function dotsBox(n,b){const box=h('div','flash');let cols,cells;
  if(n<=6&&b<3){cols=3;cells=DICE[n];}else if(b<4){cols=5;cells=range(0,n-1);}else{cols=4;cells=sample(range(0,15),n);}
  box.style.gridTemplateColumns=`repeat(${cols},1fr)`;const total=cols===3?9:cols===5?10:16;
  for(let i=0;i<total;i++)box.append(h('i',cells.includes(i)?'on':''));return box;}
const GOODS=[['apel','🍎'],['jeruk','🍊'],['pisang','🍌'],['roti','🍞'],['kue','🍰'],['susu','🥛'],['permen','🍬'],['es krim','🍦'],['semangka','🍉'],['anggur','🍇']];

MATH_GAMES.push(
 {id:'mmakan',title:'Kasih Makan Hewan',c:'peach',ins:'Beri makan sebanyak yang diminta, lalu tekan Sudah.',art:ems(['🐰'])+'<span class="br"></span>'+ems(['🥕','🥕','🥕']),
  fn(st,api,D){const n=takeNum(D,D.L>=11?3:1,maxCount(D)),[an,ae,fname,fe]=pick(FEED);let fed=0;
   const say=D.b>=3?[`${cap(an)} mau ${fname} sebanyak angka ini`]:[`${cap(an)} mau ${numW(n)} ${fname}`];
   const q=h('div','q'),animal=h('div','gpic',ico(ae)),tummy=h('div','tummy');
   q.append(mrow(animal,h('div','mnum sm',String(n))),tummy,spkBtn(()=>TTS.say(say)));
   const pile=h('div','pile'),foods=[];
   const reset=()=>{fed=0;tummy.innerHTML='';foods.forEach(f=>f.classList.remove('eat'));};
   for(let i=0;i<n+[1,2,3,3,4][D.b];i++){const f=h('button','food',ico(fe));
     f.onclick=()=>{if(G.done||f.classList.contains('eat'))return;f.classList.add('eat');fed++;tummy.append(h('span','',ico(fe)));
       animal.classList.remove('pop');void animal.offsetWidth;animal.classList.add('pop');TTS.say([numW(fed)]);};pile.append(f);foods.push(f);}
   const ok=okBtn('Sudah',b=>{if(fed===n)api.ok();else{TTS.say([numW(fed)]);api.bad(b);reset();}});
   const a=h('div','a');a.append(pile,ok);st.append(q,a);return say;}},
 {id:'mkilat',title:'Kilat Titik',c:'lilac',ins:'Lihat titiknya sebentar. Ada berapa?',art:'<span class="chip" style="color:#A47CFF">● ●<br>● ●</span><span class="br"></span>'+chips(['4']),
  fn(st,api,D){const max=[5,6,8,10,10][D.b],n=takeNum(D,1,max),ms=[2500,2000,1600,1300,1000][D.b]*(SET.slow?1.4:1);
   const box=dotsBox(n,D.b),q=h('div','q');let t=null;
   const flash=()=>{clearTimeout(t);box.classList.remove('hide');t=setTimeout(()=>{if(box.isConnected&&!G.done)box.classList.add('hide');},ms);};
   const again=h('button','spk eye',ico('👀'));again.setAttribute('aria-label','Lihat lagi');again.onclick=()=>{if(!G.done){sfx.tap();flash();}};
   q.append(box,again);numBtns(st,api,q,n,numOpts(n,OPT[D.b],1,max,D.b>=2),()=>{clearTimeout(t);box.classList.remove('hide');});flash();}},
 {id:'mtoko',title:'Toko Buah',c:'sun',ins:'Bayar dengan koin sesuai harganya, lalu tekan Bayar.',art:ems(['🍎'])+chips(['3'])+'<span class="br"></span>'+chips(['1','2']),
  fn(st,api,D){const coins=[[1],[1,2],[1,2,5],[1,2,5],[1,2,5,10]][D.b],max=[5,7,10,10,20][D.b];let items;
   if(D.b<4){const p=takeNum(D,D.b>=2?3:1,max);items=[[...pick(GOODS),p]];}
   else{const g=sample(GOODS,2),p1=rint(2,10),p2=rint(1,Math.min(10,max-p1));items=[[...g[0],p1],[...g[1],p2]];}
   const total=items.reduce((t,x)=>t+x[2],0);
   const say=[items.map(([nm,,p])=>`Harga ${nm} ${numW(p)}`).join(', ')+'. Ayo bayar!'];
   const q=h('div','q'),shelf=h('div','shelf');items.forEach(([,e,p])=>shelf.append(h('div','good',`<span class="gpic">${ico(e)}</span><span class="tag">${p}</span>`)));
   const tray=h('div','tray');let paid=[];
   const sum=()=>paid.reduce((t,c)=>t+c,0);
   const drawTray=()=>{tray.innerHTML='';paid.forEach((c,i)=>{const b=h('button','coin c'+c,String(c));b.onclick=()=>{if(G.done)return;sfx.tap();paid.splice(i,1);drawTray();};tray.append(b);});};
   q.append(shelf,tray,spkBtn(()=>TTS.say(say)));
   const purse=h('div','purse');coins.forEach(c=>{const b=h('button','coin c'+c,String(c));
     b.onclick=()=>{if(G.done||paid.length>=10)return;paid.push(c);drawTray();TTS.say([numW(D.b<2?sum():c)]);};purse.append(b);});
   const pay=okBtn('Bayar',b=>{if(sum()===total)api.ok();else{api.bad(b);paid=[];drawTray();}});
   const a=h('div','a');a.append(purse,pay);st.append(q,a);return say;}}
);
