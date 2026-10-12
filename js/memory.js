/* ============ memory cards: flip two cards, find the pairs ============ */
// a mismatch only costs a heart when the child had already seen the partner card (a real memory slip, not a first look)
function memoryGame(st,api,keys,front,back,say){
  const cards=shuffle(keys.flatMap(k=>[{k,s:0},{k,s:1}])),seen=new Set();let open=[],pairs=0,busy=false;
  const grid=h('div','mem');grid.style.setProperty('--cols',Math.ceil(cards.length/2));
  const partner=c=>cards.find(x=>x.k===c.k&&x!==c);
  cards.forEach(c=>{c.b=h('button','mc','<span class="mcq">?</span>');
    c.b.onclick=()=>{if(G.done||busy||c.b.classList.contains('up'))return;
      c.b.classList.add('up');c.b.innerHTML=c.s?back(c.k):front(c.k);sfx.tap();TTS.say([say(c.k)]);open.push(c);if(open.length<2)return;
      const [x,y]=open;open=[];
      if(x.k===y.k){[x,y].forEach(z=>z.b.classList.add('ok'));pairs++;if(pairs===keys.length)api.ok();return;}
      const slip=seen.has(partner(x))||seen.has(partner(y));seen.add(x);seen.add(y);busy=true;
      if(slip)api.bad(y.b);else sfx.no();
      setTimeout(()=>{[x,y].forEach(z=>{z.b.classList.remove('up');z.b.innerHTML='<span class="mcq">?</span>';});busy=false;},900);};
    grid.append(c.b);});
  st.append(grid);}
const MEMN=[2,2,3,3,4];

GAMES.push(
 {id:'memori',title:'Kartu Memori',c:'grape',ins:'Buka dua kartu. Cari gambar dan katanya yang sama.',art:'<span class="chip" style="color:#8E6CF0">?</span>'+ems(['🐱'])+'<span class="br"></span>'+chips(['kucing','?']),
  fn(st,api,D){const ws=pickDistinct(D,MEMN[D.b],x=>HASE(x)&&x.w.length<=8);memoryGame(st,api,ws,w=>`<span class="mcw">${caseWord(w.w)}</span>`,w=>ico(w.e),w=>w.w);}});

MATH_GAMES.push(
 {id:'mmemori',title:'Kartu Memori Angka',c:'grape',ins:'Buka dua kartu. Cari gambar dan angkanya yang sama.',art:chips(['3','?'])+'<span class="br"></span>'+ems(['🍓','🍓','🍓']),
  fn(st,api,D){const e=pick(COUNTEMO),[lo,hi]=qtyRange(D),ns=sample(range(lo,hi),MEMN[D.b]);
   memoryGame(st,api,ns,n=>`<span class="mcw">${n}</span>`,n=>qtyEl(n,e,true).outerHTML,numW);}});
