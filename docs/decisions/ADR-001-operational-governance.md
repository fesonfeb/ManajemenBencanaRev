# ADR-001: Operational Governance

## Status
Proposed

## Context
Sistem operasi kebencanaan perlu memastikan bahwa semua keputusan penting mengikuti tahapan, kewenangan, dan audit trail yang jelas. Tanpa aturan ini, proses dapat dilewati, data dapat diubah tanpa jejak, dan kebijakan operasional bisa dilanggar.

## Decision
Mengadopsi pendekatan governance yang memisahkan:
- status laporan
- status insiden
- status assessment
- status rencana respons
- status kegiatan
- status distribusi
- status LPJ
- status pemulihan

Semua transisi harus divalidasi di backend dan dicatat di audit trail.

## Consequences
- Proses menjadi lebih jelas dan dapat diaudit.
- Risiko bypass dikurangi.
- UX perlu didesain agar tidak membingungkan petugas operasional.
- Implementasi memerlukan mekanisme role-based validation dan event logging.

## TBD
- Atribut detail untuk tiap lifecycle.
- Aturan final approval untuk tiap langkah.
- Delegasi formal yang diizinkan.
