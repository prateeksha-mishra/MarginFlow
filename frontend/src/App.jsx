import { useEffect, useState } from 'react'
import AuthScreen from './components/AuthScreen.jsx'
import MetricCard from './components/MetricCard.jsx'
import UploadDropzone from './components/UploadDropzone.jsx'
import TransactionTable from './components/TransactionTable.jsx'

function formatCurrency(value) {
  if (value == null) return '—'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [health, setHealth] = useState('checking…')
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error('Health check failed')
        return res.json()
      })
      .then((data) => setHealth(data.status ?? 'unknown'))
      .catch(() => setHealth('offline'))
  }, [])

  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  const apiOnline = health === 'ok'

  async function analyzeFile(file) {
    setUploadError('')
    const extension = file.name.includes('.')
      ? file.name.split('.').pop().toLowerCase()
      : ''
    if (!['csv', 'xlsx', 'xls'].includes(extension)) {
      setUploadError('Choose a CSV or Excel file (.csv, .xlsx, or .xls).')
      return
    }
    if (file.size === 0) {
      setUploadError('The selected file is empty.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('The file is larger than 10 MB. Choose a smaller file.')
      return
    }

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })
      let result
      try {
        result = await response.json()
      } catch {
        throw new Error(
          `The analysis service returned an unreadable response (${response.status}).`,
        )
      }
      if (!response.ok) {
        throw new Error(
          typeof result.detail === 'string'
            ? result.detail
            : 'The file could not be analyzed.',
        )
      }

      setAnalysis(result)
    } catch (error) {
      setUploadError(
        error instanceof TypeError
          ? 'Could not connect to the analysis service. Check that the backend is running.'
          : error instanceof Error
            ? error.message
            : 'The file could not be analyzed. Please try again.',
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  const summary = analysis?.summary
  const transactionHint = isAnalyzing
    ? 'Processing upload…'
    : summary
    ? `${summary.row_count} cleaned transactions${summary.date_start ? ` · ${summary.date_start} to ${summary.date_end}` : ''}`
    : 'Upload a statement to calculate totals'

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
        <section aria-label="Analyze transactions" className="mb-8">
          <UploadDropzone
            isLoading={isAnalyzing}
            onFileSelected={analyzeFile}
          />
          {uploadError ? (
            <p
              role="alert"
              className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
            >
              {uploadError}
            </p>
          ) : null}
        </section>

        <section
          aria-label="Summary metrics"
          aria-busy={isAnalyzing}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <MetricCard
            label="Total Revenue"
            value={formatCurrency(summary?.total_revenue)}
            hint={transactionHint}
            tone="positive"
          />
          <MetricCard
            label="Total Expenses"
            value={formatCurrency(summary?.total_expenses)}
            hint={transactionHint}
            tone="negative"
          />
          <MetricCard
            label="Net Cash Flow"
            value={formatCurrency(summary?.net_cash_flow)}
            hint={transactionHint}
            tone={summary?.net_cash_flow >= 0 ? 'positive' : 'negative'}
          />
          <MetricCard
            label="Anomalies"
            value={analysis ? String(analysis.anomaly_count) : '—'}
            hint={analysis ? 'Flagged by Isolation Forest' : 'Awaiting analysis'}
            tone={analysis?.anomaly_count ? 'warning' : 'neutral'}
          />
        </section>

        <div className="mt-8">
          <TransactionTable
            anomalies={analysis?.anomalies ?? []}
            filename={analysis?.filename}
          />
        </div>
      </main>
    </div>
  )
}

export default App
