/* ============ start ============ */
const ALLGAMES=[...GAMES,...MATH_GAMES];
// back buttons of the learn viewer and the level list return to the counting screens for counting content
MATH_STAGES.forEach(s=>s.home='belhitung');MATH_GAMES.forEach(g=>g.home='mainhitung');
emojify('.hb b, .logo .bow, .brk .big, .endrow > .eb b, .daily b');
TTS.init();buildLearnCards();buildGameCards();updateStars();updateDaily();
document.addEventListener('pointerdown',function unlock(){try{if(TTS.ok){const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);}tone([1],.01,'sine',0,.0001);}catch(e){}},{once:true});
setTimeout(()=>{const n=$('#voiceNote');
  if(!TTS.ok){n.textContent='Browser ini tidak mendukung suara. Coba pakai Chrome atau Safari terbaru.';n.hidden=false;}
  else if(!TTS.voice){n.textContent='Suara bahasa Indonesia belum terpasang di perangkat ini, jadi logatnya bisa terdengar asing. Pasang lewat Pengaturan › Text-to-Speech.';n.hidden=false;}},1800);
