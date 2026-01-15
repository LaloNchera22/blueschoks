"use client"

import { useState } from "react"
import { Type, Palette, AlignLeft, AlignCenter, AlignRight, Check, ChevronDown, Minus, Plus, X, LayoutTemplate, Grid, Wand2, Play, Move, Bold, Italic, Underline } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { canvaFonts } from "@/components/FloatingDesignEditor"

interface ToolbarProps {
  selectedElement: string | null
  design: any
  setDesign: (design: any) => void
  onClose: () => void
  isMobile: boolean
}

export default function ContextualToolbar({ selectedElement, design, setDesign, onClose, isMobile }: ToolbarProps) {

  if (!selectedElement) {
    // STATE A: GLOBAL (Fondo, Layout, etc.) - FLOATING PILL
    return (
      <div className={`
        fixed z-50 transition-all duration-300 left-1/2 -translate-x-1/2
        ${isMobile
            ? "bottom-6"
            : "bottom-8"
        }
      `}>
          <div className="bg-white rounded-full shadow-2xl border border-slate-100 px-6 py-3 flex items-center gap-6 animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">

             {/* MAGIC BACKGROUND (Placeholder) */}
             <button className="flex flex-col items-center gap-1 group text-slate-500 hover:text-indigo-600 transition-colors">
                <div className="p-2 rounded-full bg-slate-50 group-hover:bg-indigo-50 transition-colors">
                   <Wand2 size={18} />
                </div>
                <span className="text-[10px] font-bold">Mágico</span>
             </button>

             <div className="h-8 w-px bg-slate-100"></div>

             {/* BACKGROUND COLOR */}
             <Popover>
                <PopoverTrigger asChild>
                    <button className="flex flex-col items-center gap-1 group text-slate-500 hover:text-slate-900 transition-colors">
                        <div className="w-9 h-9 rounded-full border border-slate-200 shadow-sm relative overflow-hidden transition-transform group-hover:scale-110">
                            <div className="absolute inset-0" style={{ backgroundColor: design.bg_color }} />
                        </div>
                        <span className="text-[10px] font-bold">Fondo</span>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 rounded-2xl shadow-xl border-slate-100" side="top" align="center">
                    <div className="grid grid-cols-5 gap-2">
                        {["#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#000000", "#1e293b", "#334155", "#475569", "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#f43f5e"].map(color => (
                            <button
                                key={color}
                                onClick={() => setDesign({ ...design, bg_color: color })}
                                className="w-8 h-8 rounded-full border border-slate-100 shadow-sm transition-transform hover:scale-110 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                        <div className="col-span-5 mt-2 pt-2 border-t border-slate-100">
                             <input
                                type="color"
                                className="w-full h-8 cursor-pointer rounded-md overflow-hidden"
                                value={design.bg_color}
                                onChange={(e) => setDesign({...design, bg_color: e.target.value})}
                             />
                        </div>
                    </div>
                </PopoverContent>
             </Popover>

             <div className="h-8 w-px bg-slate-100"></div>

             {/* ANIMATE (Placeholder) */}
             <button className="flex flex-col items-center gap-1 group text-slate-500 hover:text-blue-600 transition-colors">
                <div className="p-2 rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors">
                   <Play size={18} />
                </div>
                <span className="text-[10px] font-bold">Animar</span>
             </button>

             <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>

             {/* POSITION (Layout) */}
             <Popover>
                <PopoverTrigger asChild>
                    <button className="flex flex-col items-center gap-1 group text-slate-500 hover:text-slate-900 transition-colors">
                        <div className="p-2 rounded-full bg-slate-50 group-hover:bg-slate-100 transition-colors">
                            <LayoutTemplate size={18} />
                        </div>
                        <span className="text-[10px] font-bold">Diseño</span>
                    </button>
                </PopoverTrigger>
                 <PopoverContent className="w-auto p-2 rounded-2xl shadow-xl border-slate-100" side="top" align="center">
                     <div className="flex gap-2">
                        {[
                            { id: 'minimal', label: 'Minimal' },
                            { id: 'border', label: 'Borde' },
                            { id: 'shadow', label: 'Sombra' },
                        ].map((style) => (
                            <button
                                key={style.id}
                                onClick={() => setDesign({ ...design, card_style: style.id })}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    design.card_style === style.id
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {style.label}
                            </button>
                        ))}
                     </div>
                 </PopoverContent>
             </Popover>

          </div>
      </div>
    )
  }

  // STATE B: TEXT EDITING (Expanded Pill)
  return (
    <div className={`
        fixed z-50 transition-all duration-300 left-1/2 -translate-x-1/2
        ${isMobile
            ? "bottom-6 w-[90%] max-w-sm"
            : "bottom-8"
        }
    `}>
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 relative">

            {/* CLOSE BUTTON (Mobile absolute, Desktop inline usually but here floating) */}
            <button
                onClick={onClose}
                className="absolute -top-3 -right-3 bg-white text-slate-400 hover:text-red-500 rounded-full p-1.5 shadow-md border border-slate-100 transition-colors z-10"
            >
                <X size={14} />
            </button>

            {/* 1. FONT FAMILY */}
            <Popover>
                <PopoverTrigger asChild>
                    <button className="flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors min-w-[140px] sm:w-48 text-left border border-transparent hover:border-slate-200">
                        <span className="text-xs font-bold text-slate-900 truncate">
                             {canvaFonts.find(f => f.value === design.font)?.name || 'Inter'}
                        </span>
                        <ChevronDown size={14} className="text-slate-400 shrink-0" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0 max-h-60 overflow-y-auto custom-scrollbar rounded-xl shadow-xl border-slate-100" side="top" align="start">
                    <div className="p-1.5 grid gap-0.5">
                        {canvaFonts.map((font) => (
                            <button
                                key={font.name}
                                onClick={() => setDesign({...design, font: font.value})}
                                className={`px-3 py-2.5 text-left rounded-lg transition-all flex items-center justify-between text-sm ${
                                    design.font === font.value ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <span style={{ fontFamily: font.value }}>{font.name}</span>
                                {design.font === font.value && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            <div className="w-px h-8 bg-slate-100 hidden sm:block"></div>

            {/* 2. SIZE (Placeholder) & COLOR */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                 {/* SIZE */}
                 <div className="flex items-center bg-slate-50 rounded-xl px-1 h-9 border border-transparent hover:border-slate-200 transition-colors">
                    <button className="w-7 h-full flex items-center justify-center text-slate-500 hover:text-slate-900" title="Disminuir"><Minus size={12} /></button>
                    <span className="text-xs font-bold w-6 text-center text-slate-900">16</span>
                    <button className="w-7 h-full flex items-center justify-center text-slate-500 hover:text-slate-900" title="Aumentar"><Plus size={12} /></button>
                 </div>

                 {/* COLOR */}
                 <Popover>
                    <PopoverTrigger asChild>
                        <button className="w-9 h-9 rounded-full border border-slate-200 shadow-sm relative overflow-hidden transition-transform hover:scale-105" title="Color de texto">
                            <div className="absolute inset-0" style={{ backgroundColor: design.title_color }} />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3 rounded-2xl shadow-xl border-slate-100" side="top">
                        <div className="grid grid-cols-5 gap-2">
                            {["#000000", "#1e293b", "#334155", "#475569", "#ffffff", "#f8fafc", "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef"].map(color => (
                                <button
                                    key={color}
                                    onClick={() => setDesign({ ...design, title_color: color })}
                                    className="w-8 h-8 rounded-full border border-slate-100 shadow-sm transition-transform hover:scale-110"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                            <div className="col-span-5 mt-2 pt-2 border-t border-slate-100">
                                <input
                                type="color"
                                className="w-full h-8 cursor-pointer rounded-md overflow-hidden"
                                value={design.title_color}
                                onChange={(e) => setDesign({...design, title_color: e.target.value})}
                                />
                            </div>
                        </div>
                    </PopoverContent>
                 </Popover>
            </div>

            <div className="w-px h-8 bg-slate-100 hidden sm:block"></div>

            {/* 3. FORMATTING (Placeholder) */}
            <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1 h-9 border border-transparent hover:border-slate-200 transition-colors w-full sm:w-auto justify-center">
                <button className="w-8 h-full flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-600 transition-all"><Bold size={14} /></button>
                <button className="w-8 h-full flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-600 transition-all"><Italic size={14} /></button>
                <button className="w-8 h-full flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-600 transition-all"><Underline size={14} /></button>
            </div>

             {/* 4. EDIT INPUT (Mobile friendly) */}
             <div className="w-full sm:w-auto flex-1 min-w-[150px] mt-2 sm:mt-0">
                  <input
                    value={selectedElement === 'title' ? design.title_text : design.subtitle_text}
                    onChange={(e) => setDesign({
                        ...design,
                        [selectedElement === 'title' ? 'title_text' : 'subtitle_text']: e.target.value
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Escribe tu texto..."
                />
             </div>
        </div>
    </div>
  )
}
