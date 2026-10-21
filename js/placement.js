/* ============ Tes Awal (placement): 12 questions, reading and counting take turns, the level adapts ============ */
// a right answer moves that subject up, a wrong one down; the result suggests where to start (learn card + game level)
const PLACE_R=['tnama','awal','bacaan','lengkapi','hitung','tbenda'],PLACE_M=['mhitung','msuara','mtambah','mkurang','mbuaya','mnilai'];
// reading level → word tier → Belajar Baca card; counting level → Belajar Hitung card
const READ_STAGE={3:'s3',4:'s4',5:'s5',6:'s6',7:'s7',8:'s8b',9:'s9',10:'s10',11:'s11',12:'s12',13:'s13'};
const readStageOf=L=>L>25?'cerita':READ_STAGE[makeD(L).hi]||'s1';
const mathStageOf=L=>L<=5?'m1':L<=10?'m1b':L<=15?'m2':L<=20?'m20':L<=25?'mopt':L<=50?'mratus':'mkali';
const placeResult=()=>store.get('place',null);
const PLACE={id:'place',daily:true,test:true,title:'Tes Awal',qn:12,ins:'Ayo jawab sebisanya. Tidak apa-apa kalau belum tahu.',
  fn(st,api,D){if(!D.lv)D.lv={r:8,m:8,hist:[]};const k=G.q%2?'m':'r',L=D.lv[k],gid=pick(k==='m'?PLACE_M:PLACE_R),g=ALLGAMES.find(x=>x.id===gid);
    D.subj=k;const sub=Object.assign(makeD(L),{gid:g.id,q:2});const auto=g.fn(st,api,sub)||[];Object.assign(D,{cur:sub.cur,key:null,rkey:null});
    return G.q===0?auto:[g.ins,...auto];},
  answer(ok){const D=G.D,k=D.subj,L=D.lv[k];D.lv.hist.push([k,L,ok]);D.lv[k]=Math.max(1,Math.min(100,L+(ok?(L<25?6:15):-(L<25?4:10))));},
  // estimate: the highest level answered right per subject (or level 1)
  finish(){const best=k=>Math.max(1,...G.D.lv.hist.filter(([s,,ok])=>s===k&&ok).map(([,L])=>L));const r=best('r'),m=best('m');
    store.set('place',{r,m,read:readStageOf(r),math:mathStageOf(m),at:Date.now()});
    const rs=STAGES.find(s=>s.id===readStageOf(r)),ms=MATH_STAGES.find(s=>s.id===mathStageOf(m));
    return [`Baca: mulai dari ${rs.title}, game level ${r}.`,`Hitung: mulai dari ${ms.say||ms.title}, game level ${m}.`];}};
$('#tPlace').onclick=()=>{sfx.tap();$('#parentov').classList.remove('on');G={g:PLACE,tok:nextTok()};startLevel(1);};
function placeParent(){const p=placeResult();$('#tPlaceRes').textContent=p?`Hasil terakhir: Baca level ${p.r}, Hitung level ${p.m}.`:'Belum pernah.';}
