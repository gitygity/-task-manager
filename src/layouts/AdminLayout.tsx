import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { useAuthStore } from '../features/auth'
import LoadingSpinner from '../routes/components/LoadingSpinner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    section: "Dashboard",
    items: [
      { href: "/dashboard", label: "Overview", icon: "📊" },
      { href: "/admin/analytics", label: "Analytics", icon: "📈" },
    ]
  },
  {
    section: "Management", 
    items: [
      { href: "/admin/users", label: "Users", icon: "👥" },
      { href: "/tasks", label: "All Tasks", icon: "✅" },
      { href: "/projects", label: "All Projects", icon: "📁" },
    ]
  },
  {
    section: "Settings",
    items: [
      { href: "/admin/settings", label: "System Settings", icon: "⚙️" },
      { href: "/profile/settings", label: "Profile", icon: "👤" },
    ]
  }
]

const adminStats = [
  { value: "24", label: "Users", color: "text-blue-600" },
  { value: "156", label: "Tasks", color: "text-green-600" }, 
  { value: "12", label: "Projects", color: "text-purple-600" },
]

export default function AdminLayout() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-background flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-card border-r flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-bold text-center pb-4">
            Admin Panel
          </h2>
          <Separator />
        </div>
        
        <nav className="px-4 space-y-6">
          {navigationItems.map((section) => (
            <div key={section.section}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {section.section}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <a 
                      href={item.href} 
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                        "text-muted-foreground hover:text-foreground hover:bg-accent",
                        "transition-colors duration-200"
                      )}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <header className="bg-background border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Welcome back, Administrator</p>
              </div>

              {/* Admin Stats */}
              <div className="flex items-center space-x-6">
                {adminStats.map((stat) => (
                  <Card key={stat.label} className="text-center p-3">
                    <CardContent className="p-0">
                      <div className={cn("text-2xl font-bold", stat.color)}>{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
                
                <Separator orientation="vertical" className="h-12" />
                
                {/* Admin Profile */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-destructive rounded-full flex items-center justify-center">
                    <span className="text-destructive-foreground text-sm font-bold">
                      {user?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{user?.name || 'Admin'}</div>
                    <Badge variant="destructive" className="text-xs">Administrator</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-muted/30">
          <Suspense fallback={<LoadingSpinner message="Loading content..." />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
} 