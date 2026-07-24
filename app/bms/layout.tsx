import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BMS 4.0 Protocol',
  description:
    'The BMS 4.0 protocol: structured intervention framework triggered at the percolation threshold.',
}

export default function BmsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
