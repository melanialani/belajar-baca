/* ============ parent voice: record a word in the learn viewer, it then plays instead of the device voice ============ */
// recordings are shared by all children on this device (IndexedDB "ayobaca-voice"); TTS looks them up in VOICE (js/tts.js)
const VDB={db:null,
  open(){return this.db||(this.db=new Promise((ok,no)=>{try{const r=indexedDB.open('ayobaca-voice',1);r.onupgradeneeded=()=>r.result.createObjectStore('rec');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);}catch(e){no(e);}}));},
  async tx(mode,fn){const db=await this.open();return new Promise((ok,no)=>{const t=db.transaction('rec',mode),st=t.objectStore('rec'),r=fn(st);t.oncomplete=()=>ok(r&&r.result);t.onerror=()=>no(t.error);});},
  put(k,blob){return this.tx('readwrite',s=>s.put(blob,k));},del(k){return this.tx('readwrite',s=>s.delete(k));},clear(){return this.tx('readwrite',s=>s.clear());},
  async all(){const db=await this.open();return new Promise(ok=>{const out=[],c=db.transaction('rec').objectStore('rec').openCursor();c.onsuccess=()=>{const cur=c.result;if(cur){out.push([cur.key,cur.value]);cur.continue();}else ok(out);};c.onerror=()=>ok(out);});}};
const canRecord=!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.MediaRecorder&&window.indexedDB);
function loadVoices(){if(!window.indexedDB)return;VDB.all().then(list=>list.forEach(([k,b])=>VOICE.set(k,URL.createObjectURL(b)))).catch(()=>{});}
// the word a learn page records: the whole word (syllable pages) or the first spoken text
const recKey=it=>String(it.w||it.say&&it.say[0]&&(it.say[0].t||it.say[0])||'').toLowerCase();
let recState=null;
async function toggleRecord(){const it=L&&L.items[L.i],key=it&&recKey(it),btn=$('#lrec');if(!key)return;
  if(recState){recState.rec.stop();return;}
  try{TTS.stop();const stream=await navigator.mediaDevices.getUserMedia({audio:true}),rec=new MediaRecorder(stream),chunks=[];
    recState={rec,stream};btn.classList.add('on');
    rec.ondataavailable=e=>chunks.push(e.data);
    rec.onstop=async()=>{stream.getTracks().forEach(t=>t.stop());btn.classList.remove('on');clearTimeout(recState&&recState.t);recState=null;
      const blob=new Blob(chunks,{type:rec.mimeType||'audio/webm'});if(blob.size<800)return toast('Rekaman terlalu pendek');
      await VDB.put(key,blob);if(VOICE.has(key))URL.revokeObjectURL(VOICE.get(key));VOICE.set(key,URL.createObjectURL(blob));updateRecBtn();toast(`Suara "${key}" tersimpan ✓`);};
    rec.start();recState.t=setTimeout(()=>{if(recState)recState.rec.stop();},4000);toast('Merekam… ucapkan katanya',1500);}
  catch(e){btn.classList.remove('on');recState=null;toast('Izinkan mikrofon di browser dulu ya');}}
function updateRecBtn(){const b=$('#lrec'),it=L&&L.items[L.i];if(!b)return;b.hidden=!(SET.rec&&canRecord&&it&&recKey(it));if(!b.hidden)b.classList.toggle('has',VOICE.has(recKey(it)));}
$('#lrec').innerHTML=ico('🎙️');$('#lrec').onclick=e=>{e.stopPropagation();toggleRecord();};
// parent mode: switch the record button on, count and delete recordings
$('#tRec').onclick=()=>{if(!canRecord)return toast('Browser ini belum bisa merekam suara');SET.rec=!SET.rec;saveSet();$('#tRec').classList.toggle('on',SET.rec);};
$('#tRecDel').onclick=async()=>{const b=$('#tRecDel');if(b.dataset.sure!=='1'){b.dataset.sure='1';b.textContent='Yakin? Ketuk lagi';return;}
  await VDB.clear().catch(()=>{});VOICE.forEach(u=>URL.revokeObjectURL(u));VOICE.clear();b.dataset.sure='';b.textContent='Terhapus ✓';$('#tRecN').textContent='0';};
function voiceParent(){$('#tRec').classList.toggle('on',!!SET.rec);$('#tRecN').textContent=VOICE.size;$('#tRecDel').textContent='Hapus';$('#tRecDel').dataset.sure='';}
loadVoices();
