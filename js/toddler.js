/* ============ Si Kecil: play-and-hear games for toddlers (no levels, no stars, nothing wrong) ============ */
// animal sounds as Indonesian children say them
const KSOUND=[['kucing','🐱','meong, meong'],['anjing','🐶','guk, guk'],['ayam','🐔','kukuruyuk'],['bebek','🦆','kwek, kwek'],['sapi','🐄','mooo'],
 ['kambing','🐐','mbeek'],['katak','🐸','kwok, kwok'],['burung','🐦','cuit, cuit'],['singa','🦁','aum'],['tikus','🐭','cit, cit'],['kuda','🐴','hiii'],
 ['domba','🐑','mbeek'],['lebah','🐝','nguuung'],['ular','🐍','sssss'],['monyet','🐒','uk, uk, aa'],['harimau','🐯','aum']];
// what hides behind the curtain: family, animals, fruit, toys
const KPEEK=[['ibu','👩'],['ayah','👨'],['adik','👶'],['kakak','👧'],['nenek','👵'],['kakek','👴'],['kucing','🐱'],['anjing','🐶'],['kelinci','🐰'],['panda','🐼'],['beruang','🐻'],['bebek','🦆'],
 ['apel','🍎'],['pisang','🍌'],['bola','⚽'],['balon','🎈'],['boneka','🧸'],['mobil','🚗'],['kereta','🚂'],['bintang','⭐']];
const KCOLOR=[['merah','#FF3B47',523],['jingga','#FF8A1F',587],['kuning','#FFD21F',659],['hijau','#3CC75A',698],['biru','#3B8BFF',784],['ungu','#9B5CFF',880],['merah muda','#FF8CC6',988],['cokelat','#8B5A2B',1047]];
let K={tok:0};
function openKecil(g){K={g,tok:K.tok+1};onScreen('kecil');$('#kecilTitle').textContent=g.title;const st=$('#kstage');st.innerHTML='';st.className='kstage '+g.id;TTS.say([g.title]);g.run(st,K.tok);}
const kAlive=tok=>tok===K.tok&&$('#kecil').classList.contains('on');
const kPop=el=>{el.classList.remove('kpop');void el.offsetWidth;el.classList.add('kpop');};

// 1. tap an animal, hear its name and its sound
function kSuara(st){const grid=h('div','kgrid');
  const fill=()=>{grid.innerHTML='';sample(KSOUND,6).forEach(([nm,e,snd])=>{const b=h('button','kbig',ico(e));
    b.onclick=()=>{kPop(b);sfx.tap();TTS.say([`${cap(nm)}.`,`${snd}!`]);};grid.append(b);});};
  const more=h('button','kmore',ico('🔄'));more.setAttribute('aria-label','Hewan lain');more.onclick=()=>{sfx.tap();fill();};
  fill();st.append(grid,more);}
// 2. peekaboo: tap the curtain, something is behind it
function kCiluk(st){let open=false,cur=null;const box=h('button','kpeek'),pic=h('div','kpic'),cur2=h('div','kcurtain');box.append(pic,cur2);
  const next=()=>{cur=pick(KPEEK.filter(x=>x!==cur));pic.innerHTML=ico(cur[1]);box.classList.remove('open');open=false;preloadEmo(cur[1]);};
  box.onclick=()=>{if(!open){open=true;box.classList.add('open');sfx.win();confetti();TTS.say(['Ciluk... ba!',`Ada ${cur[0]}!`]);}else{sfx.tap();next();TTS.say(['Di mana ya?']);}};
  next();st.append(box);}
// 3. colour piano: each key plays a note and says its colour
function kPiano(st){const keys=h('div','kpiano'),name=h('div','kname','');
  KCOLOR.forEach(([nm,c,f])=>{const b=h('button','kkey');b.style.background=c;
    b.onclick=()=>{tone([f],.5,'triangle',0,.22);kPop(b);name.textContent=caseWord(nm);name.style.color=c;TTS.say([nm]);};keys.append(b);});
  st.append(name,keys);}
// 4. bubbles float up; every pop is counted aloud, ten pops is a party
function kBubble(st,tok){let n=0;const sky=h('div','ksky'),cnt=h('div','kcount','');st.append(cnt,sky);
  const spawn=()=>{if(!kAlive(tok))return;if(sky.children.length<7){const b=h('button','kbub');const sz=70+rnd()*60;
      Object.assign(b.style,{left:(4+Math.random()*80)+'%',width:sz+'px',height:sz+'px',animationDuration:(6+Math.random()*4)+'s'});b.style.setProperty('--hue',Math.random()*360|0);
      b.onpointerdown=()=>{if(b.classList.contains('pop'))return;b.classList.add('pop');tone([900,1300],.08,'sine',.04,.14);n++;cnt.textContent=n;
        if(n===10){confetti();sfx.win();TTS.say(['Sepuluh!','Hore! Hebat sekali!']);n=0;setTimeout(()=>{if(kAlive(tok))cnt.textContent='';},2500);}else TTS.say([numW(n)]);
        setTimeout(()=>b.remove(),300);};
      b.addEventListener('animationend',()=>b.remove());sky.append(b);}
    setTimeout(spawn,900);};
  spawn();}
const KECIL=[
 {id:'ksuara',title:'Suara Hewan',c:'peach',art:ems(['🐱','🐶'])+BR+ems(['🐔','🐄']),run:kSuara},
 {id:'kciluk',title:'Cilukba',c:'sky',art:ems(['🙈'])+BR+ems(['👶']),run:kCiluk},
 {id:'kpiano',title:'Piano Warna',c:'lilac',art:ems(['🎹'])+BR+chips(['do','re','mi']),run:kPiano},
 {id:'kbubble',title:'Pecah Gelembung',c:'mint',art:ems(['🫧','🫧'])+BR+ems(['🫧']),run:kBubble}];
function buildKecilCards(){buildCards($('#kecilCards'),KECIL,openKecil);}
