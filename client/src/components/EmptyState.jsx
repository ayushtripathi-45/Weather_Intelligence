import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="panel p-8 text-center flex flex-col items-center gap-2">
      <Inbox size={26} className="text-mist mb-1" />
      <p className="font-medium">{title}</p>
      {message && <p className="text-sm text-mist max-w-sm">{message}</p>}
      {action}
    </div>
  )
}
