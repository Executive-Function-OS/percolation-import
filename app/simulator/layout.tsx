import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Phase Simulator',
  description:
    'Interactive percolation simulator: watch executive-function bridge nodes degrade under stress until the Observer–Operator network fragments.',
}

export default function SimulatorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
