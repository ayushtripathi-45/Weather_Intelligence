import { Eye, Pencil, Trash2, Download } from 'lucide-react'
import { formatDate, formatTemp, capitalize } from '../utils/formatters.js'

export default function HistoryCard({ record, onView, onEdit, onDelete, onExport }) {
  return (
    <div className="panel p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">
            {record.location?.name}
            {record.location?.country ? `, ${record.location.country}` : ''}
          </p>
          <p className="text-xs text-mist">
            {formatDate(record.requestedDateRange?.startDate)} – {formatDate(record.requestedDateRange?.endDate)}
          </p>
        </div>
        <p className="font-mono tabular text-sm">{formatTemp(record.weather?.temperature)}</p>
      </div>

      <p className="text-sm text-mist">{capitalize(record.weather?.condition || '')}</p>

      <div className="divider" />

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-secondary text-xs px-3 py-1.5" onClick={() => onView(record)}>
          <Eye size={14} /> View
        </button>
        <button type="button" className="btn-secondary text-xs px-3 py-1.5" onClick={() => onEdit(record)}>
          <Pencil size={14} /> Edit
        </button>
        <button
          type="button"
          className="btn-secondary text-xs px-3 py-1.5 text-red-600 dark:text-red-400"
          onClick={() => onDelete(record)}
        >
          <Trash2 size={14} /> Delete
        </button>
        <button type="button" className="btn-secondary text-xs px-3 py-1.5" onClick={() => onExport(record)}>
          <Download size={14} /> Export
        </button>
      </div>
    </div>
  )
}
