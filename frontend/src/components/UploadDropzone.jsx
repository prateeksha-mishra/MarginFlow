import { useState } from 'react'

function UploadDropzone({ isLoading, onFileSelected }) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState('')

  function selectFile(file) {
    if (!file || isLoading) return
    setSelectedFileName(file.name)
    onFileSelected(file)
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    selectFile(event.dataTransfer.files[0])
  }

  return (
    <div
      aria-busy={isLoading}
      onDragOver={(event) => {
        event.preventDefault()
        if (!isLoading) setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-lg border-2 border-dashed px-5 py-7 text-center transition-colors sm:px-8 ${
        isDragging
          ? 'border-emerald-600 bg-emerald-50'
          : 'border-slate-300 bg-white hover:border-emerald-500 hover:bg-emerald-50/40'
      } ${isLoading ? 'cursor-wait opacity-70' : 'cursor-pointer'} focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2`}
    >
      <input
        type="file"
        accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        aria-label="Choose a CSV or Excel transaction file"
        disabled={isLoading}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-wait"
        onChange={(event) => selectFile(event.currentTarget.files?.[0])}
      />
      <p className="text-sm font-semibold text-slate-900">
        {isLoading
          ? 'Analyzing transactions…'
          : isDragging
            ? 'Drop the file to analyze it'
            : 'Drop a transaction file here or choose a file'}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        CSV or Excel (.csv, .xlsx, .xls) · Maximum 10 MB
      </p>
      {isLoading ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-800"
        >
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent"
          />
          Uploading, cleaning, and scanning transactions…
        </div>
      ) : null}
      {selectedFileName ? (
        <p className="mt-3 truncate text-sm font-medium text-emerald-800">
          {selectedFileName}
        </p>
      ) : null}
    </div>
  )
}

export default UploadDropzone