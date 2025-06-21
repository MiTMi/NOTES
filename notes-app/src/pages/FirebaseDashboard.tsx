import { useState, useEffect, useRef } from 'react'
import { Plus, Search, LogOut, PenTool, Menu, X, Check, AlertCircle, BarChart3, Download, FileText, FileJson } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/FirebaseAuthContext'
import ThemeToggle from '../components/ThemeToggle'
import Editor from '../components/Editor'
import NoteCard from '../components/NoteCard'
import DataMigration from '../components/DataMigration'
import { subscribeToNotes, saveNote, deleteNote as deleteNoteService, togglePinNote as togglePinNoteService, type Note } from '../services/notesService'

const FirebaseDashboard = () => {
  const { currentUser, signOut } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | 'unsaved'>('saved')
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [draggedNote, setDraggedNote] = useState<Note | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!currentUser) return

    // Subscribe to notes changes
    const unsubscribe = subscribeToNotes(currentUser.uid, (updatedNotes) => {
      // Sort notes: pinned first, then by updated date
      const sortedNotes = updatedNotes.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return b.updatedAt.getTime() - a.updatedAt.getTime()
      })
      
      setNotes(sortedNotes)
      
      // Set active note if none selected
      if (!activeNoteId && sortedNotes.length > 0) {
        setActiveNoteId(sortedNotes[0].id)
      }
    })

    return () => unsubscribe()
  }, [currentUser, activeNoteId])

  // Reset save status when switching notes
  useEffect(() => {
    setSaveStatus('saved')
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
  }, [activeNoteId])

  const activeNote = notes.find(note => note.id === activeNoteId)

  // Export functions
  const exportAsMarkdown = () => {
    if (!activeNote) return
    
    const content = activeNote.content
      .replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/g, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/g, '*$1*')
      .replace(/<code[^>]*>(.*?)<\/code>/g, '`$1`')
      .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gs, '```\n$1\n```')
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gs, '> $1')
      .replace(/<li[^>]*>(.*?)<\/li>/g, '- $1')
      .replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<br[^>]*>/g, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    
    const blob = new Blob([`# ${activeNote.title || 'Untitled'}\n\n${content}`], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeNote.title || 'note'}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsText = () => {
    if (!activeNote) return
    
    const content = activeNote.content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .trim()
    
    const blob = new Blob([`${activeNote.title || 'Untitled'}\n\n${content}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeNote.title || 'note'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsJSON = () => {
    if (!activeNote) return
    
    const exportData = {
      title: activeNote.title,
      content: activeNote.content,
      createdAt: activeNote.createdAt,
      updatedAt: activeNote.updatedAt,
      isPinned: activeNote.isPinned
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeNote.title || 'note'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const createNewNote = async () => {
    if (!currentUser) return

    const newNoteId = await saveNote({
      title: 'New Note',
      content: '',
      userId: currentUser.uid
    })

    if (newNoteId) {
      setActiveNoteId(newNoteId)
      setIsSidebarOpen(false)
    }
  }

  const updateNote = async (content: string) => {
    if (!activeNoteId || !currentUser) return

    // Clear existing save timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Mark as unsaved
    setSaveStatus('unsaved')

    // Debounce save operation
    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving')
      
      try {
        // Extract title from content
        const temp = document.createElement('div')
        temp.innerHTML = content
        
        temp.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, li').forEach(el => {
          el.insertAdjacentText('afterend', '\n')
        })
        
        const textContent = temp.textContent || temp.innerText || ''
        const lines = textContent.split(/\r?\n|\r/).filter(line => line.trim())
        const title = lines[0]?.trim() || 'Untitled Note'

        await saveNote({
          id: activeNoteId,
          title: title.substring(0, 50),
          content,
          userId: currentUser.uid,
          isPinned: activeNote?.isPinned
        })

        setSaveStatus('saved')
      } catch (error) {
        console.error('Error saving note:', error)
        setSaveStatus('error')
      }
    }, 1000) // 1 second debounce
  }

  const deleteNote = async (noteId: string) => {
    await deleteNoteService(noteId)
    if (activeNoteId === noteId) {
      setActiveNoteId(notes.length > 1 ? notes.find(n => n.id !== noteId)?.id || null : null)
    }
  }

  const togglePinNote = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId)
    if (note) {
      await togglePinNoteService(noteId, note.isPinned || false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, note: Note) => {
    setDraggedNote(note)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggedNote(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (!draggedNote) return
    
    const dragIndex = filteredNotes.findIndex(n => n.id === draggedNote.id)
    if (dragIndex === dropIndex) return
    
    // Create a new array with the reordered notes
    const reorderedNotes = [...filteredNotes]
    reorderedNotes.splice(dragIndex, 1)
    reorderedNotes.splice(dropIndex, 0, draggedNote)
    
    // Update the notes state
    const pinnedNotes = reorderedNotes.filter(n => n.isPinned)
    const unpinnedNotes = reorderedNotes.filter(n => !n.isPinned)
    const finalOrder = [...pinnedNotes, ...unpinnedNotes]
    
    setNotes(finalOrder)
    setDraggedNote(null)
    setDragOverIndex(null)
  }

  return (
    <>
      <DataMigration />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-navy-dark dark:via-navy-light dark:to-navy-dark flex">
        {/* Sidebar */}
        <div className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white dark:bg-navy-light border-r border-gray-200 dark:border-white/20 transition-transform duration-300`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200 dark:border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <PenTool className="w-6 h-6 text-coral-500" />
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
                filteredNotes.map((note, index) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isActive={note.id === activeNoteId}
                    onClick={() => {
                      setActiveNoteId(note.id)
                      setIsSidebarOpen(false)
                    }}
                    onDelete={() => deleteNote(note.id)}
                    onTogglePin={() => togglePinNote(note.id)}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    isDraggedOver={dragOverIndex === index}
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
                      {currentUser?.displayName?.charAt(0).toUpperCase() || currentUser?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {currentUser?.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
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
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {activeNote?.title || 'Select a note'}
                </h1>
                {activeNote && (
                  <div className="flex items-center space-x-2">
                    {saveStatus === 'saved' && (
                      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Saved</span>
                      </div>
                    )}
                    {saveStatus === 'saving' && (
                      <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                        <div className="w-4 h-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Saving...</span>
                      </div>
                    )}
                    {saveStatus === 'unsaved' && (
                      <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                        <div className="w-2 h-2 bg-yellow-600 dark:bg-yellow-400 rounded-full" />
                        <span className="text-sm">Unsaved changes</span>
                      </div>
                    )}
                    {saveStatus === 'error' && (
                      <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">Save failed</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {activeNote && (
                  <div className="relative group">
                    <button
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Export note"
                    >
                      <Download className="w-5 h-5" />
                      <span className="hidden sm:inline">Export</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <button
                        onClick={exportAsMarkdown}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Export as Markdown</span>
                      </button>
                      <button
                        onClick={exportAsText}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Export as Text</span>
                      </button>
                      <button
                        onClick={exportAsJSON}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left rounded-b-lg"
                      >
                        <FileJson className="w-4 h-4" />
                        <span>Export as JSON</span>
                      </button>
                    </div>
                  </div>
                )}
                <Link
                  to="/analytics"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="hidden sm:inline">Analytics</span>
                </Link>
                <ThemeToggle />
              </div>
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
    </>
  )
}

export default FirebaseDashboard