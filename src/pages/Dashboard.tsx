import { useState, useEffect } from 'react'
import { Plus, Search, LogOut, PenTool, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import Editor from '../components/Editor'
import NoteCard from '../components/NoteCard'

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }))
      setNotes(parsedNotes)
      if (parsedNotes.length > 0 && !activeNoteId) {
        setActiveNoteId(parsedNotes[0].id)
      }
    }
  }, [])

  useEffect(() => {
    const notesToSave = notes.map(note => ({
      ...note,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString()
    }))
    localStorage.setItem('notes', JSON.stringify(notesToSave))
  }, [notes])

  const activeNote = notes.find(note => note.id === activeNoteId)

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setNotes([newNote, ...notes])
    setActiveNoteId(newNote.id)
    setIsSidebarOpen(false)
  }

  const updateNote = (content: string) => {
    if (!activeNoteId) return

    setNotes(notes.map(note => {
      if (note.id === activeNoteId) {
        const lines = content.replace(/<[^>]*>/g, '').split('\n')
        const title = lines[0] || 'Untitled Note'
        return {
          ...note,
          title: title.substring(0, 50),
          content,
          updatedAt: new Date()
        }
      }
      return note
    }))
  }

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId))
    if (activeNoteId === noteId) {
      setActiveNoteId(notes.length > 1 ? notes.find(n => n.id !== noteId)?.id || null : null)
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex">
      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-gray-800 transition-transform duration-300`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <PenTool className="w-6 h-6 text-primary-600" />
                <span className="text-xl font-bold dark:text-white">NoteFlow</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={createNewNote}
              className="w-full btn-primary flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Note
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No notes found' : 'No notes yet. Create your first note!'}
              </div>
            ) : (
              filteredNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isActive={note.id === activeNoteId}
                  onClick={() => {
                    setActiveNoteId(note.id)
                    setIsSidebarOpen(false)
                  }}
                  onDelete={() => deleteNote(note.id)}
                />
              ))
            )}
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 dark:text-primary-400 font-semibold">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {activeNote?.title || 'Select a note'}
            </h1>
            <ThemeToggle />
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeNote ? (
            <Editor
              content={activeNote.content}
              onChange={updateNote}
              placeholder="Start writing your note..."
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <PenTool className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No note selected
                </h2>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  Create a new note or select an existing one to start writing
                </p>
                <button onClick={createNewNote} className="btn-primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard