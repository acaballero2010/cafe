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
      className="app-responsive-frame"
      style={{
        position: 'fixed',
        bottom: '60px', // Anchored right above mobile bottom tab navigation
        left: 0,
        right: 0,
        zIndex: 48,
        padding: '0 16px 8px',
        pointerEvents: 'none'
      }}
    >
      <div
        onClick={onOpenBottomSheet}
        style={{
          background: '#0f172a', // text-slate-900 / dark luxury pill
          borderRadius: '20px',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          boxShadow: '0 20px 30px -4px rgba(15, 23, 42, 0.45)',
          cursor: 'pointer',
          pointerEvents: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          minHeight: '60px',
          transition: 'transform 0.15s ease',
          boxSizing: 'border-box',
          width: '100%'
        }}
      >
        {/* Left Side: LIVE COGS */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexShrink: 0, minWidth: '68px' }}>
          <span style={{ fontSize: '0.62rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
            LIVE COGS
          </span>
          <span style={{ fontSize: totalCogs >= 1000 ? '0.95rem' : '1.05rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1.1, marginTop: '2px', whiteSpace: 'nowrap' }}>
            ₱{totalCogs.toFixed(2)}
          </span>
        </div>

        {/* Center: High-Contrast Margin Badge */}
        <div
          style={{
            background: isHighMargin ? '#ecfdf5' : isMedMargin ? '#fffbeb' : '#fff1f2',
            border: `1px solid ${isHighMargin ? '#a7f3d0' : isMedMargin ? '#fde68a' : '#fecdd3'}`,
            borderRadius: '10px',
            padding: '4px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: isHighMargin ? '#047857' : isMedMargin ? '#92400e' : '#9f1239', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
            {grossMarginPct.toFixed(0)}% GM
          </span>
          <span style={{ fontSize: '0.58rem', fontWeight: 700, color: isHighMargin ? '#065f46' : isMedMargin ? '#78350f' : '#881337', marginTop: '1px', whiteSpace: 'nowrap' }}>
            +₱{grossProfit.toFixed(0)}/cup
          </span>
        </div>

        {/* Right Side: Primary "Preview & Render" Action Button */}
        <button
          style={{
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            border: 'none',
            color: '#ffffff',
            padding: '8px 12px',
            borderRadius: '12px',
            fontSize: '0.78rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)',
            cursor: 'pointer',
            minHeight: '40px',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          <Wand2 size={13} style={{ flexShrink: 0 }} />
          <span>Preview & Render</span>
          <ChevronUp size={13} style={{ flexShrink: 0 }} />
        </button>
      </div>
    </div>
  )
}
