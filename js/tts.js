/* ============ suara ============ */
// parent recordings: spoken text → audio URL (filled from IndexedDB by js/voice.js); a recorded word plays instead of the voice
const VOICE=new Map();
// onCap(text|null) shows the spoken text as a subtitle (js/ui.js); onVoices runs when the device voices are known
const TTS={ok:'speechSynthesis' in window,voice:null,voiceEn:null,token:0,audio:null,onCap:null,onVoices:null,capT:null,
  capOn(t){clearTimeout(this.capT);if(this.onCap)this.onCap(t);},capOff(ms=1200){clearTimeout(this.capT);this.capT=setTimeout(()=>{if(this.onCap)this.onCap(null);},ms);},
  init(){if(!this.ok)return;const choose=()=>{const vs=speechSynthesis.getVoices();this.voice=vs.find(v=>/^id([-_]|$)/i.test(v.lang))||vs.find(v=>/indones/i.test(v.name))||null;
    this.voiceEn=vs.find(v=>/^en[-_]US/i.test(v.lang))||vs.find(v=>/^en([-_]|$)/i.test(v.lang))||null;if(this.onVoices)this.onVoices();};choose();speechSynthesis.onvoiceschanged=choose;},
  stop(){this.token++;if(this.ok)speechSynthesis.cancel();if(this.audio){this.audio.pause();this.audio=null;}this.capOff(300);},
  // a part is text (Indonesian) or {t:text, en:true} for English
  utter(p,rate){const u=new SpeechSynthesisUtterance(p.t);if(p.en){u.lang='en-US';if(this.voiceEn)u.voice=this.voiceEn;u.rate=rate*1.1;u.pitch=1.1;}
    else{u.lang='id-ID';if(this.voice)u.voice=this.voice;u.rate=rate;u.pitch=1.15;}return u;},
  say(parts,o={}){
    if(!o.keep)this.stop();
    const tok=this.token;parts=(parts||[]).filter(p=>p!=null&&p!=='').map(p=>typeof p==='object'?p:{t:String(p)});
    let ended=false;const rate=(o.rate||.8)*(SET.slow?.82:1);
    const fin=()=>{if(ended||tok!==this.token)return;ended=true;this.capOff();o.onEnd&&o.onEnd();};
    if(!parts.length){setTimeout(fin,50);return;}
    const est=parts.reduce((t,p)=>t+900+p.t.length*160,400)/rate;const fb=setTimeout(fin,est+1500);
    const rec=parts.some(p=>!p.en&&VOICE.has(p.t.toLowerCase()));
    if(!this.ok&&!rec){parts.forEach((p,i)=>setTimeout(()=>{if(tok!==this.token)return;this.capOn(p.t);if(o.onPart)o.onPart(i);},i*700));clearTimeout(fb);setTimeout(fin,parts.length*700+300);return;}
    // with a recording: one part after the other (audio and voice cannot share the speech queue)
    // each part has its own safety timer, in case an audio or voice end event never comes
    if(rec){let guard=null;const next=i=>{clearTimeout(guard);if(tok!==this.token)return;if(i>=parts.length)return fin();const p=parts[i];this.capOn(p.t);o.onPart&&o.onPart(i);
        guard=setTimeout(()=>next(i+1),(1500+p.t.length*200)/rate);
        const url=!p.en&&VOICE.get(p.t.toLowerCase());
        if(url){const a=new Audio(url);this.audio=a;a.onended=a.onerror=()=>next(i+1);a.play().catch(()=>next(i+1));}
        else if(this.ok){const u=this.utter(p,rate);u.onend=u.onerror=()=>next(i+1);speechSynthesis.speak(u);}else setTimeout(()=>next(i+1),700);};
      clearTimeout(fb);setTimeout(()=>next(0),o.keep?0:60);return;}
    const go=()=>{if(tok!==this.token)return;this.capOn(parts[0].t);parts.forEach((p,i)=>{const u=this.utter(p,rate);
      u.onstart=()=>{if(tok!==this.token)return;this.capOn(p.t);if(o.onPart)o.onPart(i);};
      // word boundaries (where the voice supports them) let a story light up the word being read
      if(o.onBound)u.onboundary=ev=>{if(tok===this.token&&ev.name!=='sentence')o.onBound(i,ev.charIndex);};
      if(i===parts.length-1){u.onend=()=>{clearTimeout(fb);fin();};u.onerror=()=>{clearTimeout(fb);fin();};}
      speechSynthesis.speak(u);});};
    if(o.keep)go();else setTimeout(go,60);}};
const LN={a:'a',b:'be',c:'ce',d:'de',e:'e',f:'ef',g:'ge',h:'ha',i:'i',j:'je',k:'ka',l:'el',m:'em',n:'en',o:'o',p:'pe',q:'ki',r:'er',s:'es',t:'te',u:'u',v:'fe',w:'we',x:'eks',y:'ye',z:'zet'};
// game feedback phrases, picked at random so they don't get boring
const PRAISE=['Wow!','Kamu hebat!','Pintar!','Keren!','Hebat sekali!','Benar!','Mantap!','Bagus sekali!'];
const OOPS=['Ayo coba lagi!','Ups, belum tepat','Coba lagi ya!','Hampir!'];
const GAMEOVER=['Yah, coba lagi ya!','Yah, hatinya habis. Ayo coba lagi!','Yah, belum berhasil. Coba lagi ya!'];
let AC=null;
function tone(fs,dur=.15,type='sine',gap=.09,vol=.16){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();
  const t0=AC.currentTime;fs.forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;const st=t0+i*gap;
  g.gain.setValueAtTime(.0001,st);g.gain.exponentialRampToValueAtTime(vol,st+.02);g.gain.exponentialRampToValueAtTime(.0001,st+dur);o.connect(g).connect(AC.destination);o.start(st);o.stop(st+dur+.05);});}catch(e){}}
const sfx={ok:()=>tone([660,880,1175],.18,'triangle',.09),no:()=>tone([280,210],.2,'square',.13,.06),tap:()=>tone([620],.07,'sine',0,.09),win:()=>tone([523,659,784,1046,1318],.25,'triangle',.11)};
function confetti(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const box=h('div','confetti');const em=['⭐','💖','🌸','✨','🎀','💜','🌟'];
  for(let i=0;i<24;i++){const s=h('span','',pickM(em));s.style.left=(8+Math.random()*84)+'%';s.style.setProperty('--dx',(Math.random()*220-110)+'px');s.style.animationDelay=(Math.random()*.2)+'s';s.style.fontSize=(18+Math.random()*24)+'px';box.append(s);}
  document.body.append(box);setTimeout(()=>box.remove(),1900);}

