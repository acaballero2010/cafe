import React, { useState } from 'react'
import { X, Sparkles, Wand2, BookOpen, Plus, Minus, Check } from 'lucide-react'
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
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  if (!isOpen) return null

  const handlePriceStep = (delta) => {
    const currentPrice = Number(recipe.menuPrice || 180)
    const newPrice = Math.max(10, currentPrice + delta)
    onUpdateRecipe({
      ...recipe,
      menuPrice: newPrice
    })
  }

  const handlePriceInput = (val) => {
    const num = Math.max(0, Number(val) || 0)
    onUpdateRecipe({
      ...recipe,
      menuPrice: num
    })
  }

  const handleGenerateAiRender = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2500)
    }, 1200)
  }

  const { totalCogs, grossProfit, grossMarginPct, vessel } = metrics

  const vesselSubtext = vessel.id?.includes('coupe') 
    ? '7oz Nick & Nora Glass • Cold Cocktail' 
    : `${vessel.volumeOz}oz ${vessel.name.split(' (')[0]} • Base Spec`

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.6)',
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
          maxWidth: '540px',
          maxHeight: '92vh',
          overflowY: 'auto',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '28px 28px 0 0',
          padding: '16px 20px 32px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxSizing: 'border-box'
        }}
      >
        {/* Grab Handle */}
        <div style={{ width: '40px', height: '4px', background: '#cbd5e1', borderRadius: '9999px', margin: '0 auto 4px' }} />

        {/* 1. Header & Title Simplification */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                fontSize: '1.18rem', // ~18pt bold
                fontWeight: 800,
                color: '#0f172a',
                fontFamily: 'var(--font-display)',
                lineHeight: 1.25,
                margin: 0
              }}
            >
              {recipe.name || 'Smoked Rosemary Agave Mezcal Sour'}
            </h2>
            <p style={{ fontSize: '0.81rem', color: '#64748b', marginTop: '4px', fontWeight: 500, margin: '4px 0 0 0' }}>
              {vesselSubtext}
            </p>
          </div>

          {/* Clean Circular Close Button (✕) */}
          <button
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              color: '#475569',
              transition: 'background 0.15s ease'
            }}
            aria-label="Close Preview"
          >
            <X size={17} />
          </button>
        </div>

        {/* 2. Realistic Visual Canvas Stage */}
        <RealTimeCanvas
          metrics={metrics}
          recipe={recipe}
          onOpenSopCard={onOpenSopCard}
        />

        {/* 3. Above-the-Fold Economics Card */}
        <div
          style={{
            background: '#f8fafc',
            borderRadius: '18px',
            padding: '14px 16px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {/* Target Retail Price Input with Quick Stepper Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b' }}>
              Target Retail Price
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => handlePriceStep(-10)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#334155',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
                aria-label="Decrease price by 10"
              >
                <Minus size={13} />
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '2px 8px',
                  minWidth: '85px',
                  height: '32px',
                  boxSizing: 'border-box'
                }}
              >
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginRight: '2px' }}>₱</span>
                <input
                  type="number"
                  step="5"
                  min="0"
                  value={recipe.menuPrice || 380}
                  onChange={(e) => handlePriceInput(e.target.value)}
                  style={{
                    width: '100%',
                    fontSize: '0.94rem',
                    fontWeight: 800,
                    border: 'none',
                    textAlign: 'right',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none',
                    color: '#0f172a',
                    padding: 0,
                    background: 'transparent'
                  }}
                />
              </div>

              <button
                onClick={() => handlePriceStep(10)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#334155',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
                aria-label="Increase price by 10"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* Live Margin Metrics: Horizontal 3-Column Pill Container */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1.15fr',
              gap: '8px',
              background: '#ffffff',
              borderRadius: '14px',
              padding: '10px 12px',
              border: '1px solid #e2e8f0'
            }}
          >
            {/* Column 1: Cost (COGS) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Cost (COGS)
              </span>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                ₱{totalCogs.toFixed(2)}
              </span>
            </div>

            {/* Column 2: Gross Profit */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Gross Profit
              </span>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                +₱{grossProfit.toFixed(2)}
              </span>
            </div>

            {/* Column 3: Gross Margin % (Vibrant Green Badge) */}
            <div
              style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '10px',
                padding: '4px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '0.60rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                Margin %
              </span>
              <span style={{ fontSize: '0.96rem', fontWeight: 900, color: '#047857', fontFamily: 'var(--font-mono)' }}>
                {grossMarginPct.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* 4. Primary Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '2px' }}>
          {/* Primary Action Button (Full-width, Warm Orange Accent) */}
          <button
            onClick={handleGenerateAiRender}
            disabled={isGenerating}
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {isGenerating ? (
              <>
                <Sparkles size={16} className="animate-spin" />
                <span>Generating High-Res AI Render...</span>
              </>
            ) : isSaved ? (
              <>
                <Check size={16} />
                <span>Render Generated & Saved!</span>
              </>
            ) : (
              <>
                <Wand2 size={16} />
                <span>Generate High-Res AI Render</span>
              </>
            )}
          </button>

          {/* Secondary Action Button / Link */}
          <button
            onClick={onOpenSopCard}
            style={{
              width: '100%',
              height: '44px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <BookOpen size={15} color="#64748b" />
            <span>Save & Export Barista SOP</span>
          </button>
        </div>
      </div>
    </div>
  )
}

