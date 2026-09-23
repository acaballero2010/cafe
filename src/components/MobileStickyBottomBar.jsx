import React from 'react'
import { Sparkles, ChevronUp, Wand2 } from 'lucide-react'

export function MobileStickyBottomBar({
  metrics,
  onOpenBottomSheet
}) {
  const { totalCogs, grossMarginPct, grossProfit } = metrics
  const isHighMargin = grossMarginPct >= 75
  const isMedMargin = grossMarginPct >= 65 && grossMarginPct < 75

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '62px', // Anchored right above the mobile tab bar
        left: 0,
        right: 0,
        zIndex: 48,
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
          borderRadius: '24px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.4)',
          cursor: 'pointer',
          pointerEvents: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          minHeight: '64px'
        }}
      >
        {/* Left Section: Live COGS */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.68rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
            Live COGS
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
            ₱{totalCogs.toFixed(2)}
          </span>
        </div>

        {/* Middle Section: Circular / Rounded Margin Badge */}
        <div
          style={{
            background: isHighMargin ? '#ecfdf5' : isMedMargin ? '#fffbeb' : '#fff1f2',
            border: `1px solid ${isHighMargin ? '#a7f3d0' : isMedMargin ? '#fde68a' : '#fecdd3'}`,
            borderRadius: '14px',
            padding: '4px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: isHighMargin ? '#047857' : isMedMargin ? '#92400e' : '#9f1239', fontFamily: 'var(--font-mono)' }}>
            {grossMarginPct.toFixed(0)}% GM
          </span>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: isHighMargin ? '#065f46' : isMedMargin ? '#78350f' : '#881337' }}>
            +₱{grossProfit.toFixed(0)}/cup
          </span>
        </div>

        {/* Right Section: Primary Action Button */}
        <button
          style={{
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            border: 'none',
            color: '#ffffff',
            padding: '10px 16px',
            borderRadius: '16px',
            fontSize: '0.82rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.45)',
            cursor: 'pointer',
            minHeight: '44px',
            flexShrink: 0
          }}
        >
          <Wand2 size={15} />
          <span>Preview & Render</span>
          <ChevronUp size={15} />
        </button>
      </div>
    </div>
  )
}
