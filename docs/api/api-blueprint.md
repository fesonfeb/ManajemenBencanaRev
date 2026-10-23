# API Blueprint

Dokumen ini memetakan struktur API yang dibutuhkan untuk implementasi berikutnya. Fokusnya adalah memastikan backend menjalankan validasi proses, bukan hanya UI.

## 1. Prinsip API
- Backend selalu memvalidasi status transition
- Role dan scope diperiksa di server
- Setiap aksi mutasi harus memiliki audit log
- Setiap request mutasi harus memiliki idempotency key bila memungkinkan
- Hanya action yang sah yang dapat mengubah state

## 2. Resource utama
- /api/reports
- /api/incidents
- /api/assessments
- /api/plans
- /api/activities
- /api/procurement
- /api/distributions
- /api/volunteers
- /api/donations
- /api/finance
- /api/lpj
- /api/users
- /api/roles
- /api/audit
- /api/files

## 3. Pola endpoint umum
Setiap resource utama minimal mempunyai:
- GET /resource
- GET /resource/:id
- POST /resource
- PATCH /resource/:id
- DELETE /resource/:id (hanya untuk kondisi tertentu; biasakan tidak menghapus data operasional tanpa mekanisme special)
- POST /resource/:id/actions/:action
- GET /resource/:id/audit

## 4. Action model
Untuk setiap resource, action global dapat berupa:
- submit
- verify
- reject
- return
- assign
- approve
- revise
- cancel
- close
- reopen
- archive

Setiap action wajib mengecek:
- role actor
- state asal
- state tujuan
- prerequisite lengkap
- scope dan relasi data
- whether current user is allowed to act
- whether idempotency key has been seen before

## 5. Endpoint contoh
### 5.1 Laporan
- POST /api/reports
- PATCH /api/reports/:id
- POST /api/reports/:id/verify
- POST /api/reports/:id/reject
- POST /api/reports/:id/duplicate

### 5.2 Insiden
- POST /api/incidents
- PATCH /api/incidents/:id
- POST /api/incidents/:id/validate
- POST /api/incidents/:id/close
- POST /api/incidents/:id/reopen

### 5.3 Assessment
- POST /api/assessments
- PATCH /api/assessments/:id
- POST /api/assessments/:id/assign
- POST /api/assessments/:id/submit
- POST /api/assessments/:id/approve
- POST /api/assessments/:id/return

### 5.4 Rencana respons
- POST /api/plans
- PATCH /api/plans/:id
- POST /api/plans/:id/review
- POST /api/plans/:id/approve
- POST /api/plans/:id/revise

### 5.5 Distribusi
- POST /api/distributions
- PATCH /api/distributions/:id
- POST /api/distributions/:id/prepare
- POST /api/distributions/:id/deliver
- POST /api/distributions/:id/close

### 5.6 LPJ
- POST /api/lpj
- PATCH /api/lpj/:id
- POST /api/lpj/:id/review
- POST /api/lpj/:id/approve
- POST /api/lpj/:id/finalize

## 6. Response standard
Setiap response harus menyertakan:
- status
- data utama
- traceId atau requestId
- actor info
- timestamp
- audit metadata
- optional validation errors

## 7. Error model
Error harus memuat:
- code
- message
- allowed action(s)
- current state
- required fields
- user role context

## 8. TBD
- exact schema for each entity
- exact idempotency strategy
- webhook model for notifications
- file upload APIs and object storage flow
- notification events and channel mapping
