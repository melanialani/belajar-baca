/* ============ child profiles (storage in helpers.js) + Mode Balita switch ============ */
const AVATARS=['🧒','👧','👦','👶','🐱','🐶','🐰','🦊','🐼','🦄','🐯','🐸'];
const MAXPROF=6;
const profOf=id=>PROFILES.find(p=>p.id===id);
const profName=(p,i)=>p.name||'Anak '+(i+1);
const saveProfiles=()=>rawSet('profiles',PROFILES);
// switching child reloads the page so every module reads that child's data
function useProfile(id){if(id===PROF)return;rawSet('prof',id);location.reload();}
// home chip: only when there is more than one child
function updateProfChip(){const c=$('#profchip'),i=PROFILES.findIndex(p=>p.id===PROF),p=PROFILES[i];
  c.hidden=PROFILES.length<2;if(c.hidden)return;c.innerHTML=`${ico(p.av)}<span>${profName(p,i)}</span>`;}
$('#profchip').onclick=()=>{sfx.tap();const box=$('#profpick');box.innerHTML='';
  PROFILES.forEach((p,i)=>{const b=h('button','pp'+(p.id===PROF?' on':''),`<b>${ico(p.av)}</b>${profName(p,i)}`);b.onclick=()=>{sfx.tap();if(p.id===PROF)$('#profov').classList.remove('on');else useProfile(p.id);};box.append(b);});
  $('#profov').classList.add('on');TTS.say(['Siapa yang main?']);};
$('#profx').onclick=()=>$('#profov').classList.remove('on');

// parent mode: list of children (avatar, name, use, delete) + add
function buildProfList(){const box=$('#tProfs');box.innerHTML='';
  PROFILES.forEach((p,i)=>{const row=h('div','prow'+(p.id===PROF?' on':''));
    const av=h('button','pav',ico(p.av));av.setAttribute('aria-label','Ganti gambar');
    av.onclick=()=>{p.av=AVATARS[(AVATARS.indexOf(p.av)+1)%AVATARS.length];saveProfiles();av.innerHTML=ico(p.av);updateProfChip();};
    const nm=h('input','tin');nm.type='text';nm.maxLength=16;nm.placeholder='Anak '+(i+1);nm.value=p.name;nm.oninput=()=>{p.name=nm.value.trim();saveProfiles();updateProfChip();};
    row.append(av,nm);
    if(p.id===PROF)row.append(h('span','pnow','Dipakai'));
    else{const use=h('button','puse','Pakai');use.onclick=()=>useProfile(p.id);row.append(use);
      const del=h('button','danger','✕');del.setAttribute('aria-label','Hapus anak');
      del.onclick=()=>{if(del.textContent==='✕'){del.textContent='Hapus semua datanya?';return;}
        dropProfile(p.id);
        PROFILES.splice(PROFILES.indexOf(p),1);saveProfiles();buildProfList();updateProfChip();};row.append(del);}
    box.append(row);});
  if(PROFILES.length<MAXPROF){const add=h('button','puse add','+ Tambah anak');
    add.onclick=()=>{const id=Math.max(...PROFILES.map(p=>p.id))+1;PROFILES.push({id,name:'',av:AVATARS[PROFILES.length%AVATARS.length]});saveProfiles();
      rawSet(`p${id}:pset`,{case:'lower',tod:false});buildProfList();updateProfChip();};box.append(add);}}

$('#tTod').onclick=()=>{SET.tod=!SET.tod;saveSet();$('#tTod').classList.toggle('on',SET.tod);updateKecil();};
// called by openParent (parent.js)
function parentExtras(){$('#tTod').classList.toggle('on',!!SET.tod);buildProfList();}
// Si Kecil button: always there, highlighted in Mode Balita
function updateKecil(){$('#goKecil').classList.toggle('tod',!!SET.tod);}
updateProfChip();updateKecil();
