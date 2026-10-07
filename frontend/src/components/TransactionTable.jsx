const PLACEHOLDER_TRANSACTIONS = [
  {
    id: 'txn-1042',
    date: '2026-10-05',
    description: 'Customer invoice — North Park Cafe',
    category: 'Revenue',
    amount: 1840.0,
    status: 'cleared',
    anomaly: false,
  },
  {
    id: 'txn-1041',
    date: '2026-10-04',
    description: 'Payroll — biweekly',
    category: 'Payroll',
    amount: -3120.5,
    status: 'cleared',
    anomaly: false,
  },
  {
    id: 'txn-1040',
    date: '2026-10-03',
    description: 'Wire transfer — unknown vendor',
    category: 'Transfers',
    amount: -2450.0,
    status: 'flagged',
    anomaly: true,
  },
  {
    id: 'txn-1039',
    date: '2026-10-02',
    description: 'Inventory restock — Metro Supply',
    category: 'COGS',
    amount: -876.22,
    status: 'pending',
    anomaly: false,
  },
  {
    id: 'txn-1038',
    date: '2026-10-01',
    description: 'POS batch — weekend sales',
    category: 'Revenue',
    amount: 2695.4,
    status: 'cleared',
    anomaly: false,
  },
]

function formatAmount(amount) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(amount))

  return amount < 0 ? `−${formatted}` : formatted
}

function statusStyles(status) {
  if (status === 'flagged') return 'bg-rose-50 text-rose-700'
  if (status === 'pending') return 'bg-amber-50 text-amber-700'
  return 'bg-emerald-50 text-emerald-700'
}

function TransactionTable() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Recent transactions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Placeholder data until live feeds are connected.
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {PLACEHOLDER_TRANSACTIONS.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-5 py-3 text-slate-500">
                  {txn.date}
                </td>
                <td className="px-5 py-3 font-medium text-slate-900">
                  <span className="flex items-center gap-2">
                    {txn.description}
                    {txn.anomaly ? (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                        Anomaly
                      </span>
                    ) : null}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-600">{txn.category}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles(txn.status)}`}
                  >
                    {txn.status}
                  </span>
                </td>
                <td
                  className={`whitespace-nowrap px-5 py-3 text-right font-medium ${
                    txn.amount < 0 ? 'text-slate-700' : 'text-emerald-700'
                  }`}
                >
                  {formatAmount(txn.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default TransactionTable
