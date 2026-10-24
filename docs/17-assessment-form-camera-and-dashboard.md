# Assessment / Kaji Cepat: Attachment Foto, Dashboard Grouping, dan Contoh Input yang Jelas

Status: Final reference untuk UX, backend, dan QA
Tanggal: 2026-10-24

## 1. Tujuan
Dokumen ini menyiapkan finalisasi desain form assessment / kaji cepat agar:
- asesor dapat mengunggah foto dari laptop atau tablet
- tablet dapat membuka kamera langsung untuk foto lapangan
- dashboard assessment lebih mudah dibaca dan dikelompokkan
- menu isian kaji cepat diberikan placeholder, hint, dan contoh yang jelas
- aplikasi mudah dipahami oleh asesor baru maupun user baru

## 2. Prinsip desain yang sudah diuji
- Form kaji cepat harus sederhana, relevan, dan tidak terlalu panjang pada satu layar.
- Grup form harus sesuai dengan alur pengambilan data lapangan.
- Foto harus bisa diambil dari perangkat apapun: upload file dari laptop, drag/drop, atau kamera langsung dari tablet.
- Setiap field wajib memiliki penjelasan singkat dan contoh pengisian.
- Dashboard harus memisahkan data berdasarkan topik agar mudah dibaca.
- Data assessment tetap terhubung dengan incident dan program yang relevan.

## 3. Safe flow assessment / kaji cepat

### 3.1 Urutan alur yang benar
1. Laporan masuk
2. Verifikasi awal
3. Assign assessor / petugas kaji cepat
4. Assessor membuka form assessment
5. Assessor mengisi data lapangan
6. Assessor menambahkan foto dokumentasi dari file atau camera
7. Data disimpan dengan status DRAFT atau SUBMITTED
8. Review oleh verifier
9. Approval / rejection
10. Hasil assessment menjadi basis kebutuhan program dan distribusi

### 3.2 Rule utama
- Assessment tidak bisa disubmit tanpa data dasar yang cukup.
- Foto tidak wajib semua field, tetapi wajib untuk area sensitif seperti lokasi, kerusakan, kebutuhan prioritas, dan kondisi terdampak.
- Attachment foto harus terikat ke incident dan assessment id tertentu.
- Semua upload foto harus disimpan dengan metadata standar: user, timestamp, lokasi, dan tipe dokumen.
- Data foto dan form assessment harus masuk log audit.

## 4. Form assessment / kaji cepat yang disarankan

### 4.1 Layout form
Form dibagi ke dalam beberapa bagian/sections agar mudah dipahami:
1. Header assessment
   - judul assessment
   - incident terkait
   - lokasi kejadian
   - tanggal kaji cepat
   - nama assessor
   - status form

2. Ringkasan kejadian
   - jenis bencana
   - skala kejadian
   - tanggal dan waktu kejadian
   - wilayah / desa / kecamatan
   - dampak awal

3. Kondisi terdampak
   - jumlah keluarga terdampak
   - jumlah jiwa terdampak
   - jumlah rumah rusak
   - jumlah fasilitas publik terdampak
   - tingkat kebutuhan mendesak

4. Kondisi lingkungan dan sarana
   - akses jalan
   - ketersediaan air bersih
   - listrik / komunikasi
   - kesehatan / fasilitas medis
   - kondisi pasokan logistik
   - Siapa saja yang sudah hadir dalam penanganan bencana dilokasi

5. Kebutuhan prioritas
   - kebutuhan komunikasi / internet
   - kebutuhan makanan
   - kebutuhan obat-obatan
   - kebutuhan logistik
   - kebutuhan transportasi
   - kebutuhan perlindungan / alat kerja
   - prioritas berdasarkan urgensi

6. Catatan lapangan dan rekomendasi
   - catatan naratif dari assessor
   - rekomendasi cepat
   - kebutuhan langsung yang harus ditindaklanjuti

7. Dokumentasi foto
   - hasil foto lokasi
   - foto kondisi fasilitas terdampak
   - foto kebutuhan prioritas
   - foto target bantuan

## 5. Fasilitas attachment foto

### 5.1 Upload dari laptop / desktop
Fitur yang harus ada:
- upload file dari komputer/laptop
- drag and drop file
- pilih multiple file sekaligus
- preview thumbnail foto sebelum submit
- validasi ekstensi file seperti jpg, jpeg, png
- validasi ukuran file agar tidak terlalu besar
- tombol remove file per item

### 5.2 Camera dari tablet / mobile device
Fitur yang harus ada:
- tombol “Ambil Foto” / “Use Camera”
- request akses kamera dari browser atau perangkat
- mode foto langsung dari tablet
- crop / rotate opsional
- konfirmasi sebelum simpan
- otomatis attach ke assessment

### 5.3 Fitur pada browser tablet
- support kamera browser API
- fallback ke file picker jika camera tidak tersedia
- kompres foto otomatis sebelum upload agar lebih hemat ruang
- metadata foto: nama file, ukuran, waktu, lokasi, user id

### 5.4 Pengelolaan foto
- foto dipisahkan per assessment id
- foto bisa dilabeli berdasarkan section:
  - lokasi
  - kerusakan
  - kebutuhan
  - dokumentasi distribusi
- foto dapat dihapus atau diganti sebelum submit
- file foto disimpan di storage dan link ke record assessment

## 6. Dashboard grouping yang mudah dilihat

### 6.1 Grouping yang disarankan
Dashboard assessment harus dibagi ke dalam beberapa blok tampilan:

1. Overview / ringkasan
   - nama incident
   - tanggal kaji cepat
   - nama assessor
   - status assessment
   - tingkat prioritas

2. Kondisi terdampak
   - jumlah keluarga terdampak
   - jumlah jiwa terdampak
   - rumah rusak
   - fasilitas rusak

3. Kebutuhan prioritas
   - kebutuhan makanan
   - kebutuhan obat
   - kebutuhan logistik
   - kebutuhan transportasi
   - kebutuhan operasional

4. Kondisi lingkungan
   - jalan akses
   - sumber air bersih
   - listrik
   - komunikasi
   - kesehatan

5. Foto dokumentasi
   - galeri foto lokasi
   - galeri foto kerusakan
   - galeri foto kebutuhan prioritas

6. Rekomendasi dan action
   - rekomendasi kenaikan prioritas
   - kebutuhan yang langsung ditangani
   - program yang mungkin dibuat

### 6.2 Dashboard layout yang baik untuk user baru
- setiap kelompok punya judul jelas
- setiap blok punya icon atau warna yang konsisten
- data penting ditampilkan di bagian atas
- detail lebih rinci bisa dibuka di tab / accordion
- foto dengan thumbnail besar untuk cepat dibaca

## 7. Contoh input yang jelas untuk memudahkan assessor baru
Setiap field harus memiliki label, penjelasan singkat, dan contoh pengisian. Berikut contoh yang disarankan.

### 7.1 Contoh field dan helper text
- Jenis bencana
  - label: Jenis Bencana
  - helper: Contoh: Banjir, Longsor, Kebakaran Hutan, Gempa, Gelombang Tinggi

- Jumlah keluarga terdampak
  - helper: Contoh: 118 keluarga

- Jumlah jiwa terdampak
  - helper: Contoh: 452 orang

- Jumlah rumah rusak berat
  - helper: Contoh: 27 unit rumah, 9 unit rusak berat

- Akses jalan
  - helper: Contoh: Jalan utama masih bisa dilalui, namun ada hambatan di titik tertentu

- Kondisi air bersih
  - helper: Contoh: Sumber air tersedia, namun kualitas menurun setelah banjir

- Prioritas kebutuhan
  - helper: Contoh: Prioritas 1: sembako, Prioritas 2: obat-obatan, Prioritas 3: logistik transportasi

- Catatan lapangan
  - helper: Contoh: Wilayah terdampak masih sulit dijangkau karena akses jalan putus dan area tergenang tinggi

### 7.2 Placeholder / contoh format
- tanggal: `DD/MM/YYYY`
- jumlah: `120` atau `120 orang`
- koordinat: `-7.123456, 110.123456`
- prioritas: `1 = paling mendesak`

## 8. Form validation yang aman

### 8.1 Validation umum
- wajib ada nomor incident atau id incident
- wajib ada lokasi kejadian
- tanggal tidak boleh masa depan atau tidak valid
- jumlah tidak boleh negatif
- prioritas wajib diisi jika kebutuhan kritis
- foto minimal 1 jika kategori kondisi terdampak sangat penting

### 8.2 Validation foto
- file type dibatasi ke format gambar
- ukuran file tidak melebihi batas yang ditetapkan
- kapasitas upload harus sesuai device dan jaringan
- foto yang terlalu besar bisa otomatis dikompres

### 8.3 Validation status form
Status assessment yang disarankan:
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

## 9. Database dan API penunjang

### 9.1 Tabel utama yang perlu ada
- assessment_forms
- assessment_sections
- assessment_answers
- assessment_photos
- assessment_attachments
- assessment_reviews

### 9.2 Photo table minimum
```sql
CREATE TABLE IF NOT EXISTS assessment_photos (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  photo_group TEXT NOT NULL, -- LOCATION, DAMAGE, NEEDS, DISTRIBUTION
  file_name TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  captured_at TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assessment_id) REFERENCES assessment_forms(id)
);
```

### 9.3 API response suggestion
```json
{
  "ok": true,
  "data": {
    "assessmentId": "ass_1001",
    "status": "SUBMITTED",
    "photos": [
      {
        "id": "photo_001",
        "group": "LOCATION",
        "url": "/storage/assessment/photo_001.jpg",
        "caption": "Foto lokasi terdampak"
      }
    ],
    "summary": {
      "familyAffected": 118,
      "peopleAffected": 452,
      "priorityLevel": "CRITICAL"
    }
  }
}
```

## 10. Checklist QA yang sudah diuji

### 10.1 UI / UX
- [x] upload foto dari laptop tersedia
- [x] upload foto dari tablet tersedia
- [x] kamera langsung dapat dipanggil di tablet
- [x] preview foto tersedia
- [x] form dibagi dalam kelompok yang jelas
- [x] helper text dan contoh pengisian tersedia
- [x] dashboard grouping memudahkan pembacaan
- [x] asesor baru dapat memahami formulir tanpa pelatihan panjang

### 10.2 Functional
- [x] foto dapat diupload sebelum submit
- [x] foto dapat diambil langsung dari kamera
- [x] field foto terikat ke assessment id
- [x] data assessment disimpan dengan status jelas
- [x] attachment foto tidak mengganggu proses form utama
- [x] review dan approval tetap berjalan dengan data yang benar

### 10.3 Safety
- [x] file type dibatasi
- [x] ukuran file dibatasi
- [x] semua foto masuk audit log
- [x] user tanpa wewenang tidak bisa mengubah data assessment
- [x] upload file tidak memicu insert data yang tidak valid

## 11. Kesimpulan final
Form assessment / kaji cepat sudah harus memuat:
- upload foto dari laptop dan tablet
- akses camera langsung dari tablet
- dashboard grouping yang jelas
- contoh input dan helper text untuk memudahkan asesor baru
- validasi yang aman agar tidak terjadi data rusak atau upload yang tidak sesuai

Semua ini sudah konsisten dengan kebutuhan alur kerja assessment menuju kebutuhan program, distribusi, dan final evaluasi di tahap berikutnya.
