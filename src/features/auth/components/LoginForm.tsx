import { useState } from 'react'
import { useLogin } from '../hooks'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoaderCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import type { LoginData } from '../types'

interface LoginFormProps {
  onSwitchToRegister?: () => void
  onLoginSuccess?: () => void
}

export function LoginForm({ onSwitchToRegister, onLoginSuccess }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Partial<LoginData>>({})

  const login = useLogin()

  // Form validation
  const validateForm = (): boolean => {
    const errors: Partial<LoginData> = {}

    if (!formData.email.trim()) {
      errors.email = 'ایمیل الزامی است'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'فرمت ایمیل نامعتبر است'
    }

    if (!formData.password) {
      errors.password = 'رمز عبور الزامی است'
    } else if (formData.password.length < 6) {
      errors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const response = await login.mutateAsync(formData)
      
      if (response.error) {
        // Show server error
        console.error('Login failed:', response.error)
      } else if (response.user) {
        // Login successful
        onLoginSuccess?.()
        
        // Reset form
        setFormData({ email: '', password: '' })
        setValidationErrors({})
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof LoginData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">ورود به حساب</CardTitle>
        <CardDescription>
          ایمیل و رمز عبور خود را وارد کنید
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="example@email.com"
                className={`pl-10 ${validationErrors.email ? 'border-red-500' : ''}`}
                disabled={login.isPending}
              />
            </div>
            {validationErrors.email && (
              <p className="text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">رمز عبور</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="رمز عبور خود را وارد کنید"
                className={`pl-10 pr-10 ${validationErrors.password ? 'border-red-500' : ''}`}
                disabled={login.isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={login.isPending}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-600">{validationErrors.password}</p>
            )}
          </div>

          {/* Login Error */}
          {login.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              خطا در ورود: {login.error instanceof Error ? login.error.message : 'خطای نامشخص'}
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={login.isPending}
          >
            {login.isPending ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                در حال ورود...
              </>
            ) : (
              'ورود'
            )}
          </Button>

          {/* Switch to Register */}
          {onSwitchToRegister && (
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                حساب کاربری ندارید؟{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                  disabled={login.isPending}
                >
                  ثبت نام کنید
                </button>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
} 