import { Outlet } from 'react-router-dom'
import { NavigationMenu, UserMenu } from '@/components/navigation/NavigationMenu'
import { Card } from '@/components/ui/card'
import { Bell, Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900 dark:to-pink-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center gap-2">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle sidebar</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="p-6 border-b">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-red-600 flex items-center justify-center text-white font-bold">
                        T
                      </div>
                      <span className="text-xl font-bold text-foreground">TaskManager</span>
                    </div>
                    <Badge variant="destructive" className="mt-2">
                      Admin Panel
                    </Badge>
                  </div>
                  <div className="p-4">
                    <NavigationMenu variant="sidebar" />
                  </div>
                </SheetContent>
              </Sheet>
              
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-red-600 flex items-center justify-center text-white font-bold">
                  T
                </div>
                <span className="text-xl font-bold text-foreground">TaskManager</span>
                <Badge variant="destructive" className="ml-2">
                  Admin Panel
                </Badge>
              </div>
            </div>

            {/* Desktop Navigation */}
            <NavigationMenu variant="horizontal" className="hidden lg:flex" />

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search admin panel..."
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

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16">
          <div className="flex flex-col bg-background/95 backdrop-blur border-r min-h-full">
            <div className="p-6 border-b">
              <Badge variant="destructive" className="w-full justify-center">
                Administrator Dashboard
              </Badge>
            </div>
            <nav className="flex-1 p-4">
              <NavigationMenu variant="sidebar" />
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8">
          <Card className="min-h-[calc(100vh-8rem)] shadow-lg">
            <div className="p-6">
              <Outlet />
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
} 