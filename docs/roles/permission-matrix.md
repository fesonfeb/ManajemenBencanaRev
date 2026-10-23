# Permission Matrix

Dokumen ini menggambarkan baseline peran dan kewenangan utama dalam sistem.

## 1. Peran utama
- Admin / Superadmin
- Pimpinan
- Verifikator
- Asesor
- Koordinator
- Relawan
- Admin Keuangan
- Logistik
- Auditor
- Donatur
- Pelapor / publik

## 2. Kewenangan baseline
| Peran | Akses utama | Batasan | Catatan |
| --- | --- | --- | --- |
| Admin / Superadmin | semua konfigurasi sistem | tidak boleh menjadi bypass formal tanpa audit | harus tercatat |
| Pimpinan | persetujuan strategis | tidak otomatis mengubah data operasional tanpa mekanisme tertentu | kebutuhan review |
| Verifikator | verifikasi laporan dan triase | tidak boleh mengesahkan anggaran tanpa otoritas lain | TBD |
| Asesor | assessment dan data lapangan | tidak boleh mengubah approval final | TBD |
| Koordinator | penugasan dan koordinasi | tidak boleh mengganti keputusan final tanpa mekanisme revisi | TBD |
| Relawan | tugas operasional yang diberikan | akses terbatas pada cakupan penugasan | perlu kontrol per tugas |
| Admin Keuangan | pencatatan transaksi dan rekonsiliasi | tidak boleh mengubah persetujuan final tanpa audit | TBD |
| Logistik | pengadaan, penerimaan, distribusi | akses sesuai unit kebutuhan | TBD |
| Auditor | akses audit dan rekonsiliasi | tidak boleh mengubah data operasional | TBD |
| Donatur | akses terbatas pada data donasi spesifik | tidak boleh melihat data sensitif | TBD |
| Pelapor / publik | akses laporan publik yang disetujui | wajib disensor dan dipastikan redaksi | TBD |

## 3. Catatan implementasi
- Peran, profil personal, organisasi, delegasi, dan wewenang harus dipisahkan secara jelas.
- Hak akses harus diperiksa di backend, bukan hanya tombol UI.
- Delegasi harus bercirikan pemberi, penerima, cakupan, masa berlaku, dan audit trail.

## 4. TBD
- Delegasi final per peran.
- Batasan data per organisasi dan per insiden.
- Aturan khusus untuk donatur dan publik.
