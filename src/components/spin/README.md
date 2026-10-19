# REGEN Spin & Win

## Katalog roda dan Grand Prize

Admin memiliki dua form dan katalog terpisah: **Tambah Hadiah Spin** untuk poin/voucher/Coba Lagi, serta **Tambah Grand Prize** untuk penukaran poin. Hadiah spin baru mendapat kode unik; hadiah aktif menambah segmen roda secara otomatis. Label roda memakai nama admin tanpa ikon. Peluang tetap mengikuti bobot server, bukan besar segmen.

Dalam mode development, membuka halaman Hadiah admin mengirim salinan katalog aktif ke penyimpanan browser website melalui iframe `preview-bridge` dan `postMessage` dengan pemeriksaan origin. Pengubahan katalog memperbarui simulasi tanpa request API game. Lokal memakai admin port 3000 dan website port 4321 pada hostname yang sama. Tab harus memakai profil browser yang sama. Mode produksi membaca katalog dari API. Deploy API dan frontend terbaru bersama agar kode hadiah dinamis dikenali.

## Development playground

Aktifkan toggle **Development** di sebelah **Kampanye** pada Overview admin. Mode disimpan di cookie browser bersama untuk drinkregen.com dan subdomainnya, atau antar-port localhost dengan hostname yang sama. Saat aktif, halaman spin memakai simulasi tanpa satu pun request API spin, termasuk pembacaan status. Saat nonaktif, komponen produksi dipasang kembali dan menggunakan API biasa. Halaman terbuka mendeteksi perubahan cookie setiap detik; mode berlaku hanya di browser yang sama. Gunakan hostname yang sama saat pengujian lokal (jangan campur localhost dan 127.0.0.1). Tidak perlu migrasi database untuk mode ini.

Game menggunakan API `https://api.drinkregen.com/api/v1/spin`. Registrasi nama dan nomor WhatsApp, langsung memperoleh lima spin untuk nomor baru tanpa OTP. Bonus satu kali per nomor dan guest points dipindahkan sekali saat akun dibuat. Nomor existing membuka akun lama dari browser lain dengan sesi baru; nama, poin, dan kuota mengikuti akun lama tanpa bonus atau transfer hasil spin tamu ulang.

Endpoint: GET /status, POST / (spin), POST /register {name,whatsapp}, POST /redeem {rewardId}. POST membutuhkan CSRF dan Idempotency-Key. Status registrasi langsung mengikuti statusSchema, tanpa challengeId atau /verify.

Aturan poin dipertahankan: guest satu spin, akun lima spin dengan reset 24 jam setelah kuota habis; countdown mengikuti dailyResetAt dari API, hadiah POINTS_5/POINTS_10/VOUCHER_10/VOUCHER_50/TRY_AGAIN, guest pertama tidak TRY_AGAIN. CARTON berharga100 poin dan THREE_BOTTLES 25 poin. Outcome dan saldo berasal dari server; tidak ada fallback hadiah client.

Konfigurasi/migrasi API: SPIN_GAME_SETUP.md pada repository API. Kampanye disabled secara default sampai inventori dan probabilitas disiapkan; tidak ada ketergantungan OTP. PUBLIC_SPIN_API_URL dapat mengubah URL API untuk pengujian.

Tes: node node_modules/typescript/bin/tsc --project tsconfig.spin.json --noEmit; node --import tsx --test src/services/spin.mock.test.ts src/services/spin.service.test.ts. Fixture tidak dipakai produksi. Integrasi MySQL hosting belum diuji.

Katalog penukaran sekarang berasal dari redemptionOptions pada respons status API; hadiah baru memakai kode otomatis, nama, biaya poin dan stok dari server. Images tetap dipetakan di src/components/spin/redemption-images.ts. UI Grand Prize hanya menampilkan katalog database, tanpa fallback daftar statis. Jenis CARTON_MIX memakai /spin/karton-regen.webp dan BOTTLE memakai /spin/3botol-regen.webp, termasuk untuk kode hadiah baru. Katalog kosong menampilkan pesan belum tersedia; stok nol menonaktifkan penukaran.

Poin hasil spin dan nama hadiah dapat diatur admin: respons menyertakan spinRewards, rewardName dan awardedPoints untuk label roda dan hasil. Jalankan migrasi spin:migrate pada API sebelum deploy versi ini.

Uploaded imageUrl from the API now takes priority over legacy asset mappings for redemption cards and regular wheel rewards. Relative URLs resolve against the public API origin.
