interface ColorSelectorProps {
    color: string
    path: string
    label?: string
    updateThemeConfig: (path: string, value: any) => void
}

export const ColorSelector = ({ color, path, label, updateThemeConfig }: ColorSelectorProps) => (
    <div className="flex flex-col items-center gap-1 group relative">
        <div className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 relative overflow-hidden">
            <div className="w-5 h-5 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: color }}></div>
            <input
                type="color"
                value={color}
                onChange={(e) => updateThemeConfig(path, e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
        </div>
        {label && <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-900 transition-colors">{label}</span>}
    </div>
)

export default ColorSelector;
