import { revalidatePath } from 'next/cache'

// On-demand revalidation of the learn tree and the sitemap, called by scripts/learn-publish.mjs
// after a publish. Whole-tree: about twenty pages, no per-path bookkeeping, and it also clears
// a cached 404 for a slug that was requested before it was published.
//
//   POST /api/revalidate  Authorization: Bearer $REVALIDATE_SECRET
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('unauthorized', { status: 401 })
  }

  for (const path of ['/[locale]/learn', '/[locale]/learn/[pillarSlug]', '/[locale]/learn/[pillarSlug]/[articleSlug]']) {
    revalidatePath(path, 'page')
  }
  revalidatePath('/sitemap.xml')

  return Response.json({ revalidated: true, at: new Date().toISOString() })
}
