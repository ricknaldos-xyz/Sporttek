'use client'

import { useEffect, useCallback, useRef } from 'react'
import { GlassButton } from '@/components/ui/glass-button'
import { Loader2 } from 'lucide-react'

declare global {
  interface Window {
    Culqi: {
      publicKey: string
      settings: (config: {
        title: string
        currency: string
        amount: number
        order: string
      }) => void
      options: (config: {
        lang: string
        installments: boolean
        paymentMethods: {
          tarjeta: boolean
          yape: boolean
        }
      }) => void
      open: () => void
      close: () => void
      token: {
        id: string
        [key: string]: unknown
      } | null
    }
    culqi: (() => void) | undefined
  }
}

interface CulqiCheckoutProps {
  amount: number
  title: string
  description: string
  onToken: (tokenId: string) => void | Promise<void>
  onError?: (error: string) => void
  disabled?: boolean
  loading?: boolean
  className?: string
  buttonText?: string
  buttonVariant?: 'solid' | 'outline'
}

export default function CulqiCheckout({
  amount,
  title,
  description,
  onToken,
  onError,
  disabled = false,
  loading = false,
  className,
  buttonText = 'Pagar',
  buttonVariant = 'solid',
}: CulqiCheckoutProps) {
  const scriptLoaded = useRef(false)
  const onTokenRef = useRef(onToken)
  const onErrorRef = useRef(onError)

  // Keep refs up to date so the global callback always uses the latest props
  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  useEffect(() => {
    if (scriptLoaded.current) return

    const existingScript = document.querySelector(
      'script[src="https://checkout.culqi.com/js/v4"]'
    )

    if (existingScript) {
      scriptLoaded.current = true
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.culqi.com/js/v4'
    script.async = true

    script.onload = () => {
      scriptLoaded.current = true
    }

    script.onerror = () => {
      onErrorRef.current?.('Failed to load Culqi checkout script.')
    }

    document.head.appendChild(script)

    return () => {
      // Clean up the global callback when the component unmounts
      window.culqi = undefined
    }
  }, [])

  const handleClick = useCallback(() => {
    if (!window.Culqi) {
      onErrorRef.current?.('Culqi checkout is not loaded yet. Please try again.')
      return
    }

    const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY
    if (!publicKey) {
      onErrorRef.current?.('Culqi public key is not configured.')
      return
    }

    window.Culqi.publicKey = publicKey

    window.Culqi.settings({
      title,
      currency: 'PEN',
      amount,
      order: description,
    })

    window.Culqi.options({
      lang: 'auto',
      installments: false,
      paymentMethods: {
        tarjeta: true,
        yape: true,
      },
    })

    window.culqi = function () {
      const token = window.Culqi.token
      if (token) {
        onTokenRef.current(token.id)
      } else {
        onErrorRef.current?.('No token received from Culqi.')
      }
    }

    window.Culqi.open()
  }, [amount, title, description])

  return (
    <GlassButton
      variant={buttonVariant}
      disabled={disabled || loading}
      onClick={handleClick}
      className={className}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {buttonText}
    </GlassButton>
  )
}
