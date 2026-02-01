'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function ProcessingPoller({ analysisId }: { analysisId: string }) {
  const router = useRouter()
  useEffect(() => {
    const controller = new AbortController()
    let failCount = 0
    const maxFails = 10

    const poll = async () => {
      try {
        const res = await fetch(`/api/analyze/${analysisId}`, { signal: controller.signal })
        if (res.ok) {
          const data = await res.json()
          if (data.status !== 'PROCESSING') {
            router.refresh()
            clearInterval(intervalId)
            return
          }
        }
        failCount = 0 // reset on success
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        failCount++
        if (failCount >= maxFails) {
          clearInterval(intervalId)
        }
      }
    }

    const intervalId = setInterval(poll, 5000)

    return () => {
      controller.abort()
      clearInterval(intervalId)
    }
  }, [analysisId, router])
  return null
}
