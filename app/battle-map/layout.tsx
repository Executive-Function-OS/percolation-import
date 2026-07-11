import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Battle Map',
  description:
    'Strategic overview of system states and intervention pathways in the EFOS framework.',
}

export default function BattleMapLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
