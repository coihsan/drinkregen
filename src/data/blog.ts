// Editorial content shared by the blog index and statically generated articles.
export const posts = [
  {
    slug: "jeda-kecil-di-tengah-hari",
    title: "Hari boleh padat. Jeda jangan lewat.",
    category: "Keseharian",
    excerpt: "Dari meja kerja sampai perjalanan pulang, selalu ada ruang untuk menikmati momen kecil yang kamu suka.",
    image: "/300ml/lemonlime.webp",
    imageAlt: "Botol REGEN Lemon Lime 300ml",
    tone: "lime",
    label: "TAKE A BREAK.",
    sections: [
      { heading: "Beri ruang di antara kesibukan", text: "Ada hari ketika daftar pekerjaan terasa nggak ada habisnya. Satu tugas selesai, pesan baru masuk. Di sela ritme itu, kamu boleh mengambil jeda: menutup tab yang tidak dipakai, merapikan meja, atau sekadar melihat keluar jendela. Jeda kecil nggak harus menunggu semua urusan selesai." },
      { heading: "Buat ritual yang sederhana", text: "Pilih satu hal yang kamu nikmati dan mudah dilakukan. Putar satu lagu favorit, pindah sebentar dari kursi kerja, atau siapkan minuman pilihanmu. Nggak perlu ritual yang rumit. Yang penting, momen itu terasa seperti waktu untuk diri sendiri." },
      { heading: "Nikmati tanpa terburu-buru", text: "Coba letakkan ponsel selama beberapa menit. Perhatikan suasana di sekitarmu dan nikmati jeda tanpa perlu mengisinya dengan daftar tugas baru. Kalau kamu memilih REGEN sebagai teman jeda, sajikan sesuai selera dan simpan mengikuti petunjuk pada kemasan." },
      { heading: "Lanjut dengan ritmemu", text: "Setelah jeda, pilih satu hal yang ingin dikerjakan berikutnya. Hari yang menyenangkan nggak selalu berarti semua rencana berjalan sempurna. Kadang, cukup ada sedikit ruang untuk menikmati perjalanan di antaranya." },
    ],
  },
  {
    slug: "kenalan-dengan-rasa-regen",
    title: "Beda rasa, beda cerita. Mana pilihanmu?",
    category: "Cerita REGEN",
    excerpt: "Kenalan dengan pilihan rasa REGEN dan temukan yang paling cocok dengan seleramu.",
    image: "/300ml/orange.webp",
    imageAlt: "Botol REGEN Orange 300ml",
    tone: "peach",
    label: "FIND YOUR FLAVOR.",
    sections: [
      { heading: "Mulai dari rasa yang kamu suka", text: "Memilih minuman bisa dimulai dari hal sederhana: rasa buah favoritmu. Koleksi REGEN 300ml punya pilihan Apple, Lemon Lime, Lychee, Orange, Peach, dan Watermelon. Kamu bisa mulai dari rasa yang familier, lalu mencoba pilihan lain saat ingin suasana berbeda." },
      { heading: "Satu rasa untuk setiap momen? Bebas!", text: "Nggak ada aturan rasa tertentu harus dinikmati pada waktu tertentu. Lemon Lime bisa jadi pilihan saat bersantai, sementara Orange menemani obrolan sore. Atau sebaliknya. Pilihan terbaik adalah pilihan yang kamu nikmati sendiri." },
      { heading: "Kenali kemasannya juga", text: "Selain rasa, cek ukuran kemasan dan informasi produk sebelum memilih. Lihat daftar bahan, informasi nilai gizi, tanggal kedaluwarsa, serta petunjuk penyimpanan pada label. Halaman produk REGEN juga bisa jadi tempat awal untuk mengenali pilihan yang tersedia." },
      { heading: "Temukan favorit barumu", text: "Kalau biasanya selalu memilih rasa yang sama, sesekali beri kesempatan pada varian lain. Ajak teman bertukar cerita tentang pilihan masing-masing. Siapa tahu, rekomendasi sederhana membuka cerita rasa yang baru." },
    ],
  },
  {
    slug: "akhir-pekan-sederhana",
    title: "Rencana kecil untuk akhir pekan yang seru.",
    category: "Inspirasi",
    excerpt: "Nggak harus jauh dan nggak harus ramai. Ide menikmati waktu luang, mulai dari dekat rumah.",
    image: "/300ml/watermelon.webp",
    imageAlt: "Botol REGEN Watermelon 300ml",
    tone: "pink",
    label: "WEEKEND YOUR WAY.",
    sections: [
      { heading: "Jelajahi yang dekat dulu", text: "Akhir pekan nggak selalu membutuhkan perjalanan panjang. Coba berjalan ke taman sekitar, mampir ke toko buku, atau menjelajahi jalan yang biasanya cuma kamu lewati. Pilih tempat sesuai cuaca, waktu, dan anggaran yang kamu punya." },
      { heading: "Bawa seperlunya", text: "Kalau berencana keluar, siapkan tas ringan berisi barang yang benar-benar terpakai. Ponsel, dompet, air minum, dan perlengkapan sesuai kegiatan bisa jadi awal. Kalau membawa minuman kemasan, cek petunjuk penyimpanan dan bawa kembali sampahnya sampai menemukan tempat pembuangan yang sesuai." },
      { heading: "Bikin agenda di rumah", text: "Lebih ingin tinggal di rumah? Susun daftar film, coba resep sederhana, atau ajak teman bermain permainan papan. Siapkan sudut yang nyaman dan camilan favorit. Acara kecil pun bisa terasa istimewa ketika dinikmati bersama orang yang tepat." },
      { heading: "Sisakan waktu tanpa agenda", text: "Nggak semua jam harus punya rencana. Sisakan ruang untuk mengubah pilihan atau sekadar duduk santai. Akhir pekan adalah kesempatan menikmati waktu dengan caramu sendiri, termasuk ketika rencananya adalah tidak banyak melakukan apa-apa." },
    ],
  },
];

export const readingTime = (post: typeof posts[number]) => Math.max(1, Math.ceil(post.sections.map(section => `${section.heading} ${section.text}`).join(" ").split(/\s+/).length / 180));
