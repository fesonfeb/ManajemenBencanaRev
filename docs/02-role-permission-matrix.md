# Role Permission Matrix
Status: Approved by Product Owner

## 1. Ringkasan
Matriks ini memetakan peran utama, fitur yang menjadi kewenangan, dan batasan akses. Akses harus dipastikan di backend, bukan hanya disembunyikan di UI.

## 2. Role dan Kewenangan

| Role | Akses utama | Batasan | Catatan |
|---|---|---|---|
| SUPERADMIN | Konfigurasi sistem, role dan permission, master data, audit log | Tidak otomatis mengubah transaksi yang sudah disahkan | Tidak membaca password atau secret |
| ADMIN | Pengguna, master data, assessor, koordinator, volunteer, kategori bantuan, satuan, gudang, lokasi | Tidak otomatis menyetujui anggaran atau menutup operasi | Fokus administrasi |
| PIMPINAN | Dashboard ringkasan, review insiden, review program, approval strategis | Tidak otomatis mengubah operasi tanpa mekanisme approval | Keputusan harus tercatat |
| VERIFIKATOR | Laporan, validasi, klarifikasi, duplikat, reject, triase | Tidak mengubah laporan sumber diam-diam | Hanya kewenangan yang diberi |
| ASESOR | Assessment dan tugas lapangan yang relevan | Tidak bisa menyetujui assessment sendiri tanpa permission tambahan | Hanya tugas yang ditugaskan |
| KOORDINATOR_LAPANGAN | Penugasan tim, absensi, kebutuhan lapangan, distribusi, laporan situasi | Tidak otomatis punya kewenangan keuangan | Fokus operasi lapangan |
| KEUANGAN | Anggaran, transaksi, bukti, rekonsiliasi, realisasi | Tidak mengubah transaksi yang sudah disahkan | Wajib ada maker-checker |
| LOGISTIK | Stok, penerimaan, mutasi, picking, pengiriman, distribusi | Tidak dapat mengubah stok tanpa transaksi sah | Harus ada surat jalan |
| DONATUR | Proposal dan program yang relevan, target dan realisasi publikasi | Tidak boleh melihat data korban atau donor lain | Akses terbatas |
| AUDITOR | Akses baca sesuai lingkup audit | Tidak mengubah data operasional | Hanya audit |
| VOLUNTEER | Tugas aktif, surat tugas, absensi, laporan tindak lanjut | Tidak boleh melihat data personal penerima yang tidak perlu | Fokus tugas |
| PUBLIC / PELAPOR | Mengirim laporan, lihat status tiket | Tidak akses dashboard internal | Status publik dibatasi |

## 3. Pembatasan Akses
Akses harus dibatasi berdasarkan:
- organisasi
- unit
- wilayah dan lokasi
- insiden
- tugas atau penugasan
- program atau kegiatan
- dokumen dan data yang memang menjadi kewenangan pengguna

## 4. Aturan Otentikasi dan Otorisasi
- Semua endpoint API harus mengecek role dan permission.
- Akses data dilanjutkan sesuai scope organisasi dan incident.
- Akses tidak boleh hanya disembunyikan di UI, tetapi juga dipastikan di backend.
- Semua perubahan material harus masuk ke audit trail.

## 5. Deklarasi Final
Matriks ini menjadi baseline untuk implementasi auth, RBAC, dan semua endpoint API.
