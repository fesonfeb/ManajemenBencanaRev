# Module → Endpoint → Role → Status Mapping
Status: Approved by Product Owner

## 1. Tujuan
Dokumen ini berfungsi sebagai referensi developer dan QA untuk memastikan endpoint, otorisasi, dan lifecycle status sesuai kebutuhan aplikasi.

## 2. Mapping Modul

| Modul | Endpoint contoh | Role utama | Status utama | Catatan |
|---|---|---|---|---|
| Report Intake | POST /reports, GET /reports/{id}, PATCH /reports/{id}/verify | PUBLIC, ADMIN, VERIFIKATOR | RECEIVED, IN_REVIEW, NEEDS_CLARIFICATION, ACCEPTED, REJECTED, DUPLICATE, CLOSED | Laporan publik tidak otomatis valid |
| Triage | POST /triage, PATCH /triage/{id}/priority, PATCH /triage/{id}/escalate | VERIFIKATOR, PIMPINAN | PENDING, PRIORITY_ASSESSED, ESCALATED, REFERRED, NO_ACTION_WITH_REASON | Eskalasi harus tercatat |
| Incident | POST /incidents, GET /incidents/{id} | ADMIN, VERIFIKATOR, PIMPINAN | MONITORING, RESPONSE_ACTIVATED, RESPONSE_ONGOING, RESPONSE_SUSPENDED, RESPONSE_COMPLETED, CLOSED | Insiden berbeda dari laporan |
| Assessment | POST /assessments, POST /assessments/{id}/submit, PATCH /assessments/{id}/approve | ASESOR, VERIFIKATOR, ADMIN | NOT_ASSIGNED, ASSIGNED, ACKNOWLEDGED, IN_PROGRESS, SUBMITTED, NEEDS_REVISION, APPROVED, REJECTED, CANCELLED, REASSIGNED | Revisi hasilkan versi baru |
| Task Assignment | POST /tasks, PATCH /tasks/{id}/accept | ADMIN, KOORDINATOR_LAPANGAN, ASESOR | DRAFT, ASSIGNED, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED, REASSIGNED | Surat tugas harus punya nomor dan versi |
| Task Letter | POST /task-letters | ADMIN, PIMPINAN, ASESOR | DRAFT, APPROVED, PUBLISHED, REVISED | Revisi surat tugas wajib versi baru |
| Program | POST /programs, PATCH /programs/{id}/status | ADMIN, PIMPINAN, KOORDINATOR_LAPANGAN | DRAFT, IN_REVIEW, APPROVED, ACTIVE, ON_HOLD, COMPLETED, CANCELLED | Program terkait incident |
| Need Item | POST /needs, PATCH /needs/{id}/fulfill | KOORDINATOR_LAPANGAN, ADMIN | DRAFT, ACTIVE, PARTIALLY_FULFILLED, FULFILLED, CANCELLED | Setiap kebutuhan harus punya riwayat |
| Inventory | POST /inventory/items, PATCH /inventory/items/{id}/status | LOGISTIK, ADMIN | ACTIVE, RESERVED, DAMAGED, RETURNED, EXPIRED | Stok harus terkontrol |
| Stock Movement | POST /stock-movements | LOGISTIK, ADMIN | REQUESTED, APPROVED, RECEIVED, RESERVED, PICKING, DISPATCHED, PARTIALLY_RECEIVED, ADJUSTED, DAMAGED, RETURNED | Tidak boleh stok negatif tanpa aturan khusus |
| Dispatch Note | POST /dispatch-notes, PATCH /dispatch-notes/{id}/dispatch | LOGISTIK, ADMIN | DRAFT, APPROVED, PICKING, DISPATCHED, PARTIALLY_RECEIVED, RECEIVED, RECONCILIATION_PENDING, COMPLETED | Wajib terkait OPERATION_ORDER_ID dan tujuan |
| Distribution | POST /distributions, PATCH /distributions/{id}/receive | LOGISTIK, KOORDINATOR_LAPANGAN, ADMIN | DRAFT, APPROVED, PICKING, DISPATCHED, PARTIALLY_RECEIVED, RECEIVED, RECONCILIATION_PENDING, COMPLETED, CANCELLED | Penerimaan harus terdokumentasi |
| Finance | POST /transactions, PATCH /transactions/{id}/approve | KEUANGAN, ADMIN, PIMPINAN | DRAFT, SUBMITTED, REVIEWED, APPROVED, PAID, REJECTED, REVERSED, RECONCILED | Maker-checker wajib |
| Volunteer | POST /volunteers, PATCH /attendance/{id}/checkin | VOLUNTEER, KOORDINATOR_LAPANGAN, ADMIN | ACTIVE, ASSIGNED, ACCEPTED, CHECKED_IN, IN_FIELD, COMPLETED, CANCELLED, ABSENT | Kehadiran fisik dan pelaporan mandiri dipisah |
| LPJ | POST /lpj, PATCH /lpj/{id}/approve | PIMPINAN, ADMIN, AUDITOR | DRAFT, IN_REVIEW, APPROVED, FINAL, ARCHIVED | Traceable ke transaksi dan bukti |
| Audit Log | GET /audit | SUPERADMIN, ADMIN, AUDITOR | LOGGED, REVIEWED, ARCHIVED | Log tidak boleh diubah user biasa |

## 3. Role Priority per Modul

| Modul | Role utama | Role pendukung | Role yang dilarang/terbatas |
|---|---|---|---|
| Report Intake | PUBLIC, ADMIN, VERIFIKATOR | SUPERADMIN | DONATUR, VOLUNTEER |
| Triage | VERIFIKATOR | PIMPINAN, ADMIN | PUBLIC |
| Incident | ADMIN, VERIFIKATOR, PIMPINAN | KOORDINATOR_LAPANGAN | PUBLIC |
| Assessment | ASESOR, VERIFIKATOR, ADMIN | PIMPINAN | PUBLIC |
| Task Assignment | ADMIN, KOORDINATOR_LAPANGAN | PIMPINAN | PUBLIC |
| Program | ADMIN, PIMPINAN, KOORDINATOR_LAPANGAN | KEUANGAN | PUBLIC |
| Need Item | KOORDINATOR_LAPANGAN, ADMIN | LOGISTIK | PUBLIC |
| Inventory | LOGISTIK, ADMIN | KOORDINATOR_LAPANGAN | PUBLIC |
| Dispatch Note | LOGISTIK, ADMIN | KOORDINATOR_LAPANGAN | PUBLIC |
| Distribution | LOGISTIK, ADMIN, KOORDINATOR_LAPANGAN | PIMPINAN | PUBLIC |
| Finance | KEUANGAN, ADMIN, PIMPINAN | AUDITOR | PUBLIC |
| Volunteer | VOLUNTEER, KOORDINATOR_LAPANGAN, ADMIN | PIMPINAN | PUBLIC |
| LPJ | PIMPINAN, ADMIN, AUDITOR | KOORDINATOR_LAPANGAN | PUBLIC |

## 4. Checklist QA
- status transition valid dan invalid
- access user tanpa permission
- cross-incident data isolation
- duplicate report handling
- clarify / reject / escalate flow
- dispatch note mandatory before stock out
- partial receive and discrepancy handling
- financial reversal and reconciliation
- LPJ approval gating
- audit trail recorded for mutation

## 5. Catatan Final
Semua endpoint harus memperhitungkan authorization, scope, dan audit log. Surat jalan wajib terhubung dengan OPERATION_ORDER_ID dan tujuan pengiriman.
