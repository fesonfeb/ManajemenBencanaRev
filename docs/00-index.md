# Entity Relationship Model
Status: Approved by Product Owner

## 1. Entity Utama
- Users
- Roles
- Permissions
- UserRoles
- Organizations
- Units
- Locations
- Incidents
- Reports
- TriageCases
- Assessments
- TaskAssignments
- TaskLetters
- Programs
- NeedItems
- InventoryItems
- StockMovements
- DispatchNotes
- Distributions
- FinancialTransactions
- VolunteerProfiles
- Attendance
- AuditLogs
- LPJ

## 2. Relasi Utama
- One Organization has many Units
- One User has many Roles
- One Role has many Permissions
- One Incident has many Reports
- One Report has many TriageCases
- One Incident has many Assessments
- One TaskAssignment belongs to one Incident and one Assignee
- One Incident has many Programs
- One Program has many NeedItems
- One Program has many FinancialTransactions
- One Incident has many Distributions
- One DispatchNote has many Distribution entries
- One InventoryItem has many StockMovements
- One User can create many AuditLogs
- One LPJ belongs to one Incident

## 3. Relationship Constraints
- Report tidak dihapus fisik; status dan arsip dipakai
- Assessment version history disimpan dan tidak di-overwrite
- Stock movement tidak boleh menimbulkan stok negatif tanpa aturan khusus
- DispatchNote wajib sebelum stock out
- Transaksi keuangan hanya bisa diubah dengan koreksi/reversal
- Task tidak boleh ditugaskan ke lebih dari satu assignee aktif tanpa kontrol
- Duplicate report harus referensi ke report utama
- Role permission harus dicek di server-side access control

## 4. Data Model Notes
SQL design harus memakai:
- PK untuk semua entity utama
- FK untuk relasi kunci
- timestamps default
- status enum atau lookup table
- constraint untuk validasi data
- audit trail table terpisah

## 5. Kesimpulan
Model ini menjadi landasan implementasi database dan API untuk seluruh modul prioritas. Relasi utama sudah memadai untuk laporan, insiden, assessment, tugas, program, stok, distribusi, keuangan, dan LPJ.
