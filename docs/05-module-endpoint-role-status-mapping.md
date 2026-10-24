# Dashboard Specification
Status: Approved by Product Owner

## 1. Tujuan Dashboard
Dashboard harus membantu pengguna memahami:
1. apa yang perlu dikerjakan
2. apa yang sedang berjalan
3. apa yang tertunda atau berisiko
4. keputusan apa yang menunggu approval
5. hasil pekerjaan yang sudah dilakukan

## 2. Prinsip UX
- responsif desktop dan mobile
- navigasi sesuai role
- indikator status jelas
- tidak hanya bergantung pada warna
- pencarian dan filter tersedia
- empty state, loading state, dan error state tersedia
- waktu pembaruan data ditampilkan
- format tanggal, jam, satuan, dan mata uang konsisten

## 3. Struktur Dasar Dashboard
Setiap dashboard utama harus memiliki:
- header halaman
- ringkasan status
- daftar item prioritas
- daftar tugas yang menunggu tindakan
- ringkasan kejadian/insiden aktif
- panel kebutuhan review dan approval
- riwayat aktivitas utama

## 4. Dashboard per Role

### SUPERADMIN
- status sistem
- pengguna dan role
- aktivitas penting
- kesehatan layanan
- master data

### ADMIN
- pengguna
- master data
- tugas administratif
- status kelengkapan data

### PIMPINAN
- jumlah laporan masuk
- laporan butuh verifikasi
- laporan diterima dan ditolak
- insiden aktif
- prioritas tinggi
- assessment menunggu verifikasi
- program aktif
- kebutuhan belum terpenuhi
- realisasi donasi dan anggaran
- status logistik dan distribusi
- LPJ menunggu approval

### VERIFIKATOR
- antrean laporan sesuai kewenangan
- laporan baru
- laporan butuh klarifikasi
- laporan prioritas tinggi
- laporan overdue
- detail lokasi, peta, bukti, histori

### ASESOR
- penugasan assessment miliknya
- open task
- surat tugas
- jadwal dan lokasi
- draft assessment
- assessment yang perlu revisi
- assessment yang sudah dikirim

### KOORDINATOR_LAPANGAN
- anggota tim
- status penugasan
- kehadiran relawan
- kebutuhan lapangan
- distribusi aktif
- laporan situasi

### KEUANGAN
- anggaran
- penerimaan
- pengeluaran
- transaksi menunggu approval
- rekonsiliasi
- saldo berdasarkan ledger

### LOGISTIK
- stok tersedia
- stok dialokasikan
- barang masuk/keluar
- stok minimum
- barang mendekati kedaluwarsa
- gudang/rak
- pengiriman dan picking

### DONATUR
- proposal yang dapat diakses
- program yang didukung
- target dan realisasi yang diizinkan publikasi
- update kegiatan
- dokumentasi publik

### AUDITOR
- aktivitas pemeriksaan
- persetujuan
- riwayat perubahan
- transaksi dan dokumen relevan
- temuan audit

### VOLUNTEER
- penugasan aktif
- surat tugas
- jadwal
- absensi
- laporan tugas

### PUBLIC
- formulir laporan
- informasi umum
- cara cek status tiket
- informasi publik yang sudah disetujui

## 5. Kriteria Visual dan Data
- output harus konsisten, tidak bergantung pada warna saja
- setiap indikator harus mengandung definisi dan sumber data
- setiap dashboard perlu filter dan periode data
- empty state harus jelas ketika tidak ada data
- waktu terakhir diperbarui harus ditampilkan

## 6. Kesimpulan
Dashboard harus menjadi alat operasional, bukan sekadar grafik dekoratif. Fokus utama adalah keputusan dan tindakan yang harus diambil oleh pengguna sesuai role.
