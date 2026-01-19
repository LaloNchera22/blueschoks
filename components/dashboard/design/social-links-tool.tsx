"use client"
import { useState } from "react"
import { useEditorStore } from "@/hooks/useEditorStore"
import { Plus, Trash2, Facebook, Instagram, Twitter, Youtube, Linkedin, Globe, Mail, MessageCircle, Send, Video, AtSign, Music } from "lucide-react"
import { SocialLink } from "@/lib/types/theme-config"

// Safe Platform Map
const PLATFORMS = [
    { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' },
    { id: 'instagram', icon: Instagram, label: 'Instagram' },
    { id: 'facebook', icon: Facebook, label: 'Facebook' },
    { id: 'x', icon: Twitter, label: 'X (Twitter)' },
    { id: 'tiktok', icon: Music, label: 'TikTok' },
    { id: 'youtube', icon: Youtube, label: 'YouTube' },
    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    { id: 'threads', icon: AtSign, label: 'Threads' },
    { id: 'telegram', icon: Send, label: 'Telegram' },
    { id: 'website', icon: Globe, label: 'Web' },
    { id: 'email', icon: Mail, label: 'Email' },
]

export default function SocialLinksTool() {
    const { theme, updateThemeConfig } = useEditorStore()
    // Ensure socialLinks is an array to avoid crashes if undefined
    const socialLinks = theme.header.socialLinks || []
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const handleAdd = () => {
        const newLink: SocialLink = {
            id: crypto.randomUUID(),
            platform: 'instagram',
            url: '',
            active: true,
            style: {
                backgroundColor: '#000000',
                iconColor: '#ffffff',
                borderRadius: 'full'
            }
        }
        const newLinks = [...socialLinks, newLink]
        updateThemeConfig('header.socialLinks', newLinks)
        setSelectedId(newLink.id)
    }

    const handleRemove = (id: string) => {
        const newLinks = socialLinks.filter(l => l.id !== id)
        updateThemeConfig('header.socialLinks', newLinks)
        if (selectedId === id) setSelectedId(null)
    }

    const updateLink = (id: string, field: keyof SocialLink | 'style', value: any) => {
        const newLinks = socialLinks.map(l => {
            if (l.id === id) {
                if (field === 'style') {
                    return { ...l, style: { ...l.style, ...value } }
                }
                return { ...l, [field]: value }
            }
            return l
        })
        updateThemeConfig('header.socialLinks', newLinks)
    }

    const selectedLink = socialLinks.find(l => l.id === selectedId)

    return (
        <div className="flex items-center gap-4 h-full animate-in fade-in slide-in-from-bottom-2">
            {/* List of links */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-[200px] py-1 custom-scrollbar">
                {socialLinks.map(link => {
                    const PlatformIcon = PLATFORMS.find(p => p.id === link.platform)?.icon || Globe
                    return (
                        <button
                            key={link.id}
                            onClick={() => setSelectedId(link.id)}
                            className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border transition-all ${selectedId === link.id ? 'ring-2 ring-slate-900 border-transparent' : 'border-slate-200 hover:bg-slate-50'}`}
                            style={{ backgroundColor: link.style.backgroundColor, color: link.style.iconColor }}
                        >
                            <PlatformIcon size={14} />
                        </button>
                    )
                })}
                <button onClick={handleAdd} className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-colors">
                    <Plus size={14} />
                </button>
            </div>

            <div className="w-px h-6 bg-slate-200 flex-shrink-0"></div>

            {/* Edit Area */}
            {selectedLink ? (
                <div className="flex items-center gap-3">
                    {/* Platform Selector */}
                    <div className="relative group">
                        <select
                           value={selectedLink.platform}
                           onChange={(e) => updateLink(selectedLink.id, 'platform', e.target.value)}
                           className="w-24 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg h-9 px-2 appearance-none cursor-pointer hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 truncate"
                        >
                            {PLATFORMS.map(p => (
                                <option key={p.id} value={p.id}>{p.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* URL Input */}
                    <input
                        type="text"
                        placeholder="https://..."
                        value={selectedLink.url}
                        onChange={(e) => updateLink(selectedLink.id, 'url', e.target.value)}
                        className="w-32 h-9 text-xs border border-slate-200 rounded-lg px-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />

                    {/* Style Controls */}
                     <div className="flex flex-col items-center gap-1 relative group">
                        <div className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 relative overflow-hidden">
                            <div className="w-5 h-5 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: selectedLink.style.backgroundColor }}></div>
                            <input
                                type="color"
                                value={selectedLink.style.backgroundColor}
                                onChange={(e) => updateLink(selectedLink.id, 'style', { backgroundColor: e.target.value })}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                        </div>
                    </div>

                     <div className="flex flex-col items-center gap-1 relative group">
                        <div className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 relative overflow-hidden">
                             {/* Icon preview */}
                            <div className="w-5 h-5 flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: selectedLink.style.iconColor }}></div>
                            </div>
                            <input
                                type="color"
                                value={selectedLink.style.iconColor}
                                onChange={(e) => updateLink(selectedLink.id, 'style', { iconColor: e.target.value })}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                        </div>
                    </div>

                    {/* Radius Toggle */}
                     <button
                        onClick={() => {
                            const shapes = ['full', 'lg', 'md', 'none'];
                            const currentIdx = shapes.indexOf(selectedLink.style.borderRadius);
                            const nextShape = shapes[(currentIdx + 1) % shapes.length];
                            updateLink(selectedLink.id, 'style', { borderRadius: nextShape });
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500"
                        title="Radio Borde"
                    >
                         <div className={`w-4 h-4 border-2 border-current`} style={{
                             borderRadius: selectedLink.style.borderRadius === 'full' ? '9999px' :
                                           selectedLink.style.borderRadius === 'lg' ? '6px' :
                                           selectedLink.style.borderRadius === 'md' ? '4px' : '0px'
                         }}></div>
                    </button>

                    <button
                        onClick={() => handleRemove(selectedLink.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>

                </div>
            ) : (
                <div className="text-xs text-slate-400 italic px-2 whitespace-nowrap">Selecciona o agrega</div>
            )}
        </div>
    )
}
