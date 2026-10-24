import React from 'react';

export function FinanceDashboard({ userRole, data }: { userRole: string; data: any }) {
  const isFinance = userRole === 'KEUANGAN';
  const isPimpinan = userRole === 'PIMPINAN';
  const isAdmin = userRole === 'ADMIN';
  const isAuditor = userRole === 'AUDITOR';

  return (
    <div className="space-y-6 p-4">
      <header className="flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-xl font-bold">Dashboard Keuangan</h1>
          <p className="text-sm text-gray-500">Periode data: {data.period || 'terakhir 30 hari'}</p>
        </div>
        <div className="text-sm text-gray-600">
          Terakhir diperbarui: {data.updatedAt || 'belum ada'}
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Anggaran" value={data.budget || '0'} />
        <StatCard title="Penerimaan" value={data.income || '0'} />
        <StatCard title="Pengeluaran" value={data.expense || '0'} />
        <StatCard title="Saldo" value={data.balance || '0'} />
        <StatCard title="Menunggu Approval" value={data.pendingApproval || '0'} />
      </section>

      {(isFinance || isPimpinan || isAdmin || isAuditor) && (
        <section className="grid gap-4 lg:grid-cols-2">
          <Panel title="Transaksi menunggu approval">
            {data.pendingTransactions?.length ? (
              <ul>
                {data.pendingTransactions.map((tx: any) => (
                  <li key={tx.id} className="flex justify-between border-b py-2">
                    <span>{tx.referenceNo}</span>
                    <span>{tx.amount}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState text="Tidak ada transaksi menunggu approval" />
            )}
          </Panel>

          <Panel title="Rekonsiliasi">
            {data.reconciliation ? (
              <div>
                <p>Saldo ledger: {data.reconciliation.ledgerBalance}</p>
                <p>Saldo kas: {data.reconciliation.cashBalance}</p>
                <p>Status: {data.reconciliation.status}</p>
              </div>
            ) : (
              <EmptyState text="Belum ada rekonsiliasi" />
            )}
          </Panel>
        </section>
      )}

      {isFinance && (
        <section className="grid gap-4 lg:grid-cols-2">
          <Panel title="Bukti belum lengkap">
            {data.incompleteProofs?.length ? (
              <ul>
                {data.incompleteProofs.map((item: any) => (
                  <li key={item.id} className="border-b py-2">{item.referenceNo}</li>
                ))}
              </ul>
            ) : (
              <EmptyState text="Semua bukti lengkap" />
            )}
          </Panel>

          <Panel title="Realisasi anggaran">
            <p>Anggaran: {data.budget || 0}</p>
            <p>Realisasi: {data.realized || 0}</p>
            <p>Persentase: {data.realizationPercent || 0}%</p>
          </Panel>
        </section>
      )}

      {isPimpinan && (
        <section>
          <Panel title="Ringkasan keputusan keuangan">
            <p>Transaksi aktif: {data.activeTransactions || 0}</p>
            <p>Transaksi menunggu approval: {data.pendingApproval || 0}</p>
            <p>Risiko: {data.financialRisk || 'Tidak ada'}</p>
          </Panel>
        </section>
      )}

      {isAuditor && (
        <section>
          <Panel title="Riwayat audit keuangan">
            {data.auditTrail?.length ? (
              <ul>
                {data.auditTrail.map((row: any) => (
                  <li key={row.id} className="border-b py-2">
                    {row.actionType} - {row.createdAt}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState text="Tidak ada riwayat audit" />
            )}
          </Panel>
        </section>
      )}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-3 font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="text-sm text-gray-500">{text}</div>;
}
