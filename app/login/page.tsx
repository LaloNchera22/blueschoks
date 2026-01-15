'use client'

import { login } from "./actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, ArrowLeft, Zap, Shield, CheckCircle2 } from "lucide-react"

const initialState = {
  error: null as string | null,
}

export default function LoginPage() {
  const [state, dispatch] = useActionState(login, initialState)

  return (
    // Layout Grid igual que registro: Izquierda Formulario / Derecha Visual (oculta en móvil)
    <div className="w-full min-h-screen grid lg:grid-cols-2 font-sans bg-white">
      
      {/* --- COLUMNA IZQUIERDA: FORMULARIO --- */}
      <div className="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-20 relative bg-white">
        
        {/* Botón Volver */}
        <div className="absolute top-8 left-8">
          <Link href="/" className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Volver
          </Link>
        </div>

        <div className="w-full max-w-[380px] mx-auto space-y-8 mt-12">
          
          {/* Header con Branding idéntico a Home */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-black text-xl tracking-tighter text-slate-900 mb-6">
                <div className="w-8 h-8 bg-[#0F172A] text-white rounded-lg flex items-center justify-center text-sm">B</div>
                BLUESHOCKS
            </div>
            
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Bienvenido
            </h1>
            <p className="text-slate-500 font-medium">
              Ingresa a tu panel de control.
            </p>
          </div>

          <form action={dispatch} className="space-y-5">
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-900 font-bold text-sm">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nombre@tuempresa.com"
                required
                className="h-12 bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900 rounded-xl transition-all font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-900 font-bold text-sm">Contraseña</Label>
                <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-12 bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900 rounded-xl transition-all font-medium"
              />
            </div>

            {state?.error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-3 border border-red-100 font-bold animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                {state.error}
              </div>
            )}

            <SubmitButton />
          </form>

          {/* Separador */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100" /></div>
            <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-slate-300">
              <span className="bg-white px-4">o continúa con</span>
            </div>
          </div>

          {/* Botón Google - Estilo Outline pero Redondo */}
          <Button variant="outline" className="w-full h-12 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-full flex items-center justify-center gap-3 transition-all hover:scale-[1.02]">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </Button>

          <p className="text-center text-sm text-slate-500 font-medium">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/register" className="font-black text-slate-900 hover:text-blue-600 transition-colors hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>

      {/* --- COLUMNA DERECHA: VISUAL (Estilo Landing Page) --- */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-slate-50 p-12 lg:p-24 relative overflow-hidden border-l border-slate-100">
         
         {/* Fondo decorativo sutil */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="relative z-10 w-full max-w-md space-y-6">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-8">
               Tu tienda online, <br/>
               <span className="text-blue-600">más rápida que nunca.</span>
            </h2>

            {/* Tarjeta 1 - Estilo Landing */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
               <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  <Zap size={20} className="fill-blue-600" />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900">Velocidad Extrema</h3>
                  <p className="text-sm text-slate-500 leading-snug mt-1">
                     Administra tu catálogo sin esperas. Todo carga al instante.
                  </p>
               </div>
            </div>

            {/* Tarjeta 2 - Estilo Landing */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
               <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                  <Shield size={20} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900">Seguridad Total</h3>
                  <p className="text-sm text-slate-500 leading-snug mt-1">
                     Tus datos y los de tus clientes están protegidos con estándares bancarios.
                  </p>
               </div>
            </div>

            {/* Tarjeta 3 - Estilo Landing */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
               <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} />
               </div>
               <div>
                  <h3 className="font-bold text-slate-900">Fácil de Usar</h3>
                  <p className="text-sm text-slate-500 leading-snug mt-1">
                     Diseñado para que te enfoques en vender, no en programar.
                  </p>
               </div>
            </div>

         </div>
      </div>

    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-full text-base shadow-xl shadow-slate-200 hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-[0.98]"
    >
      {pending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verificando...</> : "Iniciar Sesión"}
    </Button>
  )
}