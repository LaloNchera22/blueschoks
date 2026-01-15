import { create } from 'zustand'

export type DesignState = {
  bg_color: string
  title_text: string
  subtitle_text: string
  title_color: string
  font: string
  card_style: string
}

type ElementType = 'global' | 'text:title' | 'text:subtitle'

interface EditorState {
  // Design State
  design: DesignState
  setDesign: (design: Partial<DesignState>) => void

  // Selection State
  selectedElement: ElementType
  setSelectedElement: (element: ElementType) => void

  // UI State
  isSaving: boolean
  setIsSaving: (saving: boolean) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  design: {
    bg_color: "#ffffff",
    title_text: "Colección",
    subtitle_text: "Nuevos lanzamientos disponibles",
    title_color: "#000000",
    font: "Inter, sans-serif",
    card_style: "minimal"
  },
  setDesign: (newDesign) => set((state) => ({ design: { ...state.design, ...newDesign } })),

  selectedElement: 'global',
  setSelectedElement: (element) => set({ selectedElement: element }),

  isSaving: false,
  setIsSaving: (saving) => set({ isSaving: saving })
}))
