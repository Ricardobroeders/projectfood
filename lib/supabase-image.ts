const SUPABASE_OBJECT_BASE = '/storage/v1/object/public/'
const SUPABASE_RENDER_BASE = '/storage/v1/render/image/public/'

export function supabaseImageUrl(url: string, width: number, height: number): string {
  if (!url.includes(SUPABASE_OBJECT_BASE)) return url
  const [base, path] = url.split(SUPABASE_OBJECT_BASE)
  const pathWithoutQuery = path.split('?')[0]
  return `${base}${SUPABASE_RENDER_BASE}${pathWithoutQuery}?width=${width}&height=${height}&resize=contain`
}
