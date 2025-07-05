import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

type AuthMode = 'login' | 'register'

interface AuthContainerProps {
  onAuthSuccess?: () => void
  initialMode?: AuthMode
}

export function AuthContainer({ onAuthSuccess, initialMode = 'login' }: AuthContainerProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)

  const handleAuthSuccess = () => {
    onAuthSuccess?.()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode === 'login' ? (
          <LoginForm
            onSwitchToRegister={() => setMode('register')}
            onLoginSuccess={handleAuthSuccess}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => setMode('login')}
            onRegisterSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </div>
  )
} 