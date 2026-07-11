import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quick Start — Get Your Score',
  description:
    'Run the 5-minute onboarding flow to generate your first client-side executive-function fragmentation score.',
}

export default function QuickStartLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
