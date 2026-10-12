/* ============ Sains: colors, shapes, patterns, animals, fruit, vegetables and science topics (learn) + games ============ */
// k2–k5 were the picture dictionary of Belajar Baca; ids kept so saved progress still counts
const SCI_STAGES=[
 {id:'k2',title:'Hewan',c:'peach',art:ems(['🐬','🐒','🐓','🐢']),play:[['tnama',3],['sambung',3],['bacaan',3]],items:()=>easyFirst(HEWAN).map(picItem)},
 {id:'k3',title:'Sayur',c:'grape',art:ems(['🍆','🌽','🥕','🍅']),play:[['tnama',5],['sambung',5],['bacaan',5]],items:()=>easyFirst(SAYUR).map(picItem)},
 {id:'k4',title:'Buah',c:'sky',art:ems(['🍌','🍎','🍊','🍉']),play:[['tnama',5],['sambung',5],['bacaan',5]],items:()=>easyFirst(BUAH).map(picItem)},
 {id:'k5',title:'Warna',c:'sun',art:'<span class="chip" style="color:#FF3B47">merah</span><span class="chip" style="color:#3B8BFF">biru</span><span class="chip" style="color:#3CC75A">hijau</span>',play:[['tnama',2],['bacaan',2],['awal',2]],items:()=>easyFirst(WARNA).map(picItem)}
];
const SCI_GAMES=[];
const emoList=s=>s.match(EMRE)||[];
// picture strip of a topic: groups split by "|", ">" draws an arrow, "+" a plus
const sciPics=p=>p.split('|').map(g=>`<div class="scig">${g.split('>').map(x=>x.split('+').map(e=>e.replace(EMRE,m=>ico(m))).join('<span class="sciar">+</span>')).join('<span class="sciar">→</span>')}</div>`).join('');
// one science topic: question, pictures, then each sentence read and highlighted in turn
function sciItem([short,q,p,lines]){const e=emoList(p)[0];
  return {k:'sci',e,label:`<span class="ge">${ico(e)}</span>${caseUnit(short)}`,say:[q,...lines],
    render(c){const qq=h('div','sciq',caseUnit(q)),pics=h('div','scipics',sciPics(p)),box=h('div','scilines'),ls=lines.map(x=>h('p','scil',caseUnit(x)));
      box.append(...ls);c.append(qq,pics,box);return [qq,...ls];}};}
const SUBPAL=['peach','sun','mint','sky','lilac','rose'];
const sciStage=(g,c)=>({id:g.id,title:g.title,c,art:ems(emoList(g.art)),play:[['squiz',1],['sbs',1]],items:()=>g.topics.map(sciItem)});
// a category with groups is one card that opens its smaller cards (sub); others are a single card
SCI_STAGES.push(...SCI_CATS.map(cat=>cat.groups?{id:cat.id,title:cat.title,c:cat.c,art:ems(emoList(cat.art)),sub:cat.groups.map((g,i)=>sciStage(g,SUBPAL[i%SUBPAL.length]))}:sciStage(cat,cat.c)));

// questions of the allowed difficulty for the band, easiest first, no repeats within a level
function sciTake(D,list){const maxd=[1,1,2,2,3][D.b],pool=list.filter(x=>x[3]<=maxd).sort((a,b)=>a[3]-b[3]),fresh=pool.filter(x=>!D.used.has(x[0]));
  const it=bySeg(D,fresh.length?fresh:pool);D.used.add(it[0]);return it;}
SCI_GAMES.push(
 {id:'squiz',title:'Kuis Sains',c:'sky',ins:'Dengarkan pertanyaannya, lalu pilih gambarnya.',art:chips(['?'])+BR+ems(['🐔','🐱']),
  fn(st,api,D){const [qs,right,wrong]=sciTake(D,SCI_QUIZ),ans=pick(emoList(right)),no=emoList(wrong);
   const q=h('div','q');q.append(h('div','sciq',caseUnit(qs)),spkBtn(()=>TTS.say([qs])));
   const a=h('div','a');a.append(optsEl(shuffle([ans,...sample(no,Math.min(no.length,OPT[D.b]-1))]),ico,(e,b)=>{if(e===ans){b.classList.add('right');api.ok();}else api.bad(b);},'pic'));
   st.append(q,a);return [qs];}},
 {id:'sbs',title:'Benar atau Salah',c:'coral',ins:'Dengarkan, lalu pilih benar atau salah.',art:ems(['🐟'])+BR+chips(['Benar','Salah']),
  fn(st,api,D){const [t,ok,e]=sciTake(D,SCI_FACTS);
   const q=h('div','q');q.append(P(e),h('div','sciq',caseUnit(t)),spkBtn(()=>TTS.say([t])));
   const a=h('div','a');a.append(optsEl([1,0],v=>v?`${IC.ok}Benar`:`${IC.no}Salah`,(v,b)=>{if(v===ok){b.classList.add('right');api.ok();}else api.bad(b);},'tf'));
   st.append(q,a);return [t];}}
);
const buildSciLearnCards=()=>buildLearnCards($('#sciLearnCards'),SCI_STAGES);
const buildSciGameCards=()=>buildCards($('#sciGameCards'),SCI_GAMES,openLevels,starBadge);
