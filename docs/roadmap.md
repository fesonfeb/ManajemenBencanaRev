# Roadmap

## Tahap 0 — Baseline dokumentasi
- Menyusun project charter, role matrix, flowchart, transition matrix, dashboard specification, LPJ specification, acceptance tests, dan ADR dasar.
- Menetapkan keputusan governance awal.
- Menandai item TBD sebelum final approval.

## Tahap 1 — Lifecycle dan governance detail
- Validasi flowchart per status.
- Menyempurnakan lifecycle per entitas.
- Memetakan peran dan kewenangan secara detail.
- Menyusun blueprint UI dan API.
- Menyiapkan prioritas implementasi berdasarkan status.

## Tahap 2 — Platform and MVP decision lock
- Finalize identity platform: Cloudflare-based auth / OIDC integration.
- Finalize deployment target: Cloudflare Pages + Workers.
- Confirm MVP includes offline-first sync and donor/public access.
- Finalize approval model: Verifikator + Pimpinan approval flow.
- Confirm order of implementation: incident core -> assessment -> LPJ.

## Tahap 3 — Foundation implementation
- Struktur repo implementation baru.
- Setup framework dan toolchain.
- Setup environment dan repo baseline.
- Menyiapkan auth dan RBAC foundation.
- Menyiapkan persiapan testing dan CI.

## Tahap 4 — Domain core
- Insiden
- Assessment
- Volunteering
- Inventory
- Distribution
- Donasi
- Keuangan

## Tahap 5 — LPJ & reporting
- LPJ generation
- Audit trail
- Rekonsiliasi
- Reporting final
- Integrasi redaksi data sensitif

## Tahap 6 — Hardening
- Offline sync
- PWA stabil
- security review
- performance and load testing
- final acceptance

## TBD
- timeline final implementation berdasarkan prioritas bisnis
- prioritas per modul berdasarkan kebutuhan operasional
- sumber data eksternal / integrasi yang dibutuhkan
- exact authentication product detail inside Cloudflare ecosystem
- exact conflict strategy for offline sync and duplicate handling
- exact donor/public boundary per module
