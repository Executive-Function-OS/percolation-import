import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Technical Architecture',
  description:
    'How EFOS works under the hood: local data ingestion, DBSCAN clustering, graph construction, and percolation analysis — all client-side.',
}

export default function ArchitectureLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
