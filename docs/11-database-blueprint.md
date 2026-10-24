# Blueprint Database Awal Per Modul
Status: Draft Formal untuk Review Product Owner dan Tim Implementasi
Tanggal: 2026-10-24

## 1. Tujuan
Dokumen ini berfungsi sebagai blueprint database awal untuk semua modul utama dalam sistem manajemen operasi kebencanaan. Tujuannya adalah memastikan bahwa struktur data didasarkan pada workflow dan role yang sudah ditetapkan, serta memudahkan implementasi di D1/SQL relasional. Blueprint ini bersifat awal dan masih dapat disempurnakan sesuai finalisasi domain dan policy.

## 2. Prinsip desain database
- Setiap entitas utama memiliki primary key stable ID.
- Semua tabel penting punya created_at, updated_at, created_by, updated_by.
- Semua perubahan status harus dicatat di audit_log.
- Semua transaksi penting harus menggunakan immutable atau append-only model bila memang diperlukan.
- Semua relasi antar tabel harus jelas: many-to-one, one-to-many, atau many-to-many.
- Data sensitif tidak dipublikasikan tanpa visibility policy.
- Seluruh status harus terpisah per modul, bukan satu field status tunggal untuk semua entitas.

## 3. Modul 1: Core Identity dan Security

### 3.1 users
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | stable user id |
| email | TEXT | unique |
| phone | TEXT | nullable |
| full_name | TEXT | required |
| password_hash | TEXT | nullable if using external auth |
| status | TEXT | active/inactive/suspended |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |
| last_login_at | TIMESTAMP | nullable |
| auth_provider | TEXT | local, oidc, etc |

### 3.2 roles
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | role id |
| code | TEXT UNIQUE | SUPERADMIN, ADMIN, PIMPINAN, etc |
| name | TEXT | display name |
| description | TEXT | nullable |
| is_active | BOOLEAN | default true |

### 3.3 permissions
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | permission id |
| code | TEXT UNIQUE | ex: reports:create |
| name | TEXT | display name |
| description | TEXT | nullable |

### 3.4 user_roles
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | composite relation id |
| user_id | TEXT FK -> users.id | required |
| role_id | TEXT FK -> roles.id | required |
| org_id | TEXT FK -> organizations.id | nullable |
| unit_id | TEXT FK -> units.id | nullable |
| incident_id | TEXT FK -> incidents.id | nullable |
| effective_from | TIMESTAMP | required |
| effective_to | TIMESTAMP | nullable |
| granted_by | TEXT FK -> users.id | nullable |

### 3.5 organizations
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | org id |
| name | TEXT | required |
| type | TEXT | yayasan, unit, cabang, donor, etc |
| parent_org_id | TEXT FK -> organizations.id | nullable |
| status | TEXT | active/inactive |
| created_at | TIMESTAMP | required |

### 3.6 units
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | unit id |
| org_id | TEXT FK -> organizations.id | required |
| name | TEXT | required |
| type | TEXT | ops, finance, logistics, field, etc |
| parent_unit_id | TEXT FK -> units.id | nullable |
| status | TEXT | active/inactive |

### 3.7 locations
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | location id |
| province | TEXT | nullable |
| city | TEXT | nullable |
| district | TEXT | nullable |
| village | TEXT | nullable |
| address_detail | TEXT | nullable |
| latitude | TEXT | nullable |
| longitude | TEXT | nullable |
| source | TEXT | manual, geocoding, gps |
| accuracy | TEXT | high/medium/low |
| created_at | TIMESTAMP | required |

## 4. Modul 2: Laporan, Verifikasi, dan Insiden

### 4.1 reports
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | REPORT_ID |
| incident_id | TEXT FK -> incidents.id | nullable until incident established |
| source_channel | TEXT | web, petugas, whatsapp, etc |
| event_category | TEXT | flood, fire, earthquake, etc |
| reported_at | TIMESTAMP | required |
| occurred_at | TIMESTAMP | nullable |
| location_id | TEXT FK -> locations.id | required |
| reporter_name | TEXT | nullable |
| reporter_contact | TEXT | nullable |
| reporter_relation | TEXT | nullable |
| summary | TEXT | required |
| status | TEXT | RECEIVED, IN_REVIEW, NEEDS_CLARIFICATION, TRIAGE_PENDING, ACCEPTED, REJECTED, DUPLICATE, CLOSED |
| verification_status | TEXT | nullable |
| duplicate_of_report_id | TEXT FK -> reports.id | nullable |
| created_by | TEXT FK -> users.id | required |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |

### 4.2 report_attachments
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | attachment id |
| report_id | TEXT FK -> reports.id | required |
| file_name | TEXT | required |
| file_url | TEXT | secure object storage path |
| mime_type | TEXT | required |
| file_size | INTEGER | nullable |
| storage_provider | TEXT | R2, etc |
| created_at | TIMESTAMP | required |
| uploaded_by | TEXT FK -> users.id | required |

### 4.3 incidents
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | INCIDENT_ID |
| title | TEXT | required |
| incident_type | TEXT | disaster type |
| status | TEXT | MONITORING, RESPONSE_ACTIVATED, RESPONSE_ONGOING, RESPONSE_SUSPENDED, RESPONSE_COMPLETED, CLOSED |
| org_id | TEXT FK -> organizations.id | required |
| region_id | TEXT FK -> locations.id | nullable |
| created_by | TEXT FK -> users.id | required |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |
| closed_at | TIMESTAMP | nullable |

### 4.4 triage_cases
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | triage case id |
| report_id | TEXT FK -> reports.id | required |
| incident_id | TEXT FK -> incidents.id | nullable |
| urgency_level | TEXT | low/medium/high/critical |
| risk_level | TEXT | low/medium/high |
| triage_status | TEXT | PENDING, PRIORITY_ASSESSED, ESCALATED, REFERRED, NO_ACTION_WITH_REASON |
| assigned_verifier_id | TEXT FK -> users.id | nullable |
| escalated_to | TEXT FK -> users.id | nullable |
| escalation_time | TIMESTAMP | nullable |
| reason | TEXT | required if rejected or escalated |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |

## 5. Modul 3: Assessment, Task, dan Surat Tugas

### 5.1 assessments
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | ASSESSMENT_ID |
| incident_id | TEXT FK -> incidents.id | required |
| task_id | TEXT FK -> tasks.id | nullable when assigned via task |
| assessor_id | TEXT FK -> users.id | required |
| started_at | TIMESTAMP | nullable |
| finished_at | TIMESTAMP | nullable |
| status | TEXT | NOT_ASSIGNED, ASSIGNED, ACKNOWLEDGED, IN_PROGRESS, SUBMITTED, NEEDS_REVISION, APPROVED, REJECTED, CANCELLED, REASSIGNED |
| certainty_level | TEXT | VERIFIED, ESTIMATED, UNKNOWN, NOT_APPLICABLE |
| version | INTEGER | required, starts at 1 |
| review_notes | TEXT | nullable |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |
| approved_by | TEXT FK -> users.id | nullable |

### 5.2 assessment_versions
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | assessment version id |
| assessment_id | TEXT FK -> assessments.id | required |
| version | INTEGER | required |
| payload_json | JSON | full form snapshot |
| submitted_by | TEXT FK -> users.id | required |
| submitted_at | TIMESTAMP | required |
| reason | TEXT | nullable |

### 5.3 tasks
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | TASK_ID |
| incident_id | TEXT FK -> incidents.id | required |
| task_type | TEXT | assessment, logistics, distribution, monitoring |
| assignee_id | TEXT FK -> users.id | required for active assignment |
| coordinator_id | TEXT FK -> users.id | required if applicable |
| status | TEXT | DRAFT, ASSIGNED, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED, REASSIGNED |
| assigned_at | TIMESTAMP | required |
| deadline_at | TIMESTAMP | nullable |
| location_id | TEXT FK -> locations.id | nullable |
| instructions | TEXT | required |
| created_by | TEXT FK -> users.id | required |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |

### 5.4 task_letters
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | task letter id |
| task_id | TEXT FK -> tasks.id | required |
| letter_number | TEXT | unique required |
| issue_date | TIMESTAMP | required |
| based_on | TEXT | assignment basis |
| assignee_name | TEXT | required |
| assignee_role | TEXT | required |
| incident_id | TEXT FK -> incidents.id | required |
| location_id | TEXT FK -> locations.id | nullable |
| task_period | TEXT | required |
| scope | TEXT | required |
| authorized_by | TEXT FK -> users.id | required |
| version | INTEGER | required |
| published_at | TIMESTAMP | nullable |
| created_at | TIMESTAMP | required |

## 6. Modul 4: Program, Kebutuhan, Proposal, dan Donatur

### 6.1 programs
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | PROGRAM_ID |
| incident_id | TEXT FK -> incidents.id | required |
| name | TEXT | required |
| background | TEXT | nullable |
| objective | TEXT | required |
| location_id | TEXT FK -> locations.id | required |
| target_group | TEXT | nullable |
| schedule_start | TIMESTAMP | nullable |
| schedule_end | TIMESTAMP | nullable |
| coordinator_id | TEXT FK -> users.id | nullable |
| budget_total | DECIMAL | nullable |
| status | TEXT | DRAFT, IN_REVIEW, APPROVED, ACTIVE, ON_HOLD, COMPLETED, CANCELLED |
| created_by | TEXT FK -> users.id | required |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |

### 6.2 need_items
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | need item id |
| program_id | TEXT FK -> programs.id | required |
| category | TEXT | barang, dana, jasa |
| quantity | DECIMAL | required |
| unit | TEXT | pcs, kg, family, etc |
| priority | TEXT | high/medium/low |
| location_id | TEXT FK -> locations.id | required |
| source_type | TEXT | stock, purchase, donation, other |
| status | TEXT | DRAFT, ACTIVE, PARTIALLY_FULFILLED, FULFILLED, CANCELLED |
| remaining_quantity | DECIMAL | required |
| created_by | TEXT FK -> users.id | required |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |

### 6.3 proposals
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | proposal id |
| program_id | TEXT FK -> programs.id | required |
| title | TEXT | required |
| summary | TEXT | required |
| target_funding | DECIMAL | nullable |
| approved_for_publication | BOOLEAN | default false |
| status | TEXT | DRAFT, IN_REVIEW, APPROVED, REJECTED, PUBLISHED |
| created_by | TEXT FK -> users.id | required |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |

## 7. Modul 5: Logistik, Gudang, Distribusi, dan Stok

### 7.1 inventory_items
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | inventory item id |
| sku | TEXT | unique, required |
| name | TEXT | required |
| category | TEXT | category id or text |
| unit | TEXT | required |
| condition | TEXT | new, used, damaged, etc |
| lot_batch | TEXT | nullable |
| expiry_date | TIMESTAMP | nullable |
| warehouse_id | TEXT FK -> warehouses.id | required |
| rack_bin | TEXT | nullable |
| status | TEXT | active, reserved, damaged, returned, expired |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |

### 7.2 warehouses
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | warehouse id |
| name | TEXT | required |
| location_id | TEXT FK -> locations.id | required |
| capacity_note | TEXT | nullable |
| status | TEXT | active/inactive |

### 7.3 stock_movements
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | STOCK_MOVEMENT_ID |
| item_id | TEXT FK -> inventory_items.id | required |
| movement_type | TEXT | receipt, transfer, allocation, issue, return, adjustment, damage |
| quantity | DECIMAL | required |
| unit | TEXT | required |
| from_location_id | TEXT FK -> locations.id | nullable |
| to_location_id | TEXT FK -> locations.id | nullable |
| reason | TEXT | required |
| reference_doc | TEXT | dispatch note / proof ref |
| performed_by | TEXT FK -> users.id | required |
| created_at | TIMESTAMP | required |

### 7.4 dispatch_notes
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | DISPATCH_NOTE_ID |
| operation_order_id | TEXT | required |
| incident_id | TEXT FK -> incidents.id | nullable |
| program_id | TEXT FK -> programs.id | nullable |
| origin_warehouse_id | TEXT FK -> warehouses.id | required |
| destination_location_id | TEXT FK -> locations.id | required |
| dispatched_by | TEXT FK -> users.id | required |
| received_by | TEXT FK -> users.id | nullable |
| status | TEXT | DRAFT, APPROVED, PICKING, DISPATCHED, PARTIALLY_RECEIVED, RECEIVED, RECONCILIATION_PENDING, COMPLETED, CANCELLED |
| dispatch_date | TIMESTAMP | required |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |

### 7.5 distribution_items
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | distribution item id |
| distribution_id | TEXT FK -> distributions.id | required |
| item_id | TEXT FK -> inventory_items.id | required |
| quantity_sent | DECIMAL | required |
| quantity_received | DECIMAL | nullable |
| discrepancy_note | TEXT | nullable |
| created_at | TIMESTAMP | required |

### 7.5 distributions
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | DISTRIBUTION_ID |
| incident_id | TEXT FK -> incidents.id | required |
| program_id | TEXT FK -> programs.id | nullable |
| dispatch_note_id | TEXT FK -> dispatch_notes.id | nullable |
| destination_type | TEXT | institution, group, individual |
| beneficiary_org | TEXT | nullable |
| beneficiary_name | TEXT | nullable |
| status | TEXT | DRAFT, APPROVED, PICKING, DISPATCHED, PARTIALLY_RECEIVED, RECEIVED, RECONCILIATION_PENDING, COMPLETED, CANCELLED |
| created_by | TEXT FK -> users.id | required |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |

## 8. Modul 6: Keuangan

### 8.1 financial_transactions
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | TRANSACTION_ID |
| incident_id | TEXT FK -> incidents.id | nullable |
| program_id | TEXT FK -> programs.id | nullable |
| category | TEXT | budget, donation, expense, refund |
| transaction_type | TEXT | inbound, outbound, transfer |
| date | TIMESTAMP | required |
| source_of_funds | TEXT | donor, internal, etc |
| counterparty | TEXT | nullable |
| amount | DECIMAL | required |
| payment_method | TEXT | cash, transfer, bank, digital |
| reference_no | TEXT | required |
| status | TEXT | DRAFT, SUBMITTED, REVIEWED, APPROVED, PAID, REJECTED, REVERSED, RECONCILED |
| created_by | TEXT FK -> users.id | required |
| reviewed_by | TEXT FK -> users.id | nullable |
| approved_by | TEXT FK -> users.id | nullable |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |

### 8.2 transaction_attachments
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | attachment id |
| transaction_id | TEXT FK -> financial_transactions.id | required |
| file_name | TEXT | required |
| file_url | TEXT | secure storage |
| mime_type | TEXT | required |
| created_at | TIMESTAMP | required |

## 9. Modul 7: Volunteer, Absensi, dan Mobilisasi

### 9.1 volunteer_profiles
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | volunteer id |
| user_id | TEXT FK -> users.id | nullable if separate profile |
| full_name | TEXT | required |
| phone | TEXT | nullable |
| competency | TEXT | comma separated or relation table |
| availability | TEXT | full-time/part-time |
| emergency_contact | TEXT | nullable |
| status | TEXT | active/inactive/on_leave |
| data_consent | BOOLEAN | required |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |

### 9.2 attendance
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | attendance id |
| volunteer_id | TEXT FK -> volunteer_profiles.id | required |
| task_id | TEXT FK -> tasks.id | required |
| check_in_at | TIMESTAMP | nullable |
| check_out_at | TIMESTAMP | nullable |
| verification_method | TEXT | manual, qr, gps, supervisor |
| status | TEXT | PRESENT, ABSENT, LATE, SELF_REPORTED |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |

## 10. Modul 8: LPJ, Closure Checklist, dan Archive

### 10.1 lpj
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | LPJ id |
| incident_id | TEXT FK -> incidents.id | required |
| version | INTEGER | required |
| title | TEXT | required |
| status | TEXT | DRAFT, IN_REVIEW, APPROVED, FINAL, ARCHIVED |
| content_json | JSON | report snapshot or structured data |
| created_by | TEXT FK -> users.id | required |
| approved_by | TEXT FK -> users.id | nullable |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |

### 10.2 closure_checklists
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | closure checklist id |
| incident_id | TEXT FK -> incidents.id | required |
| checklist_json | JSON | structured closure checklist |
| status | TEXT | OPEN, IN_REVIEW, APPROVED, REJECTED |
| approved_by | TEXT FK -> users.id | nullable |
| created_at | TIMESTAMP | required |
| updated_at | TIMESTAMP | required |

## 11. Modul 9: Audit Log dan Traceability

### 11.1 audit_log
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | audit id |
| actor_id | TEXT FK -> users.id | required |
| entity_name | TEXT | e.g. reports, incidents, tasks |
| entity_id | TEXT | required |
| action_type | TEXT | create, update, approve, reject, delete, close |
| previous_status | TEXT | nullable |
| new_status | TEXT | nullable |
| reason | TEXT | nullable |
| approval_ref | TEXT | nullable |
| correlation_id | TEXT | nullable |
| created_at | TIMESTAMP | required |
| payload_json | JSON | optional data snapshot |

## 12. Modul 10: Attachment / Storage Metadata

### 12.1 file_objects
| Column | Type | Notes |
|---|---|---|
| id | TEXT PK | file id |
| entity_name | TEXT | e.g. reports, assessments, distributions |
| entity_id | TEXT | required |
| storage_key | TEXT | secure storage key |
| mime_type | TEXT | required |
| size_bytes | INTEGER | required |
| checksum | TEXT | nullable |
| created_at | TIMESTAMP | required |
| created_by | TEXT FK -> users.id | required |

## 13. Catatan penting untuk implementasi awal
- D1 dapat melakukan relasi sederhana dengan FK support atau menggunakan aplikasi-level constraint jika dibutuhkan.
- Untuk relasi many-to-many seperti user_roles, role_permissions, atau project_to_user, perlu tabel pivot terpisah.
- Pada tahap awal, lebih penting untuk fokus pada tabel inti dan relasi utama dibanding membuat semua lookup detail sekaligus.
- Semuanya harus mempunyai created_at dan updated_at.
- Semua perubahan katalog/master data harus memiliki riwayat atau nonaktifkan alih-alih delete langsung.

## 14. Modul inti yang paling prioritas pada fase awal
1. users, roles, permissions, user_roles
2. organizations, units, locations
3. reports, incidents, triage_cases
4. assessments, tasks, task_letters
5. inventory_items, stock_movements, dispatch_notes, distributions
6. financial_transactions
7. lpj, closure_checklists
8. audit_log

## 15. Kesimpulan
Blueprint ini adalah desain awal yang cukup matang untuk memulai implementasi backend dan database relasional. Struktur ini konsisten dengan workflow, role baseline, status lifecycle, audit trail, logistik, keuangan, dan LPJ. Blueprint ini masih bersifat draft dan akan disempurnakan seiring finalisasi auth provider, policy donor/public, dan definisi triase yang final.
