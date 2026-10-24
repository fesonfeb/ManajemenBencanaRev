# QA Workflow dan Lifecycle Program dari Laporan Bencana sampai Penutupan

Status: Final draft untuk foundation implementasi dan validasi workflow
Tanggal: 2026-10-24

## 1. Tujuan
Dokumen ini mencatat hasil validasi workflow inti untuk sistem manajemen bencana, termasuk:
- otorisasi akses (auth + RBAC)
- validasi status workflow
- audit trail untuk semua mutasi penting
- lifecycle program setelah bencana dilaporkan dan disetujui berdasarkan kaji cepat lapangan
- keluaran akhir program yang menjadi bahan evaluasi rapat sebelum insiden/program ditutup

## 2. Prinsip validasi yang sudah diuji
- Semua endpoint protected harus memerlukan session valid.
- Semua endpoint write harus dicek permission di backend.
- Semua cek scope harus dijalankan di backend.
- Semua perubahan status harus menulis audit log.
- Semua workflow kritis harus memiliki validasi state transition.
- Semua akses donor/public harus dibatasi sesuai visibility policy.
- Semua transaksi keuangan dan distribusi harus memiliki bukti dan rekonsiliasi.

## 3. Checklist QA formal (ringkasan yang sudah ditetapkan)

### 3.1 Auth & session
- [x] Login dengan user valid berhasil
- [x] Login dengan password salah gagal
- [x] Token invalid/expired gagal 401
- [x] Request tanpa token gagal 401
- [x] Logout menghapus session
- [x] User valid dapat membaca profil sendiri

### 3.2 RBAC umum
- [x] SUPERADMIN memiliki akses spesifik untuk semua area yang diizinkan
- [x] ADMIN dapat mengelola dan mengecek area operasional
- [x] PIMPINAN dapat melihat ringkasan, approval, dan data strategic summary
- [x] VERIFIKATOR dapat mengelola laporan dan triase dalam scope yang valid
- [x] ASESOR hanya dapat mengakses assessment yang ditugaskan
- [x] KOORDINATOR_LAPANGAN dapat mendelegasikan tugas dan mengelola kebutuhan program
- [x] KEUANGAN hanya dapat melihat dan memproses transaksi keuangan yang sesuai kewenangan
- [x] LOGISTIK hanya mengakses inventory, camp dan distribusi dalam scope
- [x] AUDITOR hanya bisa read audit trail dan data monitoring yang sesuai
- [x] DONATUR hanya melihat data yang sudah diizinkan publikasi
- [x] PUBLIC hanya bisa submit laporan dan melihat status yang diizinkan

### 3.3 Scope enforcement
- [x] User dari org A tidak dapat mengakses org B
- [x] User unit A tidak dapat melihat data unit B
- [x] User incident X tidak dapat mengakses incident Y
- [x] User program P1 tidak dapat membuka program P2
- [x] User task T1 tidak dapat melihat task T2
- [x] Data keuangan difilter berdasarkan incident/program yang relevan

### 3.4 Workflow core
- [x] Report workflow valid
- [x] Incident workflow valid
- [x] Assessment workflow valid
- [x] Task workflow valid
- [x] Inventory workflow valid
- [x] Finance workflow valid
- [x] LPJ, closure, dan audit log valid

## 4. Workflow program setelah laporan bencana diterima dan disetujui

### 4.1 Trigger dan input awal
Sebuah program baru dapat dimulai setelah:
- laporan bencana diterima
- hasil verifikasi/triase selesai
- kaji cepat lapangan disetujui
- insiden dideklarasikan atau ditetapkan status aktif

Alur yang disetujui:
1. Laporan masuk
2. Verifikasi dan triase
3. Kajian cepat lapangan
4. Approval kaji cepat
5. Incident aktif
6. Program dibuat
7. Program dikerjakan dan dimonitor
8. Distribusi dan kebutuhan barang dipenuhi
9. Keuangan, logistik, dan tugas tercatat dengan audit
10. Evaluasi akhir
11. Rapat penutupan program/insiden
12. LPJ dan closure checklist final

### 4.2 Bentuk program yang harus dibuat
Program harus dibuat dengan data berikut:
- Nama program
- Tipe program (darurat, bantuan, rehabilitasi, pemulihan, pendampingan, dll)
- Incident terkait
- Lokasi program
- Target kelompok / sasaran
- Waktu pelaksanaan
- Koordinator program
- Sumber anggaran
- Status program
- Kebutuhan barang/jasa
- To do per tugas

### 4.3 Detail output program yang wajib disiapkan
Setiap program harus memiliki komponen berikut:

#### a. Master program
- program_id
- incident_id
- name
- background
- objective
- target_group
- location_id
- coordinator_id
- schedule_start
- schedule_end
- status
- created_by
- created_at
- updated_at

#### b. To do / task plan
- task_id
- incident_id
- task_type
- assignee_id
- coordinator_id
- deadline_at
- instructions
- location_id
- status

#### c. Kebutuhan barang dan kebutuhan program
- need_items.id
- program_id
- category
- quantity
- unit
- priority
- source_type
- status
- remaining_quantity

#### d. Kebutuhan distribusi
- dispatch_notes
- distributions
- distribution_items
- warehouse dan lokasi tujuan
- status dispatch
- status receive
- kesesuaian stok

#### e. Anggaran dan keuangan
- financial_transactions
- source_of_funds
- amount
- payment_method
- status
- reference_no
- attachment dokumentasi

#### f. Program report masuk LPJ
- LPJ final
- closure_checklists
- ringkasan realisasi
- evaluasi output
- catatan pembelajaran
- rekomendasi penutupan

## 5. Lifecycle lengkap program dari persetujuan kaji cepat sampai penutupan

### Tahap 1: Laporan masuk dan verifikasi
- Input: laporan insiden / kejadian bencana
- Status: RECEIVED -> IN_REVIEW -> ACCEPTED
- Output: data kejadian terverifikasi
- Aksi: buat incident jika disetujui

### Tahap 2: Kajian cepat lapangan
- Tim lapangan melakukan assessment
- Hasil assessment menjadi dasar kebutuhan program
- Status assessment: ASSIGNED -> ACKNOWLEDGED -> IN_PROGRESS -> SUBMITTED -> APPROVED
- Output: kebutuhan utama berdasarkan real condition lapangan

### Tahap 3: Pembentukan program
- Program dibuat dengan nama jelas dan sasaran jelas
- program name harus merefleksikan kebutuhan yang disetujui
- status awal: DRAFT
- setelah review: APPROVED / ACTIVE

### Tahap 4: Pemecahan tugas (To do list)
Program dibagi menjadi tugas operasional seperti:
- koordinasi lapangan
- survey kebutuhan
- pengadaan barang
- pengecekan gudang
- pendistribusian barang
- koordinasi keuangan
- monitoring program
- dokumentasi foto/dokumen
- rapat evaluasi mingguan

Setiap tugas terhubung ke:
- incident_id
- program_id
- assignee_id
- deadline_at
- status
- audit log

### Tahap 5: Kebutuhan barang dan stok
- Kebutuhan barang dibuat berdasarkan hasil kaji cepat
- Kebutuhan dikelompokkan per kategori, prioritas, lokasi, dan sumber
- Kebutuhan dapat dipenuhi dari:
  - stok internal
  - pembelian / pembelian cepat
  - donasi / bantuan
  - transfer antar gudang

Semua perubahan stok dan pengeluaran barang harus:
- tercatat di stock_movements
- memiliki referensi dokumen
- dikaitkan dengan dispatch_note atau distribusi
- disertai audit log

### Tahap 6: Distribusi
Setelah barang siap:
- dispatch note dibuat
- barang dipersiapkan dan dikeluarkan dari gudang
- distribusi dilakukan ke lokasi atau penerima yang valid
- distribusi dapat berupa:
  - individu
  - keluarga
  - kelompok masyarakat
  - lembaga/instansi terkait
  - fasilitas lokasi bantuan

Setiap distribusi harus memiliki:
- distribusi_id
- incident_id
- program_id
- dispatch_note_id
- destination_type
- beneficiary_org / beneficiary_name
- quantity_sent
- quantity_received
- discrepancy_note jika ada
- dokumentasi penerimaan

### Tahap 7: Keuangan
Seluruh proses keuangan harus terdokumentasi dengan prinsip:
- input transaksi sesuai kebutuhan program
- approval sesuai role
- bukti transaksi dilampirkan
- status transaksi terdokumentasi
- reversal jika ada koreksi

Transaksi keuangan yang wajib terikat pada program/insiden:
- pembelian kebutuhan barang
- pengiriman logistik
- hibah/donatur
- bantuan operasional
- reimburse / pembiayaan perjalanan

### Tahap 8: Monitoring dan evaluasi program
Selama program berjalan, sistem harus mencatat:
- progres tugas
- ketercapaian target
- kebutuhan revisi
- pembaruan stok
- realisasi anggaran
- distribusi selesai atau masih berjalan
- kendala operasional

Evaluasi dilakukan dengan fokus:
- apakah kebutuhan benar-benar terpenuhi
- apakah distribusi sesuai target
- apakah program relevan dengan kondisi lapangan
- apakah anggaran dan kebutuhan konsisten
- apakah ada shortcut atau kekurangan yang harus diperbaiki

### Tahap 9: Finalisasi dan persiapan penutupan
Sebelum insiden/program ditutup, pihak terkait harus menyiapkan:
- ringkasan semua tugas yang sudah selesai
- kebutuhan yang telah terpenuhi
- barang yang masih sisa / belum dipakai
- distribusi final dan penerimaan
- realisasi keuangan
- LPJ program
- closure checklist
- evaluasi rapat akhir

Harus ada dokumen final yang berisi:
- nama program
- tujuan awal
- target dan realisasi
- daftar kebutuhan barang
- daftar distribusi
- total anggaran dan realisasi
- kendala dan pembelajaran
- rekomendasi penutupan

## 6. Struktur final bahan evaluasi rapat sebelum penutupan

### 6.1 Komponen yang wajib hadir dalam rapat final
- Ringkasan bencana / insiden
- Ringkasan program yang dijalankan
- Nama program dan sasaran program
- To do / daftar tugas yang selesai dan masih open
- Rangkuman kebutuhan barang
- Rangkuman stok masuk/keluar
- Distribusi final dan penerima manfaat
- Keuangan final dan status review
- Masalah operasional / kendala / risiko
- Rekomendasi tindak lanjut
- Keputusan apakah program siap ditutup atau perlu perpanjangan

### 6.2 Hasil keputusan final rapat
Akhir dari rapat penutupan dapat menghasilkan salah satu keputusan:
- program ditutup dengan LPJ final
- program ditutup dengan catatan koreksi
- program diperpanjang dengan scope baru
- incident ditutup setelah semua program dan audit terpenuhi

### 6.3 Dokumen yang harus dibuat sebelum penutupan
- LPJ final
- closure checklist approved
- audit log ringkasan
- final reconciliation for finance
- final stock reconciliation
- final distribution summary
- final task completion report
- notulensi rapat penutupan

## 7. Rule final yang sudah disetujui
- Program tidak boleh dibuat tanpa incident aktif dan approval kaji cepat.
- Semua tugas dan kebutuhan program harus punya penanggung jawab jelas.
- Semua barang harus terkait dengan kebutuhan program dan stok yang valid.
- Semua distribusi harus punya bukti, legal reference, dan status penerimaan.
- Semua biaya harus ada dokumen pendukung dan approval.
- Semua aktifitas program harus dicatat dalam audit log.
- Program yang akan ditutup harus melalui evaluasi akhir dan approval final.

## 8. Kesimpulan
Workflow yang sudah diuji dan ditetapkan adalah workflow yang komprehensif dan melibatkan:
- laporan bencana
- verifikasi dan triase
- kaji cepat lapangan
- approval insiden/program
- identifikasi kebutuhan barang dan kebutuhan tugas
- pembagian to do list
- pengadaan dan distribusi
- monitoring keuangan dan logistik
- evaluasi program
- finalisasi LPJ
- penutupan insiden/program melalui rapat final

Semua tahap tersebut harus ditutup dengan log audit, status valid, dan dokumen final yang siap dibawa ke rapat evaluasi penutupan.
