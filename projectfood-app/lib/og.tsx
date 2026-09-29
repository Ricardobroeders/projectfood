import { ImageResponse } from 'next/og'

// One share card for the whole site: a plant render on the warm surface, the title, the wordmark.
// Served by the `og/route.tsx` handlers (home, learn hub, pillar, cluster) and referenced from
// openGraph.images, twitter.images and Article.image, so every share and every crawler sees the
// same 1200 × 630 PNG. Not the opengraph-image file convention: that one builds its URL from the
// internal route (/nl/learn/…), which the middleware would 308 to the public slug (/nl/leer/…).

export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

const RENDERS = 'https://lkmfmdehysmbstnfdbyg.supabase.co/storage/v1/object/food-images'
const FALLBACK_RENDER = `${RENDERS}/broccoli.png`

// Plus Jakarta Sans 800 as TTF, fetched once per server instance from Google Fonts. The old
// Safari user agent makes the CSS endpoint return TTF instead of woff2, which Satori cannot read.
let fontPromise: Promise<ArrayBuffer | null> | null = null
function jakartaExtraBold(): Promise<ArrayBuffer | null> {
  fontPromise ??= (async () => {
    try {
      const css = await fetch('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800', {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
        },
      }).then((r) => r.text())
      const m = css.match(/src: url\(([^)]+\.ttf)\)/)
      if (!m) return null
      return await fetch(m[1]).then((r) => r.arrayBuffer())
    } catch {
      return null
    }
  })()
  return fontPromise
}

type Card = {
  title: string
  /** Small uppercase line above the title: the section, or the host. */
  eyebrow: string
  /** A plant render (transparent PNG). Falls back to broccoli. */
  image?: string | null
}

export async function ogCard({ title, eyebrow, image }: Card): Promise<ImageResponse> {
  const font = await jakartaExtraBold()
  const size = title.length > 70 ? 46 : title.length > 45 ? 54 : 62
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#F4EFE8',
          color: '#1F1B16',
          fontFamily: 'Jakarta, "Plus Jakarta Sans", sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 740,
            padding: '64px 24px 56px 64px',
          }}
        >
          <div style={{ display: 'flex', fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', color: '#6B645C' }}>
            {eyebrow}
          </div>
          <div style={{ display: 'flex', fontSize: size, lineHeight: 1.1, fontWeight: 800 }}>{title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 800 }}>
            <div style={{ display: 'flex', width: 30, height: 30, borderRadius: 9, background: '#F5C518' }} />
            <span>Project Food</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 460 }}>
          <img src={image ?? FALLBACK_RENDER} width={400} height={400} style={{ objectFit: 'contain' }} alt="" />
        </div>
      </div>
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: font ? [{ name: 'Jakarta', data: font, weight: 800, style: 'normal' }] : undefined,
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' },
    },
  )
}
