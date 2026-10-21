/* ============ Perasaanku: feelings cards (Jaga Diri) + Tebak Perasaan situations ============ */
// feelings used by the game: key, picture
const FEELS={senang:'😊',sedih:'😢',marah:'😠',takut:'😨',kaget:'😲',malu:'😳',khawatir:'😟',bangga:'🥳'};
JD_CATS.push({id:'jd-perasaan',title:'Perasaanku',c:'rose',art:'😊😢😠',items:[
  ['Semua boleh','Semua perasaan boleh dirasakan.','😊|😢|😠',['Senang, sedih, marah, dan takut, semuanya boleh.','Yang penting, kita tidak menyakiti diri sendiri dan orang lain.','Ceritakan perasaanmu kepada orang yang kamu sayang.'],'tip'],
  ['Senang','Aku merasa senang.','😊',['Senang itu saat hati terasa hangat dan ingin tersenyum.','Misalnya saat bermain bersama teman.','Ceritakan hal yang membuatmu senang kepada ayah atau ibu.'],'tip'],
  ['Sedih','Aku merasa sedih.','😢',['Sedih itu saat ingin menangis.','Misalnya saat mainan rusak atau teman pindah rumah.','Boleh menangis. Minta dipeluk orang yang kamu sayang.'],'tip'],
  ['Marah','Aku merasa marah.','😠',['Marah itu saat badan terasa panas dan ingin berteriak.','Boleh marah, tetapi tidak boleh memukul atau merusak barang.','Tarik napas pelan-pelan, lalu katakan: aku marah.'],'tip'],
  ['Takut','Aku merasa takut.','😨',['Takut itu saat jantung berdebar kencang.','Misalnya saat gelap atau ada suara keras.','Datangi orang dewasa yang kamu percaya, lalu ceritakan.'],'tip'],
  ['Kaget','Aku merasa kaget.','😲',['Kaget itu saat sesuatu terjadi tiba-tiba.','Misalnya ada balon yang meletus.','Tarik napas, sebentar lagi kagetnya hilang.'],'tip'],
  ['Malu','Aku merasa malu.','😳',['Malu itu saat pipi terasa panas dan ingin bersembunyi.','Misalnya saat bertemu orang baru.','Tidak apa-apa. Pelan-pelan saja, kamu pasti bisa.'],'tip'],
  ['Khawatir','Aku merasa khawatir.','😟',['Khawatir itu saat memikirkan sesuatu yang belum terjadi.','Misalnya besok mau ke dokter gigi.','Ceritakan kepada orang tua supaya hatimu lebih tenang.'],'tip'],
  ['Bangga','Aku merasa bangga.','🥳',['Bangga itu saat kamu berhasil karena sudah berusaha.','Misalnya saat bisa naik sepeda sendiri.','Kamu boleh bangga pada dirimu sendiri.'],'tip'],
  ['Napas balon','Kalau hati tidak tenang, tarik napas seperti meniup balon.','🎈',['Tarik napas pelan-pelan lewat hidung.','Lalu tiup pelan-pelan lewat mulut, seperti meniup balon.','Ulangi tiga kali.'],'ok'],
  ['Hitung pelan','Hitung pelan-pelan sampai sepuluh.','🔟',['Saat marah, berhenti dulu.','Hitung pelan-pelan: satu, dua, tiga, sampai sepuluh.','Sesudah itu, katakan apa yang kamu rasakan.'],'ok'],
  ['Minta peluk','Minta pelukan dari orang yang kamu sayang.','🤗',['Pelukan membuat hati lebih tenang.','Kamu juga bisa memeluk boneka kesayanganmu.'],'ok'],
  ['Ceritakan','Katakan perasaanmu dengan kata-kata.','🗣️',['Katakan: aku sedih karena mainanku rusak.','Atau: aku marah karena gambarku dicoret.','Dengan bercerita, orang lain bisa membantumu.'],'ok']]});
// Tebak Perasaan: [situation, feeling, difficulty 1–3, other feelings that would also be right (never offered as wrong)]
const FEEL_Q=[
 ['Kamu dapat hadiah ulang tahun.','senang',1],['Es krimmu jatuh ke tanah.','sedih',1,['marah']],['Mainanmu direbut teman tanpa izin.','marah',1,['sedih']],
 ['Lampu tiba-tiba mati saat malam.','takut',1,['kaget','khawatir']],['Ada balon meletus di dekatmu.','kaget',1,['takut']],['Kamu bermain di taman bersama ayah.','senang',1],
 ['Kucing kesayanganmu sakit.','sedih',1,['khawatir']],['Ada anjing besar menggonggong keras kepadamu.','takut',1,['kaget']],['Temanmu sengaja mencoret gambarmu.','marah',1,['sedih']],
 ['Kamu bisa naik sepeda sendiri untuk pertama kali.','bangga',1,['senang']],['Teman-teman tertawa saat kamu salah menyanyi.','malu',1,['sedih']],['Besok kamu harus ke dokter gigi.','khawatir',1,['takut']],
 ['Sahabatmu pindah ke kota lain.','sedih',2],['Kamu berhasil menyusun puzzle yang sulit.','bangga',2,['senang']],['Adik merusak menara balokmu.','marah',2,['sedih']],
 ['Ada suara petir yang sangat keras.','kaget',2,['takut']],['Kamu harus bernyanyi sendirian di depan banyak orang.','malu',2,['khawatir','takut']],['Ibu belum pulang padahal sudah malam.','khawatir',2,['takut','sedih']],
 ['Nenek datang berkunjung membawa kue.','senang',2],['Kamu terpisah dari ibu di pasar yang ramai.','takut',2,['khawatir','sedih']],['Kamu kalah lomba lari.','sedih',2],
 ['Temanmu menyerobot antrean di depanmu.','marah',2],['Bu guru memuji gambarmu di depan kelas.','bangga',2,['senang','malu']],['Kamu lupa membawa tugas sekolah.','khawatir',2,['takut','sedih']],
 ['Ada yang tiba-tiba menepuk punggungmu dari belakang.','kaget',2,['takut']],['Kamu salah memanggil nama orang yang baru dikenal.','malu',2],
 ['Kamu menunggu hasil lomba menggambar.','khawatir',3,['takut']],['Bajumu terbalik dan teman-teman melihatnya.','malu',3],['Kamu menolong nenek menyeberang jalan.','bangga',3,['senang']],
 ['Liburanmu batal karena ayah harus bekerja.','sedih',3,['marah']],['Temanmu terus mengejek namamu.','marah',3,['sedih']],['Kamu mendengar suara aneh dari luar jendela saat malam.','takut',3,['kaget','khawatir']],
 ['Kakak membuat pesta kejutan untukmu.','kaget',3,['senang']],['Kamu mendapat nilai bagus setelah belajar keras.','bangga',3,['senang']],['Adikmu demam dan harus ke dokter.','khawatir',3,['sedih','takut']],
 ['Kamu tidak sengaja memecahkan gelas di rumah teman.','malu',3,['takut','sedih','khawatir']],['Teman baru mengajakmu bermain bersama.','senang',3],['Kamu dituduh mengambil pensil padahal tidak.','marah',3,['sedih']],
 ['Ikan peliharaanmu mati.','sedih',3],['Pintu kamar tiba-tiba tertutup keras karena angin.','kaget',3,['takut']]
];
