import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Palette, 
  Bell, 
  RotateCcw,
  Download,
  Upload,
  Loader2
} from 'lucide-react'
import { usePreferencesStore } from '@/features/auth/preferencesStore'
import type { UserPreferences } from '@/features/auth/types'

export default function ProfilePreferencesPage() {
  const { 
    preferences, 
    updatePreference, 
    resetToDefaults,
    exportPreferences,
    importPreferences
  } = usePreferencesStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handlePreferenceChange = async <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await updatePreference(key, value)
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'تنظیمات با موفقیت ذخیره شد' })
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'خطا در ذخیره تنظیمات' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = async () => {
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await resetToDefaults()
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'تنظیمات به حالت پیش‌فرض بازگردانده شد' })
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'خطا در بازگردانی تنظیمات' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExport = () => {
    try {
      const data = exportPreferences()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'preferences.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setMessage({ type: 'success', text: 'تنظیمات با موفقیت دانلود شد' })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'خطا در دانلود تنظیمات' 
      })
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const result = await importPreferences(text)
        
        if (result.error) {
          setMessage({ type: 'error', text: result.error })
        } else {
          setMessage({ type: 'success', text: 'تنظیمات با موفقیت بازیابی شد' })
        }
      } catch (error) {
        setMessage({ 
          type: 'error', 
          text: 'خطا در بازیابی تنظیمات' 
        })
      }
    }
    
    input.click()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">تنظیمات</h1>
        <p className="text-gray-600 mt-2">سفارشی‌سازی تجربه کاربری و ترجیحات شخصی</p>
      </div>

      {/* Message */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            ظاهر و نمایش
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">تم رنگی</Label>
              <p className="text-sm text-gray-500">انتخاب حالت روشن، تاریک یا سیستم</p>
            </div>
            <Select
              value={preferences.theme}
              onValueChange={(value: UserPreferences['theme']) => 
                handlePreferenceChange('theme', value)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">روشن</SelectItem>
                <SelectItem value="dark">تاریک</SelectItem>
                <SelectItem value="system">سیستم</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Language */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">زبان</Label>
              <p className="text-sm text-gray-500">زبان رابط کاربری</p>
            </div>
            <Select
              value={preferences.language}
              onValueChange={(value: UserPreferences['language']) => 
                handlePreferenceChange('language', value)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fa">فارسی</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            اعلان‌ها
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">اعلان‌های ایمیل</Label>
              <p className="text-sm text-gray-500">دریافت اعلان‌ها از طریق ایمیل</p>
            </div>
            <Switch
              checked={preferences.notifications.email}
              onCheckedChange={(checked) => 
                handlePreferenceChange('notifications', {
                  ...preferences.notifications,
                  email: checked
                })
              }
              disabled={isSubmitting}
            />
          </div>

          <Separator />

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">اعلان‌های فوری</Label>
              <p className="text-sm text-gray-500">اعلان‌های push در مرورگر</p>
            </div>
            <Switch
              checked={preferences.notifications.push}
              onCheckedChange={(checked) => 
                handlePreferenceChange('notifications', {
                  ...preferences.notifications,
                  push: checked
                })
              }
              disabled={isSubmitting}
            />
          </div>

          <Separator />

          {/* Task Reminders */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">یادآوری تسک‌ها</Label>
              <p className="text-sm text-gray-500">یادآوری برای سررسید تسک‌ها</p>
            </div>
            <Switch
              checked={preferences.notifications.taskReminders}
              onCheckedChange={(checked) => 
                handlePreferenceChange('notifications', {
                  ...preferences.notifications,
                  taskReminders: checked
                })
              }
              disabled={isSubmitting}
            />
          </div>

          <Separator />

          {/* Project Updates */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">به‌روزرسانی پروژه‌ها</Label>
              <p className="text-sm text-gray-500">اعلان برای تغییرات پروژه‌ها</p>
            </div>
            <Switch
              checked={preferences.notifications.projectUpdates}
              onCheckedChange={(checked) => 
                handlePreferenceChange('notifications', {
                  ...preferences.notifications,
                  projectUpdates: checked
                })
              }
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            تنظیمات عمومی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Format */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">فرمت تاریخ</Label>
              <p className="text-sm text-gray-500">نحوه نمایش تاریخ در سیستم</p>
            </div>
            <Select
              value={preferences.dateFormat}
              onValueChange={(value: UserPreferences['dateFormat']) => 
                handlePreferenceChange('dateFormat', value)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yyyy/mm/dd">سال/ماه/روز</SelectItem>
                <SelectItem value="dd/mm/yyyy">روز/ماه/سال</SelectItem>
                <SelectItem value="mm/dd/yyyy">ماه/روز/سال</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Default Task Priority */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">اولویت پیش‌فرض تسک</Label>
              <p className="text-sm text-gray-500">اولویت پیش‌فرض برای تسک‌های جدید</p>
            </div>
            <Select
              value={preferences.defaultTaskPriority}
              onValueChange={(value: UserPreferences['defaultTaskPriority']) => 
                handlePreferenceChange('defaultTaskPriority', value)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">کم</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="high">زیاد</SelectItem>
                <SelectItem value="urgent">فوری</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Kanban Auto Refresh */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">به‌روزرسانی خودکار کانبان</Label>
              <p className="text-sm text-gray-500">به‌روزرسانی خودکار تابلوی کانبان</p>
            </div>
            <Switch
              checked={preferences.kanbanAutoRefresh}
              onCheckedChange={(checked) => 
                handlePreferenceChange('kanbanAutoRefresh', checked)
              }
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            پشتیبان‌گیری و بازیابی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isSubmitting}
              className="flex-1 min-w-48"
            >
              <Download className="h-4 w-4 mr-2" />
              دانلود تنظیمات
            </Button>
            
            <Button
              variant="outline"
              onClick={handleImport}
              disabled={isSubmitting}
              className="flex-1 min-w-48"
            >
              <Upload className="h-4 w-4 mr-2" />
              بازیابی تنظیمات
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleReset}
              disabled={isSubmitting}
              className="flex-1 min-w-48"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4 mr-2" />
              )}
              بازگردانی به پیش‌فرض
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 