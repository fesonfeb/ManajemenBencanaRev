# Status Lifecycle by Module
Status: Approved by Product Owner

## 1. Tujuan
Dokumen ini memastikan setiap modul memiliki lifecycle yang terpisah dan tidak dipaksa memakai satu status untuk seluruh proses. Semua transisi status harus memiliki actor, waktu, alasan, dan histori.

## 2. Status per Modul

### Laporan
- RECEIVED
- IN_REVIEW
- NEEDS_CLARIFICATION
- TRIAGE_PENDING
- ACCEPTED
- REJECTED
- DUPLICATE
- CLOSED

### Triase
- PENDING
- PRIORITY_ASSESSED
- ESCALATED
- REFERRED
- NO_ACTION_WITH_REASON

### Assessment
- NOT_ASSIGNED
- ASSIGNED
- ACKNOWLEDGED
- IN_PROGRESS
- SUBMITTED
- NEEDS_REVISION
- APPROVED
- REJECTED
- CANCELLED
- REASSIGNED

### Insiden
- MONITORING
- RESPONSE_ACTIVATED
- RESPONSE_ONGOING
- RESPONSE_SUSPENDED
- RESPONSE_COMPLETED
- CLOSED

### Program
- DRAFT
- IN_REVIEW
- APPROVED
- ACTIVE
- ON_HOLD
- COMPLETED
- CANCELLED

### Distribusi
- DRAFT
- APPROVED
- PICKING
- DISPATCHED
- PARTIALLY_RECEIVED
- RECEIVED
- RECONCILIATION_PENDING
- COMPLETED
- CANCELLED

### Keuangan
- DRAFT
- SUBMITTED
- REVIEWED
- APPROVED
- PAID
- REJECTED
- REVERSED
- RECONCILED

### Logistik / Stok
- REQUESTED
- APPROVED
- RECEIVED
- RESERVED
- PICKING
- DISPATCHED
- PARTIALLY_RECEIVED
- ADJUSTED
- DAMAGED
- RETURNED

### LPJ
- DRAFT
- IN_REVIEW
- APPROVED
- FINAL
- ARCHIVED

## 3. Aturan Transisi Status
Setiap transisi status harus mencakup:
- status awal
- status tujuan
- actor yang berwenang
- prasyarat
- alasan/catatan bila dibutuhkan
- waktu dan identitas pelaku
- riwayat perubahan

## 4. Kondisi Khusus
- DUPLICATE wajib punya referensi laporan utama.
- REJECTED wajib punya alasan.
- CLOSED tidak berarti histori dihapus.
- Transaksi yang sah tidak boleh dihapus; harus dibuat koreksi atau reversal.
- Barang keluar harus dicatat dengan surat jalan dan referensi OPERATION_ORDER_ID.

## 5. Pengujian Status
QA harus menyiapkan skenario:
- transisi status sah
- transisi status tidak sah
- status dari laporan ke insiden
- assessment revisi dan approval
- distribusi partial receive
- reversal keuangan
- closure operasi dengan syarat belum terpenuhi
