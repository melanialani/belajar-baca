/* ============ start ============ */
emojify('.hb b, .logo .bow, .brk .big, .endrow > .eb b');
TTS.init();buildLearnCards();buildGameCards();updateStars();
document.addEventListener('pointerdown',function unlock(){try{if(TTS.ok){const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);}tone([1],.01,'sine',0,.0001);}catch(e){}},{once:true});
setTimeout(()=>{const n=$('#voiceNote');
  if(!TTS.ok){n.textContent='Browser ini tidak mendukung suara. Coba pakai Chrome atau Safari terbaru.';n.hidden=false;}
  else if(!TTS.voice){n.textContent='Suara bahasa Indonesia belum terpasang di perangkat ini, jadi logatnya bisa terdengar asing. Pasang lewat Pengaturan › Text-to-Speech.';n.hidden=false;}},1800);
