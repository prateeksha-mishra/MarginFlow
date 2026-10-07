import { useEffect, useState } from 'react'
import MetricCard from './components/MetricCard.jsx'
import TransactionTable from './components/TransactionTable.jsx'

function App() {
  const [health, setHealth] = useState('checking…')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data.status ?? 'unknown'))
      .catch(() => setHealth('offline'))
  }, [])

  const apiOnline = health === 'ok'

  return (
    <div className="min-h-svh bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              MarginFlow
            </p>
            <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
          </div>
          <p
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              apiOnline
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            API {health}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section
          aria-label="Summary metrics"
          className="grid gap-4 md:grid-cols-3"
        >
          <MetricCard
            label="Total Revenue"
            value="$48,260"
            hint="Last 30 days · placeholder"
            tone="positive"
          />
          <MetricCard
            label="Anomaly Count"
            value="1"
            hint="1 flagged transfer this week"
            tone="warning"
          />
          <MetricCard
            label="Cash Flow Status"
            value="Healthy"
            hint="Inflows covering operating costs"
            tone="positive"
          />
        </section>

        <div className="mt-8">
          <TransactionTable />
        </div>
      </main>
    </div>
  )
}

export default App
