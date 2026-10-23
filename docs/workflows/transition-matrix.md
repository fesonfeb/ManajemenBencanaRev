# Workflow Transition Matrix

Dokumen ini adalah baseline matriks transisi untuk validasi proses operasional.

## 1. Prinsip dasar
Setiap transisi didefinisikan dengan:
- status asal
- status tujuan
- pelaku yang berwenang
- prasyarat
- data wajib
- keputusan yang diizinkan
- efek samping
- notifikasi
- audit trail
- jalur kegagalan

## 2. Pemberlakuan umum
- Transisi hanya boleh dilakukan jika semua prasyarat terpenuhi.
- Frontend hanya memudahkan pemilihan tindakan; backend harus memvalidasi semua aturan.
- Pengikatan peran dan kewenangan tidak boleh hanya pada UI.
- Bypass atau lompatan status harus ditolak.

## 3. Contoh transisi baseline
| Entitas | Dari | Ke | Pelaku berwenang | Prasyarat | Catatan |
| --- | --- | --- | --- | --- | --- |
| Laporan | Baru | Diterima | Verifikator | laporan lengkap | status perlu diverifikasi |
| Laporan | Diterima | Ditolak | Verifikator | alasan jelas | harus ada audit trail |
| Insiden | Diajukan | Terverifikasi | Verifikator | laporan valid | dipisahkan dari status laporan |
| Assessment | Draft | Diajukan | Asesor | data minimal lengkap | harus ada bukti pendukung |
| Assessment | Diajukan | Dikembalikan | Verifikator | alasan revisi | memerlukan klarifikasi |
| Rencana respons | Draft | Disetujui | Pimpinan / otoritas sesuai kebijakan | persetujuan final | TBD per kebijakan |
| Distribusi | Direncanakan | Terealisasi | Logistik | bukti serah terima | perlu dokumen pendukung |
| LPJ | Draft | Review | Koordinator / admin sesuai kewenangan | data lengkap | TBD |

## 4. Catatan implementasi
- Matriks status harus dipisahkan per lifecycle, tidak disatukan secara paksa.
- Kewenangan untuk approval bisa berbeda-beda antar fase.
- Semua transaksi yang bersifat kritis harus mempunyai log audit.

## 5. TBD
- Detail transaksi untuk tiap entitas operasional.
- Peran yang berwenang mengubah status tertentu.
- Kondisi revisi dan pengecualian formal.
- Aturan khusus untuk penugasan ulang, pembatalan, dan duplikat.
