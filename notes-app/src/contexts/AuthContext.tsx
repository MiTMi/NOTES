import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, _password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, accept any email/password
    // Generate consistent ID based on email
    const userId = btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 9)
    console.log('SignIn - Email:', email, 'Generated ID:', userId)
    
    const mockUser: User = {
      id: userId,
      email,
      name: email.split('@')[0]
    }
    
    localStorage.setItem('user', JSON.stringify(mockUser))
    setUser(mockUser)
    navigate('/dashboard')
  }

  const signUp = async (name: string, email: string, _password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate consistent ID based on email
    const userId = btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 9)
    console.log('SignUp - Email:', email, 'Generated ID:', userId)
    
    const mockUser: User = {
      id: userId,
      email,
      name
    }
    
    localStorage.setItem('user', JSON.stringify(mockUser))
    setUser(mockUser)
    navigate('/dashboard')
  }

  const signOut = () => {
    localStorage.removeItem('user')
    setUser(null)
    
    // Optionally clear user-specific notes on logout
    // Uncomment the line below to clear notes when logging out
    // if (currentUser?.id) localStorage.removeItem(`notes_${currentUser.id}`)
    
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}