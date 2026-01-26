'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Lock, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: password })

      if (error) {
        throw error
      }

      toast.success('Contraseña actualizada correctamente')
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña.')
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
            <Lock size={24} />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Nueva Contraseña
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Ingresa tu nueva contraseña para asegurar tu cuenta.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleUpdate}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-900 font-bold text-sm">Nueva Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-12 bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900 rounded-xl transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-900 font-bold text-sm">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-12 bg-white border-slate-200 focus:border-slate-900 focus:ring-slate-900 rounded-xl transition-all font-medium"
              />
            </div>
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
                Actualizando...
              </>
            ) : (
              'Guardar Contraseña'
            )}
          </Button>
        </form>

      </div>
    </div>
  )
}
