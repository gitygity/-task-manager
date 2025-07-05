import { LoginForm } from '@/features/auth/components/LoginForm'
import { useNavigate } from 'react-router-dom'
import { startTransition } from 'react'
import { ROUTE_PATHS } from '@/routes/constants'

export default function LoginPage() {
  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    // Redirect to dashboard after successful login with startTransition
    startTransition(() => {
      const redirectPath = sessionStorage.getItem('redirectPath')
      if (redirectPath) {
        sessionStorage.removeItem('redirectPath')
        navigate(redirectPath, { replace: true })
      } else {
        navigate(ROUTE_PATHS.private.dashboard, { replace: true })
      }
    })
  }

  const handleSwitchToRegister = () => {
    navigate('/register')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </div>
  )
} 