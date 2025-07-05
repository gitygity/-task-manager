import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { useAuthStore } from '../features/auth'
import LoadingSpinner from '../routes/components/LoadingSpinner'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const navigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tasks", label: "Tasks" },
]

export default function DashboardLayout() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">Task Manager</h1>
            
            {/* Generic Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigationItems.map((item) => (
                <a 
                  key={item.href}
                  href={item.href} 
                  className={cn(
                    "text-muted-foreground hover:text-foreground hover:bg-accent",
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <span className="text-muted-foreground">Welcome, </span>
                <span className="font-medium">{user?.user_metadata?.full_name || 'Guest'}</span>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-muted-foreground text-sm font-medium">
                    {user?.user_metadata?.full_name?.charAt(0) || '?'}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">Guest</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingSpinner message="Loading dashboard..." />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
} 