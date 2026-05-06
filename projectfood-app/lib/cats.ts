export type Category = 'fruit' | 'vegetable' | 'herb' | 'nut_seed' | 'legume' | 'whole_grain'

export const CATS: Record<Category, { fg: string; bg: string; dot: string; emoji: string }> = {
  fruit:       { fg: '#7A2A1A', bg: '#FBD9CC', dot: '#C2533D', emoji: '🍎' },
  vegetable:   { fg: '#2D4A22', bg: '#DDEACB', dot: '#4F7A3D', emoji: '🥬' },
  herb:        { fg: '#234038', bg: '#CFE5DD', dot: '#3C6A60', emoji: '🌿' },
  nut_seed:    { fg: '#4A2F18', bg: '#F1DFC4', dot: '#7E5530', emoji: '🥜' },
  legume:      { fg: '#3F2A52', bg: '#E5D6EE', dot: '#6A4880', emoji: '🫘' },
  whole_grain: { fg: '#5C4517', bg: '#F3E6BD', dot: '#9C7A2E', emoji: '🌾' },
}

export const CAT_ORDER: Category[] = ['vegetable', 'fruit', 'herb', 'nut_seed', 'legume', 'whole_grain']
