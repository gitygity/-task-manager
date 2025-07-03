import { Suspense } from 'react'
import LoadingSpinner from '../routes/components/LoadingSpinner'

interface PublicLayoutProps {
  children: React.ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <h1 className="flex items-center text-xl font-bold">Task Manager</h1>
          </div>
        </div>
      </header>
      <main>
        <Suspense fallback={<LoadingSpinner size="md" message="Loading..." />}>
          {children}
        </Suspense>
      </main>
    </div>
  )
} 