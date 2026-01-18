import { create } from 'zustand'
import { ThemeConfig, DEFAULT_THEME_CONFIG } from '@/lib/types/theme-config'
import { produce } from 'immer'

// Helper to update nested objects safely (using immer for immutability and simplicity)
// If we don't want to install immer, we can stick to the manual way, but immer is standard in React apps.
// The user asked for "updateThemeConfig(path, value) que actualice profundamente".
// Since I can't easily install packages if they aren't there (I can but it takes time), I'll stick to a manual deep merge helper or the previous one.
// The previous one `setNestedValue` was a bit risky with JSON.parse/stringify (loses functions, dates, etc - though config is JSON serializable).
// Let's improve the manual helper.

function setNestedValue<T>(obj: T, path: string, value: any): T {
    const keys = path.split('.')
    const lastKey = keys.pop()
    if (!lastKey) return obj

    // Shallow copy top level
    const newObj = { ...obj }
    let current: any = newObj

    // Iterate and shallow copy down the path
    for (const key of keys) {
      if (!current[key]) {
          current[key] = {}
      }
      current[key] = { ...current[key] } // Shallow copy this level
      current = current[key]
    }

    current[lastKey] = value
    return newObj
}

export type SelectedComponentType =
  | 'global_bg'
  | 'header_title'
  | 'header_subtitle' // Added for completeness
  | 'header_bio'
  | 'product_card'

interface EditorState {
  // Theme Config
  theme: ThemeConfig

  // Actions
  updateThemeConfig: (path: string, value: any) => void
  setFullThemeConfig: (config: ThemeConfig) => void

  // Selection
  selectedComponent: SelectedComponentType
  setSelectedComponent: (component: SelectedComponentType) => void

  // UI State
  isSaving: boolean
  setIsSaving: (saving: boolean) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  theme: DEFAULT_THEME_CONFIG,

  updateThemeConfig: (path, value) => set((state) => ({
    theme: setNestedValue(state.theme, path, value)
  })),

  setFullThemeConfig: (config) => set({ theme: config }),

  selectedComponent: 'global_bg',
  setSelectedComponent: (component) => set({ selectedComponent: component }),

  isSaving: false,
  setIsSaving: (saving) => set({ isSaving: saving })
}))
