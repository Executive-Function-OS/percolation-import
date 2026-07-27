import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Development Roadmap',
  description:
    'The 2-year EFOS development and validation roadmap, aligned with the Renaissance Philanthropy OS4LS Track 1 goals — from pre-registration to multi-site clinical trials.',
}

export default function RoadmapLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
