'use client'

import { useState } from 'react'

export default function SidebarShareButton({ username }: { username: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!username) return alert('Primero configura tu usuario en Configuración.')

    // Construimos el link completo
    const origin = window.location.origin // Esto detecta si es localhost o blueshocks.com
    const link = `${origin}/${username}`

    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`
        w-full mt-6 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all
        ${copied
          ? 'bg-green-100 text-green-700 border border-green-200'
          : 'bg-[#1a1a8e] text-white hover:bg-[#2a2a9e] shadow-lg shadow-indigo-500/30'
        }
      `}
    >
      {copied ? (
        <>✅ ¡Link Copiado!</>
      ) : (
        <>
            {/* Icono de compartir simple */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm0 0l-4.25-4.5m4.25 4.5l4.25-4.5m-4.25 4.5h16" />
            </svg>
            COMPARTIR TIENDA
        </>
      )}
    </button>
  )
}