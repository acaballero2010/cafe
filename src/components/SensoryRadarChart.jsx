import React from 'react'

/**
 * 5-Axis Sensory Flavor Radar Chart (SVG)
 * Axes: Sweetness, Acidity, Bitterness, Body, Aroma (Scale 1-10)
 */
export function SensoryRadarChart({
  profile = { sweetness: 6, acidity: 4, bitterness: 5, body: 7, aroma: 8 },
  size = 200,
  isDarkMode = false
}) {
  const axes = [
    { key: 'sweetness', label: 'Sweetness', value: profile.sweetness || 5, color: '#f59e0b' },
    { key: 'acidity', label: 'Acidity', value: profile.acidity || 5, color: '#eab308' },
    { key: 'bitterness', label: 'Bitterness', value: profile.bitterness || 5, color: '#854d0e' },
    { key: 'body', label: 'Body', value: profile.body || 5, color: '#0284c7' },
    { key: 'aroma', label: 'Aroma', value: profile.aroma || 5, color: '#10b981' }
  ]

  const center = size / 2
  const radius = (size / 2) - 30
  const totalAxes = axes.length

  // Calculate polygon points
  const getCoordinates = (index, value) => {
    const angle = (Math.PI * 2 / totalAxes) * index - (Math.PI / 2)
    const distance = (value / 10) * radius
    const x = center + distance * Math.cos(angle)
    const y = center + distance * Math.sin(angle)
    return { x, y }
  }

  // Polygon path points
  const points = axes.map((axis, i) => {
    const { x, y } = getCoordinates(i, axis.value)
    return `${x},${y}`
  }).join(' ')

  // Background Web concentric levels (2, 4, 6, 8, 10)
  const levels = [2, 4, 6, 8, 10]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Concentric rings */}
        {levels.map(level => {
          const ringPoints = axes.map((_, i) => {
            const { x, y } = getCoordinates(i, level)
            return `${x},${y}`
          }).join(' ')

          return (
            <polygon
              key={level}
              points={ringPoints}
              fill="none"
              stroke={isDarkMode ? '#334155' : '#e2e8f0'}
              strokeWidth={level === 10 ? '1.5' : '1'}
              strokeDasharray={level === 10 ? 'none' : '2,2'}
            />
          )
        })}

        {/* Axis lines */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(i, 10)
          return (
            <line
              key={axis.key}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke={isDarkMode ? '#475569' : '#cbd5e1'}
              strokeWidth="1"
            />
          )
        })}

        {/* Sensory Polygon Area */}
        <polygon
          points={points}
          fill="rgba(56, 189, 248, 0.25)"
          stroke="#0284c7"
          strokeWidth="2"
        />

        {/* Axis Data Points & Text Labels */}
        {axes.map((axis, i) => {
          const { x, y } = getCoordinates(i, axis.value)
          const labelCoord = getCoordinates(i, 11.8)

          return (
            <g key={axis.key}>
              {/* Value Dot */}
              <circle
                cx={x}
                cy={y}
                r="4"
                fill="#0284c7"
                stroke="#ffffff"
                strokeWidth="1.5"
              />

              {/* Label */}
              <text
                x={labelCoord.x}
                y={labelCoord.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="10"
                fontWeight="700"
                fill={isDarkMode ? '#94a3b8' : '#475569'}
              >
                {axis.label} ({axis.value})
              </text>
            </g>
          )
        })}
      </svg>

      {/* Quick Summary Pill Bar */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '6px', 
          flexWrap: 'wrap', 
          marginTop: '6px',
          fontSize: '0.68rem',
          fontWeight: 700
        }}
      >
        <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 7px', borderRadius: '6px' }}>
          🍬 Sweet: {profile.sweetness}/10
        </span>
        <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 7px', borderRadius: '6px' }}>
          🥛 Body: {profile.body}/10
        </span>
        <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 7px', borderRadius: '6px' }}>
          ☕ Aroma: {profile.aroma}/10
        </span>
      </div>
    </div>
  )
}
