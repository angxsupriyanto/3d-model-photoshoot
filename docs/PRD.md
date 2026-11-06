# PRD — Aplikasi Panduan Foto Objek untuk Model 3D

Versi 1.2 · Web mobile first · GitHub + Vercel · Ekspor ZIP

Revisi ini mengikuti keputusan pengguna: tidak ada integrasi Google Drive atau pengiriman otomatis. Pengguna mengunduh paket ZIP, kemudian mengirim atau mengunggahnya sendiri. Ketentuan versi sebelumnya mengenai OAuth, penyimpanan pusat, upload, retry server, dan konfirmasi pengiriman tidak berlaku.

## 1. Gambaran dan tujuan

Aplikasi memandu pengguna memfoto objek dari berbagai sudut sebagai referensi model Three.js prosedural menggunakan img2threejs. Foto dan metadata diproses di browser; pengguna tidak perlu membuat akun atau menghubungkan layanan penyimpanan.

Hasil akhir berupa satu ZIP per objek, berisi foto JPEG berlabel, README.md, dan manifest.json. Pengguna memilih sendiri penerima dan layanan pengiriman. Aplikasi tidak mengklaim mengetahui apakah file telah tersimpan, diunggah, atau diterima pihak lain.

## 2. Cakupan

Termasuk: membuat objek, draft lokal IndexedDB, panduan foto per sudut, kamera/galeri, preview, foto ulang, foto detail, review, foto utama, ukuran/catatan opsional, pembuatan dan unduhan ZIP, serta dokumentasi deployment Vercel.

Di luar cakupan: upload otomatis, integrasi penyimpanan, OAuth, akun pengguna, sinkronisasi antarperangkat, dashboard admin, pembuatan model 3D di aplikasi, validasi kualitas AI, dan pengiriman pesan otomatis.

## 3. Alur dan halaman

1. Beranda: buat objek baru atau lanjutkan draft lokal. Filter Semua objek, Belum diekspor, dan Paket dibuat.
2. Objek baru: nama wajib dan deskripsi opsional.
3. Persiapan: cahaya merata, latar sederhana, seluruh objek terlihat, kamera utama tanpa filter/zoom digital, aksesori tetap konsisten.
4. Panduan foto: satu sudut per layar, ilustrasi objek/kamera, acuan kanan/kiri tetap, progres, kamera dan galeri.
5. Preview: periksa ketajaman dan framing, gunakan foto atau foto ulang. Foto detail membutuhkan label “Bagian apa ini?”.
6. Review: cek kelengkapan, tambahkan foto bawah/detail, pilih foto utama, ganti/hapus foto, isi ukuran/catatan, lalu Unduh paket referensi (.zip).
7. Paket siap: tampilkan jumlah foto dan instruksi memeriksa folder Unduhan, kemudian mengirim/mengunggah ZIP secara manual. Sediakan unduh ulang, kembali ke review, dan buat objek lain.

Pembuatan ZIP membutuhkan minimal satu foto. Referensi yang belum lengkap tetap ditandai. Status Paket dibuat berarti permintaan unduhan telah dimulai, bukan bukti file tersimpan atau dikirim. Perubahan foto/metadata membuat objek perlu diekspor ulang. Unduhan tidak menghapus draft.

## 4. Panduan foto

Target 9 foto utama, bukan persyaratan resmi img2threejs:

| Urutan   | Sudut                 | Instruksi                                             |
| -------- | --------------------- | ----------------------------------------------------- |
| 1        | Depan                 | Tetapkan sisi depan, kamera sejajar tengah objek.     |
| 2        | Serong depan kanan    | Tampilkan depan dan kanan sekitar 45°.                |
| 3        | Kanan                 | Foto sisi kanan secara lurus, seluruh objek terlihat. |
| 4        | Serong belakang kanan | Tampilkan belakang dan kanan sekitar 45°.             |
| 5        | Belakang              | Foto belakang secara lurus.                           |
| 6        | Serong belakang kiri  | Tampilkan belakang dan kiri sekitar 45°.              |
| 7        | Kiri                  | Foto kiri secara lurus.                               |
| 8        | Serong depan kiri     | Tampilkan depan dan kiri sekitar 45°.                 |
| 9        | Atas                  | Foto dari atas jika aman.                             |
| Opsional | Bawah                 | Balik objek hanya jika aman.                          |
| Opsional | Detail                | Foto bagian penting dari dekat dan beri label.        |

Sisi depan pada foto pertama menjadi orientasi tetap untuk kanan/kiri. Sudut utama boleh dilewati dengan alasan. Alasan disimpan dan dibatalkan jika foto untuk sudut tersebut kemudian ditambahkan. Foto utama default serong depan kanan jika tersedia, kemudian foto pertama; pengguna dapat menggantinya.

## 5. Data objek

ID lokal tetap, nama wajib, deskripsi opsional, lebar × kedalaman × tinggi dalam cm, material utama, bagian bergerak, detail yang harus dipertahankan, catatan, alasan sudut dilewati, foto utama, dan label foto detail. Ukuran kosong berarti tidak diketahui, tidak diperkirakan.

Draft/foto disimpan di IndexedDB pada browser dan perangkat yang sama. Penghapusan foto/draft memerlukan konfirmasi. Kegagalan penyimpanan harus terlihat; aplikasi tidak boleh menyatakan draft tersimpan jika operasi penyimpanannya gagal. Membersihkan data browser dapat menghapus draft. ZIP yang sudah diunduh menjadi salinan terpisah.

## 6. Isi ZIP

Nama paket: `<nama-aman>_<id-pendek>.zip`.

| File                   | Isi                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------- |
| 01-front.jpg           | Depan                                                                                  |
| 02-front-right.jpg     | Serong depan kanan                                                                     |
| 03-right.jpg           | Kanan                                                                                  |
| 04-back-right.jpg      | Serong belakang kanan                                                                  |
| 05-back.jpg            | Belakang                                                                               |
| 06-back-left.jpg       | Serong belakang kiri                                                                   |
| 07-left.jpg            | Kiri                                                                                   |
| 08-front-left.jpg      | Serong depan kiri                                                                      |
| 09-top.jpg             | Atas                                                                                   |
| 10-bottom.jpg          | Bawah jika ada                                                                         |
| detail-01-konektor.jpg | Contoh foto detail berlabel                                                            |
| README.md              | Orientasi, foto utama, ukuran, daftar foto, sudut hilang, catatan, dan instruksi agent |
| manifest.json          | Metadata terstruktur pendamping aplikasi                                               |

File foto yang tidak tersedia tidak dimasukkan; metadata tetap mencatat sudut utama yang hilang. Nama file dibersihkan, format foto JPEG, dan nama objek sama tetap dibedakan dengan ID. manifest.json bukan klaim kompatibilitas dengan skema internal img2threejs.

Instruksi agent dalam README: “Gunakan img2threejs untuk membangun objek ini sebagai model Three.js prosedural. Gunakan foto utama sebagai referensi awal, lalu foto lainnya untuk memeriksa bentuk, proporsi, dan detail. Ikuti label sudut dan ukuran yang tercatat. Laporkan bagian yang tidak terlihat atau masih perlu diasumsikan.”

## 7. Batas dan kegagalan

- Maksimal 20 foto per objek dan 15 MB per foto, termasuk hasil JPEG.
- Format input JPEG, PNG, dan WebP; gambar rusak/format lain ditolak dengan pesan jelas.
- Batas resolusi 60 megapiksel untuk membatasi pemakaian memori browser.
- Decoder browser menangani orientasi; encoding Canvas menghasilkan JPEG baru tanpa EXIF asli.
- Kualitas dan sudut diperiksa pengguna, bukan AI.
- Kamera tidak tersedia/ditolak: gunakan galeri. Kamera perangkat fisik memerlukan HTTPS dan izin browser.
- ZIP gagal dibuat: tetap di review, tampilkan kesalahan dan izinkan mencoba lagi; jangan tandai Paket dibuat.
- Permintaan unduhan berhasil dimulai: pengguna harus memeriksa penyimpanan browser. Aplikasi tidak dapat memastikan proses simpan browser selesai.
- Pengiriman manual gagal di layanan lain: pengguna dapat mengirim ulang ZIP atau membuat ZIP kembali. Tidak ada pelacakan pengiriman di aplikasi.

## 8. Teknis, privasi, dan tampilan

Next.js + TypeScript, React, IndexedDB, decoder gambar browser, Canvas, dan ZIP lokal. Tidak memerlukan backend unggahan, database bisnis, kredensial penyimpanan, atau OAuth. Foto tidak dikirim aplikasi ke server. Source disimpan di GitHub; deployment dapat menggunakan Vercel.

Tampilan mobile first tanpa scroll horizontal, satu kolom pada ponsel, tombol besar dan mudah dijangkau, instruksi singkat berbahasa Indonesia, serta status dengan teks/ikon selain warna. Jangan menyertakan foto pengguna, draft, atau rahasia di Git. Nama sensitif/foto tidak boleh ditulis ke log server.

## 9. Dokumentasi dan deployment

README: ringkasan, fitur, cara menjalankan, pengujian, dan URL production setelah tersedia. SETUP: kebutuhan Node/npm/browser dan penyimpanan lokal. DEPLOYMENT: Vercel preview/production dan rollback. Environment aplikasi tidak membutuhkan secret. Konfigurasi baru tidak otomatis memublikasikan environment atau deployment.

## 10. Kriteria penerimaan

- Alur buat objek, panduan sudut, preview, review, foto bawah/detail, dan foto utama berjalan tanpa login.
- Draft dan metadata bertahan setelah reload pada browser yang sama.
- Minimal satu foto untuk ekspor, maksimal 20 foto; file rusak/tidak didukung ditolak.
- ZIP dapat dibuka dan berisi JPEG berlabel, README, manifest, serta metadata yang konsisten.
- Foto/metadata yang diubah memerlukan ekspor baru; draft tidak dihapus saat ekspor.
- Pengguna mendapat petunjuk pengiriman manual; tidak ada tombol/konfirmasi pengiriman otomatis.
- Kegagalan ekspor dan penyimpanan ditampilkan secara jujur.
- Build dan pengujian alur utama lulus. Kamera dan unduhan diuji pada Chrome Android dan Safari iPhone sebelum go-live.
- Deployment HTTPS dan rollback diverifikasi sebelum aplikasi dinyatakan live.
