/* ============ phonics games: blending, syllable clapping, sentences, reading aloud ============ */
const plainSyl=x=>!x.s.includes('_')&&!x.w.includes('-');

/* --- short sentences: subject + action, the answer picture shows both --- */
const SUBJ={ibu:'👩',ayah:'👨',adik:'👶',kakak:'👧',kucing:'🐱',anjing:'🐶',monyet:'🐒',kelinci:'🐰',ayam:'🐔',sapi:'🐄'};
const ACT={'makan roti':'🍞','makan pisang':'🍌','makan apel':'🍎','makan ikan':'🐟','makan wortel':'🥕','makan jagung':'🌽','makan rumput':'🌱','makan kue':'🍰',
  'minum susu':'🥛','minum kopi':'☕','main bola':'⚽','main balon':'🎈','naik sepeda':'🚲','naik mobil':'🚗','naik kapal':'🚢','baca buku':'📖'};
const PEOPLE_ACT=Object.keys(ACT).filter(a=>a!=='makan rumput'&&a!=='minum kopi');
// coffee only for grown-ups; adik is a toddler (👶), so no bicycle; cats get no cow's milk
const CAN={ibu:[...PEOPLE_ACT,'minum kopi'],ayah:[...PEOPLE_ACT,'minum kopi'],adik:PEOPLE_ACT.filter(a=>a!=='naik sepeda'),kakak:PEOPLE_ACT,kucing:['makan ikan','main bola','main balon'],anjing:['makan roti','main bola','main balon'],
  monyet:['makan pisang','makan apel','naik sepeda'],kelinci:['makan wortel','makan apel'],ayam:['makan jagung'],sapi:['makan rumput']};
const SENT=Object.entries(CAN).flatMap(([s,acts])=>acts.map(a=>({s,a,t:s+' '+a})));
// easy: people doing everyday things; later bands add animals and less common actions
const EASY_ACT=['makan roti','minum susu','main bola','baca buku','makan apel','naik mobil'];
const sentScore=x=>(SUBJ[x.s]&&['ibu','ayah','adik','kakak'].includes(x.s)?0:2)+(EASY_ACT.includes(x.a)?0:1)+x.t.length*.05;
const SENT_SORTED=[...SENT].sort((a,b)=>sentScore(a)-sentScore(b)||a.t.localeCompare(b.t));
const sentPic=x=>`${ico(SUBJ[x.s])}${ico(ACT[x.a])}`;

/* --- reading aloud: browser speech recognition, only offered where it exists --- */
const SpeechRec=window.SpeechRecognition||window.webkitSpeechRecognition;
const normSpeech=s=>s.toLowerCase().replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();
function editDist(a,b){const d=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)d[0][j]=j;
  for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length];}
// lenient: kids' pronunciation and recognizer errors; one letter off is fine for longer words
const heardWord=(alts,w)=>alts.map(normSpeech).some(t=>t.replace(/ /g,'')===w||t.split(' ').some(x=>x===w||(w.length>=5&&editDist(x,w)<=1)));

GAMES.push(
 {id:'kereta',title:'Kereta Bunyi',c:'peach',ins:'Ketuk gerbongnya satu per satu, lalu pilih gambarnya.',art:ems(['🚂'])+chips(['ba','ju'])+'<span class="br"></span>'+ems(['👕']),
  fn(st,api,D){const w=takeWord(D,x=>HASE(x)&&plainSyl(x)&&x.s.length>=bv(D,[2,2,2,3,3],[3,3,3,4])&&x.s.length<=bv(D,[2,2,3,3,4],[4,4,5,5,6]));
   const q=h('div','q'),train=h('div','btrain');train.append(h('div','loco',ico('🚂')));let pos=0;
   const a=h('div','a');
   w.s.forEach((s,i)=>{const c=h('button','bcar',`<span>${casePart(s,i)}</span>`);
     c.onclick=()=>{if(G.done||pos>=w.s.length)return;
       if(i!==pos){c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');TTS.say(['Mulai dari gerbong depan']);return;}
       c.classList.add('lit');pos++;
       if(pos<w.s.length){TTS.say([s],{rate:.7});return;}
       // all cars tapped: they roll together while the syllables blend into the word, then the child picks the picture
       train.classList.add('join');TTS.say([...w.s,w.w],{rate:.6});
       a.append(optsEl(shuffle([w,...distract(w,optN(D)-1,D,HASE)]),x=>ico(x.e),(x,b)=>{if(x===w){b.classList.add('right');api.ok();}else{TTS.say([x.w]);api.bad(b);}},'pic',x=>x===w));};
     train.append(c);});
   api.solve(()=>{train.querySelectorAll('.bcar').forEach(c=>c.click());a.querySelector('[data-ok]').click();});
   api.ans([w.w],()=>{train.querySelectorAll('.bcar').forEach(c=>c.classList.add('lit'));if(!a.children.length)a.append(P(w.e));});
   preloadEmo(w.e);q.append(train);st.append(q,a);}},
 {id:'tepuk',title:'Tepuk Suku Kata',c:'lilac',ins:'Pukul drumnya satu kali untuk setiap suku kata, lalu tekan Sudah.',art:ems(['🥁'])+'<span class="br"></span>'+chips(['ga','jah']),
  fn(st,api,D){const w=takeWord(D,x=>HASE(x)&&plainSyl(x)&&x.s.length<=bv(D,[2,3,3,4,4],[4,5,5,6]));let n=0;
   const q=h('div','q');q.append(P(w.e));const word=h('div','qword');q.append(word,spkBtn(()=>TTS.say([w.w])));
   const dotsEl=h('div','tdots'),drum=h('button','drum',ico('🥁'));
   drum.onclick=()=>{if(G.done||n>=6)return;n++;tone([160,110],.14,'sine',.04,.3);drum.classList.remove('pop');void drum.offsetWidth;drum.classList.add('pop');dotsEl.append(h('i',''));};
   const split=()=>{word.innerHTML=w.s.map((s,i)=>`<span style="color:${COL[i%6]}">${casePart(s,i)}</span>`).join(' ');};
   const ok=okBtn('Sudah',b=>{if(n===w.s.length){split();api.ok();}
     else{api.bad(b);n=0;dotsEl.innerHTML='';}});
   api.solve(()=>{n=0;dotsEl.innerHTML='';w.s.forEach(()=>drum.click());ok.click();});
   api.ans([...w.s,numW(w.s.length)+' suku kata'],()=>{split();dotsEl.innerHTML='<i></i>'.repeat(w.s.length);});
   const a=h('div','a');a.append(dotsEl,mrow(drum,ok));st.append(q,a);return [w.w];}},
 {id:'kalimat',title:'Kalimat Pendek',c:'mint',ins:'Baca kalimatnya, lalu pilih gambarnya. Ketuk kata kalau mau dengar.',art:chips(['ibu','makan','roti'])+'<span class="br"></span>'+ems(['👩','🍞']),
  fn(st,api,D){const fr=SENT_SORTED.filter(x=>!D.used.has(x.t));const rk=redoPick(D,k=>!D.used.has(k)&&SENT.some(y=>y.t===k));const x=rk?SENT.find(y=>y.t===rk):bySeg(D,fr.length?fr:SENT_SORTED);D.used.add(x.t);D.key=x.t;
   const near=D.b>=2;let c=SENT.filter(y=>y.t!==x.t&&(near?(y.s===x.s)!==(y.a===x.a):y.s!==x.s&&y.a!==x.a));
   if(c.length<optN(D)-1)c=SENT.filter(y=>y.t!==x.t&&ACT[y.a]!==ACT[x.a]);
   const dis=[],seen=new Set([sentPic(x)]);for(const y of shuffle(c)){if(seen.has(sentPic(y)))continue;seen.add(sentPic(y));dis.push(y);if(dis.length===optN(D)-1)break;}
   const q=h('div','q'),sent=h('div','sent');x.t.split(' ').forEach((t,i)=>{const b=h('button','sw',casePart(t,i));b.onclick=()=>{sfx.tap();TTS.say([t]);};sent.append(b);});q.append(sent);
   const a=h('div','a');a.append(optsEl(shuffle([x,...dis]),sentPic,(y,b)=>{if(y===x){b.classList.add('right');api.ok();}else api.bad(b);},'pic sentpic',y=>y===x));api.ans([x.t]);st.append(q,a);}}
);
if(SpeechRec)GAMES.push(
 {id:'keras',title:'Baca Keras',c:'coral',ins:'Tekan mikrofon, lalu baca katanya dengan suara keras.',art:chips(['sapi'])+'<span class="br"></span>'+ems(['🎤']),
  fn(st,api,D){D.keep=true;const w=takeWord(D,x=>HASE(x)&&LET(x));let miss=0;preloadEmo(w.e);api.solve(()=>api.ok());
   const q=h('div','q'),pic=h('div','gpic','❓'),word=h('div','qword'+(w.w.length>9?' long':''),caseWord(w.w)),heard=h('div','heard','');q.append(pic,word);
   const mic=h('button','spk big mic',ico('🎤'));mic.setAttribute('aria-label','Mikrofon');
   const help=spkBtn(()=>TTS.say([w.w]));help.hidden=true;
   mic.onclick=()=>{if(G.done||mic.classList.contains('on'))return;TTS.stop();
     const r=new SpeechRec();r.lang='id-ID';r.interimResults=false;r.maxAlternatives=5;mic.classList.add('on');heard.textContent='';
     r.onresult=e=>{if(!mic.isConnected||G.done)return;const alts=[...e.results[0]].map(x=>x.transcript);
       if(heardWord(alts,w.w)){pic.innerHTML=ico(w.e);pic.classList.add('pop');api.ok();return;}
       miss++;heard.textContent='Terdengar: '+(alts[0]||'…');
       // the recognizer is not perfect: the first two misses only ask again, the third counts as a mistake and offers the voice
       if(miss>=3){help.hidden=false;miss=0;api.bad(mic);}else{help.hidden=miss<2;TTS.say(['Coba baca lagi ya']);}};
     r.onerror=e=>{if(e.error==='not-allowed'||e.error==='service-not-allowed')toast('Izinkan mikrofon di browser dulu ya');else if(e.error==='no-speech')TTS.say(['Aku belum dengar. Coba lagi ya']);};
     r.onend=()=>mic.classList.remove('on');
     try{r.start();}catch(err){mic.classList.remove('on');}};
   const a=h('div','a');a.append(mic,mrow(help),heard);st.append(q,a);}}
);
