/* ============ Jaga Diri: safety cards, important numbers, scenarios for the games ============ */
// card item: [short title, rule or question, pictures, sentences, kind: 'ok' boleh | 'no' jangan | 'tip' ingat]
const JD_CATS=[
 {id:'jd-tubuh',title:'Tubuhku Milikku',c:'rose',art:'🧒💖🙅',items:[
  ['Tubuhku milikku','Tubuhku adalah milikku.','🧒+💖',['Tubuhmu berharga dan milikmu sendiri.','Kamu boleh bilang tidak kalau ada yang menyentuhmu dan kamu tidak suka.','Katakan dengan tegas: Jangan!'],'tip'],
  ['Bagian pribadi','Apa itu bagian pribadi?','🩱|🩲',['Bagian pribadi adalah bagian tubuh yang tertutup baju renang atau pakaian dalam.','Dada, alat kelamin, dan pantat adalah bagian pribadi.','Bagian pribadi tidak untuk dilihat atau disentuh orang lain.'],'tip'],
  ['Yang boleh membantu','Siapa yang boleh membantu membersihkan bagian pribadi?','👩+🛁|🩺',['Ayah atau ibu boleh membantu saat mandi atau berganti baju, kalau kamu masih kecil.','Dokter boleh memeriksa, tapi harus ditemani ayah atau ibu.','Selain itu, tidak ada yang boleh.'],'ok'],
  ['Main dokter-dokteran','Jangan main dokter-dokteran dengan membuka baju.','🩺+👕',['Main dokter-dokteran boleh, asal bajunya tetap dipakai.','Jangan membuka baju atau melihat bagian pribadi teman.','Kalau ada teman yang mengajak, bilang tidak dan cerita ke ayah atau ibu.'],'no'],
  ['Sentuhan baik','Sentuhan apa yang baik, dan apa yang buruk?','🫂|✋',['Pelukan ibu dan tos dengan teman adalah sentuhan yang baik.','Sentuhan yang membuatmu takut, sakit, atau tidak nyaman adalah sentuhan yang buruk.','Kamu boleh menolak sentuhan yang tidak kamu suka.'],'tip'],
  ['Boleh menolak','Bolehkah aku menolak dipeluk atau dicium?','🙅',['Boleh. Kamu boleh menolak dipeluk atau dicium, walaupun oleh saudara.','Kamu bisa menggantinya dengan tos atau melambaikan tangan.','Tubuhmu, kamu yang menentukan.'],'ok'],
  ['Tiga langkah','Kalau ada yang menyentuh bagian pribadimu, apa yang harus kamu lakukan?','🗣️>🏃>👩',['Satu: katakan dengan keras, Jangan!','Dua: pergi menjauh secepatnya.','Tiga: ceritakan kepada orang dewasa yang kamu percaya.'],'tip'],
  ['Rahasia buruk','Jangan simpan rahasia yang membuatmu takut.','🤫>😟',['Kejutan ulang tahun adalah rahasia yang baik, karena nanti membuat senang.','Rahasia yang membuatmu takut, sedih, atau bingung harus diceritakan.','Orang dewasa yang baik tidak menyuruh anak menyimpan rahasia buruk.'],'no'],
  ['Foto tanpa baju','Jangan mau difoto tanpa baju.','📷+🚫',['Tidak ada yang boleh memotret atau merekam bagian pribadimu.','Kamu juga tidak boleh mengirim foto tanpa baju kepada siapa pun.','Kalau ada yang meminta, segera cerita ke orang tua.'],'no'],
  ['Ganti baju','Berganti baju di tempat yang tertutup.','🚪+👕',['Berganti baju di kamar atau kamar mandi yang tertutup.','Bagian pribadi tidak diperlihatkan kepada orang lain.','Hormati juga teman yang sedang berganti baju.'],'ok'],
  ['Orang yang dipercaya','Siapa orang dewasa yang bisa aku percaya?','👨+👩|👩‍🏫',['Ayah, ibu, kakek, nenek, atau guru bisa menjadi orang yang kamu percaya.','Pilih bersama ayah dan ibu, siapa saja orang yang kamu percaya.','Kepada merekalah kamu bercerita kalau ada masalah.'],'tip'],
  ['Bukan salahmu','Kalau sesuatu yang buruk terjadi, apakah itu salahku?','💖',['Bukan. Itu tidak pernah salahmu.','Kamu tidak akan dimarahi karena bercerita.','Teruslah bercerita sampai ada orang dewasa yang menolongmu.'],'tip']]},
 {id:'jd-berani',title:'Berani Bilang Tidak',c:'sun',art:'🙅⚠️🏢',items:[
  ['Berani sejati','Apa itu berani yang sebenarnya?','💪+🙅',['Berani bukan berarti melakukan hal yang berbahaya.','Berani yang sebenarnya adalah berani bilang tidak.','Teman yang baik tidak akan memaksamu.'],'tip'],
  ['Lompat dari tinggi','Kalau teman bilang, berani tidak lompat dari lantai dua?','🏢>⚠️',['Jangan pernah melompat dari tempat yang tinggi.','Kita bisa patah tulang atau terluka parah.','Katakan: tidak mau, itu berbahaya! Lalu cerita ke orang dewasa.'],'no'],
  ['Main api','Jangan main api, korek, atau petasan.','🔥+🚫',['Api bisa membakar tangan, baju, dan rumah.','Korek api dan petasan hanya untuk orang dewasa.','Kalau melihat api, segera panggil orang dewasa.'],'no'],
  ['Menahan napas','Jangan lomba menahan napas di dalam air.','🏊>⚠️',['Menahan napas lama di dalam air bisa membuat pingsan.','Berenang selalu ditemani orang dewasa.','Bermainlah di air dengan aman dan gembira.'],'no'],
  ['Memanjat tinggi','Jangan memanjat pagar, jendela, atau lemari.','🪟>⚠️',['Kita bisa jatuh dari tempat yang tinggi.','Lemari juga bisa roboh menimpa kita.','Minta tolong orang dewasa untuk mengambil barang di tempat tinggi.'],'no'],
  ['Menelan benda','Jangan mau ditantang menelan benda aneh.','💊+🚫',['Obat, baterai kecil, dan manik-manik berbahaya kalau ditelan.','Jangan memasukkan benda ke hidung atau telinga.','Kalau ada yang tertelan, segera bilang ke orang dewasa.'],'no'],
  ['Lomba menyeberang','Jangan lomba menyeberang jalan sambil berlari.','🚗>⚠️',['Kendaraan bisa datang tiba-tiba.','Menyeberanglah bersama orang dewasa di zebra cross.','Lihat kanan, lalu kiri, lalu kanan lagi sebelum menyeberang.'],'no'],
  ['Tantangan di video','Jangan ikut tantangan berbahaya dari video di internet.','📱>⚠️',['Ada video yang menantang anak melakukan hal berbahaya.','Tidak semua yang ada di video aman ditiru.','Tanyakan dulu kepada ayah atau ibu.'],'no'],
  ['Cara menolak','Bagaimana cara menolak ajakan teman?','🙅>😊',['Katakan dengan jelas: tidak mau, itu berbahaya.','Ajak teman bermain hal lain yang aman.','Kalau teman terus memaksa, pergi dan cerita ke orang dewasa.'],'ok']]},
 {id:'jd-asing',title:'Orang Asing',c:'lilac',art:'🧍❓🚫',items:[
  ['Orang asing','Siapa orang asing itu?','🧍+❓',['Orang asing adalah orang yang tidak kita kenal.','Orang asing bisa terlihat baik dan ramah.','Karena itu, kita tetap harus berhati-hati.'],'tip'],
  ['Ikut orang asing','Jangan ikut orang yang tidak dikenal.','🚗+🚫',['Jangan masuk ke mobil atau pergi dengan orang yang tidak kamu kenal.','Walaupun dia bilang disuruh ayah atau ibu.','Tunggu orang yang biasa menjemputmu.'],'no'],
  ['Permen dan hadiah','Jangan menerima permen atau hadiah dari orang asing.','🍬+🎁',['Orang asing bisa membujuk dengan permen, mainan, atau anak kucing.','Katakan: tidak, terima kasih, lalu pergi.','Ceritakan kepada orang tua.'],'no'],
  ['Kalau digandeng','Kalau ada orang asing tiba-tiba menggandeng atau menarikmu, apa yang harus kamu lakukan?','📢>🏃',['Teriak sekeras-kerasnya: Tolong! Ini bukan ayah atau ibu saya!','Tarik tanganmu, lalu lari ke tempat yang ramai.','Cari satpam, kasir, atau ibu yang membawa anak, lalu minta tolong.'],'tip'],
  ['Kata rahasia','Apa itu kata rahasia keluarga?','🔑+🏠',['Buat satu kata rahasia bersama ayah dan ibu.','Kalau ada yang bilang disuruh menjemputmu, tanyakan kata rahasianya.','Kalau dia tidak tahu, jangan ikut.'],'ok'],
  ['Membuka pintu','Jangan membukakan pintu untuk orang asing.','🚪+🚫',['Kalau ada tamu, panggil orang dewasa di rumah.','Jangan bilang kalau kamu sedang sendirian.','Orang yang baik akan menunggu atau kembali lagi nanti.'],'no'],
  ['Alamat rumah','Jangan memberi tahu alamat dan nomor telepon kepada orang asing.','🏠+📱',['Alamat rumah dan nomor telepon hanya untuk orang yang kamu kenal.','Di internet pun jangan memberi tahu alamat atau nama sekolahmu.','Kalau ada yang bertanya, tanyakan dulu kepada orang tua.'],'no'],
  ['Teman di internet','Jangan bertemu teman dari internet tanpa orang tua.','💻>🚫',['Teman di internet belum tentu seperti yang dia ceritakan.','Jangan pernah pergi menemuinya sendirian.','Ceritakan kepada orang tua kalau ada yang mengajak bertemu.'],'no'],
  ['Minta tolong','Siapa yang bisa aku mintai tolong di luar rumah?','👮|🏪',['Polisi, satpam, dan kasir toko bisa dimintai tolong.','Ibu yang sedang membawa anak juga bisa dimintai tolong.','Tetaplah di tempat yang ramai, jangan ke tempat sepi.'],'ok'],
  ['Pamit dulu','Selalu pamit sebelum pergi.','👋+🏠',['Bilang kepada orang tua ke mana kamu pergi dan dengan siapa.','Pulang sesuai waktu yang dijanjikan.','Kalau rencanamu berubah, kabari orang tua.'],'ok']]},
 {id:'jd-tersesat',title:'Kalau Tersesat',c:'sky',art:'🛑👮📍',items:[
  ['Berhenti dan diam','Kalau terpisah dari ayah ibu di tempat ramai, apa yang harus aku lakukan?','🛑',['Berhenti dan tetap di tempat.','Ayah dan ibu akan mencarimu di dekat tempat terakhir kalian bersama.','Tarik napas pelan-pelan supaya tenang.'],'tip'],
  ['Cari petugas','Kepada siapa aku minta tolong kalau tersesat?','👮|🧑‍💼',['Cari petugas berseragam, satpam, atau kasir.','Katakan: saya terpisah dari orang tua saya.','Jangan pergi ke tempat parkir atau keluar bersama orang asing.'],'tip'],
  ['Hafal nama','Hafalkan nama lengkapmu dan nama orang tuamu.','🧒+👨+👩',['Petugas akan menanyakan namamu dan nama orang tuamu.','Coba sebutkan nama lengkap ayah dan ibumu.','Latihan bersama orang tua, ya.'],'ok'],
  ['Hafal nomor','Hafalkan nomor HP ayah atau ibu.','📱',['Nomor HP membantu petugas menelepon orang tuamu.','Latihan menyebutkan nomornya setiap hari.','Kamu juga bisa menyimpan kartu berisi nomor HP di tas.'],'ok'],
  ['Tempat bertemu','Buat tempat bertemu bersama keluarga.','📍',['Di mal atau taman, sepakati satu tempat untuk bertemu.','Misalnya di dekat pintu masuk atau kasir.','Kalau terpisah, tunggu di sana.'],'ok'],
  ['Bersembunyi','Jangan bersembunyi di tempat ramai.','🙈+🚫',['Bersembunyi di toko atau mal membuat orang tua cemas.','Bermain petak umpet hanya di tempat yang aman.','Tetap dekat dengan orang tua di tempat ramai.'],'no']]},
 {id:'jd-rumah',title:'Aman di Rumah & Jalan',c:'mint',art:'🏠🚦💊',items:[
  ['Obat bukan permen','Obat bukan permen.','💊',['Obat hanya diminum kalau diberi oleh orang tua atau dokter.','Obat yang diminum sembarangan bisa membuat sakit.','Jangan mengambil obat sendiri.'],'no'],
  ['Colokan listrik','Jangan memasukkan jari atau benda ke colokan listrik.','🔌+⚠️',['Listrik di colokan sangat berbahaya.','Jangan memegang kabel atau alat listrik dengan tangan basah.','Minta tolong orang dewasa untuk mencolokkan alat listrik.'],'no'],
  ['Benda panas','Jangan mendekati kompor, setrika, dan air panas.','🍳+🔥',['Kompor, setrika, dan air panas bisa membuat kulit melepuh.','Dapur adalah tempat orang dewasa memasak.','Kalau ingin membantu, minta izin dulu.'],'no'],
  ['Pisau dan gunting','Jangan bermain pisau atau gunting yang tajam.','🔪+🚫',['Benda tajam bisa melukai tangan.','Pakai gunting khusus anak dan bersama orang dewasa.','Berikan pisau kepada orang dewasa, jangan dibawa berlari.'],'no'],
  ['Cairan pembersih','Jangan meminum atau mencium cairan pembersih.','🧴+🚫',['Sabun cuci, pemutih, dan cairan pembersih berbahaya kalau tertelan.','Jangan membuka botolnya tanpa izin.','Kalau ada yang tertelan, segera beri tahu orang dewasa.'],'no'],
  ['Kolam dan sungai','Jangan bermain di kolam atau sungai tanpa orang dewasa.','🏊+👩',['Air bisa lebih dalam daripada yang terlihat.','Berenang hanya kalau ditemani orang dewasa.','Pakai pelampung kalau belum bisa berenang.'],'no'],
  ['Hewan tak dikenal','Jangan memegang hewan yang tidak kamu kenal.','🐕+⚠️',['Hewan yang tidak mengenal kita bisa takut, lalu menggigit.','Tanyakan dulu kepada pemiliknya.','Jangan mengganggu hewan yang sedang makan atau tidur.'],'no'],
  ['Sabuk pengaman','Selalu pakai sabuk pengaman di mobil.','🚗+🔒',['Duduk di kursi anak atau di kursi belakang.','Pakai sabuk pengaman setiap naik mobil.','Jangan mengeluarkan kepala dan tangan dari jendela.'],'ok'],
  ['Helm','Pakai helm saat naik motor atau sepeda.','🛵|🚲',['Helm melindungi kepala kalau kita jatuh.','Pakai helm yang pas di kepalamu.','Kencangkan talinya, ya.'],'ok'],
  ['Menyeberang jalan','Bagaimana cara menyeberang jalan dengan aman?','🚦+🚸',['Menyeberanglah bersama orang dewasa sambil bergandengan tangan.','Gunakan zebra cross atau jembatan penyeberangan.','Lihat kanan, lalu kiri, lalu kanan lagi.'],'ok'],
  ['Bermain di jalan','Jangan bermain di jalan raya.','🚗+⚽',['Kendaraan bisa lewat dengan cepat.','Bermainlah di halaman, taman, atau lapangan.','Kalau bola terlempar ke jalan, minta tolong orang dewasa mengambilnya.'],'no'],
  ['Kalau kebakaran','Kalau ada kebakaran, apa yang harus aku lakukan?','🔥>🏃',['Keluar dari rumah secepatnya, jangan bersembunyi.','Kalau ada asap, merangkaklah rendah di lantai.','Jangan masuk lagi, walaupun untuk mengambil mainan.'],'tip'],
  ['Kalau gempa','Kalau ada gempa, apa yang harus aku lakukan?','🏠>⚠️',['Merunduk, lindungi kepala, dan berlindung di bawah meja yang kuat.','Jauhi kaca dan lemari.','Setelah guncangan berhenti, keluar bersama orang dewasa.'],'tip']]}
];
// important numbers: [number, name, pictures, sentences]
const JD_NUMS=[
 ['112','Nomor darurat','🆘',['Nomor darurat untuk semua keadaan bahaya.','Telepon kalau ada kecelakaan, kebakaran, atau orang yang butuh pertolongan.','Jangan menelepon untuk bercanda, ya.']],
 ['110','Polisi','👮',['Nomor polisi.','Telepon kalau ada orang jahat atau keadaan yang berbahaya.']],
 ['113','Pemadam kebakaran','🚒',['Nomor pemadam kebakaran.','Telepon kalau ada kebakaran.']],
 ['119','Ambulans','🚑',['Nomor ambulans dan gawat darurat kesehatan.','Telepon kalau ada orang yang sakit parah atau terluka.']],
 ['129','SAPA, perlindungan anak','📞',['Layanan untuk melindungi anak dan perempuan.','Telepon kalau ada anak yang disakiti atau diganggu.']]
];
// Aman atau Bahaya?: [situation, safe? 1/0, picture, difficulty 1–3]
const JD_SCEN=[
 ['Memakai sabuk pengaman di mobil.',1,'🚗',1],['Memakai helm saat bersepeda.',1,'🚲',1],['Berenang ditemani orang dewasa.',1,'🏊',1],['Bermain bola di lapangan.',1,'⚽',1],
 ['Menyeberang di zebra cross sambil bergandengan dengan ayah.',1,'🚸',1],['Bercerita kepada ibu kalau ada yang membuatmu takut.',1,'👩',1],
 ['Ikut orang asing yang menawarkan mainan.',0,'🧸',1],['Bermain korek api.',0,'🔥',1],['Memasukkan jari ke colokan listrik.',0,'🔌',1],['Bermain di jalan raya.',0,'🚗',1],
 ['Memakan obat seperti permen.',0,'💊',1],['Memanjat lemari yang tinggi.',0,'🪟',1],
 ['Bilang tidak saat teman mengajak lompat dari tempat tinggi.',1,'🏢',2],['Menolak permen dari orang yang tidak dikenal.',1,'🍬',2],['Berganti baju di kamar yang tertutup.',1,'🚪',2],
 ['Meminta tolong kasir saat tersesat di mal.',1,'🏪',2],['Pamit kepada ibu sebelum bermain ke rumah teman.',1,'👋',2],['Menolak dicium kalau kamu tidak mau.',1,'🙅',2],
 ['Melompat dari lantai dua karena ditantang teman.',0,'🏢',2],['Main dokter-dokteran sambil membuka baju.',0,'🩺',2],['Membukakan pintu untuk orang yang tidak dikenal.',0,'🚪',2],
 ['Berenang sendirian di sungai.',0,'🌊',2],['Memegang anjing yang tidak dikenal.',0,'🐕',2],['Mengeluarkan kepala dari jendela mobil.',0,'🚗',2],['Meminum cairan pembersih.',0,'🧴',2],
 ['Bilang jangan saat ada yang menyentuh bagian pribadimu.',1,'🙅',3],['Menunggu di tempat bertemu saat terpisah dari orang tua.',1,'📍',3],['Menanyakan kata rahasia kepada orang yang mau menjemputmu.',1,'🔑',3],
 ['Menelepon satu satu dua saat ada kecelakaan.',1,'🆘',3],['Memanggil orang dewasa saat ada tamu yang tidak dikenal.',1,'🚪',3],
 ['Menyimpan rahasia yang membuatmu takut.',0,'🤫',3],['Memberi tahu alamat rumah kepada orang asing di internet.',0,'💻',3],['Pergi dengan orang yang tidak tahu kata rahasia keluarga.',0,'🔑',3],
 ['Bersembunyi di mal supaya orang tua bingung.',0,'🙈',3],['Mengirim foto tanpa baju kepada orang lain.',0,'📷',3],['Menelepon nomor darurat untuk bercanda.',0,'📞',3]
];
// Telepon Siapa?: [situation, number, picture, difficulty 1–3]
const JD_CALL=[
 ['Ada kebakaran! Telepon nomor berapa?','113','🔥',1],['Ada orang yang sakit parah. Telepon nomor berapa?','119','🤒',1],['Ada orang jahat. Telepon nomor berapa?','110','🚨',1],
 ['Nomor darurat untuk semua keadaan bahaya?','112','🆘',2],['Ada anak yang disakiti. Telepon nomor berapa?','129','🧒',2],['Rumah tetangga terbakar. Telepon nomor berapa?','113','🏠',2],
 ['Ada yang terjatuh dan terluka parah. Telepon nomor berapa?','119','🚑',2],['Ada pencuri di rumah. Telepon nomor berapa?','110','👮',2],
 ['Ada kecelakaan di jalan dan kamu tidak tahu nomor lain. Telepon nomor berapa?','112','🚗',3],['Temanmu sering dipukul di rumahnya. Telepon nomor berapa?','129','📞',3],
 ['Ada asap tebal keluar dari dapur. Telepon nomor berapa?','113','💨',3],['Ada orang yang tiba-tiba pingsan. Telepon nomor berapa?','119','🏥',3]
];
