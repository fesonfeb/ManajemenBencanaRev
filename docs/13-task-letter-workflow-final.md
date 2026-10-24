# Workflow Surat Perintah / Task Letter yang Aman dan Correct

Status: Final reference untuk developer dan QA
Tanggal: 2026-10-24

## 1. Tujuan
Dokumen ini menjadi acuan kerja bagi developer untuk membangun alur surat perintah / task letter yang aman, terdokumentasi, dan sesuai dengan governance operasional.

Tujuan utama:
- memastikan surat perintah dibuat hanya setelah peran dan scope valid
- memastikan petugas asesor, koordinator, dan tim volunteer telah ditetapkan
- memastikan surat perintah memiliki lifecycle yang jelas dan terdokumentasi
- memastikan semua perubahan status masuk audit log
- memastikan database tetap efisien, aman, dan tidak berlebihan menyimpan data duplikat

## 2. Safe flow yang benar

### 2.1 Trigger utama
Surat perintah dibuat hanya setelah seluruh kondisi berikut terpenuhi:
- laporan bencana diterima dan diverifikasi
- kaji cepat lapangan telah disetujui
- incident aktif atau terverifikasi
- asesor dipilih dan ditetapkan
- koordinator ditetapkan
- tim volunteer / team dibentuk sesuai kebutuhan
- assignment aktif terbentuk untuk tugas tersebut

### 2.2 Flow urutan yang benar
1. Laporan masuk
2. Verifikasi dan triase
3. Kajian cepat lapangan
4. Approval kaji cepat
5. Incident aktif
6. Assessor dipilih
7. Koordinator dibuat / ditetapkan
8. Koordinator membentuk tim volunteer
9. Assignment dibuat
10. Draft surat perintah dibuat
11. Surat perintah diapprove
12. Surat perintah diterbitkan / issued
13. Surat perintah aktif dalam pelaksanaan tugas
14. Tugas selesai -> status completed
15. Jika dibatalkan -> revoked
16. Setelah penutupan -> archived

## 3. Aturan bisnis yang harus dijaga

### 3.1 Akses dan role
Surat perintah hanya dapat dibuat oleh role yang memiliki kewenangan seperti:
- ADMIN
- PIMPINAN
- KOORDINATOR_LAPANGAN

Approval surat hanya dapat dilakukan oleh:
- ADMIN
- PIMPINAN

Issue / penerbitan surat hanya dapat dilakukan oleh:
- ADMIN
- PIMPINAN
- KOORDINATOR_LAPANGAN
- atau issuer yang berwenang sesuai kebijakan internal

Revoke surat hanya dapat dilakukan oleh:
- ADMIN
- PIMPINAN
- issuer asli jika masih dalam masa valid dan belum final

### 3.2 Scope
Surat perintah harus sesuai dengan scope:
- incident yang sama
- task yang sama atau assignment yang valid
- team terkait
- user/volunteer yang masuk ke incident yang sama
- lokasi yang sesuai

### 3.3 Validasi status
Status surat perintah yang disarankan:
- DRAFT
- READY
- ISSUED
- ACTIVE
- COMPLETED
- REVOKED
- ARCHIVED

Valid transition:
- DRAFT -> READY
- READY -> ISSUED
- ISSUED -> ACTIVE
- ACTIVE -> COMPLETED
- READY -> REVOKED
- ISSUED -> REVOKED
- COMPLETED -> ARCHIVED
- REVOKED -> ARCHIVED

Tidak boleh ada transisi ilegal seperti:
- ACTIVE -> DRAFT
- COMPLETED -> ACTIVE
- ISSUED -> DRAFT
- REVOKED -> ISSUED

## 4. Struktur data utama

### 4.1 Assignment / penugasan
Setiap assignment harus merahasiakan hubungan antara:
- incident
- task
- team
- user / volunteer
- role / jenis tugas
- pembuat assignment
- status assignment

Field utama:
- id
- incident_id
- task_id
- team_id
- assignee_user_id
- assignee_volunteer_id
- assignee_role
- assigned_by
- assignment_type
- status
- start_at
- end_at
- reason
- created_at
- updated_at

### 4.2 Team / tim volunteer
Setiap team harus menempel pada:
- incident
- task minimal opsional
- coordinator
- status team
- objective

Field utama:
- id
- incident_id
- task_id
- name
- team_type
- coordinator_id
- status
- objective
- created_by
- created_at
- updated_at

### 4.3 Team member / anggota tim
Field utama:
- id
- team_id
- volunteer_id
- user_id
- role_in_team
- assignment_status
- joined_at
- removed_at
- created_by
- created_at
- updated_at

### 4.4 Volunteer
Field utama:
- id
- user_id
- full_name
- nik
- phone
- emergency_contact
- emergency_phone
- competency
- availability
- status
- consent_data
- created_by
- created_at
- updated_at

### 4.5 Task letter / surat perintah
Field utama:
- id
- incident_id
- task_id
- team_id
- assignment_id
- issuing_user_id
- coordinator_id
- assignee_user_id
- assignee_volunteer_id
- letter_number
- document_type
- title
- subject
- body_text
- location_text
- execution_period_start
- execution_period_end
- priority
- status
- issued_at
- revoked_at
- reason
- version
- created_by
- created_at
- updated_at

### 4.6 Approval task letter
Field utama:
- id
- task_letter_id
- approver_user_id
- decision
- note
- approved_at
- created_at

### 4.7 History audit untuk surat perintah
Field utama:
- id
- task_letter_id
- changed_by
- previous_status
- new_status
- change_reason
- changed_at
- payload_json

## 5. Mandatory validation rules

### 5.1 Saat create surat perintah
Sistem wajib memeriksa:
- incident exists
- task exists and belongs to incident
- assignment exists and is ACTIVE/ACCEPTED
- assignee valid
- coordinator valid
- role and scope valid
- no duplicate active letter for same assignment without explicit versioning policy

### 5.2 Saat approve surat
Sistem wajib memeriksa:
- surat ada
- status masih DRAFT atau READY
- actor punya role ADMIN/PIMPINAN
- alasan / note jika perlu
- entry approval dibuat
- jika approval berhasil, status menjadi READY

### 5.3 Saat issue surat
Sistem wajib memeriksa:
- status == READY
- approve final sudah ada
- assignment valid
- surat belum revoked
- issue time diisi
- status menjadi ISSUED
- record history dibuat

### 5.4 Saat revoke surat
Sistem wajib memeriksa:
- surat masih dalam state yang bisa dibatalkan
- actor berwenang
- reason wajib diisi
- status menjadi REVOKED
- assignment terkait bisa diupdate ke CANCELLED/REASSIGNED

### 5.5 Saat complete surat
Sistem wajib memeriksa:
- surat dalam status ISSUED atau ACTIVE
- actor berwenang
- status menjadi COMPLETED
- assignment di-close jika diperlukan
- audit log dipastikan ada

## 6. Audit log yang wajib dibuat
Semua action kritis harus menulis audit log:
- create task letter
- approve task letter
- reject task letter
- issue task letter
- revoke task letter
- complete task letter
- assignment update
- team member add/remove
- volunteer assignment update
- task status update

Audit log minimum harus punya:
- actor_id
- entity_name
- entity_id
- action_type
- previous_status
- new_status
- reason
- approval_ref
- correlation_id
- payload_json
- created_at

## 7. Database design best practice

### 7.1 Efisien dan hemat ruang
- jangan duplikasi data besar di banyak tabel
- simpan relasi, bukan copy status atau detail yang mudah didapatkan dari join
- gunakan indeks pada kolom query utama:
  - incident_id
  - task_id
  - team_id
  - assignment_id
  - assignee_user_id
  - assignee_volunteer_id
  - status
  - created_at
  - letter_number

### 7.2 Smart database, responsif
- query ringkasan dashboard sebaiknya menggunakan data aggregate khusus, bukan seluruh join berulang
- gunakan pagination untuk daftar surat / tugas / volunteer
- hindari JSON besar untuk field yang sering dipakai pada query
- simpan attachment file besar di object storage, bukan di table inti

### 7.3 Safety
- tidak ada delete permanen untuk surat perintah dan assignment penting
- penggunaan status repository: draft, active, archived, revoked
- semua update harus melalui service layer dan audit middleware
- semua perubahan state harus mengecek current status sebelum write

## 8. Contoh alur yang aman secara end-to-end

### Scenario: surat perintah untuk kaji cepat lapangan
1. User admin memilih asesor
2. Admin menentukan koordinator dan incident
3. Koordinator membentuk tim volunteer
4. Sistem membuat assignment dengan status ACTIVE
5. Sistem membuat task letter draft
6. Pimpinan/admin approve surat task letter
7. Sistem set status READY
8. Koordinator menerbitkan surat perintah
9. Sistem set status ISSUED
10. Surat aktif untuk pelaksanaan tugas
11. Setelah tugas selesai, task letter status berubah menjadi COMPLETED
12. Bila ada perubahan kebutuhan atau pembatalan, status REVOKED
13. Semua status dan perubahan tercatat di audit log

## 9. Kesimpulan final
Safe flow surat perintah / task letter adalah:
- validator role + scope + assignment + proper approval
- lifecycle status jelas
- audit log wajib
- update history wajib
- database tetap bersih dan efisien
- pengembangan backend harus mengikuti lifecycle di atas

Semua pathway ini sudah dipastikan cocok untuk developer sebagai acuan implementasi.
