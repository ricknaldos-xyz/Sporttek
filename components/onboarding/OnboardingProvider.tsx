'use client'

import { WelcomeModal } from './WelcomeModal'
import { OnboardingTour } from './OnboardingTour'

interface OnboardingProviderProps {
  children: React.ReactNode
  userName?: string
  isNewUser?: boolean
}

export function OnboardingProvider({
  children,
  userName,
  isNewUser = false,
}: OnboardingProviderProps) {
  return (
    <>
      {children}
      {isNewUser && <WelcomeModal userName={userName} />}
      <OnboardingTour />
    </>
  )
}
