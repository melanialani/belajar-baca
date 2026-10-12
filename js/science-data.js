/* ============ sains content: topic cards per category, quiz questions, true/false facts ============ */
// categories with one card list topics here; bigger categories (groups of cards) live in js/data/sains-*.js
// topic: [short title, question, pictures ("|" between groups, ">" arrow, "+" plus), sentences read one by one]
const SCI_CATS=[
 {id:'sc-tubuh',title:'Tubuh Kita',c:'rose',art:'👀👂🦷',topics:[
  ['Panca indra','Apa saja panca indra kita?','👀|👂|👃|👅|✋',['Mata untuk melihat.','Telinga untuk mendengar.','Hidung untuk mencium bau.','Lidah untuk merasa, dan kulit untuk meraba.']],
  ['Gosok gigi','Kenapa kita harus gosok gigi?','🍬>🦷|🪥>😁',['Sisa makanan menempel di gigi.','Kuman suka sisa makanan, lalu membuat gigi berlubang.','Gosok gigi pagi dan sebelum tidur supaya gigi sehat.']],
  ['Cuci tangan','Kenapa kita harus cuci tangan?','🦠>🖐️|🧼>👏',['Di tangan ada kuman yang sangat kecil, tidak kelihatan.','Kuman bisa membuat kita sakit perut atau flu.','Cuci tangan pakai sabun sebelum makan dan sesudah dari toilet.']],
  ['Tulang','Kenapa tubuh punya tulang?','🦴>🧍',['Tulang membuat tubuh bisa berdiri tegak.','Tulang kepala melindungi otak.','Minum susu membantu tulang jadi kuat.']],
  ['Jantung','Kenapa jantung berdetak?','❤️>🏃',['Jantung itu seperti pompa.','Setiap detak, jantung mendorong darah ke seluruh tubuh.','Coba pegang dadamu, dug, dug, dug!']],
  ['Tidur','Kenapa kita perlu tidur?','😴>💪',['Saat tidur, tubuh beristirahat dan mengisi tenaga.','Anak-anak bertambah tinggi saat tidur.','Tidur cukup membuat kita segar dan mudah belajar.']],
  ['Sayur dan buah','Kenapa kita makan sayur dan buah?','🥦+🍎>💪',['Sayur dan buah punya banyak vitamin.','Vitamin membuat tubuh kuat dan tidak mudah sakit.','Ayo makan sayur dan buah yang berwarna-warni!']],
  ['Keringat','Kenapa kita berkeringat?','☀️+🏃>💦',['Saat panas atau habis berlari, tubuh jadi hangat.','Keringat keluar dari kulit untuk mendinginkan tubuh.','Jangan lupa minum air putih.']],
  ['Bersin','Kenapa kita bersin?','🤧>💨',['Bersin mengeluarkan debu atau kuman dari hidung.','Bersin itu sangat cepat!','Tutup mulut dengan siku saat bersin, ya.']]]},
 {id:'sc-tumbuhan',title:'Tumbuhan',c:'mint',art:'🌱🌳🌸',topics:[
  ['Biji tumbuh','Bagaimana biji menjadi tanaman?','🌰>🌱>🌳',['Biji ditanam di dalam tanah.','Dengan air dan sinar matahari, biji tumbuh menjadi tunas.','Lama-lama, tunas menjadi tanaman yang besar.']],
  ['Daun hijau','Kenapa daun berwarna hijau?','🍃+☀️',['Daun punya zat hijau bernama klorofil.','Dengan klorofil, daun membuat makanan dari sinar matahari, air, dan udara.','Daun adalah dapur tumbuhan.']],
  ['Bunga dan lebah','Kenapa bunga wangi dan berwarna?','🌸>🐝',['Warna dan wangi bunga memanggil lebah dan kupu-kupu.','Lebah membawa serbuk bunga ke bunga yang lain.','Dari situ, bunga bisa menjadi buah.']],
  ['Akar','Akar gunanya untuk apa?','🌳>💧',['Akar ada di dalam tanah.','Akar menyerap air untuk tumbuhan.','Akar juga memegang tanaman supaya tidak roboh.']],
  ['Udara segar','Kenapa pohon membuat udara segar?','🌳>🌬️>😊',['Daun mengeluarkan oksigen.','Kita perlu oksigen untuk bernapas.','Ayo jaga pohon dan menanam pohon!']],
  ['Biji buah','Kenapa buah punya biji?','🍉|🍎|🥑',['Biji ada di dalam buah.','Kalau biji ditanam, bisa tumbuh pohon yang baru.','Biji alpukat besar, biji semangka kecil.']]]},
 {id:'sc-benda',title:'Air & Benda',c:'sky',art:'🧊🧲💧',topics:[
  ['Es mencair','Kenapa es mencair?','🧊+☀️>💧',['Es adalah air yang membeku karena sangat dingin.','Kalau kena panas, es mencair menjadi air lagi.','Air di dalam freezer bisa menjadi es.']],
  ['Air mendidih','Apa yang terjadi kalau air dipanaskan?','💧+🔥>♨️',['Kalau dipanaskan terus, air mendidih.','Air berubah menjadi uap yang naik ke atas.','Hati-hati, uap air itu panas!']],
  ['Terapung','Kenapa ada benda yang terapung dan tenggelam?','🦆+🛶|🪨',['Benda yang ringan, seperti kayu, terapung di air.','Benda yang berat dan padat, seperti batu, tenggelam.','Kapal besar bisa terapung karena bentuknya lebar dan di dalamnya ada udara.']],
  ['Magnet','Magnet bisa menarik apa?','🧲>📎',['Magnet bisa menarik benda dari besi, seperti paku dan klip.','Magnet tidak menarik kayu, plastik, atau kertas.','Ayo coba di rumah bersama ayah atau ibu!']],
  ['Bayangan','Bagaimana bayangan terbentuk?','🔦>🧍',['Cahaya berjalan lurus.','Kalau cahaya terhalang tubuh kita, terbentuklah bayangan.','Sore hari, bayangan kita menjadi panjang.']],
  ['Benda jatuh','Kenapa benda jatuh ke bawah?','🍎>⬇️',['Bumi menarik semua benda ke arah bawah.','Tarikan bumi namanya gravitasi.','Karena gravitasi, kita tidak melayang ke langit.']],
  ['Campur warna','Apa jadinya kalau warna dicampur?','🎨',['Merah dicampur kuning menjadi jingga.','Biru dicampur kuning menjadi hijau.','Merah dicampur biru menjadi ungu.']]]},
 {id:'sc-alam',title:'Cuaca & Alam',c:'lilac',art:'🌧️🌈⚡',topics:[
  ['Hujan','Hujan datang dari mana?','☀️>🌊>☁️>🌧️',['Matahari memanaskan air laut, lalu air naik menjadi uap.','Uap air berkumpul menjadi awan.','Kalau awan penuh air, turunlah hujan.']],
  ['Pelangi','Bagaimana pelangi muncul?','☀️+🌧️>🌈',['Pelangi muncul kalau ada matahari dan titik air hujan.','Sinar matahari dipecah oleh titik air menjadi banyak warna.','Merah, jingga, kuning, hijau, biru, nila, ungu.']],
  ['Petir','Kenapa ada petir dan guntur?','⚡>🔊',['Petir adalah listrik yang sangat besar dari awan.','Guntur adalah suara petir.','Cahaya lebih cepat dari suara, jadi kilat terlihat dulu, baru terdengar duar!']],
  ['Angin','Angin itu apa?','💨>🪁',['Angin adalah udara yang bergerak.','Kita tidak bisa melihat angin, tapi bisa merasakannya.','Angin menerbangkan layang-layang dan menggerakkan perahu layar.']],
  ['Siang dan malam','Kenapa ada siang dan malam?','🌍+☀️|🌙',['Bumi kita bulat dan terus berputar.','Bagian bumi yang menghadap matahari menjadi siang.','Bagian yang membelakangi matahari menjadi malam.']],
  ['Gunung berapi','Kenapa gunung berapi meletus?','🌋',['Di dalam bumi ada batu cair yang sangat panas, namanya magma.','Kalau gunung berapi meletus, magma keluar menjadi lava.','Indonesia punya banyak gunung berapi.']],
  ['Laut asin','Kenapa air laut asin?','🌊>🧂',['Air sungai membawa sedikit garam dari batu dan tanah ke laut.','Air laut menguap, tapi garamnya tertinggal.','Lama-kelamaan, air laut menjadi asin.']]]},
 {id:'sc-langit',title:'Langit & Antariksa',c:'grape',art:'🚀🌙⭐',topics:[
  ['Matahari','Matahari itu apa?','☀️',['Matahari adalah bintang yang paling dekat dengan bumi.','Matahari memberi cahaya dan panas.','Jangan melihat matahari langsung, nanti mata sakit.']],
  ['Bulan','Kenapa bentuk bulan berubah-ubah?','🌑>🌓>🌕',['Bulan tidak bercahaya sendiri. Bulan memantulkan sinar matahari.','Bulan bergerak mengelilingi bumi.','Jadi, bagian bulan yang terang kadang kecil, kadang bulat penuh.']],
  ['Langit biru','Kenapa langit berwarna biru?','☀️>🌤️',['Sinar matahari punya banyak warna.','Udara paling banyak menyebarkan warna biru ke segala arah.','Karena itu, langit siang terlihat biru.']],
  ['Planet','Bumi itu planet apa?','☀️>🌍',['Ada delapan planet yang mengelilingi matahari.','Bumi adalah planet ketiga dari matahari, rumah kita.','Bumi punya air dan udara, jadi kita bisa hidup.']],
  ['Bintang','Kenapa bintang berkelip?','⭐',['Bintang adalah matahari yang sangat jauh.','Cahayanya melewati udara bumi yang terus bergerak.','Karena itu, bintang terlihat berkelip-kelip.']],
  ['Astronaut','Kenapa astronaut bisa melayang?','🧑‍🚀>🚀',['Astronaut pergi ke luar angkasa naik roket.','Di dalam pesawat yang mengelilingi bumi, semua benda melayang.','Makanan dan air pun bisa melayang!']]]}
];

// quiz: [question, right answers, wrong answers, difficulty 1–3]
const SCI_QUIZ=[
 ['Mana untuk melihat?','👀','👂👃👅',1],['Mana untuk mendengar?','👂','👀👃👅',1],['Mana untuk mencium bau?','👃','👀👂🖐️',1],
 ['Pakai apa untuk gosok gigi?','🪥','🧦🥄🧸',1],['Pakai apa supaya tangan bersih?','🧼','🍬🧸🍩',1],
 ['Mana makanan yang sehat?','🥦🍎🥕','🍬🍭🍩',2],['Apa yang membuat gigi berlubang?','🍬🍭','🥦🥛🥕',2],
 ['Mana hewan yang bertelur?','🐔🐢🐟🦆🐍','🐱🐶🐄🐘🐒',1],['Mana hewan yang menyusui?','🐱🐶🐄🐘','🐔🐟🐢🦆',2],
 ['Mana hewan yang bisa terbang?','🐦🦋🐝','🐘🐄🐢🐟',1],['Mana hewan yang hidup di air?','🐟🐙🐬🦀','🐄🐔🐘🐒',1],
 ['Ulat nanti menjadi apa?','🦋','🐝🐦🐞',2],['Mana hewan pemakan daging?','🦁🐯','🐄🐐🐰🐑',3],['Mana hewan pemakan rumput?','🐄🐐🐑','🦁🐯',2],
 ['Hewan apa yang punya punuk?','🐫','🐴🐘🦒',2],['Mana hewan mamalia?','🐬🐘🐄','🐔🐟🐢🐍',3],
 ['Lebah suka hinggap di mana?','🌸','🪨🧊🚗',1],['Biji ditanam menjadi apa?','🌱','🪨🧸🍬',1],['Apa yang dibutuhkan tanaman?','💧☀️','🍬🧸🎈',2],
 ['Es kalau kena panas menjadi apa?','💧','🧊🔥🪨',2],['Mana yang ditarik magnet?','📎🔑','🧸🍃🎈',2],['Mana yang terapung di air?','🦆🛶','🪨🔑',2],
 ['Apa yang membuat bayangan?','🔦☀️','💧🍃',3],
 ['Hujan turun dari mana?','🌧️','☀️🌙⭐',1],['Apa yang muncul setelah hujan, saat matahari bersinar?','🌈','⛄🌙⭐',1],
 ['Kalau malam, apa yang terlihat di langit?','🌙⭐','☀️🌈',1],['Apa yang menerbangkan layang-layang?','💨','💧🔥🧊',2],
 ['Astronaut naik apa ke luar angkasa?','🚀','🚗🚲🚂',1],['Mana bumi kita?','🌍','🌙☀️⭐',2],['Bintang yang paling dekat dengan bumi?','☀️','🌙⭐🌍',3]
];
// true/false: [statement, true?, picture, difficulty 1–3]
const SCI_FACTS=[
 ['Mata untuk melihat.',1,'👀',1],['Telinga untuk makan.',0,'👂',1],['Kita gosok gigi sebelum tidur.',1,'🪥',1],['Permen membuat gigi kuat.',0,'🍬',2],
 ['Jantung memompa darah.',1,'❤️',2],['Keringat mendinginkan tubuh.',1,'💦',3],
 ['Ayam bertelur.',1,'🐔',1],['Kucing bertelur.',0,'🐱',1],['Ulat berubah menjadi kupu-kupu.',1,'🐛',1],['Ikan bernapas pakai insang.',1,'🐟',2],
 ['Sapi makan daging.',0,'🐄',2],['Bayi katak namanya berudu.',1,'🐸',3],['Punuk unta berisi lemak.',1,'🐫',3],['Paus termasuk ikan.',0,'🐳',3],
 ['Tanaman butuh air.',1,'🌱',1],['Lebah suka bunga.',1,'🐝',1],['Akar ada di dalam tanah.',1,'🌳',2],['Daun hijau karena klorofil.',1,'🍃',3],
 ['Es mencair kalau kena panas.',1,'🧊',1],['Batu terapung di air.',0,'🪨',2],['Magnet menarik kertas.',0,'🧲',2],['Merah dicampur kuning menjadi jingga.',1,'🎨',3],['Gravitasi menarik benda ke bawah.',1,'🍎',3],
 ['Hujan turun dari awan.',1,'🌧️',1],['Air laut rasanya manis.',0,'🌊',1],['Pelangi muncul di malam hari.',0,'🌈',2],['Kilat terlihat lebih dulu daripada suara guntur.',1,'⚡',3],
 ['Bumi adalah rumah kita.',1,'🌍',1],['Astronaut naik sepeda ke luar angkasa.',0,'🚀',1],['Matahari adalah bintang.',1,'☀️',2],['Bulan bercahaya sendiri.',0,'🌙',3]
];
