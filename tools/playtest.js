// Automated play-through: plays every game at the given levels, answering right via [data-ok] / G.solve(),
// and reports levels that do not end with 3 stars, a single option, duplicate options or page errors.
// usage: node tools/playtest.js 1,25,26,50,75,100 [gameId+gameId]   (local server on port 4006 must be running)
// needs Playwright (npm i -g playwright); CHROME=/path/to/chrome to use a given browser
let chromium;try{({chromium}=require('playwright'));}catch(e){({chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright'));}
(async()=>{const b=await chromium.launch(process.env.CHROME?{executablePath:process.env.CHROME}:{});
const p=await b.newPage({viewport:{width:1024,height:700}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:4006/');await p.waitForTimeout(400);
const res=await p.evaluate(async([levels,only])=>{localStorage.clear();
  const _st=window.setTimeout;window.setTimeout=(f,ms,...a)=>_st(f,Math.min(ms||0,3),...a);
  TTS.say=(parts,o={})=>{o.onEnd&&setTimeout(o.onEnd,1);};const wait=ms=>new Promise(r=>_st(r,ms));
  const out=[];
  for(const g of ALLGAMES){if(only&&!only.split('+').includes(g.id))continue;
    for(const L of levels){G={g,tok:0};let note='';
      try{startLevel(L);let steps=0;
        while(!document.querySelector('#endov.on')&&steps++<80){
          const st=document.querySelector('#stage');
          if(!G.done){
            const opts=[...st.querySelectorAll('.opt,.pvi')];
            if(opts.length&&opts.length<2&&!G.solve)note+=`q${G.q}:1opt `;
            const lab=opts.map(o=>o.innerHTML);if(new Set(lab).size!==lab.length)note+=`q${G.q}:dupopt `;
            if(G.solve)G.solve();else{const ok=[...st.querySelectorAll('[data-ok]')].filter(e=>!e.disabled&&!e.classList.contains('right'));
              if(!ok.length){note+=`q${G.q}:noOK `;break;}ok.forEach(e=>e.click());}}
          await wait(30);}
        const s=document.querySelector('#endov.on')?document.querySelectorAll('#endstars span:not(.dim)').length:0;
        out.push(`${g.id}:${L} ${s}⭐ ${note}`);
      }catch(e){out.push(`${g.id}:${L} ERR ${e.message}`);}
      document.querySelector('#endov').classList.remove('on');}}
  return out;},[process.argv[2].split(',').map(Number),process.argv[3]||'']);
const bad=res.filter(r=>!/ 3⭐ $/.test(r));console.log('total',res.length,'not perfect',bad.length);bad.forEach(r=>console.log(r));
if(errs.length)console.log('ERRORS',[...new Set(errs)]);await b.close();})();
