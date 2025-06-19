import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200/80 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 hover:bg-gray-300/80 dark:hover:bg-white/20 hover:border-gray-400 dark:hover:border-white/30 transition-all duration-200"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-accent-yellow" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  )
}

export default ThemeToggle