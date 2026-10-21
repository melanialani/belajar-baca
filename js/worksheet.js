/* ============ parent tools: "sering salah" report + printable worksheet ============ */
// questions waiting to be repeated, per game (from the redo list), shown in the parent report
function redoReport(){const rows=Object.entries(REDO).map(([gid,m])=>[ALLGAMES.find(g=>g.id===gid),Object.keys(m)]).filter(([g,k])=>g&&k.length).sort((a,b)=>b[1].length-a[1].length);
  if(!rows.length)return '<i>Belum ada. Hebat!</i>';
  const show=k=>k.length>40?k.slice(0,40)+'…':k.replace(/^(\d+)([+-])(\d+)$/,'$1 $2 $3').replace(/^(\d+),(\d+)$/,'$1 · $2');
  return rows.slice(0,12).map(([g,k])=>`<div class="rrow"><span>${g.title}</span><span class="rkeys">${k.slice(0,6).map(show).join(' · ')}${k.length>6?' …':''}</span></div>`).join('');}

/* --- worksheet: tracing, missing syllable, count and write, sums; picked from the child's level and mistakes --- */
const absUrl=u=>new URL(u,location.href).href;
const wsImg=e=>e&&EMO.has(nk(e))?`<img src="${absUrl(emoUrl(nk(e)))}" alt="">`:(e||'');
function wsTrace(ch){const ps=(STROKES[ch]||[]).map(d=>`<path d="${d}"/>`).join('');
  return `<svg viewBox="0 0 100 120" class="wt"><line x1="0" x2="100" y1="12" y2="12"/><line x1="0" x2="100" y1="50" y2="50" class="m"/><line x1="0" x2="100" y1="95" y2="95"/><g>${ps}</g></svg>`;}
function buildWorksheet(){const name=(PROFILES.find(p=>p.id===PROF)||{}).name||'',pl=store.get('place',null);
  rnd=Math.random;
  // letters: the next ones in the writing order (by learn progress) plus letters of missed words
  const seen=store.get('lp:tulis1',0),letters=[...new Set([...TULIS_LOW.slice(Math.max(0,seen-2),seen+2),...Object.keys(MISS).join('').replace(/[^a-z]/g,'')])].filter(c=>STROKES[c]).slice(0,4);
  while(letters.length<4)letters.push(pick(TULIS_LOW.filter(c=>!letters.includes(c))));
  // words: missed words first, then words of the child's reading level
  const rl=Math.max(topLevel('lengkapi'),topLevel('tnama'),pl?pl.r:0,3),D=makeD(Math.min(rl,100));
  const miss=Object.keys(MISS).map(w=>BYW[w]).filter(x=>x&&x.e&&x.s.length>=2&&!x.w.includes('-'));
  const words=[...miss,...sample(pool(D,x=>x.e&&x.s.length>=2&&x.s.length<=4&&!x.w.includes('-'),12),12)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,6);
  const ml=Math.max(topLevel('mtambah'),topLevel('mhitung'),pl?pl.m:0,1);
  const sums=range(1,8).map(i=>{const op=i%2?'+':'-',[a,b]=opPair(Math.min(ml+1,100),op);return `${a} ${opSign(op)} ${b} = ____`;});
  const counts=range(1,4).map(()=>{const n=rint(2,Math.min(10,2+ml)),e=pick(COUNTEMO);return `<div class="wc"><div class="wcp">${range(1,n).map(()=>wsImg(e)).join('')}</div><div class="wbox"></div></div>`;});
  const sylRow=w=>{const k=rint(0,w.s.length-1);return `<div class="ww"><span class="wpic">${wsImg(w.e)}</span>${w.s.map((s,i)=>`<span class="wsl${i===k?' blank':''}">${i===k?'':caseUnit(s)}</span>`).join('')}</div>`;};
  const day=new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Lembar Kerja Ayo Baca</title><style>
  body{font-family:Andika,Arial,sans-serif;color:#333;margin:18mm 14mm}h1{font-size:22pt;margin:0}h2{font-size:15pt;margin:18px 0 8px;border-bottom:2px solid #ddd;padding-bottom:4px}
  .meta{display:flex;justify-content:space-between;font-size:12pt;margin:6px 0 12px}.trow{display:flex;gap:6px;margin:6px 0}.wt{width:60px;height:72px}
  .wt line{stroke:#ccc;stroke-width:1}.wt line.m{stroke-dasharray:3 3}.wt path{fill:none;stroke:#999;stroke-width:3;stroke-dasharray:2 5;stroke-linecap:round}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px 24px}.ww{display:flex;align-items:center;gap:6px;font-size:20pt}.wpic img{width:44px;height:44px}
  .wsl{border:2px solid #bbb;border-radius:8px;min-width:46px;height:44px;display:inline-grid;place-items:center}.wsl.blank{border-style:dashed}
  .wc{display:flex;align-items:center;gap:12px;border:1px solid #ddd;border-radius:10px;padding:6px}.wcp{display:flex;flex-wrap:wrap;gap:2px;width:220px}.wcp img{width:30px;height:30px}
  .wbox{width:56px;height:56px;border:2px dashed #999;border-radius:8px}.sums{font-size:20pt;line-height:2.1;display:grid;grid-template-columns:1fr 1fr}
  @media print{button{display:none}}</style></head><body>
  <button onclick="print()" style="float:right;font-size:14pt;padding:6px 14px">Cetak / Simpan PDF</button>
  <h1>Lembar Kerja Ayo Baca</h1><div class="meta"><span>Nama: ${name||'....................'}</span><span>${day}</span></div>
  <h2>1. Tebalkan hurufnya</h2>${letters.map(c=>`<div class="trow">${range(1,7).map(()=>wsTrace(c)).join('')}</div>`).join('')}
  <h2>2. Lengkapi suku kata yang hilang</h2><div class="grid2">${words.map(sylRow).join('')}</div>
  <h2>3. Hitung, lalu tulis angkanya</h2><div class="grid2">${counts.join('')}</div>
  <h2>4. Ayo berhitung</h2><div class="sums">${sums.map(s=>`<div>${s}</div>`).join('')}</div>
  </body></html>`;}
$('#tSheet').onclick=()=>{const w=window.open('','_blank');if(!w)return toast('Izinkan jendela baru (pop-up) untuk mencetak');w.document.open();w.document.write(buildWorksheet());w.document.close();};
