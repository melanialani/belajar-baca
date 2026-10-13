/* ============ start ============ */
// card order per menu, easiest first
const byIds=(arr,ids)=>arr.sort((a,b)=>ids.indexOf(a.id)-ids.indexOf(b.id));
byIds(STAGES,['s1','s1b','k1','s2','s3','s4','s5','s6','s7','s8a','s8b','s9','s10','s11','s12','s13']);
byIds(MATH_STAGES,['m1','m1b','mcmp','m3','m4','m2','mt10','mk10','mteman','mtens','mbaca','m20','m21','m51','mopt']);
byIds(SCI_STAGES,['k5','mbentuk','k2','k4','k3','sc-fakta','sc-tubuh','sc-hewan','mpola','sc-tumbuhan','sc-benda','sc-alam','sc-langit']);
byIds(GAMES,['tepuk','awal','tsuku','urutk','kereta','hitung','akhir','jumlah','memori','sambung','tbenda','pasang','parade','tnama','bacaan','lengkapi','pzsuku','puzzle','uruth','cari','kalimat','keras']);
byIds(MATH_GAMES,['mhitung','msuara','mmakan','mkilat','mbanyak','mpasang','mmemori','mbuaya','murutb','murut','mtambah','mkurang','mkatak','mparade','mteman','mtoko','msusun','mbangun']);
byIds(EXP_STAGES,['ex-air','ex-warna','ex-tumbuhan','ex-udara','ex-tubuh','ex-amati','ex-tanah','ex-cahaya','ex-suara','ex-panas','ex-cuaca','ex-gerak','ex-campur','ex-magnet','ex-dapur','ex-mainan']);
byIds(SCI_GAMES,['mbentuk','squiz','mhbentuk','mpola','sbs']);
const ALLGAMES=[...GAMES,...MATH_GAMES,...SCI_GAMES];
// back buttons of the learn viewer and the level list return to the subject's card list
MATH_STAGES.forEach(s=>s.home='belhitung');MATH_GAMES.forEach(g=>g.home='mainhitung');
SCI_STAGES.forEach(s=>{s.home='belsains';(s.sub||[]).forEach(x=>x.home='sciGroup');});EXP_STAGES.forEach(s=>s.home='beleksp');SCI_GAMES.forEach(g=>g.home='mainsains');
emojify('.hb b, .logo .bow, .brk .big, .endrow > .eb b, .daily b');
TTS.init();buildLearnCards();buildGameCards();updateStars();updateDaily();
document.addEventListener('pointerdown',function unlock(){try{if(TTS.ok){const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);}tone([1],.01,'sine',0,.0001);}catch(e){}},{once:true});
setTimeout(()=>{const n=$('#voiceNote');
  if(!TTS.ok){n.textContent='Browser ini tidak mendukung suara. Coba pakai Chrome atau Safari terbaru.';n.hidden=false;}
  else if(!TTS.voice){n.textContent='Suara bahasa Indonesia belum terpasang di perangkat ini, jadi logatnya bisa terdengar asing. Pasang lewat Pengaturan › Text-to-Speech.';n.hidden=false;}},1800);
