import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Researchers & Labs',
  description:
    'Academic collaboration, pre-registration details, and validation roadmap for the EFOS digital phenotyping framework.',
}

export default function ResearchersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
