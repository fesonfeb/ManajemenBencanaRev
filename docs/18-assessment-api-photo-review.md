# API Assessment / Kaji Cepat + Upload Foto + Review

Status: Final reference untuk backend dan frontend
Tanggal: 2026-10-24

## 1. Tujuan
Dokumen ini menyiapkan endpoint final untuk modul assessment / kaji cepat dengan fitur:
- form assessment
- upload foto dari laptop atau tablet
- akses kamera langsung dari tablet
- review dan approval assessment
- ringkasan dashboard hasil kaji cepat

Tujuan utamanya agar:
- backend dapat menerima form dan foto dengan aman
- review assessment tetap auditable
- hasil assessment bisa dipakai untuk kebutuhan program dan distribusi
- frontend dapat menampilkan data secara rapi dan terstruktur

## 2. Prinsip logika yang sudah diuji
- Assessment harus selalu terikat ke incident yang valid.
- Photo attachment harus terikat ke assessment id dan tipe kelompok foto.
- Review/approval harus berupa state transition yang jelas.
- Foto dan form assessment harus masuk audit log.
- Penggunaan kamera di tablet harus fallback ke upload file bila browser/device tidak support.
- Dashboard assessment dibuat dari data aggregate backend, bukan hasil parsing frontend yang tidak aman.

## 3. Status assessment yang disarankan
- DRAFT
- SUBMITTED
- REVIEWED
- APPROVED
- REJECTED
- ARCHIVED

Transition valid:
- DRAFT -> SUBMITTED
- SUBMITTED -> REVIEWED
- REVIEWED -> APPROVED
- REVIEWED -> REJECTED
- APPROVED -> ARCHIVED

Transition invalid:
- APPROVED -> DRAFT
- REJECTED -> SUBMITTED
- ARCHIVED -> REVIEWED

## 4. Endpoint utama assessment

### 4.1 Create assessment draft
POST /api/assessments

Role:
- ADMIN
- ASESOR
- KOORDINATOR_LAPANGAN

Permission:
- assessments:create

Request body contoh:
```json
{
  "incidentId": "inc_123",
  "locationId": "loc_01",
  "assessmentDate": "2026-10-24T08:00:00Z",
  "assessorId": "user_asesor_001",
  "priorityLevel": "CRITICAL",
  "title": "Kaji Cepat Lokasi Banjir Desa X",
  "summary": "Kondisi terdampak masih tinggi. Akses jalan terputus sebagian.",
  "answers": {
    "disasterType": "BANJIR",
    "familyAffected": 118,
    "peopleAffected": 452,
    "housesDamaged": 27,
    "publicFacilitiesDamaged": 6,
    "roadAccess": "Masih bisa dilalui dengan kendaraan ringan, namun ada penyempitan di dua titik.",
    "waterCondition": "Air bersih masih tersedia namun kualitas menurun.",
    "medicalCondition": "Posko kesehatan dibuka di lokasi terdampak.",
    "priorityNeeds": ["SEMBOKO", "OBAT", "LOGISTIK"],
    "notes": "Wilayah terdampak utamanya berada di RT 02 dan RT 07."
  }
}
```

Response contoh:
```json
{
  "ok": true,
  "data": {
    "id": "ass_1001",
    "status": "DRAFT",
    "incidentId": "inc_123",
    "assessmentDate": "2026-10-24T08:00:00Z"
  }
}
```

### 4.2 Get assessment by id
GET /api/assessments/:id

Role:
- ADMIN
- ASESOR
- KOORDINATOR_LAPANGAN
- VERIFIKATOR
- PIMPINAN
- AUDITOR sesuai scope

### 4.3 List assessments by incident
GET /api/incidents/:incidentId/assessments

Role:
- ADMIN
- ASESOR
- VERIFIKATOR
- KOORDINATOR_LAPANGAN
- PIMPINAN
- AUDITOR

Query parameters:
- status
- page
- limit
- search

### 4.4 Submit assessment
PATCH /api/assessments/:id/submit

Role:
- ASESOR
- ADMIN

Rules:
- only DRAFT status allowed
- required field validation before submit
- if there are critical required fields missing, return 422

Payload contoh:
```json
{
  "notes": "Assessment sudah diisi dan siap untuk review.",
  "submitterNote": "Semua field utama sudah diisi."
}
```

### 4.5 Review assessment
PATCH /api/assessments/:id/review

Role:
- VERIFIKATOR
- ADMIN
- PIMPINAN

Payload contoh:
```json
{
  "decision": "APPROVED",
  "note": "Data cukup dan sesuai kondisi lapangan."
}
```

Valid decisions:
- APPROVED
- REJECTED
- REQUEST_CHANGES

### 4.6 Approve assessment
PATCH /api/assessments/:id/approve

Role:
- ADMIN
- PIMPINAN
- VERIFIKATOR

Rules:
- status must be REVIEWED or SUBMITTED
- note wajib jika reject atau request changes
- set status APPROVED

### 4.7 Reject assessment
PATCH /api/assessments/:id/reject

Role:
- ADMIN
- PIMPINAN
- VERIFIKATOR

Payload:
```json
{
  "reason": "Data lokasi tidak lengkap dan foto dokumen belum cukup."
}
```

### 4.8 Archive assessment
PATCH /api/assessments/:id/archive

Role:
- ADMIN
- PIMPINAN

## 5. Endpoint foto assessment

### 5.1 Upload image from file or camera
POST /api/assessments/:id/photos

Role:
- ASESOR
- ADMIN
- KOORDINATOR_LAPANGAN

Upload method:
- multipart/form-data

Fields:
- file: image file
- photoGroup: LOCATION | DAMAGE | NEEDS | DISTRIBUTION | DOCUMENTATION
- caption: optional text
- takenAt: optional ISO timestamp

Example request:
```http
POST /api/assessments/ass_1001/photos
Content-Type: multipart/form-data

file=@photo-lokasi.jpg
photoGroup=LOCATION
caption=Foto lokasi terdampak
```

Rules:
- file type allowed: jpg, jpeg, png
- max file size rule: example 10MB
- if browser supports camera, frontend can directly use camera and send as file
- if unsupported, fallback to file picker

Response:
```json
{
  "ok": true,
  "data": {
    "id": "photo_001",
    "assessmentId": "ass_1001",
    "photoGroup": "LOCATION",
    "fileName": "photo-lokasi.jpg",
    "url": "/storage/assessments/ass_1001/photo_001.jpg",
    "caption": "Foto lokasi terdampak",
    "createdAt": "2026-10-24T09:10:00Z"
  }
}
```

### 5.2 List assessment photos
GET /api/assessments/:id/photos

Role:
- sesuai scope assessment

### 5.3 Delete photo
DELETE /api/assessments/:id/photos/:photoId

Role:
- ASESOR
- ADMIN
- KOORDINATOR_LAPANGAN

## 6. Data model yang disarankan

### 6.1 assessment_forms
```sql
CREATE TABLE IF NOT EXISTS assessment_forms (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  location_id TEXT,
  assessor_id TEXT NOT NULL,
  title TEXT NOT NULL,
  assessment_date TEXT NOT NULL,
  priority_level TEXT DEFAULT 'NORMAL',
  status TEXT NOT NULL DEFAULT 'DRAFT',
  summary TEXT,
  notes TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 6.2 assessment_answers
```sql
CREATE TABLE IF NOT EXISTS assessment_answers (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL,
  key_name TEXT NOT NULL,
  value_text TEXT,
  value_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assessment_id) REFERENCES assessment_forms(id)
);
```

### 6.3 assessment_photos
```sql
CREATE TABLE IF NOT EXISTS assessment_photos (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  upload_by TEXT NOT NULL,
  photo_group TEXT NOT NULL, -- LOCATION, DAMAGE, NEEDS, DISTRIBUTION, DOCUMENTATION
  file_name TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  caption TEXT,
  taken_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assessment_id) REFERENCES assessment_forms(id)
);
```

### 6.4 assessment_reviews
```sql
CREATE TABLE IF NOT EXISTS assessment_reviews (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL,
  reviewer_id TEXT NOT NULL,
  decision TEXT NOT NULL, -- APPROVED, REJECTED, REQUEST_CHANGES
  note TEXT,
  reviewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assessment_id) REFERENCES assessment_forms(id)
);
```

## 7. Dashboard data payload yang siap dikirim kepada frontend

### 7.1 GET /api/incidents/:incidentId/assessments/summary
Response:
```json
{
  "ok": true,
  "data": {
    "incidentId": "inc_123",
    "assessmentCount": 4,
    "approvedCount": 2,
    "pendingReviewCount": 1,
    "latestAssessment": {
      "id": "ass_1001",
      "status": "APPROVED",
      "assessmentDate": "2026-10-24T08:00:00Z",
      "assessorName": "Andi",
      "priorityLevel": "CRITICAL"
    },
    "groups": [
      {
        "groupName": "LOCATION",
        "photoCount": 6
      },
      {
        "groupName": "DAMAGE",
        "photoCount": 5
      },
      {
        "groupName": "NEEDS",
        "photoCount": 4
      }
    ]
  }
}
```

### 7.2 GET /api/assessments/:id/dashboard
Response:
```json
{
  "ok": true,
  "data": {
    "assessmentId": "ass_1001",
    "title": "Kaji Cepat Lokasi Banjir Desa X",
    "status": "APPROVED",
    "assessor": {
      "id": "user_asesor_001",
      "name": "Andi"
    },
    "summary": {
      "disasterType": "BANJIR",
      "familyAffected": 118,
      "peopleAffected": 452,
      "priorityLevel": "CRITICAL"
    },
    "answers": {
      "roadAccess": "Masih bisa dilalui dengan kendaraan ringan, namun ada penyempitan di dua titik.",
      "waterCondition": "Air bersih masih tersedia namun kualitas menurun.",
      "priorityNeeds": ["SEMBOKO", "OBAT", "LOGISTIK"]
    },
    "photos": {
      "LOCATION": [
        {
          "id": "photo_001",
          "url": "/storage/assessments/ass_1001/photo_001.jpg",
          "caption": "Foto lokasi terdampak"
        }
      ],
      "DAMAGE": [
        {
          "id": "photo_002",
          "url": "/storage/assessments/ass_1001/photo_002.jpg",
          "caption": "Foto kerusakan jalan"
        }
      ],
      "NEEDS": [
        {
          "id": "photo_003",
          "url": "/storage/assessments/ass_1001/photo_003.jpg",
          "caption": "Foto kebutuhan prioritas"
        }
      ]
    }
  }
}
```

## 8. Validation untuk upload foto

### 8.1 Browser requirement
- camera access via `getUserMedia` when available
- fallback to file input if not supported
- permission request must be explicit and clear

### 8.2 Storage and security
- file must be saved in object storage or secure local storage
- file name should not be user-controlled
- generate unique storage key
- store metadata separately from binary file

### 8.3 File validation
- allowed mimetypes: image/jpeg, image/png
- max filesize example: 10MB
- reject corrupted image files
- reject duplicate file names only if required by business rule

## 9. Checklist QA untuk assessment + photo + review
- [x] form assessment bisa dibuat
- [x] assessor bisa mengisi field dengan helper text dan contoh
- [x] upload foto dari laptop tersedia
- [x] ambil foto langsung dari tablet tersedia
- [x] foto dapat dikelompokkan sesuai kategori
- [x] dashboard menampilkan ringkasan dan foto per grup
- [x] review flow valid
- [x] approval/reject bisa dilakukan sesuai role
- [x] foto dan data assessment tersimpan dengan relation yang benar
- [x] audit log dibuat untuk aktivitas upload dan review

## 10. Kesimpulan final
API assessment + foto + review yang aman harus memiliki:
- form assessment dengan helper text dan contoh jelas
- upload foto dari browser dan camera tablet
- grouping photo pada dashboard
- review/approval state machine yang jelas
- attachment foto terikat ke assessment id yang valid
- response backend yang siap dikirim ke frontend untuk dashboard ringkas

Dengan struktur ini, aplikasi siap dipakai oleh asesor baru sekaligus menjaga standar keamanan, validasi, dan ketertelusuran data.
