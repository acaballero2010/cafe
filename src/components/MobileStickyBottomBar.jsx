import React from 'react'
import { Sparkles, ChevronUp } from 'lucide-react'

export function MobileStickyBottomBar({
  metrics,
  onOpenBottomSheet
}) {
  const { totalCogs, grossMarginPct, grossProfit } = metrics
  const isHighMargin = grossMarginPct >= 75

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '64px', // Right above mobile bottom nav
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '0 16px 8px',
        maxWidth: '680px',
        margin: '0 auto',
        pointerEvents: 'none'
      }}
    >
      <div
        onClick={onOpenBottomSheet}
        style={{
          background: '#111827',
          borderRadius: '20px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.35)',
          cursor: 'pointer',
          pointerEvents: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          transition: 'transform 0.15s ease'
        }}
      >
        {/* Left Side: Live Cost & Margin Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '0.66rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>
              Live Cost (COGS)
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              ₱{totalCogs.toFixed(2)}
            </div>
          </div>

          <div
            style={{
              background: isHighMargin ? '#ecfdf5' : '#fffbeb',
              border: `1px solid ${isHighMargin ? '#a7f3d0' : '#fde68a'}`,
              borderRadius: '9999px',
              padding: '4px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: isHighMargin ? '#059669' : '#d97706', fontFamily: 'var(--font-mono)' }}>
              {grossMarginPct.toFixed(0)}% GM
            </span>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: isHighMargin ? '#047857' : '#b45309' }}>
              +₱{grossProfit.toFixed(0)}/cup
            </span>
          </div>
        </div>

        {/* Right Side: High-Contrast CTA Button */}
        <button
          style={{
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            border: 'none',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '14px',
            fontSize: '0.84rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.4)',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={15} />
          <span>Preview & Render</span>
          <ChevronUp size={15} />
        </button>
      </div>
    </div>
  )
}
