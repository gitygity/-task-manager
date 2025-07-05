import { Outlet } from 'react-router-dom'
import { NavigationMenu, UserMenu } from '@/components/navigation/NavigationMenu'
import { Card } from '@/components/ui/card'
import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function UserLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">
                T
              </div>
              <span className="text-xl font-bold text-foreground">TaskManager</span>
            </div>

            {/* Navigation */}
            <NavigationMenu variant="horizontal" className="hidden md:flex" />

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tasks & projects..."
                  className="w-64 pl-10"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>

              {/* User Menu */}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden border-b bg-background">
        <div className="container mx-auto px-4 py-2">
          <NavigationMenu variant="horizontal" className="overflow-x-auto" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="min-h-[calc(100vh-12rem)] shadow-lg">
          <div className="p-6">
            <Outlet />
          </div>
        </Card>
      </main>
    </div>
  )
} 