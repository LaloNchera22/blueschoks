'use client';

import React from 'react';
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CaseUpper,
  CaseLower,
  Minus,
  Plus
} from 'lucide-react';
import { DesignConfig, TextStyle } from '@/lib/types/design-system';
import { FontPicker } from '../font-picker';
import { ColorCircle } from '../color-circle';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

interface TextEditorDrawerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentStyle: TextStyle;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (key: keyof TextStyle, value: any) => void;
  defaultFont: string;
  defaultColor: string;
  textValue?: string;
  onTextChange?: (value: string) => void;
  inputType?: 'input' | 'textarea';
  inputLabel?: string;
}

export function TextEditorDrawer({
  currentStyle,
  onUpdate,
  defaultFont,
  defaultColor,
  textValue,
  onTextChange,
  inputType = 'input',
  inputLabel
}: TextEditorDrawerProps) {

  const currentFont = currentStyle.fontFamily || defaultFont;
  const currentColor = currentStyle.color || defaultColor;
  const currentSize = currentStyle.size || 16;
  const isUppercase = currentStyle.uppercase || false;

  return (
    <div className="flex flex-col gap-6">

      {/* 0. Text Content (Optional) */}
      {onTextChange && (
        <div className="space-y-3">
          {inputLabel && (
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{inputLabel}</label>
          )}
          {inputType === 'textarea' ? (
             <textarea
               value={textValue || ''}
               onChange={(e) => onTextChange(e.target.value)}
               className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
               rows={3}
               placeholder="Escribe tu mensaje..."
             />
          ) : (
             <input
               type="text"
               value={textValue || ''}
               onChange={(e) => onTextChange(e.target.value)}
               className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
               placeholder="Escribe aquí..."
             />
          )}
        </div>
      )}

      {/* 1. Font Family & Size */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipografía</label>
        <div className="flex gap-3">
           <div className="flex-1">
             <FontPicker
               value={currentFont}
               onChange={(val) => onUpdate('fontFamily', val)}
               className="w-full h-12 text-base px-4 justify-between"
             />
           </div>
        </div>
      </div>

      {/* 2. Size Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tamaño</label>
          <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">{currentSize}px</span>
        </div>
        <div className="flex items-center gap-4">
           <button
             onClick={() => onUpdate('size', Math.max(10, currentSize - 1))}
             className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
           >
             <Minus className="w-4 h-4" />
           </button>
           <Slider
             value={currentSize}
             min={10}
             max={100}
             step={1}
             onValueChange={(val) => onUpdate('size', val)}
             className="flex-1"
           />
           <button
             onClick={() => onUpdate('size', Math.min(100, currentSize + 1))}
             className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
           >
             <Plus className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* 3. Style Toggles (The "Canva" row) */}
      <div className="space-y-3">
         <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estilo</label>
         <div className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100">
            {/* Bold */}
            <button
              onClick={() => onUpdate('bold', !currentStyle.bold)}
              className={cn(
                "flex-1 h-10 rounded-lg flex items-center justify-center transition-all",
                currentStyle.bold ? "bg-black text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"
              )}
            >
              <Bold className="w-5 h-5" />
            </button>

            {/* Italic */}
            <button
              onClick={() => onUpdate('italic', !currentStyle.italic)}
              className={cn(
                "flex-1 h-10 rounded-lg flex items-center justify-center transition-all",
                currentStyle.italic ? "bg-black text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"
              )}
            >
              <Italic className="w-5 h-5" />
            </button>

            {/* Uppercase */}
            <button
              onClick={() => onUpdate('uppercase', !isUppercase)}
              className={cn(
                "flex-1 h-10 rounded-lg flex items-center justify-center transition-all",
                isUppercase ? "bg-black text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"
              )}
            >
              {isUppercase ? <CaseLower className="w-5 h-5" /> : <CaseUpper className="w-5 h-5" />}
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Alignments */}
            {(['left', 'center', 'right'] as const).map((align) => (
               <button
                 key={align}
                 onClick={() => onUpdate('align', align)}
                 className={cn(
                   "flex-1 h-10 rounded-lg flex items-center justify-center transition-all",
                   currentStyle.align === align ? "bg-white text-black shadow-sm ring-1 ring-gray-200" : "text-gray-400 hover:text-gray-600"
                 )}
               >
                 {align === 'left' && <AlignLeft className="w-5 h-5" />}
                 {align === 'center' && <AlignCenter className="w-5 h-5" />}
                 {align === 'right' && <AlignRight className="w-5 h-5" />}
               </button>
            ))}
         </div>
      </div>

      {/* 4. Color */}
      <div className="space-y-3">
         <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Color</label>
         <div className="flex gap-4 items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
            <ColorCircle
              color={currentColor}
              onChange={(c) => onUpdate('color', c)}
              size="lg"
            />
            <span className="text-sm text-gray-600 font-medium">
               Selecciona un color
            </span>
         </div>
      </div>

    </div>
  );
}
