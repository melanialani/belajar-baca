/* ============ boot ============ */
// Load the emoji SVG data first, then the app scripts in order: app code builds icons at load time, so EMO must exist before it runs.
// On fetch failure ico() falls back to the plain emoji character.
const APP_JS=['helpers','tts','words','learn','parent','games','main'];
fetch('assets/emoji.json').then(r=>r.ok?r.json():{}).catch(()=>({})).then(d=>{
  window.EMO_DATA=d;
  APP_JS.forEach(f=>{const s=document.createElement('script');s.src=`js/${f}.js`;s.async=false;document.body.append(s);});
});
