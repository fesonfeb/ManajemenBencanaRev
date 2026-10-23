# Role Authority Detail

Dokumen ini memperjelas level kewenangan dan cakupan peran yang terlibat dalam sistem, dengan fokus pada pencegahan bypass, inkonsistensi, dan perubahan status tanpa hak.

## 1. Ringkasan peran

### 1.1 Admin / Superadmin
Cakupan:
- konfigurasi sistem
- pengelolaan peran dan profil pengguna
- review audit log
- pengaturan parameter global
- akses terhadap data historis yang diizinkan

Batasan:
- tidak boleh dipakai sebagai bypass formal
- perubahan status yang sangat kritis harus tetap tercatat dan tidak bisa dilakukan tanpa jejak

### 1.2 Pimpinan
Cakupan:
- persetujuan strategi operasional
- persetujuan rencana respons utama
- penutupan incident berdasarkan kebijakan formal
- review LPJ final

Batasan:
- tidak boleh mengganti detail teknis tanpa mekanisme yang jelas
- persetujuan harus tercatat dengan alasan dan versi dokumen

### 1.3 Verifikator
Cakupan:
- verifikasi laporan masuk
- triase dan prioritas
- validasi laporan awal
- pengajuan ke tahap assessment
- verifikasi assessment awal

Batasan:
- tidak boleh langsung mengubah anggaran atau distribusi tanpa otoritas relevan
- tidak boleh menutup kegiatan jika bukti belum lengkap

### 1.4 Asesor
Cakupan:
- assessment lapangan
- mengisi form assessment
- mengajukan hasil assessment dan bukti

Batasan:
- tidak boleh menyetujui dirinya sendiri atas hasil assessment
- revisi harus melalui mekanisme return / klarifikasi

### 1.5 Koordinator
Cakupan:
- tugas operasional dan penugasan unit
- pemetaan kebutuhan dan prioritas
- monitoring kegiatan
- pengelolaan akses tugas manual

Batasan:
- tidak boleh mengganti approval final yang dibutuhkan oleh otoritas lain
- tidak boleh mempercepat distribusi tanpa dokumen yang lengkap

### 1.6 Relawan
Cakupan:
- penugasan lapangan
- tugas berbasis lokasi / aktivitas
- pencatatan bukti pendukung tugas

Batasan:
- akses terbatas sesuai peran dan tugas yang ditetapkan
- tidak boleh melihat data insiden lain di luar cakupannya

### 1.7 Admin Keuangan
Cakupan:
- ledger keuangan
- transaksi donasi
- alokasi dana
- rekonsiliasi keuangan
- arsip bukti transaksi

Batasan:
- tidak boleh mengubah persetujuan strategis tanpa log yang jelas
- perubahan final harus dilakukan melalui mekanisme revisi yang terdokumen

### 1.8 Logistik
Cakupan:
- pemenuhan kebutuhan logistik
- stok, penerimaan, dan distribusi
- dokumentasi pengiriman dan serah terima

Batasan:
- tidak boleh menutup distribusi tanpa bukti dan persetujuan relevan
- stok tidak boleh diubah tanpa audit trail yang valid

### 1.9 Auditor
Cakupan:
- review historis operasional
- audit data transaksi, status, dan persetujuan
- verifikasi kepatuhan terhadap SOP

Batasan:
- access hanya untuk audit, bukan pengubahan data operasional

### 1.10 Donatur
Cakupan:
- penyumbangan
- status donasi yang relevan
- laporan donasi yang dibatasi sesuai kebijakan

Batasan:
- tidak boleh melihat data internal sensitif
- akses harus dibatasi berdasarkan role dan konteks

### 1.11 Pelapor / publik
Cakupan:
- submit laporan awal
- melihat status pelaporan yang relevan dan diizinkan
- melihat data publik yang telah ditetapkan redaksinya

Batasan:
- tidak boleh melihat data internal, kebutuhan operasional, atau status yang bersifat sensitif

## 2. Delegasi formal
Delegasi harus memiliki:
- pemberi delegasi
- penerima delegasi
- cakupan delegasi
- masa berlaku
- data atau tugas yang dibatasi
- alasan formal
- log audit 
- mekanisme pencabutan

## 3. Pola approval yang wajib ada
Setiap approval harus memenuhi:
- actor berwenang
- status asal dan tujuan
- prasyarat terpenuhi
- alasan approval
- bukti / keputusan terdokumentasi
- waktu dan versi dokumen

## 4. Cara kerja backend untuk kontrol akses
Backend wajib memvalidasi:
- role user
- scope organisasi / insiden / tugas / aktivitas
- status object
- target action
- kondisi waktu dan bukti lengkap
- idempotency untuk aksi ganda
- audit log untuk setiap perubahan status

## 5. Kondisi pengecualian formal
Pengecualian harus diizinkan hanya jika:
- alasan formal dan terdokumentasi
- actor berwenang
- tindakan memiliki log khusus
- status hasil dibuat sebagai exception action, bukan bypass

## 6. TBD
- Delegasi formal detail untuk tiap peran dan modul specific
- Batasan akses antar organisasi / program / incident
- Aturan khusus donatur, publik, dan data sensitif
