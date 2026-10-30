/* ============ theme, Mode Didampingi, subtitles, today summary, voice guide ============ */
// theme: 'auto' follows the device, 'light' / 'dark' are fixed (index.html applies a saved choice before the first paint)
function applyTheme(){const t=SET.theme;if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;else delete document.documentElement.dataset.theme;}
// Mode Didampingi (SET.comp): a parent plays along, so settings are one tap away, game instructions are written out,
// subtitles are on (setting "auto") and home shows today's summary
function applyMode(){document.body.classList.toggle('comp',!!SET.comp);updateSubs();updateHello();updateToday();if(typeof updateProfChip==='function')updateProfChip();}
function updateHello(){const i=PROFILES.findIndex(p=>p.id===PROF),nm=i>-1?PROFILES[i].name:'';$('#hello').textContent=nm?`Hai ${nm}, mau main apa hari ini?`:'Mau main apa hari ini?';}

/* --- subtitles: the text the app speaks, in a bar under the screen --- */
// auto: on in Mode Didampingi or when the device has no Indonesian voice (then the voice is hard to understand)
// voiceReady: voices load late, so a missing voice only counts a moment after start (no flicker)
let voiceReady=false;
const subsOn=()=>SET.sub==='on'||(SET.sub==='auto'&&(!!SET.comp||(voiceReady&&(!TTS.ok||!TTS.voice))));
function updateSubs(){document.body.classList.toggle('subs',subsOn());}
// during a game question the spoken word is often the answer (Tebak Suara …), so the child must not be able to read it:
// only instructions and feedback are written out; the rest shows a covered line the parent can tap to read
const CAP_FREE=new Set([...PRAISE,...OOPS,...GAMEOVER,'Yang benar','Ayo ulang ini','Ayo lihat yang benar','Tidak apa-apa'].map(s=>s.toLowerCase()));
const capHidden=t=>typeof G!=='undefined'&&G&&G.g&&!G.done&&$('#game').classList.contains('on')&&t!==G.g.ins&&!CAP_FREE.has(t.toLowerCase());
TTS.onCap=t=>{const sb=$('#subt .sb');if(t==null){sb.classList.remove('on');return;}
  const hide=capHidden(t);sb.classList.add('on');sb.classList.toggle('hid',hide);sb.dataset.t=t;
  sb.innerHTML=IC.cc+`<span>${hide?'🔊 Suara soal (disembunyikan supaya anak tidak membaca jawabannya). Ketuk untuk melihat.':esc(t)}</span>`;};
$('#subt .sb').onclick=e=>{const sb=e.currentTarget;if(sb.classList.contains('hid')){sb.classList.remove('hid');sb.querySelector('span').textContent=sb.dataset.t;}};
TTS.onVoices=()=>{updateSubs();if(voiceReady)voiceNote();};

/* --- today at a glance (Mode Didampingi): minutes played, right answers, mistakes; per child --- */
const dayStr=()=>{const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;};
function todayGet(){const t=store.get('today',null);return t&&t.d===dayStr()?t:{d:dayStr(),ms:0,ok:0,bad:0};}
function todayAdd(k,n=1){const t=todayGet();t[k]+=n;store.set('today',t);}
function updateToday(){const el=$('#today');el.hidden=!SET.comp;if(!SET.comp)return;const t=todayGet(),m=Math.round(t.ms/60000);
  el.innerHTML=`<div><b>${m} mnt</b><span>bermain hari ini</span></div><div><b>${t.ok}</b><span>soal benar</span></div><div><b>${t.bad}</b><span>salah, akan diulang</span></div>`;}
// play time: count only while the page is visible and no break is shown
let todayTick=Date.now();
setInterval(()=>{const now=Date.now(),d=Math.min(now-todayTick,10000);todayTick=now;
  if(document.visibilityState==='visible'&&!$('#breakov').classList.contains('on')&&!$('#home').classList.contains('on'))todayAdd('ms',d);
  else if($('#home').classList.contains('on'))updateToday();},5000);
document.addEventListener('visibilitychange',()=>{todayTick=Date.now();});

/* --- settings: one tap in Mode Didampingi, long press on the home gear (#lock) otherwise --- */
document.querySelectorAll('.gear').forEach(b=>b.addEventListener('click',()=>{sfx.tap();openParent();}));
function segRow(el,opts,cur,onPick){el.innerHTML='';opts.forEach(([v,t])=>{const b=h('button',cur===v?'on':'',t);
  b.onclick=()=>{[...el.children].forEach(x=>x.classList.toggle('on',x===b));onPick(v);};el.append(b);});}
// called by openParent (via parentExtras)
function uiParent(){
  segRow($('#tTheme'),[['auto','Otomatis'],['light','Terang'],['dark','Gelap']],SET.theme,v=>{SET.theme=v;saveSet();applyTheme();});
  segRow($('#tSub'),[['auto','Otomatis'],['on','Selalu'],['off','Mati']],SET.sub,v=>{SET.sub=v;saveSet();updateSubs();});
  $('#tComp').classList.toggle('on',!!SET.comp);}
$('#tComp').onclick=()=>{SET.comp=!SET.comp;saveSet();$('#tComp').classList.toggle('on',SET.comp);applyMode();};

/* --- game screen extras for Mode Didampingi: game name, written instruction --- */
$('#ginstS').innerHTML=IC.spk;
$('#ginstS').onclick=()=>{if(G&&G.g)TTS.say([G.g.ins]);};
function gameInfo(){const g=G.g;$('#gname').textContent=g.title;$('#ginstT').textContent=g.ins||'';$('#ginst').classList.toggle('none',!g.ins);}

/* --- voice guide: what this device has, steps per phone brand, common problems --- */
const UA=navigator.userAgent;
// browsers inside other apps (WhatsApp, Instagram, Facebook, TikTok, Line …) often have no voice at all
const inApp=/; wv\)|FBAN|FBAV|Instagram|Line\/|TikTok|musical_ly|WhatsApp|GSA\//i.test(UA);
const VG=[
  {id:'android',t:'Android',s:['Buka Play Store, pasang atau perbarui “Speech Services by Google”.','Buka Pengaturan, ketik “text-to-speech” atau “teks ke ucapan” di kolom pencarian.','Mesin pilihan (preferred engine): pilih Speech Services by Google.','Ketuk ⚙️ di sebelahnya › Instal data suara › Indonesia › unduh.','Tutup Chrome sampai benar-benar keluar, buka lagi aplikasi ini, lalu ketuk Tes suara.']},
  {id:'samsung',t:'Samsung',s:['Pengaturan › Manajemen umum › Text-to-speech. Di sebagian versi letaknya di Aksesibilitas, atau ketik “text-to-speech” di pencarian Pengaturan.','Mesin pilihan: ganti dari Samsung ke Google (Speech Services by Google). Di One UI terbaru, suara Samsung bisa tidak dipakai oleh browser.','Ketuk ⚙️ di sebelah Google › Instal data suara › Indonesia › unduh.','Buka aplikasi ini lewat Chrome atau Samsung Internet, lalu ketuk Tes suara.']},
  {id:'xiaomi',t:'Xiaomi / Redmi / POCO',s:['Pengaturan › Setelan tambahan › Bahasa & input › Output text-to-speech. Atau ketik “text-to-speech” di pencarian Pengaturan.','Mesin pilihan: Speech Services by Google. Kalau belum ada, pasang dari Play Store.','Ketuk ⚙️ › Instal data suara › Indonesia › unduh.','Buka aplikasi ini lewat Chrome, lalu ketuk Tes suara.']},
  {id:'oppo',t:'OPPO / realme / OnePlus',s:['Pengaturan › Aksesibilitas (atau Fitur aksesibilitas) › Text-to-speech. Di versi lama ada di Setelan tambahan. Paling cepat: ketik “text-to-speech” di pencarian Pengaturan.','Mesin pilihan: Speech Services by Google.','Ketuk ⚙️ › Instal data suara › Indonesia › unduh.','Buka aplikasi ini lewat Chrome, lalu ketuk Tes suara.']},
  {id:'vivo',t:'vivo / iQOO',s:['Ketik “text-to-speech” atau “teks ke ucapan” di pencarian Pengaturan (letaknya berbeda antar versi, biasanya di Aksesibilitas).','Mesin pilihan: Speech Services by Google. Kalau belum ada, pasang dari Play Store.','Ketuk ⚙️ › Instal data suara › Indonesia › unduh.','Buka aplikasi ini lewat Chrome, lalu ketuk Tes suara.']},
  {id:'huawei',t:'Huawei / Honor',s:['Cek dulu Pengaturan › Aksesibilitas › Text-to-speech: kalau sudah ada Bahasa Indonesia, pilih itu.','Kalau belum: cari “Speech Services by Google” di AppGallery (Petal Search). Belum tentu berhasil di HP tanpa layanan Google.','Pilihan lain: pasang “eSpeak NG” lalu pilih sebagai mesin. Suaranya seperti robot, tapi berbahasa Indonesia.','Pakai Chrome kalau bisa; browser bawaan kadang tidak bersuara.','Kalau semua gagal: pakai “Rekam suara ayah/ibu” di Pengaturan, dan nyalakan Subtitle.']},
  {id:'apple',t:'iPhone / iPad',s:['Pengaturan › Aksesibilitas › Konten Lisan › Suara › Bahasa Indonesia › pilih suara (mis. Damayanti) › unduh.','Buka aplikasi ini lewat Safari, atau dari ikon di layar utama.','Matikan mode senyap (tombol di samping) dan naikkan volume: mode senyap bisa membuat suara tidak keluar.']},
  {id:'pc',t:'Laptop / komputer',s:['Chrome: sudah ada suara “Google Bahasa Indonesia” (perlu internet). Microsoft Edge juga punya suara Indonesia online.','Windows tanpa internet: Settings › Time & language › Speech › Manage voices › Add voices › Indonesian.','Mac: System Settings › Accessibility › Spoken Content › System voice › Manage Voices › Indonesian.','Tutup browser sepenuhnya, buka lagi, lalu ketuk Tes suara.']}];
const VFAQ=[
  ['Dibuka dari WhatsApp, Instagram atau Facebook','Browser di dalam aplikasi itu sering tidak bisa bersuara. Ketuk menu ⋮ atau ••• di pojok › “Buka di Chrome” (atau “Buka di browser”). Supaya praktis, setelah itu pilih menu Chrome › “Tambahkan ke layar utama”.'],
  ['Tidak ada suara sama sekali','Naikkan volume media (bukan volume dering) saat aplikasi terbuka. Cek earphone atau speaker Bluetooth yang masih tersambung. Di iPhone/iPad matikan mode senyap. Sentuh layar sekali dulu: browser baru mengizinkan suara setelah layar disentuh. Kalau masih diam, tutup browser sepenuhnya lalu buka lagi.'],
  ['Logatnya terdengar asing','Suara Bahasa Indonesia belum terpasang, atau browser belum melihatnya. Ikuti langkah di atas untuk HP-mu, lalu tutup browser sampai benar-benar keluar dan buka lagi. Hasilnya terlihat di kotak paling atas.'],
  ['Suara terputus atau terlambat','Tutup tab dan aplikasi lain, perbarui Chrome dan Speech Services by Google, dan matikan penghemat baterai untuk Chrome.'],
  ['Sudah dicoba semua, tetap gagal','Pakai “Rekam suara ayah/ibu” (Pengaturan › Suara) untuk kata yang sering dipakai, dan nyalakan Subtitle › Selalu supaya ayah/ibu bisa membacakan instruksinya.']];
const brandOf=()=>/iPhone|iPad|iPod|Macintosh.*Mobile/.test(UA)||(/Macintosh/.test(UA)&&navigator.maxTouchPoints>1)?'apple':!/Android|Mobile/i.test(UA)?'pc':
  /SM-|Samsung/i.test(UA)?'samsung':/Redmi|POCO|Xiaomi|\bMi \d|MIX|\b2\d{3}[0-9A-Z]{5,}\b/i.test(UA)?'xiaomi':/OPPO|CPH\d|RMX\d|realme|OnePlus/i.test(UA)?'oppo':
  /vivo|\bV2\d{3}|iQOO/i.test(UA)?'vivo':/HUAWEI|Honor|HarmonyOS/i.test(UA)?'huawei':'android';
function voiceStatus(){
  if(!TTS.ok)return ['bad','Browser ini tidak bisa bersuara',inApp?'Sepertinya aplikasi dibuka dari dalam WhatsApp, Instagram atau aplikasi lain. Buka di Chrome atau Safari.':'Pakai Chrome (Android) atau Safari (iPhone/iPad) versi terbaru.'];
  if(TTS.voice)return ['ok','Suara Bahasa Indonesia siap',`Dipakai: ${TTS.voice.name}${TTS.voice.localService===false?' (perlu internet)':''}`];
  const n=speechSynthesis.getVoices().length;
  return ['warn','Suara Bahasa Indonesia belum ada',(inApp?'Aplikasi dibuka dari dalam aplikasi lain; buka di Chrome atau Safari. ':'')+(n?`Ada ${n} suara lain di perangkat ini, jadi kata-kata dibaca dengan logat asing.`:'Belum ada suara yang terdeteksi.')];}
function openGuide(){const [k,t,d]=voiceStatus();$('#vstat').className='vstat '+k;$('#vstat').innerHTML=`<b>${t}</b><span>${esc(d)}</span>`;
  const tabs=$('#vtabs');tabs.innerHTML='';const pickTab=id=>{[...tabs.children].forEach(b=>b.classList.toggle('on',b.dataset.id===id));
    $('#vsteps').innerHTML='<ol>'+VG.find(v=>v.id===id).s.map(x=>`<li>${esc(x)}</li>`).join('')+'</ol>';};
  VG.forEach(v=>{const b=h('button','',v.t);b.dataset.id=v.id;b.onclick=()=>pickTab(v.id);tabs.append(b);});pickTab(brandOf());
  $('#vfaq').innerHTML=VFAQ.map(([q,a])=>`<details><summary>${q}${IC.chev}</summary><p>${a}</p></details>`).join('');
  $('#voiceov').classList.add('on');}
$('#tGuide').onclick=()=>{sfx.tap();openGuide();};
$('#voicex').onclick=()=>$('#voiceov').classList.remove('on');
$('#vTest').onclick=()=>{TTS.say(['Halo, ayo kita membaca bersama!']);};
$('#vRecheck').onclick=()=>{TTS.init();setTimeout(openGuide,500);};
// home note when speech is missing; a tap opens the guide (also in Mode Anak, so a parent finds it)
function voiceNote(){const n=$('#voiceNote');if(TTS.ok&&TTS.voice){n.hidden=true;return;}
  n.innerHTML=!TTS.ok?'🔇 Browser ini tidak bisa bersuara. <u>Lihat panduan</u>':'🔈 Suara Bahasa Indonesia belum terpasang, logatnya bisa terdengar asing. <u>Lihat cara memasang</u>';n.hidden=false;}
$('#voiceNote').onclick=()=>{sfx.tap();openGuide();};
applyTheme();
