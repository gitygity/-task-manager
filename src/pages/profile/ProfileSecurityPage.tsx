import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Key, 
  Mail, 
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
  Loader2,
  CheckCircle
} from 'lucide-react'
import { useAuthStore } from '@/features/auth'
import { useChangePassword, useUpdateEmail } from '@/features/auth/hooks'

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface EmailFormData {
  newEmail: string
  confirmEmail: string
}

export default function ProfileSecurityPage() {
  const { user } = useAuthStore()
  const changePassword = useChangePassword()
  const updateEmail = useUpdateEmail()

  // Password form state
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)

  // Email form state
  const [emailForm, setEmailForm] = useState<EmailFormData>({
    newEmail: '',
    confirmEmail: '',
  })
  const [emailErrors, setEmailErrors] = useState<Record<string, string>>({})
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false)

  // Messages
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Password validation
  const validatePassword = () => {
    const errors: Record<string, string> = {}

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'رمز عبور فعلی الزامی است'
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'رمز عبور جدید الزامی است'
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'رمز عبور باید حداقل ۸ کاراکتر باشد'
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'تکرار رمز عبور الزامی است'
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'رمز عبور جدید و تکرار آن یکسان نیستند'
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword = 'رمز عبور جدید باید با رمز عبور فعلی متفاوت باشد'
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Email validation
  const validateEmail = () => {
    const errors: Record<string, string> = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailForm.newEmail) {
      errors.newEmail = 'ایمیل جدید الزامی است'
    } else if (!emailRegex.test(emailForm.newEmail)) {
      errors.newEmail = 'فرمت ایمیل صحیح نیست'
    }

    if (!emailForm.confirmEmail) {
      errors.confirmEmail = 'تکرار ایمیل الزامی است'
    } else if (emailForm.newEmail !== emailForm.confirmEmail) {
      errors.confirmEmail = 'ایمیل جدید و تکرار آن یکسان نیستند'
    }

    if (user && emailForm.newEmail === user.email) {
      errors.newEmail = 'ایمیل جدید باید با ایمیل فعلی متفاوت باشد'
    }

    setEmailErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePassword()) return

    setIsPasswordSubmitting(true)
    setMessage(null)

    try {
      const result = await changePassword.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })

      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'رمز عبور با موفقیت تغییر کرد' })
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        setPasswordErrors({})
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'خطا در تغییر رمز عبور' 
      })
    } finally {
      setIsPasswordSubmitting(false)
    }
  }

  // Handle email change
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail()) return

    setIsEmailSubmitting(true)
    setMessage(null)

    try {
      const result = await updateEmail.mutateAsync(emailForm.newEmail)

      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ 
          type: 'success', 
          text: 'درخواست تغییر ایمیل ارسال شد. لطفاً ایمیل خود را بررسی کنید' 
        })
        setEmailForm({
          newEmail: '',
          confirmEmail: '',
        })
        setEmailErrors({})
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'خطا در تغییر ایمیل' 
      })
    } finally {
      setIsEmailSubmitting(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(passwordForm.newPassword)

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">در حال بارگذاری اطلاعات کاربر...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">امنیت حساب</h1>
        <p className="text-gray-600 mt-2">مدیریت رمز عبور، ایمیل و تنظیمات امنیتی</p>
      </div>

      {/* Message */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Current Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            وضعیت امنیت حساب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">ایمیل تأیید شده</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                فعال
              </Badge>
            </div>

            {/* Password Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">رمز عبور</p>
                  <p className="text-sm text-gray-500">آخرین تغییر: نامشخص</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Shield className="h-3 w-3 mr-1" />
                محافظت شده
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            تغییر رمز عبور
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">رمز عبور فعلی *</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => {
                    setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))
                    setPasswordErrors(prev => ({ ...prev, currentPassword: '' }))
                  }}
                  placeholder="رمز عبور فعلی خود را وارد کنید"
                  className={passwordErrors.currentPassword ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-sm text-red-600">{passwordErrors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">رمز عبور جدید *</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => {
                    setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))
                    setPasswordErrors(prev => ({ ...prev, newPassword: '' }))
                  }}
                  placeholder="رمز عبور جدید خود را وارد کنید"
                  className={passwordErrors.newPassword ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              {/* Password Strength */}
              {passwordForm.newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">قدرت رمز عبور:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 w-6 rounded ${
                            level <= passwordStrength
                              ? passwordStrength <= 2
                                ? 'bg-red-500'
                                : passwordStrength <= 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {passwordStrength <= 2 ? 'ضعیف' : passwordStrength <= 3 ? 'متوسط' : 'قوی'}
                    </span>
                  </div>
                </div>
              )}
              
              {passwordErrors.newPassword && (
                <p className="text-sm text-red-600">{passwordErrors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تکرار رمز عبور جدید *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => {
                    setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))
                    setPasswordErrors(prev => ({ ...prev, confirmPassword: '' }))
                  }}
                  placeholder="رمز عبور جدید را مجدداً وارد کنید"
                  className={passwordErrors.confirmPassword ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-600">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">الزامات رمز عبور:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${passwordForm.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  حداقل ۸ کاراکتر
                </li>
                <li className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${/[a-z]/.test(passwordForm.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  حروف کوچک انگلیسی
                </li>
                <li className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${/[A-Z]/.test(passwordForm.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  حروف بزرگ انگلیسی
                </li>
                <li className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${/[0-9]/.test(passwordForm.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  اعداد
                </li>
                <li className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${/[^A-Za-z0-9]/.test(passwordForm.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  کاراکترهای خاص
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPasswordSubmitting}
                className="min-w-32"
              >
                {isPasswordSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    در حال تغییر...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    تغییر رمز عبور
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            تغییر ایمیل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                تغییر ایمیل نیاز به تأیید دارد. لینک تأیید به ایمیل جدید ارسال خواهد شد.
              </p>
            </div>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            {/* Current Email */}
            <div className="space-y-2">
              <Label>ایمیل فعلی</Label>
              <Input
                value={user.email}
                disabled
                className="bg-gray-50"
              />
            </div>

            {/* New Email */}
            <div className="space-y-2">
              <Label htmlFor="newEmail">ایمیل جدید *</Label>
              <Input
                id="newEmail"
                type="email"
                value={emailForm.newEmail}
                onChange={(e) => {
                  setEmailForm(prev => ({ ...prev, newEmail: e.target.value }))
                  setEmailErrors(prev => ({ ...prev, newEmail: '' }))
                }}
                placeholder="ایمیل جدید خود را وارد کنید"
                className={emailErrors.newEmail ? 'border-red-500' : ''}
              />
              {emailErrors.newEmail && (
                <p className="text-sm text-red-600">{emailErrors.newEmail}</p>
              )}
            </div>

            {/* Confirm Email */}
            <div className="space-y-2">
              <Label htmlFor="confirmEmail">تکرار ایمیل جدید *</Label>
              <Input
                id="confirmEmail"
                type="email"
                value={emailForm.confirmEmail}
                onChange={(e) => {
                  setEmailForm(prev => ({ ...prev, confirmEmail: e.target.value }))
                  setEmailErrors(prev => ({ ...prev, confirmEmail: '' }))
                }}
                placeholder="ایمیل جدید را مجدداً وارد کنید"
                className={emailErrors.confirmEmail ? 'border-red-500' : ''}
              />
              {emailErrors.confirmEmail && (
                <p className="text-sm text-red-600">{emailErrors.confirmEmail}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isEmailSubmitting}
                className="min-w-32"
              >
                {isEmailSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    تغییر ایمیل
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 