const FOOD_IMAGES_BUCKET = '/storage/v1/object/food-images/'

export function supabaseImageUrl(url: string, _width: number, _height: number): string {
  if (!url.includes(FOOD_IMAGES_BUCKET)) return url
  const filename = url.split(FOOD_IMAGES_BUCKET)[1]?.split('?')[0]
  if (!filename) return url
  return `/images/plants/${filename}`
}
