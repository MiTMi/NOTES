import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../lib/firebase'

// Helper function to generate unique filename
const generateFileName = (file: File, userId: string): string => {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2)
  const extension = file.name.split('.').pop()
  return `users/${userId}/images/${timestamp}_${randomString}.${extension}`
}

// Helper function to resize image if it's too large
const resizeImage = (file: File, maxWidth: number = 1024, maxHeight: number = 1024, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(resizedFile)
          } else {
            resolve(file)
          }
        },
        file.type,
        quality
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

// Upload image to Firebase Storage
export const uploadImage = async (file: File, userId: string): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file')
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB')
    }

    // Resize image if necessary
    const optimizedFile = await resizeImage(file)

    // Generate unique filename
    const fileName = generateFileName(optimizedFile, userId)
    
    // Create storage reference
    const storageRef = ref(storage, fileName)
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, optimizedFile)
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Delete image from Firebase Storage
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the file path from the URL
    const url = new URL(imageUrl)
    const pathStart = url.pathname.indexOf('/o/') + 3
    const pathEnd = url.pathname.indexOf('?')
    const filePath = decodeURIComponent(url.pathname.substring(pathStart, pathEnd))
    
    // Create storage reference and delete
    const storageRef = ref(storage, filePath)
    await deleteObject(storageRef)
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

// Helper function to extract image URLs from note content
export const extractImageUrls = (htmlContent: string): string[] => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  const images = doc.querySelectorAll('img[src*="firebasestorage.googleapis.com"]')
  
  return Array.from(images).map(img => (img as HTMLImageElement).src)
}