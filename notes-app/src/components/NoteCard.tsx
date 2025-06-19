import { Trash2, Clock, Pin } from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  isPinned?: boolean
}

interface NoteCardProps {
  note: Note
  isActive: boolean
  onClick: () => void
  onDelete: () => void
  onTogglePin: () => void
}

const NoteCard = ({ note, isActive, onClick, onDelete, onTogglePin }: NoteCardProps) => {
  const getPreview = (html: string) => {
    const temp = document.createElement('div')
    temp.innerHTML = html
    
    // Replace block elements with line breaks before extracting text
    temp.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, li').forEach(el => {
      el.insertAdjacentText('afterend', '\n')
    })
    
    const text = temp.textContent || temp.innerText || ''
    const lines = text.split(/\r?\n|\r/).filter(line => line.trim())
    
    // Remove the first line (title) from preview
    const previewLines = lines.slice(1)
    const previewText = previewLines.join(' ').trim()
    
    if (!previewText) return 'No additional content...'
    
    return previewText.slice(0, 100) + (previewText.length > 100 ? '...' : '')
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
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onTogglePin()
            }}
            className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
              note.isPinned
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
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