/* ============ Buku Cerita (learn: read-along picture stories) + Baca Cerita (game: questions about a story) ============ */
// a sentence as tappable words; each word knows where it starts in the sentence (for the read-along highlight)
function sentWords(txt){const box=h('div','stxt'),words=[];let pos=0;
  txt.split(' ').forEach(w=>{const s=txt.indexOf(w,pos);pos=s+w.length;const b=h('button','sw',caseUnit(w));b.dataset.s=s;b.dataset.e=pos;
    b.onclick=e=>{e.stopPropagation();sfx.tap();TTS.say([w.replace(/[.,!?]/g,'')]);};box.append(b,' ');words.push(b);});
  return {box,words};}
const storyPics=p=>h('div','spics',emoList(p).map(e=>`<span>${ico(e)}</span>`).join(''));
function storyPage(st,[p,txt],i){return {k:'story',karaoke:true,e:emoList(p)[0],label:`<span class="ge">${ico(emoList(p)[0])}</span>${i+1}`,say:[txt],
  render(c){const {box,words}=sentWords(txt);c.append(storyPics(p),box);return words;}};}
// story level → the game level where its questions start
const STORY_LEVEL=[0,1,13,26,46,71];
const STORY_PAL=['peach','sun','mint','sky','lilac','rose','pink','coral'];
const storyStage=(s,i)=>({id:s.id,title:s.title,c:STORY_PAL[i%STORY_PAL.length],home:'sciGroup',art:ems([s.e])+BR+chips(['★'.repeat(s.lv)]),
  play:[['bcerita',STORY_LEVEL[s.lv]]],items:()=>[{k:'story',e:s.e,label:`<span class="ge">${ico(s.e)}</span>${caseUnit(s.title)}`,say:[s.title],
    render(c){const t=h('div','stitle',caseUnit(s.title));c.append(h('div','scover',ico(s.e)),t);return [t];}},...s.pages.map((pg,j)=>storyPage(s,pg,j))]});
STAGES.push({id:'cerita',title:'Buku Cerita',c:'coral',home:'belajar',art:ems(['📖'])+BR+ems(['🐱','🐰']),sub:STORIES.map(storyStage)});

/* --- game: read (or listen to) the story, then answer --- */
// level → which story levels: 1–12 lv 1, 13–25 lv 1–2, 26–45 lv 2–3, 46–70 lv 3–4, 71–100 lv 4–5
const storyBand=L=>L<=12?[1,1]:L<=25?[1,2]:L<=45?[2,3]:L<=70?[3,4]:[4,5];
// an answer may start with a picture: "🥛 susu"
function ansHtml(a){const m=a.match(new RegExp('^('+EMRE.source+')\\s*(.*)$','u'));return m?`<span class="aem">${ico(m[1])}</span>${caseUnit(m[m.length-1])}`:caseUnit(a);}
const ansSay=a=>a.replace(EMRE,'').trim();
GAMES.push(
 {id:'bcerita',title:'Baca Cerita',c:'coral',ins:'Baca ceritanya, lalu jawab pertanyaannya.',art:ems(['📖'])+BR+chips(['?']),
  fn(st,api,D){const [lo,hi]=storyBand(D.L),pool=STORIES.filter(s=>s.lv>=lo&&s.lv<=hi);
   const free=s=>s.qs.map((_,i)=>s.id+':'+i).filter(k=>!D.used.has(k));
   // a missed question comes back first; otherwise stay with the same story until its questions are used up
   const rk=redoPick(D,k=>!D.used.has(k)&&STORIES.some(s=>k.startsWith(s.id+':')));
   let story,qi;
   if(rk){story=STORIES.find(s=>rk.startsWith(s.id+':'));qi=+rk.split(':')[1];}
   else{const withQs=list=>list.filter(s=>free(s).length);
     if(!D.story||!free(D.story).length){D.seen=D.seen||new Set();const cand=withQs(pool.filter(s=>!D.seen.has(s.id))),c2=cand.length?cand:withQs(pool);
       D.story=c2.length?bySeg(D,c2):pick(pool);D.seen.add(D.story.id);D.told=false;}
     story=D.story;const f=free(story);qi=f.length?+f[0].split(':')[1]:rint(0,story.qs.length-1);}
   const key=story.id+':'+qi;D.used.add(key);D.key=key;
   const [qs,right,wrong]=story.qs[qi],pics=D.L<=45;
   const box=h('div','sbox');story.pages.forEach(([p,txt])=>{const row=h('div','srow');if(pics)row.append(storyPics(p));row.append(h('p','',caseUnit(txt)));box.append(row);});
   const text=story.pages.map(x=>x[1]);
   const q=h('div','q sq');q.append(h('div','stitle sm',caseUnit(story.title)),box,mrow(h('div','sciq',caseUnit(qs)),spkBtn(()=>TTS.say([qs])),h('button','spk tdemob',ico('📖'))));
   q.querySelector('.tdemob').onclick=()=>{sfx.tap();TTS.say([story.title,...text]);};q.querySelector('.tdemob').setAttribute('aria-label','Dengarkan cerita');
   const a=h('div','a');a.append(optsEl(shuffle([right,...wrong]),ansHtml,(x,b)=>{if(x===right){b.classList.add('right');api.ok();}else{TTS.say([ansSay(x)]);api.bad(b);}},'txt',x=>x===right));
   api.ans([ansSay(right)]);st.append(q,a);
   // the story is read aloud the first time it appears (early levels), later the child reads alone and may tap 📖
   const first=!D.told;D.told=true;return first&&D.L<=25?[story.title,...text,qs]:[qs];}}
);
