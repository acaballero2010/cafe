import React, { useState } from 'react'
import { X, Sparkles, Download, BookOpen, ShoppingBag, Sun, Moon, Layers, ChevronDown } from 'lucide-react'
import { RealTimeCanvas } from './RealTimeCanvas'

export function MobileBottomSheet({
  isOpen,
  onClose,
  recipe,
  metrics,
  onUpdateRecipe,
  onOpenSopCard,
  onOpenMarketplace
}) {
  const [viewMode, setViewMode] = useState('live-cup') // 'live-cup' | 'ai-render'
  const [isGenerating, setIsGenerating] = useState(false)

  if (!isOpen) return null

  const handlePriceChange = (newPrice) => {
    onUpdateRecipe({
      ...recipe,
      menuPrice: Math.max(0, Number(newPrice))
    })
  }

  const { totalCogs, grossProfit, grossMarginPct, suggestedMenuPrice } = metrics

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(17, 24, 39, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '28px 28px 0 0',
          padding: '20px 20px 36px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        {/* Grab Handle */}
        <div style={{ width: '44px', height: '5px', background: '#d1d5db', borderRadius: '9999px', margin: '0 auto' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', fontFamily: 'var(--font-display)' }}>
              Drink Preview & Economics
            </h3>
            <p style={{ fontSize: '0.72rem', color: '#6b7280' }}>
              {recipe.name} • {metrics.vessel.name}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#f3f4f6',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} color="#4b5563" />
          </button>
        </div>

        {/* Realistic Drink Stage Centerpiece */}
        <RealTimeCanvas
          metrics={metrics}
          recipe={recipe}
          onOpenSopCard={onOpenSopCard}
        />

        {/* Retail Price Slider & Profit Badge (PHP ₱) */}
        <div style={{ background: '#f8f9fb', borderRadius: '18px', padding: '16px 18px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#374151' }}>Retail Menu Price</span>
              <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>
                Profit: +₱{grossProfit.toFixed(2)} / cup ({grossMarginPct.toFixed(0)}% Margin)
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>₱</span>
              <input
                type="number"
                step="5"
                min="0"
                value={recipe.menuPrice || 180.00}
                onChange={(e) => handlePriceChange(e.target.value)}
                style={{
                  width: '85px',
                  padding: '4px 6px',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  textAlign: 'right',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <input
            type="range"
            min="60"
            max="400"
            step="5"
            value={recipe.menuPrice || 180.00}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="clean-slider"
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.68rem', color: '#6b7280' }}>
            <span>Min: ₱60</span>
            <span style={{ color: '#d97706', fontWeight: 700 }}>Suggested: ₱{suggestedMenuPrice.toFixed(0)} (80% GM)</span>
            <span>Max: ₱400</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-clean btn-clean-primary"
            onClick={onOpenSopCard}
            style={{ flex: 1, padding: '12px' }}
          >
            <BookOpen size={16} />
            <span>Export Barista SOP</span>
          </button>

          <button
            className="btn-clean btn-clean-secondary"
            onClick={onOpenMarketplace}
            style={{ flex: 1, padding: '12px' }}
          >
            <ShoppingBag size={16} />
            <span>Order Wholesale</span>
          </button>
        </div>
      </div>
    </div>
  )
}
