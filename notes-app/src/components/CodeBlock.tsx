import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export const CodeBlock = ({ node }: any) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const codeContent = node.textContent
    navigator.clipboard.writeText(codeContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <NodeViewWrapper className="code-block-wrapper">
      <div className="relative group">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
        <pre className="code-block">
          <NodeViewContent as="code" />
        </pre>
      </div>
    </NodeViewWrapper>
  )
}