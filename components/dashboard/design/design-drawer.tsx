'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface DesignDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function DesignDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  className
}: DesignDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className={cn(
          "max-h-[85vh] overflow-y-auto rounded-t-[20px] px-0 pb-0",
          className
        )}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2 mb-4" /> {/* Drag Handle Visual */}

        {(title || description) && (
          <SheetHeader className="px-6 mb-4 text-left">
            {title && <SheetTitle className="text-xl font-bold">{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}

        <div className="px-6 pb-8 safe-area-bottom">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
