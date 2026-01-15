'use client'

import { completeOnboarding } from "./actions" // Importamos la server action
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useFormState } from "react-dom" // NECESARIO para manejar errores
import { Store, Link as LinkIcon, AlertCircle } from "lucide-react"

// Estado inicial
const initialState = {
  error: null,
  message: null
}

export default function OnboardingPage() {
  const [storeName, setStoreName] = useState("")
  const [slug, setSlug] = useState("")

  // HOOK MÁGICO: Conecta el formulario con la server action
  // 'state' tiene los errores, 'dispatch' es la función que activa el envío
  const [state, dispatch] = useFormState(completeOnboarding, initialState)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setStoreName(val)
    // Autogenerar slug
    const generatedSlug = val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    setSlug(generatedSlug)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
            <Store size={24} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Configura tu Tienda</h1>
          <p className="text-slate-500 mt-2">
            Dale una identidad a tu espacio digital.
          </p>
        </div>

        {/* --- AQUÍ ESTABA EL ERROR --- */}
        {/* Usamos 'dispatch', NO 'completeOnboarding' directamente */}
        <form action={dispatch} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="storeName">Nombre de tu Empresa</Label>
            <Input 
              id="storeName" 
              name="storeName" 
              placeholder="Ej. Tacos El Paisa" 
              value={storeName}
              onChange={handleNameChange}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Tu Link Personalizado</Label>
            <div className="relative">
              <div className="absolute left-3 top-2.5 text-slate-400">
                <LinkIcon size={16} />
              </div>
              <Input 
                id="slug" 
                name="slug" 
                placeholder="tacos-el-paisa" 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="pl-9"
                required 
              />
            </div>
            <p className="text-xs text-slate-500">
              Tu tienda será: .../shop/<span className="font-bold text-blue-600">{slug || "tu-link"}</span>
            </p>
          </div>

          {/* Muestra errores si los hay */}
          {state?.error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                <AlertCircle size={16} />
                {state.error}
            </div>
          )}

          <SubmitButton />
        </form>

      </div>
    </div>
  )
}

// Botón separado para mostrar estado de "Cargando..."
function SubmitButton() {
  // En NextJS 14 usamos useFormStatus (opcional pero recomendado para UX)
  // Si no tienes useFormStatus, usa un botón normal
  return (
    <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-6">
      Guardar y Continuar
    </Button>
  )
}