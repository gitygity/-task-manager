// Shared loading spinner component with shadcn styling
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  message?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'lg', 
  fullScreen = true,
  message,
  className 
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <Loader2 
        data-testid="loading-spinner"
        className={cn("animate-spin text-primary", sizes[size])} 
      />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {content}
      </div>
    )
  }

  return content
} 