import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../routes/components/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders loading spinner without message', () => {
    render(<LoadingSpinner />)
    
    // Check if spinner icon is present
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toBeInTheDocument()
  })

  it('renders with custom message', () => {
    const customMessage = 'Please wait...'
    render(<LoadingSpinner message={customMessage} />)
    
    // Check if custom message is present
    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />)
    
    let spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('h-4', 'w-4')
    
    rerender(<LoadingSpinner size="md" />)
    spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('h-8', 'w-8')
    
    rerender(<LoadingSpinner size="lg" />)
    spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('h-12', 'w-12')
  })

  it('renders fullScreen version correctly', () => {
    render(<LoadingSpinner fullScreen={true} />)
    
    // Check if fullScreen wrapper is present
    const fullScreenWrapper = screen.getByTestId('loading-spinner').closest('.min-h-screen')
    expect(fullScreenWrapper).toBeInTheDocument()
  })

  it('renders inline version correctly', () => {
    render(<LoadingSpinner fullScreen={false} />)
    
    // Check if fullScreen wrapper is NOT present
    const fullScreenWrapper = screen.getByTestId('loading-spinner').closest('.min-h-screen')
    expect(fullScreenWrapper).not.toBeInTheDocument()
  })

  it('has correct CSS classes', () => {
    render(<LoadingSpinner />)
    
    // Check if container has correct classes
    const container = screen.getByTestId('loading-spinner').parentElement
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
  })
}) 