'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

export function PushNotificationManager() {
  const { data: session } = useSession()
  const subscribedRef = useRef(false)

  useEffect(() => {
    if (!session?.user?.id || subscribedRef.current) return
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) return
    if (process.env.NODE_ENV !== 'production') return

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidKey) return

    async function subscribeToPush() {
      try {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return

        const registration = await navigator.serviceWorker.ready

        // Check for existing subscription
        let subscription = await registration.pushManager.getSubscription()

        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey!) as BufferSource,
          })
        }

        const subJson = subscription.toJSON()

        // Send subscription to server
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: subJson.endpoint,
            keys: {
              p256dh: subJson.keys?.p256dh,
              auth: subJson.keys?.auth,
            },
          }),
        })

        subscribedRef.current = true
      } catch {
        // Push subscription failed, app works fine without it
      }
    }

    // Delay subscription request to not interrupt initial page load
    const timeout = setTimeout(subscribeToPush, 5000)
    return () => clearTimeout(timeout)
  }, [session?.user?.id])

  return null
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
