import React from 'react'
import { ChevronLeft, MoreVertical, Sparkles } from 'lucide-react'

export function MobileHeader({
  activeVenue,
  setActiveVenue,
  onOpenSop,
  onOpenOcr
}) {
  const categories = [
    { id: 'coffee', label: 'Coffee' },
    { id: 'boba', label: 'Boba & Tea' },
    { id: 'cocktail', label: 'Cocktail' }
  ]

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(248, 249, 251, 0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e5e7eb' }}>
      {/* 1. iOS-Style Top System Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '48px',
          padding: '0 16px',
          maxWidth: '680px',
          margin: '0 auto'
        }}
      >
        {/* Top-Left: Clean Back Button */}
        <button
          onClick={onOpenOcr}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#111827',
            cursor: 'pointer'
          }}
          title="Back / Scan Invoice"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Centered Title (14pt Medium) */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '0.94rem', fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>
            Recipe Studio
          </h1>
        </div>

        {/* Top-Right: Overflow Menu (Three Dots ⋮) */}
        <button
          onClick={onOpenSop}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#111827',
            cursor: 'pointer'
          }}
          title="Menu Options & Barista SOP"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* 2. Horizontal Category Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '4px 16px 10px',
          scrollbarWidth: 'none',
          maxWidth: '680px',
          margin: '0 auto'
        }}
      >
        {categories.map(cat => {
          const isActive = activeVenue === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveVenue(cat.id)}
              style={{
                flexShrink: 0,
                padding: '7px 16px',
                borderRadius: '9999px',
                border: isActive ? '1.5px solid #111827' : '1px solid #e5e7eb',
                background: isActive ? '#111827' : '#ffffff',
                color: isActive ? '#ffffff' : '#4b5563',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
