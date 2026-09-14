export default function DeleteConfirmation({ open, onCancel, onConfirm, itemName }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
    >
      <div className="panel bg-paper dark:bg-dusk p-6 max-w-sm w-full">
        <h3 id="delete-confirm-title" className="text-lg font-semibold mb-2">
          Delete this weather record?
        </h3>
        <p className="text-sm text-mist mb-6">
          {itemName ? `This will permanently remove the record for ${itemName}.` : 'This action cannot be undone.'}
        </p>
        <div className="flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary bg-red-600 dark:bg-red-500 text-white"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
