/* ============ Jaga Diri: safety cards, important numbers, two games (home button) ============ */
const JD_KIND={ok:['Ayo','jdok'],no:['Jangan','jdno'],tip:['Ingat','jdtip']};
// phone numbers are read digit by digit: "satu, satu, dua"
const digitsSay=n=>[...String(n)].map(d=>NUMW[+d]).join(', ');
function jdItem([short,title,p,lines,kind]){const e=emoList(p)[0],[kw,kc]=JD_KIND[kind];
  return {k:'jd',e,label:`<span class="ge">${ico(e)}</span>${caseUnit(short)}`,say:[title,...lines],
    render(c){const b=h('div','jdbadge '+kc,(kind==='ok'?IC.ok:kind==='no'?IC.no:ico('💡'))+caseUnit(kw)),t=h('div','sciq',caseUnit(title)),pics=h('div','scipics',sciPics(p)),
      box=h('div','scilines'),ls=lines.map(x=>h('p','scil',caseUnit(x)));box.append(...ls);c.append(b,pics,t,box);return [t,...ls];}};}
// a number card: big digits + who answers + when to call
function numCard(num,name,p,say,lines){const e=emoList(p)[0];
  return {k:'jd',e,label:`<span class="ge">${ico(e)}</span>${num||caseUnit(name)}`,say:[say,...lines],
    render(c){const card=h('div','jdnum',`<div class="jdn${String(num).length>4?' long':''}">${num||'?'}</div><div class="jdname">${caseUnit(name)}</div>`),pics=h('div','scipics',sciPics(p)),
      box=h('div','scilines'),ls=lines.map(x=>h('p','scil',caseUnit(x)));box.append(...ls);c.append(pics,card,box);return [card,...ls];}};}
// the family's own phone number and address, entered by a parent in Mode Orang Tua (kept on this device only)
function familyItems(){const ph=(SET.ph||'').replace(/\D/g,''),ad=(SET.addr||'').trim(),none='Minta ayah atau ibu mengisinya di Mode Orang Tua.';
  const groups=ph.match(/\d{1,4}/g)||[];
  const phone=numCard(groups.join(' '),'Nomor HP ayah atau ibu','📱',ph?'Nomor HP ayah atau ibu: '+groups.map(digitsSay).join('. '):'Nomor HP ayah atau ibu',ph?['Ayo ucapkan bersama-sama sampai hafal!']:[none]);
  const adSay=ad.replace(/\d+/g,m=>+m<=100?numW(+m):digitsSay(m));
  const addr={k:'jd',e:'🏠',label:`<span class="ge">${ico('🏠')}</span>${caseUnit('Alamat rumah')}`,say:ad?['Alamat rumahku',adSay,'Ayo ucapkan bersama-sama sampai hafal!']:['Alamat rumahku',none],
    render(c){const t=h('div','sciq',caseUnit('Alamat rumahku')),a=h('div','jdaddr'),x=h('p','scil',caseUnit(ad?'Ayo ucapkan bersama-sama sampai hafal!':''));
      a.textContent=ad||caseUnit(none);c.append(h('div','scipics',sciPics('🏠')),t,a,x);return ad?[t,a,x]:[t,a];}};
  return [phone,addr];}
const JD_STAGES=[...JD_CATS.map(c=>({id:c.id,title:c.title,say:c.say,c:c.c,art:ems(emoList(c.art)),play:[['jaman',1],['jnomor',1]],items:()=>c.items.map(jdItem)})),
 {id:'jd-nomor',title:'Nomor Penting',c:'coral',art:ems(['🆘','👮','🚒']),play:[['jnomor',1],['jaman',1]],
  items:()=>[...JD_NUMS.map(([n,name,p,lines])=>numCard(n,name,p,`${name}: ${digitsSay(n)}`,lines)),
   jdItem(['Cara menelepon','Bagaimana cara menelepon nomor darurat?','📱',['Tekan nomornya, lalu tekan tombol hijau.','Sebutkan namamu, apa yang terjadi, dan di mana kamu berada.','Jangan menutup telepon sampai petugas bilang selesai.'],'tip']),...familyItems()]}];

const JD_GAMES=[
 {id:'jaman',title:'Aman atau Bahaya?',c:'mint',ins:'Dengarkan, lalu pilih aman atau bahaya.',art:ems(['✅'])+BR+ems(['⚠️']),
  fn(st,api,D){const [t,ok,e]=sciTake(D,JD_SCEN);
   const q=h('div','q');q.append(P(e),h('div','sciq',caseUnit(t)),spkBtn(()=>TTS.say([t])));
   const a=h('div','a');a.append(optsEl([1,0],v=>v?`${IC.ok}Aman`:`${IC.no}Bahaya`,(v,b)=>{if(v===ok){b.classList.add('right');api.ok();}else api.bad(b);},'tf'));
   st.append(q,a);return [t];}},
 {id:'jnomor',title:'Telepon Siapa?',c:'coral',ins:'Dengarkan, lalu pilih nomor teleponnya.',art:ems(['📞'])+BR+chips(['112','113']),
  fn(st,api,D){const [t,num,e,,alsoOk=[]]=sciTake(D,JD_CALL),icon=n=>JD_NUMS.find(x=>x[0]===n)[2];
   // 112 also works for every emergency, so it is never offered as a wrong choice; neither is any other number that would also be right
   const others=JD_NUMS.map(x=>x[0]).filter(n=>n!==num&&(num==='112'||n!=='112')&&!alsoOk.includes(n));
   const list=shuffle([num,...sample(others,[2,2,3,3,3][D.b]-1)]);
   const q=h('div','q');q.append(P(e),h('div','sciq',caseUnit(t)),spkBtn(()=>TTS.say([t])));
   const a=h('div','a');a.append(optsEl(list,n=>(D.b<2?ico(icon(n))+' ':'')+n,(n,b)=>{if(n===num){b.classList.add('right');api.ok();}else{TTS.say([digitsSay(n)]);api.bad(b);}}));
   st.append(q,a);return [t];}}
];
// learn cards first, then the games (marked with a controller icon)
function buildJdCards(){const el=$('#jdCards'),games=h('div');buildLearnCards(el,JD_STAGES);
  buildCards(games,JD_GAMES,openLevels,g=>`<span class="num">${ico('🎮')}</span>`+starBadge(g));el.append(...games.children);}
