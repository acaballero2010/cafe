import React from 'react'
import { ChevronLeft, Share2, MoreHorizontal, Sparkles, BookOpen, Receipt } from 'lucide-react'

export function MobileHeader({
  activeVenue,
  setActiveVenue,
  onOpenSop,
  onOpenOcr
}) {
  const categories = [
    { id: 'coffee', label: '☕ Coffee', count: '12 drinks' },
    { id: 'boba', label: '🧋 Boba & Tea', count: '8 drinks' },
    { id: 'cocktail', label: '🍸 Cocktail', count: '6 drinks' }
  ]

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(248, 249, 251, 0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e5e7eb' }}>
      {/* 1. iOS-Style Top Navigation Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '52px',
          padding: '0 16px',
          maxWidth: '680px',
          margin: '0 auto'
        }}
      >
        {/* Left Action (Back / Menu) */}
        <button
          onClick={onOpenOcr}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#111827',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
          }}
          title="Scan Supplier Invoice"
        >
          <Receipt size={18} color="#0284c7" />
        </button>

        {/* Center Title */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
            Recipe Studio
          </h1>
          <span style={{ fontSize: '0.66rem', color: '#6b7280', fontWeight: 600 }}>
            PourCraft Mobile OS
          </span>
        </div>

        {/* Right Action (Share / SOP) */}
        <button
          onClick={onOpenSop}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#111827',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
          }}
          title="Share & Export Barista SOP"
        >
          <Share2 size={17} color="#451a03" />
        </button>
      </div>

      {/* 2. Horizontal Snap-Scrolling Category Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '8px 16px 12px',
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
                padding: '8px 16px',
                borderRadius: '9999px',
                border: isActive ? '1px solid #451a03' : '1px solid #e5e7eb',
                background: isActive ? '#451a03' : '#ffffff',
                color: isActive ? '#ffffff' : '#374151',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: isActive ? '0 2px 8px rgba(69, 26, 3, 0.25)' : '0 1px 2px rgba(0,0,0,0.03)',
                transition: 'all 0.18s ease'
              }}
            >
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
