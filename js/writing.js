/* ============ writing: trace letters with a finger (Tulis Huruf) + spell a heard word (Dikte) ============ */
const SVGNS='http://www.w3.org/2000/svg';
const svgEl=(tag,attrs={})=>{const e=document.createElementNS(SVGNS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);return e;};
let _measure=null;
// points along a stroke every `step` units (the checkpoints a finger must pass, in order)
function strokePts(d,step=6){if(!_measure){const s=svgEl('svg',{width:0,height:0});s.style.position='absolute';_measure=svgEl('path');s.append(_measure);document.body.append(s);}
  _measure.setAttribute('d',d);const len=_measure.getTotalLength(),n=Math.max(1,Math.ceil(len/step));
  return {len,pts:range(0,n).map(i=>{const p=_measure.getPointAtLength(len*i/n);return [p.x,p.y];})};}
const TOL=15;
// tracing pad for one or more characters; guide 0 = solid grey letter, 1 = dashed, 2 = start dots only
function tracePad(chars,{guide=0,onDone}={}){
  const W=100*chars.length,svg=svgEl('svg',{viewBox:`0 0 ${W} 120`,class:'tsvg'}),wrap=h('div','tpad');wrap.style.setProperty('--tw',chars.length);
  [12,50,95].forEach((y,i)=>svg.append(svgEl('line',{x1:0,x2:W,y1:y,y2:y,class:'tline'+(i===1?' mid':'')})));
  const strokes=[];chars.forEach((ch,ci)=>(STROKES[ch]||[]).forEach(d=>{const g=svgEl('g',{transform:`translate(${ci*100} 0)`}),
    p=svgEl('path',{d,class:'tg'+(guide===1?' dash':guide>=2?' hide':'')});g.append(p);svg.append(g);
    const m=strokePts(d);strokes.push({d,ci,len:m.len,pts:m.pts.map(([x,y])=>[x+ci*100,y]),g});}));
  const doneG=svgEl('g'),inkG=svgEl('g'),dot=svgEl('circle',{r:7,class:'tstart'}),num=svgEl('text',{class:'tnum'});svg.append(doneG,inkG,dot,num);
  let s=0,k=0,ink=null,finished=false;
  const showStart=()=>{if(s>=strokes.length){dot.style.display=num.style.display='none';return;}const [x,y]=strokes[s].pts[0];
    dot.setAttribute('cx',x);dot.setAttribute('cy',y);num.setAttribute('x',x+10);num.setAttribute('y',y+4);num.textContent=s+1;};
  const finishStroke=()=>{const st=strokes[s],g=svgEl('g',{transform:`translate(${st.ci*100} 0)`});g.append(svgEl('path',{d:st.d,class:'tdone'}));doneG.append(g);
    s++;k=0;showStart();if(s>=strokes.length){finished=true;inkG.innerHTML='';onDone&&onDone();}else sfx.tap();};
  const pt=e=>{const m=svg.getScreenCTM();if(!m)return [0,0];const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse());return [p.x,p.y];};
  const near=(a,b,t=TOL)=>Math.hypot(a[0]-b[0],a[1]-b[1])<t;
  const advance=P=>{const st=strokes[s];if(!st)return;
    if(st.len<3){if(near(P,st.pts[0],TOL*1.4))finishStroke();return;} // a dot: touching it is enough
    for(let j=k;j<Math.min(st.pts.length,k+4);j++)if(near(P,st.pts[j])){k=j+1;}
    // the end of the stroke: the last checkpoint or the path end point
    if(k>=st.pts.length||(k>=st.pts.length-2&&near(P,pt2(st))))finishStroke();};
  const pt2=st=>{_measure.setAttribute('d',st.d);const p=_measure.getPointAtLength(st.len);return [p.x+st.ci*100,p.y];};
  svg.addEventListener('pointerdown',e=>{if(finished)return;e.preventDefault();e.stopPropagation();svg.setPointerCapture(e.pointerId);
    ink=svgEl('polyline',{class:'tink'});inkG.append(ink);const P=pt(e);ink.setAttribute('points',P.join(','));advance(P);});
  svg.addEventListener('pointermove',e=>{if(!ink||finished)return;e.preventDefault();const P=pt(e);ink.setAttribute('points',ink.getAttribute('points')+' '+P.join(','));advance(P);});
  const up=()=>{ink=null;};svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
  // keep the learn viewer from treating a drawing as a swipe
  ['touchstart','touchmove','touchend','mousedown','mousemove','mouseup','click'].forEach(ev=>svg.addEventListener(ev,e=>e.stopPropagation()));
  showStart();wrap.append(svg);
  // shows how to write it: each stroke drawn in turn
  wrap.demo=()=>{svg.querySelectorAll('.tdemo').forEach(x=>x.remove());let t=0;
    strokes.forEach(st=>{const g=svgEl('g',{transform:`translate(${st.ci*100} 0)`}),p=svgEl('path',{d:st.d,class:'tdemo'});g.append(p);svg.insertBefore(g,doneG);
      const dur=Math.max(350,st.len*9);p.style.strokeDasharray=st.len+1;p.style.strokeDashoffset=st.len+1;
      setTimeout(()=>{p.style.transition=`stroke-dashoffset ${dur}ms linear`;p.style.strokeDashoffset=0;},t+30);t+=dur+250;});
    setTimeout(()=>svg.querySelectorAll('.tdemo').forEach(x=>x.classList.add('fade')),t+600);};
  // test helper: trace every stroke
  wrap.solve=()=>{while(!finished){const st=strokes[s];st.pts.forEach(P=>advance(P));advance(pt2(st));}};
  return wrap;}
const charSay=ch=>/[0-9]/.test(ch)?numW(+ch):LN[ch.toLowerCase()];
const charName=ch=>/[0-9]/.test(ch)?'angka '+numW(+ch):ch===ch.toUpperCase()?'huruf besar '+LN[ch.toLowerCase()]:'huruf '+LN[ch];

/* --- learn: one page per character, trace it as often as you like --- */
function traceItem(ch){return {k:'trace',label:caseUnit(ch),say:[charName(ch),'Ayo tulis'],
  render(c){const big=h('div','tchar',ch),box=h('div','tbox');
    const fresh=()=>{const p=tracePad([ch],{onDone:()=>{sfx.win();confetti();TTS.say([pickM(PRAISE)]);}});box.replaceChildren(p);return p;};
    const btn=(e,lab,fn)=>{const b=h('button','spk tdemob',ico(e));b.setAttribute('aria-label',lab);b.onclick=ev=>{ev.stopPropagation();sfx.tap();fn();};return b;};
    let pad=fresh();c.append(mrow(big,btn('▶️','Lihat caranya',()=>pad.demo()),btn('🔄','Ulangi',()=>{pad=fresh();})),box);
    setTimeout(()=>pad.isConnected&&pad.demo(),400);return [big];}};}
STAGES.push(
 {id:'tulis1',title:'Menulis Huruf Kecil',c:'mint',art:chips(['a','b','c'])+BR+ems(['✍️']),play:[['tulis',1],['tulis',10]],items:()=>TULIS_LOW.map(traceItem)},
 {id:'tulis2',title:'Menulis Huruf Besar',c:'sky',art:chips(['A','B','C'])+BR+ems(['✍️']),play:[['tulis',27],['tulis',40]],items:()=>TULIS_UP.map(traceItem)},
 {id:'tulis3',title:'Menulis Angka',c:'sun',art:chips(['1','2','3'])+BR+ems(['✍️']),play:[['tulis',53],['tulis',58]],items:()=>TULIS_NUM.map(traceItem)});

/* --- games --- */
// level → what to trace: 1–26 small letters (new letter first, then review), 27–52 capitals, 53–62 digits, 63–100 short words
function traceTask(D){const L=D.L,q=D.q;
  const pickPrev=(list,i)=>list[rint(0,Math.max(0,i))];
  if(L<=26){const i=L-1;return {chars:[q<3||i===0?TULIS_LOW[i]:pickPrev(TULIS_LOW,i-1)],guide:q===0?0:q<3?1:1};}
  if(L<=52){const i=L-27;return {chars:[q<3||i===0?TULIS_UP[i]:pickPrev(TULIS_UP,i-1)],guide:q===0?0:1};}
  if(L<=62){const i=L-53;return {chars:[q<3||i===0?TULIS_NUM[i]:pickPrev(TULIS_NUM,i-1)],guide:q===0?0:1};}
  const max=L<=75?3:L<=88?4:5,w=takeWord(D,x=>LET(x)&&x.w.length<=max);return {chars:[...w.w],word:w,guide:L>=80&&q%2?2:1};}
// Dikte keys: the word's letters plus a few others early on, the full alphabet later
const KEYROW='abcdefghijklmnopqrstuvwxyz';
GAMES.push(
 {id:'tulis',title:'Tulis Huruf',c:'mint',ins:'Ikuti garisnya dengan jarimu. Mulai dari titik hijau.',art:chips(['a'])+ems(['✍️']),
  fn(st,api,D){D.keep=true;const t=traceTask(D),say=t.word?[t.word.w]:[charName(t.chars[0])];
   const q=h('div','q tq');if(t.word&&t.word.e)q.append(P(t.word.e));q.append(h('div','tchar sm',t.word?caseWord(t.word.w):t.chars[0]),spkBtn(()=>TTS.say(say)));
   const pad=tracePad(t.chars,{guide:t.guide,onDone:()=>api.ok()});
   const demo=h('button','spk tdemob',ico('▶️'));demo.setAttribute('aria-label','Lihat caranya');demo.onclick=()=>{sfx.tap();pad.demo();};q.append(demo);
   api.solve(()=>pad.solve());const a=h('div','a ta');a.append(pad);st.append(q,a);if(D.q===0)setTimeout(()=>pad.isConnected&&pad.demo(),600);return say;}},
 {id:'dikte',title:'Dikte',c:'grape',ins:'Dengarkan katanya, lalu ketik hurufnya satu per satu.',art:ems(['🔊'])+BR+chips(['b','o','l','a']),
  fn(st,api,D){const w=takeWord(D,x=>LET(x)&&x.w.length<=(D.x?14:D.L<=10?4:D.L<=20?5:6));let pos=0;
   const q=h('div','q');if(D.b<3&&w.e)q.append(P(w.e));q.append(spkBtn(()=>TTS.say([w.w],{rate:.7}),true));
   const slots=h('div','slots'+(w.w.length>8?' tight':''));[...w.w].forEach(()=>slots.append(h('div','slot')));q.append(slots);
   const keys=D.L<=25?[...new Set([...w.w,...sample([...KEYROW].filter(c=>!w.w.includes(c)),D.L<=10?2:D.L<=20?4:6)])].sort():[...KEYROW];
   const kb=h('div','kbd'+(keys.length>12?' full':''));
   const fill=(i,ch,cls)=>{const sl=slots.children[i];sl.textContent=casePart(ch,i===0?0:1);sl.classList.add('fill',cls);};
   keys.forEach(ch=>{const b=h('button','key',caseUnit(ch));if(ch===w.w[0])b.dataset.first=1;
     b.onclick=()=>{if(G.done||pos>=w.w.length)return;TTS.say([LN[ch]]);
       if(ch===w.w[pos]){fill(pos,ch,'pop');pos++;if(pos===w.w.length)api.ok();}else api.bad(b);};kb.append(b);});
   api.ans([...w.w].map(c=>LN[c]).concat(w.w),()=>{for(let i=pos;i<w.w.length;i++)fill(i,w.w[i],'shown');});
   api.solve(()=>{while(pos<w.w.length&&!G.done)[...kb.children].find(b=>b.textContent===caseUnit(w.w[pos])).click();});
   const a=h('div','a');a.append(kb);st.append(q,a);return [w.w];}}
);
