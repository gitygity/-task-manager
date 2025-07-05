import { useState } from 'react'
import { useRegister } from '../hooks'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoaderCircle, Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import type { RegisterData } from '../types'

interface RegisterFormData extends RegisterData {
  confirmPassword: string
}

interface RegisterFormProps {
  onSwitchToLogin?: () => void
  onRegisterSuccess?: () => void
}

export function RegisterForm({ onSwitchToLogin, onRegisterSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Partial<RegisterFormData>>({})

  const register = useRegister()

  // Form validation
  const validateForm = (): boolean => {
    const errors: Partial<RegisterFormData> = {}

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'ایمیل الزامی است'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'فرمت ایمیل نامعتبر است'
    }

    // Full name validation
    if (!formData.fullName?.trim()) {
      errors.fullName = 'نام کامل الزامی است'
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'نام کامل باید حداقل ۲ کاراکتر باشد'
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'رمز عبور الزامی است'
    } else if (formData.password.length < 6) {
      errors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'رمز عبور باید شامل حروف کوچک، بزرگ و عدد باشد'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'تکرار رمز عبور الزامی است'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیستند'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const registerData: RegisterData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      }

      const response = await register.mutateAsync(registerData)
      
      if (response.error) {
        // Show server error
        console.error('Registration failed:', response.error)
      } else if (response.user) {
        // Registration successful
        onRegisterSuccess?.()
        
        // Reset form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: ''
        })
        setValidationErrors({})
      }
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">ایجاد حساب جدید</CardTitle>
        <CardDescription>
          اطلاعات خود را برای ثبت نام وارد کنید
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="fullName">نام کامل</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="نام و نام خانوادگی"
                className={`pl-10 ${validationErrors.fullName ? 'border-red-500' : ''}`}
                disabled={register.isPending}
              />
            </div>
            {validationErrors.fullName && (
              <p className="text-sm text-red-600">{validationErrors.fullName}</p>
            )}
          </div>

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
                disabled={register.isPending}
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
                placeholder="رمز عبور قوی انتخاب کنید"
                className={`pl-10 pr-10 ${validationErrors.password ? 'border-red-500' : ''}`}
                disabled={register.isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={register.isPending}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-600">{validationErrors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="رمز عبور را دوباره وارد کنید"
                className={`pl-10 pr-10 ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                disabled={register.isPending}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={register.isPending}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-sm text-red-600">{validationErrors.confirmPassword}</p>
            )}
          </div>

          {/* Registration Error */}
          {register.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              خطا در ثبت نام: {register.error instanceof Error ? register.error.message : 'خطای نامشخص'}
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={register.isPending}
          >
            {register.isPending ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                در حال ثبت نام...
              </>
            ) : (
              'ثبت نام'
            )}
          </Button>

          {/* Switch to Login */}
          {onSwitchToLogin && (
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                قبلاً حساب دارید؟{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                  disabled={register.isPending}
                >
                  وارد شوید
                </button>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
} 