import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Code } from 'lucide-react'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

const Editor = ({ content, onChange, placeholder = 'Start writing your note...' }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
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

  if (!editor) {
    return null
  }

  const ToolbarButton = ({ onClick, isActive, children, title }: any) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${
        isActive
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
      <div className="flex items-center gap-1 pb-4 border-b border-gray-200 dark:border-gray-700 flex-wrap">
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
      </div>
      <div className="pt-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default Editor