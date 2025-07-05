import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Calendar, Shield, Save, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/features/auth'
import { useUpdateProfile } from '@/features/auth/hooks'
import type { UpdateProfileData } from '@/features/auth/services/authService'

interface ProfileFormData {
  fullName: string
  email: string
}

export default function ProfileSettingsPage() {
  const { user } = useAuthStore()
  const updateProfile = useUpdateProfile()
  
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    email: '',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.user_metadata?.full_name || '',
        email: user.email,
      })
    }
  }, [user])

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setMessage(null) // Clear messages when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const profileData: UpdateProfileData = {
        full_name: formData.fullName.trim(),
      }

      const response = await updateProfile.mutateAsync(profileData)
      
      if (response.error) {
        setMessage({ type: 'error', text: response.error })
      } else {
        setMessage({ type: 'success', text: 'پروفایل با موفقیت به‌روزرسانی شد' })
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'خطا در به‌روزرسانی پروفایل' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasChanges = user && (
    formData.fullName !== (user.user_metadata?.full_name || '') ||
    formData.email !== user.email
  )

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
        <h1 className="text-3xl font-bold text-gray-900">تنظیمات پروفایل</h1>
        <p className="text-gray-600 mt-2">مدیریت اطلاعات شخصی و تنظیمات حساب کاربری</p>
      </div>

      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            اطلاعات شخصی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message */}
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">نام کامل</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="نام کامل خود را وارد کنید"
                maxLength={100}
              />
            </div>

            {/* Email (Read-only for now) */}
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-50"
                />
                <Badge variant="secondary" className="absolute left-3 top-1/2 -translate-y-1/2">
                  غیرقابل تغییر
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                برای تغییر ایمیل، از بخش امنیت استفاده کنید
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!hasChanges || isSubmitting}
                className="min-w-32"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    ذخیره تغییرات
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            اطلاعات حساب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User ID */}
            <div>
              <Label className="text-sm font-medium text-gray-700">شناسه کاربر</Label>
              <div className="mt-1 text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded border">
                {user.id}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label className="text-sm font-medium text-gray-700">ایمیل</Label>
              <div className="mt-1 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
            </div>

            {/* Created At */}
            <div>
              <Label className="text-sm font-medium text-gray-700">تاریخ ایجاد حساب</Label>
              <div className="mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {new Date(user.created_at).toLocaleDateString('fa-IR')}
                </span>
              </div>
            </div>

            {/* Updated At */}
            <div>
              <Label className="text-sm font-medium text-gray-700">آخرین به‌روزرسانی</Label>
              <div className="mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {new Date(user.updated_at).toLocaleDateString('fa-IR')}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* User Role */}
          <div>
            <Label className="text-sm font-medium text-gray-700">نقش کاربر</Label>
            <div className="mt-2">
              <Badge variant="outline" className="text-sm">
                {user.user_metadata?.role === 'admin' ? 'مدیر' : 
                 user.user_metadata?.role === 'moderator' ? 'ناظر' : 'کاربر عادی'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 