import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/FirebaseAuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/signin" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute