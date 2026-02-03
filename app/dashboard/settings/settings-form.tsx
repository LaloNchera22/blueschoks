'use client'

import { updateSettings, SettingsState } from "./actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Store, Globe, Smartphone, Mail, CheckCircle2, AlertCircle, Pencil } from "lucide-react"

const COUNTRY_CODES = [
  { code: "+52", country: "MX", label: "México (+52)" },
  { code: "+1", country: "US", label: "USA (+1)" },
  { code: "+57", country: "CO", label: "Colombia (+57)" },
  { code: "+54", country: "AR", label: "Argentina (+54)" },
  { code: "+56", country: "CL", label: "Chile (+56)" },
  { code: "+51", country: "PE", label: "Perú (+51)" },
  { code: "+34", country: "ES", label: "España (+34)" },
]

interface InitialData {
  shop_name?: string;
  slug?: string;
  whatsapp?: string;
  email?: string;
  [key: string]: unknown;
}

export default function SettingsForm({ initialData }: { initialData: InitialData }) {
  const initialState: SettingsState = { message: null, error: null }
  const [state, dispatch] = useActionState(updateSettings, initialState)
  
  // ESTADOS INDIVIDUALES
  const [editShop, setEditShop] = useState(false)
  const [editSlug, setEditSlug] = useState(false)
  const [editContact, setEditContact] = useState(false)
  
  // WHATSAPP LOGIC
  const [phonePrefix, setPhonePrefix] = useState("+52")
  const [phoneNumber, setPhoneNumber] = useState("")

  // Cuando se guarda con éxito, cerramos todo
  useEffect(() => {
    if (state.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditShop(false)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditSlug(false)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditContact(false)
    }
  }, [state.success])

  useEffect(() => {
    if (initialData.whatsapp) {
      const fullNumber = initialData.whatsapp.toString()
      const foundPrefix = COUNTRY_CODES.find(c => fullNumber.startsWith(c.code.replace('+', '')))
      if (foundPrefix) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPhonePrefix(foundPrefix.code)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPhoneNumber(fullNumber.replace(foundPrefix.code.replace('+', ''), ''))
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPhoneNumber(fullNumber)
      }
    }
  }, [initialData.whatsapp])

  return (
    <div className="max-w-3xl mx-auto relative pb-20">
      
      <form action={dispatch} className="space-y-8">
        
        {/* --- TARJETA 1: IDENTIDAD --- */}
        <section className={`rounded-2xl border transition-all duration-200 overflow-hidden ${editShop ? 'bg-white border-blue-600 shadow-xl ring-1 ring-blue-600' : 'bg-white border-slate-200'}`}>
          {/* Header Tarjeta */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${editShop ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
                      <Store size={18} />
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-900 text-sm">Identidad de la Tienda</h3>
                  </div>
              </div>
              {!editShop && (
                  <button type="button" onClick={() => setEditShop(true)} className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors">
                      <Pencil size={12} /> Editar
                  </button>
              )}
          </div>
          
          {/* Body Tarjeta */}
          <div className="p-6">
              <Label htmlFor="shopName" className="font-bold text-slate-700 mb-2 block">Nombre Público</Label>
              <Input 
                  id="shopName" 
                  name="shopName" 
                  defaultValue={initialData.shop_name} 
                  readOnly={!editShop} // Usamos readOnly para que se envíe el dato aunque esté bloqueado
                  className={`h-11 transition-all font-medium ${!editShop && "bg-slate-100 text-slate-500 border-slate-200 focus:ring-0 cursor-not-allowed"}`}
              />
          </div>

          {/* Footer Tarjeta (Solo visible al editar) */}
          {editShop && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 animate-in slide-in-from-top-2">
                  <Button type="button" variant="ghost" onClick={() => setEditShop(false)} className="text-slate-500 hover:text-red-600 h-9 px-4 text-xs font-bold">Cancelar</Button>
                  <SubmitButton />
              </div>
          )}
        </section>

        {/* --- TARJETA 2: DOMINIO --- */}
        <section className={`rounded-2xl border transition-all duration-200 overflow-hidden ${editSlug ? 'bg-white border-purple-600 shadow-xl ring-1 ring-purple-600' : 'bg-white border-slate-200'}`}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${editSlug ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-500'}`}>
                      <Globe size={18} />
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-900 text-sm">Link Personalizado</h3>
                  </div>
              </div>
              {!editSlug && (
                  <button type="button" onClick={() => setEditSlug(true)} className="text-xs font-bold text-slate-500 hover:text-purple-600 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-purple-50 transition-colors">
                      <Pencil size={12} /> Editar
                  </button>
              )}
          </div>
          <div className="p-6">
              <Label htmlFor="slug" className="font-bold text-slate-700 mb-2 block">URL de la Tienda</Label>
              <div className={`flex items-center rounded-lg border overflow-hidden h-11 transition-all ${!editSlug ? 'bg-slate-100 border-slate-200 cursor-not-allowed' : 'bg-white border-slate-300 focus-within:ring-2 focus-within:ring-slate-900'}`}>
                  <span className="pl-3 pr-2 text-slate-400 text-sm font-medium select-none bg-transparent">
                      blueshocks.com/
                  </span>
                  <input 
                      id="slug"
                      name="slug"
                      defaultValue={initialData.slug}
                      readOnly={!editSlug}
                      placeholder="tu-marca"
                      className={`flex-1 bg-transparent border-none focus:ring-0 text-slate-900 font-bold text-sm outline-none ${!editSlug && "text-slate-500 cursor-not-allowed"}`}
                  />
              </div>
          </div>
          {editSlug && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 animate-in slide-in-from-top-2">
                  <Button type="button" variant="ghost" onClick={() => setEditSlug(false)} className="text-slate-500 hover:text-red-600 h-9 px-4 text-xs font-bold">Cancelar</Button>
                  <SubmitButton />
              </div>
          )}
        </section>

        {/* --- TARJETA 3: CONTACTO --- */}
        <section className={`rounded-2xl border transition-all duration-200 overflow-hidden ${editContact ? 'bg-white border-green-600 shadow-xl ring-1 ring-green-600' : 'bg-white border-slate-200'}`}>
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${editContact ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                      <Smartphone size={18} />
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-900 text-sm">Contacto y Pedidos</h3>
                  </div>
              </div>
              {!editContact && (
                  <button type="button" onClick={() => setEditContact(true)} className="text-xs font-bold text-slate-500 hover:text-green-600 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-green-50 transition-colors">
                      <Pencil size={12} /> Editar
                  </button>
              )}
          </div>
          <div className="p-6 grid gap-6">
              
              <div>
                  <Label className="font-bold text-slate-700 mb-2 block">WhatsApp de Pedidos</Label>
                  <div className="flex gap-2">
                      <div className="w-[140px] relative">
                          <select 
                            name="countryCode"
                            disabled={!editContact} // Select sí usa disabled visualmente
                            value={phonePrefix}
                            onChange={(e) => setPhonePrefix(e.target.value)}
                            className="w-full h-11 appearance-none bg-white border border-slate-300 rounded-lg pl-3 pr-8 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 cursor-pointer disabled:cursor-not-allowed"
                          >
                            {COUNTRY_CODES.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.country} {c.code}
                                </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                             <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                      </div>

                      <Input 
                          name="localPhone" 
                          type="number"
                          placeholder="123 456 7890"
                          readOnly={!editContact}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className={`flex-1 h-11 transition-all font-medium ${!editContact && "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed focus:ring-0"}`}
                      />
                  </div>
              </div>

              {/* Input Oculto para que el CountryCode se envíe aunque el select esté disabled */}
              {!editContact && <input type="hidden" name="countryCode" value={phonePrefix} />}

              <div className="">
                  <Label className="font-bold text-slate-700 flex items-center gap-2 mb-2">
                      <Mail size={14} /> Correo de Cuenta
                  </Label>
                  <Input 
                      name="email"
                      defaultValue={initialData.email} 
                      readOnly={!editContact}
                      className={`h-11 transition-all font-medium ${!editContact ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed" : "bg-white text-slate-900 border-slate-300 focus:ring-2 focus:ring-slate-900"}`}
                  />
              </div>
          </div>
          {editContact && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 animate-in slide-in-from-top-2">
                  <Button type="button" variant="ghost" onClick={() => setEditContact(false)} className="text-slate-500 hover:text-red-600 h-9 px-4 text-xs font-bold">Cancelar</Button>
                  <SubmitButton />
              </div>
          )}
        </section>

        {/* --- MENSAJES DE ESTADO --- */}
        {state.success && (
            <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-200 font-bold animate-in slide-in-from-bottom-2 fixed bottom-6 right-6 shadow-2xl z-50">
                <CheckCircle2 size={20} />
                {state.message}
            </div>
        )}
        {state.error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-200 font-bold animate-in slide-in-from-bottom-2 fixed bottom-6 right-6 shadow-2xl z-50">
                <AlertCircle size={20} />
                {state.error}
            </div>
        )}

      </form>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
        type="submit" 
        disabled={pending} 
        className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 px-6 rounded-lg shadow-sm transition-all text-xs"
    >
        {pending ? <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Guardando...</> : "Guardar Cambios"}
    </Button>
  )
}
