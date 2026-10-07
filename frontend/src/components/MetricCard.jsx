function MetricCard({ label, value, hint, tone = 'neutral' }) {
  const tones = {
    positive: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    warning: 'text-amber-700 bg-amber-50 border-amber-100',
    negative: 'text-rose-700 bg-rose-50 border-rose-100',
    neutral: 'text-slate-700 bg-white border-slate-200',
  }

  return (
    <article
      className={`rounded-xl border p-5 shadow-sm ${tones[tone] ?? tones.neutral}`}
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
    </article>
  )
}

export default MetricCard
