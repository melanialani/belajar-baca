/* ============ helpers ============ */
const $=(s,r=document)=>r.querySelector(s);
const nk=k=>String(k).replace(/\uFE0F/g,'');
// each emoji SVG is its own file, loaded by the browser only when shown (EMO = available keys, js/emoji-index.js)
const emoUrl=n=>`assets/emoji/${[...n].map(c=>c.codePointAt(0).toString(16)).join('-')}.svg`;
function ico(k){if(!k)return '';const n=nk(k);if(!EMO.has(n))return k;return `<img class="emo" alt="" draggable="false" src="${emoUrl(n)}" onerror="emoFail(this)">`;}
// image failed (e.g. offline): show the plain emoji character instead
function emoFail(img){const m=img.getAttribute('src').match(/([0-9a-f-]+)\.svg$/);img.replaceWith(String.fromCodePoint(...m[1].split('-').map(x=>parseInt(x,16))));}
// warm the cache for icons that appear later (next learn item, hidden answers)
function preloadEmo(...ks){ks.forEach(k=>{if(k&&EMO.has(nk(k)))new Image().src=emoUrl(nk(k));});}
const EMRE=/(\p{Extended_Pictographic}|[0-9]\uFE0F?\u20E3)(\uFE0F|\u20E3|\u200D\p{Extended_Pictographic}\uFE0F?)*/gu;
function emojify(sel){document.querySelectorAll(sel).forEach(el=>{el.innerHTML=el.innerHTML.replace(EMRE,m=>ico(m));});}
const h=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};
let rnd=Math.random;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const hashStr=s=>{let x=2166136261;for(const c of s){x^=c.charCodeAt(0);x=Math.imul(x,16777619);}return x>>>0;};
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
const pick=a=>a[rnd()*a.length|0];
const sample=(a,n)=>shuffle(a).slice(0,Math.max(0,n));
const pickM=a=>a[Math.random()*a.length|0];
// child profiles: profile 1 keeps the original keys (nothing to migrate); profile n stores its keys under "ayobaca2:p<n>:"
// shared by all children: the profile list, the active profile and the parent settings ('set'); everything else is per child
const BASEP='ayobaca2:',GLOBALK=['profiles','prof','set'];
const rawGet=(k,d)=>{try{const v=localStorage.getItem(BASEP+k);return v==null?d:JSON.parse(v);}catch(e){return d;}};
const rawSet=(k,v)=>{try{localStorage.setItem(BASEP+k,JSON.stringify(v));}catch(e){}};
const PROFILES=rawGet('profiles',[{id:1,name:'',av:'🧒'}]);
let PROF=rawGet('prof',1);if(!PROFILES.some(p=>p.id===PROF))PROF=PROFILES[0].id;
const pkey=k=>GLOBALK.includes(k)||PROF===1?k:`p${PROF}:${k}`;
const ownKey=(r,id=PROF)=>!GLOBALK.includes(r)&&(id===1?!/^p\d+:/.test(r):r.startsWith(`p${id}:`));
const dropProfile=id=>{try{Object.keys(localStorage).filter(k=>k.startsWith(BASEP)&&ownKey(k.slice(BASEP.length),id)).forEach(k=>localStorage.removeItem(k));}catch(e){}};
const store={get:(k,d)=>rawGet(pkey(k),d),set:(k,v)=>rawSet(pkey(k),v),
  // removes the data of the active child only
  clear(){try{Object.keys(localStorage).filter(k=>k.startsWith(BASEP)&&ownKey(k.slice(BASEP.length))).forEach(k=>localStorage.removeItem(k));}catch(e){}}};
const COL=['#FF5FA2','#2EC4A6','#FF9A62','#A47CFF','#4FB3FF','#FFBE1A'];
const PAL={pink:['#FF5FA2','#E0407F'],lilac:['#A47CFF','#8257E6'],mint:['#2EC4A6','#1A9F86'],sun:['#FFBE1A','#E09E00'],
  peach:['#FF9A62','#EC7436'],sky:['#4FB3FF','#2B90DE'],rose:['#FF7EB6','#E85A98'],berry:['#E0457B','#BC2C5E'],grape:['#8E6CF0','#6B4AD0'],coral:['#FF7A6B','#E2513F']};
const BANDPAL=[PAL.mint,PAL.sky,PAL.lilac,PAL.pink,PAL.coral];
const IC={
  bigx:'<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#E2513F" stroke-width="8"/><path d="M31 31l38 38M69 31L31 69" stroke="#E2513F" stroke-width="14" stroke-linecap="round"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  next:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  spk:'<svg viewBox="0 0 24 24"><path d="M3.5 9h4l5-4v14l-5-4h-4z" fill="#fff"/><path d="M16 8.5a5 5 0 010 7M18.6 6a8.6 8.6 0 010 12" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>',
  ok:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  no:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  grid:'<svg viewBox="0 0 24 24" fill="#fff"><rect x="3" y="3" width="8" height="8" rx="2.5"/><rect x="13" y="3" width="8" height="8" rx="2.5"/><rect x="3" y="13" width="8" height="8" rx="2.5"/><rect x="13" y="13" width="8" height="8" rx="2.5"/></svg>'};
function toast(msg,ms=3000){const t=h('div','toast',msg);document.body.append(t);setTimeout(()=>t.remove(),ms);}
const SET0=store.get('set',{});
// one-time move of the old default break (15 min) to the new default (30 min); brkMig marks it as done
if(!SET0.brkMig&&SET0.brk===15)SET0.brk=30;
// letter case and Mode Balita belong to each child ('pset'); the first child takes the case chosen before profiles existed
const SET=Object.assign({extra:false,slow:false,brk:30,case:'lower',tod:false,ph:'',addr:''},SET0,PROF===1?{}:{case:'lower'},store.get('pset',{}),{brkMig:true});
function saveSet(){store.set('set',SET);store.set('pset',{case:SET.case,tod:SET.tod});}
if(!SET0.brkMig)saveSet();
if(PROF===1&&!store.get('pset'))store.set('pset',{case:SET.case,tod:SET.tod});
// letter case setting: 'lower' (default) | 'cap' (first letter of a word) | 'upper'
const cap=s=>s?s[0].toUpperCase()+s.slice(1):s;
const caseWord=s=>SET.case==='upper'?s.toUpperCase():SET.case==='cap'?cap(s):s;
const casePart=(s,i)=>SET.case==='upper'?s.toUpperCase():SET.case==='cap'&&i===0?cap(s):s; // i = index of the piece within a split word
const caseUnit=s=>SET.case==='upper'?s.toUpperCase():s; // standalone syllable/letter, not a word
const onScreen=id=>document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id));
function longPress(el,ms,onDone,onShort){let t=null,start=0,raf=null;const fill=el.querySelector('i');
  const reset=()=>{clearTimeout(t);cancelAnimationFrame(raf);if(fill)fill.style.setProperty('--p','0%');};
  const tick=()=>{const p=Math.min(100,(Date.now()-start)/ms*100);if(fill)fill.style.setProperty('--p',p+'%');if(p<100)raf=requestAnimationFrame(tick);};
  el.addEventListener('pointerdown',e=>{e.preventDefault();start=Date.now();tick();t=setTimeout(()=>{reset();start=0;onDone();},ms);});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>el.addEventListener(ev,reset));
  el.addEventListener('contextmenu',e=>e.preventDefault());
  el.addEventListener('click',()=>{if(start&&Date.now()-start<ms-100&&onShort)onShort();});}

