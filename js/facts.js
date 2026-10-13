/* ============ Tahukah Kamu?: short fun facts, one card per subject (Sains group card) ============ */
// grid label: the first words of the fact
const factLabel=t=>{const w=t.replace(/[.,!?]/g,'').split(' ');return w.slice(0,4).join(' ')+(w.length>4?'…':'');};
// one fact: "Tahukah kamu?" badge, big pictures, then the fact itself
function factItem([p,text]){const e=emoList(p)[0];
  return {k:'fact',e,label:`<span class="ge">${ico(e)}</span>${caseUnit(factLabel(text))}`,say:['Tahukah kamu?',text],
    render(c){const q=h('div','factq',caseUnit('Tahukah kamu?')),pics=h('div','scipics factpics',sciPics(p)),t=h('div','facttxt',caseUnit(text));c.append(q,pics,t);return [q,t];}};}
SCI_STAGES.push({id:'sc-fakta',title:'Tahukah Kamu?',c:'sun',art:ems(['💡','🐙','🌍']),
  sub:FACT_CATS.map((f,i)=>({id:f.id,title:f.title,c:f.c||SUBPAL[i%SUBPAL.length],art:ems(emoList(f.art)),play:[['sbs',1],['squiz',1]],items:()=>f.facts.map(factItem)}))});
