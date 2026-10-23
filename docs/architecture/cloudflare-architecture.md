# Cloudflare-Based Architecture

## 1. Target stack
- Frontend: Cloudflare Pages + Next.js (atau framework SPA yang sesuai) dengan app shell dan routing client-side.
- Backend: Cloudflare Workers for API endpoints and edge validation.
- Database: D1 (relational data) untuk entitas utama seperti incident, assessment, LPJ, users, roles, audit log.
- Storage: R2 untuk file attachments dan bukti pendukung.
- Cache / offline: IndexedDB, Service Worker, queue outbox.

## 2. Arsitektur umum
```text
Client (SPA)
  -> Cloudflare Pages
      -> API calls -> Workers
          -> D1 / R2
          -> auth middleware
          -> RBAC enforcement
          -> audit logging
```

## 3. Aliran request penting
1. User login via Cloudflare-based identity / OIDC provider.
2. Request masuk ke Workers.
3. Middleware validasi auth token, session, role, and scope.
4. Resource handler mengecek state transition, permissions, and business rules.
5. Mutasi data disimpan ke D1 atau R2.
6. Audit log dibuat untuk setiap perubahan state atau data penting.
7. Offline queue dibaca dan disinkronkan saat koneksi kembali tersedia.

## 4. Boundary penting
- Frontend tidak menjadi primary security boundary.
- Role access harus dipastikan di Workers.
- Semua state transition harus diperiksa di backend.
- Donor/public data harus dibatasi dan dipisahkan dengan policy yang jelas.

## 5. Kebutuhan utama tahapan awal
- auth middleware
- RBAC middleware
- audit log middleware
- transition validator
- media/object handler
- offline queue sync manager

## 6. Hal yang masih TBD
- exact auth provider product in Cloudflare environment
- exact sync conflict strategy
- detail donor/public visibility policy
- exact D1 table design per domain
