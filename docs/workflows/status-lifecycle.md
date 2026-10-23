# Status Lifecycle Detail

Dokumen ini memperjelas lifecycle per status yang perlu dipisahkan sesuai domain operasional. Tujuan dokumentasi ini adalah memastikan bahwa status tidak dipaksa menjadi satu lifecycle tunggal.

## 1. Entitas utama dan status dasar

### 1.1 Laporan publik
Status dasar yang disarankan:
- draft
- submitted
- under_review
- verified
- rejected
- duplicated
- canceled

Prinsip:
- laporan adalah objek masuk yang menjadi sumber data operasional
- status laporan tidak otomatis sama dengan status insiden
- revisi harus dicatat sebagai perubahan formal, bukan overwrite

### 1.2 Insiden
Status dasar yang disarankan:
- created
- validated
- active
- monitored
- closed
- reopened
- archived

Prinsip:
- insiden berfungsi sebagai unit kejadian operasional
- status insiden terkait dengan akuntabilitas kejadian, bukan hanya laporan

### 1.3 Assessment
Status dasar yang disarankan:
- draft
- assigned
- in_progress
- submitted
- under_review
- approved
- returned
- rejected
- archived

Prinsip:
- assessment memiliki lifecycle tersendiri karena hasilnya dapat dikembalikan atau ditolak
- revisi assessment harus tetap mempertahankan jejak bukti

### 1.4 Rencana respons
Status dasar yang disarankan:
- draft
- reviewed
- approved
- revised
- rejected
- active
- completed
- canceled

Prinsip:
- rencana respons harus mendapat persetujuan pimpinan sesuai kebijakan
- persetujuan dan revisi tidak boleh dihapus dari audit trail

### 1.5 Kegiatan operasional
Status dasar yang disarankan:
- planned
- assigned
- in_progress
- paused
- completed
- delayed
- canceled

Prinsip:
- kegiatan adalah eksekusi operasional yang terikat pada rencana respons

### 1.6 Pengadaan / kebutuhan / anggaran
Status dasar yang disarankan:
- requested
- reviewed
- approved
- ordered
- received
- rejected
- canceled

Prinsip:
- pengadaan harus terpisah dari rencana respons tetapi terkait secara traceable

### 1.7 Distribusi
Status dasar yang disarankan:
- planned
- prepared
- in_transit
- delivered
- partially_delivered
- failed
- closed

Prinsip:
- distribusi harus punya bukti penyerahan dan traceability terhadap penerima manfaat

### 1.8 LPJ
Status dasar yang disarankan:
- draft
- in_review
- approved
- final
- revised
- rejected

Prinsip:
- LPJ final hanya boleh diubah melalui mekanisme revisi formal yang terdokumentasi

### 1.9 Pemulihan pasca bencana
Status dasar yang disarankan:
- identified
- planned
- active
- monitored
- completed
- archived

Prinsip:
- pemulihan adalah alur tindak lanjut terpisah setelah operasi utama selesai

## 2. Aturan lifecycle umum
Setiap lifecycle wajib memiliki:
- status asal
- status tujuan
- actor berwenang
- prasyarat
- data wajib
- alasan perubahan
- notifikasi
- audit trail
- mekanisme gagal / reject / revisi

## 3. Contoh transisi valid utama

### 3.1 Laporan
- draft -> submitted oleh pelapor atau operator
- submitted -> under_review oleh verifikator
- under_review -> verified oleh verifikator
- under_review -> rejected oleh verifikator
- verified -> duplicated oleh admin atau verifikator
- verified -> active incident oleh verifikator / koordinator

### 3.2 Insiden
- created -> validated oleh verifikator
- validated -> active oleh koordinator / admin
- active -> monitored oleh koordinator
- active -> closed oleh pimpinan atau otoritas yang ditetapkan
- closed -> reopened oleh admin / otoritas yang ditetapkan

### 3.3 Assessment
- draft -> assigned oleh koordinator / verifikator
- assigned -> in_progress oleh asesor
- in_progress -> submitted oleh asesor
- submitted -> under_review oleh verifikator
- under_review -> approved oleh verifikator / pimpinan tergantung kebijakan
- under_review -> returned oleh verifikator dengan alasan jelas
- approved -> archived oleh admin/system

### 3.4 Rencana respons
- draft -> reviewed oleh koordinator atau tim teknis
- reviewed -> approved oleh pimpinan
- approved -> active oleh koordinator
- active -> revised oleh koordinator atau pimpinan dengan alasan formal
- approved -> rejected oleh pimpinan dengan alasan formal

### 3.5 Kegiatan
- planned -> assigned oleh koordinator
- assigned -> in_progress oleh petugas atau relawan
- in_progress -> completed oleh penanggung jawab kegiatan
- in_progress -> paused oleh koordinator
- paused -> resumed atau canceled

### 3.6 Distribusi
- planned -> prepared oleh logistik
- prepared -> in_transit oleh logistik
- in_transit -> delivered oleh petugas distribusi
- delivered -> closed oleh koordinator / admin
- delivered -> failed dengan alasan dokumentasi

### 3.7 LPJ
- draft -> in_review oleh koordinator / admin keuangan / auditor
- in_review -> approved oleh pimpinan atau administrator yang berwenang
- approved -> final oleh admin / person in charge
- final -> revised dengan mekanisme formal

## 4. Aturan revisi dan pengecualian
- revisi tidak berarti overwrite langsung
- revisi harus menyimpan snapshot atau versi data lama
- setiap perubahan status yang diizinkan wajib menampilkan alasan, actor, timestamp, dan referensi dokumen terkait
- pengecualian harus dijabarkan sebagai tindakan khusus, bukan bypass informal

## 5. Kondisi gagal dan penolakan
Kondisi gagal meliputi:
- data tidak lengkap
- proof missing
- approval tidak sah
- stok tidak mencukupi
- konflik data antar entitas
- duplikasi transaksi
- pemalsuan bukti

Setiap kondisi gagal harus menghasilkan:
- status yang sesuai
- alasan tertulis
- notifikasi ke pihak terkait
- audit dan kemungkinan revisi/resubmission

## 6. Hal yang masih TBD
- detail status tambahan per modul tertentu
- siapa yang paling berwenang untuk menutup incident tertentu
- mekanisme revisi LPJ final
- penentuan bila distribusi ditolak karena keterlambatan atau bukti tidak lengkap
- apakah pemulihan pasca bencana dikelola dalam satu atau beberapa lifecycle
