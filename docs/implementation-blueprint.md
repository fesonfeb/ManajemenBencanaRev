# Implementation Blueprint

## 1. Tujuan dokumen
Dokumen ini merupakan blueprint teknis untuk fase berikutnya setelah keputusan governance dan platform sudah final. Fokusnya adalah membangun arsitektur yang konsisten dengan:
- Cloudflare Pages + Workers
- OIDC / Cloudflare-based auth
- offline-first field workflow
- approval berbasis role
- lifecycle terpisah per entitas operasional

Dokumen ini bukan pengganti SOP final, melainkan peta implementasi yang masih perlu diverifikasi secara berulang oleh Product Owner, admin operasional, dan tim implementasi.

## 2. Keputusan final yang menjadi dasar blueprint
- Auth: menggunakan pendekatan berbasis Cloudflare / OIDC yang kompatibel dengan organisasi.
- Deployment: Cloudflare Pages untuk frontend dan Cloudflare Workers untuk backend/API.
- MVP: offline-first, simpan saat offline, sinkron saat online.
- Donor/public: masuk dalam MVP, namun dibatasi oleh rules akses yang jelas.
- Prioritas domain: incident core -> assessment -> LPJ.
- Approval: Verifikator dan Pimpinan.

## 3. Prinsip arsitektur
- Backend memegang aturan utama: validasi status, akses, approval, dan audit trail.
- Frontend hanya memudahkan pengguna memahami pilihan yang sah.
- Semua mutasi data wajib mempunyai audit log.
- Semua status transition harus diverifikasi di server.
- Semua tindakan yang bersifat kritis harus memiliki idempotency key atau mekanisme dedupe.
- Data sensitif hanya terlihat sesuai role dan scope.
- Revisi tidak boleh menjadi overwrite tanpa riwayat perubahan.

## 4. Domain model utama

### 4.1 User dan role
Entitas utama:
- User
  - id
  - email
  - name
  - organization_id
  - role_id
  - status
  - created_at
  - updated_at

- Role
  - id
  - code
  - name
  - description

- UserRoleAssignment
  - id
  - user_id
  - role_id
  - granted_by
  - granted_at
  - valid_until
  - status

- Permission
  - id
  - code
  - description

- RolePermission
  - role_id
  - permission_id

### 4.2 Organisasi / program / wilayah
Entitas tambahan yang kemungkinan dibutuhkan:
- Organization
  - id
  - name
  - type
  - parent_id
  - status

- Program
  - id
  - organization_id
  - name
  - description

- Location
  - id
  - name
  - region
  - latitude
  - longitude
  - type

### 4.3 Incident
Entitas inti:
- Incident
  - id
  - code
  - title
  - category
  - severity
  - status
  - source_type
  - reporter_id
  - location_id
  - summary
  - created_at
  - updated_at

Catatan:
- status harus dipisahkan dari laporan, assessment, dan LPJ.
- incident dapat dihubungkan ke banyak laporan, penugasan, assessment, dan kegiatan.

### 4.4 Report
- Report
  - id
  - incident_id
  - reporter_id
  - reporter_name
  - source_channel
  - observed_at
  - summary
  - status
  - attachment_ids
  - created_at
  - updated_at

### 4.5 Assessment
- Assessment
  - id
  - incident_id
  - assigned_to
  - submitted_by
  - status
  - score
  - priority
  - findings
  - evidence_ids
  - created_at
  - updated_at

### 4.6 Response Plan
- ResponsePlan
  - id
  - incident_id
  - created_by
  - status
  - plan_summary
  - approved_by
  - version
  - created_at
  - updated_at

### 4.7 Activity
- Activity
  - id
  - incident_id
  - plan_id
  - title
  - type
  - assignee_id
  - status
  - start_at
  - end_at
  - notes

### 4.8 Inventory
- InventoryItem
  - id
  - sku
  - name
  - category
  - quantity
  - unit
  - location_id
  - status

- InventoryMovement
  - id
  - item_id
  - movement_type
  - quantity
  - related_incident_id
  - actor_id
  - reference_number
  - created_at

### 4.9 Distribution
- Distribution
  - id
  - incident_id
  - item_id
  - quantity
  - recipient_name
  - recipient_group
  - status
  - delivery_note
  - created_at
  - updated_at

### 4.10 Donation and finance
- Donation
  - id
  - donor_id
  - donor_name
  - type
  - amount
  - currency
  - status
  - created_at

- LedgerEntry
  - id
  - incident_id
  - type
  - amount
  - currency
  - direction
  - reference_id
  - created_by
  - created_at

### 4.11 LPJ
- LPJ
  - id
  - incident_id
  - version
  - status
  - summary
  - created_by
  - approved_by
  - finalized_at
  - created_at
  - updated_at

- LPJAttachment
  - id
  - lpj_id
  - file_id
  - type

### 4.12 File and evidence
- FileRecord
  - id
  - object_key
  - mime_type
  - size_bytes
  - owner_id
  - related_entity_type
  - related_entity_id
  - uploaded_at

### 4.13 Audit log
- AuditLog
  - id
  - entity_type
  - entity_id
  - action
  - actor_id
  - old_value
  - new_value
  - reason
  - created_at

## 5. State machine final (ringkas)

### 5.1 Incident lifecycle
- created -> validated -> active -> monitored -> closed -> reopened -> archived

### 5.2 Assessment lifecycle
- draft -> assigned -> in_progress -> submitted -> under_review -> approved -> returned -> rejected -> archived

### 5.3 Response plan lifecycle
- draft -> reviewed -> approved -> active -> revised -> rejected -> completed

### 5.4 Inventory / distribution lifecycle
- planned -> prepared -> in_transit -> delivered -> closed

### 5.5 LPJ lifecycle
- draft -> in_review -> approved -> final -> revised -> rejected

## 6. Approval model final
Setiap approval harus memiliki:
- actor yang valid
- role yang sah
- state asal dan tujuan
- prasyarat tertentu
- bukti / alasan
- waktu
- version dokumen atau entity state
- audit log

### 6.1 Approval rule utama
- Report: Verifikator
- Assessment: Verifikator dan Pimpinan tergantung konteks dan kebijakan final
- Plan / response: Pimpinan
- Distribution: Koordinator / Logistik / Pimpinan tergantung domain
- LPJ: Verifikator / Pimpinan sesuai kebijakan final

### 6.2 Rule yang harus dipaksakan backend
- Tidak boleh approval tanpa role sah.
- Tidak boleh perubahan status tanpa state transition yang valid.
- Tidak boleh lompatan status.
- Tidak boleh pengajuan dengan prasyarat belum lengkap.
- Tidak boleh duplicate transaction atau repeat action tanpa idempotency.

## 7. RBAC ringkas
Role utama:
- Superadmin
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

Aturan akses dasar:
- Superadmin: seluruh data yang diizinkan oleh kebijakan, termasuk konfigurasi sistem.
- Pimpinan: akses review, approval, dan laporan strategis.
- Verifikator: akses laporan, triase, assessment review, dan validasi awal.
- Asesor: akses assessment dan bukti terkait tugasnya.
- Koordinator: akses penugasan, kegiatan, dan koordinasi tugas.
- Relawan: akses tugas yang ditetapkan dan bukti task-specific.
- Admin Keuangan: akses ledger, transaksi, dan rekonsiliasi.
- Logistik: akses inventory, distribusi, dan penerimaan barang.
- Auditor: akses audit trail dan data historis, tapi tidak mengubah operasional.
- Donatur: akses transaksi atau laporan yang relevan dan dibatasi.
- Pelapor / publik: akses data yang disetujui untuk publik.

## 8. API blueprint domain prioritas

### 8.1 Incident API
- GET /api/incidents
- GET /api/incidents/:id
- POST /api/incidents
- PATCH /api/incidents/:id
- POST /api/incidents/:id/validate
- POST /api/incidents/:id/close
- POST /api/incidents/:id/reopen

### 8.2 Report API
- GET /api/reports
- GET /api/reports/:id
- POST /api/reports
- PATCH /api/reports/:id
- POST /api/reports/:id/verify
- POST /api/reports/:id/reject
- POST /api/reports/:id/duplicate

### 8.3 Assessment API
- GET /api/assessments
- GET /api/assessments/:id
- POST /api/assessments
- PATCH /api/assessments/:id
- POST /api/assessments/:id/assign
- POST /api/assessments/:id/submit
- POST /api/assessments/:id/approve
- POST /api/assessments/:id/return

### 8.4 Plan API
- GET /api/plans
- GET /api/plans/:id
- POST /api/plans
- PATCH /api/plans/:id
- POST /api/plans/:id/review
- POST /api/plans/:id/approve
- POST /api/plans/:id/revise

### 8.5 LPJ API
- GET /api/lpj
- GET /api/lpj/:id
- POST /api/lpj
- PATCH /api/lpj/:id
- POST /api/lpj/:id/review
- POST /api/lpj/:id/approve
- POST /api/lpj/:id/finalize

### 8.6 Inventory / Distribution / Finance API
- GET /api/inventory
- GET /api/distributions
- GET /api/donations
- GET /api/finance
- POST /api/distributions/:id/prepare
- POST /api/distributions/:id/deliver
- POST /api/finance/ledger
- POST /api/donations

### 8.7 Audit API
- GET /api/audit
- GET /api/audit/:entityType/:entityId

## 9. Response model yang disarankan
Setiap response harus mencakup:
- status
- data
- actor
- request_id / trace_id
- timestamp
- validation errors jika ada
- audit metadata

## 10. UI blueprint prioritas
### 10.1 Dashboard umum
Terdiri dari:
- tugas aktif
- item menunggu tindakan
- item tertunda
- prioritas dan tenggat waktu
- riwayat kegiatan yang relevan

### 10.2 Halaman prioritas fase awal
- Dashboard operasional
- Detail incident
- Form assessment
- Detail LPJ
- Daftar task / penugasan
- Permintaan approval
- Admin role management

### 10.3 UI rule dasar
- Desain harus sederhana dan operasional.
- Bahasa harus mudah dipahami petugas lapangan.
- Form tidak menampilkan tombol yang mengarah ke action ilegal.
- Data sensitif harus dibatasi role.
- Semua tindakan kritis harus minta konfirmasi dan alasan.

## 11. Offline sync dan dedupe
### 11.1 Aturan offline-first
- Simpan pending action di storage lokal.
- Gunakan queue outbox untuk operasi mutasi.
- Sinkronisasi ketika koneksi tersedia.
- Selalu gunakan idempotency key untuk request yang memodifikasi data.

### 11.2 Dedupe
- dedupe berdasarkan business key dan reference id
- prioritas konflik harus ditentukan dengan aturan explicit
- data lokal harus diulang dengan canonical id setelah sync berhasil

## 12. Acceptance test baseline
Skenario yang harus diuji sebelum implementasi production:
- role salah tidak dapat melanjutkan action
- status lompatan ditolak
- duplicate report atau duplicate event dihindari
- submit tanpa bukti atau prasyarat gagal
- approval tanpa kewenangan ditolak
- revisi data tetap tidak menghapus jejak
audit log tercatat untuk setiap transisi
- donor/public akses dibatasi sesuai kebijakan
- sync offline menghasilkan record yang konsisten saat online

## 13. Keputusan yang masih TBD
- exact Cloudflare auth product configuration inside the org
- exact conflict strategy for offline sync
- exact donor/public data boundary per module
- exact versioning model for LPJ final and operational closure
- exact UX detail for mobile field usage

## 14. Ringkasan implementasi berikutnya
Tahap berikutnya yang paling logis adalah:
1. detail data model final untuk incident, assessment, LPJ, dan finance
2. detail status transition final untuk 3 domain prioritas
3. finalisasi permission matrix per domain
4. pembuatan repo implementation dan scaffold Cloudflare Pages + Workers
5. implementasi domain core dan testing lifecycle

Dengan keputusan platform, approval, MVP, dan domain prioritas yang sudah fixed, timeline berikutnya bisa dibuat lebih realistis dan aman.
