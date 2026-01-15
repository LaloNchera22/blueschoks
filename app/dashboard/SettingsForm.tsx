'use client'

import { updateSettings } from "./actions"
// Usamos useActionState para Next.js 16
import { useActionState } from "react" 
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Store, Phone, Globe, Mail, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

interface SettingsFormProps {
  initialData: {
    first_name: string
    email: string
    shop_name: string // ¡CORREGIDO!
    slug: string
    phone: string
  }
}

const initialState = { error: null, message: null, success: false }

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [state, dispatch] = useActionState(updateSettings, initialState)

  return (
    <form action={dispatch} className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* SECCIÓN 1: PERFIL */}
      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        <div className="text-sm">
          <h3 className="font-bold text-slate-900 text-lg">Perfil</h3>
          <p className="text-slate-500">Tu información personal.</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-slate-600"><Mail size={16} /> Correo</Label>
            <Input disabled value={initialData.email} className="bg-slate-50 text-slate-500" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center gap-2"><User size={16} /> Tu Nombre</Label>
            <Input id="firstName" name="firstName" defaultValue={initialData.first_name || ""} />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 my-6"></div>

      {/* SECCIÓN 2: TIENDA */}
      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        <div className="text-sm">
          <h3 className="font-bold text-slate-900 text-lg">Tienda</h3>
          <p className="text-slate-500">Datos públicos de tu negocio.</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <Label htmlFor="shopName" className="flex items-center gap-2"><Store size={16} /> Nombre Tienda</Label>
            {/* OJO: name="shopName" para que coincida con actions.ts */}
            <Input id="shopName" name="shopName" defaultValue={initialData.shop_name || ""} placeholder="Ej. Tienda Demo" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="flex items-center gap-2"><Globe size={16} /> Link Personalizado</Label>
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-blue-600">
              <span className="flex select-none items-center pl-3 text-slate-500 sm:text-sm bg-slate-50 rounded-l-md px-3 border-r border-slate-200">
                /shop/
              </span>
              <input type="text" name="slug" id="slug" defaultValue={initialData.slug || ""} className="block flex-1 border-0 bg-transparent py-2 pl-2 text-slate-900 focus:ring-0 sm:text-sm" placeholder="mi-tienda" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2"><Phone size={16} /> WhatsApp / Teléfono</Label>
            <Input id="phone" name="phone" defaultValue={initialData.phone || ""} placeholder="+52..." />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        {state?.error && <p className="text-red-600 text-sm flex gap-2"><AlertCircle size={16} /> {state.error}</p>}
        {state?.success && <p className="text-green-600 text-sm flex gap-2"><CheckCircle2 size={16} /> {state.message}</p>}
        <SubmitButton />
      </div>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className={`font-bold ${pending ? 'bg-slate-400' : 'bg-slate-900'}`}>
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : <><Save className="mr-2 h-4 w-4" /> Guardar Cambios</>}
    </Button>
  )
}