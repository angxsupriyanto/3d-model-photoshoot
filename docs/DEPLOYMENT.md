# Deployment

Aplikasi Next.js dapat dibangun dengan `npm run build`. Source dikelola di repository GitHub `angxsupriyanto/3d-model-photoshoot`. Deployment Vercel belum dilakukan. Publish environment cloud tidak sama dengan deployment aplikasi ke Vercel.

Hubungkan repository GitHub melalui Vercel menggunakan preset Next.js, install command `npm ci`, dan build command `npm run build`. Tetapkan `main` sebagai branch production setelah source tersedia di GitHub. Pengembangan berikutnya menggunakan branch dan pull request. Preview Vercel memberi HTTPS untuk uji kamera pada perangkat fisik.

## Konfigurasi

Tidak memerlukan environment variable aplikasi, Google Cloud, OAuth, atau kredensial penyimpanan. Foto dan ZIP diproses secara lokal di browser. Pengguna memeriksa hasil unduhan lalu mengirim atau mengunggah ZIP secara manual melalui layanan pilihan mereka.

Draft IndexedDB terpisah untuk setiap browser/perangkat/domain. Preview dan production tidak berbagi draft. Unduh paket sebelum membersihkan data browser. Status Paket dibuat tidak membuktikan penyimpanan browser atau pengiriman manual selesai.

## Verifikasi sebelum go-live

Jalankan build, typecheck, dan `npm test`. Uji Chrome Android dan Safari iPhone: kamera/galeri, orientasi foto, penolakan izin, gambar rusak, penyimpanan penuh, draft setelah reload, unduh/unduh ulang ZIP, dan pembukaan arsip beserta metadata. Pengujian browser desktop otomatis tidak menggantikan uji perangkat fisik. Ukuran paket harus disesuaikan dengan batas layanan pengiriman manual yang dipilih pengguna.

Setelah deployment pertama, catat URL production yang sebenarnya di README. Pembaruan main dapat menggunakan deployment otomatis Vercel. Untuk rollback, promote deployment sebelumnya yang diketahui baik melalui Vercel lalu verifikasi kamera, draft, dan ekspor. Jangan memasukkan foto pengguna atau draft ke Git.
