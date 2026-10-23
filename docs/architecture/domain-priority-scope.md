# Domain Priority Scope

Dokumen ini menjelaskan fokus implementasi awal berdasarkan keputusan product yang sudah disepakati.

## Prioritas 1: Incident Core
Domain utama:
- report intake
- incident creation
- validation
- incident status transition
- assignment and ownership
- history and audit trail

Output expected:
- report object dengan status log
- incident detail dengan traceability
- incident event timeline
- permissions sesuai role

## Prioritas 2: Assessment Workflow
Domain utama:
- assessment assignment
- assessment form and evidence
- assessment review
- approval or return
- result mapping to incident / response plan

Output expected:
- assessment record with evidence
- review trail
- approval or return logic
- audit trail of revisions

## Prioritas 3: LPJ and Reporting
Domain utama:
- LPJ draft creation
- field data aggregation
- final version and approval
- report export and final packaging
- reconciliation summary

Output expected:
- LPJ with version metadata
- traceable evidence and transactions
- final status with review requirement

## Batasan tujuan
- Domain ini yang diprioritaskan, bukan seluruh sistem dalam satu langkah.
- Implementasi terbaik dipecah per domain dengan test yang jelas.
- Domain non-prioritas tetap dicatat sebagai backlog terstruktur.

## Governance principle
Setiap domain harus mempunyai:
- lifecycle status
- authoritative actor(s)
- audit trail
- failure and rejection flow
- approval rules
- ability to return or revise without data loss
