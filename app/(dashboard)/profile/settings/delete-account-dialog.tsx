'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { AlertTriangle, X } from 'lucide-react'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput } from '@/components/ui/glass-input'
import { toast } from 'sonner'

export function DeleteAccountDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleClose() {
    setIsOpen(false)
    setPassword('')
    setConfirmText('')
  }

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault()
    if (confirmText !== 'ELIMINAR') return

    setIsLoading(true)
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success('Cuenta eliminada')
      signOut({ callbackUrl: '/' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <GlassButton
        variant="outline"
        className="border-destructive/50 text-destructive hover:bg-destructive/10"
        onClick={() => setIsOpen(true)}
      >
        Eliminar
      </GlassButton>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="relative w-full max-w-md glass-medium border-glass rounded-2xl p-6 shadow-glass-glow">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full bg-destructive/10 p-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <h2 className="text-lg font-semibold">Eliminar cuenta</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Esta accion es <strong>permanente e irreversible</strong>. Se eliminaran
              todos tus datos: analisis, planes de entrenamiento, partidos, rankings,
              badges y toda tu actividad.
            </p>

            <form onSubmit={handleDelete} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contrasena actual
                </label>
                <GlassInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contrasena"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Escribe <span className="font-mono text-destructive">ELIMINAR</span> para confirmar
                </label>
                <GlassInput
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="ELIMINAR"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <GlassButton
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Cancelar
                </GlassButton>
                <GlassButton
                  type="submit"
                  variant="solid"
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  disabled={isLoading || confirmText !== 'ELIMINAR' || !password}
                >
                  {isLoading ? 'Eliminando...' : 'Eliminar cuenta'}
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
