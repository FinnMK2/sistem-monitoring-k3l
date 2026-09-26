# Sistem Monitoring K3L

Aplikasi monitoring program kerja K3L berbasis React/Vite dengan integrasi Google Sheets melalui Google Apps Script.

## Menjalankan aplikasi

```powershell
cd frontend
npm install
npm run dev
```

Build production:

```powershell
npm run build
```

## Struktur

- `frontend/` - aplikasi React/Vite
- `backend/AppsScript.js` - Google Apps Script untuk membaca dan mengelola data Spreadsheet

## Pembagian job desk

### Adit - Formulir Pemantauan dan Pengelolaan Kegiatan

- Mengembangkan dan memelihara halaman Formulir Pemantauan.
- Menampilkan daftar program kerja, kategori, PIC, target, realisasi, periode, status, dan filter pencarian.
- Mengelola fitur admin: tambah, edit, realisasi, dan hapus kegiatan.
- Memastikan status otomatis berdasarkan perbandingan target dan realisasi.

### Abel/Finnmk2 - Log Aktivitas, Tahun, dan Sinkronisasi Spreadsheet

- Mengembangkan Log Aktivitas dengan tabel mingguan dan rentang tanggal dinamis.
- Mengelola pemilihan serta pembuatan tahun baru.
- Memastikan duplikasi sheet, reset realisasi, kalender, dan header tahun berjalan benar.
- Memelihara sinkronisasi baca/tulis antara website dan Google Spreadsheet.
- Memelihara fitur ekspor PDF.

### Mei - Notifikasi WhatsApp dan Fitur Pendukung

- Mengembangkan indikator kegiatan yang belum selesai.
- Memelihara pengiriman pengingat WhatsApp untuk Admin.
- Mengembangkan skenario pengingat mingguan, bulanan, dan Jumat melalui Google Apps Script.
- Memelihara fitur pendukung dan dokumentasi status prototype.

### Nabila - Login dan Dashboard Beranda

- Mengembangkan login dan pembagian role Admin/Tamu.
- Memastikan pembatasan fitur pengelolaan berdasarkan role.
- Mengembangkan dashboard ringkasan total kegiatan, status, kepatuhan, dan tren bulanan.
- Memelihara filter tahun dan periode pada dashboard.

## Catatan deployment

Frontend dapat di-deploy ke Vercel dengan konfigurasi pada `frontend/vercel.json`. Endpoint Google Apps Script harus sudah di-deploy sebagai Web App dan memiliki akses yang sesuai.
