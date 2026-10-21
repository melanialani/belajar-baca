/* ============ SD counting: multiplication, division, place value, clock, rupiah, fractions (learn stages + games) ============ */
const mulSign='×',divSign=':';
// k groups of n pictures (multiplication as repeated groups)
function groupsEl(k,n,e,{cross=0}={}){const w=h('div','mgroups');for(let i=0;i<k;i++){const g=h('div','mgrp');g.append(objsEl(n,e,{cols:n<=4?n:Math.ceil(n/2),cls:'sm'}));w.append(g);}return w;}
// rows × cols dots
function arrayEl(r,c){const g=h('div','marray');g.style.gridTemplateColumns=`repeat(${c},1fr)`;for(let i=0;i<r*c;i++)g.append(h('i',''));return g;}
// n pictures shared onto k plates
function platesEl(k,each,e){const w=h('div','mplates');for(let i=0;i<k;i++){const p=h('div','mplate');p.append(objsEl(each,e,{cols:Math.min(each,3),cls:'sm'}));w.append(p);}return w;}

/* --- clock --- */
const hourW=h=>numW(((h-1)%12+12)%12+1);
// Indonesian time words: jam tiga, setengah empat (3.30), jam tiga lewat seperempat, jam empat kurang sepuluh menit
function timeWords(hh,m){if(m===0)return 'jam '+hourW(hh);if(m===30)return 'jam setengah '+hourW(hh+1);
  if(m===15)return `jam ${hourW(hh)} lewat seperempat`;if(m===45)return `jam ${hourW(hh+1)} kurang seperempat`;
  return m<30?`jam ${hourW(hh)} lewat ${numW(m)} menit`:`jam ${hourW(hh+1)} kurang ${numW(60-m)} menit`;}
const timeDigit=(hh,m)=>`${((hh-1)%12+12)%12+1}.${String(m).padStart(2,'0')}`;
function clockEl(hh,m,sm){const s=svgEl('svg',{viewBox:'0 0 100 100',class:'clock'+(sm?' sm':'')});
  s.append(svgEl('circle',{cx:50,cy:50,r:46,class:'cface'}));
  for(let i=1;i<=12;i++){const a=i*Math.PI/6;const t=svgEl('text',{x:50+36*Math.sin(a),y:50-36*Math.cos(a)+4,class:'cnum'});t.textContent=i;s.append(t);}
  for(let i=0;i<60;i++){if(i%5===0)continue;const a=i*Math.PI/30;s.append(svgEl('line',{x1:50+42*Math.sin(a),y1:50-42*Math.cos(a),x2:50+44*Math.sin(a),y2:50-44*Math.cos(a),class:'ctick'}));}
  const ha=((hh%12)+m/60)*30,ma=m*6;
  s.append(svgEl('line',{x1:50,y1:50,x2:50+22*Math.sin(ha*Math.PI/180),y2:50-22*Math.cos(ha*Math.PI/180),class:'chour'}));
  s.append(svgEl('line',{x1:50,y1:50,x2:50+33*Math.sin(ma*Math.PI/180),y2:50-33*Math.cos(ma*Math.PI/180),class:'cmin'}));
  s.append(svgEl('circle',{cx:50,cy:50,r:3.5,class:'cpin'}));
  const w=h('div','clockw');w.append(s);return w;}

/* --- rupiah: coins 100–1 000, notes 1 000–100 000 --- */
const rpFmt=n=>'Rp'+String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const rpSay=n=>numW(n)+' rupiah';
const COINS=[100,200,500,1000],NOTES=[1000,2000,5000,10000,20000,50000,100000];
const moneyEl=(v,coin)=>h('div',(coin?'rpcoin':'rpnote')+' v'+v,`<span>${rpFmt(v).replace('Rp','')}</span>${coin?'':'<small>Rp</small>'}`);
// a set of money pieces, biggest first
function moneyRow(list){const r=h('div','rprow');[...list].sort((a,b)=>b.v-a.v).forEach(x=>r.append(moneyEl(x.v,x.c)));return r;}

/* --- fractions --- */
const fracW=(a,b)=>a===1&&b===2?'setengah':a===1?'se'+(b===3?'pertiga':b===4?'perempat':'per'+numW(b)):`${numW(a)} per${numW(b)}`;
const fracHtml=(a,b)=>`<span class="frac"><i>${a}</i><i>${b}</i></span>`;
// a round cake cut in b equal parts, a of them coloured; or a bar in b parts
function fracEl(a,b,bar,col='#FF9A62'){const s=svgEl('svg',{viewBox:'0 0 100 100',class:'fracpic'+(bar?' bar':'')});
  if(bar){s.setAttribute('viewBox','0 0 100 34');for(let i=0;i<b;i++)s.append(svgEl('rect',{x:2+i*96/b,y:2,width:96/b,height:30,class:'fpart'+(i<a?' on':''),style:i<a?`fill:${col}`:''}));}
  else if(b===1)s.append(svgEl('circle',{cx:50,cy:50,r:46,class:'fpart'+(a?' on':''),style:a?`fill:${col}`:''}));
  else for(let i=0;i<b;i++){const a0=i*2*Math.PI/b-Math.PI/2,a1=(i+1)*2*Math.PI/b-Math.PI/2,large=b===1?1:0;
    s.append(svgEl('path',{d:`M50 50 L${50+46*Math.cos(a0)} ${50+46*Math.sin(a0)} A46 46 0 ${large} 1 ${50+46*Math.cos(a1)} ${50+46*Math.sin(a1)} Z`,class:'fpart'+(i<a?' on':''),style:i<a?`fill:${col}`:''}));}
  return s;}

/* --- learn items --- */
function mulItem(k,n){const e=emoOf(k*7+n),r=k*n;
  return {k:'op',e,label:`${k} ${mulSign} ${n}`,say:[`${numW(k)} kelompok, masing-masing ${numW(n)}`,`${numW(n)}, `+range(2,k).map(i=>numW(i*n)).join(', '),`${numW(k)} kali ${numW(n)} sama dengan ${numW(r)}`],
    render(c){const g=groupsEl(k,n,e),ex=h('div','meq',`${k} ${mulSign} ${n}`),res=h('div','meq res',`= ${r}`);c.append(g,mrow(ex,res));return [g,ex,res];}};}
function divItem(t,k){const e=emoOf(t+k),r=t/k;
  return {k:'op',e,label:`${t} ${divSign} ${k}`,say:[`Ada ${numW(t)}, dibagi rata ke ${numW(k)} piring`,`setiap piring dapat ${numW(r)}`,`${numW(t)} dibagi ${numW(k)} sama dengan ${numW(r)}`],
    render(c){const all=objsEl(t,e,{cls:'sm'}),p=platesEl(k,r,e),ex=h('div','meq',`${t} ${divSign} ${k} = ${r}`);c.append(all,p,ex);return [all,p,ex];}};}
function placeItem(n){const hu=n/100|0,t=(n%100)/10|0,u=n%10,th=n/1000|0;
  return {k:'num',n,label:String(n),say:[numW(n),...(th?[`${numW(th)} ribuan`]:[]),...(hu%10||th?[`${numW(hu%10)} ratusan`]:[]),`${numW(t)} puluhan`,`${numW(u)} satuan`],
    render(c){const num=numEl(n),tbl=h('div','pvt');const cols=[...(th?[['ribuan',th]]:[]),['ratusan',hu%10],['puluhan',t],['satuan',u]];
      cols.forEach(([nm,d],i)=>tbl.append(h('div','pvc d'+(cols.length-i),`<b>${d}</b><small>${caseUnit(nm)}</small>`)));
      c.append(num,n<1000?blocksEl(n):tbl);if(n<1000)c.append(tbl);return [num,...tbl.children];}};}
function clockItem(hh,m){return {k:'clock',label:timeDigit(hh,m),say:[timeWords(hh,m),m===30?`jarum pendek di antara ${hourW(hh)} dan ${hourW(hh+1)}, jarum panjang di angka enam`:m===0?`jarum panjang di angka dua belas, jarum pendek di angka ${hourW(hh)}`:`jarum panjang di angka ${numW(m/5||12)}`],
  render(c){const ck=clockEl(hh,m),t=h('div','chipw',timeDigit(hh,m)),w=h('div','qword',caseUnit(timeWords(hh,m)));c.append(ck,mrow(t),w);return [w,ck];}};}
function moneyItem(v){const coin=v<1000;
  return {k:'money',label:rpFmt(v),say:[rpSay(v),coin?'ini uang logam':'ini uang kertas'],
    render(c){const m=moneyEl(v,coin);m.classList.add('big');const w=h('div','qword',caseUnit(numW(v)+' rupiah'));c.append(m,w);return [w,m];}};}
function sumMoneyItem(list){const tot=list.reduce((t,x)=>t+x.v,0);
  return {k:'money',label:rpFmt(tot),say:[list.map(x=>numW(x.v)).join(' tambah ')+', semuanya '+rpSay(tot)],
    render(c){const r=moneyRow(list),w=h('div','meq',`= ${rpFmt(tot)}`);c.append(r,w);return [w];}};}
function fracItem(a,b,txt){return {k:'frac',label:`${a}/${b}`,say:[fracW(a,b),txt],
  render(c){const p=fracEl(a,b),f=h('div','meq',fracHtml(a,b)),w=h('div','qword',caseUnit(fracW(a,b)));c.append(mrow(p,f),w,h('p','scil',caseUnit(txt)));return [w,p];}};}

MATH_STAGES.push(
 {id:'mkali',title:'Perkalian',c:'peach',art:chips(['3','×','2'])+BR+ems(['🍎','🍎']),play:[['mkali',1],['mkali',26],['mkali',51]],
  items:()=>[[2,2],[3,2],[2,4],[4,3],[5,2],[3,5],[2,10],[5,5],[4,6],[6,3],[7,2],[3,9]].map(([k,n])=>mulItem(k,n))},
 {id:'mbagi',title:'Pembagian',c:'sky',art:chips(['6',':','2'])+BR+ems(['🍪','🍪']),play:[['mbagi',1],['mbagi',26],['mbagi',61]],
  items:()=>[[4,2],[6,2],[6,3],[8,4],[10,2],[9,3],[12,4],[10,5],[12,3],[15,5]].map(([t,k])=>divItem(t,k))},
 {id:'mratus',title:'Ratusan & Ribuan',say:'Ratusan dan ribuan',c:'lilac',art:chips(['100','352'])+BR+chips(['1000']),play:[['mnilai',26],['msusun',26],['mbangun',26]],
  items:()=>[100,200,300,500,999,1000].map(n=>n===1000?placeItem(1000):tensOrHundred(n)).concat([125,352,407,2468].map(placeItem))},
 {id:'mjamb',title:'Membaca Jam',c:'mint',art:ems(['🕒'])+BR+chips(['3.00']),play:[['mjam',1],['mjam',16],['mjam',31]],
  items:()=>[[3,0],[7,0],[12,0],[3,30],[8,30],[4,15],[9,45],[2,10],[5,50],[10,25]].map(([hh,m])=>clockItem(hh,m))},
 {id:'muangb',title:'Mengenal Uang',c:'sun',art:'<span class="rpnote v5000 art"><span>5.000</span></span>'+BR+chips(['Rp']),play:[['muang',1],['muang',16],['muang',41]],
  items:()=>[...COINS.filter(v=>v<1000).map(moneyItem),...NOTES.map(moneyItem),sumMoneyItem([{v:500,c:1},{v:500,c:1}]),sumMoneyItem([{v:2000},{v:2000},{v:1000}]),sumMoneyItem([{v:10000},{v:5000},{v:2000}])]},
 {id:'mpecb',title:'Pecahan',c:'rose',art:'<span class="em">🍕</span>'+BR+chips(['½']),play:[['mpecahan',1],['mpecahan',21],['mpecahan',51]],
  items:()=>[fracItem(1,2,'kue dipotong dua sama besar, satu bagian berwarna'),fracItem(1,4,'kue dipotong empat sama besar, satu bagian berwarna'),fracItem(2,4,'dua dari empat bagian, sama dengan setengah'),
   fracItem(3,4,'tiga dari empat bagian'),fracItem(1,3,'kue dipotong tiga sama besar, satu bagian berwarna'),fracItem(2,3,'dua dari tiga bagian'),fracItem(1,8,'satu dari delapan bagian'),fracItem(4,4,'empat dari empat bagian, artinya satu kue utuh')]}
);
// 100, 200 … as hundreds flats
function tensOrHundred(n){return {k:'num',n,label:String(n),say:[numW(n),...(n%100===0?[`${numW(n/100)} kali seratus`]:[])],render(c){const num=numEl(n),b=blocksEl(n);c.append(mrow(num,b));return [num,b];}};}

/* --- games --- */
// multiplication: groups (1–10), arrays (11–25), tables up to 5 (26–50), up to 10 (51–75), mixed and missing factor (76–100)
function mulPair(D){const L=D.L;let a,b;
  if(L<=10){a=rint(2,L<=5?3:4);b=rint(1,L<=5?3:5);}else if(L<=25){a=rint(2,5);b=rint(2,5);}
  else if(L<=50){a=rint(2,5);b=rint(1,10);}else if(L<=75){a=rint(6,10);b=rint(1,10);}else{a=rint(2,10);b=rint(2,10);}
  return rnd()<.5&&L>25?[b,a]:[a,b];}
function divPair(D){const L=D.L;let k,r;
  if(L<=15){k=rint(2,3);r=rint(1,L<=8?3:4);}else if(L<=25){k=rint(2,5);r=rint(2,4);}else if(L<=60){k=rint(2,5);r=rint(1,10);}else{k=rint(2,10);r=rint(2,10);}return [k*r,k];}
const keyed=(D,make,parse)=>{const rk=redoPick(D,k=>!D.used.has(k));let v,g=0;if(rk)v=parse(rk);else do{v=make(D);}while(D.used.has(v.join(','))&&g++<30);D.used.add(v.join(','));D.key=v.join(',');return v;};
const pairParse=k=>k.split(',').map(Number);
MATH_GAMES.push(
 {id:'mkali',title:'Perkalian',c:'peach',ins:'Ayo mengali.',art:chips(['3','×','2'])+BR+ems(['🍎','🍎']),
  fn(st,api,D){const [a,b]=keyed(D,mulPair,pairParse),r=a*b,missing=D.L>85&&D.q%2===1,e=pick(COUNTEMO);
   const say=missing?[`${numW(a)} kali berapa sama dengan ${numW(r)}?`]:D.L<=10?[`${numW(a)} kelompok, masing-masing ${numW(b)}. Berapa semuanya?`]:[`${numW(a)} kali ${numW(b)}, sama dengan berapa?`];
   const q=h('div','q');if(D.L<=10)q.append(groupsEl(a,b,e));else if(D.L<=25||D.L<=35&&a*b<=30)q.append(arrayEl(a,b));
   const ex=h('div','meq',missing?`${a} ${mulSign} <span class="blank">?</span> = ${r}`:`${a} ${mulSign} ${b} = <span class="blank">?</span>`);q.append(ex,spkBtn(()=>TTS.say(say)));
   const ans=missing?b:r,cf=missing?[b-1,b+1,b+2,a]:[a*(b+1),a*(b-1),(a+1)*b,a+b,r+10,r-1];
   const list=shuffle([ans,...shuffle([...new Set(cf)].filter(x=>x>0&&x!==ans)).slice(0,optN(D)-1)]);
   numBtns(st,api,q,ans,list,()=>{ex.querySelector('.blank').textContent=ans;});return say;}},
 {id:'mbagi',title:'Pembagian',c:'sky',ins:'Ayo membagi sama rata.',art:chips(['6',':','2'])+BR+ems(['🍪','🍪']),
  fn(st,api,D){const [t,k]=keyed(D,divPair,pairParse),r=t/k,e=pick(COUNTEMO),pic=D.L<=25;
   const say=pic?[`Ada ${numW(t)}. Dibagi rata ke ${numW(k)} piring. Setiap piring dapat berapa?`]:[`${numW(t)} dibagi ${numW(k)}, sama dengan berapa?`];
   const q=h('div','q');let plates=null;if(pic){q.append(objsEl(t,e,{cls:'sm'}));plates=h('div','mplates');for(let i=0;i<k;i++)plates.append(h('div','mplate'));q.append(plates);}
   const ex=h('div','meq',`${t} ${divSign} ${k} = <span class="blank">?</span>`);q.append(ex,spkBtn(()=>TTS.say(say)));
   const list=shuffle([r,...shuffle([...new Set([r+1,r-1,r+2,k,t-k,r*2])].filter(x=>x>0&&x!==r)).slice(0,optN(D)-1)]);
   numBtns(st,api,q,r,list,()=>{ex.querySelector('.blank').textContent=r;if(plates)plates.replaceWith(platesEl(k,r,e));});return say;}},
 {id:'mnilai',title:'Nilai Tempat',c:'lilac',ins:'Angka ini nilainya berapa?',art:chips(['3','5','2'])+BR+chips(['300']),
  fn(st,api,D){const L=D.L,lo=L<=25?11:L<=60?101:1001,hi=L<=25?99:L<=60?999:9999;
   const n=takeNum(D,lo,hi),ds=[...String(n)],places=ds.length,pi=pick(range(0,places-1).filter(i=>ds[i]!=='0')),dig=+ds[pi],val=dig*10**(places-1-pi);
   const pnames=['satuan','puluhan','ratusan','ribuan'],pname=pnames[places-1-pi];
   const kind=L>40&&D.q%2===1?'expand':'value';
   const q=h('div','q'),num=h('div','mnum',ds.map((d,i)=>`<span class="d${places-i}${i===pi?' pick':''}">${d}</span>`).join(''));q.append(num);
   let say,ans,list;
   if(kind==='value'){say=[`Angka ${numW(dig)} pada ${numW(n)} bernilai berapa?`];ans=val;list=shuffle([...new Set([val,dig,dig*10,dig*100,dig*1000].filter(x=>x<=9000))]).slice(0,Math.max(2,Math.min(optN(D),places+1)));if(!list.includes(ans))list[0]=ans;
     q.append(h('div','chipw',caseUnit(pname)));}
   else{const parts=ds.map((d,i)=>+d*10**(places-1-i)).filter(Boolean);const hide=rint(0,parts.length-1);ans=parts[hide];
     say=[`${numW(n)} sama dengan ${parts.map((p,i)=>i===hide?'berapa':numW(p)).join(' tambah ')}?`];
     q.append(h('div','meq',`= ${parts.map((p,i)=>i===hide?'<span class="blank">?</span>':p).join(' + ')}`));
     list=shuffle([...new Set([ans,ans/10,ans*10,+String(ans)[0]].filter(x=>x>=1&&Number.isInteger(x)))]).slice(0,optN(D));if(!list.includes(ans))list[0]=ans;}
   q.append(spkBtn(()=>TTS.say(say)));numBtns(st,api,q,ans,list.sort((a,b)=>a-b),()=>{const bl=q.querySelector('.blank');if(bl)bl.textContent=ans;});return say;}},
 {id:'mjam',title:'Jam Berapa?',c:'mint',ins:'Lihat jamnya. Jam berapa?',art:ems(['🕒'])+BR+chips(['3.00']),
  fn(st,api,D){const L=D.L,mins=L<=15?[0]:L<=30?[0,30]:L<=50?[0,15,30,45]:L<=75?[5,10,15,20,25,35,40,45,50,55]:range(0,11).map(i=>i*5);
   const [hh,m]=keyed(D,()=>[rint(1,12),pick(mins)],pairParse);
   const say=['Jam berapa?'],ans=timeDigit(hh,m);
   // look-alikes: the hour one off, hands swapped, half past read as the next hour
   const cand=[timeDigit(hh+1,m),timeDigit(hh-1,m),timeDigit(m===0?12:m/5||12,hh%12*5),m===30?timeDigit(hh+1,30):timeDigit(hh,(m+30)%60),timeDigit(hh,(m+15)%60)];
   const list=shuffle([ans,...shuffle([...new Set(cand)].filter(x=>x!==ans)).slice(0,Math.min(optN(D),4)-1)]);
   const q=h('div','q');q.append(clockEl(hh,m),spkBtn(()=>TTS.say(say)));
   const a=h('div','a');a.append(optsEl(list,x=>x,(x,b)=>{if(x===ans){b.classList.add('right');api.ok();}else{const [p,r]=x.split('.').map(Number);TTS.say([timeWords(p,r)]);api.bad(b);}},'',x=>x===ans));
   api.ans([timeWords(hh,m)]);st.append(q,a);return say;}},
 {id:'muang',title:'Hitung Uang',c:'sun',ins:'Berapa jumlah uangnya?',art:'<span class="rpnote v2000 art"><span>2.000</span></span>'+BR+chips(['Rp']),
  fn(st,api,D){const L=D.L;let list,tot,say,change=null;
   const pickN=(vals,k)=>range(1,k).map(()=>({v:pick(vals),c:vals===COINS}));
   if(L<=15){const v=pick(L<=8?[100,200,500,1000]:[500,1000,2000]);list=range(1,rint(1,L<=8?2:3)).map(()=>({v,c:v<1000}));}
   else if(L<=40){list=pickN(L<=25?[100,200,500]:[500,1000,2000,5000],rint(2,L<=25?3:4)).map(x=>({v:x.v,c:x.v<1000}));}
   else if(L<=70){list=pickN([1000,2000,5000,10000,20000,50000],rint(2,4)).map(x=>({v:x.v}));}
   else{const price=500*rint(1,L<=85?18:38),pay=[5000,10000,20000].find(p=>p>price)||50000;change=[price,pay];list=[];}
   const q=h('div','q');
   if(change){const [price,pay]=change;tot=pay-price;say=[`Harga mainan ${rpSay(price)}. Kamu membayar ${rpSay(pay)}. Berapa kembaliannya?`];
     q.append(h('div','chipw',`${ico('🧸')} ${rpFmt(price)}`),mrow(h('div','chipw',caseUnit('bayar')),moneyEl(pay,false)));}
   else{tot=list.reduce((t,x)=>t+x.v,0);say=['Berapa jumlah uangnya?'];q.append(moneyRow(list));}
   D.used.add(tot);q.append(spkBtn(()=>TTS.say(say)));
   const step=tot<1000?100:tot<10000?500:1000,cf=[tot+step,tot-step,tot+2*step,tot*2,tot+1000,tot-1000].filter(x=>x>0&&x!==tot);
   const opts=shuffle([tot,...shuffle([...new Set(cf)]).slice(0,optN(D)-1)]);
   const a=h('div','a');a.append(optsEl(opts,rpFmt,(x,b)=>{if(x===tot){b.classList.add('right');api.ok();}else{TTS.say([rpSay(x)]);api.bad(b);}},'',x=>x===tot));
   api.ans([rpSay(tot)]);st.append(q,a);return say;}},
 {id:'mpecahan',title:'Pecahan',c:'rose',ins:'Ayo kenali pecahan.',art:'<span class="em">🍕</span>'+BR+chips(['½']),
  fn(st,api,D){const L=D.L,dens=L<=20?[2,4]:L<=50?[2,3,4]:[2,3,4,6,8];const b=pick(dens),a=L<=20?1:rint(1,b-1),col=pick(['#FF9A62','#4FB3FF','#2EC4A6','#A47CFF']);
   const q=h('div','q');let say,list,ans,render,cls='';
   if(L<=20){// which picture shows this fraction?
     say=[`Mana yang ${fracW(a,b)}?`];q.append(h('div','chipw',fracHtml(a,b)));ans=`${a}/${b}`;
     const others=[[1,3],[1,4],[1,2],[3,4],[2,3],[1,1]].map(x=>x.join('/')).filter(x=>x!==ans&&!(ans==='1/2'&&x==='2/4'));
     list=shuffle([ans,...sample(others,Math.min(3,optN(D))-1)]);cls='pic';render=x=>{const [p,r]=x.split('/').map(Number);return fracEl(p,r,false,col).outerHTML;};}
   else if(L<=50||D.q%2===0&&L<=75){// what fraction is coloured?
     say=['Berapa bagian yang berwarna?'];q.append(fracEl(a,b,L>35&&rnd()<.5,col));ans=`${a}/${b}`;
     const cand=[`${b-a}/${b}`,`${a}/${b+1}`,`${a}/${b-1}`,`${a+1}/${b}`,`${b}/${a}`].filter(x=>{const [p,r]=x.split('/').map(Number);return p>0&&r>1&&p<=r&&x!==ans&&p/r!==a/b;});
     list=shuffle([ans,...shuffle([...new Set(cand)]).slice(0,Math.min(4,optN(D))-1)]);render=x=>{const [p,r]=x.split('/').map(Number);return fracHtml(p,r);};}
   else if(L<=75){// which is bigger?
     let c,d,g=0;do{d=pick(dens);c=rint(1,d-1);}while(c/d===a/b&&g++<20);if(c/d===a/b){c=1;d=b===2?4:2;}
     say=['Mana yang lebih besar?'];q.append(h('div','chipw',caseUnit('Lebih besar')));ans=a/b>c/d?`${a}/${b}`:`${c}/${d}`;
     list=[`${a}/${b}`,`${c}/${d}`];cls='pic';render=x=>{const [p,r]=x.split('/').map(Number);return fracEl(p,r,true,col).outerHTML+fracHtml(p,r);};}
   else{// a fraction of an amount
     const n=b*rint(1,L<=88?3:5),r=n/b*a,e=pick(COUNTEMO);say=[`${caseUnit(fracW(a,b))} dari ${numW(n)} adalah berapa?`];
     q.append(objsEl(n,e,{cls:'sm',cols:b}),h('div','meq',`${fracHtml(a,b)} dari ${n} = <span class="blank">?</span>`),spkBtn(()=>TTS.say(say)));
     const cf=[r+1,r-1,n/b,n-r,r*2].filter(x=>x>0&&x!==r&&Number.isInteger(x));
     numBtns(st,api,q,r,shuffle([r,...shuffle([...new Set(cf)]).slice(0,optN(D)-1)]),()=>{q.querySelector('.blank').textContent=r;});D.key=null;return say;}
   D.key=null;q.append(spkBtn(()=>TTS.say(say)));
   const a2=h('div','a');a2.append(optsEl(list,render,(x,btn)=>{if(x===ans){btn.classList.add('right');api.ok();}else{const [p,r]=x.split('/').map(Number);TTS.say([fracW(p,r)]);api.bad(btn);}},cls,x=>x===ans));
   const [p,r]=ans.split('/').map(Number);api.ans([fracW(p,r)]);st.append(q,a2);return say;}}
);
