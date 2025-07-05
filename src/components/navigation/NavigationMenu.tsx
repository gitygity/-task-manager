import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  CheckSquare, 
  FolderOpen, 
  Settings, 
  User, 
  Users, 
  BarChart3, 
  Shield,
  ChevronDown,
  LogOut,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/features/auth'
import { ROUTE_PATHS } from '@/routes/constants'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  getBadge?: (counts: { tasks: number; projects: number }) => string | undefined
  adminOnly?: boolean
}

function useNavigationCounts() {
  // For now, return mock counts
  // TODO: Implement actual counts when task/project hooks are stable
  return {
    tasks: 5,
    projects: 3
  }
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: ROUTE_PATHS.private.dashboard,
    icon: Home,
  },
  {
    label: 'Tasks',
    href: ROUTE_PATHS.private.tasks.list,
    icon: CheckSquare,
    getBadge: (counts) => counts.tasks > 0 ? counts.tasks.toString() : undefined
  },
  {
    label: 'Projects',
    href: ROUTE_PATHS.private.projects.list,
    icon: FolderOpen,
    getBadge: (counts) => counts.projects > 0 ? counts.projects.toString() : undefined
  },
  {
    label: 'Users',
    href: ROUTE_PATHS.private.admin.users,
    icon: Users,
    adminOnly: true
  },
  {
    label: 'Analytics',
    href: ROUTE_PATHS.private.admin.analytics,
    icon: BarChart3,
    adminOnly: true
  }
]

interface NavigationMenuProps {
  variant?: 'horizontal' | 'sidebar'
  className?: string
}

export function NavigationMenu({ variant = 'horizontal', className }: NavigationMenuProps) {
  const location = useLocation()
  const { user } = useAuthStore()
  const isAdmin = user?.user_metadata?.role === 'admin'
  const counts = useNavigationCounts()

  const filteredItems = navigationItems.filter(item => !item.adminOnly || isAdmin)

  if (variant === 'sidebar') {
    return (
      <nav className={cn('space-y-2', className)}>
        {filteredItems.map((item, index) => {
          const isActive = location.pathname === item.href || 
                          (item.href !== ROUTE_PATHS.private.dashboard && location.pathname.startsWith(item.href))
          
          const badge = item.getBadge?.(counts)
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  'hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] hover:shadow-md',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md scale-[1.02] ring-2 ring-primary/20' 
                    : 'text-muted-foreground'
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <item.icon className="h-4 w-4" />
                </motion.div>
                <span className="flex-1">{item.label}</span>
                <AnimatePresence>
                  {badge && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Badge 
                        variant={isActive ? 'secondary' : 'outline'} 
                        className="ml-auto text-xs animate-pulse"
                      >
                        {badge}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          )
        })}
      </nav>
    )
  }

  return (
    <nav className={cn('flex items-center space-x-1', className)}>
      {filteredItems.map((item, index) => {
        const isActive = location.pathname === item.href || 
                        (item.href !== ROUTE_PATHS.private.dashboard && location.pathname.startsWith(item.href))
        
        const badge = item.getBadge?.(counts)
        
        return (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={item.href}
              className={cn(
                'group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                'hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] hover:shadow-md',
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-md scale-[1.02] ring-2 ring-primary/20' 
                  : 'text-muted-foreground'
              )}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <item.icon className="h-4 w-4" />
              </motion.div>
              <span className="hidden sm:inline">{item.label}</span>
              <AnimatePresence>
                {badge && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Badge 
                      variant={isActive ? 'secondary' : 'outline'} 
                      className="ml-1 text-xs animate-pulse"
                    >
                      {badge}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>
        )
      })}
    </nav>
  )
}

interface UserMenuProps {
  className?: string
}

export function UserMenu({ className }: UserMenuProps) {
  const { user, logout } = useAuthStore()
  const isAdmin = user?.user_metadata?.role === 'admin'

  const handleLogout = async () => {
    await logout()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn('flex items-center gap-2 transition-all duration-200 hover:scale-[1.02]', className)}>
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200',
                isAdmin 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg' 
                  : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
              )}
            >
              {user?.user_metadata?.full_name?.charAt(0) || 'U'}
            </motion.div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium">
                {user?.user_metadata?.full_name || 'User'}
              </div>
              <div className="text-xs text-muted-foreground">
                {user?.email}
              </div>
            </div>
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 shadow-lg">
        <div className="px-2 py-1.5">
          <div className="text-sm font-medium">
            {user?.user_metadata?.full_name || 'User'}
          </div>
          <div className="text-xs text-muted-foreground">
            {user?.email}
          </div>
          {isAdmin && (
            <Badge variant="destructive" className="mt-1 text-xs animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              Administrator
            </Badge>
          )}
        </div>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link to={ROUTE_PATHS.private.profile.settings} className="cursor-pointer transition-colors">
            <User className="h-4 w-4 mr-2" />
            Profile Settings
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to={ROUTE_PATHS.private.profile.preferences} className="cursor-pointer transition-colors">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Link>
        </DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={ROUTE_PATHS.private.admin.settings} className="cursor-pointer transition-colors">
                <Shield className="h-4 w-4 mr-2" />
                Admin Settings
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 