import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll } from 'vitest'

// Clean up after each test
afterEach(() => {
  cleanup()
})

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    root = null
    rootMargin = ''
    thresholds = []
    
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
    takeRecords() { return [] }
  } as unknown as typeof IntersectionObserver

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  }

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  })
})

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_APP_NAME: 'Task Manager',
    VITE_APP_VERSION: '1.0.0',
    VITE_APP_ENV: 'test',
    DEV: false,
    PROD: false,
    SSR: false,
    MODE: 'test',
    BASE_URL: '/',
  },
  writable: true,
}) 