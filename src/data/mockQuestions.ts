/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, Student, ClassRombel, ExamResult } from '../types/cbt';

export const DEFAULT_EXAM_TOKEN = 'PAI2026';

export const DEFAULT_6_ROMBEL: ClassRombel[] = [
  {
    id: 'rombel-1',
    code: 'VII-A',
    name: 'Kelas VII-A',
    tingkat: 'Kelas 7',
    isActive: true, // Default aktif
    token: 'PAI7A',
    examTitle: 'Asesmen PAI & Budi Pekerti - Kelas VII-A'
  },
  {
    id: 'rombel-2',
    code: 'VII-B',
    name: 'Kelas VII-B',
    tingkat: 'Kelas 7',
    isActive: true, // Default aktif
    token: 'PAI7B',
    examTitle: 'Asesmen PAI & Budi Pekerti - Kelas VII-B'
  },
  {
    id: 'rombel-3',
    code: 'VIII-A',
    name: 'Kelas VIII-A',
    tingkat: 'Kelas 8',
    isActive: false, // Default belum diaktifkan
    token: 'PAI8A',
    examTitle: 'Asesmen PAI & Budi Pekerti - Kelas VIII-A'
  },
  {
    id: 'rombel-4',
    code: 'VIII-B',
    name: 'Kelas VIII-B',
    tingkat: 'Kelas 8',
    isActive: false, // Default belum diaktifkan
    token: 'PAI8B',
    examTitle: 'Asesmen PAI & Budi Pekerti - Kelas VIII-B'
  },
  {
    id: 'rombel-5',
    code: 'IX-A',
    name: 'Kelas IX-A',
    tingkat: 'Kelas 9',
    isActive: true, // Default aktif
    token: 'PAI9A',
    examTitle: 'Asesmen Akhir Jenjang PAI & BP - Kelas IX-A'
  },
  {
    id: 'rombel-6',
    code: 'IX-B',
    name: 'Kelas IX-B',
    tingkat: 'Kelas 9',
    isActive: false, // Default belum diaktifkan
    token: 'PAI9B',
    examTitle: 'Asesmen Akhir Jenjang PAI & BP - Kelas IX-B'
  }
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'std-1',
    noPeserta: '24-PAI-07-001',
    nama: 'Ahmad Fauzi Rahman',
    nisn: '0075421980',
    sekolah: 'SMP Negeri 1 Prestasi',
    ruang: 'Lab Komputer 01 (Ruang PAI A)',
    sesi: 'Sesi 1 (Pagi)',
    fotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
    kelas: 'Kelas VII-A'
  },
  {
    id: 'std-2',
    noPeserta: '24-PAI-07-002',
    nama: 'Siti Nurhaliza Putri',
    nisn: '0082194532',
    sekolah: 'SMP Negeri 1 Prestasi',
    ruang: 'Lab Komputer 01 (Ruang PAI A)',
    sesi: 'Sesi 1 (Pagi)',
    fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    kelas: 'Kelas VII-B'
  },
  {
    id: 'std-3',
    noPeserta: '24-PAI-08-001',
    nama: 'Budi Santoso Wibowo',
    nisn: '0069812401',
    sekolah: 'SMP Negeri 1 Prestasi',
    ruang: 'Lab Multimedia 01',
    sesi: 'Sesi 2 (Siang)',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    kelas: 'Kelas VIII-A'
  },
  {
    id: 'std-4',
    noPeserta: '24-PAI-08-002',
    nama: 'Dewi Lestari Kusuma',
    nisn: '0076219842',
    sekolah: 'SMP Negeri 1 Prestasi',
    ruang: 'Lab Bahasa & CBT 02',
    sesi: 'Sesi 1 (Pagi)',
    fotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    kelas: 'Kelas VIII-B'
  },
  {
    id: 'std-5',
    noPeserta: '24-PAI-09-001',
    nama: 'Rian Hidayat Pratama',
    nisn: '0054321987',
    sekolah: 'SMP Negeri 1 Prestasi',
    ruang: 'Lab Komputer 01 (Ruang PAI A)',
    sesi: 'Sesi 2 (Siang)',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    kelas: 'Kelas IX-A'
  },
  {
    id: 'std-6',
    noPeserta: '24-PAI-09-002',
    nama: 'Putri Ayu Wandira',
    nisn: '0058765432',
    sekolah: 'SMP Negeri 1 Prestasi',
    ruang: 'Lab Multimedia 02',
    sesi: 'Sesi 1 (Pagi)',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    kelas: 'Kelas IX-B'
  }
];

export const MOCK_QUESTIONS: Question[] = [
  // 1. Al-Qur'an dan Hadis (Kelas VII-A dan VII-B)
  {
    id: 1,
    number: 1,
    subtest: "Al-Qur'an dan Hadis",
    type: 'pg',
    targetClasses: ['Kelas VII-A', 'Kelas VII-B'],
    targetClass: 'Kelas VII-A, Kelas VII-B',
    stimulusTitle: 'Stimulus 1: Hukum Tajwid Al-Qur’an (Q.S. Al-Anbiya: 30)',
    stimulus: 'Perhatikan potongan ayat berikut ini:\n"أَوَلَمْ يَرَ ٱلَّذِينَ كَفَرُوٓا۟ أَنَّ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ كَانَتَا رَتْقًۭا فَفَتَقْنَـٰهُمَا..."\nPada kalimat "رَتْقًا فَفَتَقْنَـٰهُمَا", terdapat tanda baca tanwin (fat-hatain) bertemu dengan huruf fa (ف).',
    questionText: 'Berdasarkan kaidah ilmu tajwid, hukum bacaan yang terjadi pada lafal "رَتْقًا فَفَتَقْنَـٰهُمَا" dan cara membacanya yang tepat adalah...',
    options: [
      { key: 'A', text: 'Ikhfa Haqiqi, dibaca samar disertai dengung (ghunnah)' },
      { key: 'B', text: 'Izhar Halqi, dibaca jelas dan terang tanpa dengung' },
      { key: 'C', text: 'Idgham Bighunnah, dileburkan ke huruf fa dengan dengung' },
      { key: 'D', text: 'Iqlab, bunyi tanwin diubah menjadi bunyi mim sukun' }
    ],
    correctAnswer: 'A',
    difficulty: 'Sedang',
    points: 4,
    explanation: 'Tanwin (fat-hatain) bertemu dengan salah satu huruf ikhfa haqiqi yaitu fa (ف). Cara membacanya adalah disamarkan antara izhar dan idgham disertai dengung (ghunnah) sepanjang 2 harakat.'
  },

  // 2. Akidah - Asmaul Husna (Kelas VII-A dan VII-B)
  {
    id: 2,
    number: 2,
    subtest: 'Akidah',
    type: 'pg',
    targetClasses: ['Kelas VII-A', 'Kelas VII-B'],
    targetClass: 'Kelas VII-A, Kelas VII-B',
    stimulusTitle: 'Stimulus 2: Meneladani Asmaul Husna dalam Kehidupan',
    stimulus: 'Zaidan selalu berhati-hati dalam bertutur kata dan bersikap, baik ketika sedang bersama teman-temannya maupun saat sendirian di dalam kamar. Ia yakin bahwa Allah Swt. mengetahui bisikan hati yang paling tersembunyi dan melihat seluruh gerak-gerik makhluk-Nya tanpa ada yang luput sedikit pun.',
    questionText: 'Perilaku yang dicerminkan oleh Zaidan merupakan bentuk pengamalan terhadap Asmaul Husna...',
    options: [
      { key: 'A', text: 'Al-Khabir (Maha Teliti) dan Al-Bashir (Maha Melihat)' },
      { key: 'B', text: 'Al-Ghaffar (Maha Pengampun) dan Al-Karim (Maha Mulia)' },
      { key: 'C', text: 'Al-Malik (Maha Merajai) dan Al-Quddus (Maha Suci)' },
      { key: 'D', text: 'Ar-Rahman (Maha Pengasih) dan Ar-Rahim (Maha Penyayang)' }
    ],
    correctAnswer: 'A',
    difficulty: 'Mudah',
    points: 4,
    explanation: 'Al-Khabir bermakna Allah Maha Waspada/Maha Teliti mengetahui segala rahasia hati, sedangkan Al-Bashir bermakna Allah Maha Melihat segala perbuatan makhluk-Nya.'
  },

  // 3. Akhlak - Budi Pekerti (SEMUA)
  {
    id: 3,
    number: 3,
    subtest: 'Akhlak',
    type: 'pg',
    targetClasses: ['SEMUA'],
    targetClass: 'SEMUA',
    stimulusTitle: 'Stimulus 3: Studi Kasus Amanah dan Kejujuran',
    stimulus: 'Rina menemukan dompet berisi sejumlah uang dan kartu identitas di kantin sekolah. Meskipun ia sedang membutuhkan uang saku tambahan, Rina segera menyerahkan dompet tersebut kepada guru piket agar diumumkan dan dikembalikan kepada pemilik aslinya.',
    questionText: 'Nilai budi pekerti luhur utama yang ditunjukkan oleh tindakan Rina adalah...',
    options: [
      { key: 'A', text: 'Amanah dan kejujuran (ash-shidqu)' },
      { key: 'B', text: 'Optimis dan pantang menyerah (raja\')' },
      { key: 'C', text: 'Tawadhu dan rendah hati' },
      { key: 'D', text: 'Qana\'ah dan rela berkorban' }
    ],
    correctAnswer: 'A',
    difficulty: 'Mudah',
    points: 4,
    explanation: 'Mengembalikan barang temuan kepada pemiliknya tanpa mengambil hak orang lain adalah manifestasi nyata dari sifat amanah (dapat dipercaya) dan jujur (ash-shidqu).'
  },

  // 4. Fikih - Shalat Jamak & Qashar (Kelas VII-A dan VII-B)
  {
    id: 4,
    number: 4,
    subtest: 'Fikih',
    type: 'pg',
    targetClasses: ['Kelas VII-A', 'Kelas VII-B'],
    targetClass: 'Kelas VII-A, Kelas VII-B',
    stimulusTitle: 'Stimulus 4: Keringanan Ibadah bagi Musafir (Rukhshah)',
    stimulus: 'Faris bersama keluarganya bepergian dari Jakarta menuju Surabaya dengan jarak tempuh sekitar 780 km. Mereka berangkat pukul 08.00 WIB. Saat waktu Dzuhur tiba, Faris melaksanakan shalat Dzuhur 2 rakaat dilanjutkan shalat Ashar 2 rakaat yang dikerjakan pada waktu Dzuhur.',
    questionText: 'Tata cara shalat yang dilaksanakan oleh Faris tersebut dinamakan shalat...',
    options: [
      { key: 'A', text: 'Jamak Taqdim Qashar' },
      { key: 'B', text: 'Jamak Ta\'khir Qashar' },
      { key: 'C', text: 'Shalat Qashar saja' },
      { key: 'D', text: 'Shalat Khauf dan Jamak' }
    ],
    correctAnswer: 'A',
    difficulty: 'Sedang',
    points: 4,
    explanation: 'Menggabungkan shalat Dzuhur dan Ashar di waktu pertama (Dzuhur) disebut Jamak Taqdim, dan meringkas shalat 4 rakaat menjadi 2 rakaat disebut Qashar. Maka dinamakan Jamak Taqdim Qashar.'
  },

  // 5. Sejarah Peradaban Islam (SPI) - Khulafaur Rasyidin (SEMUA)
  {
    id: 5,
    number: 5,
    subtest: 'Sejarah Peradaban Islam (SPI)',
    type: 'pg',
    targetClasses: ['SEMUA'],
    targetClass: 'SEMUA',
    stimulusTitle: 'Stimulus 5: Kodifikasi Al-Qur’an di Era Sahabat',
    stimulus: 'Setelah terjadinya Perang Yamamah yang mengakibatkan gugurnya puluhan sahabat penghafal Al-Qur’an (huffadz), Umar bin Khattab r.a. mengusulkan kepada Khalifah Abu Bakar Ash-Shiddiq r.a. untuk mengumpulkan dan membukukan lembaran-lembaran Al-Qur’an agar tidak hilang atau musnah.',
    questionText: 'Sahabat Nabi yang ditunjuk sebagai ketua tim penyusunan dan pengumpulan mushaf Al-Qur’an pada masa Khalifah Abu Bakar Ash-Shiddiq r.a. adalah...',
    options: [
      { key: 'A', text: 'Zaid bin Tsabit r.a.' },
      { key: 'B', text: 'Abdullah bin Mas\'ud r.a.' },
      { key: 'C', text: 'Ali bin Abi Thalib r.a.' },
      { key: 'D', text: 'Utsman bin Affan r.a.' }
    ],
    correctAnswer: 'A',
    difficulty: 'Sedang',
    points: 4,
    explanation: 'Khalifah Abu Bakar menunjuk Zaid bin Tsabit r.a. karena ia merupakan sekretaris wahyu Rasulullah saw., memiliki hafalan yang kuat, cerdas, dan teliti dalam verifikasi tulisan wahyu.'
  },

  // 6. PG Kompleks (PGK) - Al-Qur'an dan Hadis (Kelas VII-A dan VII-B)
  {
    id: 6,
    number: 6,
    subtest: "Al-Qur'an dan Hadis",
    type: 'pgk',
    targetClasses: ['Kelas VII-A', 'Kelas VII-B'],
    targetClass: 'Kelas VII-A, Kelas VII-B',
    stimulusTitle: 'Stimulus 6: Kandungan Q.S. Al-Hujurat Ayat 13 tentang Keberagaman',
    stimulus: 'Allah Swt. berfirman: "Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal. Sungguh, yang paling mulia di antara kamu di sisi Allah ialah orang yang paling bertakwa..." (Q.S. Al-Hujurat: 13)',
    questionText: 'Manakah dari pernyataan-pernyataan berikut yang mencerminkan pesan utama dari Q.S. Al-Hujurat ayat 13? (Pilihlah 2 atau 3 jawaban yang benar)',
    options: [
      { key: 'A', text: 'Perbedaan suku, bangsa, dan ras merupakan ketetapan (sunnatullah) untuk saling mengenal dan bersinergi' },
      { key: 'B', text: 'Tolak ukur kemuliaan seseorang di sisi Allah adalah ketakwaan, bukan keturunan, harta, atau status sosial' },
      { key: 'C', text: 'Umat Islam dianjurkan menjauhi interaksi dengan kaum yang berbeda latar belakang suku dan bahasa' },
      { key: 'D', text: 'Menghargai keberagaman budaya dan memupuk sikap moderasi beragama dalam kehidupan bermasyarakat' }
    ],
    correctAnswer: ['A', 'B', 'D'],
    difficulty: 'HOTS / Sulit',
    points: 4,
    explanation: 'Opsi A, B, dan D adalah intisari dari Q.S. Al-Hujurat: 13 tentang tujuan penciptaan keberagaman (li-ta\'arafu), derajat takwa sebagai standar kemuliaan, dan sikap toleransi/tasamuh.'
  },

  // 7. PG Kompleks (PGK) - Fikih Makanan Halal & Thayyib (Kelas VIII-A dan VIII-B)
  {
    id: 7,
    number: 7,
    subtest: 'Fikih',
    type: 'pgk',
    targetClasses: ['Kelas VIII-A', 'Kelas VIII-B'],
    targetClass: 'Kelas VIII-A, Kelas VIII-B',
    stimulusTitle: 'Stimulus 7: Kriteria Makanan Halal dan Thayyib dalam Islam',
    stimulus: 'Islam memerintahkan umatnya untuk mengonsumsi makanan yang halal (sah secara syar\'i) dan thayyib (baik, bergizi, bersih, serta aman untuk kesehatan fisik dan akal pikiran).',
    questionText: 'Pilihlah syarat dan kriteria makanan yang memenuhi prinsip "Halalan Thayyiban" menurut syariat Islam: (Pilihlah 2 atau 3 jawaban yang benar)',
    options: [
      { key: 'A', text: 'Halal zatnya (bukan bangkai, darah mengalir, atau daging babi)' },
      { key: 'B', text: 'Halal cara memperolehnya (bukan hasil mencuri, korupsi, atau menipu)' },
      { key: 'C', text: 'Boleh dikonsumsi meskipun menimbulkan efek mabuk dan merusak akal jika dalam porsi sedikit' },
      { key: 'D', text: 'Thayyib bagi tubuh (mengandung nutrisi baik, higienis, dan tidak mendatangkan mudarat bagi kesehatan)' }
    ],
    correctAnswer: ['A', 'B', 'D'],
    difficulty: 'Sedang',
    points: 4,
    explanation: 'Kriteria makanan halal mencakup halal zat (A), halal cara memperoleh (B), dan thayyib/sehat serta tidak membahayakan (D). Segala yang memabukkan hukumnya haram walau sedikit (C salah).'
  },

  // 8. PG Kompleks (PGK) - Akidah Iman kepada Hari Akhir (Kelas IX-A dan IX-B)
  {
    id: 8,
    number: 8,
    subtest: 'Akidah',
    type: 'pgk',
    targetClasses: ['Kelas IX-A', 'Kelas IX-B'],
    targetClass: 'Kelas IX-A, Kelas IX-B',
    stimulusTitle: 'Stimulus 8: Dampak Positif Beriman kepada Hari Akhir',
    stimulus: 'Keyakinan bahwa kehidupan dunia ini fana dan kelak setiap perbuatan manusia akan dipertanggungjawabkan di hadapan Allah Swt. pada Yaumul Hisab memberikan pengaruh mendalam bagi akhlak seorang mukmin.',
    questionText: 'Manakah di antara perilaku berikut yang merupakan buah/hikmah dari beriman kepada Hari Kiamat? (Pilihlah 2 atau 3 jawaban yang benar)',
    options: [
      { key: 'A', text: 'Senantiasa mawas diri (muhasabah) dan berhati-hati agar tidak terjerumus dalam kemaksiatan' },
      { key: 'B', text: 'Termotivasi untuk memperbanyak amal kebajikan dan infaq kebaikan secara ikhlas' },
      { key: 'C', text: 'Menghabiskan seluruh harta untuk kesenangan duniawi mumpung masih hidup di dunia' },
      { key: 'D', text: 'Memiliki ketenangan jiwa dan optimisme dalam menghadapi ujian hidup karena percaya akan keadilan Allah' }
    ],
    correctAnswer: ['A', 'B', 'D'],
    difficulty: 'Sedang',
    points: 4,
    explanation: 'Hikmah iman kepada Hari Akhir meliputi muhasabah diri (A), semangat beramal shaleh (B), dan ketenteraman batin karena kepastian balasan adil Allah (D).'
  },

  // 9. Benar / Salah (B/S) - Rukun dan Syarat Thaharah (Kelas VII-A dan VII-B)
  {
    id: 9,
    number: 9,
    subtest: 'Fikih',
    type: 'bs',
    targetClasses: ['Kelas VII-A', 'Kelas VII-B'],
    targetClass: 'Kelas VII-A, Kelas VII-B',
    stimulusTitle: 'Stimulus 9: Tata Cara Bersuci dari Hadats (Thaharah)',
    stimulus: 'Bersuci dari hadats kecil dilakukan dengan wudhu atau tayamum (jika ada uzur), sedangkan bersuci dari hadats besar dilakukan dengan mandi wajib.',
    questionText: 'Tentukanlah kebenaran dari setiap pernyataan berikut mengenai ketentuan Thaharah (Bersuci):',
    statements: [
      {
        id: 's1',
        text: 'Membasuh kedua telapak tangan dan berkumur-kumur merupakan rukun wudhu yang wajib dipenuhi, jika ditinggalkan wudhu tidak sah.',
        correctAnswer: 'S'
      },
      {
        id: 's2',
        text: 'Niat dan meratakan air ke seluruh permukaan tubuh termasuk rambut dan kulit merupakan rukun dari mandi wajib.',
        correctAnswer: 'B'
      },
      {
        id: 's3',
        text: 'Tayamum dengan debu yang suci diperbolehkan apabila seseorang dalam keadaan sakit parah yang membahayakan jika terkena air.',
        correctAnswer: 'B'
      }
    ],
    correctAnswer: 'S,B,B',
    difficulty: 'Sedang',
    points: 4,
    explanation: 'Pernyataan 1 Salah karena berkumur dan membasuh tangan adalah sunnah wudhu, bukan rukun. Pernyataan 2 Benar (rukun mandi wajib: niat dan meratakan air). Pernyataan 3 Benar (uzur syar\'i tayamum).'
  },

  // 10. Benar / Salah (B/S) - Sejarah Masuknya Islam ke Nusantara (Kelas IX-A dan IX-B)
  {
    id: 10,
    number: 10,
    subtest: 'Sejarah Peradaban Islam (SPI)',
    type: 'bs',
    targetClasses: ['Kelas IX-A', 'Kelas IX-B'],
    targetClass: 'Kelas IX-A, Kelas IX-B',
    stimulusTitle: 'Stimulus 10: Islamisasi Nusantara secara Damai',
    stimulus: 'Masuk dan berkembangnya agama Islam di kepulauan Nusantara berlangsung melalui jalur perdagangan, perkawinan, pendidikan pesantren, dan kesenian dakwah secara damai tanpa invasi militer.',
    questionText: 'Tentukanlah kebenaran dari setiap pernyataan berikut mengenai Sejarah Peradaban Islam di Nusantara:',
    statements: [
      {
        id: 's1',
        text: 'Sunan Kalijaga menggunakan media wayang kulit dan tembang gamelan sebagai sarana dakwah menyebarkan ajaran Islam di tanah Jawa.',
        correctAnswer: 'B'
      },
      {
        id: 's2',
        text: 'Kerajaan Samudera Pasai di Aceh merupakan kerajaan Islam pertama di kepulauan Nusantara yang tercatat dalam sejarah.',
        correctAnswer: 'B'
      },
      {
        id: 's3',
        text: 'Penyebaran Islam di Nusantara dilakukan secara paksa melalui penaklukan militer terhadap kerajaan-kerajaan Hindu-Buddha.',
        correctAnswer: 'S'
      }
    ],
    correctAnswer: 'B,B,S',
    difficulty: 'Mudah',
    points: 4,
    explanation: 'Sunan Kalijaga berdakwah melalui akulturasi budaya wayang (B). Samudera Pasai adalah kesultanan Islam pertama (B). Islam masuk secara damai dan toleran, bukan penaklukan militer (S).'
  },

  // 11. Menjodohkan - Kitab-Kitab Allah & Nabi Penerimanya (SEMUA)
  {
    id: 11,
    number: 11,
    subtest: 'Akidah',
    type: 'menjodohkan',
    targetClasses: ['SEMUA'],
    targetClass: 'SEMUA',
    stimulusTitle: 'Stimulus 11: Beriman kepada Kitab-Kitab Suci Allah',
    stimulus: 'Sebagai rukun iman yang ketiga, umat Islam wajib meyakini bahwa Allah Swt. menurunkan kitab-kitab suci kepada para nabi dan rasul pilihan sebagai pedoman hidup umat manusia.',
    questionText: 'Pasangkanlah setiap nama Kitab Suci berikut dengan Rasul penerimanya yang tepat:',
    matchingPremises: [
      { id: 'k1', premise: 'Kitab Taurat', correctMatch: 'Nabi Musa a.s.' },
      { id: 'k2', premise: 'Kitab Zabur', correctMatch: 'Nabi Daud a.s.' },
      { id: 'k3', premise: 'Kitab Injil', correctMatch: 'Nabi Isa a.s.' },
      { id: 'k4', premise: 'Kitab Al-Qur’an', correctMatch: 'Nabi Muhammad saw.' }
    ],
    matchingChoices: [
      'Nabi Musa a.s.',
      'Nabi Daud a.s.',
      'Nabi Isa a.s.',
      'Nabi Muhammad saw.',
      'Nabi Ibrahim a.s.'
    ],
    correctAnswer: 'k1:Nabi Musa a.s.,k2:Nabi Daud a.s.,k3:Nabi Isa a.s.,k4:Nabi Muhammad saw.',
    difficulty: 'Mudah',
    points: 4,
    explanation: 'Taurat kepada Nabi Musa a.s., Zabur kepada Nabi Daud a.s., Injil kepada Nabi Isa a.s., dan Al-Qur\'an disempurnakan kepada Nabi Muhammad saw.'
  },

  // 12. Menjodohkan - Fikih Ibadah Zakat dan Ketentuannya (Kelas VIII-A dan VIII-B)
  {
    id: 12,
    number: 12,
    subtest: 'Fikih',
    type: 'menjodohkan',
    targetClasses: ['Kelas VIII-A', 'Kelas VIII-B'],
    targetClass: 'Kelas VIII-A, Kelas VIII-B',
    stimulusTitle: 'Stimulus 12: Pengelolaan dan Istilah Seputar Zakat',
    stimulus: 'Zakat merupakan rukun Islam keempat yang memiliki fungsi ibadah spiritual sekaligus jaminan keadilan sosial ekonomi bagi kaum dhuafa.',
    questionText: 'Pasangkanlah setiap istilah zakat di Kolom Kiri dengan pengertian syar’i yang bersesuaian di Kolom Kanan:',
    matchingPremises: [
      { id: 'z1', premise: 'Nisab Zakat', correctMatch: 'Batas minimal jumlah harta yang wajib dikeluarkan zakatnya' },
      { id: 'z2', premise: 'Haul', correctMatch: 'Masa kepemilikan harta yang telah mencapai jangka waktu 1 tahun hijriah' },
      { id: 'z3', premise: 'Muzakki', correctMatch: 'Orang yang berkewajiban membayarkan zakat' },
      { id: 'z4', premise: 'Mustahiq', correctMatch: 'Golongan orang yang berhak menerima penyaluran zakat (8 asnaf)' }
    ],
    matchingChoices: [
      'Batas minimal jumlah harta yang wajib dikeluarkan zakatnya',
      'Masa kepemilikan harta yang telah mencapai jangka waktu 1 tahun hijriah',
      'Orang yang berkewajiban membayarkan zakat',
      'Golongan orang yang berhak menerima penyaluran zakat (8 asnaf)',
      'Pengurus amil zakat tingkat kecamatan'
    ],
    correctAnswer: 'z1:Batas minimal jumlah harta yang wajib dikeluarkan zakatnya,z2:Masa kepemilikan harta yang telah mencapai jangka waktu 1 tahun hijriah,z3:Orang yang berkewajiban membayarkan zakat,z4:Golongan orang yang berhak menerima penyaluran zakat (8 asnaf)',
    difficulty: 'Sedang',
    points: 4,
    explanation: 'Nisab adalah kadar minimal harta; Haul adalah batas waktu 1 tahun; Muzakki adalah pembayar zakat; Mustahiq adalah 8 golongan penerima zakat.'
  }
];

export const MOCK_EXAM_INFO = {
  id: 'EXAM-PAI-BP-2026',
  title: 'CBT ASESMEN PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI (PAI & BP)',
  subtitle: 'Pusat Asesmen & Ujian Berbasis Komputer Mata Pelajaran PAI & BP SMP',
  sessionName: 'Sesi Ujian Semester & Sumatif PAI & BP 2026',
  durationMinutes: 60,
  minutesPerQuestion: 5,
  subtests: [
    "Al-Qur'an dan Hadis",
    'Akidah',
    'Akhlak',
    'Fikih',
    'Sejarah Peradaban Islam (SPI)'
  ]
};

export const INITIAL_STUDENT_RESULTS: ExamResult[] = [
  {
    examId: 'EXAM-PAI-BP-2026',
    examTitle: 'CBT ASESMEN PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI (PAI & BP)',
    student: MOCK_STUDENTS[0], // Ahmad Zaki Maulana (Kelas VII-A)
    startTime: Date.now() - 3600000 * 3,
    endTime: Date.now() - 3600000 * 2.3,
    durationSecondsUsed: 2520, // 42 menit
    totalQuestions: 15,
    correctCount: 14,
    wrongCount: 1,
    unansweredCount: 0,
    doubtfulCount: 1,
    rawScore: 93,
    maxPoints: 100,
    scaleScore: 851,
    percentage: 93,
    isPassed: true,
    subtestScores: [
      { subtest: "Al-Qur'an dan Hadis", correct: 3, total: 3, score: 100 },
      { subtest: 'Akidah', correct: 3, total: 3, score: 100 },
      { subtest: 'Akhlak', correct: 3, total: 3, score: 100 },
      { subtest: 'Fikih', correct: 3, total: 3, score: 100 },
      { subtest: 'Sejarah Peradaban Islam (SPI)', correct: 2, total: 3, score: 67 }
    ],
    answers: {}
  },
  {
    examId: 'EXAM-PAI-BP-2026',
    examTitle: 'CBT ASESMEN PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI (PAI & BP)',
    student: MOCK_STUDENTS[1], // Siti Nurhaliza (Kelas VII-B)
    startTime: Date.now() - 3600000 * 5,
    endTime: Date.now() - 3600000 * 4.2,
    durationSecondsUsed: 2880, // 48 menit
    totalQuestions: 15,
    correctCount: 13,
    wrongCount: 2,
    unansweredCount: 0,
    doubtfulCount: 0,
    rawScore: 87,
    maxPoints: 100,
    scaleScore: 809,
    percentage: 87,
    isPassed: true,
    subtestScores: [
      { subtest: "Al-Qur'an dan Hadis", correct: 3, total: 3, score: 100 },
      { subtest: 'Akidah', correct: 2, total: 3, score: 67 },
      { subtest: 'Akhlak', correct: 3, total: 3, score: 100 },
      { subtest: 'Fikih', correct: 3, total: 3, score: 100 },
      { subtest: 'Sejarah Peradaban Islam (SPI)', correct: 2, total: 3, score: 67 }
    ],
    answers: {}
  },
  {
    examId: 'EXAM-PAI-BP-2026',
    examTitle: 'CBT ASESMEN PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI (PAI & BP)',
    student: MOCK_STUDENTS[2], // Muhammad Raihan (Kelas VIII-A)
    startTime: Date.now() - 3600000 * 6,
    endTime: Date.now() - 3600000 * 5.4,
    durationSecondsUsed: 2160, // 36 menit
    totalQuestions: 15,
    correctCount: 11,
    wrongCount: 4,
    unansweredCount: 0,
    doubtfulCount: 2,
    rawScore: 73,
    maxPoints: 100,
    scaleScore: 711,
    percentage: 73,
    isPassed: true,
    subtestScores: [
      { subtest: "Al-Qur'an dan Hadis", correct: 2, total: 3, score: 67 },
      { subtest: 'Akidah', correct: 2, total: 3, score: 67 },
      { subtest: 'Akhlak', correct: 3, total: 3, score: 100 },
      { subtest: 'Fikih', correct: 2, total: 3, score: 67 },
      { subtest: 'Sejarah Peradaban Islam (SPI)', correct: 2, total: 3, score: 67 }
    ],
    answers: {}
  },
  {
    examId: 'EXAM-PAI-BP-2026',
    examTitle: 'CBT ASESMEN PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI (PAI & BP)',
    student: MOCK_STUDENTS[3], // Dewi Lestari Kusuma (Kelas VIII-B)
    startTime: Date.now() - 3600000 * 7,
    endTime: Date.now() - 3600000 * 6.2,
    durationSecondsUsed: 2700, // 45 menit
    totalQuestions: 15,
    correctCount: 9,
    wrongCount: 6,
    unansweredCount: 0,
    doubtfulCount: 1,
    rawScore: 60,
    maxPoints: 100,
    scaleScore: 620,
    percentage: 60,
    isPassed: false, // Perlu Remedial (< 65%)
    subtestScores: [
      { subtest: "Al-Qur'an dan Hadis", correct: 2, total: 3, score: 67 },
      { subtest: 'Akidah', correct: 2, total: 3, score: 67 },
      { subtest: 'Akhlak', correct: 2, total: 3, score: 67 },
      { subtest: 'Fikih', correct: 2, total: 3, score: 67 },
      { subtest: 'Sejarah Peradaban Islam (SPI)', correct: 1, total: 3, score: 33 }
    ],
    answers: {}
  },
  {
    examId: 'EXAM-PAI-BP-2026',
    examTitle: 'CBT ASESMEN PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI (PAI & BP)',
    student: MOCK_STUDENTS[4], // Rian Hidayat Pratama (Kelas IX-A)
    startTime: Date.now() - 3600000 * 2,
    endTime: Date.now() - 3600000 * 1.3,
    durationSecondsUsed: 2460, // 41 menit
    totalQuestions: 15,
    correctCount: 15,
    wrongCount: 0,
    unansweredCount: 0,
    doubtfulCount: 0,
    rawScore: 100,
    maxPoints: 100,
    scaleScore: 900,
    percentage: 100,
    isPassed: true,
    subtestScores: [
      { subtest: "Al-Qur'an dan Hadis", correct: 3, total: 3, score: 100 },
      { subtest: 'Akidah', correct: 3, total: 3, score: 100 },
      { subtest: 'Akhlak', correct: 3, total: 3, score: 100 },
      { subtest: 'Fikih', correct: 3, total: 3, score: 100 },
      { subtest: 'Sejarah Peradaban Islam (SPI)', correct: 3, total: 3, score: 100 }
    ],
    answers: {}
  }
];
