import Link from 'next/link'
import { ArrowLeft, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-5 text-center">
      <Compass className="h-12 w-12 text-brand-blue" />
      <div>
        <h1 className="mb-2 text-4xl font-bold text-foreground">Signal lost</h1>
        <p className="max-w-md text-muted-foreground">
          This node isn&apos;t connected to the giant component. The page you&apos;re
          looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded bg-brand-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-blue-hover"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  )
}
