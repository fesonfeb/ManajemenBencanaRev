# Struktur Repo Implementation Final
Status: Approved by Product Owner
Tanggal: 2026-10-24

## 1. Tujuan
Dokumen ini menjelaskan struktur repository yang disarankan agar dapat dipakai developer untuk mulai implementasi aplikasi manajemen operasi kebencanaan. Struktur ini mengikuti prinsip:
- frontend dan backend dipisah
- RBAC diterapkan di backend
- database relasional dipisahkan dari aplikasi runtime
- file attachment disimpan di storage yang aman
- Cloudflare dipakai sebagai target deployment utama

## 2. Prinsip Struktur
- Frontend SPA dipisahkan dari backend API.
- Semua validasi dan otorisasi dilakukan di server.
- Master data dan transaksi dikelola dalam database relasional.
- Attachments ditampung di storage yang aman dan tidak dipublikasikan sembarangan.
- Semua status dan perubahan dikendalikan dengan audit trail.
- Modul dipisahkan berdasarkan domain operasional agar pengujian dan pembaruan lebih aman.

## 3. Struktur Repository

```text
manajemen-bencana/
├─ apps/
│  ├─ web/
│  │  ├─ app/
│  │  │  ├─ (auth)/
│  │  │  │  ├─ login/
│  │  │  │  ├─ reset-password/
│  │  │  │  └─ register/
│  │  │  ├─ (public)/
│  │  │  │  ├─ laporan/
│  │  │  │  ├─ status-tiket/
│  │  │  │  └─ publik/
│  │  │  ├─ (internal)/
│  │  │  │  ├─ dashboard/
│  │  │  │  ├─ laporan/
│  │  │  │  ├─ insiden/
│  │  │  │  ├─ assessment/
│  │  │  │  ├─ tugas/
│  │  │  │  ├─ program/
│  │  │  │  ├- logistik/
│  │  │  │  ├─ keuangan/
│  │  │  │  ├─ lpj/
│  │  │  │  └─ audit/
│  │  │  ├─ api/
│  │  │  │  ├─ health/
│  │  │  │  └─ proxy/
│  │  │  └─ globals.css
│  │  ├─ components/
│  │  │  ├─ auth/
│  │  │  ├─ dashboard/
│  │  │  ├─ forms/
│  │  │  ├─ layouts/
│  │  │  ├─ tables/
│  │  │  ├─ widgets/
│  │  │  └─ ui/
│  │  ├─ lib/
│  │  │  ├─ api.ts
│  │  │  ├─ auth.ts
│  │  │  ├─ date.ts
│  │  │  ├─ query.ts
│  │  │  ├─ utils.ts
│  │  │  └─ validation.ts
│  │  ├─ public/
│  │  │  ├─ icons/
│  │  │  └─ images/
│  │  ├─ package.json
│  │  ├─ next.config.js
│  │  ├─ tsconfig.json
│  │  └─ .env.example
│  │
│  └─ admin/
│     └─ ... (opsional bila dipisah untuk admin internal)
│
├─ workers/
│  ├─ src/
│  │  ├─ routes/
│  │  │  ├─ auth/
│  │  │  ├─ reports/
│  │  │  ├─ incidents/
│  │  │  ├─ assessments/
│  │  │  ├─ tasks/
│  │  │  ├─ programs/
│  │  │  ├─ logistics/
│  │  │  ├─ finance/
│  │  │  ├─ audit/
│  │  │  └─ notifications/
│  │  ├─ middleware/
│  │  │  ├─ auth.ts
│  │  │  ├─ rbac.ts
│  │  │  ├─ validation.ts
│  │  │  ├─ audit.ts
│  │  │  └─ rate-limit.ts
│  │  ├─ services/
│  │  │  ├─ report.service.ts
│  │  │  ├─ incident.service.ts
│  │  │  ├─ assessment.service.ts
│  │  │  ├─ task.service.ts
│  │  │  ├─ program.service.ts
│  │  │  ├─ logistics.service.ts
│  │  │  ├─ finance.service.ts
│  │  │  ├─ audit.service.ts
│  │  │  └─ notification.service.ts
│  │  ├─ lib/
│  │  │  ├─ db.ts
│  │  │  ├─ errors.ts
│  │  │  ├─ logger.ts
│  │  │  ├─ pagination.ts
│  │  │  ├─ permissions.ts
│  │  │  └─ utils.ts
│  │  ├─ index.ts
│  │  ├─ env.ts
│  │  └─ app.ts
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ wrangler.toml
│  └─ .dev.vars.example
│
├─ packages/
│  ├─ shared/
│  │  ├─ enums/
│  │  │  ├─ roles.ts
│  │  │  ├─ permissions.ts
│  │  │  ├─ report-status.ts
│  │  │  ├─ incident-status.ts
│  │  │  ├─ assessment-status.ts
│  │  │  └─ module-status.ts
│  │  ├─ schemas/
│  │  │  ├─ report.schema.ts
│  │  │  ├─ incident.schema.ts
│  │  │  ├─ assessment.schema.ts
│  │  │  ├─ task.schema.ts
│  │  │  ├─ logistics.schema.ts
│  │  │  └─ finance.schema.ts
│  │  ├─ types/
│  │  │  ├─ api.ts
│  │  │  ├─ auth.ts
│  │  │  ├─ user.ts
│  │  │  └─ common.ts
│  │  ├─ validators/
│  │  │  ├─ report.validator.ts
│  │  │  ├─ file.validator.ts
│  │  │  └─ common.validator.ts
│  │  └─ utils/
│  │     ├─ date.ts
│  │     ├─ id.ts
│  │     ├─ object.ts
│  │     └─ text.ts
│  │
│  └─ ui/
│     ├─ components/
│     │  ├─ buttons/
│     │  ├─ cards/
│     │  ├─ tables/
│     │  └─ forms/
│     ├─ styles/
│     │  ├─ tokens.css
│     │  └─ globals.css
│     └─ theme.ts
│
├─ db/
│  ├─ migrations/
│  │  ├─ 001_init.sql
│  │  ├─ 002_roles_permissions.sql
│  │  ├─ 003_master_data.sql
│  │  ├─ 004_reports_incidents.sql
│  │  ├─ 005_assessments_tasks.sql
│  │  ├─ 006_programs_needs.sql
│  │  ├─ 007_logistics_distribution.sql
│  │  ├─ 008_finance.sql
│  │  └─ 009_audit_lpj.sql
│  ├─ seeds/
│  │  ├─ roles.sql
│  │  ├─ permissions.sql
│  │  ├─ admin-user.sql
│  │  └─ master-data.sql
│  └─ schema/
│     ├─ core.sql
│     ├─ logistics.sql
│     ├─ finance.sql
│     ├─ audit.sql
│     └─ lpj.sql
│
├─ tests/
│  ├─ unit/
│  │  ├─ validators/
│  │  ├─ services/
│  │  └─ utils/
│  ├─ integration/
│  │  ├─ auth/
│  │  ├─ reports/
│  │  ├─ incidents/
│  │  ├─ assessment/
│  │  ├─ logistics/
│  │  └─ finance/
│  ├─ e2e/
│  │  ├─ public/
│  │  ├─ internal/
│  │  └─ workflow/
│  └─ fixtures/
│     ├─ reports/
│     ├─ incidents/
│     ├─ files/
│     └─ users/
│
├─ docs/
│  ├─ 00-po-approval-memo.md
│  ├─ 01-workflow-specification.md
│  ├─ 02-role-permission-matrix.md
│  ├─ 03-status-lifecycle.md
│  ├─ 04-dashboard-specification.md
│  ├─ 05-module-endpoint-role-status-mapping.md
│  ├─ 06-release-plan.md
│  └─ 07-entity-relationship-model.md
│
├─ .github/
│  └─ workflows/
│     ├─ ci.yml
│     └─ deploy.yml
│
├─ .env.example
├─ .gitignore
├─ package.json
├─ pnpm-lock.yaml
├─ turbo.json
├─ README.md
└─ LICENSE
```

## 4. Penjelasan Domain Utama

### 4.1 apps/web
Frontend SPA untuk public dan internal dashboard. Fokus:
- formulir laporan publik
- dashboard per role
- form assessment dan tasking
- master data management
- LPJ preview dan export

### 4.2 workers/src/routes
Semua endpoint API dikelompokkan sesuai domain. Fokus:
- autentikasi
- otorisasi dan RBAC
- validasi request
- aksi domain
- audit trail
- notifikasi ringkas

### 4.3 packages/shared
Berisi schema, enums, validator, dan util yang dipakai bersama oleh frontend dan workers untuk menjaga konsistensi data.

### 4.4 db/migrations
Menampung migration SQL untuk D1. Setiap perubahan skema harus dilakukan dalam file migration terpisah.

### 4.5 tests
Menampung unit, integration, dan end-to-end tests. Fokus pada:
- role enforcement
- workflow status transitions
- duplicate report handling
- verification and reject flow
- stock movement validation
- financial transaction integrity
- LPJ traceability

## 5. Peran Cloudflare dalam Struktur Ini
- Cloudflare Pages: frontend SPA
- Cloudflare Workers: backend API dan business logic
- D1: database relasional
- R2: attachment, foto, dokumen, file bukti
- Cloudflare Turnstile: filtering form publik dan spam protection
- Optional Durable Objects / Queues: jika nanti offline sync atau proses asynchronous dibutuhkan

## 6. Catatan Implementasi Awal
- Tidak langsung menulis semua modul besar sekaligus.
- Implementasi dimulai dari domain paling fundamental:
  1. auth + RBAC
  2. report + triage + incident
  3. assessment + task
  4. logistics + distribution
  5. finance
  6. LPJ + closure
- Semua logika status dan audit harus dipisahkan dari UI dan dipastikan di backend.

## 7. Kesimpulan
Struktur repo ini cocok untuk serangkaian implementasi multitier yang dibangun di Cloudflare. Struktur ini menjaga modul tetap terpisah, memudahkan QA, dan konsisten dengan alur operasional yang telah disetujui Product Owner.
