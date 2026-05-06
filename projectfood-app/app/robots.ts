import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/en/', '/nl/', '/it/'],
        disallow: [
          '/home',
          '/log',
          '/stats',
          '/account',
          '/advice',
          '/leaderboard',
          '/login',
          '/api/',
          '/auth/',
        ],
      },
    ],
    sitemap: 'https://projectfood.dev/sitemap.xml',
  }
}
