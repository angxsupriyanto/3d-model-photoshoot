# Sudut — Studio referensi objek 3D

Aplikasi panduan foto mobile first berdasarkan [PRD](docs/PRD.md). Next.js 15, React 19, TypeScript. Foto dikemas menjadi ZIP di browser. Pengguna mengirim atau mengunggah ZIP secara manual melalui layanan pilihannya. Tidak ada integrasi penyimpanan atau pengiriman otomatis.

```sh
npm ci
npm run dev
```

## Alur tersedia

- Buat objek, persiapan, panduan visual 9 sudut, kamera/galeri, preview dan foto ulang.
- Foto bawah opsional dan foto detail dengan label wajib, maksimal 20 foto per objek.
- Pemeriksaan format, batas 15 MB, decoding gambar, dan normalisasi JPEG di browser.
- Review kelengkapan, alasan melewati sudut, pemilihan foto utama, hapus foto/draft dengan konfirmasi.
- Ukuran dalam cm, material, bagian bergerak, detail penting dan catatan.
- Draft serta foto di IndexedDB, dapat dilanjutkan pada browser/perangkat yang sama.
- Unduh paket ZIP foto berlabel, README, dan manifest sebagai cadangan serta referensi img2threejs.

## Validasi

```sh
npm run build
npm run typecheck
npx playwright install chromium
npm test
```

Di cloud dengan Chromium sistem: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test`.

Lihat [setup](docs/SETUP.md) dan [deployment](docs/DEPLOYMENT.md). Tidak diperlukan secret untuk alur lokal. Tombol utama setelah review mengunduh ZIP; layar berikutnya menjelaskan langkah pengiriman manual. Status Paket dibuat mencatat permintaan unduhan, bukan bukti file tersimpan atau terkirim. Tidak membutuhkan OAuth atau akun penyimpanan. Membersihkan data browser dapat menghapus draft; IndexedDB bukan cadangan permanen.

Kamera perangkat fisik memerlukan HTTPS dan izin browser. Foto harus ditinjau manual; tidak ada validasi kualitas AI. Validasi browser bukan pengganti validasi backend pada tahap upload. Font web memiliki fallback font sistem.
