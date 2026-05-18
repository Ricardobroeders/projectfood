import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lkmfmdehysmbstnfdbyg.supabase.co',
        pathname: '/storage/v1/object/**',
      },
      {
        protocol: 'https',
        hostname: 'lkmfmdehysmbstnfdbyg.supabase.co',
        pathname: '/storage/v1/render/image/**',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
