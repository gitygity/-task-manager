import type { UserPreferences } from '../types'

const PREFERENCES_KEY = 'user-preferences'

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'fa',
  notifications: {
    email: true,
    push: true,
    taskReminders: true,
    projectUpdates: true,
  },
  dateFormat: 'yyyy/mm/dd',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  defaultTaskPriority: 'medium',
  kanbanAutoRefresh: true,
}

export const preferencesService = {
  // Get user preferences from localStorage
  getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY)
      if (!stored) {
        return defaultPreferences
      }
      
      const parsed = JSON.parse(stored)
      
      // Merge with defaults to ensure all properties exist
      return {
        ...defaultPreferences,
        ...parsed,
        notifications: {
          ...defaultPreferences.notifications,
          ...parsed.notifications,
        },
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
      return defaultPreferences
    }
  },

  // Save user preferences to localStorage
  async savePreferences(preferences: UserPreferences): Promise<{ error?: string }> {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences))
      return {}
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Failed to save preferences' 
      }
    }
  },

  // Update specific preference
  async updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): Promise<{ error?: string }> {
    try {
      const current = this.getPreferences()
      const updated = { ...current, [key]: value }
      return await this.savePreferences(updated)
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Failed to update preference' 
      }
    }
  },

  // Reset to defaults
  async resetToDefaults(): Promise<{ error?: string }> {
    try {
      localStorage.removeItem(PREFERENCES_KEY)
      return {}
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Failed to reset preferences' 
      }
    }
  },

  // Get default preferences
  getDefaults(): UserPreferences {
    return { ...defaultPreferences }
  },

  // Export preferences
  exportPreferences(): string {
    const preferences = this.getPreferences()
    return JSON.stringify(preferences, null, 2)
  },

  // Import preferences
  async importPreferences(data: string): Promise<{ error?: string }> {
    try {
      const parsed = JSON.parse(data) as UserPreferences
      
      // Validate the structure
      const valid = this.validatePreferences(parsed)
      if (!valid) {
        return { error: 'Invalid preferences format' }
      }
      
      return await this.savePreferences(parsed)
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Failed to import preferences' 
      }
    }
  },

  // Validate preferences object
  validatePreferences(preferences: unknown): preferences is UserPreferences {
    try {
      return (
        typeof preferences === 'object' &&
        preferences !== null &&
        typeof (preferences as Record<string, unknown>).theme === 'string' &&
        typeof (preferences as Record<string, unknown>).language === 'string' &&
        typeof (preferences as Record<string, unknown>).notifications === 'object' &&
        typeof (preferences as Record<string, unknown>).dateFormat === 'string' &&
        typeof (preferences as Record<string, unknown>).timezone === 'string' &&
        typeof (preferences as Record<string, unknown>).defaultTaskPriority === 'string' &&
        typeof (preferences as Record<string, unknown>).kanbanAutoRefresh === 'boolean'
      )
    } catch {
      return false
    }
  },
} 