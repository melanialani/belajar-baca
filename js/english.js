/* ============ English: first words with pictures (learn stages + games), spoken by an English voice ============ */
// [english, indonesian, picture]
const EN_CATS=[
 {id:'en-color',title:'Colors',say:'Warna dalam bahasa Inggris',c:'sun',words:[['red','merah','🔴'],['blue','biru','🔵'],['yellow','kuning','🟡'],['green','hijau','🟢'],['orange','jingga','🟠'],['purple','ungu','🟣'],['black','hitam','⚫'],['white','putih','⚪'],['brown','cokelat','🟤']]},
 {id:'en-animal',title:'Animals',say:'Hewan dalam bahasa Inggris',c:'peach',words:[['cat','kucing','🐱'],['dog','anjing','🐶'],['bird','burung','🐦'],['fish','ikan','🐟'],['chicken','ayam','🐔'],['duck','bebek','🦆'],['cow','sapi','🐄'],['horse','kuda','🐴'],['rabbit','kelinci','🐰'],['elephant','gajah','🐘'],
   ['lion','singa','🦁'],['tiger','harimau','🐯'],['monkey','monyet','🐒'],['bear','beruang','🐻'],['frog','katak','🐸'],['snake','ular','🐍'],['butterfly','kupu-kupu','🦋'],['bee','lebah','🐝'],['turtle','kura-kura','🐢'],['sheep','domba','🐑']]},
 {id:'en-food',title:'Fruits & Food',say:'Buah dan makanan dalam bahasa Inggris',c:'mint',words:[['apple','apel','🍎'],['banana','pisang','🍌'],['orange','jeruk','🍊'],['grapes','anggur','🍇'],['watermelon','semangka','🍉'],['strawberry','stroberi','🍓'],['mango','mangga','🥭'],
   ['pineapple','nanas','🍍'],['bread','roti','🍞'],['rice','nasi','🍚'],['egg','telur','🥚'],['milk','susu','🥛'],['water','air','💧'],['cake','kue','🍰'],['ice cream','es krim','🍦']]},
 {id:'en-body',title:'My Body',say:'Tubuhku dalam bahasa Inggris',c:'rose',words:[['eye','mata','👁️'],['ear','telinga','👂'],['nose','hidung','👃'],['mouth','mulut','👄'],['hand','tangan','✋'],['foot','telapak kaki','🦶'],['leg','kaki','🦵'],['tooth','gigi','🦷'],['arm','lengan','💪'],['hair','rambut','💇']]},
 {id:'en-family',title:'Family',say:'Keluarga dalam bahasa Inggris',c:'lilac',words:[['mother','ibu','👩'],['father','ayah','👨'],['sister','saudara perempuan','👧'],['brother','saudara laki-laki','👦'],['baby','bayi','👶'],['grandmother','nenek','👵'],['grandfather','kakek','👴'],['friend','teman','🧒']]},
 {id:'en-things',title:'Things',say:'Benda dalam bahasa Inggris',c:'sky',words:[['book','buku','📖'],['pencil','pensil','✏️'],['bag','tas','🎒'],['ball','bola','⚽'],['car','mobil','🚗'],['bus','bus','🚌'],['house','rumah','🏠'],['chair','kursi','🪑'],['door','pintu','🚪'],['sun','matahari','☀️'],
   ['moon','bulan','🌙'],['star','bintang','⭐'],['tree','pohon','🌳'],['flower','bunga','🌸'],['clock','jam','⏰']]},
 {id:'en-greet',title:'Hello!',say:'Salam dalam bahasa Inggris',c:'pink',words:[['hello','halo','👋'],['good morning','selamat pagi','🌅'],['good night','selamat tidur','🌙'],['thank you','terima kasih','🙏'],['please','tolong','🥺'],['sorry','maaf','😔'],['goodbye','sampai jumpa','👋'],['yes','ya','✅'],['no','tidak','❌']]}
];
const EN_NUM=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
const en=t=>({t,en:true});
// all words as one bank (numbers included), each with its category and a running difficulty
const EN_BANK=[...EN_CATS.flatMap((c,ci)=>c.words.map(([w,id,e],i)=>({w,id,e,cat:c.id,d:ci+i/40}))),...range(1,20).map(n=>({w:EN_NUM[n],id:numW(n),e:null,n,cat:'en-num',d:n<=10?1.5:4.5}))];
function enItem(x){return {k:'en',e:x.e,label:(x.e?`<span class="ge">${ico(x.e)}</span>`:'')+x.w,say:[en(x.w),'artinya '+x.id,en(x.w)],
  render(c){const pic=x.e?h('div','pic',ico(x.e)):numEl(x.n),w=h('div','qword enw',x.w),m=h('div','enid',caseWord(x.id));c.append(pic,w,m);return [w,m,w];}};}
const EN_STAGES=[...EN_CATS.slice(0,1).map(c=>({id:c.id,title:c.title,say:c.say,c:c.c,art:ems(c.words.slice(0,3).map(x=>x[2])),play:[['elisten',1],['ematch',1]],items:()=>EN_BANK.filter(x=>x.cat===c.id).map(enItem)})),
 {id:'en-num',title:'Numbers',say:'Angka dalam bahasa Inggris',c:'coral',art:chips(['1','2','3'])+BR+chips(['one']),play:[['elisten',5],['eword',5]],items:()=>EN_BANK.filter(x=>x.cat==='en-num').map(enItem)},
 ...EN_CATS.slice(1).map((c,i)=>({id:c.id,title:c.title,say:c.say,c:c.c,art:ems(c.words.slice(0,3).map(x=>x[2])),play:[['elisten',1+i*10],['ematch',1+i*10],['earti',1+i*10]],items:()=>EN_BANK.filter(x=>x.cat===c.id).map(enItem)}))];
// level → words: 1–25 a growing set (colors and animals first), 26–100 every word, more choices, words without pictures
const enPool=D=>{const top=D.x?99:1+D.L*0.28;return EN_BANK.filter(x=>x.d<=top);};
function enTake(D,f=()=>true){const p=enPool(D).filter(f),fr=p.filter(x=>!D.used.has(x.w));
  const rk=redoPick(D,k=>!D.used.has(k)&&p.some(x=>x.w===k));const x=rk?p.find(y=>y.w===rk):bySeg(D,(fr.length?fr:p).slice().sort((a,b)=>a.d-b.d));D.used.add(x.w);D.key=x.w;return x;}
// wrong choices: other words, never two with the same picture
const enOthers=(x,n,D,f=()=>true)=>{const p=EN_BANK.filter(y=>y.w!==x.w&&y.id!==x.id&&y.e!==x.e&&f(y)),same=p.filter(y=>y.cat===x.cat),out=[],es=new Set();
  for(const y of shuffle(D.b>=2&&same.length>=n?same:p)){const k=y.e||y.w;if(es.has(k))continue;es.add(k);out.push(y);if(out.length===n)break;}return out;};
const enPic=x=>x.e?ico(x.e):`<span class="ennum">${x.n}</span>`;
const ENG_GAMES=[
 {id:'elisten',title:'Listen & Pick',c:'sky',ins:'Dengarkan kata bahasa Inggrisnya, lalu pilih gambarnya.',art:ems(['🔊'])+BR+ems(['🐱','🐶']),
  fn(st,api,D){const x=enTake(D),list=shuffle([x,...enOthers(x,optN(D)-1,D)]);
   const q=h('div','q');q.append(spkBtn(()=>TTS.say([en(x.w)]),true));
   const a=h('div','a');a.append(optsEl(list,enPic,(y,b)=>{if(y===x){b.classList.add('right');api.ok();}else{TTS.say([en(y.w)]);api.bad(b);}},'pic',y=>y===x));
   api.ans([en(x.w),'artinya '+x.id]);st.append(q,a);return [en(x.w)];}},
 {id:'eword',title:'Read & Pick',c:'mint',ins:'Baca kata bahasa Inggrisnya, lalu pilih gambarnya.',art:chips(['cat'])+BR+ems(['🐱','🐟']),
  fn(st,api,D){const x=enTake(D),list=shuffle([x,...enOthers(x,optN(D)-1,D)]);
   const q=h('div','q');q.append(h('div','qword enw',x.w),spkBtn(()=>TTS.say([en(x.w)])));
   const a=h('div','a');a.append(optsEl(list,enPic,(y,b)=>{if(y===x){b.classList.add('right');api.ok();}else{TTS.say([en(y.w)]);api.bad(b);}},'pic',y=>y===x));
   api.ans([en(x.w),'artinya '+x.id]);st.append(q,a);}},
 {id:'ematch',title:'Match Words',c:'rose',ins:'Pilih gambar, lalu pilih kata bahasa Inggrisnya.',art:ems(['🍎'])+chips(['apple']),
  fn(st,api,D){const ws=[];for(let i=0;i<bv(D,[2,2,3,3,3],[3,3,4]);i++){const x=enTake(D,y=>y.e&&!ws.some(z=>z.e===y.e||z.w===y.w));ws.push(x);}
   matchGame(st,api,ws.map(x=>({w:x.w,say:en(x.w),e:x.e,id:x.id})),x=>`<span class="em">${ico(x.e)}</span>`,x=>TTS.say([x.id||'']),'');}},
 {id:'earti',title:'Arti Kata',c:'lilac',ins:'Apa artinya dalam bahasa Indonesia?',art:chips(['dog'])+BR+chips(['anjing']),
  fn(st,api,D){const x=enTake(D),list=shuffle([x,...enOthers(x,optN(D)-1,D)]);
   const q=h('div','q');if(D.L<=25&&x.e)q.append(P(x.e));q.append(h('div','qword enw',x.w),spkBtn(()=>TTS.say([en(x.w)])));
   const a=h('div','a');a.append(optsEl(list,y=>caseWord(y.id),(y,b)=>{if(y===x){b.classList.add('right');api.ok();}else{TTS.say([y.id]);api.bad(b);}},'txt',y=>y===x));
   api.ans([x.id]);st.append(q,a);return [en(x.w)];}}
];
const buildEnLearnCards=()=>buildLearnCards($('#enLearnCards'),EN_STAGES);
const buildEnGameCards=()=>buildCards($('#enGameCards'),ENG_GAMES,openLevels,starBadge);
