import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Percolation Analysis',
  description:
    'Percolation-theoretic analysis of cognitive interaction networks: thresholds, giant components, and phase transitions.',
}

export default function PercolationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
