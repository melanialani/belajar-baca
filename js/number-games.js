/* ============ number games: order, compare, build and read two-digit numbers, friends of ten, number line ============ */
const SUSUNR=[[10,19],[10,20],[20,50],[21,99],[10,100]],SUSUNR_X=[[100,199],[100,500],[100,999],[100,999],[100,999],[1000,2000],[1000,5000],[1000,9999]];
const BANGUNR=[[11,19],[10,30],[20,50],[30,99],[10,100]],BANGUNR_X=[[100,150],[100,199],[100,300],[100,500],[100,999]];
const rodHtml=(cls='')=>`<span class="rod ${cls}">${'<i></i>'.repeat(10)}</span>`;

// Teman Sepuluh from level 26: friends of 100 (by tens, then any), then of 1 000 (by hundreds)
function bigFriends(st,api,D){const tot=D.x<=5?100:1000,step=D.x<=2?10:D.x<=5?1:D.x<=10?100:10;
  const a=step*takeNum(D,1,tot/step-1),ans=tot-a,say=[`Ada ${numW(a)}. Berapa lagi supaya jadi ${numW(tot)}?`];
  const q=h('div','q'),ex=h('div','meq',`${a} + <span class="blank">?</span> = ${tot}`);q.append(ex,spkBtn(()=>TTS.say(say)));
  numBtns(st,api,q,ans,numOpts(ans,optN(D),Math.max(step,ans-5*step),Math.min(tot-step,ans+5*step),true,step),()=>{ex.querySelector('.blank').textContent=ans;});return say;}
MATH_GAMES.push(
 {id:'murutb',title:'Urutkan Balon',c:'pink',ins:'Ketuk balonnya sesuai urutan angka.',art:ems(['🎈'])+BR+chips(['1','2','3']),
  fn(st,api,D){const [lo,hi]=numRange(D),k=bv(D,[3,3,4,4,5],[5,5,6]),down=D.b>=3&&D.q%2===1;
   const ns=sample(range(lo,hi),k),order=[...ns].sort((x,y)=>down?y-x:x-y);let pos=0;
   const txt=down?'Ketuk dari angka yang paling besar.':'Ketuk dari angka yang paling kecil.';
   const q=h('div','q'),row=h('div','slots');order.forEach(()=>row.append(h('div','slot')));
   q.append(mrow(h('div','chipw',caseUnit(down?'Besar → kecil':'Kecil → besar')),spkBtn(()=>TTS.say([txt]))),row);
   const box=h('div','balloons');
   shuffle(ns).forEach((n,i)=>{const b=h('button','balloon',`<span>${n}</span>`);b.style.setProperty('--bc',COL[i%6]);
     b.onclick=()=>{if(G.done||b.classList.contains('gone'))return;TTS.say([numW(n)]);
       if(n!==order[pos])return api.bad(b);
       b.classList.add('gone');const sl=row.children[pos];sl.textContent=n;sl.classList.add('fill','pop');pos++;if(pos===order.length)api.ok();else sfx.tap();};
     box.append(b);});
   api.solve(()=>order.forEach(n=>[...box.children].find(b=>b.textContent===String(n)&&!b.classList.contains('gone')).click()));
   api.ans(order.map(numW),()=>{order.forEach((n,i)=>{const sl=row.children[i];if(!sl.textContent){sl.textContent=n;sl.classList.add('fill','shown');}});});
   const a=h('div','a');a.append(box);st.append(q,a);return [txt];}},
 {id:'mbuaya',title:'Buaya Lapar',c:'mint',ins:'Buaya lapar selalu makan angka yang lebih besar.',art:ems(['🐊'])+BR+chips(['3','8']),
  fn(st,api,D){const [lo,hi]=numRange(D),k=bv(D,[2,2,2,3,3],[3,3,4]),x=takeNum(D,lo,hi);
   const near=D.L>=11?shuffle(confusers(x,hi).filter(n=>n>=lo&&n<=hi)):[];
   const list=shuffle([x,...[...near,...shuffle(range(lo,hi).filter(n=>n!==x&&!near.includes(n)))].slice(0,k-1)]),ans=Math.max(...list);
   const say=[`${list.map(numW).join(', ')}. Buaya mau angka yang ${k>2?'paling':'lebih'} besar.`];
   const croc=h('div','gpic croc',ico('🐊')),q=h('div','q');q.append(croc,mrow(h('div','chipw',caseUnit(k>2?'Paling besar':'Lebih besar')),spkBtn(()=>TTS.say(say))));
   const a=h('div','a');a.append(optsEl(list,String,(n,b)=>{if(n===ans){b.classList.add('right');croc.classList.add('chomp');api.ok();}else{TTS.say([numW(n)]);api.bad(b);}},'',n=>n===ans));
   api.ans([numW(ans)],()=>croc.classList.add('chomp'));st.append(q,a);return say;}},
 {id:'msusun',title:'Susun Angka',c:'rose',ins:'Dengarkan, lalu susun angkanya.',art:ems(['🔊'])+BR+chips(['2','1']),
  fn(st,api,D){const [lo,hi]=bv(D,SUSUNR,SUSUNR_X),n=takeNum(D,lo,hi),ds=[...String(n)];
   const extra=sample(range(0,9).map(String).filter(d=>!ds.includes(d)),bv(D,[0,1,1,2,2],[2,2,2,3]));
   arrange(st,api,{word:{w:numW(n)},target:ds,pieces:shuffle([...ds,...extra]),pic:false,speak:p=>numW(+p)});return [numW(n)];}},
 {id:'mbangun',title:'Bangun Angka',c:'lilac',ins:'Pakai batang sepuluh dan kotak satu, lalu tekan Sudah.',art:'<span class="em">'+rodHtml('art')+rodHtml('art')+'</span>'+chips(['2','0']),
  fn(st,api,D){const [lo,hi]=bv(D,BANGUNR,BANGUNR_X),n=takeNum(D,lo,hi),big=!!D.x;let hu=0,t=0,u=0;
   const say=[`Buat angka ${numW(n)}`];
   const q=h('div','q');if(D.b<4||(D.x&&D.x<3))q.append(numEl(n,'mnum sm'));q.append(spkBtn(()=>TTS.say(say)));
   const tray=h('div','btray'),cur=h('div','chipw bcur');
   const val=()=>hu*100+t*10+u;
   const draw=()=>{const rods=h('div','rods'),cubes=h('div','cubes'),bl=h('div','blocks');
     if(hu){const fl=h('div','flats');for(let i=0;i<hu;i++){const f=h('button','flat');f.onclick=()=>{if(G.done)return;hu--;sfx.tap();draw();};fl.append(f);}bl.append(fl);}
     for(let i=0;i<t;i++){const r=h('button','rod','<i></i>'.repeat(10));r.onclick=()=>{if(G.done)return;t--;sfx.tap();draw();};rods.append(r);}
     for(let i=0;i<u;i++){const c=cubeEl(i,'','button');c.onclick=()=>{if(G.done)return;u--;sfx.tap();draw();};cubes.append(c);}
     bl.append(rods,cubes);tray.replaceChildren(bl);cur.textContent=val();};
   const add=(dh,dt,du,b)=>{if(G.done)return;if(val()+dh*100+dt*10+du>(big?999:100)||u+du>19||t+dt>19){b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');return;}
     hu+=dh;t+=dt;u+=du;draw();TTS.say([numW(val())]);};
   const addR=h('button','addb',`${rodHtml('mini')}<b>10</b>`),addU=h('button','addb','<span class="cube mini"></span><b>1</b>');
   const addH=h('button','addb','<span class="flat mini"></span><b>100</b>');
   addH.onclick=()=>add(1,0,0,addH);addR.onclick=()=>add(0,1,0,addR);addU.onclick=()=>add(0,0,1,addU);
   draw();q.append(tray,cur);
   const set=()=>{hu=n/100|0;t=(n%100)/10|0;u=n%10;draw();},done=okBtn('Sudah',b=>{if(val()===n)api.ok();else api.bad(b);});
   api.ans([numW(n)],set);api.solve(()=>{set();done.click();});
   const a=h('div','a');a.append(big?mrow(addH,addR,addU):mrow(addR,addU),done);st.append(q,a);return say;}},
 {id:'mteman',title:'Teman Sepuluh',c:'sky',ins:'Berapa lagi supaya pas?',art:chips(['7','+','?'])+BR+chips(['10']),
  fn(st,api,D){if(D.x)return bigFriends(st,api,D);const L=D.L,tot=L<=5?5:L<=20?10:20,a=takeNum(D,tot===20?10:1,tot-1),ans=tot-a;
   const fr=L<=15||L>=21?framesEl(a,0,{size:tot===5?5:10,frames:tot===20?2:1}):null;
   const say=[`Ada ${numW(a)}. Berapa lagi supaya jadi ${numW(tot)}?`];
   const q=h('div','q');if(fr)q.append(fr);
   const ex=L>=11?h('div','meq',`${a} + <span class="blank">?</span> = ${tot}`):null;if(ex)q.append(ex);
   q.append(spkBtn(()=>TTS.say(say)));
   numBtns(st,api,q,ans,numOpts(ans,optN(D),tot===20?1:0,tot===20?10:tot,L>=8),()=>{if(fr)fr.querySelectorAll('i:not(.a)').forEach(i=>i.className='b');if(ex)ex.querySelector('.blank').textContent=ans;});
   return say;}},
 {id:'mkatak',title:'Lompat Katak',c:'mint',ins:'Katak melompat. Sampai di angka berapa?',art:ems(['🐸'])+BR+chips(['3','+','2']),
  fn(st,api,D){const L=D.L;let lo=0,hi=10,step=1,j,back=false;
   if(D.x){if(D.x<=4){hi=100;step=10;j=10*rint(2,5);}else if(D.x<=8){step=5;lo=5*rint(0,10);hi=lo+50;j=5*rint(2,6);}else if(D.x<=12){hi=1000;step=100;j=100*rint(2,5);}else{step=25;lo=0;hi=250;j=25*rint(2,5);}back=rnd()<.5;}
   else if(L<=5){hi=5;j=rint(1,2);}else if(L<=10)j=rint(1,4);else if(L<=15){j=rint(1,4);back=rnd()<.6;}
   else if(L<=20){lo=10;hi=20;j=rint(1,5);back=rnd()<.5;}else{hi=100;step=10;j=10*rint(1,3);back=rnd()<.4;}
   const a=(back?lo+j:lo)+step*rint(0,(hi-lo-j)/step),end=back?a-j:a+j,pos=v=>((v-lo)/(hi-lo)*100)+'%';
   const line=h('div','nline');
   for(let v=lo;v<=hi;v+=step){const t=h('span','nt'+(v===a?' cur':''),String(v));t.style.left=pos(v);line.append(t);}
   const frog=h('div','frog',ico('🐸'));frog.style.left=pos(a);line.append(frog);
   const say=[`Katak di ${numW(a)}. Lompat ${back?'mundur':'maju'} ${numW(j)}${step===1?' langkah':''}. Sampai di angka berapa?`];
   const q=h('div','q');q.append(line,mrow(h('div','chipw',(back?'− ':'+ ')+j),spkBtn(()=>TTS.say(say))));
   numBtns(st,api,q,end,numOpts(end,optN(D),lo,hi,L>=8,step),()=>{frog.style.left=pos(end);});
   return say;}}
);
