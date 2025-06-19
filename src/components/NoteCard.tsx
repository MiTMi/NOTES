import { Trash2, Clock } from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

interface NoteCardProps {
  note: Note
  isActive: boolean
  onClick: () => void
  onDelete: () => void
}

const NoteCard = ({ note, isActive, onClick, onDelete }: NoteCardProps) => {
  const getPreview = (html: string) => {
    const temp = document.createElement('div')
    temp.innerHTML = html
    const text = temp.textContent || temp.innerText || ''
    return text.slice(0, 100) + (text.length > 100 ? '...' : '')
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date)
  }

  return (
    <div
      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
          : 'bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate flex-1">
          {note.title || 'Untitled Note'}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {getPreview(note.content)}
      </p>
      <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
        <Clock className="w-3 h-3 mr-1" />
        {formatDate(note.updatedAt)}
      </div>
    </div>
  )
}

export default NoteCard