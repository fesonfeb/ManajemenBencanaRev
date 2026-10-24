# Dashboard Keuangan Incident + Program: Endpoint API dan Payload Frontend

Status: Final reference untuk developer dan frontend
Tanggal: 2026-10-24

## 1. Tujuan
Dokumen ini berisi endpoint final dan payload contoh yang siap dikirim ke frontend untuk dashboard keuangan yang menampilkan:
- ringkasan incident
- ringkasan program di dalam incident
- total kebutuhan dan realisasi
- saldo total incident/program
- transaksi terbaru
- status closure dan validasi final

Tujuan desain ini agar frontend bisa menampilkan dashboard tanpa perlu mengolah data rumit di sisi client.

## 2. Endpoint utama

### 2.1 Dashboard keuangan untuk satu incident
GET /api/incidents/:incidentId/finance-dashboard

Role yang diizinkan:
- ADMIN
- KEUANGAN
- PIMPINAN
- AUDITOR

Contoh URL:
```text
GET /api/incidents/inc_123/finance-dashboard
```

Response status:
- 200 OK
- 403 Forbidden jika role tidak valid
- 404 Not Found jika incident tidak ditemukan

### 2.2 Dashboard keuangan untuk satu program
GET /api/programs/:programId/finance-dashboard

Role yang diizinkan:
- ADMIN
- KEUANGAN
- PIMPINAN
- AUDITOR
- KOORDINATOR_LAPANGAN bila scope relevant

Response status:
- 200 OK
- 403 Forbidden jika scope/role tidak valid
- 404 Not Found jika program tidak ditemukan

## 3. Payload response final untuk frontend

### 3.1 Response untuk incident dashboard
```json
{
  "ok": true,
  "data": {
    "incident": {
      "id": "inc_123",
      "title": "Banjir Bandang Desa X",
      "status": "RESPONSE_ONGOING",
      "region": "Kabupaten Y",
      "startDate": "2026-10-10T08:00:00Z",
      "endDate": null
    },
    "summary": {
      "incidentIncome": 125000000,
      "incidentExpense": 97000000,
      "incidentNetBalance": 28000000,
      "needTotalEstimate": 210000000,
      "needDoneEstimate": 150000000,
      "activeNeedCount": 4,
      "needCount": 12,
      "programCount": 3
    },
    "programs": [
      {
        "programId": "prog_001",
        "programName": "Program Bantuan Kebutuhan Dasar",
        "programStatus": "ACTIVE",
        "programIncome": 65000000,
        "programExpense": 44000000,
        "programNetBalance": 21000000,
        "programNeedEstimate": 95000000,
        "programNeedCount": 5,
        "programNeeds": [
          {
            "needId": "need_001",
            "needName": "Sembako keluarga terdampak",
            "estimatedAmount": 40000000,
            "realizedAmount": 32000000,
            "remainingAmount": 8000000,
            "status": "IN_PROGRESS"
          },
          {
            "needId": "need_002",
            "needName": "Perlengkapan darurat",
            "estimatedAmount": 25000000,
            "realizedAmount": 12000000,
            "remainingAmount": 13000000,
            "status": "OPEN"
          }
        ]
      },
      {
        "programId": "prog_002",
        "programName": "Program Distribusi Logistik",
        "programStatus": "ACTIVE",
        "programIncome": 40000000,
        "programExpense": 31000000,
        "programNetBalance": 9000000,
        "programNeedEstimate": 70000000,
        "programNeedCount": 3,
        "programNeeds": []
      },
      {
        "programId": "prog_003",
        "programName": "Program Operasional Lapangan",
        "programStatus": "ACTIVE",
        "programIncome": 20000000,
        "programExpense": 22000000,
        "programNetBalance": -2000000,
        "programNeedEstimate": 45000000,
        "programNeedCount": 4,
        "programNeeds": []
      }
    ],
    "recentTransactions": [
      {
        "id": "tx_101",
        "transactionNo": "TX-INC-20261024-001",
        "programId": "prog_001",
        "programName": "Program Bantuan Kebutuhan Dasar",
        "needItemId": "need_001",
        "needItemName": "Sembako keluarga terdampak",
        "entryType": "EXPENSE",
        "category": "PURCHASE",
        "amount": 15000000,
        "currency": "IDR",
        "transactionDate": "2026-10-24T10:15:00Z",
        "description": "Pembelian sembako untuk keluarga terdampak",
        "status": "PAID",
        "documentRef": "nota-001.pdf"
      },
      {
        "id": "tx_102",
        "transactionNo": "TX-INC-20261024-002",
        "programId": "prog_002",
        "programName": "Program Distribusi Logistik",
        "needItemId": null,
        "needItemName": null,
        "entryType": "INCOME",
        "category": "DONATION",
        "amount": 40000000,
        "currency": "IDR",
        "transactionDate": "2026-10-22T09:00:00Z",
        "description": "Pemasukan donor untuk distribusi logistik",
        "status": "RECONCILED",
        "documentRef": "donasi-20261022.pdf"
      }
    ],
    "closureStatus": {
      "canClose": false,
      "pendingTransactions": 2,
      "activeNeeds": 4,
      "activeTasks": 3,
      "missingDocuments": 1,
      "lastCheckedAt": "2026-10-24T12:00:00Z",
      "reasons": [
        "Masih ada transaksi yang belum final",
        "Masih ada kebutuhan aktif",
        "Dokumen pendukung belum lengkap"
      ]
    }
  }
}
```

### 3.2 Response untuk program dashboard
```json
{
  "ok": true,
  "data": {
    "program": {
      "id": "prog_001",
      "name": "Program Bantuan Kebutuhan Dasar",
      "status": "ACTIVE",
      "incidentId": "inc_123",
      "incidentTitle": "Banjir Bandang Desa X",
      "coordinatorId": "user_koor_001"
    },
    "summary": {
      "programIncome": 65000000,
      "programExpense": 44000000,
      "programNetBalance": 21000000,
      "totalNeedEstimate": 95000000,
      "realizedNeedAmount": 52000000,
      "remainingNeedAmount": 43000000,
      "needCount": 5,
      "activeNeedCount": 2,
      "recentTransactionCount": 8
    },
    "needs": [
      {
        "id": "need_001",
        "name": "Sembako keluarga terdampak",
        "category": "FOOD",
        "quantity": 120,
        "unit": "paket",
        "estimatedAmount": 40000000,
        "realizedAmount": 32000000,
        "remainingAmount": 8000000,
        "priority": "CRITICAL",
        "status": "IN_PROGRESS",
        "procurementStatus": "RECEIVED"
      },
      {
        "id": "need_002",
        "name": "Perlengkapan darurat",
        "category": "LOGISTICS",
        "quantity": 30,
        "unit": "set",
        "estimatedAmount": 25000000,
        "realizedAmount": 12000000,
        "remainingAmount": 13000000,
        "priority": "HIGH",
        "status": "OPEN",
        "procurementStatus": "PENDING"
      }
    ],
    "transactions": [
      {
        "id": "tx_101",
        "transactionNo": "TX-PRG-20261024-001",
        "entryType": "EXPENSE",
        "category": "PURCHASE",
        "amount": 15000000,
        "currency": "IDR",
        "transactionDate": "2026-10-24T10:15:00Z",
        "description": "Pembelian sembako untuk kebutuhan dasar",
        "status": "PAID",
        "needItemId": "need_001",
        "needItemName": "Sembako keluarga terdampak",
        "documentRef": "nota-001.pdf"
      },
      {
        "id": "tx_104",
        "transactionNo": "TX-PRG-20261024-004",
        "entryType": "INCOME",
        "category": "DONATION",
        "amount": 25000000,
        "currency": "IDR",
        "transactionDate": "2026-10-23T11:00:00Z",
        "description": "Donasi program bantuan kebutuhan dasar",
        "status": "RECONCILED",
        "needItemId": null,
        "needItemName": null,
        "documentRef": "donasi-prog-001.pdf"
      }
    ],
    "closureStatus": {
      "canClose": false,
      "pendingTransactions": 1,
      "activeNeeds": 2,
      "missingDocuments": 0,
      "lastCheckedAt": "2026-10-24T12:00:00Z",
      "reasons": [
        "Masih ada kebutuhan aktif",
        "Masih ada transaksi yang belum final"
      ]
    }
  }
}
```

## 4. Detail field yang harus disediakan frontend

### 4.1 summary
- incidentIncome
- incidentExpense
- incidentNetBalance
- needTotalEstimate
- needDoneEstimate
- activeNeedCount
- needCount
- programCount

### 4.2 programs[]
- programId
- programName
- programStatus
- programIncome
- programExpense
- programNetBalance
- programNeedEstimate
- programNeedCount
- programNeeds[]

### 4.3 needItems[]
- needId
- needName
- estimatedAmount
- realizedAmount
- remainingAmount
- status
- procurementStatus
- priority

### 4.4 recentTransactions[]
- id
- transactionNo
- programId
- programName
- needItemId
- needItemName
- entryType
- category
- amount
- currency
- transactionDate
- description
- status
- documentRef

### 4.5 closureStatus
- canClose
- pendingTransactions
- activeNeeds
- activeTasks
- missingDocuments
- lastCheckedAt
- reasons[]

## 5. Aturan response yang harus dijaga
- Semua angka disediakan dalam bentuk integer / decimal tanpa format string, agar frontend bisa format sendiri.
- Currency selalu dikirim dalam satu satuan yang konsisten untuk dashboard: IDR default.
- Tanggal selalu dalam ISO 8601 UTC.
- Status yang ditampilkan harus mengacu pada status bisnis yang valid.
- Jika data tidak ada, gunakan null atau array kosong, jangan string kosong.

## 6. Error response contoh
```json
{
  "ok": false,
  "error": {
    "code": 403,
    "message": "Anda tidak memiliki akses ke dashboard keuangan incident ini"
  }
}
```

```json
{
  "ok": false,
  "error": {
    "code": 404,
    "message": "Incident tidak ditemukan"
  }
}
```

## 7. Kesimpulan
Payload ini sudah siap dikirim ke frontend untuk:
- dashboard incident keuangan
- dashboard program keuangan
- card summary
- tabel kebutuhan barang
- tabel transaksi terbaru
- status closure

Format payload sudah dibuat agar frontend tidak perlu melakukan transform yang terlalu rumit. Semua data sudah di-aggregate di backend sesuai kebutuhan dashboard. 
