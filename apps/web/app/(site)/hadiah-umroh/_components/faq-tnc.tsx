import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";

const FAQTNC = () => {
  return (
    <Accordion 
      type="single"
      collapsible
      defaultValue="tentang-promo"
      className="max-w-3xl h-auto mx-auto grid gap-4 text-gray-700">
      <AccordionItem value="tentang-promo" >
        <AccordionTrigger className="text-green-700 text-lg font-bold">Tentang Promo</AccordionTrigger>
        <AccordionContent className="h-full">
          <ul className="list-disc pl-6">
            <li>Program undian eksklusif dari REGEN untuk mengajakmu berkesempatan memenangkan <span className="font-bold">hadiah UMROH 2 Orang</span> dan <span className="font-bold">UANG TUNAI JUTAAN RUPIAH</span>.</li>
            <li>Program ini bersifat hadiah langsung tanpa diundi. Jika Anda menemukan kode unik di balik tutup botol kemasan khusus, Anda otomatis berhak mengklaim hadiah yang ditentukan berdasarkan kode uniknya. Peserta tidak dapat menukar atau memilih jenis hadiah lain.</li>
            <li>Periode promosi berlangsung <span className="font-bold">31 Maret s/d 31 Desember 2026</span>.</li>
            <li><span className="font-semibold">Tidak semua kode unik memiliki hadiah</span>, hanya kode unik tertentu yang memiliki hadiah sesuai dengan kode unik yang sudah ditetapkan pada sistem kami.</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="cara-ikut-promo">
        <AccordionTrigger className="text-green-700 text-lg font-bold">Bagaimana cara bisa mengikuti promo ini?</AccordionTrigger>
        <AccordionContent className="h-full">
            <p>Anda bisa mengikuti program Buka Regen, Buka Rejeki berhadiah jutaan rupiah dengan cara  :</p>
            <ol className="list-decimal pl-6">
                <li>Beli produk REGEN 300ml bertanda khusus.</li>
                <li>Temukan Kode Unik berhadiah di balik tutup botol.</li>
                <li>Pindai (scan) QR Code pada kemasan untuk masuk ke microsite.</li>
                <li>Ikuti langkah-langkah dengan melengkapi dokumen terkait saat proses klaim kode unik.</li>
                <li>Jika klaim anda berhasil, mohon simpan kemasan dan tutup botol yang memuat kode unik untuk verifikasi klaim hadiah lebih lanjut.</li>
                <li>Jika klaim Anda gagal karena kendala sistem, Anda dapat mencoba kembali menggunakan kode yang sama selama periode klaim masih berlaku.</li>
            </ol>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="ketentuan-peserta">
        <AccordionTrigger className="text-green-700 text-lg font-bold">Siapa saja yang boleh mengikuti program ini?</AccordionTrigger>
        <AccordionContent className="h-full">
            <ul className="list-disc pl-6">
                <li>Program ini terbuka untuk seluruh Warga Negara Indonesia (WNI)</li>
                <li>Peserta di bawah 17 tahun wajib didampingi oleh orang tua/wali saat proses verifikasi</li>
            </ul>
            <p className="pt-4 ml-6 font-bold italic">Program ini TIDAK berlaku bagi:</p>
            <ul className="list-disc pl-6">
                <li>Karyawan/staf PT. Global Enak Nikmat di seluruh Indonesia.</li>
                <li>Jaringan distribusi (afiliasi, agensi, pemasok, maupun vendor yang terlibat dalam pelaksanaan program).</li>
                <li>Keluarga inti dari pihak-pihak di atas (orang tua, saudara kandung, pasangan, dan anak-anak)</li>
            </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="syarat-ketentuan">
        <AccordionTrigger className="text-green-700 text-lg font-bold">Syarat dan Ketentuan Lainnya</AccordionTrigger>
        <AccordionContent className="h-full">
            <h2 className="text-2xl font-bold">Mengenai Program Regen, Buka Rejeki</h2>
            <p className="uppercase font-semibold text-muted-foreground">Syarat & Ketentuan Program</p>
            <div className="pb-5">
                <p>Inisiatif yang dinamakan <span className="font-bold">&quot;Buka Regen, Buka Rejeki&quot;</span> ini (&quot;<span className="font-bold">Program</span>&quot;) diselenggarakan oleh <span className="font-bold">PT. Global Enak Nikmat (GEN)</span> yang berkedudukan di DKI Jakarta. PT. GEN bertindak sebagai produsen minuman dengan merek dagang &quot;Regen&quot; (&quot;Penyelenggara&quot;).</p>
                <p>Program ini secara eksklusif diperuntukkan bagi para konsumen yang mengkonsumsi produk minuman REGEN (&quot;Peserta&quot;).</p>
                <p>Setiap Peserta yang memutuskan untuk berpartisipasi dalam Program ini harus membaca, memahami, dan mematuhi sepenuhnya semua syarat dan ketentuan yang dijabarkan di bawah ini. Hal ini mencakup semua revisi atau amandemen yang mungkin dikeluarkan oleh pihak Penyelenggara dari waktu ke waktu (&quot;Syarat dan Ketentuan&quot;).</p>
                <span>Periode Promosi : <span className="font-bold">31 Maret s/d 31 Desember 2026</span></span>
            </div>
            <ol className="list-decimal pl-6 grid gap-4">
                <li className="font-bold text-lg">Ketentuan Umum Peserta</li>
                <ul className="list-disc pl-6">
                    <li>Peserta wajib berkewarganegaraan Warga Negara Indonesia (WNI).</li>
                    <li>Peserta yang berusia di bawah 17 (tujuh belas) tahun wajib didampingi oleh orang tua/wali saat proses verifikasi.</li>
                    <li>Individu Berikut Dinyatakan Tidak Memenuhi Syarat (Diskualifikasi) untuk Program Ini:</li>
                </ul>
                <ul className="list-disc -pt-12 pl-10">
                    <li>Personel PT GEN secara keseluruhan.</li>
                    <li>Seluruh staf dari entitas grup PT GEN yang beroperasi di wilayah Indonesia.</li>
                    <li>Pegawai dari jaringan distribusi minuman Regen, termasuk namun tidak terbatas pada sub-distributor, gerai utama (star outlet), grosir (wholesaler), pengecer (retailer), dan seluruh klien mereka.</li>
                    <li>Karyawan dari pihak ketiga yang bekerja sama, seperti agensi, pemasok (vendor), atau yang secara langsung terlibat dalam perencanaan dan pelaksanaan program.</li>
                    <li>Anggota keluarga terdekat dari semua pihak yang disebutkan di atas, yang meliputi orang tua kandung (ayah dan ibu), saudara kandung, pasangan (suami/istri), dan anak-anak.</li>
                </ul>
                <li className="font-bold text-lg">Mekanisme Keikutsertaan</li>
                <ul className="list-disc pl-6">
                    <li>Peserta harus mengikuti program ini dengan cara membeli produk REGEN berukuran 300 ml edisi promosi yang ditandai dengan label berkemasan khusus.</li>
                    <li>Peserta wajib menemukan kode unik berhadiah yang tertera di bagian bawah tutup botol produk REGEN edisi promosi tersebut.</li>
                    <li>Peserta harus melakukan pemindaian (scan) kode QR yang terdapat pada kemasan produk untuk diarahkan ke laman klaim dan mengikuti langkah-langkah selanjutnya.</li>
                    <li>Setiap kode unik hanya dapat digunakan satu (1) kali untuk memperoleh hadiah yang sah.</li>
                    <li>Tidak semua kode unik memiliki hadiah, hanya kode unik tertentu yang dipasangkan dengan hadiah tertentu yang sudah ditetapkan pada sistem kami.</li>
                    <li>Peserta wajib mengisi data diri secara lengkap dan benar pada formulir klaim yang tersedia.</li>
                    <li>Apabila pada proses pengisian atau pengiriman data terjadi kendala teknis sistem, sehingga data tidak berhasil tersimpan, maka:</li>
                    <ul className="list-disc pl-6">
                        <li>kode unik tidak langsung dianggap telah digunakan, dan</li>
                        <li>peserta dapat melakukan proses klaim kembali menggunakan kode unik yang sama, selama periode klaim masih berlangsung.</li>
                    </ul>
                    <li>Kode unik baru dinyatakan berhasil digunakan apabila sistem telah mengkonfirmasi bahwa data klaim tersimpan dengan baik.</li>
                    <li>Penyelenggara berhak menetapkan batas waktu tertentu untuk penyelesaian proses klaim apabila kode berada dalam status proses berjalan (in progress).</li>
                    <li>Apabila kode unik telah berhasil diklaim dan dikonfirmasi oleh sistem, maka kode tersebut tidak dapat digunakan kembali dengan alasan apa pun.</li>
                    <li>Peserta yang beruntung tidak dapat mengikuti program ini untuk kedua kalinya dengan alasan apapun.</li>
                </ul>
                <li className="font-bold text-lg">Batas Waktu Klaim dan Verifikasi</li>
                <ul className="list-disc pl-6">
                    <li>Batas akhir klaim hadiah adalah pada tanggal 31 Desember 2026, pukul 23.59 Waktu Indonesia Barat (WIB).</li>
                    <li>Untuk verifikasi, pemenang wajib mengunggah dokumen pendukung, serta foto selfie dengan tutup botol asli yang memuat kode unik berhadiah.</li>
                    <li>Apabila verifikasi tidak selesai atau dokumen yang disyaratkan tidak lengkap dalam batas waktu yang ditentukan oleh Penyelenggara, maka hak atas hadiah akan dianggap gugur.</li>
                    <li>Proses verifikasi oleh tim REGEN akan membutuhkan waktu paling lambat 14 (empat belas) hari kerja setelah pemenang berhasil menyelesaikan proses klaim hadiah.</li>
                </ul>
                <li className="font-bold text-lg">Hadiah dan Pajak</li>
                <ul className="list-disc pl-6">
                    <li>Hadiah bersifat eksklusif bagi pemenang sesuai dengan kode unik yang dimilikinya dan tidak dapat dipindahtangankan atau ditukar dengan hadiah lain dalam bentuk apapun.</li>
                    <li>Pajak hadiah undian sebesar 25% ditanggung oleh Pemenang.</li>
                    <li>Jika pemenang hadiah adalah berupa uang tunai maka pembayaran ke pemenang setelah dipotong pajak dilakukan setiap hari kamis, jika hari kamis adalah tanggal merah atau hari libur akan di lakukan di kamis minggu berikutnya pada hari kerja.</li>
                </ul>
                <li className="font-bold text-lg">Aturan Main dan Diskualifikasi</li>
                <ul className="list-disc pl-6">
                    <li>Peserta dilarang melakukan segala bentuk kecurangan (termasuk, namun tidak terbatas pada, manipulasi kode unik, data, atau sistem).</li>
                    <li>Tim REGEN menolak dengan tegas segala penggunaan teknologi Ai untuk manipulasi kode unik pada tutup botol dan manipulasi wajah (deepfake) saat verifikasi.</li>
                    <li>Penyelenggara berhak penuh untuk mendiskualifikasi Peserta yang terbukti melanggar ketentuan yang telah ditetapkan.</li>
                </ul>
                <li className="font-bold text-lg">Hak Penyelenggara</li>
                <ul className="list-disc pl-6">
                    <li>Penyelenggara berhak untuk menggunakan dan menyebarkan data Peserta dan/atau Pemenang untuk kepentingan publikasi atau promosi, dengan pemberitahuan terlebih dahulu.</li>
                    <li>Penyelenggara berhak untuk membatalkan, menunda, atau mempublikasikan Pemenang tanpa adanya tuntutan hukum dari pihak manapun, apabila ditemukan indikasi kecurangan atau pelanggaran terhadap S&K ini.</li>
                    <li>Keputusan Penyelenggara bersifat mutlak dan tidak dapat diganggu gugat.</li>
                </ul>
            </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
export default FAQTNC;
