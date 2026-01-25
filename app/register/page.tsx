"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Store, User, Phone, Globe, Edit3, Mail, Lock, AlertCircle } from "lucide-react"
import { useState, useEffect, Suspense, useRef } from "react"
import { signup } from "@/app/register/actions"
import { createClient } from "@/utils/supabase/client"

function RegisterForm() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message")
  const slugInputRef = useRef<HTMLInputElement>(null)
  
  const [shopName, setShopName] = useState("")
  const [slug, setSlug] = useState("")
  const [isSlugEdited, setIsSlugEdited] = useState(false)

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  useEffect(() => {
    const shopFromUrl = searchParams.get("shop")
    if (shopFromUrl) {
      setShopName(shopFromUrl)
      if (!isSlugEdited) {
         setSlug(generateSlug(shopFromUrl))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleShopNameChange = (val: string) => {
    setShopName(val)
    if (!isSlugEdited) {
      setSlug(generateSlug(val))
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = generateSlug(e.target.value)
    setSlug(val)
    setIsSlugEdited(true)
  }

  const handleEditClick = () => {
    setIsSlugEdited(true)
    slugInputRef.current?.focus()
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { shop_intent: shopName }
      },
    })
  }

  return (
    <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full space-y-4">
          
      {/* HEADER COMPACTO */}
      <div className="flex flex-col space-y-1 text-center mb-2">
        <div className="w-9 h-9 bg-[#0F172A] text-white rounded-lg flex items-center justify-center font-black text-lg mx-auto mb-1">
          B
        </div>
        <h1 className="text-xl font-bold tracking-tight">Crea tu cuenta</h1>
        <p className="text-xs text-muted-foreground">
          Estás a un paso de vender online.
        </p>
      </div>

      <form action={signup} className="space-y-3">
        
        {/* FILA 1: Nombre y Apellido */}
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="firstName" className="text-xs font-bold text-slate-700">Nombre</Label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input id="firstName" name="firstName" placeholder="Juan" className="pl-8 h-9 text-sm" required />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lastName" className="text-xs font-bold text-slate-700">Apellido</Label>
            <Input id="lastName" name="lastName" placeholder="Pérez" className="h-9 text-sm" required />
          </div>
        </div>

        {/* FILA 2: WhatsApp y Nombre Tienda (Fusionados en una fila para ahorrar espacio) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="grid gap-1.5">
                <Label htmlFor="phone" className="text-xs font-bold text-slate-700">WhatsApp</Label>
                <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input id="phone" name="phone" type="tel" placeholder="55 1234 5678" className="pl-8 h-9 text-sm" required />
                </div>
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="shopName" className="text-xs font-bold text-slate-700">Nombre de tu Tienda</Label>
                <div className="relative">
                    <Store className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input 
                        id="shopName" 
                        name="shopName" 
                        placeholder="Ej. Moda Cool" 
                        className="pl-8 h-9 text-sm" 
                        value={shopName}
                        onChange={(e) => handleShopNameChange(e.target.value)}
                        required 
                    />
                </div>
            </div>
        </div>

        {/* FILA 3: Link (Ancho completo pero compacto) */}
        <div className="grid gap-1.5">
          <Label className="flex items-center justify-between text-xs font-bold text-slate-700">
            <div className="flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> Link de tu tienda
            </div>
            <span 
                onClick={handleEditClick}
                className="text-[10px] text-blue-600 font-medium cursor-pointer flex items-center gap-1 hover:underline"
            >
                <Edit3 className="w-3 h-3" /> Editar link
            </span>
          </Label>
          
          <div 
            onClick={() => slugInputRef.current?.focus()}
            className={`flex items-center rounded-md border px-3 h-9 text-sm ring-offset-background transition-colors cursor-text ${isSlugEdited ? 'border-blue-500 bg-blue-50/20' : 'border-input bg-slate-50'}`}
          >
            <span className="text-slate-500 select-none text-xs sm:text-sm">blueshocks.com/</span>
            <input 
              ref={slugInputRef} 
              name="slug"
              value={slug}
              onChange={handleSlugChange}
              placeholder="tu-marca"
              className="bg-transparent font-bold text-slate-900 focus:outline-none flex-1 ml-0.5 placeholder:font-normal placeholder:text-slate-400 w-full text-xs sm:text-sm" 
              autoComplete="off"
            />
          </div>
        </div>

        {/* FILA 4: Correo y Contraseña (Fusionados para ahorrar espacio) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-slate-700">Correo</Label>
                <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input id="email" name="email" type="email" placeholder="hola@mail.com" className="pl-8 h-9 text-sm" required />
                </div>
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="password" className="text-xs font-bold text-slate-700">Contraseña</Label>
                <div className="relative">
                    <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-8 h-9 text-sm" required />
                </div>
            </div>
        </div>

        {message && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-md flex items-center gap-2 border border-red-100 font-bold">
            <AlertCircle className="w-4 h-4" />
            {message}
          </div>
        )}

        <Button type="submit" className="w-full h-10 font-bold bg-[#0F172A] hover:bg-slate-800 text-sm mt-1">
          Crear Tienda Gratis
        </Button>
      </form>

      {/* FOOTER / GOOGLE */}
      <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
              <span className="bg-white px-2 text-slate-400 font-medium">
                O continúa con
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-9 gap-2 bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm text-xs font-bold" 
            type="button"
            onClick={handleGoogleLogin}
          >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary font-bold text-slate-900">
              Inicia Sesión
            </Link>
          </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="w-full h-screen grid lg:grid-cols-2 overflow-hidden">
      
      {/* Columna Izquierda: Formulario (Ahora más compacto) */}
      <div className="flex flex-col h-full bg-white p-4 lg:p-8 relative overflow-y-auto items-center justify-center">
        <Link href="/" className="absolute top-4 left-4 lg:top-8 lg:left-8 text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-xs font-bold">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
        <Suspense fallback={<div>Cargando...</div>}>
          <RegisterForm />
        </Suspense>
      </div>

      {/* Columna Derecha: Branding (Visualmente igual) */}
      <div className="hidden lg:flex flex-col bg-[#0F172A] text-white p-12 justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10 max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
               <Store className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Tu negocio en WhatsApp, <br/>al siguiente nivel.</h2>
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>✓ Catálogo digital instantáneo</p>
                <p>✓ Sin comisiones por venta</p>
                <p>✓ Gestión de inventario simple</p>
            </div>
        </div>
        <div className="absolute bottom-8 w-full text-center text-xs text-slate-500 left-0">
            © 2026 BlueShock Inc.
        </div>
      </div>
    </div>
  )
}