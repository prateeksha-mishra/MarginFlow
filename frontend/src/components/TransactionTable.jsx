function formatAmount(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount)
}

function TransactionTable({ anomalies = [], filename }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Flagged transactions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {filename
              ? `${anomalies.length} anomalous ${anomalies.length === 1 ? 'transaction' : 'transactions'} in ${filename}`
              : 'Anomalies from your uploaded transaction file will appear here.'}
          </p>
        </div>
        {filename ? (
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            {anomalies.length} flagged
          </span>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {anomalies.length ? anomalies.map((transaction, index) => (
              <tr
                key={`${transaction.date}-${transaction.description}-${index}`}
                className="hover:bg-rose-50/40"
              >
                <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                  {transaction.date}
                </td>
                <td className="min-w-56 px-5 py-3 font-medium text-slate-900">
                  <span className="mr-2 inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                    Anomaly
                  </span>
                  {transaction.description || 'Unlabeled transaction'}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-slate-600">
                  {transaction.category || '—'}
                </td>
                <td className="whitespace-nowrap px-5 py-3 text-right font-semibold text-rose-700">
                  {formatAmount(transaction.amount)}
                </td>
              </tr>
            )) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-5 py-10 text-center text-sm text-slate-500"
                >
                  {filename
                    ? 'No anomalous transactions were found in this file.'
                    : 'Upload a file to review transactions flagged by the model.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default TransactionTable
