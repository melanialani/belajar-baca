/* ============ sains content: topic cards per category, quiz questions, true/false facts ============ */
// science categories (groups of smaller cards) are pushed by js/data/sains-*.js
const SCI_CATS=[];

// Tahukah Kamu? cards, filled by js/data/fakta-*.js
const FACT_CATS=[];
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
