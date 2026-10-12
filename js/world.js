/* ============ Kenali Dunia: colors, shapes, patterns, animals, fruit, vegetables (learn stages + games) ============ */
// k2–k5 were the picture dictionary of Belajar Baca; ids kept so saved progress still counts
const WORLD_STAGES=[
 {id:'k2',title:'Hewan',c:'peach',art:ems(['🐬','🐒','🐓','🐢']),play:[['tnama',3],['sambung',3],['bacaan',3]],items:()=>easyFirst(HEWAN).map(picItem)},
 {id:'k3',title:'Sayur',c:'grape',art:ems(['🍆','🌽','🥕','🍅']),play:[['tnama',5],['sambung',5],['bacaan',5]],items:()=>easyFirst(SAYUR).map(picItem)},
 {id:'k4',title:'Buah',c:'sky',art:ems(['🍌','🍎','🍊','🍉']),play:[['tnama',5],['sambung',5],['bacaan',5]],items:()=>easyFirst(BUAH).map(picItem)},
 {id:'k5',title:'Warna',c:'sun',art:'<span class="chip" style="color:#FF3B47">merah</span><span class="chip" style="color:#3B8BFF">biru</span><span class="chip" style="color:#3CC75A">hijau</span>',play:[['tnama',2],['bacaan',2],['awal',2]],items:()=>easyFirst(WARNA).map(picItem)}
];
const WORLD_GAMES=[];
// learn cards first, then the games (marked with a controller icon)
function buildWorldCards(){const el=$('#worldCards'),games=h('div');buildLearnCards(el,WORLD_STAGES);
  buildCards(games,WORLD_GAMES,openLevels,g=>`<span class="num">${ico('🎮')}</span>`+starBadge(g));el.append(...games.children);}
