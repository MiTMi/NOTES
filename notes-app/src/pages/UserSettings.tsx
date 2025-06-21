import { useState } from 'react'
import { ArrowLeft, User, Lock, Trash2, Save, AlertCircle, Download, Bell, Palette, Type } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/FirebaseAuthContext'
import { 
  updateProfile, 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential,
  deleteUser
} from 'firebase/auth'
import { deleteAllUserNotes } from '../services/notesService'
import { useTheme } from '../contexts/ThemeContext'

const UserSettings = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  
  // Form states
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  
  // Preferences states
  const [autoSave, setAutoSave] = useState(() => {
    const saved = localStorage.getItem('autoSave')
    return saved !== 'false'
  })
  const [defaultExportFormat, setDefaultExportFormat] = useState(() => {
    return localStorage.getItem('defaultExportFormat') || 'markdown'
  })
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('editorFontSize') || 'medium'
  })
  const [editorTheme, setEditorTheme] = useState(() => {
    return localStorage.getItem('editorTheme') || 'default'
  })
  const [showWordCount, setShowWordCount] = useState(() => {
    const saved = localStorage.getItem('showWordCount')
    return saved === 'true'
  })
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled')
    return saved !== 'false'
  })
  
  // UI states
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [activeSection, setActiveSection] = useState<'profile' | 'password' | 'preferences' | 'export' | 'notifications' | 'delete' | null>(null)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setLoading(true)
    setMessage(null)

    try {
      await updateProfile(currentUser, {
        displayName: displayName.trim()
      })
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !currentUser.email) return

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      )
      await reauthenticateWithCredential(currentUser, credential)
      
      // Update password
      await updatePassword(currentUser, newPassword)
      
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        setMessage({ type: 'error', text: 'Current password is incorrect' })
      } else {
        setMessage({ type: 'error', text: error.message || 'Failed to change password' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || deleteConfirmation !== 'DELETE') return

    const confirmed = window.confirm(
      'Are you absolutely sure? This action cannot be undone. All your notes will be permanently deleted.'
    )
    
    if (!confirmed) return

    setLoading(true)
    setMessage(null)

    try {
      // Delete all user notes first
      await deleteAllUserNotes(currentUser.uid)
      
      // Then delete the user account
      await deleteUser(currentUser)
      navigate('/')
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setMessage({ 
          type: 'error', 
          text: 'Please sign out and sign in again before deleting your account' 
        })
      } else {
        setMessage({ type: 'error', text: error.message || 'Failed to delete account' })
      }
    } finally {
      setLoading(false)
    }
  }

  // Save preferences to localStorage
  const savePreference = (key: string, value: any) => {
    localStorage.setItem(key, value.toString())
    setMessage({ type: 'success', text: 'Preference saved!' })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleAutoSaveToggle = () => {
    const newValue = !autoSave
    setAutoSave(newValue)
    savePreference('autoSave', newValue)
  }

  const handleExportFormatChange = (format: string) => {
    setDefaultExportFormat(format)
    savePreference('defaultExportFormat', format)
  }

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    savePreference('editorFontSize', size)
    // Dispatch custom event for editor to pick up
    window.dispatchEvent(new CustomEvent('fontSizeChanged', { detail: size }))
  }

  const handleEditorThemeChange = (theme: string) => {
    setEditorTheme(theme)
    savePreference('editorTheme', theme)
    window.dispatchEvent(new CustomEvent('editorThemeChanged', { detail: theme }))
  }

  const handleWordCountToggle = () => {
    const newValue = !showWordCount
    setShowWordCount(newValue)
    savePreference('showWordCount', newValue)
    window.dispatchEvent(new CustomEvent('wordCountToggled', { detail: newValue }))
  }

  const handleNotificationsToggle = async () => {
    const newValue = !notificationsEnabled
    
    if (newValue && 'Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setMessage({ type: 'error', text: 'Notification permission denied' })
        return
      }
    }
    
    setNotificationsEnabled(newValue)
    savePreference('notificationsEnabled', newValue)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}>
            {message.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setActiveSection(activeSection === 'profile' ? null : 'profile')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Profile Information
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update your display name and email
                  </p>
                </div>
              </div>
            </button>
            
            {activeSection === 'profile' && (
              <div className="px-6 pb-6">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={currentUser?.email || ''}
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-coral-500 hover:bg-coral-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Password Settings */}
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setActiveSection(activeSection === 'password' ? null : 'password')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Change Password
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update your account password
                  </p>
                </div>
              </div>
            </button>
            
            {activeSection === 'password' && (
              <div className="px-6 pb-6">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-coral-500 hover:bg-coral-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{loading ? 'Changing...' : 'Change Password'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Editor Preferences */}
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setActiveSection(activeSection === 'preferences' ? null : 'preferences')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Type className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Editor Preferences
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Customize your writing experience
                  </p>
                </div>
              </div>
            </button>
            
            {activeSection === 'preferences' && (
              <div className="px-6 pb-6 space-y-4">
                {/* Auto-save */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Auto-save
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Automatically save notes as you type
                    </p>
                  </div>
                  <button
                    onClick={handleAutoSaveToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoSave ? 'bg-coral-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Editor Font Size
                  </label>
                  <select
                    value={fontSize}
                    onChange={(e) => handleFontSizeChange(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>

                {/* Editor Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Editor Theme
                  </label>
                  <select
                    value={editorTheme}
                    onChange={(e) => handleEditorThemeChange(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                  >
                    <option value="default">Default</option>
                    <option value="minimal">Minimal</option>
                    <option value="focus">Focus Mode</option>
                    <option value="typewriter">Typewriter</option>
                  </select>
                </div>

                {/* Word Count */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Show Word Count
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Display word count in the editor
                    </p>
                  </div>
                  <button
                    onClick={handleWordCountToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showWordCount ? 'bg-coral-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showWordCount ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export Settings */}
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setActiveSection(activeSection === 'export' ? null : 'export')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Export Settings
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configure default export options
                  </p>
                </div>
              </div>
            </button>
            
            {activeSection === 'export' && (
              <div className="px-6 pb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Export Format
                  </label>
                  <select
                    value={defaultExportFormat}
                    onChange={(e) => handleExportFormatChange(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                  >
                    <option value="markdown">Markdown (.md)</option>
                    <option value="text">Plain Text (.txt)</option>
                    <option value="json">JSON (.json)</option>
                    <option value="pdf">PDF (.pdf)</option>
                  </select>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    This will be the default format when exporting notes
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setActiveSection(activeSection === 'notifications' ? null : 'notifications')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage notification preferences
                  </p>
                </div>
              </div>
            </button>
            
            {activeSection === 'notifications' && (
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Browser Notifications
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get notified about important updates
                    </p>
                  </div>
                  <button
                    onClick={handleNotificationsToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificationsEnabled ? 'bg-coral-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Appearance */}
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Appearance
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Customize the app's look and feel
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Toggle between light and dark themes
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDark ? 'bg-coral-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Delete Account */}
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-red-200 dark:border-red-900/50">
            <button
              onClick={() => setActiveSection(activeSection === 'delete' ? null : 'delete')}
              className="w-full flex items-center justify-between p-6 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete Account
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permanently delete your account and all data
                  </p>
                </div>
              </div>
            </button>
            
            {activeSection === 'delete' && (
              <div className="px-6 pb-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                  <p className="text-red-700 dark:text-red-400 text-sm">
                    <strong>Warning:</strong> This action cannot be undone. All your notes and data will be permanently deleted.
                  </p>
                </div>
                
                <form onSubmit={handleDeleteAccount} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type "DELETE" to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Type DELETE to confirm"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading || deleteConfirmation !== 'DELETE'}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{loading ? 'Deleting...' : 'Delete Account'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserSettings