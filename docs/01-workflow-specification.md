# Spesifikasi Final Sistem Manajemen Operasi Kebencanaan
Status: Approved by Product Owner
Tanggal: 2026-10-24

## 1. Tujuan
Sistem ini dirancang untuk mendukung siklus operasi kebencanaan mulai dari laporan kejadian hingga penutupan operasi dan LPJ. Fokus utama adalah:
- respons cepat terhadap kondisi darurat
- integritas data dan audit trail
- pembatasan akses sesuai peran, tim, wilayah, insiden, tugas, dan program
- dokumentasi operasional, logistik, distribusi, dan keuangan
- transparansi dan pertanggungjawaban internal

## 2. Prinsip Dasar
- SPA tetap dipertahankan, tetapi validasi dan otorisasi dilakukan di server.
- Hak akses harus ditentukan di backend, bukan hanya menyembunyikan menu di UI.
- Status dipisahkan per entitas dan tidak diwakili oleh satu field tunggal.
- Semua perubahan status harus mencatat actor, waktu, entitas, status sebelum dan sesudah, alasan, approval, dan correlation ID.
- Data sensitif tidak dibuka ke publik atau donatur tanpa review dan approval.
- Pemulihan pascabencana tetap dipisahkan dari operasional utama pada fase ini.

## 3. Identitas Entitas
- REPORT_ID
- INCIDENT_ID
- ASSESSMENT_ID
- TASK_ID
- PROGRAM_ID
- ACTIVITY_ID
- SUPPORT_REQUEST_ID
- STOCK_MOVEMENT_ID
- DISTRIBUTION_ID
- TRANSACTION_ID
- DISPATCH_NOTE_ID
- OPERATION_ORDER_ID

Aturan:
- REPORT_ID tidak otomatis menjadi INCIDENT_ID.
- Satu insiden dapat memiliki banyak laporan, assessment, tugas, program, distribusi, dan transaksi.
- Laporan serupa belum otomatis dianggap duplikat tanpa keputusan terdokumentasi.

## 4. Workflow Operasional Utama

### 4.1 Laporan Masuk
1. Pelapor mengirim laporan melalui web, petugas, WhatsApp, atau kanal resmi.
2. Sistem membuat REPORT_ID otomatis.
3. Data laporan dicatat: waktu, kanal, kategori kejadian, lokasi, sumber, status awal.
4. Laporan masuk antrean verifikasi.
5. Verifikator memeriksa kelengkapan data, bukti, lokasi, kronologi, dan histori.
6. Jika data kurang lengkap, status menjadi NEEDS_CLARIFICATION.
7. Jika valid, status menjadi ACCEPTED dan diteruskan ke triase.
8. Jika ditolak, status menjadi REJECTED dengan alasan.
9. Jika duplikat, status menjadi DUPLICATE dengan referensi laporan utama.
10. Jika ditutup, status menjadi CLOSED; sejarah tetap tersimpan.

### 4.2 Triase dan Eskalasi Darurat
Status triase:
- PENDING
- PRIORITY_ASSESSED
- ESCALATED
- REFERRED
- NO_ACTION_WITH_REASON

Proses:
- Verifikator menilai urgensi dan validitas.
- Jika ada indikasi ancaman jiwa, eskalasi dilakukan secepatnya.
- Waktu eskalasi, penerima, dan konfirmasi penerimaan dicatat.
- Jalur cadangan disiapkan jika penerima tidak merespons.
- Eskalasi tidak otomatis berarti laporan valid.

### 4.3 Penetapan Insiden
Status insiden:
- MONITORING
- RESPONSE_ACTIVATED
- RESPONSE_ONGOING
- RESPONSE_SUSPENDED
- RESPONSE_COMPLETED
- CLOSED

Aturan:
- Laporan dan insiden adalah entitas berbeda.
- Satu insiden dapat memiliki banyak laporan dan assessment.
- Status operasi dan administratif dapat dipisahkan bila diperlukan.

### 4.4 Penugasan dan Assessment
Status assessment:
- NOT_ASSIGNED
- ASSIGNED
- ACKNOWLEDGED
- IN_PROGRESS
- SUBMITTED
- NEEDS_REVISION
- APPROVED
- REJECTED
- CANCELLED
- REASSIGNED

Aturan:
- tidak ada assignment aktif ganda tanpa kontrol
- assessor tidak bisa menyetujui assessment sendiri tanpa permission tambahan
- revisi menghasilkan versi baru, bukan overwrite data lama

### 4.5 Program dan Kebutuhan
Status program:
- DRAFT
- IN_REVIEW
- APPROVED
- ACTIVE
- ON_HOLD
- COMPLETED
- CANCELLED

Kebutuhan dibuat per item dan mencakup:
- ID kebutuhan
- program
- kategori kebutuhan
- kuantitas
- satuan
- prioritas
- lokasi
- sumber pemenuhan
- status pelaksanaan
- riwayat perubahan

### 4.6 Pengadaan, Logistik, dan Distribusi
Status distribusi:
- DRAFT
- APPROVED
- PICKING
- DISPATCHED
- PARTIALLY_RECEIVED
- RECEIVED
- RECONCILIATION_PENDING
- COMPLETED
- CANCELLED

Barang keluar hanya dapat dilakukan bila ada:
- permintaan atau otorisasi yang sah
- OPERATION_ORDER_ID atau perintah bencana
- tujuan pengiriman
- surat jalan (dispatch note)
- kontrol stok yang sah

Barang keluar wajib memiliki:
- DISPATCH_NOTE_ID
- OPERATION_ORDER_ID
- INCIDENT_ID atau PROGRAM_ID
- asal gudang
- tujuan
- daftar barang
- kuantitas
- petugas pengirim
- petugas penerima
- waktu
- status
- bukti pengiriman
- bukti penerimaan
- catatan selisih / kerusakan

Aturan:
- barang keluar tanpa surat jalan tidak sah
- surat jalan harus sesuai dengan ID perintah bencana dan tujuan
- penerimaan sebagian harus dicatat sebagai PARTIALLY_RECEIVED

### 4.7 Keuangan
Status transaksi keuangan:
- DRAFT
- SUBMITTED
- REVIEWED
- APPROVED
- PAID
- REJECTED
- REVERSED
- RECONCILED

Aturan:
- saldo tidak dihitung dari angka yang diketik manual saja
- transaksi yang disahkan tidak dihapus; dibuat koreksi/reversal
- maker-checker dipakai bila dibutuhkan
- segregation of duties diterapkan antar maker dan checker

### 4.8 Volunteer dan Absensi
Volunteer memiliki profil, kompetensi, ketersediaan, dan persetujuan data.
Absensi membedakan:
- kehadiran fisik yang diverifikasi
- pelaporan mandiri

Aturan:
- GPS bukan bukti kehadiran yang mutlak
- pengumpulan lokasi tidak boleh terjadi terus-menerus tanpa dasar kebijakan dan persetujuan

### 4.9 Dokumentasi, LPJ, dan Penutupan Operasi
LPJ minimal berisi:
- ringkasan kejadian
- dasar pelaksanaan
- tujuan
- tim dan penugasan
- kronologi
- hasil kaji cepat
- program dan realisasi
- penerima manfaat sesuai kebijakan
- bantuan masuk dan keluar
- stok dan saldo barang
- pengadaan
- penerimaan dana dan pengeluaran
- bukti transaksi
- dokumentasi
- capaian indikator
- kendala
- evaluasi
- rekomendasi
- kebutuhan lanjutan
- pengesahan

Status LPJ:
- DRAFT
- IN_REVIEW
- APPROVED
- FINAL
- ARCHIVED

Penutupan operasi hanya terjadi bila:
- semua tugas penting selesai atau dialihkan
- distribusi dan selisih direkonsiliasi
- stok dan pengembalian tercatat
- transaksi dan bukti direkonsiliasi
- LPJ final tersedia
- approval pejabat berwenang tersedia
- arsip dokumen lengkap

## 5. Role dan Hak Akses
### SUPERADMIN
- konfigurasi sistem
- role dan permission
- organisasi, unit, wilayah, master data
- audit sistem
- tidak otomatis mengubah transaksi yang sudah disahkan

### ADMIN
- master data dan pengguna
- assessor, koordinator, volunteer, kategori bantuan, satuan, gudang, lokasi
- tidak otomatis berwenang menyetujui anggaran atau menutup operasi

### PIMPINAN
- dashboard ringkasan
- review status insiden dan program
- approval strategis
- review LPJ dan penutupan operasi

### VERIFIKATOR
- validasi laporan
- klarifikasi
- duplikat
- reject
- meneruskan laporan valid ke triase

### ASESOR
- hanya task assessment yang relevan
- menerima tugas
- mengisi kaji cepat
- submit hasil assessment
- tidak otomatis dapat menyetujui assessment sendiri

### KOORDINATOR_LAPANGAN
- mengelola tim dan tugas
- absensi dan mobilisasi
- laporan situasi dan lapangan
- kebutuhan lapangan dan distribusi

### KEUANGAN
- anggaran, transaksi, bukti, rekonsiliasi
- laporan realisasi
- tidak mengubah transaksi final tanpa koreksi dan alasan

### LOGISTIK
- stok, penerimaan, mutasi, picking, pengiriman, pengembalian
- gudang dan rak
- tidak bisa mengubah stok tanpa transaksi sah

### DONATUR
- melihat proposal dan program yang relevan
- melihat target dan realisasi yang diizinkan publikasi
- tidak akses data korban, rekening, atau data sensitif internal

### AUDITOR
- akses baca sesuai lingkup audit
- melihat histori, bukti, transaksi, dan perubahan
- tidak mengubah data operasional

### VOLUNTEER
- melihat tugas dan jadwal
- absensi dan laporan tugas
- tidak akses data sensitif penerima bantuan

### PUBLIC / PELAPOR
- mengirim laporan
- melihat status tiket aman
- tidak akses dashboard internal

## 6. Audit Trail dan Security
Setiap perubahan material harus mencatat:
- actor_id
- waktu server
- jenis tindakan
- entitas
- ID entitas
- status sebelum dan sesudah
- alasan
- referensi approval
- correlation ID
- hasil tindakan

Aturan:
- password, token, secret, dan data sensitif tidak disimpan di log biasa
- log audit tidak boleh diubah oleh user biasa
- idempotency diterapkan untuk mencegah double submit, stok ganda, transaksi ganda, dan notifikasi berulang

## 7. Dashboard Per Role
- Superadmin: status sistem, pengguna, role, audit, master data
- Admin: pengguna, master data, tugas administratif, kelengkapan data
- Pimpinan: laporan masuk, incident aktif, prioritas tinggi, program aktif, kebutuhan belum terpenuhi, LPJ
- Verifikator: antrean verifikasi, laporan baru, klarifikasi, prioritas tinggi
- Asesor: tugas assessment, surat tugas, status penerimaan, draft assessment
- Koordinator Lapangan: tim, absensi, kebutuhan lapangan, distribusi, laporan situasi
- Keuangan: anggaran, transaksi, approval, saldo, realisasi
- Logistik: stok, barang masuk/keluar, distribusi, selisih, kerusakan
- Donatur: proposal, program, target-realisasi, update kegiatan
- Auditor: aktivitas pemeriksaan, bukti, temuan
- Volunteer: tugas aktif, jadwal, absensi, laporan
- Public: formulir laporan, status tiket, informasi publik

## 8. Keputusan yang Masih Diperlukan (TBD)
Sebelum implementasi dimulai, Product Owner harus menyetujui:
- framework utama frontend dan backend
- auth provider final
- apakah offline-first masuk MVP
- apakah donor/public access masuk MVP atau fase berikutnya
- prioritas modul implementasi
- strategi geospasial dan map provider
- payment gateway donor jika dibutuhkan
- pembagian role per fase

## 9. Prioritas Implementasi
### Prioritas 1
- laporan
- verifikasi
- triase
- incident
- assessment
- task assignment

### Prioritas 2
- program
- kebutuhan
- logistik
- distribusi
- surat jalan

### Prioritas 3
- keuangan
- audit trail
- LPJ
- penutupan operasi

### Prioritas 4
- donor/public access
- offline-first, jika disetujui

## 10. Kesimpulan
Dokumen ini merupakan spesifikasi final yang disetujui Product Owner untuk menjadi dasar sebelum implementasi aplikasi dimulai. Repository saat ini masih berada pada tahap baseline dokumentasi dan desain, bukan implementasi nyata. Dokumen ini menjadi acuan bagi developer, QA, reviewer teknis, dan reviewer keamanan.
