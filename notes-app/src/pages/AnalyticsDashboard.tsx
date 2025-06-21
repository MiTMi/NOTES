import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import { 
  FileText, 
  BarChart3,
  Activity,
  ArrowUp,
  ArrowDown,
  Zap,
  Target,
  StickyNote,
  Hash
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/FirebaseAuthContext'
import { subscribeToNotes, type Note } from '../services/notesService'

const AnalyticsDashboard = () => {
  const [animateNumbers, setAnimateNumbers] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const { currentUser } = useAuth()

  useEffect(() => {
    setAnimateNumbers(true)
  }, [])

  useEffect(() => {
    if (!currentUser) return

    const unsubscribe = subscribeToNotes(currentUser.uid, (fetchedNotes) => {
      setNotes(fetchedNotes)
    })

    return unsubscribe
  }, [currentUser])

  // Calculate statistics from real data
  const totalNotes = notes.length
  const pinnedNotes = notes.filter(note => note.isPinned).length
  const recentNotes = notes.filter(note => {
    const noteDate = new Date(note.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return noteDate > weekAgo
  }).length
  
  // Calculate average note length
  const avgNoteLength = notes.length > 0 
    ? Math.round(notes.reduce((sum, note) => sum + note.content.length, 0) / notes.length)
    : 0

  const stats = [
    {
      title: 'Total Notes',
      value: totalNotes.toString(),
      change: recentNotes > 0 ? `+${recentNotes} this week` : 'No new notes',
      isPositive: recentNotes > 0,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Pinned Notes',
      value: pinnedNotes.toString(),
      change: `${Math.round((pinnedNotes / Math.max(totalNotes, 1)) * 100)}% of total`,
      isPositive: true,
      icon: StickyNote,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Recent Activity',
      value: recentNotes.toString(),
      change: 'Last 7 days',
      isPositive: recentNotes > 0,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Avg. Note Length',
      value: `${avgNoteLength} chars`,
      change: totalNotes > 0 ? 'Per note' : 'No data',
      isPositive: true,
      icon: Hash,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ]

  // Calculate weekly activity
  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push({
        date,
        dayName: getDayName(date),
        count: 0
      })
    }
    return days
  }

  const weeklyActivity = getLast7Days()
  notes.forEach(note => {
    const noteDate = new Date(note.createdAt)
    const daysDiff = Math.floor((new Date().getTime() - noteDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDiff >= 0 && daysDiff < 7) {
      weeklyActivity[6 - daysDiff].count++
    }
  })

  const activityData = weeklyActivity.map(day => ({
    day: day.dayName,
    notes: day.count,
    maxNotes: Math.max(...weeklyActivity.map(d => d.count), 1)
  }))

  const topFeatures = [
    { name: 'Rich Text Editor', usage: 89, icon: FileText },
    { name: 'Code Blocks', usage: 76, icon: BarChart3 },
    { name: 'Pinned Notes', usage: 68, icon: StickyNote },
    { name: 'Dark Mode', usage: 92, icon: Zap },
    { name: 'Export Options', usage: 54, icon: Target }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
              <nav className="hidden md:flex space-x-6">
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Notes
                </Link>
                <Link to="/analytics" className="text-coral-500 font-medium">
                  Analytics
                </Link>
              </nav>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                animateNumbers ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
                <span className={`flex items-center text-sm font-medium ${
                  stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change}
                  {stat.isPositive ? (
                    <ArrowUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 ml-1" />
                  )}
                </span>
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Activity Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Activity</h2>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Notes Created</span>
              </div>
            </div>
            <div className="relative h-64">
              <div className="absolute inset-0 flex items-end justify-between">
                {activityData.map((data, index) => (
                  <div key={index} className="flex-1 mx-1 flex flex-col items-center">
                    <div className="w-full flex items-end mb-2" style={{ height: '200px' }}>
                      <div 
                        className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-500 hover:opacity-80"
                        style={{ 
                          height: `${data.maxNotes > 0 ? (data.notes / data.maxNotes) * 100 : 0}%`,
                          minHeight: data.notes > 0 ? '4px' : '0px',
                          transitionDelay: `${index * 50}ms`
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Usage */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Feature Usage</h2>
            <div className="space-y-4">
              {topFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <feature.icon className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature.name}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{feature.usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-coral-500 to-coral-600 h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${feature.usage}%`,
                          transitionDelay: `${index * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Your Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Notes</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  No notes yet. Create your first note to get started!
                </p>
              ) : (
                notes.slice(0, 10).map((note) => {
                  const timeAgo = (date: Date) => {
                    const now = new Date()
                    const diff = now.getTime() - new Date(date).getTime()
                    const minutes = Math.floor(diff / 60000)
                    const hours = Math.floor(minutes / 60)
                    const days = Math.floor(hours / 24)
                    
                    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
                    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
                    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
                    return 'Just now'
                  }

                  return (
                    <div key={note.id} className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        {note.isPinned ? (
                          <StickyNote className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                          {note.title || 'Untitled Note'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {note.content.replace(/<[^>]*>/g, '').substring(0, 50)}...
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {timeAgo(note.updatedAt)}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            {notes.length > 10 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  to="/dashboard" 
                  className="text-sm text-coral-500 hover:text-coral-600 dark:text-coral-400 dark:hover:text-coral-300 font-medium"
                >
                  View all {notes.length} notes →
                </Link>
              </div>
            )}
          </div>

          {/* Note Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Note Statistics</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Characters Written</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {notes.reduce((sum, note) => sum + note.content.length, 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Note Length</span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {avgNoteLength} characters
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Longest Note</span>
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {notes.length > 0 ? Math.max(...notes.map(n => n.content.length)).toLocaleString() : 0} chars
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Notes Created Today</span>
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    {notes.filter(note => {
                      const today = new Date()
                      const noteDate = new Date(note.createdAt)
                      return noteDate.toDateString() === today.toDateString()
                    }).length}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Top Categories</h3>
                <div className="space-y-2">
                  {notes.filter(n => n.isPinned).length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                        <StickyNote className="w-3 h-3 mr-1" />
                        Pinned Notes
                      </span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {notes.filter(n => n.isPinned).length}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      Regular Notes
                    </span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {notes.filter(n => !n.isPinned).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AnalyticsDashboard