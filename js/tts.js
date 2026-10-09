/* ============ suara ============ */
const TTS={ok:'speechSynthesis' in window,voice:null,token:0,
  init(){if(!this.ok)return;const choose=()=>{const vs=speechSynthesis.getVoices();this.voice=vs.find(v=>/^id([-_]|$)/i.test(v.lang))||vs.find(v=>/indones/i.test(v.name))||null;};choose();speechSynthesis.onvoiceschanged=choose;},
  stop(){this.token++;if(this.ok)speechSynthesis.cancel();},
  say(parts,o={}){
    if(!o.keep)this.stop();
    const tok=this.token;parts=(parts||[]).filter(p=>p!=null&&p!=='');
    let ended=false;const rate=(o.rate||.8)*(SET.slow?.82:1);
    const fin=()=>{if(ended||tok!==this.token)return;ended=true;o.onEnd&&o.onEnd();};
    if(!parts.length){setTimeout(fin,50);return;}
    const est=parts.reduce((t,p)=>t+900+String(p).length*160,400)/rate;const fb=setTimeout(fin,est+1500);
    if(!this.ok){parts.forEach((p,i)=>setTimeout(()=>{if(tok===this.token&&o.onPart)o.onPart(i);},i*700));clearTimeout(fb);setTimeout(fin,parts.length*700+300);return;}
    const go=()=>{if(tok!==this.token)return;parts.forEach((p,i)=>{const u=new SpeechSynthesisUtterance(String(p));u.lang='id-ID';if(this.voice)u.voice=this.voice;u.rate=rate;u.pitch=1.15;
      u.onstart=()=>{if(tok===this.token&&o.onPart)o.onPart(i);};
      if(i===parts.length-1){u.onend=()=>{clearTimeout(fb);fin();};u.onerror=()=>{clearTimeout(fb);fin();};}
      speechSynthesis.speak(u);});};
    if(o.keep)go();else setTimeout(go,60);}};
const LN={a:'a',b:'be',c:'ce',d:'de',e:'e',f:'ef',g:'ge',h:'ha',i:'i',j:'je',k:'ka',l:'el',m:'em',n:'en',o:'o',p:'pe',q:'ki',r:'er',s:'es',t:'te',u:'u',v:'fe',w:'we',x:'eks',y:'ye',z:'zet'};
const PRAISE=['Hebat!','Pintar!','Bagus sekali!','Keren!','Benar!','Wah, hebat!'];
let AC=null;
function tone(fs,dur=.15,type='sine',gap=.09,vol=.16){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();
  const t0=AC.currentTime;fs.forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;const st=t0+i*gap;
  g.gain.setValueAtTime(.0001,st);g.gain.exponentialRampToValueAtTime(vol,st+.02);g.gain.exponentialRampToValueAtTime(.0001,st+dur);o.connect(g).connect(AC.destination);o.start(st);o.stop(st+dur+.05);});}catch(e){}}
const sfx={ok:()=>tone([660,880,1175],.18,'triangle',.09),no:()=>tone([280,210],.2,'square',.13,.06),tap:()=>tone([620],.07,'sine',0,.09),win:()=>tone([523,659,784,1046,1318],.25,'triangle',.11)};
function confetti(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const box=h('div','confetti');const em=['⭐','💖','🌸','✨','🎀','💜','🌟'];
  for(let i=0;i<24;i++){const s=h('span','',pickM(em));s.style.left=(8+Math.random()*84)+'%';s.style.setProperty('--dx',(Math.random()*220-110)+'px');s.style.animationDelay=(Math.random()*.2)+'s';s.style.fontSize=(18+Math.random()*24)+'px';box.append(s);}
  document.body.append(box);setTimeout(()=>box.remove(),1900);}

