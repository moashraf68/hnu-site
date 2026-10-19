export function maskNationalId(id: string): string {
  const visible = id.slice(-4)
  const masked = '●'.repeat(Math.max(0, id.length - 4)) + visible
  return masked
}

export function getEvalColor(score: number): 'red' | 'yellow' | 'green' {
  if (score < 4) return 'red'
  if (score < 7) return 'yellow'
  return 'green'
}

export function getEvalBadgeClass(score: number): string {
  const color = getEvalColor(score)
  return `badge-${color}`
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const COLLEGES = [
  'كلية العلوم الإنسانية',
  'كلية الهندسة والتكنولوجيا',
  'كلية إدارة الأعمال',
  'كلية الحاسبات والمعلومات',
  'كلية الصيدلة',
  'أخرى',
] as const

export const YEARS = [
  'الفرقة الأولى',
  'الفرقة الثانية',
  'الفرقة الثالثة',
  'الفرقة الرابعة',
  'خريج',
] as const
