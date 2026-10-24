# Keuangan: Catatan Rutin, Pemasukan, Pengeluaran, Saldo, dan Keterkaitan dengan Insiden/Program

Status: Final reference untuk developer dan QA
Tanggal: 2026-10-24

## 1. Tujuan
Dokumen ini menjadi acuan kerja untuk modul keuangan agar sistem menangani:
- pencatatan rutin keuangan
- pemasukan dana
- pengeluaran dana
- saldo berjalan
- keterkaitan transaksi dengan insiden dan program
- keterangan kegiatan atas uang masuk dan keluar
- kebutuhan pembelian barang serta operasional selama penanganan insiden/program

Tujuan utamanya adalah agar semua transaksi keuangan bersifat:
- terdokumentasi
- dapat ditelusuri
- terikat pada incident/program yang relevan
- dapat direkonsiliasi
- audit friendly
- mudah dipantau oleh admin, keuangan, pimpinan, dan auditor

## 2. Prinsip utama modul keuangan
- Semua transaksi harus tertaut ke incident dan/atau program bila relevan.
- Semua uang masuk dan keluar harus memiliki deskripsi kegiatan yang jelas.
- Semua transaksi harus punya status dan bukti pendukung.
- Semua saldo dihitung dari transaksi yang valid dan sudah approved.
- Pembayaran operasional insiden/program harus dapat dilacak dari kebutuhan barang sampai penggunaan dana.
- Semua mutasi harus masuk audit log.

## 3. Struktur dasar pencatatan keuangan

### 3.1 Aktivitas keuangan yang dicatat
- pemasukan dana rutin
- pengeluaran rutin operasional
- pemasukan dana insiden/program
- pengeluaran untuk kebutuhan barang
- pengeluaran untuk operasional penanganan insiden/program
- pengeluaran untuk distribusi dan kebutuhan lapangan
- pengembalian / reversal / koreksi
- saldo akhir

### 3.2 Kategori umum keuangan
- Pemasukan
  - donasi
  - hibah
  - transfer internal
  - pendapatan lain yang sah
- Pengeluaran
  - kebutuhan barang
  - transportasi
  - logistik
  - perlengkapan lapangan
  - operasional program
  - distribusi bantuan
  - biaya administratif
  - pengeluaran tak terduga yang telah disetujui

## 4. Model data utama keuangan

### 4.1 finance_accounts
Untuk rekening atau sumber dana.
Field utama:
- id
- account_code
- account_name
- account_type
- currency
- status
- parent_account_id
- created_at
- updated_at

Contoh:
- Kas umum
- Kas program darurat
- Dana khusus insiden
- Dana donasi
- Dana operasional

### 4.2 finance_transactions
Tabel inti pencatatan uang masuk dan keluar.
Field utama:
- id
- transaction_no
- account_id
- incident_id
- program_id
- need_item_id
- category
- entry_type
- amount
- currency
- transaction_date
- description
- source_ref
- document_ref
- payment_method
- status
- approved_by
- approved_at
- created_by
- created_at
- updated_at

Keterangan:
- entry_type: INCOME atau EXPENSE
- category: DONATION, PURCHASE, OPERATIONAL, DISTRIBUTION, TRANSPORT, ADMIN, REVERSAL, ETC
- source_ref: referensi sumber dana / dokumen pendukung
- document_ref: nomor bukti / nota / transfer / kwitansi
- status: DRAFT, SUBMITTED, REVIEWED, APPROVED, PAID, REJECTED, REVERSED, RECONCILED

### 4.3 finance_transaction_lines
Untuk transaksi yang detailnya lebih dari satu item / komponen.
Field utama:
- id
- transaction_id
- item_name
- quantity
- unit_price
- subtotal
- description
- reference_id
- created_at

Dipakai untuk:
- pembelian kebutuhan barang banyak item
- breakdown biaya operasional
- rincian distribusi barang yang dibeli
- rincian pendapatan yang berasal dari beberapa sumber

### 4.4 finance_balance_snapshot
Ringkasan saldo per akun / per incident / per program.
Field utama:
- id
- account_id
- incident_id
- program_id
- period_month
- opening_balance
- income_total
- expense_total
- closing_balance
- updated_at

Dipakai untuk dashboard saldo cepat dan laporan bulanan.

### 4.5 incident_need_items
Tabel pendukung kebutuhan barang dan kebutuhan operasional untuk penanganan insiden/program.
Field utama:
- id
- incident_id
- program_id
- item_name
- category
- quantity
- unit
- unit_price_estimate
- total_estimate
- priority
- status
- procurement_status
- created_at
- updated_at

Tujuan:
- langsung dapat dipilih saat transaksi pengeluaran dibuat
- bisa berhubungan dengan biaya pembelian kebutuhan barang
- data ini memungkinkan klik dari insiden ke daftar kebutuhan transaksi dan nilai uang

### 4.6 incident_program_cost_summary
Ringkasan biaya per insiden/program untuk operasi dan kebutuhan.
Field utama:
- id
- incident_id
- program_id
- total_budget
- total_realized
- total_spent
- total_remaining
- updated_at

## 5. Keterkaitan dengan insiden dan program
Sistem harus memungkinkan user membuka insiden lalu langsung melihat data berikut:
- kebutuhan barang terkait insiden/program
- transaksi pengeluaran untuk kebutuhan tersebut
- transaksi operasional terkait insiden/program
- saldo insiden atau program
- ringkasan aktivitas keuangan

### 5.1 Hubungan penting
- satu insiden punya banyak transaksi keuangan
- satu program punya banyak transaksi keuangan
- satu insiden bisa punya banyak program
- satu program dapat punya banyak kebutuhan barang / cost items
- satu transaksi dapat terkait ke incident_id, program_id, need_item_id
- satu transaksi bisa terkait ke lebih dari satu kebutuhan bila memang satu pembelian mencakup beberapa kebutuhan

### 5.2 Alur klik data insiden ke keuangan
Contoh alur yang benar:
1. Buka insiden X
2. Lihat daftar kebutuhan barang terkait insiden X
3. Klik kebutuhan barang tertentu
4. Sistem menampilkan transaksi keuangan yang berkaitan
5. User juga melihat operasional program / insiden selama penanganan
6. User melihat saldo total insiden/program
7. User bisa menelusuri dokumen nota / bukti / kwitansi

## 6. Detail pencatatan uang masuk dan uang keluar

### 6.1 Uang masuk (income)
Harus mencatat:
- tanggal masuk
- sumber dana
- jumlah
- currency
- keterangan kegiatan
- insiden/program terkait bila ada
- penerima / petugas yang valid
- bukti transfer/kwitansi
- status

Contoh jenis:
- donasi program
- transfer dana operasional
- dana bantuan khusus insiden
- refund / koreksi kredit

### 6.2 Uang keluar (expense)
Harus mencatat:
- tanggal pengeluaran
- keperluan / kegiatan
- jumlah
- currency
- vendor / pihak yang menerima
- kebutuhan barang / program / incident yang terkait
- bukti pembelian / nota / kwitansi / bukti pembayaran
- status
- approver

Contoh jenis:
- pembelian sembako / peralatan / obat / bahan material
- operasional lapangan
- transportasi
- logistik dan distribusi
- honor / task support
- kebutuhan khusus insiden

## 7. Kriteria detail yang harus ada pada setiap transaksi
Setiap transaksi keuangan wajib memiliki:
- nomor transaksi
- tanggal transaksi
- kategori transaksi
- description kegiatan
- incident_id bila terkait insiden
- program_id bila terkait program
- need_item_id bila berkaitan dengan pembelian kebutuhan barang
- amount
- currency
- status
- bukti dokumen
- siapa yang membuat
- siapa yang menyetujui
- siapa yang memposting / mengakui transaksi

## 8. Status transaksi keuangan
Status yang disarankan:
- DRAFT
- SUBMITTED
- REVIEWED
- APPROVED
- PAID
- REJECTED
- REVERSED
- RECONCILED

Valid transition:
- DRAFT -> SUBMITTED
- SUBMITTED -> REVIEWED
- REVIEWED -> APPROVED
- APPROVED -> PAID
- PAID -> RECONCILED
- APPROVED -> REJECTED
- APPROVED -> REVERSED
- PAID -> REVERSED

Harus ada audit log untuk:
- create transaksi
- approval
- rejection
- reversal
- reconciliation
- payment confirmation

## 9. Kebutuhan barang dan biaya operasional pada insiden/program
Modul keuangan harus terhubung langsung ke kebutuhan barang dan kebutuhan operasional.

### 9.1 Contoh hubungan kebutuhan ke pengeluaran
- Kebutuhan barang: sembako 200 paket
- nilai estimasi: Rp 120.000.000
- saat dibuat pengeluaran, sistem dapat memilih need_item_id
- sistem otomatis menampilkan nilai kebutuhan yang dikaitkan
- transaksi pengeluaran bisa diatur sesuai kebutuhan terkait

### 9.2 Contoh kebutuhan dasar yang harus terdata
- kebutuhan bahan makanan
- kebutuhan obat-obatan
- kebutuhan alat kerja lapangan
- kebutuhan transportasi
- kebutuhan perlengkapan evakuasi
- kebutuhan operasional program
- kebutuhan distribusi bantu

### 9.3 Output yang diharapkan
Saat user membuka insiden atau program, sistem harus mampu menampilkan:
- total kebutuhan barang
- total estimasi kebutuhan
- total realisasi pengeluaran
- total saldo tersisa
- daftar item kebutuhan
- daftar transaksi pengeluaran per item
- daftar kebutuhan yang sudah dibeli / belum dibeli

## 10. Pencatatan saldo rutin
Saldo dihitung berdasarkan:
- saldo awal
- penerimaan dana
- pengeluaran yang sudah approved dan dibayar
- koreksi / reversal

Formula dasar:
- saldo akhir = saldo awal + total pemasukan - total pengeluaran

Sistem harus memiliki:
- saldo harian
- saldo bulanan
- saldo per akun
- saldo per insiden/program
- saldo per kategori kebutuhan

## 11. Rekonsiliasi dan validasi
Sebelum transaksi final dipastikan:
- nominal valid
- bukti dokumen ada
- ada linkage ke insiden/program bila relevan
- role pengaju dan approver valid
- tidak ada duplikasi nomor transaksi
- saldo yang terpotong sesuai dengan kebutuhan terdata

Rekonsiliasi harus memungkinkan:
- melihat transaksi yang belum dibayar
- melihat transaksi yang sudah dibayar
- membandingkan kebutuhan vs pembelian
- melihat selisih penggunaan dana
- melihat item yang belum diproses

## 12. Dokumentasi pendukung wajib
Setiap transaksi harus memiliki dokumen pendukung minimal:
- bukti transfer
- nota pembelian
- kwitansi
- bukti operasional
- surat tugas / surat perintah terkait jika ada
- laporan penggunaan dana
- foto / dokumentasi untuk kebutuhan barang dan distribusi

## 13. Audit dan keamanan keuangan
Semua operasi keuangan harus memiliki:
- actor_id
- entity_name
- entity_id
- action_type
- previous_status
- new_status
- reason
- approval_ref
- correlation_id
- created_at

Operasi kritis yang wajib audit:
- create transaksi
- approve transaksi
- reject transaksi
- reverse transaksi
- reconcile transaksi
- payment confirmation
- reversal after approval

## 14. Ringkasan use case yang wajib ada
### 14.1 Kas rutin
- Input pemasukan kas rutin
- Input pengeluaran rutin operasional
- Lihat saldo berjalan
- Lihat daftar transaksi harian / bulanan

### 14.2 Keuangan insiden
- Input dana khusus insiden
- Input pembelian kebutuhan barang untuk insiden
- Input biaya operasional saniter, transportasi, logistik, dll
- Lihat saldo insiden
- Lihat kebutuhan vs realisasi
- Klik incident id untuk melihat detail transaksi

### 14.3 Keuangan program
- Input kebutuhan program yang sudah disetujui
- Input biaya / barang program
- Input operasional program
- Lihat saldo program
- Lihat kebutuhan barang dan nilai yang sudah dibelanjakan

### 14.4 Laporan dan evaluasi
- laporan transaksi per hari / bulan
- laporan pemasukan vs pengeluaran
- laporan per incident/program
- laporan saldo akhir
- laporan kebutuhan barang dan nilai realisasi
- ringkasan bahan evaluasi rapat penutupan program

## 15. Kesimpulan final
Modul keuangan harus mampu menangani:
- pencatatan rutin
- pemasukan dan pengeluaran
- saldo berjalan
- keterkaitan dengan insiden dan program
- keterangan kegiatan atas uang masuk dan keluar
- kebutuhan pembelian barang dan operasional
- laporan yang dibutuhkan untuk evaluasi rapat dan penutupan program

Semua data harus dapat ditelusuri dari:
- insiden
- program
- kebutuhan item
- transaksi keuangan
- bukti dokumen
- audit log

Dengan pendekatan ini, sistem keuangan jadi tidak hanya ledger sederhana, tetapi menjadi sumber kebenaran operasional untuk penanganan insiden dan program.
