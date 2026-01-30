interface SizeSelectorProps {
    size: string
    path: string
    updateThemeConfig: (path: string, value: any) => void
}

export const SizeSelector = ({ size, path, updateThemeConfig }: SizeSelectorProps) => {
     // Simplificación de tamaños
     const sizes = ['sm', 'base', 'lg', 'xl', '2xl', '3xl']
     const currentIndex = sizes.indexOf(size) >= 0 ? sizes.indexOf(size) : 1

     return (
        <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-200">
             <button
                onClick={() => updateThemeConfig(path, sizes[Math.max(0, currentIndex - 1)])}
                className="w-6 h-8 flex items-center justify-center hover:bg-white rounded text-xs font-bold"
             >-</button>
             <span className="text-[10px] w-8 text-center uppercase">{size}</span>
             <button
                onClick={() => updateThemeConfig(path, sizes[Math.min(sizes.length - 1, currentIndex + 1)])}
                className="w-6 h-8 flex items-center justify-center hover:bg-white rounded text-xs font-bold"
             >+</button>
        </div>
     )
}

export default SizeSelector;
