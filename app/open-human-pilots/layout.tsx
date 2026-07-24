import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Open Human Pilots',
  description:
    'Open-science pilot dashboard: cohort visualization, CSV upload, parameter calibration, and exportable percolation reports.',
}

export default function OpenHumanPilotsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
