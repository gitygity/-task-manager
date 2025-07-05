import { useAuth, useLogout } from '@/features/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LogOut } from 'lucide-react'

export function Header() {
  const { user, isAuthenticated } = useAuth()
  const logout = useLogout()

  const handleLogout = async () => {
    try {
      await logout.mutateAsync()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const userInitials = getInitials(
    user.user_metadata?.full_name || user.email || 'کاربر'
  )

  return (
    <Card className="mb-6">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {userInitials}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">
              {user.user_metadata?.full_name || 'کاربر'}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          disabled={logout.isPending}
          className="flex items-center space-x-2 space-x-reverse"
        >
          <LogOut className="h-4 w-4" />
          <span>{logout.isPending ? 'در حال خروج...' : 'خروج'}</span>
        </Button>
      </CardContent>
    </Card>
  )
} 