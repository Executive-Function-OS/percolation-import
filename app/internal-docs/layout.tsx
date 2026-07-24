import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Internal Docs',
  robots: { index: false, follow: false },
}

export default function InternalDocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
