export function formatNumber(value: string | number) {
  if (!value) return ''
  const num = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(num)) return ''
  return num.toLocaleString('en-US')
}

export function parseNumber(value: string) {
  return value.replace(/,/g, '')
}

export function formatNumberCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  }

  return value.toString()
}
