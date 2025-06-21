import { useEditor, EditorContent, ReactNodeViewRenderer, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import { common, createLowlight } from 'lowlight'
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Code, FileCode, ImageIcon, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/FirebaseAuthContext'
import { uploadImage } from '../services/imageService'
import { CodeBlock } from './CodeBlock'

// Create lowlight instance with common languages
const lowlight = createLowlight(common)

interface EditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

interface ImageUploadState {
  uploading: boolean
  error: string | null
}

const Editor = ({ content, onChange, placeholder = 'Start writing your note...' }: EditorProps) => {
  const { currentUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageUpload, setImageUpload] = useState<ImageUploadState>({ uploading: false, error: null })
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default code block to use syntax highlighting
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlock)
        },
      }).configure({
        lowlight,
        HTMLAttributes: {
          class: 'code-block',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'editor-content min-h-[400px] focus:outline-none',
      },
    },
  })

  // Update editor content when the content prop changes (e.g., when switching notes)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !currentUser) return

    setImageUpload({ uploading: true, error: null })

    try {
      const imageUrl = await uploadImage(file, currentUser.uid)
      editor?.chain().focus().setImage({ src: imageUrl }).run()
      setImageUpload({ uploading: false, error: null })
    } catch (error) {
      setImageUpload({ 
        uploading: false, 
        error: error instanceof Error ? error.message : 'Failed to upload image' 
      })
      setTimeout(() => setImageUpload(prev => ({ ...prev, error: null })), 5000)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle drag and drop
  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    
    const files = Array.from(event.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (!imageFile || !currentUser) return

    setImageUpload({ uploading: true, error: null })

    try {
      const imageUrl = await uploadImage(imageFile, currentUser.uid)
      editor?.chain().focus().setImage({ src: imageUrl }).run()
      setImageUpload({ uploading: false, error: null })
    } catch (error) {
      setImageUpload({ 
        uploading: false, 
        error: error instanceof Error ? error.message : 'Failed to upload image' 
      })
      setTimeout(() => setImageUpload(prev => ({ ...prev, error: null })), 5000)
    }
  }

  if (!editor) {
    return null
  }

  const ToolbarButton = ({ onClick, isActive, children, title, disabled = false }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 sm:p-2 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 rounded-lg transition-colors ${
        disabled
          ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600'
          : isActive
          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
      }`}
      title={title}
    >
      {children}
    </button>
  )

  return (
    <div className="card">
      {/* Bubble Menu - Floating Toolbar */}
      {editor && (
        <BubbleMenu 
          editor={editor} 
          tippyOptions={{ duration: 100, placement: 'top' }}
          className="flex items-center gap-1 p-1 sm:p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-[90vw] overflow-x-auto scrollbar-hide"
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Code"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-600" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-600" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
        </BubbleMenu>
      )}
      
      <div className="flex items-center gap-1 pb-4 border-b border-gray-200 dark:border-gray-700 flex-wrap overflow-x-auto scrollbar-hide">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-5 h-5" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Code"
        >
          <Code className="w-5 h-5" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <FileCode className="w-5 h-5" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          isActive={false}
          title="Upload Image"
          disabled={imageUpload.uploading}
        >
          {imageUpload.uploading ? (
            <Upload className="w-5 h-5 animate-spin" />
          ) : (
            <ImageIcon className="w-5 h-5" />
          )}
        </ToolbarButton>
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      
      {/* Error message */}
      {imageUpload.error && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{imageUpload.error}</p>
        </div>
      )}
      
      <div 
        className="pt-4 min-h-[300px] sm:min-h-[400px]"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default Editor