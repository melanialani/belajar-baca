/* ============ mode orang tua + laporan + istirahat ============ */
const MISS=store.get('miss',{});
const saveMiss=()=>store.set('miss',MISS);
longPress($('#lock'),3000,openParent,()=>toast('Tekan tahan 3 detik untuk Mode Orang Tua'));
function openParent(){sfx.ok();$('#tExtra').classList.toggle('on',SET.extra);$('#tSlow').classList.toggle('on',SET.slow);$('#tReset').textContent='Hapus';
  const seg=$('#tBreak');seg.innerHTML='';[0,10,15,20,30].forEach(m=>{const b=h('button',SET.brk===m?'on':'',m?String(m):'Mati');
    b.onclick=()=>{SET.brk=m;store.set('set',SET);usedMs=0;[...seg.children].forEach(x=>x.classList.toggle('on',x===b));};seg.append(b);});
  const cs=$('#tCase');cs.innerHTML='';[['lower','abc'],['cap','Abc'],['upper','ABC']].forEach(([v,t])=>{const b=h('button',SET.case===v?'on':'',t);
    b.onclick=()=>{SET.case=v;store.set('set',SET);[...cs.children].forEach(x=>x.classList.toggle('on',x===b));};cs.append(b);});
  buildReport();$('#parentov').classList.add('on');}
function buildReport(){
  const r=$('#report');const st=STAGES.filter(s=>!s.kamus).map(s=>{const tot=s.items().length,got=Math.min(tot,store.get('lp:'+s.id,0));
    return `<div class="rrow"><span>${s.title}</span><div class="bar"><i style="width:${Math.round(got/tot*100)}%"></i></div><span>${got}/${tot}</span></div>`;}).join('');
  const gm=GAMES.map(g=>{const s=gameStars(g.id),lv=levelStars(g.id).filter(Boolean).length;
    return `<div class="rrow"><span>${g.title}</span><div class="bar"><i style="width:${Math.round(s/75*100)}%"></i></div><span>⭐${s} · ${lv} lv</span></div>`;}).join('');
  const ms=Object.entries(MISS).sort((a,b)=>b[1]-a[1]).slice(0,15);
  r.innerHTML=`<h3>📚 Progres Belajar</h3>${st}<h3>🎮 Bintang Game</h3>${gm}
   <h3>🔁 Kata yang sering salah</h3><div class="miss">${ms.length?ms.map(([w,c])=>`<span>${w} ×${c}</span>`).join(''):'<i>Belum ada. Hebat!</i>'}</div>
   <p style="margin:10px 0 0;color:var(--ink2)">Stiker: ${stkCount(totalStars())}/${STICKERS.length} · Kata yang sering salah akan muncul lagi di game sampai dijawab benar.</p>`;}
$('#parentx').onclick=()=>$('#parentov').classList.remove('on');
$('#tExtra').onclick=()=>{SET.extra=!SET.extra;store.set('set',SET);$('#tExtra').classList.toggle('on',SET.extra);};
$('#tSlow').onclick=()=>{SET.slow=!SET.slow;store.set('set',SET);$('#tSlow').classList.toggle('on',SET.slow);TTS.say(['Halo, ayo membaca']);};
$('#tReset').onclick=()=>{const b=$('#tReset');if(b.textContent==='Hapus'){b.textContent='Yakin? Ketuk lagi';return;}
  store.clear();store.set('set',SET);Object.keys(MISS).forEach(k=>delete MISS[k]);b.textContent='Terhapus ✓';updateStars();buildReport();};
let usedMs=0,lastTick=Date.now(),brkTimer=null;
setInterval(()=>{const now=Date.now();if(document.visibilityState==='visible'&&!$('#breakov').classList.contains('on'))usedMs+=now-lastTick;lastTick=now;
  if(SET.brk&&usedMs>=SET.brk*60000&&!$('#breakov').classList.contains('on'))showBreak();},5000);
function showBreak(){TTS.stop();if(L){L.auto=false;L.tok++;$('#lauto').classList.remove('on');}
  $('#breakov').classList.add('on');$('#brkgo').hidden=true;let left=120;
  const upd=()=>{$('#brkcount').textContent=left>0?`⏳ ${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`:'';};upd();
  clearInterval(brkTimer);brkTimer=setInterval(()=>{left--;upd();if(left<=0){clearInterval(brkTimer);$('#brkgo').hidden=false;}},1000);
  TTS.say(['Waktunya istirahat! Istirahatkan mata, minum, dan bergerak sebentar ya.']);}
function endBreak(){clearInterval(brkTimer);usedMs=0;$('#breakov').classList.remove('on');sfx.tap();}
$('#brkgo').onclick=endBreak;
longPress($('#brklock'),3000,endBreak,()=>toast('Orang tua: tekan tahan 3 detik'));

