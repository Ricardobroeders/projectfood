export type HistoryRow = { date: string; variety: number }

export function WeeklyHistoryChart({ data }: { data: HistoryRow[] }) {
  const W = 300
  const H = 120
  const LABEL_H = 18
  const PAD_TOP = 8
  const LEFT = 24

  const CHART_BOTTOM = H - LABEL_H
  const CHART_TOP = PAD_TOP

  const n = data.length
  const gap = 2
  const barW = (W - LEFT - gap * (n - 1)) / n

  const todayStr = new Date().toLocaleDateString('en-CA')

  const maxVariety = Math.max(...data.map(d => d.variety), 1)
  const yMax = maxVariety
  const MIN_STUB = 2

  const yScale = (val: number) =>
    CHART_BOTTOM - (val / yMax) * (CHART_BOTTOM - CHART_TOP)

  const mid = Math.round(maxVariety / 2)
  const yLabels = maxVariety > 1 ? [mid, maxVariety] : [maxVariety]

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {/* Grid line at mid */}
      {maxVariety > 1 && (
        <line
          x1={LEFT} y1={yScale(mid)} x2={W} y2={yScale(mid)}
          stroke="#F4EFE8" strokeWidth={1}
        />
      )}

      {/* Y-axis labels */}
      {yLabels.map(v => (
        <text
          key={`y-${v}`}
          x={LEFT - 3}
          y={yScale(v) + 3}
          textAnchor="end"
          fontSize={7}
          fill="#A39B91"
          fontFamily="var(--font-geist-mono)"
        >
          {v}
        </text>
      ))}

      {/* Bars */}
      {data.map((d, i) => {
        const x = LEFT + i * (barW + gap)
        const isToday = d.date === todayStr
        const barH = d.variety > 0
          ? Math.max(MIN_STUB, yScale(0) - yScale(d.variety))
          : MIN_STUB
        const y = yScale(0) - barH

        const date = new Date(d.date + 'T00:00:00')
        const showLabel = i === 0 || i === Math.floor(n / 2) || i === n - 1
        const label = showLabel
          ? date.toLocaleDateString('en', { day: 'numeric', month: 'short' })
          : ''

        return (
          <g key={d.date}>
            <rect
              x={x} y={y} width={barW} height={barH}
              rx={2} ry={2}
              fill={isToday ? '#FBEDB5' : '#F5C518'}
            />
            {label && (
              <text
                x={x + barW / 2}
                y={H - 2}
                textAnchor="middle"
                fontSize={7}
                fill="#A39B91"
                fontFamily="var(--font-geist-mono)"
              >
                {label}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
