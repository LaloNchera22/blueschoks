import { create } from 'zustand'
import { DesignConfig, DEFAULT_DESIGN_CONFIG } from '@/lib/types/design-system'

// Helper to update nested objects safely
function setNestedValue<T>(obj: T, path: string, value: any): T {
  const keys = path.split('.')
  const lastKey = keys.pop()
  if (!lastKey) return obj

  const newObj = JSON.parse(JSON.stringify(obj)) // Deep clone simplistic
  let current = newObj
  for (const key of keys) {
    if (!current[key]) current[key] = {}
    current = current[key]
  }
  current[lastKey] = value
  return newObj
}

export type DesignState = DesignConfig

// Element types mapping to the JSON structure
type ElementType =
  | 'global'
  | 'header:title'
  | 'header:subtitle'
  | 'header:bio'
  | 'header:avatar'
  | 'cards:globalDefaults'

interface EditorState {
  // Design State
  design: DesignConfig
  // Replace the simple setDesign with a granular update
  updateConfig: (path: string, value: any) => void
  // Allow full replacement for initial load
  setFullConfig: (config: DesignConfig) => void

  // Selection State
  selectedElement: ElementType
  setSelectedElement: (element: ElementType) => void

  // UI State
  isSaving: boolean
  setIsSaving: (saving: boolean) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  design: DEFAULT_DESIGN_CONFIG,

  updateConfig: (path, value) => set((state) => ({
    design: setNestedValue(state.design, path, value)
  })),

  setFullConfig: (config) => set({ design: config }),

  selectedElement: 'global',
  setSelectedElement: (element) => set({ selectedElement: element }),

  isSaving: false,
  setIsSaving: (saving) => set({ isSaving: saving })
}))
