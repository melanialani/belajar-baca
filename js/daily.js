/* ============ daily practice: 10 mixed questions at the child's own level ============ */
// quick question games only (no memory boards, no microphone); reading and counting take turns
const DAILY_IDS=['tnama','tbenda','awal','akhir','lengkapi','bacaan','parade','kalimat','tepuk','mhitung','msuara','mbanyak','mtambah','mkurang','mkilat','mparade','murut'];
const dayKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const dailyLog=()=>store.get('daily',[]);
function dailyStreak(){const log=new Set(dailyLog()),d=new Date();if(!log.has(dayKey(d)))d.setDate(d.getDate()-1);let n=0;while(log.has(dayKey(d))){n++;d.setDate(d.getDate()-1);}return n;}
// highest level with stars; later questions go one level above it
const topLevel=id=>levelStars(id).reduce((t,s,i)=>s?i+1:t,0);
const DAILY={id:'daily',daily:true,title:'Latihan Hari Ini',qn:10,ins:'Ayo latihan hari ini!',
  fn(st,api,D){if(!D.by)D.by={};
    const math=G.q%2===1,pool=DAILY_IDS.map(id=>ALLGAMES.find(g=>g.id===id)).filter(g=>g&&MATH_GAMES.includes(g)===math&&g.id!==D.prev);
    // most review value first: games the child already plays, plus one fresh pick now and then
    const played=pool.filter(g=>topLevel(g.id)),g=played.length&&Math.random()<.7?pickM(played):pickM(pool);D.prev=g.id;
    const L=Math.max(1,Math.min(25,topLevel(g.id)+(G.q>=6?1:0)));
    const sub=D.by[g.id]=D.by[g.id]&&D.by[g.id].L===L?D.by[g.id]:makeD(L);
    Object.assign(sub,{q:Math.min(4,G.q>>1),cur:[],review:false,revTried:false});
    const auto=g.fn(st,api,sub)||[];D.cur=sub.cur;D.review=sub.review;
    return [g.ins,...auto];},
  finish(){const k=dayKey(new Date()),log=dailyLog();if(!log.includes(k)){log.push(k);store.set('daily',log.slice(-60));}}};
function updateDaily(){const done=dailyLog().includes(dayKey(new Date())),n=dailyStreak();
  $('#goDaily').classList.toggle('done',done);$('#dailyst').innerHTML=(done?'✓ ':'')+(n?`${ico('🔥')} ${n}`:'');}
$('#goDaily').onclick=()=>{sfx.tap();G={g:DAILY,tok:0};startLevel(1);};
