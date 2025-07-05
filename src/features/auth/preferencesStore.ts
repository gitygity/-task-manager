import { create } from 'zustand'
import { preferencesService } from './services/preferencesService'
import type { UserPreferences, PreferencesState } from './types'

interface PreferencesStore extends PreferencesState {
  // Actions
  initialize: () => Promise<void>
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<{ error?: string }>
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => Promise<{ error?: string }>
  resetToDefaults: () => Promise<{ error?: string }>
  exportPreferences: () => string
  importPreferences: (data: string) => Promise<{ error?: string }>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  preferences: preferencesService.getDefaults(),
  loading: false,
  error: null,

  // Initialize preferences from localStorage
  initialize: async () => {
    set({ loading: true, error: null })
    
    try {
      const preferences = preferencesService.getPreferences()
      set({ preferences, loading: false })
      
      // Apply theme immediately
      applyTheme(preferences.theme)
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load preferences',
        loading: false 
      })
    }
  },

  // Update multiple preferences
  updatePreferences: async (updates: Partial<UserPreferences>) => {
    const current = get().preferences
    const updated = { ...current, ...updates }
    
    set({ loading: true, error: null })
    
    try {
      const result = await preferencesService.savePreferences(updated)
      
      if (result.error) {
        set({ error: result.error, loading: false })
        return result
      }
      
      set({ preferences: updated, loading: false })
      
      // Apply theme if it was updated
      if (updates.theme) {
        applyTheme(updates.theme)
      }
      
      return {}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update preferences'
      set({ error: errorMessage, loading: false })
      return { error: errorMessage }
    }
  },

  // Update single preference
  updatePreference: async (key, value) => {
    const current = get().preferences
    const updated = { ...current, [key]: value }
    
    set({ loading: true, error: null })
    
    try {
      const result = await preferencesService.savePreferences(updated)
      
      if (result.error) {
        set({ error: result.error, loading: false })
        return result
      }
      
      set({ preferences: updated, loading: false })
      
      // Apply theme if it was updated
      if (key === 'theme') {
        applyTheme(value as UserPreferences['theme'])
      }
      
      return {}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update preference'
      set({ error: errorMessage, loading: false })
      return { error: errorMessage }
    }
  },

  // Reset to defaults
  resetToDefaults: async () => {
    set({ loading: true, error: null })
    
    try {
      const result = await preferencesService.resetToDefaults()
      
      if (result.error) {
        set({ error: result.error, loading: false })
        return result
      }
      
      const defaults = preferencesService.getDefaults()
      set({ preferences: defaults, loading: false })
      
      // Apply default theme
      applyTheme(defaults.theme)
      
      return {}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset preferences'
      set({ error: errorMessage, loading: false })
      return { error: errorMessage }
    }
  },

  // Export preferences
  exportPreferences: () => {
    return preferencesService.exportPreferences()
  },

  // Import preferences
  importPreferences: async (data: string) => {
    set({ loading: true, error: null })
    
    try {
      const result = await preferencesService.importPreferences(data)
      
      if (result.error) {
        set({ error: result.error, loading: false })
        return result
      }
      
      const preferences = preferencesService.getPreferences()
      set({ preferences, loading: false })
      
      // Apply imported theme
      applyTheme(preferences.theme)
      
      return {}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import preferences'
      set({ error: errorMessage, loading: false })
      return { error: errorMessage }
    }
  },

  // Set loading state
  setLoading: (loading: boolean) => set({ loading }),

  // Set error state
  setError: (error: string | null) => set({ error }),
}))

// Helper function to apply theme
function applyTheme(theme: UserPreferences['theme']) {
  const root = document.documentElement
  
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    // System theme
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
} 