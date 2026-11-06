# Setup pengembangan

Node.js 22 atau 24, npm, dan browser modern dengan IndexedDB.

```sh
cd /workspace/3d-model-photoshoot
npm ci
npm run dev
```

Jalankan dari checkout yang tersedia; task cloud sudah terisolasi dan tidak memerlukan worktree tambahan. Pada perangkat fisik, kamera membutuhkan HTTPS dan izin kamera. Tombol galeri tersedia jika kamera tidak dapat digunakan. Pilihan kamera menggunakan input capture browser; perilakunya mengikuti sistem operasi.

## Verifikasi

```sh
npm run build
npm run typecheck
npx playwright install chromium
npm test
```

Untuk mesin cloud yang sudah menyediakan Chromium:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

Pengujian mencakup validasi isi gambar, metadata, pembuatan ZIP, draft setelah reload, foto bawah/detail, label wajib, alasan melewati sudut, pemilihan foto utama, hapus foto/draft, batas jumlah foto, dan overflow mobile.

## Data lokal

Draft berada di database IndexedDB `sudut-studio`, store `drafts`. Foto dinormalisasi menjadi JPEG melalui decoder browser dan Canvas; hasil encoding tidak menyimpan EXIF asli. Pengguna tetap memeriksa ketajaman dan sudut secara manual. File berukuran lebih dari 15 MB, format yang tidak didukung, gambar rusak, dan resolusi lebih dari 60 megapiksel ditolak. Maksimal 20 foto per objek. Foto utama default serong depan kanan, kemudian foto pertama; pilihan pengguna dipertahankan.

Unduhan ZIP berisi foto JPEG, `README.md`, dan `manifest.json`. Ukuran yang kosong tetap tidak diketahui. ZIP merupakan hasil akhir aplikasi. Periksa folder Unduhan browser, kemudian kirim melalui WhatsApp/email atau unggah sendiri ke layanan pilihan Anda. Aplikasi tidak mengetahui apakah file sudah tersimpan atau diterima. Draft lama dari prototipe tetap dapat dibuka; ekspor akan mengonversi foto lama menjadi JPEG. Hapus draft selalu meminta konfirmasi.

## Alur ekspor dan privasi

Tombol utama pada review adalah Unduh paket referensi (.zip). Setelah pembuatan paket, browser memulai unduhan dan aplikasi menampilkan langkah pengiriman manual. ZIP tidak menghapus draft. Status Paket dibuat bertahan setelah reload; perubahan pada foto atau metadata memindahkan objek ke Belum diekspor sehingga pengguna mengetahui perlunya membuat paket terbaru. Status ini bukan bukti file tersimpan atau terkirim.

Tidak ada Google Cloud project, OAuth, token, folder pusat, backend unggahan, atau environment variable aplikasi yang perlu dikonfigurasi. Pengelola menerima paket melalui saluran yang disepakati di luar aplikasi. Jangan mencatat foto pengguna atau isi draft di Git/log.
