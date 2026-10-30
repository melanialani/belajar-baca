/* ============ Buku Cerita (learn: read-along picture stories) + Baca Cerita (game: questions about a story) ============ */
// a sentence as tappable words; each word knows where it starts in the sentence (for the read-along highlight)
// English words are spoken by the English voice
function sentWords(txt,en){const box=h('div','stxt'+(txt.length>70?' long':'')),words=[];let pos=0;
  txt.split(' ').forEach(w=>{const s=txt.indexOf(w,pos);pos=s+w.length;const b=h('button','sw',caseUnit(w));b.dataset.s=s;b.dataset.e=pos;
    b.onclick=e=>{e.stopPropagation();sfx.tap();const t=w.replace(/[.,!?:;]/g,'');TTS.say([en?{t,en:true}:t]);};box.append(b,' ');words.push(b);});
  return {box,words};}
const storyPics=p=>h('div','spics',emoList(p).map(e=>`<span>${ico(e)}</span>`).join(''));
// story language (Buku Cerita): 'id' or 'en', shared setting; every story has both
const slang=()=>SET.slang==='en'?'en':'id';
// saved illustrations (assets/stories/) are switched off: some looked scary to small children, emoji are shown instead
const STORY_PICS=false;
// a page picture: the saved illustration when there is one (and STORY_PICS is on), the emoji otherwise or when it fails to load
function storyArt(p,img){if(!img||!STORY_PICS)return storyPics(p);const w=h('div','spicw');const im=h('img','spimg');im.alt='';im.loading='lazy';im.src='assets/stories/'+img;
  im.onerror=()=>w.replaceWith(storyPics(p));w.append(im);return w;}
// page = [pictures, Indonesian, English, optional image file]
function storyPage(st,pg,i){const [p,id,enT,img]=pg,en=slang()==='en'&&!!enT,txt=en?enT:id;
  return {k:'story',karaoke:true,e:emoList(p)[0],label:`<span class="ge">${ico(emoList(p)[0])}</span>${i+1}`,say:[en?{t:txt,en:true}:txt],
  render(c){const {box,words}=sentWords(txt,en);c.append(storyArt(p,img),box);return words;}};}
const sayTitle=(id,enT)=>slang()==='en'&&enT?{t:enT,en:true}:id;
// story level → the game level where its questions start
const STORY_LEVEL=[0,1,13,26,46,71];
const STORY_PAL=['peach','sun','mint','sky','lilac','rose','pink','coral'];
// cover page of a story or tale: picture, title, where it comes from
function coverItem(e,ti,te,src,img,credit){const en=slang()==='en'&&!!te,t=en?te:ti;
  return {k:'story',e,label:`<span class="ge">${ico(e)}</span>${caseUnit(t)}`,say:[sayTitle(ti,te)],
    render(c){const el=h('div','stitle',caseUnit(t));c.append(img?storyArt([e],img):h('div','scover',ico(e)),el);if(src)c.append(h('div','ssrc',src));if(credit)c.append(h('div','scred',esc(credit)));return [el];}};}
const storyStage=(s,i,home='sciGroup')=>({id:s.id,get title(){return slang()==='en'&&s.te?s.te:s.title;},get say(){return sayTitle(s.title,s.te);},bi:true,
  c:STORY_PAL[i%STORY_PAL.length],home,art:ems([s.e])+BR+chips(['★'.repeat(s.lv)]),
  play:[['bcerita',STORY_LEVEL[s.lv]]],items:()=>[coverItem(s.e,s.title,s.te),...s.pages.map((pg,j)=>storyPage(s,pg,j))]});
STAGES.push({id:'cerita',title:'Buku Cerita',c:'coral',home:'belajar',art:ems(['📖'])+BR+ems(['🐱','🐰']),sub:STORIES.map((s,i)=>storyStage(s,i))});

/* --- Buku Cerita menu (home): princess tales, world tales, Indonesian folk tales, short stories; Indonesian or English --- */
const TALE_GRP=[['putri','Putri','👑','Princesses'],['dunia','Cerita Dunia','🌍','World Tales'],['nusantara','Cerita Rakyat','🏝️','Indonesian Tales'],['pendek','Cerita Pendek','📖','Short Stories']];
const TALE_PAL={putri:['rose','lilac','pink','grape'],dunia:['sky','mint','sun','peach'],nusantara:['coral','sun','mint','berry'],pendek:STORY_PAL};
// pictures saved from Wikimedia Commons (js/data/gambar-cerita.js): cover and some pages
const taleImg=(t,j)=>{if(!STORY_PICS)return;const m=STORY_IMG[t.id]||{};return j==null?t.img||m.c:(m.p||{})[j+1];};
// short credit under the cover: who made the pictures and their licence
const taleCredit=t=>{if(!STORY_PICS)return '';const c=STORY_CREDITS.filter(x=>x[3].includes(t.id));return c.length?'Gambar: '+c.map(x=>`${x[0]} (${x[1]})`).join('; '):'';};
const taleStage=(t,i)=>({id:t.id,get title(){return t.t[slang()==='en'?1:0];},get say(){return sayTitle(t.t[0],t.t[1]);},bi:true,c:TALE_PAL[t.grp][i%4],home:'cerita',
  art:taleImg(t)?`<img class="spimg" src="assets/stories/${taleImg(t)}" alt="" loading="lazy" onerror="this.replaceWith(document.createRange().createContextualFragment(ico('${t.e}')))">`:`<span class="em xl">${ico(t.e)}</span>`,
  play:[],items:()=>[coverItem(t.e,t.t[0],t.t[1],t.src,taleImg(t),taleCredit(t)),...t.pages.map((pg,j)=>storyPage(t,pg[3]?pg:[pg[0],pg[1],pg[2],taleImg(t,j)],j))]});
const TALE_STAGES=TALES.map((t,i)=>taleStage(t,TALES.filter(x=>x.grp===t.grp).indexOf(t)));
const SHORT_STAGES=STORIES.map((s,i)=>storyStage(s,i,'cerita'));
function buildTales(){const g=store.get('stab','putri'),tabs=$('#stabs'),en=slang()==='en';tabs.innerHTML='';
  TALE_GRP.forEach(([id,ti,e,te])=>{const b=h('button',id===g?'on':'',`${ico(e)} ${en?te:ti}`);b.onclick=()=>{sfx.tap();store.set('stab',id);buildTales();$('#taleCards').scrollTo(0,0);TTS.say([en?{t:te,en:true}:ti]);};tabs.append(b);});
  segRow($('#slang'),[['id','ID'],['en','EN']],slang(),v=>{SET.slang=v;saveSet();buildTales();TTS.say([v==='en'?{t:'English',en:true}:'Bahasa Indonesia']);});
  const list=g==='pendek'?SHORT_STAGES:TALE_STAGES.filter((s,i)=>TALES[i].grp===g);
  buildLearnCards($('#taleCards'),list);}

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
// Pengaturan › Lainnya: every story picture with author, licence and source page
function storyCredits(){const box=$('#tCreditList');$('#tCredits').hidden=!STORY_PICS||!STORY_CREDITS.length;
  box.innerHTML=STORY_CREDITS.map(([a,l,u,ids])=>`<p>${esc(ids.map(id=>(TALES.find(t=>t.id===id)||{t:[id]}).t[0]).join(', '))}: ${esc(a)}, ${esc(l)}, <a href="${esc(u)}" target="_blank" rel="noopener">Wikimedia Commons</a></p>`).join('');}
