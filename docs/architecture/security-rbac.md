# Security and RBAC Baseline

Dokumen ini menguraikan baseline keamanan dan role policy yang harus digunakan sebelum implementasi functional domain dimulai.

## 1. Aturan keamanan utama
- Backend adalah satu-satunya enforcement boundary.
- Frontend hanya membantu validasi UX, bukan pengaman utama.
- Semua perubahan status, approval, dan transaksi harus memiliki log audit.
- Semua request mutasi harus di-check role, scope, state, and prerequisite.
- Semua data sensitif harus dipisahkan berdasarkan visibility policy.

## 2. RBAC baseline
Role utama:
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

## 3. Access rule umum
- Verifikator dibatasi oleh domain laporan dan triase.
- Pimpinan bertanggung jawab atas persetujuan strategis dan final closure.
- Asesor hanya boleh memengaruhi assessment yang ditugaskan kepada dirinya.
- Koordinator hanya boleh mengatur tugas yang scoped ke unit/incident dalam aksesnya.
- Relawan tidak boleh melihat data di luar tugas yang dialokasikan.
- Donatur dan publik hanya boleh melihat data terbatas yang sudah diizinkan.

## 4. Enforcement points
Enforcement harus dilakukan pada:
- auth middleware
- routing layer
- business service layer
- mutation action layer
- audit layer

## 5. Dasar pengecualian
Pengecualian formal hanya dibenarkan jika:
- actor sah
- alasan disertakan
- status transition valid
- audit log dibuat
- mekanisme revisi dijelaskan

## 6. TBD
- exact mapping per role to resource and operations
- donor/public visibility policy detail
- role assignment model per organization / region / program
