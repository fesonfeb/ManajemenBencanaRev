# Manajemen Operasi Kebencanaan Rev.1

Repository ini merupakan baseline dokumentasi dan desain awal untuk sistem manajemen operasi kebencanaan yayasan, dibuat terpisah dari repository sebelumnya.

Tujuan repositori ini:
- Menyimpan dokumentasi proyek yang terstruktur.
- Menjaga catatan keputusan bisnis dan operasional.
- Menjadi referensi untuk desain aplikasi, alur proses, peran, pengujian, dan LPJ.
- Menyediakan ruang untuk evolusi sistem tanpa mengubah repo lama.

Status
- Repo lama: tidak disentuh.
- Repo ini: baseline dokumentasi rev.1.
- Status implementasi: belum dimulai; fokus saat ini pada projekti dan keputusan.

Prinsip kerja
- Tidak membuat rewrite aplikasi sebelum keputusan final dibuat.
- Tidak mengklaim fitur sudah berjalan jika belum benar-benar diimplementasikan.
- Domain dan SOP didasarkan pada keputusan yang sudah disepakati dan dokumen audit yang tersedia.
- Item yang masih membutuhkan keputusan Product Owner ditandai sebagai TBD.

Struktur repositori
- docs/project-charter.md
- docs/flowcharts/operational-flowchart.md
- docs/workflows/transition-matrix.md
- docs/roles/permission-matrix.md
- docs/screens/dashboard-specification.md
- docs/reports/lpj-specification.md
- docs/testing/acceptance-tests.md
- docs/decisions/ADR-001-operational-governance.md
- docs/roadmap.md

Catatan
- Semua dokumen ini bersifat baseline dan dapat diperbaiki setelah review Product Owner, admin operasional, dan tim pengembang.
- Repo ini bukan hasil rewrite dari repo lama, dan tidak berisi data produksi atau konfigurasi sensitif.
