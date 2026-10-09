/* ============ kosa kata bertingkat (kata sehari-hari) ============ */
const parse=(str,t)=>str.split(',').map(x=>{const [syl,e]=x.trim().split(' ');const s=syl.split(/[-=]/);return {w:syl.replace(/-/g,'').replace(/=/g,'-'),s,e,t};});
const TIERS={
3:'ma-ma 👩,pa-pa 👨,bi-bi 👩,bo-bo 😴,su-su 🥛,ku-ku 💅,da-da,gi-gi 🦷,pi-pi 😊,cu-cu 🧒,le-le #lele,li-li 🌷,yo-yo 🪀,si-si',
4:'bo-la ⚽,sa-pi 🐄,bu-ku 📖,ku-da 🐴,me-ja #meja,ro-ti 🍞,to-pi 🧢,pi-ta 🎀,sa-pu 🧹,ba-ju 👕,ma-ta 👀,ka-ki 🦶,gu-la #gula,ba-tu 🪨,ro-da 🛞,li-ma 🖐️,na-si 🍚,ma-du 🍯,ta-hu #tahu,ki-wi 🥝,ce-ri 🍒,la-bu 🎃,ru-sa 🦌,ja-ri 👆,gu-ru 🧑‍🏫,pa-di 🌾,ja-mu #jamu,ta-li 🪢,ke-ju 🧀,ko-pi ☕,ka-yu 🪵,ra-ja 🤴,ra-tu 👸,bu-mi 🌍,so-to 🍲,sa-te 🍢,bi-ru 🔵,ka-do 🎁,da-si 👔,pe-ta 🗺️,lu-cu 😆,sa-tu 1️⃣,ti-ga 3️⃣,sa-ma,mu-ka 🙂,pa-ha 🦵,ko-ta 🏙️,de-sa 🏘️,bi-sa,ma-ri,ke-ra 🐒,so-fa 🛋️,ka-mu,sa-ya,ka-ta,ba-ca 📖,la-ma,ba-ru,du-ri 🌵,bi-ji 🫘,pe-na 🖊️,cu-ci 🧼,be-li 🛍️,be-da,na-da 🎵,cu-mi 🦑,pa-gi 🌅,ha-ri,da-du 🎲,pa-lu 🔨,ka-ca 🪟,ba-yi 👶,na-ga 🐉,to-ko 🏪,pe-ri 🧚,ko-ki 🧑‍🍳,pa-ku #paku,ja-he 🫚,sa-wi 🥬,te-bu #tebu,du-ku #duku,pi-pa #pipa',
5:'i-bu 👩,a-pi 🔥,u-bi 🍠,o-ma 👵,o-pa 👴,a-ku,i-ni,i-tu,a-bu,i-ga 🍖,a-ki 🔋,ku-e 🍰,du-a 2️⃣,di-a,mi-e 🍜,tu-a,a-da,a-pa,hi-u 🦈,ri-a 😄',
6:'ka-pal 🚢,i-kan 🐟,a-yam 🐔,je-ruk 🍊,to-mat 🍅,be-bek 🦆,ru-mah 🏠,bu-lan 🌙,ba-lon 🎈,le-mon 🍋,na-nas 🍍,ka-tak 🐸,ti-kus 🐭,gi-tar 🎸,te-lur 🥚,ma-kan 🍽️,mi-num 🥤,la-par 😋,ma-sak 🍳,sa-lad 🥗,me-lon 🍈,ro-ket 🚀,se-mut 🐜,si-put 🐌,ga-jah 🐘,le-bah 🐝,u-lar 🐍,a-pel 🍎,ja-mur 🍄,ti-mun 🥒,ke-cil,be-sar,pa-sir 🏜️,ka-sur 🛏️,ba-sah 💦,mo-bil 🚗,sa-bun 🧼,bu-kit ⛰️,tas 👜,jam ⏰,pir 🍐,bus 🚌,cat 🎨,ba-tik #batik,pa-gar #pagar,li-lin 🕯️,ku-lit,pe-tir ⚡,ka-kak 👧,a-dik 👶,se-hat,ma-lam 🌃,ge-las 🥃,ko-tak 📦,bo-tol 🍼,pe-luk 🤗,ma-in,me-rah 🔴,pu-tih ⚪,hi-tam ⚫,su-rat ✉️,ko-ran 📰,ba-dak 🦏,ki-pas 🪭,pe-rut,lu-tut 🦵,ke-las 🏫,bu-bur 🥣,ku-bis 🥬,sa-yap 🪽,e-kor,si-sir 🪮,ti-kar #tikar,ra-kit #rakit,ko-per 🧳,ja-ket 🧥,teh 🍵,jus 🧃,es 🧊,do-nat 🍩,so-sis 🌭,ga-ram 🧂,a-wan ☁️,hu-jan 🌧️,la-ut 🌊,po-hon 🌳,da-un 🍃,ma-war 🌹,ko-met ☄️,mu-lut 👄,li-dah 👅,o-tak 🧠,a-yah 👨,ne-nek 👵,ka-kek 👴,ro-bot 🤖,mo-tor 🏍️,rok 👗,la-lat 🪰,ke-pik 🐞,ru-bah 🦊,ra-kun 🦝,me-rak 🦚,ci-cak 🦎,u-lat 🐛,o-bat 💊,pa-us 🐋,a-ir 💧,sup 🍲,ko-dok 🐸,tu-lip 🌷,pa-sar 🛒,ta-man ⛲,ke-bun 🪴,pi-lot 🧑‍✈️,be-cak #becak,ti-ket 🎫,bi-bir 👄,sa-lak #salak',
7:'pin-tu 🚪,ban-tal #bantal,wor-tel 🥕,pen-sil ✏️,kur-si 🪑,lam-pu 💡,dom-ba 🐑,pan-da 🐼,un-ta 🐫,ker-tas 📄,sen-dok 🥄,gar-pu 🍴,can-tik,kun-ci 🔑,per-men 🍬,ten-da ⛺,ram-but 💇,kar-pet #karpet,sam-pah 🗑️,sal-ju ❄️,kom-pas 🧭,kan-tor 🏢,per-sik 🍑,bun-da 👩,tan-te 👩‍🦰,ram-bu 🚸,sam-bal #sambal,tem-pe #tempe,cin-cin 💍,kan-cil #kancil,rum-put 🌱,gam-bar 🖼️,dok-ter 🩺,em-ber 🪣,kar-tu 🃏,lom-pat 🤸,tem-pat,pul-pen 🖊️,cer-min 🪞,sir-kus 🎪,kom-por #kompor,cin-ta ❤️,man-di 🛁,min-ta,tan-da,sum-pit 🥢,dom-pet 👛,kem-bar 👯,kal-kun 🦃,lan-dak 🦔,kak-tus 🌵,mas-jid 🕌,gem-bok 🔒,lap-top 💻,tak-si 🚕,bur-ger 🍔,bak-so #bakso,han-duk #handuk,pan-ci #panci,kul-kas #kulkas,par-fum #parfum,ban-do #bando',
8:'bu-nga 🌸,si-nga 🦁,ba-ngun ⏰,ta-ngan ✋,a-ngin 🌬️,la-ngit 🌌,ku-cing 🐱,an-jing 🐶,kam-bing 🐐,bu-rung 🐦,ja-gung 🌽,pi-sang 🍌,ken-tang 🥔,ba-wang 🧅,te-rong 🍆,ka-cang 🥜,pa-yung ☂️,bin-tang ⭐,pan-cing 🎣,lon-ceng 🔔,ang-gur 🍇,mang-ga 🥭,ku-ning 🟡,nya-muk 🦟,nya-nyi 🎤,ba-nyak,pu-nya,bu-nyi 🔔,nya-man 😌,nyo-nya 👵,mo-nyet 🐒,ja-ngan 🚫,pi-ring 🍽️,ke-ring,gu-ling #guling,ka-lung 📿,mang-kok 🥣,sa-yang 💕,se-nang 😊,wa-ngi 💐,de-ngar 👂,se-nyum 😃,ku-nyit #kunyit,ta-nya ❓,mi-nyak 🛢️,ke-nyang,pe-nyu 🐢,le-ngan 💪,hi-dung 👃,gu-nung ⛰️,kan-dang #kandang,tang-ga 🪜,nya-la 🔥,si-ang ☀️,ca-cing 🪱,ke-rang 🐚,u-dang 🦐,e-lang 🦅,ang-sa 🦢,kum-bang 🪲,si-gung 🦨,gun-ting ✂️,tu-lang 🦴,u-ang 💰,an-ting #anting,ge-lang #gelang,du-yung 🧜,ca-pung #capung,kang-kung #kangkung',
9:'se-pa-tu 👟,ke-la-pa 🥥,bo-ne-ka 🧸,gu-ri-ta 🐙,ke-re-ta 🚂,se-pe-da 🚲,ce-ri-ta 📖,pe-pa-ya #pepaya,ba-ta-ko 🧱,bi-ca-ra 🗣️,se-la-da 🥬,ke-pa-la,te-li-nga 👂,ca-ha-ya ✨,ke-me-ja 👔,ce-la-na 👖,ka-me-ra 📷,ke-ba-ya #kebaya,pe-ta-ni 🧑‍🌾,su-a-ra 🔊,ce-ri-a 😄,ra-di-o 📻,vi-de-o 📹,pi-a-no 🎹,po-li-si 👮,pe-ra-hu 🛶,le-ma-ri #lemari,ko-mo-do 🦎,ce-ma-ra 🌲,bu-a-ya 🐊,pe-la-ngi 🌈,se-mu-a,ke-na-ri 🐤,de-li-ma #delima,ko-a-la 🐨,go-ri-la 🦍,ge-re-ja ⛪,pi-a-la 🏆,me-da-li 🏅,bi-o-la 🎻,re-ba-na 🪘,ku-a-li 🥘',
10:'ke-lin-ci 🐰,pe-sa-wat ✈️,ke-pi-ting 🦀,ma-ka-nan 🍱,se-la-mat 🎉,sa-yu-ran 🥦,be-la-jar 📚,me-na-ri 💃,ba-ta-gor #batagor,je-ra-pah 🦒,se-mang-ka 🍉,al-pu-kat 🥑,mah-ko-ta 👑,sem-bi-lan 9️⃣,ram-bu-tan #rambutan,ber-ma-in 🤹,be-ru-ang 🐻,pe-ngu-in 🐧,ke-ran-jang 🧺,se-ko-lah 🏫,mi-nu-man 🥤,se-pu-luh 🔟,ten-ta-ra 💂,ber-ja-lan 🚶,ber-la-ri 🏃,ter-ta-wa 😂,kom-pu-ter 💻,sa-te-lit 🛰️,pe-ra-wat 🧑‍⚕️,pa-ra-sut 🪂,pe-li-kan #pelikan,kang-gu-ru 🦘,te-le-pon ☎️,ke-ru-puk #kerupuk,men-te-ga 🧈,la-ya-ngan 🪁,ka-len-der 📅,ke-le-reng #kelereng,te-rom-pet 🎺,ge-lem-bung 🫧,be-lim-bing #belimbing,co-ke-lat 🍫,bis-ku-it 🍪,pa-ne-kuk 🥞,be-ron-dong 🍿,peng-ga-ris 📏,per-ma-ta 💎,pe-nyi-hir 🧙,jen-de-la 🪟,kur-ca-ci #kurcaci,du-ri-an #durian,se-li-mut #selimut,se-lan-car 🏄,be-re-nang 🏊,se-ra-gam #seragam',
11:'pan-tai 🏖️,pu-lau 🏝️,ker-bau 🐃,ca-bai 🌶️,ha-ri-mau 🐯,pi-sau 🔪,su-ngai 🏞️,gu-lai 🍛,san-tai 😎,sam-pai,hi-jau 🟢,ko-boi 🤠,ran-tai ⛓️,pan-dai 🤓,haus 🥵,pa-kai,tu-pai 🐿️,ke-le-dai 🫏,ba-te-rai 🔋,kaus 👕,saus 🥫,ba-ngau #bangau,lan-tai,da-nau 🏞️,pe-tai #petai',
12:'truk 🚚,drum 🥁,blus 👚,pu-tri 👸,stro-be-ri 🍓,bro-ko-li 🥦,ze-bra 🦓,pla-net 🪐,trak-tor 🚜,plas-tik #plastik,fla-mi-ngo 🦩,kris-tal 💎,sti-ker #stiker,dra-ma 🎭,klak-son 📯,pra-mu-ka ⚜️,jang-krik 🦗,lob-ster 🦞,ham-ster 🐹,kra-yon 🖍️,sku-ter 🛴,syal 🧣,lip-stik 💄,klip 📎,sta-si-un 🚉,sta-di-on 🏟️,spons 🧽,tram-po-lin #trampolin',
13:'ma-ta-ha-ri ☀️,ka-ca-ma-ta 👓,ku-pu=ku-pu 🦋,se-ri-ga-la 🐺,pi-ra-mi-da 🔺,te-le-vi-si 📺,ma-te-ma-ti-ka ➗,hi-po-po-ta-mus 🦛,di-no-sau-rus 🦕,a-ku-a-ri-um 🐠,ma-ka-ro-ni 🍝,ka-ka-tu-a 🦜,ku-ra=ku-ra 🐢,lum-ba=lum-ba 🐬,ke-lu-ar-ga 🫂,per-pus-ta-ka-an 📚,la-ba=la-ba 🕷️,ke-le-la-war 🦇,he-li-kop-ter 🚁,be-rang=be-rang 🦦,kal-ku-la-tor 🧮,ter-mo-me-ter 🌡️,u-bur=u-bur 🪼,ku-nang=ku-nang #kunang'
};
const BANK=Object.entries(TIERS).flatMap(([t,s])=>parse(s,+t));
const BYW={};BANK.forEach(w=>BYW[w.w]=w);
/* skor kesulitan: makin besar makin sulit */
const RARE='fvyzqx',MED='rgjhcw';
function sylScore(s,prev){
  const m=s.match(/^([^aiueo]*)([aiueo]+)([^aiueo]*)$/);if(!m)return 4;
  const on=m[1].replace('ng','N').replace('ny','Y').replace('kh','K').replace('sy','S'),nu=m[2],co=m[3];let sc=0;
  if(!on){sc+=1;if(prev&&/[aiueo]$/.test(prev))sc+=.5;}else{sc+=1.5;if(on.length>1)sc+=2.5*(on.length-1);}
  if(/[NY]/.test(on))sc+=1.5;if(/[KS]/.test(on))sc+=2;
  for(const ch of on){if(RARE.includes(ch))sc+=.7;else if(MED.includes(ch))sc+=.3;}
  if(nu.length>1)sc+=2.5;
  if(co){sc+=2.5;if(co==='ng')sc+=1.5;else if(co.length>1)sc+=2.5;if(RARE.includes(co))sc+=.7;}
  return sc;}
function wordScore(x){const sy=x.s.filter(y=>y!=='_');return sy.reduce((t,y,i)=>t+sylScore(y,sy[i-1]),0)+(/[- ]/.test(x.w)?1:0)+x.w.length*.05;}
const byDiff=(a,b)=>wordScore(a)-wordScore(b)||a.w.localeCompare(b.w);
const easyFirst=list=>[...list].sort(byDiff);
const tierWords=t=>easyFirst(BANK.filter(w=>w.t===t));
const ALLSYL=[...new Set(BANK.flatMap(x=>x.s))];
const VOW=['a','i','u','e','o'];
const VC={a:'#FF9A62',i:'#4FB3FF',u:'#8BD12F',e:'#A47CFF',o:'#FFBE1A'};
const CV='bcdfghjklmnprstwyz'.split('');
const CVORDER='bmpstdklnrgjhcwyfz'.split('');
const CONSORDER='bmpstdklnrgjhcwyfzvqx'.split('');
const CVsyl=c=>VOW.map(v=>c+v);
const LETTERS='abcdefghijklmnopqrstuvwxyz'.split('');
const EXA={a:['apel','🍎'],b:['bola','⚽'],c:['ceri','🍒'],d:['dadu','🎲'],e:['ekor','🐕'],f:['foto','📷'],g:['gajah','🐘'],h:['hidung','👃'],i:['ikan','🐟'],j:['jeruk','🍊'],
  k:['kucing','🐱'],l:['lemon','🍋'],m:['mobil','🚗'],n:['nanas','🍍'],o:['ombak','🌊'],p:['pisang','🍌'],q:['Qatar','#qatar'],r:['rumah','🏠'],s:['sapi','🐄'],t:['tomat','🍅'],
  u:['ular','🐍'],v:['vas','🏺'],w:['wortel','🥕'],x:['xilofon','🎶'],y:['yoyo','🪀'],z:['zebra','🦓']};
const HEWAN=parse('ku-cing 🐱,an-jing 🐶,sa-pi 🐄,a-yam 🐔,i-kan 🐟,ga-jah 🐘,mo-nyet 🐒,ku-da 🐴,be-bek 🦆,ke-lin-ci 🐰,ha-ri-mau 🐯,se-mut 🐜,le-bah 🐝,kam-bing 🐐,bu-rung 🐦,u-lar 🐍,ka-tak 🐸,si-nga 🦁,ze-bra 🦓,je-ra-pah 🦒,dom-ba 🐑,be-ru-ang 🐻,pan-da 🐼,si-put 🐌,ke-pi-ting 🦀,gu-ri-ta 🐙,un-ta 🐫,ti-kus 🐭,pe-ngu-in 🐧,nya-muk 🦟,ku-pu=ku-pu 🦋,ku-ra=ku-ra 🐢,lum-ba=lum-ba 🐬,bu-a-ya 🐊,ker-bau 🐃,kang-gu-ru 🦘,ko-a-la 🐨,go-ri-la 🦍,ru-bah 🦊,tu-pai 🐿️,lan-dak 🦔,hi-u 🦈,pa-us 🐋,u-dang 🦐,me-rak 🦚,ang-sa 🦢,e-lang 🦅,ke-le-la-war 🦇,ke-pik 🐞,na-ga 🐉');
const SAYUR=parse('wor-tel 🥕,to-mat 🍅,te-rong 🍆,ja-gung 🌽,ca-bai 🌶️,bro-ko-li 🥦,ken-tang 🥔,ti-mun 🥒,ba-wang 🧅,ja-mur 🍄,ka-cang 🥜,se-la-da 🥬,la-bu 🎃');
const BUAH=parse('a-pel 🍎,je-ruk 🍊,pi-sang 🍌,ang-gur 🍇,se-mang-ka 🍉,na-nas 🍍,mang-ga 🥭,stro-be-ri 🍓,ce-ri 🍒,pir 🍐,ki-wi 🥝,le-mon 🍋,ke-la-pa 🥥,al-pu-kat 🥑,per-sik 🍑,me-lon 🍈');
const WARNA=[['me-rah','#FF3B47'],['jing-ga','#FF8A1F'],['ku-ning','#FFD21F'],['hi-jau','#3CC75A'],['bi-ru','#3B8BFF'],['u-ngu','#9B5CFF'],['me-rah-_-mu-da','#FF8CC6'],['co-ke-lat','#8B5A2B'],['hi-tam','#2B2B2B'],['pu-tih','#FFFFFF'],['a-bu=a-bu','#9AA0A6']]
  .map(([s,hex])=>{const w=s.replace(/-_-/g,' ').replace(/-/g,'').replace(/=/g,'-');return {w,s:s.split(/[-=]/),hex};});

/* ============ tahap belajar ============ */
const sylItem=x=>({k:'syl',...x,label:(x.e?`<span class="ge">${ico(x.e)}</span>`:'')+x.s.map(casePart).join(' '),say:[...x.s,x.w]});
const picItem=x=>({k:'pic',...x,label:(x.e?`<span class="ge">${ico(x.e)}</span>`:`<span class="ge" style="color:${x.hex};-webkit-text-stroke:2px rgba(0,0,0,.15)">●</span>`)+caseWord(x.w),say:[...x.s.filter(s=>s!=='_'),x.w]});
const chips=arr=>arr.map((t,i)=>`<span class="chip" style="color:${COL[i%6]}">${t}</span>`).join('');
const ems=arr=>arr.map(e=>`<span class="em">${ico(e)}</span>`).join('');
// play = rekomendasi latihan [idGame, level]
const STAGES=[
 {id:'s1',title:'Huruf Vokal',c:'mint',art:chips(VOW),play:[['akhir',1],['awal',1],['jumlah',1]],items:()=>VOW.map(v=>({k:'big',text:v,color:VC[v],ex:EXA[v],label:caseUnit(v),say:[v,EXA[v][0]]}))},
 {id:'s1b',title:'Huruf Konsonan',c:'sky',art:chips(['b','m','p','s','t']),play:[['awal',1],['uruth',1],['puzzle',1]],items:()=>CONSORDER.map((c,i)=>({k:'big',text:c,color:COL[i%6],ex:EXA[c],label:caseUnit(c),say:[LN[c],EXA[c][0]]}))},
 {id:'s2',title:'Suku Kata',c:'grape',art:chips(['ba','bi','bu','be','bo']),play:[['tsuku',1],['urutk',1],['lengkapi',1]],items:()=>CVORDER.flatMap((c,ci)=>VOW.map(v=>({k:'big',text:c+v,color:COL[ci%6],label:caseUnit(c+v),say:[c+v]})))},
 {id:'s3',title:'Kata Kembar',c:'sky',art:chips(['ma ma','pa pa','su su']),play:[['puzzle',1],['tnama',1],['sambung',1]],items:()=>tierWords(3).map(sylItem)},
 {id:'s4',title:'Kata Mudah',c:'peach',art:chips(['bo la','sa pi','bu ku']),play:[['pzsuku',3],['tnama',3],['hitung',3]],items:()=>tierWords(4).map(sylItem)},
 {id:'s5',title:'Awalan Vokal',c:'rose',art:chips(['i bu','a pi','u bi']),play:[['lengkapi',6],['tbenda',6],['bacaan',6]],items:()=>tierWords(5).map(sylItem)},
 {id:'s6',title:'Akhiran Konsonan',c:'lilac',art:chips(['i kan','ka pal','je ruk']),play:[['akhir',8],['puzzle',8],['cari',8]],items:()=>tierWords(6).map(sylItem)},
 {id:'s7',title:'Konsonan Tengah',c:'mint',art:chips(['pin tu','kur si','lam pu']),play:[['pzsuku',11],['sambung',11],['jumlah',11]],items:()=>tierWords(7).map(sylItem)},
 {id:'s8a',title:'Suku Kata NG dan NY',c:'sun',art:chips(['nga','ngi','nya','nyo']),play:[['tsuku',11],['tsuku',13],['urutk',16]],items:()=>['ng','ny'].flatMap(b=>VOW.map(v=>({k:'big',text:b+v,multi:true,label:caseUnit(b+v),say:[b+v]})))},
 {id:'s8b',title:'Kata NG dan NY',c:'peach',art:chips(['bu nga','nya nyi']),play:[['tnama',13],['pasang',13],['bacaan',13]],items:()=>tierWords(8).map(sylItem)},
 {id:'s9',title:'3 Suku Kata',c:'coral',art:chips(['se pa tu','bo ne ka']),play:[['hitung',15],['lengkapi',15],['tbenda',15]],items:()=>tierWords(9).map(sylItem)},
 {id:'s10',title:'3 Suku Kata Sulit',c:'berry',art:chips(['ke lin ci','pe sa wat']),play:[['pzsuku',18],['sambung',18],['puzzle',18]],items:()=>tierWords(10).map(sylItem)},
 {id:'s11',title:'Bunyi ai au oi',c:'sky',art:chips(['pan tai','pu lau','ko boi']),play:[['tnama',20],['bacaan',20],['akhir',20]],items:()=>tierWords(11).map(sylItem)},
 {id:'s12',title:'Konsonan Gabung',c:'grape',art:chips(['truk','pu tri','dra ma']),play:[['awal',23],['cari',23],['uruth',23]],items:()=>tierWords(12).map(sylItem)},
 {id:'s13',title:'Kata Panjang',c:'pink',art:chips(['ma ta ha ri']),play:[['hitung',25],['lengkapi',25],['pasang',25]],items:()=>tierWords(13).map(sylItem)},
 {id:'k1',kamus:true,title:'Huruf A–Z',c:'peach',art:chips(['A a','B b','C c']),play:[['awal',1],['akhir',1],['uruth',1]],items:()=>LETTERS.map(l=>({k:'letter',up:l.toUpperCase(),low:l,ex:EXA[l],label:l.toUpperCase()+' '+l,say:[LN[l],EXA[l][0]]}))},
 {id:'k2',kamus:true,title:'Hewan',c:'peach',art:ems(['🐬','🐒','🐓','🐢']),play:[['tnama',3],['sambung',3],['bacaan',3]],items:()=>easyFirst(HEWAN).map(picItem)},
 {id:'k3',kamus:true,title:'Sayur',c:'grape',art:ems(['🍆','🌽','🥕','🍅']),play:[['tnama',5],['sambung',5],['bacaan',5]],items:()=>easyFirst(SAYUR).map(picItem)},
 {id:'k4',kamus:true,title:'Buah',c:'sky',art:ems(['🍌','🍎','🍊','🍉']),play:[['tnama',5],['sambung',5],['bacaan',5]],items:()=>easyFirst(BUAH).map(picItem)},
 {id:'k5',kamus:true,title:'Warna',c:'sun',art:'<span class="chip" style="color:#FF3B47">merah</span><span class="chip" style="color:#3B8BFF">biru</span><span class="chip" style="color:#3CC75A">hijau</span>',play:[['tnama',2],['bacaan',2],['awal',2]],items:()=>easyFirst(WARNA).map(picItem)}
];

/* ============ stiker ============ */
const STICKERS=[...'🦄🌸👑🎀💖🌈🧁🍓🐱🐰🦋🌷⭐🍭🎠🧸🐼🦩🍩👗💎🌙🐬🐞🍒🌻🎈🎂🍰🐥🦊🐨🐹🌺🍬🧚🧜💐🎨🎵🏰🦢🐣🍉🍦🐧🐶🐻🐯🦁🐸🐵🦉🦜🐠🐳🦕🐢🌼🍀🍄🌵🌴🍎🍊🍋🍌🍇🍑🥝🥥🍪🍫🍿🧃🎁🎉🪀🪁⚽🎹🎸🥁🎤🚲🛴🚀🚂🛶🌟✨💫🔮🧩🦚🦔🦝🦦🐝🐙🦀☀️'.match(/\p{Extended_Pictographic}\uFE0F?/gu)].slice(0,100);
const stkNeed=k=>Math.round(3*k+.06*k*k);
const stkCount=stars=>{let k=0;while(k<STICKERS.length&&stars>=stkNeed(k+1))k++;return k;};

