import { create } from 'zustand'
import { ThemeConfig, DEFAULT_THEME_CONFIG } from '@/lib/types/theme-config'

// Helper to update nested objects safely (using immer for immutability and simplicity)
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
  | 'header_subtitle'
  | 'header_bio'
  | 'product_card'
  | 'card_title'
  | 'card_price'
  | 'card_qty'
  | 'card_add_btn'

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
