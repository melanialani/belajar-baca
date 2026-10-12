/* ============ parade: answers ride on flags over vehicles that keep looping ============ */
// one vehicle type per level band: car, bus, train, ship, plane
const VEH=[{e:'🚗',bg:'road'},{e:'🚌',bg:'road',flip:true},{e:'🚂',bg:'rail',train:true},{e:'🚢',bg:'sea'},{e:'✈️',bg:'sky'}];
const PARADE_MS=[11000,10000,9000,8000,7000]; // time for one vehicle to cross the screen, per band
function parade(D,list,render,onPick){
  const v=VEH[D.b],wrap=h('div','parade '+v.bg+(v.flip?' flip':'')),items=[];
  list.forEach((x,i)=>{const it=h('div','pv'+(v.train?' wagon':'')+(v.train&&i===0?' lead':''));
    const btn=h('button','pvi',`<div class="flag" style="--fc:${COL[i%6]}"><span>${render(x)}</span></div><div class="veh">${v.train?'<i class="car"></i>':ico(v.e)}</div>`);
    if(v.train&&i===0)it.append(h('div','loco',ico(v.e)));
    btn.onclick=()=>{if(G.done)return;onPick(x,btn);};it.append(btn);wrap.append(it);items.push(it);});
  let off=null,last=0,step=0;
  const frame=t=>{if(!wrap.isConnected)return;
    const W=wrap.clientWidth;if(!step)step=Math.max(...items.map(e=>e.offsetWidth))+(v.train?4:W*.06);
    if(off==null)off=step*.9;
    // stand still while feedback shows, so the tapped vehicle stays where the child tapped it
    else if(!G.done&&!$('#gfb').classList.contains('on'))off+=Math.min(64,t-last)*(W+step)/(PARADE_MS[D.b]*(SET.slow?1.3:1));
    last=t;const lead=v.train?step:0,C=Math.max(items.length*step+lead,W+step);
    items.forEach((e,i)=>{const x=((W+lead+i*step-off)%C+C)%C-step;e.style.transform=`translateX(${x}px)`;});
    requestAnimationFrame(frame);};
  requestAnimationFrame(t=>{last=t;frame(t);});
  return wrap;}
function paradeGame(st,q,par){const pg=h('div','pgame');q.classList.add('prow');pg.append(q,par);st.append(pg);}
const PARN=[2,3,3,4,5];

GAMES.push(
 {id:'parade',title:'Parade Kata',c:'sky',ins:'Dengarkan, lalu ketuk kendaraan yang membawa katanya.',art:chips(['bola'])+'<span class="br"></span>'+ems(['🚗','🚌']),
  fn(st,api,D){const w=takeWord(D,HASE);const q=h('div','q');q.append(P(w.e),spkBtn(()=>TTS.say([w.w])));
   paradeGame(st,q,parade(D,shuffle([w,...distract(w,PARN[D.b]-1,D,HASE)]),x=>caseWord(x.w),(x,b)=>{if(x===w){b.classList.add('right');api.ok();}else{TTS.say([x.w]);api.bad(b);}}));
   return [w.w];}});

MATH_GAMES.push(
 {id:'mparade',title:'Parade Angka',c:'sky',ins:'Ketuk kendaraan yang membawa jawabannya.',art:chips(['3'])+'<span class="br"></span>'+ems(['🚂','🚢']),
  fn(st,api,D){let o;
   // levels 1–10 count pictures, 11–25 walk through the whole sum ladder (opQ levels 2–25)
   if(D.L<=10){const max=maxCount(D),n=takeNum(D,1,max),q=h('div','q');q.append(objsEl(n,pick(COUNTEMO)));o={q,ans:n,list:numOpts(n,PARN[D.b],1,max+2,D.b>=1),say:['Ada berapa gambar?'],onRight(){}};}
   else o=opQ(D,rnd()<.5?'+':'-',Math.round((D.L-10)*25/15),PARN[D.b]);
   paradeGame(st,o.q,parade(D,o.list,String,(n,b)=>{if(n===o.ans){b.classList.add('right');o.onRight();api.ok();}else{TTS.say([numW(n)]);api.bad(b);}}));
   return o.say;}});
