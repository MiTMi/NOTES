import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/FirebaseAuthContext'
import { saveNote } from '../services/notesService'

interface LocalNote {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  isPinned?: boolean
}

const DataMigration = () => {
  const { currentUser } = useAuth()
  const [migrationStatus, setMigrationStatus] = useState<'checking' | 'migrating' | 'completed' | 'error'>('checking')
  const [progress, setProgress] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!currentUser) return

    const migrateData = async () => {
      try {
        // Check if migration has already been done
        const migrationKey = `migration_completed_${currentUser.uid}`
        if (localStorage.getItem(migrationKey)) {
          setMigrationStatus('completed')
          return
        }

        // Look for notes in localStorage
        const notesKey = `notes_${currentUser.email}`
        const savedNotes = localStorage.getItem(notesKey)
        
        if (!savedNotes) {
          // No notes to migrate
          localStorage.setItem(migrationKey, 'true')
          setMigrationStatus('completed')
          return
        }

        const notes: LocalNote[] = JSON.parse(savedNotes)
        if (notes.length === 0) {
          localStorage.setItem(migrationKey, 'true')
          setMigrationStatus('completed')
          return
        }

        setMigrationStatus('migrating')
        setTotal(notes.length)

        // Migrate each note
        for (let i = 0; i < notes.length; i++) {
          const note = notes[i]
          await saveNote({
            title: note.title,
            content: note.content,
            userId: currentUser.uid,
            isPinned: note.isPinned || false,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt)
          })
          setProgress(i + 1)
        }

        // Mark migration as completed
        localStorage.setItem(migrationKey, 'true')
        
        // Optionally remove old data
        // localStorage.removeItem(notesKey)
        
        setMigrationStatus('completed')
      } catch (error) {
        console.error('Migration error:', error)
        setMigrationStatus('error')
      }
    }

    migrateData()
  }, [currentUser])

  if (migrationStatus === 'checking' || migrationStatus === 'completed') {
    return null
  }

  if (migrationStatus === 'migrating') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
          <h3 className="text-lg font-semibold mb-4">Migrating your notes...</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(progress / total) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {progress} of {total} notes migrated
          </p>
        </div>
      </div>
    )
  }

  if (migrationStatus === 'error') {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error migrating data. Your notes are still saved locally.</p>
      </div>
    )
  }

  return null
}

export default DataMigration