import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/internal-docs'],
    },
    sitemap: 'https://demo.executivefunctionos.com/sitemap.xml',
  }
}
