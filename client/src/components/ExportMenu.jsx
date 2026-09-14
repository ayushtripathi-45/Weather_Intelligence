import { useState } from 'react'
import { Download, ChevronDown } from 'lucide-react'

export default function ExportMenu({ onExport }) {
  const [open, setOpen] = useState(false)

  const formats = [
    { key: 'json', label: 'JSON' },
    { key: 'csv', label: 'CSV' },
    { key: 'pdf', label: 'PDF' }
  ]

  return (
    <div className="relative">
      <button type="button" className="btn-secondary" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        <Download size={16} /> Export <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 panel bg-paper dark:bg-dusk z-10 w-36" role="menu">
          {formats.map((f) => (
            <button
              key={f.key}
              role="menuitem"
              type="button"
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-white/5"
              onClick={() => {
                onExport(f.key)
                setOpen(false)
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
