'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Check, ChevronDown } from 'lucide-react';
import { GOOGLE_FONTS_LIST, loadGoogleFont } from '@/utils/font-loader';
import { cn } from '@/lib/utils';

interface FontPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const FontOption = ({ font, isSelected, onClick }: { font: string, isSelected: boolean, onClick: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadGoogleFont(font);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [font]);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors rounded-lg",
        isSelected && "bg-blue-50 text-blue-600"
      )}
      style={{ fontFamily: font }}
    >
      <span className="text-base truncate">{font}</span>
      {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
    </button>
  );
};

export function FontPicker({ value, onChange, className }: FontPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Reset visible count on search change
  useEffect(() => {
    setVisibleCount(50);
  }, [search]);

  const filteredFonts = GOOGLE_FONTS_LIST.filter(font =>
    font.toLowerCase().includes(search.toLowerCase())
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 200) {
      setVisibleCount((prev) => Math.min(prev + 50, filteredFonts.length));
    }
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-28 px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all shadow-sm"
        title={value}
      >
        <span className="truncate flex-1 text-left">{value || 'Fuente'}</span>
        <ChevronDown className="w-3 h-3 text-gray-400 ml-2 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 max-w-[90vw] bg-white rounded-xl shadow-xl border border-gray-100 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[400px]">
          <div className="p-3 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="relative">
              <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar fuente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black/5"
                autoFocus
              />
            </div>
          </div>

          <div
            className="overflow-y-auto flex-1 p-1 custom-scrollbar"
            onScroll={handleScroll}
          >
             {filteredFonts.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-400">
                   No se encontraron fuentes
                </div>
             ) : (
                filteredFonts.slice(0, visibleCount).map((font) => (
                  <FontOption
                    key={font}
                    font={font}
                    isSelected={value === font}
                    onClick={() => {
                      onChange(font);
                      setIsOpen(false);
                    }}
                  />
                ))
             )}
          </div>
        </div>
      )}
    </div>
  );
}
