import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface Note {
  id: string
  title: string
  content: string
  userId: string
  isPinned?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FirestoreNote {
  title: string
  content: string
  userId: string
  isPinned?: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Subscribe to user's notes
export const subscribeToNotes = (
  userId: string,
  onUpdate: (notes: Note[]) => void
) => {
  const q = query(
    collection(db, 'notes'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  )

  return onSnapshot(q, (snapshot) => {
    const notes: Note[] = []
    snapshot.forEach((doc) => {
      const data = doc.data() as FirestoreNote
      notes.push({
        id: doc.id,
        title: data.title,
        content: data.content,
        userId: data.userId,
        isPinned: data.isPinned || false,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      })
    })
    onUpdate(notes)
  })
}

// Create or update a note
export const saveNote = async (note: Partial<Note> & { userId: string }) => {
  const noteData: any = {
    title: note.title || 'Untitled Note',
    content: note.content || '',
    userId: note.userId,
    isPinned: note.isPinned || false,
    updatedAt: serverTimestamp()
  }

  if (note.id) {
    // Update existing note
    await setDoc(doc(db, 'notes', note.id), noteData, { merge: true })
  } else {
    // Create new note
    noteData.createdAt = serverTimestamp()
    const newNoteRef = doc(collection(db, 'notes'))
    await setDoc(newNoteRef, noteData)
    return newNoteRef.id
  }
}

// Delete a note
export const deleteNote = async (noteId: string) => {
  await deleteDoc(doc(db, 'notes', noteId))
}

// Toggle pin status
export const togglePinNote = async (noteId: string, isPinned: boolean) => {
  await setDoc(doc(db, 'notes', noteId), {
    isPinned: !isPinned,
    updatedAt: serverTimestamp()
  }, { merge: true })
}