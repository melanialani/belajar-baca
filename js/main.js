/* ============ start ============ */
// card order per menu, easiest first
const byIds=(arr,ids)=>arr.sort((a,b)=>ids.indexOf(a.id)-ids.indexOf(b.id));
byIds(STAGES,['s1','s1b','k1','tulis1','s2','s3','s4','s5','tulis2','tulis3','s6','s7','cerita','s8a','s8b','s9','s10','s11','s12','s13']);
byIds(MATH_STAGES,['m1','m1b','mcmp','m3','m4','m2','mt10','mk10','mteman','mtens','mbaca','m20','m21','m51','mopt','mratus','mkali','mbagi','mjamb','muangb','mpecb']);
byIds(SCI_STAGES,['k5','mbentuk','k2','k4','k3','sc-fakta','sc-tubuh','sc-hewan','mpola','sc-tumbuhan','sc-benda','sc-alam','sc-langit']);
byIds(GAMES,['tepuk','awal','tulis','tsuku','urutk','kereta','hitung','akhir','jumlah','memori','sambung','tbenda','pasang','parade','tnama','bacaan','lengkapi','pzsuku','puzzle','uruth','dikte','cari','kalimat','bcerita','keras']);
byIds(MATH_GAMES,['mhitung','msuara','mmakan','mkilat','mbanyak','mpasang','mmemori','mbuaya','murutb','murut','mtambah','mkurang','mkatak','mparade','mteman','mtoko','msusun','mbangun','mnilai','mjam','muang','mkali','mbagi','mpecahan']);
byIds(EXP_STAGES,['ex-air','ex-warna','ex-tumbuhan','ex-udara','ex-tubuh','ex-amati','ex-tanah','ex-cahaya','ex-suara','ex-panas','ex-cuaca','ex-gerak','ex-campur','ex-magnet','ex-dapur','ex-mainan']);
byIds(SCI_GAMES,['mbentuk','squiz','mhbentuk','mpola','sbs']);
const ALLGAMES=[...GAMES,...MATH_GAMES,...SCI_GAMES,...JD_GAMES,...ENG_GAMES];
// back buttons of the learn viewer and the level list return to the subject's card list
MATH_STAGES.forEach(s=>s.home='belhitung');MATH_GAMES.forEach(g=>g.home='mainhitung');
SCI_STAGES.forEach(s=>{s.home='belsains';(s.sub||[]).forEach(x=>x.home='sciGroup');});EXP_STAGES.forEach(s=>s.home='beleksp');
JD_STAGES.forEach(s=>s.home='jagadiri');EN_STAGES.forEach(s=>s.home='belen');ENG_GAMES.forEach(g=>g.home='mainen');JD_GAMES.forEach(g=>g.home='jagadiri');SCI_GAMES.forEach(g=>g.home='mainsains');
emojify('.hb b, .brk .big, .endrow > .eb b, .daily b, .kecil b');
TTS.init();buildLearnCards();buildGameCards();updateStars();updateDaily();
document.addEventListener('pointerdown',function unlock(){try{if(TTS.ok){const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);}tone([1],.01,'sine',0,.0001);}catch(e){}},{once:true});
applyMode();
setTimeout(()=>{voiceReady=true;voiceNote();updateSubs();},1800);
// offline: the service worker keeps the app files; emoji pictures are saved in the background
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))
  navigator.serviceWorker.register('sw.js').then(()=>navigator.serviceWorker.ready).then(r=>{if(r.active)r.active.postMessage({emoji:[...EMO].map(emoUrl)});}).catch(()=>{});
