'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al enviar el correo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-4">
            <Mail size={24} />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Recuperar Contraseña
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-start gap-3 border border-green-100 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
              <div className="text-sm font-medium">
                <p className="font-bold mb-1">¡Correo enviado!</p>
                Revisa tu bandeja de entrada (y spam) para encontrar el enlace de recuperación.
              </div>
            </div>

            <Link href="/login">
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-slate-200">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio de sesión
              </Button>
            </Link>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-900 font-bold text-sm">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@tuempresa.com"
                required
                className="h-12 bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900 rounded-xl transition-all font-medium"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl text-base shadow-lg shadow-slate-200 hover:shadow-xl transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Link de Recuperación'
              )}
            </Button>
          </form>
        )}

        {/* Footer Link */}
        {!success && (
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
