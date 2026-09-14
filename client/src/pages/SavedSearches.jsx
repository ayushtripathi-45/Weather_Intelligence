import { useEffect, useState, useCallback } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import {
  getHistory,
  updateHistoryRecord,
  deleteHistoryRecord,
  exportHistory
} from '../services/historyService.js'
import useDebounce from '../hooks/useDebounce.js'
import HistoryCard from '../components/HistoryCard.jsx'
import DeleteConfirmation from '../components/DeleteConfirmation.jsx'
import EditWeatherModal from '../components/EditWeatherModal.jsx'
import ExportMenu from '../components/ExportMenu.jsx'
import LoadingSkeleton from '../components/LoadingSkeleton.jsx'
import ErrorState from '../components/ErrorState.jsx'
import EmptyState from '../components/EmptyState.jsx'

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

export default function SavedSearches() {
  const [records, setRecords] = useState([])
  const [status, setStatus] = useState('loading') // loading | error | ready
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const debouncedQuery = useDebounce(query, 400)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)

  const fetchHistory = useCallback(() => {
    setStatus('loading')
    getHistory({ search: debouncedQuery || undefined, sort })
      .then((res) => {
        setRecords(res.data || [])
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [debouncedQuery, sort])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteHistoryRecord(deleteTarget._id)
      setRecords((prev) => prev.filter((r) => r._id !== deleteTarget._id))
    } finally {
      setDeleteTarget(null)
    }
  }

  const handleSave = async ({ id, location, startDate, endDate }) => {
    const res = await updateHistoryRecord(id, { location, startDate, endDate })
    setRecords((prev) => prev.map((r) => (r._id === id ? res.data : r)))
    setEditTarget(null)
  }

  const handleExportAll = async (format) => {
    const res = await exportHistory(format)
    downloadBlob(res, `weather-history.${format === 'json' ? 'json' : format}`)
  }

  const handleExportRecord = async (record) => {
    await handleExportAll('json')
  }

  return (
    <div className="py-10 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-semibold">Saved Searches</h1>
        <ExportMenu onExport={handleExportAll} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-mist" size={16} />
          <input
            className="input-field pl-9"
            placeholder="Search by location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="input-field sm:w-48" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {status === 'loading' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LoadingSkeleton /> <LoadingSkeleton /> <LoadingSkeleton />
        </div>
      )}

      {status === 'error' && <ErrorState message="Unable to retrieve saved weather data." onRetry={fetchHistory} />}

      {status === 'ready' && records.length === 0 && (
        <EmptyState
          title="No saved searches yet"
          message="Search for a location on the Weather page and save it to build your history."
        />
      )}

      {status === 'ready' && records.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record) => (
            <HistoryCard
              key={record._id}
              record={record}
              onView={() => setEditTarget(null)}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
              onExport={handleExportRecord}
            />
          ))}
        </div>
      )}

      <DeleteConfirmation
        open={Boolean(deleteTarget)}
        itemName={deleteTarget?.location?.name}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <EditWeatherModal
        open={Boolean(editTarget)}
        record={editTarget}
        onCancel={() => setEditTarget(null)}
        onSave={handleSave}
      />
    </div>
  )
}
