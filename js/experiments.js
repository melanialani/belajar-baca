/* ============ Eksperimen: experiment cards in the learn viewer ============ */
// one experiment: title, "with a parent" note, materials, numbered steps, what happens, why; a long page scrolls to the sentence being read
function expItem([title,mats,steps,result,why]){const ms=mats.split('|').map(m=>[emoList(m)[0]||'',m.replace(EMRE,'').trim()]),e=ms[0][0];
  return {k:'exp',e,label:`<span class="ge">${ico(e)}</span>${caseUnit(title)}`,
    say:[title,'Lakukan bersama orang tua, ya.','Siapkan: '+ms.map(m=>m[1]).join(', '),...steps.map((s,i)=>cap(NUMW[i+1])+'. '+s),'Apa yang terjadi? '+result,'Kenapa? '+why],
    render(c){const w=h('div','expw'),t=h('div','sciq',caseUnit(title)),badge=h('div','expbadge',`${ico('🫂')} ${caseUnit('Bersama orang tua')}`),mt=h('div','expmats');
      ms.forEach(([em,n])=>mt.append(h('span','ex',`<span>${ico(em)}</span><span>${caseUnit(n)}</span>`)));
      const ol=h('ol','expsteps'),li=steps.map(s=>h('li','',caseUnit(s)));ol.append(...li);
      const r=h('p','expres',`<b>${caseUnit('Apa yang terjadi?')}</b> ${caseUnit(result)}`),y=h('p','expres',`<b>${caseUnit('Kenapa?')}</b> ${caseUnit(why)}`);
      w.append(t,badge,mt,ol,r,y);c.append(w);return [t,badge,mt,...li,r,y];}};}
const EXP_STAGES=EXP_THEMES.map(t=>({id:t.id,title:t.title,c:t.c,art:ems(emoList(t.art)),play:[],items:()=>t.items.map(expItem)}));
const buildExpCards=()=>buildLearnCards($('#expCards'),EXP_STAGES);
