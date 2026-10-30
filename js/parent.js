/* ============ mode orang tua + laporan + istirahat ============ */
const MISS=store.get('miss',{});
const saveMiss=()=>store.set('miss',MISS);
longPress($('#lock'),3000,openParent,()=>toast('Tekan tahan 3 detik untuk Mode Orang Tua'));
function openParent(){sfx.ok();storyCredits();$('#parentov .pbody').scrollTop=0;$('#tExtra').classList.toggle('on',SET.extra);$('#tSlow').classList.toggle('on',SET.slow);$('#tReset').textContent='Hapus';
  const seg=$('#tBreak');seg.innerHTML='';[0,10,15,20,30].forEach(m=>{const b=h('button',SET.brk===m?'on':'',m?String(m):'Mati');
    b.onclick=()=>{SET.brk=m;saveSet();usedMs=0;[...seg.children].forEach(x=>x.classList.toggle('on',x===b));};seg.append(b);});
  const cs=$('#tCase');cs.innerHTML='';[['lower','abc'],['cap','Abc'],['upper','ABC']].forEach(([v,t])=>{const b=h('button',SET.case===v?'on':'',t);
    b.onclick=()=>{SET.case=v;saveSet();[...cs.children].forEach(x=>x.classList.toggle('on',x===b));};cs.append(b);});
  $('#tPhone').value=SET.ph;$('#tAddr').value=SET.addr;
  voiceCheck();buildReport();parentExtras();$('#parentov').classList.add('on');}
function buildReport(){
  const r=$('#report');const st=[...STAGES,...MATH_STAGES,...SCI_STAGES,...EXP_STAGES,...JD_STAGES,...EN_STAGES,...TALE_STAGES].flatMap(s=>s.sub||[s]).map(s=>{const tot=s.items().length,got=Math.min(tot,store.get('lp:'+s.id,0));
    return `<div class="rrow"><span>${s.title}</span><div class="bar"><i style="width:${Math.round(got/tot*100)}%"></i></div><span>${got}/${tot}</span></div>`;}).join('');
  const gm=ALLGAMES.map(g=>{const s=gameStars(g.id),lv=levelStars(g.id).filter(Boolean).length;
    return `<div class="rrow"><span>${g.title}</span><div class="bar"><i style="width:${Math.round(s/(maxLevel()*3)*100)}%"></i></div><span>⭐${s} · ${lv} lv</span></div>`;}).join('');
  const ms=Object.entries(MISS).sort((a,b)=>b[1]-a[1]).slice(0,15);
  r.innerHTML=`<h3>📚 Progres Belajar</h3>${st}<h3>🎮 Bintang Game</h3>${gm}
   <h3>🔁 Soal yang akan diulang</h3><div class="rkey">${typeof redoReport==='function'?redoReport():''}</div>
   <h3>🔁 Kata yang sering salah</h3><div class="miss">${ms.length?ms.map(([w,c])=>`<span>${w} ×${c}</span>`).join(''):'<i>Belum ada. Hebat!</i>'}</div>
   <p style="margin:10px 0 0;color:var(--ink2)">Stiker: ${stkCount(totalStars())}/${STICKERS.length} · Kata dan soal yang salah akan muncul lagi di level berikutnya sampai dijawab benar dua kali.</p>`;}
// shows whether the device has an Indonesian voice; voices can load late, so check again a few times
function voiceCheck(n=0){const r=$('#tVoiceRes');
  if(!TTS.ok){r.textContent='⚠️ Browser ini tidak bisa bersuara. Ketuk Panduan.';return;}
  const vs=speechSynthesis.getVoices();if(!vs.length&&n<4){r.textContent='Memeriksa…';setTimeout(()=>voiceCheck(n+1),700);return;}
  if(!TTS.voice)TTS.init();
  if(TTS.voice)r.textContent=`✓ Terpasang: ${TTS.voice.name}${TTS.voice.localService===false?' (butuh internet)':''}`;
  else r.textContent='⚠️ Belum ada suara Bahasa Indonesia, kata-kata dibaca dengan logat asing. Ketuk Panduan untuk cara memasang.';}
$('#tVoiceTest').onclick=()=>{TTS.say(['Halo, ayo kita membaca bersama!']);voiceCheck();};
$('#parentx').onclick=()=>$('#parentov').classList.remove('on');
// family phone and address for Jaga Diri practice; stored on this device only
$('#tPhone').oninput=e=>{SET.ph=e.target.value.replace(/[^\d ]/g,'').slice(0,20);saveSet();};
$('#tAddr').oninput=e=>{SET.addr=e.target.value.slice(0,120);saveSet();};
$('#tExtra').onclick=()=>{SET.extra=!SET.extra;saveSet();$('#tExtra').classList.toggle('on',SET.extra);};
$('#tSlow').onclick=()=>{SET.slow=!SET.slow;saveSet();$('#tSlow').classList.toggle('on',SET.slow);TTS.say(['Halo, ayo membaca']);};
$('#tReset').onclick=()=>{const b=$('#tReset');if(b.textContent==='Hapus'){b.textContent='Yakin? Ketuk lagi';return;}
  store.clear();saveSet();Object.keys(MISS).forEach(k=>delete MISS[k]);Object.keys(REDO).forEach(k=>delete REDO[k]);b.textContent='Terhapus ✓';updateStars();buildReport();};
let usedMs=0,lastTick=Date.now(),brkTimer=null,brkEnd=0;
// screen time: only count while visible; cap each step so a frozen/sleeping page never adds its off time
setInterval(()=>{const now=Date.now();if(document.visibilityState==='visible'&&!$('#breakov').classList.contains('on'))usedMs+=Math.min(now-lastTick,10000);lastTick=now;
  if(SET.brk&&usedMs>=SET.brk*60000&&!$('#breakov').classList.contains('on'))showBreak();},5000);
function showBreak(){TTS.stop();if(L){L.auto=false;L.tok++;$('#lauto').classList.remove('on');}
  $('#breakov').classList.add('on');$('#brkgo').hidden=true;brkEnd=Date.now()+120000;
  clearInterval(brkTimer);brkTimer=setInterval(updBreak,1000);updBreak();
  TTS.say(['Waktunya istirahat! Istirahatkan mata, minum, dan bergerak sebentar ya.']);}
// break countdown uses the real clock, so time with the screen off still counts
function updBreak(){const left=Math.max(0,Math.ceil((brkEnd-Date.now())/1000));
  $('#brkcount').textContent=left>0?`⏳ ${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`:'';
  if(!left){clearInterval(brkTimer);$('#brkgo').hidden=false;}}
document.addEventListener('visibilitychange',()=>{lastTick=Date.now();if($('#breakov').classList.contains('on'))updBreak();});
function endBreak(){clearInterval(brkTimer);usedMs=0;$('#breakov').classList.remove('on');sfx.tap();}
$('#brkgo').onclick=endBreak;
longPress($('#brklock'),3000,endBreak,()=>toast('Orang tua: tekan tahan 3 detik'));

