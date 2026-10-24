# Requirement Traceability Matrix (RTM)
Status: Draft Formal untuk Review Product Owner
Tanggal: 2026-10-24

## 1. Tujuan
Dokumen ini menghubungkan kebutuhan bisnis, aturan operasional, alur kerja, otorisasi, data/API, dan penerimaan pengujian. Tujuannya agar setiap requirement dapat ditelusuri sampai implementasi dan pengujian.

## 2. Definisi status
- Proposed: kebutuhan sudah dirumuskan dan cukup jelas untuk ditelusuri
- TBD: kebutuhan masih memerlukan keputusan Product Owner
- Implemented: sudah ada bukti implementasi
- Not Applicable: kebutuhan tidak relevan pada fase ini

## 3. Requirement Traceability Matrix

| ID | Requirement | Source document(s) | Business rule / rule statement | Workflow / process | Permission / role | UI / screen | Data / API / DB | Acceptance test | Status |
|---|---|---|---|---|---|---|---|---|---|
| REQ-01 | Sistem harus menerima laporan kejadian dari publik dan internal | README, project-charter, flowchart, workflow spec | Laporan harus dicatat dengan sumber, waktu, lokasi, pelapor, bukti, dan status awal. Laporan tidak otomatis valid. | Public form -> intake -> verify queue -> triage | PUBLIC, ADMIN, VERIFIKATOR | Public report page, internal verification queue | report table, report attachments, report status history | TC-01 report intake success; TC-02 invalid input; TC-03 upload validation | Proposed |
| REQ-02 | Sistem harus menangani laporan tidak lengkap, duplikat, dan penolakan dengan alasan | flowchart, status-lifecycle, acceptance-tests | Laporan tidak lengkap harus dibutuhkan klarifikasi; duplikat harus menunjuk laporan utama; reject harus punya alasan. | Incomplete -> clarification; duplicate -> resolved; reject -> closed | VERIFIKATOR, ADMIN | report detail page, clarification modal | report_status_history, duplicate_reference_id | TC-04 clarification; TC-05 duplicate; TC-06 reject with reason | Proposed |
| REQ-03 | Sistem harus memisahkan status laporan, insiden, assessment, tugas, dan LPJ | workflow spec, status-lifecycle, transition-matrix | Status bukan satu field tunggal. Setiap entitas punya lifecycle berbeda. | Laporan -> triage -> incident -> assessment -> task | Semuanya sesuai scope | dashboard by role | per-domain status table / status enum | TC-07 status transition valid; TC-08 invalid transition | Proposed |
| REQ-04 | Sistem harus memiliki proses verifikasi dan triase yang jelas | flowchart, triage section, acceptance-tests | Verifikasi dan triase dipisahkan. Prioritas harus berdasarkan urgensi, dampak, akses, dan risiko. | Report -> triage -> priority assessment -> escalation | VERIFIKATOR, PIMPINAN, ADMIN | triage queue, priority panel | triage_case table | TC-09 valid triage; TC-10 invalid role; TC-11 emergency escalation | Proposed |
| REQ-05 | Sistem harus mendukung eskalasi darurat dengan pencatatan waktu, penerima, dan konfirmasi | master prompt, workflow spec, flowchart | Eskalasi darurat harus mencatat waktu, penerima, alasan, penerimaan, dan jalur cadangan. | emergency escalation path | VERIFIKATOR, PIMPINAN, ADMIN | escalation panel | escalation log, audit trail | TC-12 emergency escalation; TC-13 no auto-valid | Proposed |
| REQ-06 | Sistem harus menetapkan incident ID terpisah dari report ID | project-charter, workflow spec, identity model | REPORT_ID tidak otomatis menjadi INCIDENT_ID. Satu incident bisa punya banyak laporan. | Report validated -> incident created | VERIFIKATOR, ADMIN, PIMPINAN | incident detail page | incidents table, incident_report relation | TC-14 multi-report single incident | Proposed |
| REQ-07 | Sistem harus mengelola penugasan assessor dan surat tugas | project charter, workflow spec, tasking docs | Penugasan dibatasi oleh peran dan domain. Surat tugas punya nomor, versi, dan referensi tugas. | task assignment -> task letter -> acceptance -> assessment | ADMIN, KOORDINATOR_LAPANGAN, ASESOR | task list, task letter detail, assessor dashboard | tasks table, task_letters table | TC-15 task assigned once; TC-16 task letter revision; TC-17 assessor accept/decline | Proposed |
| REQ-08 | Sistem harus menyediakan assessment lapangan modular dan terukur | master prompt, workflow spec, assessment section | Assessment punya field modular, data yang diberikan harus jelas, dan nilai kosong bukan nol. | assigned -> in progress -> submit -> review -> approve/reject | ASESOR, VERIFIKATOR, ADMIN, PIMPINAN | assessment form, review screen | assessments table, assessment_versions | TC-18 draft save; TC-19 submit; TC-20 revision | Proposed |
| REQ-09 | Sistem harus mendukung revisi assessment tanpa menghilangkan riwayat | assessment section, lifecycle spec | Revisi harus menghasilkan versi baru; history tetap ada. | submitted -> needs_revision -> resubmit -> approval | ASESOR, VERIFIKATOR | history and revision panel | assessment_versions, audit_log | TC-21 revision trail; TC-22 approval restrictions | Proposed |
| REQ-10 | Sistem harus mengelola program, kebutuhan, dan proposal donatur | project-charter, program section, flowchart | Program terkait incident; kebutuhan terkait program; proposal punya approval dan visibility rules. | program plan -> review -> active -> completion | ADMIN, PIMPINAN, KOORDINATOR_LAPANGAN, DONATUR | program dashboard, proposal page | programs, need_items, proposals | TC-23 program approval; TC-24 proposal visibility rules | Proposed |
| REQ-11 | Sistem harus mengelola logistik, stok, dan distribusi dengan dokumen sah | master prompt, logistics section, dispatch note requirement | Barang keluar harus ada surat jalan yang terkait dengan OPERATION_ORDER_ID dan tujuan. Stok tidak boleh negatif tanpa aturan formal. | request -> approved -> pick -> dispatch -> receive | LOGISTIK, ADMIN, KOORDINATOR_LAPANGAN | inventory dashboard, dispatch page, receiving proof | inventory_items, stock_movements, dispatch_notes, distributions | TC-25 stock movement validation; TC-26 dispatch note required; TC-27 partial receive | Proposed |
| REQ-12 | Sistem harus mengelola keuangan dengan ledger, approval, dan rekonsiliasi | master prompt, financial section, flowchart | Anggaran, komitmen, pengajuan, approval, pembayaran, reversals, dan saldo harus dipisah. | draft -> review -> approve -> pay -> reconcile | KEUANGAN, ADMIN, PIMPINAN, AUDITOR | finance dashboard, ledger report | financial_transactions, budgets, audit trail | TC-28 maker-checker; TC-29 reversal; TC-30 reconciliation | Proposed |
| REQ-13 | Sistem harus mengelola volunteer, penugasan, absensi, dan lapangan | master prompt, volunteer section | Absensi fisik diverifikasi harus dipisahkan dari pelaporan mandiri. GPS bukan bukti mutlak. | task assign -> confirm -> check-in -> work -> report | VOLUNTEER, KOORDINATOR_LAPANGAN, ADMIN | volunteer dashboard, attendance view | volunteer_profiles, attendance, task_assignment | TC-31 attendance verify; TC-32 self-report pending | Proposed |
| REQ-14 | Sistem harus mengelola LPJ, penutupan operasi, dan arsip dokumen | LPJ section, closure section, project charter | LPJ harus traceable ke transaksi dan bukti; final LPJ harus snapshot dengan revisi formal. | report/incidents -> LPJ draft -> review -> final -> archive | PIMPINAN, ADMIN, AUDITOR | LPJ dashboard, closure checklist | lpj, final_snapshot, document archive | TC-33 final LPJ; TC-34 closure blocked by unmet condition | Proposed |
| REQ-15 | Sistem harus memiliki audit trail dan kontrol keamanan di backend | security-rbac, audit trail section, master prompt | Semua perubahan material wajib tercatat dengan actor, waktu, status before/after, alasan, approval ref, correlation ID. | any mutation action | SUPERADMIN, ADMIN, AUDITOR | audit log dashboard | audit_log, identity-based middleware | TC-35 unauthorized mutation blocked; TC-36 audit log captured | Proposed |
| REQ-16 | Sistem harus mengakomodasi dashboard per role dan penjelasan indikator | dashboard spec, role matrix | Dashboard sesuai role harus mencakup kebutuhan pekerjaan, prioritas, dan keputusan. | role-based dashboard access | per role | role-specific dashboard | dashboard widgets, role permissions, filter config | TC-37 dashboard data for each role; TC-38 empty state | Proposed |
| REQ-17 | Sistem harus mendukung laporan publik yang aman, mobile-friendly, dan belum tentu valid otomatis | master prompt front-page reporting | Form publik harus sederhana, bertahap, dan aman dari spam. Tidak meminta data berlebihan. | public reporting journey | PUBLIC, ADMIN, VERIFIKATOR | public report form | public_report_input, validation rules | TC-39 public form validation; TC-40 anti-spam | TBD |
| REQ-18 | Sistem harus memisahkan triase, keyakinan informasi, dan urgensi | master prompt triage section | Triase bukan sama dengan keyakinan data atau urgency. | triage -> reported status -> incident status | VERIFIKATOR, PIMPINAN | triage detail screen | triage_case, certainty_level | TC-41 triage vs certainty distinction | TBD |
| REQ-19 | Sistem harus mendukung aksi darurat tanpa menghambat keselamatan | master prompt emergency section | Mekanisme darurat harus punya batas kewenangan, pencatatan, dan evaluasi. | emergency response override path | PIMPINAN, VERIFIKATOR, ADMIN | emergency escalation panel | emergency_action_log | TC-42 emergency override recorded | TBD |
| REQ-20 | Sistem harus memisahkan status kegiatan operasional dari status insiden dan laporan | status-lifecycle doc | Kegiatan, insiden, dan laporan harus independen. | plan -> assign -> execute -> close | KOORDINATOR_LAPANGAN, ADMIN | operational task board | activities table | TC-43 activity lifecycle independence | TBD |
| REQ-21 | Sistem harus menyediakan persyaratan untuk persetujuan final dan penutupan operasi | closure section, LPJ section | Penutupan operasi tidak valid bila syarat wajib belum selesai. | closure checklist -> approval | PIMPINAN, ADMIN, AUDITOR | closure review page | closure_checklist, final approval log | TC-44 blocked closure test | TBD |
| REQ-22 | Sistem harus memiliki status transition matrix yang terdokumentasi per domain | transition-matrix docs | Setiap transisi harus punya actor, prasyarat, alasan, audit trail, dan efek samping. | domain-specific state transitions | per role that can transition | transition UI | status_transition_logs | TC-45 transition matrix validation | TBD |
| REQ-23 | Sistem harus menyediakan role-resource-action matrix formal | security-rbac doc | Setiap role harus punya hak yang jelas untuk resource dan action tertentu. | role-permission enforcement | semua role | access control UI admin | role_permissions, permission_matrix | TC-46 permission denial; TC-47 permission grant | TBD |
| REQ-24 | Sistem harus mendukung real time dashboard dengan filter periode, indikator, dan definisi yang jelas | dashboard specification | Dashboard harus memuat data actual dan definisi indikator. | role dashboard access | per role | dashboard page | metric definitions, reporting query | TC-48 dashboard metric checks | TBD |

## 4. Ringkasan status RTM

| Kategori | Jumlah |
|---|---:|
| Proposed / traceable | 16 |
| TBD / requires approval | 8 |
| Implemented / existing evidence | 0 |
| Not applicable | 0 |

## 5. Keputusan yang masih terbuka (Open Decisions)

| ID | Pertanyaan | Dampak | Rekomendasi |
|---|---|---|---|
| ODR-01 | Auth provider final apakah OIDC / Cloudflare Access / provider lain? | keamanan, sesi, akses API | pilih satu sebelum coding |
| ODR-02 | Offline-first masuk MVP atau tidak? | prioritas dan kompleksitas | hold di fase berikutnya jika belum disetujui |
| ODR-03 | Visibility donor/public final | data sensitif, publikasi proposal | perlu policy final |
| ODR-04 | Definisi triase final 1-5 atau status set | workflow dan prioritas | buat final sebelum coding |
| ODR-05 | Role-resource-action matrix final | otorisasi benar-benar terimplementasi | wajib final sebelum auth dan API |
| ODR-06 | Prioritas modul implementasi | roadmap dan sprint | fokus pada core operational first |
| ODR-07 | Geospatial strategy final | peta, lokasi, koordinat | pilih provider/manual fallback |
| ODR-08 | Payment gateway donor masuk scope atau tidak | keuangan dan donor module | hold di phase berikutnya jika belum perlu |

## 6. Catatan final
Dokumen ini merupakan draft formal RTM untuk review Product Owner dan tim implementasi. Masih belum ada bukti implementasi aplikasi yang berjalan; karena itu seluruh requirement yang tercantum tetap berada pada status proposed atau TBD sampai ada persetujuan final dari pemilik proyek dan implementasi teknis yang tervalidasi.

## 7. Sumber utama yang dipakai
- README.md
- docs/project-charter.md
- docs/flowcharts/operational-flowchart.md
- docs/workflows/status-lifecycle.md
- docs/workflows/transition-matrix.md
- docs/roles/permission-matrix.md
- docs/architecture/security-rbac.md
- docs/architecture/cloudflare-architecture.md
- docs/screens/dashboard-specification.md
- docs/testing/acceptance-tests.md
- docs/00-po-approval-memo.md
- docs/01-workflow-specification.md
- docs/02-role-permission-matrix.md
- docs/03-status-lifecycle.md
- docs/04-dashboard-specification.md
- docs/05-module-endpoint-role-status-mapping.md
- docs/06-release-plan.md
- docs/07-entity-relationship-model.md
- docs/08-implementation-repo-structure.md
