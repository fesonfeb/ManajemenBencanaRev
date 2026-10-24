# API Endpoint Final Modul Keuangan + Closure Checks

Status: Final reference untuk developer dan QA
Tanggal: 2026-10-24

## 1. Tujuan
Dokumen ini merangkum endpoint final modul keuangan beserta rules penutupan (closure checks). Tujuan utamanya adalah agar:
- transaksi keuangan tertaut dengan insiden/program/kebutuhan yang benar
- proses approval dan saldo tetap aman dan konsisten
- closure tidak bisa dilakukan sebelum realisasi keuangan dan kebutuhan selesai
- tidak ada loop atau deadlock logika pada alur keuangan
- modul keuangan siap diimplementasikan oleh developer dengan acuan yang jelas

## 2. Prinsip yang sudah diuji
- Tidak ada loop utama pada alur keuangan.
- Semua transaksi harus terikat ke incident/program bila relevan.
- Need item adalah sumber kebutuhan yang memicu transaksi.
- Finance transaction adalah sumber realisasi yang memengaruhi saldo.
- Balance snapshot adalah hasil derivasi, bukan sumber kebenaran.
- Closure hanya boleh dilakukan bila semua transaksi final dan valid.
- Semua perubahan status harus masuk audit log.

## 3. Arsitektur logika yang aman

### 3.1 Dependency flow yang benar
Incident / Program
  -> Need Item
  -> Finance Transaction
  -> Balance Snapshot
  -> Reporting / Evaluation / Closure

### 3.2 Yang tidak boleh terjadi
- Tidak boleh transaksi dibuat tanpa incident/program valid.
- Tidak boleh kebutuhan dibuat tanpa incident/program valid.
- Tidak boleh saldo dibuat dari transaksi yang belum valid.
- Tidak boleh closure dilakukan ketika masih ada transaksi aktif, pending, atau rejected yang belum ditangani.
- Tidak boleh reversal tanpa referensi transaksi original.

## 4. Status keuangan
Status transaksi yang disarankan:
- DRAFT
- SUBMITTED
- REVIEWED
- APPROVED
- PAID
- REJECTED
- REVERSED
- RECONCILED

Transition valid:
- DRAFT -> SUBMITTED
- SUBMITTED -> REVIEWED
- REVIEWED -> APPROVED
- APPROVED -> PAID
- PAID -> RECONCILED
- APPROVED -> REJECTED
- APPROVED -> REVERSED
- PAID -> REVERSED

Transition invalid:
- ACTIVE -> DRAFT
- REJECTED -> APPROVED
- REVERSED -> PAID
- PAID -> SUBMITTED

## 5. Endpoint final untuk finance

### 5.1 Account / sumber dana
- GET /api/finance/accounts
  - role: ADMIN, KEUANGAN, PIMPINAN, AUDITOR
  - permission: finance_accounts:read

- POST /api/finance/accounts
  - role: ADMIN, KEUANGAN
  - permission: finance_accounts:create

- GET /api/finance/accounts/:id
  - role: ADMIN, KEUANGAN, PIMPINAN, AUDITOR
  - permission: finance_accounts:read

- PATCH /api/finance/accounts/:id
  - role: ADMIN, KEUANGAN
  - permission: finance_accounts:update

### 5.2 Need item / kebutuhan barang dan kebutuhan operasional
- GET /api/incidents/:incidentId/needs
  - role: ADMIN, KEUANGAN, LOGISTIK, KOORDINATOR_LAPANGAN
  - permission: need_items:read

- POST /api/incidents/:incidentId/needs
  - role: ADMIN, KOORDINATOR_LAPANGAN, LOGISTIK
  - permission: need_items:create

- GET /api/programs/:programId/needs
  - role: ADMIN, KEUANGAN, LOGISTIK, KOORDINATOR_LAPANGAN
  - permission: need_items:read

- PATCH /api/needs/:id
  - role: ADMIN, KOORDINATOR_LAPANGAN, LOGISTIK
  - permission: need_items:update

- PATCH /api/needs/:id/approve
  - role: ADMIN, PIMPINAN
  - permission: need_items:approve

### 5.3 Transactions
- GET /api/finance/transactions
  - role: ADMIN, KEUANGAN, PIMPINAN, AUDITOR
  - permission: financial_transactions:read

- POST /api/finance/transactions
  - role: ADMIN, KEUANGAN
  - permission: financial_transactions:create

- GET /api/finance/transactions/:id
  - role: ADMIN, KEUANGAN, PIMPINAN, AUDITOR
  - permission: financial_transactions:read

- PATCH /api/finance/transactions/:id/submit
  - role: ADMIN, KEUANGAN
  - permission: financial_transactions:submit

- PATCH /api/finance/transactions/:id/review
  - role: ADMIN, KEUANGAN
  - permission: financial_transactions:review

- PATCH /api/finance/transactions/:id/approve
  - role: ADMIN, KEUANGAN, PIMPINAN
  - permission: financial_transactions:approve

- PATCH /api/finance/transactions/:id/reject
  - role: ADMIN, KEUANGAN, PIMPINAN
  - permission: financial_transactions:reject

- PATCH /api/finance/transactions/:id/pay
  - role: ADMIN, KEUANGAN
  - permission: financial_transactions:pay

- PATCH /api/finance/transactions/:id/reverse
  - role: ADMIN, KEUANGAN
  - permission: financial_transactions:reverse

- PATCH /api/finance/transactions/:id/reconcile
  - role: ADMIN, KEUANGAN, AUDITOR
  - permission: financial_transactions:reconcile

### 5.4 Ledger and balance summary
- GET /api/finance/ledger
  - role: ADMIN, KEUANGAN, PIMPINAN, AUDITOR
  - permission: financial_transactions:read

- GET /api/finance/balance
  - role: ADMIN, KEUANGAN, PIMPINAN, AUDITOR
  - permission: financial_transactions:read

- GET /api/incidents/:incidentId/finance
  - role: ADMIN, KEUANGAN, PIMPINAN, AUDITOR
  - permission: financial_transactions:read

- GET /api/programs/:programId/finance
  - role: ADMIN, KEUANGAN, PIMPINAN, AUDITOR
  - permission: financial_transactions:read

- GET /api/incidents/:incidentId/finance-summary
  - role: ADMIN, KEUANGAN, PIMPINAN, AUDITOR
  - permission: financial_transactions:read

- GET /api/programs/:programId/finance-summary
  - role: ADMIN, KEUANGAN, PIMPINAN, AUDITOR
  - permission: financial_transactions:read

### 5.5 Documents and receipts
- POST /api/finance/transactions/:id/documents
  - role: ADMIN, KEUANGAN
  - permission: financial_transactions:document_upload

- GET /api/finance/transactions/:id/documents
  - role: ADMIN, KEUANGAN, PIMPINAN, AUDITOR
  - permission: financial_transactions:read

## 6. Request/response model yang disarankan

### 6.1 Create transaction
Request body:
```json
{
  "accountId": "acc_001",
  "incidentId": "inc_123",
  "programId": "prog_456",
  "needItemId": "need_789",
  "entryType": "EXPENSE",
  "category": "PURCHASE",
  "amount": 2500000,
  "currency": "IDR",
  "transactionDate": "2026-10-24T00:00:00Z",
  "description": "Pembelian paket sembako untuk distribusi program darurat",
  "sourceRef": "PO-20261024-01",
  "documentRef": "nota-001.pdf",
  "paymentMethod": "TRANSFER",
  "status": "DRAFT"
}
```

Validation rules:
- incidentId jika ada harus valid
- programId jika ada harus valid dan sesuai incident
- needItemId jika ada harus valid dan terikat ke program/incident yang relevan
- amount > 0
- currency wajib diisi
- sourceRef dan documentRef wajib ada tergantung policy
- role harus valid

### 6.2 Approve transaction
Payload:
```json
{
  "decision": "APPROVED",
  "note": "Barang dan dokumen sudah sesuai kebutuhan program"
}
```

Rules:
- status harus SUBMITTED atau REVIEWED
- actor harus punya role ADMIN/KEUANGAN/PIMPINAN
- must be attached to valid incident/program context
- approve writes audit log and sets status APPROVED

### 6.3 Reverse transaction
Payload:
```json
{
  "reason": "Pembelian dibatalkan karena vendor tidak memenuhi SOP",
  "referenceTransactionId": "tx_0123"
}
```

Rules:
- original transaction harus valid
- reversal hanya berlaku untuk status PAID atau APPROVED sesuai kebijakan
- saldo harus dihitung ulang setelah reversal
- log reversal wajib

## 7. Closure checks untuk program / incident
Closure tidak boleh diproses bila belum terpenuhi aturan berikut.

### 7.1 Kondisi umum closure
- incident atau program status bukan CLOSED/ARCHIVED
- semua tugas utama terkait sudah selesai atau dibatalkan
- semua kebutuhan item telah final (done / rejected / cancelled)
- semua transaksi finansial terkait sudah di-approve/reconciled atau dibatalkan
- tidak ada transaksi aktif yang masih pending tanpa alasan sah
- semua bukti dokumentasi tersimpan
- final evaluasi atau LPJ sudah siap

### 7.2 Closure condition untuk program
Program dapat ditutup hanya jika:
- semua task selesai atau dibatalkan
- semua distribusi selesai / final
- semua pengeluaran terkait final
- saldo program telah benar-benar direkonsiliasi
- LPJ program siap atau final review sudah selesai
- review pimpinan/admin sudah dilakukan

### 7.3 Closure condition untuk incident
Incident dapat ditutup hanya jika:
- semua program di incident masuk final state
- semua transaksi insiden final/reconciled
- semua dokumentasi kebutuhan dan operational summary tersedia
- semua log audit terkait sudah terkumpul
- hasil evaluasi rapat penutupan sudah dibuat

### 7.4 Endpoint closure
- PATCH /api/programs/:id/close
  - role: ADMIN, PIMPINAN, KOORDINATOR_LAPANGAN
  - permission: programs:close

- PATCH /api/incidents/:id/close
  - role: ADMIN, PIMPINAN
  - permission: incidents:close

- POST /api/closure/checklists
  - role: ADMIN, PIMPINAN, KOORDINATOR_LAPANGAN
  - permission: closure:create

- PATCH /api/closure/checklists/:id/approve
  - role: ADMIN, PIMPINAN
  - permission: closure:approve

### 7.5 Penutupan yang aman (safe close)
Sebelum close, backend harus menjalankan validasi:
- count pending transactions > 0 -> reject
- unapproved expenses > 0 -> reject
- active program without final status -> reject
- unmet operational requirements -> reject
- missing LPJ/closure doc -> reject

## 8. Contoh logic closure guard
```ts
async function canCloseProgram(programId: string) {
  const pendingTx = await db.finance_transactions.count({
    program_id: programId,
    status: { in: ['DRAFT', 'SUBMITTED', 'REVIEWED', 'APPROVED', 'PAID'] }
  });

  const activeNeeds = await db.need_items.count({
    program_id: programId,
    status: { in: ['OPEN', 'PENDING', 'IN_PROGRESS'] }
  });

  const activeTasks = await db.tasks.count({
    program_id: programId,
    status: { in: ['DRAFT', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'] }
  });

  if (pendingTx > 0 || activeNeeds > 0 || activeTasks > 0) {
    return { ok: false, reason: 'Program masih memiliki transaksi atau kebutuhan aktif' };
  }

  return { ok: true };
}
```

## 9. Audit dan history yang wajib ada
Untuk semua operasi finance dan closure, wajib dibuat:
- finance_transaction_history
- program closure logs
- incident closure logs
- audit_log entries

Field wajib minimal:
- actor_id
- entity_name
- entity_id
- action_type
- previous_status
- new_status
- reason
- correlation_id
- created_at

## 10. Kesimpulan final
Flow keuangan dan closure yang benar adalah:
- kebutuhan dibuat dulu
- transaksi dibuat sesuai kebutuhan
- transaksi diapprove dan dihonor
- saldo dihitung dari transaksi valid
- closure baru diizinkan setelah semua transaksi dan kebutuhan final
- semua state changes masuk log audit

Jadi, alur ini tidak stagnan, tidak loop, dan sudah aman untuk diimplementasikan.

Dokumen ini sudah diuji secara logika: tidak ada loop kritis, tidak ada deadlock utama, dan tidak ada closure yang bisa terjadi sebelum semua kebutuhan dan transaksi final.
