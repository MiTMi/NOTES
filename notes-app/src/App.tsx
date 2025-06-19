import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import FirebaseSignIn from './pages/FirebaseSignIn'
import FirebaseSignUp from './pages/FirebaseSignUp'
import FirebaseDashboard from './pages/FirebaseDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/FirebaseAuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<FirebaseSignIn />} />
            <Route path="/signup" element={<FirebaseSignUp />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <FirebaseDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App