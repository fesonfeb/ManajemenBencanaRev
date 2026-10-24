# Role-Resource-Action Matrix per Endpoint
Status: Draft Formal untuk Review Product Owner dan Tim Implementasi
Tanggal: 2026-10-24

## 1. Tujuan
Dokumen ini memetakan peran, resource, dan action yang diizinkan untuk setiap endpoint API utama. Tujuannya adalah memastikan enforce otorisasi di server dan validasi state transition yang benar sebelum implementasi functional domain dimulai.

## 2. Prasyarat umum
- Semua endpoint harus melewati auth middleware dan RBAC middleware.
- Semua mutasi harus menulis ke audit trail.
- Scope akses harus dibatasi berdasarkan organisasi, unit, wilayah, insiden, tugas, program, atau data yang memang menjadi kewenangan user.
- Frontend tidak boleh dijadikan satu-satunya boundary keamanan.
- Semua action berisiko harus memeriksa state transition, precondition, dan actor authority.

## 3. Konvensi penulisan
- Action: create, read, update, delete, approve, reject, assign, close, verify, revise, dispatch, receive, publish, reconcile
- Scope: org, unit, incident, task, program, donor/public visibility, audit-only
- State validation: sistem harus mengecek status awal, status tujuan, dan prasyarat domain sebelum memproses

## 4. Matrix per endpoint

### 4.1 Modul Laporan, Verifikasi, dan Triase

| Endpoint | Resource | Action | Allowed roles | Notes |
|---|---|---|---|---|
| POST /api/reports | reports | create | PUBLIC, ADMIN, VERIFIKATOR | Public report form harus disetujui untuk publik. Internal dapat membuat report dari kanal internal. |
| GET /api/reports/:id | reports | read | PUBLIC (own report only if allowed), ADMIN, VERIFIKATOR, PIMPINAN, related internal roles | Public hanya melihat laporan miliknya jika diberi akses yang aman. |
| GET /api/reports | reports | list | ADMIN, VERIFIKATOR, PIMPINAN | Filter by org/unit/incident jurisdiction. |
| PATCH /api/reports/:id/verify | reports | verify | VERIFIKATOR, ADMIN | Hanya jika status valid untuk verifikasi. |
| PATCH /api/reports/:id/reject | reports | reject | VERIFIKATOR, ADMIN | Wajib alasan dan catatan. |
| PATCH /api/reports/:id/clarify | reports | request clarification | VERIFIKATOR, ADMIN | Menambahkan permintaan klarifikasi. |
| PATCH /api/reports/:id/duplicate | reports | mark duplicate | VERIFIKATOR, ADMIN | Wajib referensi report utama. |
| PATCH /api/reports/:id/close | reports | close | VERIFIKATOR, ADMIN, PIMPINAN | Hanya setelah closure valid. |
| GET /api/reports/queue | reports | queue list | VERIFIKATOR, ADMIN | Scope sesuai wilayah / kewenangan. |
| POST /api/triage | triage_cases | create | VERIFIKATOR, ADMIN | Hanya untuk report yang valid. |
| GET /api/triage/:id | triage_cases | read | VERIFIKATOR, ADMIN, PIMPINAN | Berdasarkan insiden dan kewenangan. |
| PATCH /api/triage/:id/priority | triage_cases | update priority | VERIFIKATOR, PIMPINAN, ADMIN | Harus ada reason. |
| PATCH /api/triage/:id/escalate | triage_cases | emergency escalate | VERIFIKATOR, PIMPINAN, ADMIN | Harus mencatat waktu, penerima, konfirmasi. |
| PATCH /api/triage/:id/refer | triage_cases | refer | VERIFIKATOR, ADMIN | Jika domain tidak ditangani saat ini. |

### 4.2 Modul Incident

| Endpoint | Resource | Action | Allowed roles | Notes |
|---|---|---|---|---|
| POST /api/incidents | incidents | create | VERIFIKATOR, ADMIN, PIMPINAN | Harus terkait report yang valid. |
| GET /api/incidents/:id | incidents | read | related roles only | Scope by org, unit, incident, and task. |
| GET /api/incidents | incidents | list | ADMIN, PIMPINAN, VERIFIKATOR, KOORDINATOR_LAPANGAN | Filter by jurisdiction. |
| PATCH /api/incidents/:id/status | incidents | update status | ADMIN, VERIFIKATOR, PIMPINAN, assigned coordinator | Status transition validation required. |
| PATCH /api/incidents/:id/close | incidents | close | PIMPINAN, ADMIN | Harus lewat closure checklist. |
| GET /api/incidents/:id/reports | incidents | read related reports | related roles | No cross-incident visibility. |
| GET /api/incidents/:id/assessments | incidents | read related assessments | assignee, verifier, admin, pimpinan | Scope by task/incident. |

### 4.3 Modul Assessment, Task, dan Surat Tugas

| Endpoint | Resource | Action | Allowed roles | Notes |
|---|---|---|---|---|
| POST /api/assessments | assessments | create | ADMIN, VERIFIKATOR, ASESOR if assigned | Harus terkait incident + task. |
| GET /api/assessments/:id | assessments | read | assignee, verifier, admin, related coordinator, pimpinan | Strict assignment scope. |
| GET /api/assessments | assessments | list | assignee, verifier, admin, pimpinan, related coordinator | Filter by task or incident. |
| PATCH /api/assessments/:id/draft | assessments | save draft | ASESOR, ADMIN | Hanya own draft atau assigned task. |
| PATCH /api/assessments/:id/submit | assessments | submit | ASESOR | Hanya assigned assessor. |
| PATCH /api/assessments/:id/revision | assessments | request revision | VERIFIKATOR, ADMIN, PIMPINAN | Wajib alasan dan versi baru. |
| PATCH /api/assessments/:id/approve | assessments | approve | VERIFIKATOR, ADMIN, PIMPINAN | Harus sesuai policy role authority. |
| PATCH /api/assessments/:id/reject | assessments | reject | VERIFIKATOR, ADMIN, PIMPINAN | Wajib reason dan audit log. |
| PATCH /api/assessments/:id/reassign | assessments | reassign | ADMIN, KOORDINATOR_LAPANGAN | Hanya jika state memungkinkan. |
| POST /api/tasks | tasks | create | ADMIN, KOORDINATOR_LAPANGAN | Harus terikat incident. |
| GET /api/tasks/:id | tasks | read | assignee, coordinator, admin, pimpinan | Restrict by scope. |
| GET /api/tasks | tasks | list | assignee, coordinator, admin, pimpinan | Filter by own scope. |
| PATCH /api/tasks/:id/accept | tasks | accept | ASESOR | Hanya assigned assessor. |
| PATCH /api/tasks/:id/reassign | tasks | reassign | ADMIN, KOORDINATOR_LAPANGAN | Wajib validasi status. |
| PATCH /api/tasks/:id/cancel | tasks | cancel | ADMIN, KOORDINATOR_LAPANGAN | Wajib reason dan audit log. |
| POST /api/task-letters | task_letters | create | ADMIN, PIMPINAN | Harus unik dan valid. |
| GET /api/task-letters/:id | task_letters | read | assignee, admin, pimpinan, coordinator | Scope by incident/task. |
| PATCH /api/task-letters/:id/revise | task_letters | revise | ADMIN, PIMPINAN | Membuat revision baru, bukan overwrite. |

### 4.4 Modul Program, Kebutuhan, Proposal

| Endpoint | Resource | Action | Allowed roles | Notes |
|---|---|---|---|---|
| POST /api/programs | programs | create | ADMIN, PIMPINAN, KOORDINATOR_LAPANGAN | Harus terikat incident. |
| GET /api/programs/:id | programs | read | ADMIN, PIMPINAN, KOORDINATOR_LAPANGAN, donor with visibility policy | Public/donor access hanya pada data yang diizinkan. |
| GET /api/programs | programs | list | ADMIN, PIMPINAN, KOORDINATOR_LAPANGAN, related roles | Scope by org/incident. |
| PATCH /api/programs/:id/status | programs | update status | ADMIN, PIMPINAN, KOORDINATOR_LAPANGAN | Harus validasi transition. |
| POST /api/needs | needs | create | KOORDINATOR_LAPANGAN, ADMIN | Harus terkait program. |
| GET /api/needs/:id | needs | read | related roles | Scope program/incident. |
| PATCH /api/needs/:id/fulfill | needs | fulfill | KOORDINATOR_LAPANGAN, ADMIN, LOGISTIK | Catat qty fulfilled. |
| PATCH /api/needs/:id/cancel | needs | cancel | ADMIN, KOORDINATOR_LAPANGAN | Reason required. |
| POST /api/proposals | proposals | create | ADMIN, PIMPINAN | Harus sesuai program yang approved. |
| GET /api/proposals/:id | proposals | read | related donor, admin, pimpinan | Visibility filtered. |
| PATCH /api/proposals/:id/publish | proposals | publish | ADMIN, PIMPINAN | Hanya jika approved for publication. |

### 4.5 Modul Logistik, Inventory, Distribusi

| Endpoint | Resource | Action | Allowed roles | Notes |
|---|---|---|---|---|
| POST /api/inventory/items | inventory_items | create | LOGISTIK, ADMIN | Registrasi item gudang. |
| GET /api/inventory/items/:id | inventory_items | read | LOGISTIK, ADMIN, related internal roles | No public access. |
| GET /api/inventory/items | inventory_items | list | LOGISTIK, ADMIN, KOORDINATOR_LAPANGAN | Scope by warehouse or incident. |
| PATCH /api/inventory/items/:id/status | inventory_items | update status | LOGISTIK, ADMIN | Harus menjaga integritas stok. |
| POST /api/stock-movements | stock_movements | create | LOGISTIK, ADMIN | Quantity, reason, source/destination required. |
| GET /api/stock-movements/:id | stock_movements | read | LOGISTIK, ADMIN, AUDITOR, related internal | No donor/public. |
| GET /api/stock-movements | stock_movements | list | LOGISTIK, ADMIN, AUDITOR | Filter by item or incident. |
| POST /api/dispatch-notes | dispatch_notes | create | LOGISTIK, ADMIN | Wajib OPERATION_ORDER_ID + tujuan. |
| GET /api/dispatch-notes/:id | dispatch_notes | read | LOGISTIK, ADMIN, KOORDINATOR_LAPANGAN, related internal | No public access. |
| PATCH /api/dispatch-notes/:id/dispatch | dispatch_notes | dispatch | LOGISTIK, ADMIN | Harus ada bukti dan status transition valid. |
| PATCH /api/dispatch-notes/:id/receive | dispatch_notes | receive partial/final | LOGISTIK, ADMIN, KOORDINATOR_LAPANGAN | Mengizinkan partial receive. |
| POST /api/distributions | distributions | create | LOGISTIK, ADMIN, KOORDINATOR_LAPANGAN | Harus terkait incident/program. |
| GET /api/distributions/:id | distributions | read | LOGISTIK, ADMIN, related internal | Restricted. |
| PATCH /api/distributions/:id/receive | distributions | receive | LOGISTIK, ADMIN, KOORDINATOR_LAPANGAN | Wajib bukti penerimaan dan selisih. |
| PATCH /api/distributions/:id/close | distributions | close | ADMIN, PIMPINAN, LOGISTIK | Requires reconciliation. |

### 4.6 Modul Keuangan

| Endpoint | Resource | Action | Allowed roles | Notes |
|---|---|---|---|---|
| POST /api/transactions | financial_transactions | create | KEUANGAN, ADMIN | Only valid transaction type. |
| GET /api/transactions/:id | financial_transactions | read | KEUANGAN, ADMIN, PIMPINAN, AUDITOR | Scope restricted. |
| GET /api/transactions | financial_transactions | list | KEUANGAN, ADMIN, PIMPINAN, AUDITOR | Filter by program/incident. |
| PATCH /api/transactions/:id/review | financial_transactions | review | KEUANGAN, ADMIN | State validation required. |
| PATCH /api/transactions/:id/approve | financial_transactions | approve | KEUANGAN, ADMIN, PIMPINAN | Maker-checker if configured. |
| PATCH /api/transactions/:id/reject | financial_transactions | reject | KEUANGAN, ADMIN, PIMPINAN | Must log reason. |
| PATCH /api/transactions/:id/reverse | financial_transactions | reverse | KEUANGAN, ADMIN | Must create reversal/ref with reason. |
| GET /api/finance/ledger | financial_transactions | ledger read | KEUANGAN, ADMIN, PIMPINAN, AUDITOR | Derived from ledger and reconciliation. |
| GET /api/finance/reconciliation | reconciliation data | read | KEUANGAN, ADMIN, AUDITOR | Only authorized roles. |

### 4.7 Modul Volunteer dan Absensi

| Endpoint | Resource | Action | Allowed roles | Notes |
|---|---|---|---|---|
| POST /api/volunteers | volunteers | create | ADMIN, KOORDINATOR_LAPANGAN | Profile before assignment. |
| GET /api/volunteers/:id | volunteers | read | own volunteer, coordinator, admin | Scope only relevant task/incident. |
| GET /api/volunteers | volunteers | list | ADMIN, KOORDINATOR_LAPANGAN | Filter by assigned tasks. |
| PATCH /api/volunteers/:id/assign | volunteers | assign | KOORDINATOR_LAPANGAN, ADMIN | Validate competence and availability. |
| POST /api/attendance | attendance | create/check-in | VOLUNTEER, KOORDINATOR_LAPANGAN | Check-in state. |
| PATCH /api/attendance/:id/checkin | attendance | check-in | VOLUNTEER, KOORDINATOR_LAPANGAN | Verification method required. |
| PATCH /api/attendance/:id/checkout | attendance | check-out | VOLUNTEER, KOORDINATOR_LAPANGAN | Must validate shift or task. |
| GET /api/attendance/:id | attendance | read | assignee, coordinator, admin | Strict scope. |

### 4.8 Modul LPJ, Closure, Audit

| Endpoint | Resource | Action | Allowed roles | Notes |
|---|---|---|---|---|
| POST /api/lpj | lpj | create | ADMIN, PIMPINAN, KOORDINATOR_LAPANGAN | Must tie to incident/program. |
| GET /api/lpj/:id | lpj | read | related roles and auditor | Restrict by incident/program scope. |
| PATCH /api/lpj/:id/review | lpj | review | PIMPINAN, ADMIN, AUDITOR | Only in draft/in review state. |
| PATCH /api/lpj/:id/approve | lpj | approve | PIMPINAN, ADMIN | Must have approval log. |
| PATCH /api/lpj/:id/finalize | lpj | final | PIMPINAN, ADMIN | Snapshot/final only through formal revision flow. |
| POST /api/closure/checklist | closure | create | ADMIN, PIMPINAN, KOORDINATOR_LAPANGAN | Precondition for close. |
| PATCH /api/closure/checklist/:id/approve | closure | approve | PIMPINAN, ADMIN | Block unless all conditions met. |
| GET /api/audit | audit_log | read | SUPERADMIN, ADMIN, AUDITOR | No direct mutation by user. |
| GET /api/audit/:id | audit_log | read detail | SUPERADMIN, ADMIN, AUDITOR | Only if authorized. |

## 5. Aturan access dasar yang harus diterapkan untuk semua endpoint
- Backend harus memeriksa auth, role, permission, dan scope.
- Scope paling aman: org_id, unit_id, incident_id, program_id, task_id.
- Semua mutation harus menulis ke audit trail.
- Semua resource sensitive harus dibatasi oleh visibility policy.
- Public atau donor hanya dapat melihat data yang diizinkan secara eksplisit.
- Tidak ada bypass via query param atau frontend state.

## 6. Checklist QA berbasis matrix
- user tanpa role mencoba akses endpoint yang dilindungi
- user dengan role salah mencoba akses incident lain
- verifier mengakses laporan bukan kewenangannya
- donor melihat laporan atau file sensitif internal
- assesor melihat assessment milik orang lain
- stock out tanpa dispatch note
- partial receive tanpa discrepancy log
- financial transaction tanpa approval
- task assignment ganda
- LPJ final tanpa approval
- audit log tidak tersimpan saat mutation sukses

## 7. Keputusan yang masih harus disetujui Product Owner
- auth provider final
- visibility policy donor/public final
- definisi triase final
- role-resource-action matrix final per resource/action dan per org/unit
- status transition final untuk task, incident, LPJ, finance, logistics
- apakah offline-first masuk MVP atau tidak

## 8. Kesimpulan
Matrix ini berfungsi sebagai konversi requirement menjadi otorisasi aktual. Matrix ini harus dijadikan dasar untuk backend authorization, API validation, dan QA prioritas sebelum build dimulai. Semua endpoint harus difinalisasi dengan action, role, scope, dan state transition yang jelas.
