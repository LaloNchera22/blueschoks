'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function ClaimUsernameModal({ isOpen }: { isOpen: boolean }) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  if (!isOpen) return null

  const handleClaim = async () => {
    setLoading(true)
    setError('')
    
    // Limpiar el texto: minúsculas y sin espacios
    const cleanSlug = username.toLowerCase().trim().replace(/\s+/g, '')

    if (cleanSlug.length < 3) {
      setError('Mínimo 3 letras.')
      setLoading(false)
      return
    }

    // Verificar si ya existe
    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', cleanSlug)
      .single()

    if (existing) {
      setError('¡Ups! Ese nombre ya está ocupado.')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
        const { error: updateError } = await supabase
        .from('profiles')
        .update({ username: cleanSlug })
        .eq('id', user.id)

        if (!updateError) {
            router.refresh()
        } else {
            setError('Error al guardar.')
        }
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md text-center space-y-6">
        
        <div className="space-y-2">
            <h2 className="text-3xl font-black text-[#1a1a8e]">¡HOLA NENI! 💖</h2>
            <p className="text-gray-500 font-medium text-sm">Elige el nombre para tu tienda oficial.</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-1 border-2 border-transparent focus-within:border-[#1a1a8e]">
            <span className="text-gray-400 font-bold">blueshocks.com/</span>
            <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tu-tienda"
                className="bg-transparent font-black text-[#1a1a8e] outline-none w-full"
            />
        </div>

        {error && <p className="text-red-500 font-bold text-xs">{error}</p>}

        <button 
            onClick={handleClaim}
            disabled={loading}
            className="w-full bg-[#1a1a8e] text-white font-black py-4 rounded-xl shadow-lg disabled:opacity-50"
        >
            {loading ? 'RESERVANDO...' : 'APARTAR MI LINK 🚀'}
        </button>
      </div>
    </div>
  )
}