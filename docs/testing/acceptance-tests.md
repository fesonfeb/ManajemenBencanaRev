# Acceptance Tests

Dokumen ini berisi daftar pengujian yang harus dijalankan saat fitur atau proses sudah diimplementasikan.

## 1. Kategori pengujian
- validasi role dan kewenangan
- transisi status
- fungsi form dan input
- approval dan penolakan
- revisi data
- distribusi dan stok
- keuangan dan rekonsiliasi
- LPJ
- offline sync
- keamanan dan audit trail

## 2. Contoh skenario baseline
1. Pengguna tanpa login mencoba akses halaman terproteksi.
2. Pengguna dengan peran salah mencoba mengubah status.
3. Pengajuan dibuat sebelum prasyarat terpenuhi.
4. Approval dilakukan oleh pihak tidak berwenang.
5. Pengajuan ganda dibuat pada data yang sama.
6. Dua petugas mengubah data yang sama dalam satu periode waktu.
7. Penugasan diulang ke tugas yang sama.
8. Assessment dikembalikan dengan alasan yang jelas.
9. Upload foto gagal dan kejadiannya tercatat.
10. Stok tidak mencukupi untuk distribusi.
11. Transaksi duplikat terdeteksi.
12. LPJ final diubah tanpa mekanisme revisi resmi.
13. Data insiden lain diakses tanpa kewenangan.
14. Request API diubah langsung untuk bypass rule.

## 3. Catatan pengujian
- Tidak menggunakan data pribadi nyata tanpa persetujuan.
- Semua pengujian harus dicatat dengan hasil dan keterbatasan.
- Uji keamanan harus memisahkan validasi bisnis dan evaluasi teknis.

## 4. TBD
- Daftar pengujian per modul yang lebih rinci.
- Sasaran performa untuk masing-masing fitur.
- Kriteria acceptability per role.
