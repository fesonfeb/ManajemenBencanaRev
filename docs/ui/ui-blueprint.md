# UI Blueprint

Dokumen ini menjelaskan blueprint antarmuka untuk fase berikutnya. Tujuan utama adalah membuat UI yang konsisten dengan alur operasional dan area akses peran, tanpa memberikan gambaran yang salah bahwa fitur sudah berjalan.

## 1. Struktur navigasi utama
- Dashboard
- Insiden
- Assessment
- Rencana Respons
- Kegiatan
- Inventaris
- Distribusi
- Donasi
- Keuangan
- LPJ
- Administrasi

## 2. Tampilan dashboard umum
Setiap dashboard harus menampilkan:
- ringkasan tugas aktif
- daftar item yang perlu tindakan
- prioritas dan tenggat waktu
- notifikasi penting
- riwayat terakhir
- tombol menuju detail item

### 2.1 Dashboard untuk Verifikator
- daftar laporan yang masuk
- laporan yang menunggu triase
- laporan yang perlu validasi
- hasil assessment menunggu review

### 2.2 Dashboard untuk Asesor
- daftar tugas assessment yang dialokasikan
- daftar bukti yang perlu diunggah
- status progress assessment
- catatan revisi dan return

### 2.3 Dashboard untuk Koordinator
- daftar kegiatan aktif dan tertunda
- daftar penugasan relawan
- kebutuhan logistik dan prioritas
- status persetujuan rencana respons

### 2.4 Dashboard untuk Logistik
- daftar kebutuhan stok dan permintaan barang
- status distribusi per wilayah
- riwayat serah terima
- masalah stok atau keterlambatan

### 2.5 Dashboard untuk Admin Keuangan
- ledger dan transaksi
- pengajuan dana / alokasi
- outstanding approval
- kronologi rekonsiliasi

### 2.6 Dashboard untuk Pimpinan
- ringkasan prioritas strategis
- request approval
- status LPJ aktif
- overview incident dan program utama

## 3. Pola form dasar
Setiap form harus punya:
- judul jelas
- bagian yang dipisah menurut konteks
- validasi yang jelas
- ringkasan sebelum submit
- indikator data wajib
- status revisi jika memungkinkan
- tombol simpan draft aman
- notifikasi error yang bisa ditindaklanjuti

## 4. Pola detail item / record page
Setiap record harus menampilkan:
- metadata dasar
- status saat ini
- actor utama
- timeline aktivitas
- bukti dan lampiran
- file terkait
- tindakan yang mungkin dilakukan
- aturan persetujuan / reject / revise

## 5. UI rule untuk keamanan dan operasi
- Tidak boleh mengandalkan button disabled sebagai pengaman.
- Menu dan action harus dikelola dari backend berdasarkan role.
- Data sensitif harus ditampilkan sesuai akses per-role.
- Akses cross-incident harus dilarang di backend.

## 6. TBD
- detail visual untuk mobile / field app
- aturan notifikasi real-time
- layout final per role
- kebutuhan fitur search/filter pada tiap modul utama
