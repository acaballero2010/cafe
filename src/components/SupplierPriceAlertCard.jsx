import React, { useState } from 'react'
import { AlertTriangle, TrendingDown, ArrowRight, Check, RefreshCw, Search, ChevronDown, ChevronUp, ShieldCheck, Sparkles, X } from 'lucide-react'

export function SupplierPriceAlertCard({
  onAutoAdjustPrices = () => {},
  onCompareSuppliers = () => {},
  onAcceptMargins = () => {},
  onDismiss = () => {}
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [statusMessage, setStatusMessage] = useState(null)

  // 4 Impacted Drinks Scenario
  const impactedDrinks = [
    {
      id: 'drink-caramel-macchiato',
      name: 'Caramel Macchiato',
      portion: '200ml Fresh Milk',
      oldMargin: 78,
      newMargin: 71,
      oldCost: 38.50,
      newCost: 41.50,
      currentPrice: 175.00,
      suggestedPrice: 188.00,
      icon: '☕'
    },
    {
      id: 'drink-spanish-latte',
      name: 'Spanish Latte',
      portion: '200ml Fresh Milk',
      oldMargin: 80,
      newMargin: 73,
      oldCost: 36.00,
      newCost: 39.00,
      currentPrice: 180.00,
      suggestedPrice: 195.00,
      icon: '🥛'
    },
    {
      id: 'drink-iced-latte',
      name: 'Iced Caffe Latte',
      portion: '250ml Fresh Milk',
      oldMargin: 82,
      newMargin: 74,
      oldCost: 32.00,
      newCost: 35.75,
      currentPrice: 160.00,
      suggestedPrice: 175.00,
      icon: '🧊'
    },
    {
      id: 'drink-matcha-latte',
      name: 'Ceremonial Matcha Latte',
      portion: '200ml Fresh Milk',
      oldMargin: 74,
      newMargin: 68,
      oldCost: 52.00,
      newCost: 55.00,
      currentPrice: 200.00,
      suggestedPrice: 215.00,
      icon: '🍵'
    }
  ]

  const handleAutoAdjust = () => {
    setStatusMessage({
      type: 'success',
      text: '✓ 4 menu prices updated (+₱15 avg) to preserve target 78% margins.'
    })
    onAutoAdjustPrices(impactedDrinks)
  }

  const handleAccept = () => {
    setStatusMessage({
      type: 'neutral',
      text: '✓ New margins accepted. Catalog unit cost updated to ₱110/L.'
    })
    onAcceptMargins()
  }

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #fed7aa',
        borderRadius: '20px',
        boxShadow: '0 4px 16px rgba(217, 119, 6, 0.08)',
        overflow: 'hidden',
        marginBottom: '16px',
        transition: 'all 0.2s ease'
      }}
    >
      {/* 1. Notification Banner Top Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          padding: '14px 16px',
          borderBottom: '1px solid #fde68a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#b45309',
              flexShrink: 0
            }}
          >
            <AlertTriangle size={17} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#92400e', lineHeight: 1.3 }}>
              Supplier Price Increase: Fresh Dairy Milk (+15%)
            </div>
            <div style={{ fontSize: '0.74rem', color: '#b45309', marginTop: '1px', fontWeight: 600 }}>
              Hacienda Fresh Dairy: <span style={{ textDecoration: 'line-through' }}>₱95.00</span> ➔ <strong>₱110.00/L</strong>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#92400e',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* 2. Margin Impact Breakdown (Calm, empowering presentation) */}
      {isExpanded && (
        <div style={{ padding: '16px' }}>
          {statusMessage ? (
            <div
              style={{
                background: statusMessage.type === 'success' ? '#ecfdf5' : '#f8fafc',
                border: `1px solid ${statusMessage.type === 'success' ? '#a7f3d0' : '#e2e8f0'}`,
                color: statusMessage.type === 'success' ? '#065f46' : '#334155',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{statusMessage.text}</span>
              <button
                onClick={onDismiss}
                style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 800 }}
              >
                Dismiss
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  4 Impacted Menu Recipes
                </span>
                <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <TrendingDown size={12} /> Avg Margin Drop: -6.8%
                </span>
              </div>

              {/* Impacted Drinks List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {impactedDrinks.map((drink) => {
                  const drop = drink.oldMargin - drink.newMargin
                  return (
                    <div
                      key={drink.id}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        borderRadius: '14px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{drink.icon}</span>
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                            {drink.name}
                          </div>
                          <div style={{ fontSize: '0.70rem', color: '#64748b' }}>
                            {drink.portion} • COGS: ₱{drink.oldCost.toFixed(2)} ➔ <strong>₱{drink.newCost.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>
                            {drink.oldMargin}%
                          </span>
                          <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#dc2626', fontFamily: 'var(--font-mono)' }}>
                            {drink.newMargin}%
                          </span>
                        </div>
                        <span style={{ fontSize: '0.66rem', color: '#ef4444', fontWeight: 700, background: '#fee2e2', padding: '1px 5px', borderRadius: '4px' }}>
                          -{drop}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 3. One-Tap Operator Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Action A: Auto-adjust Menu Prices (Primary) */}
                <button
                  onClick={handleAutoAdjust}
                  style={{
                    width: '100%',
                    height: '46px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #d97706, #b45309)',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 3px 10px rgba(217, 119, 6, 0.3)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Sparkles size={16} />
                  <span>Auto-Adjust Menu Prices (Preserve 78% Margin)</span>
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* Action B: Compare Alternative Suppliers (Secondary) */}
                  <button
                    onClick={onCompareSuppliers}
                    style={{
                      flex: 1,
                      height: '42px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#334155',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Search size={14} color="#64748b" />
                    <span>Compare Suppliers (₱95/L)</span>
                  </button>

                  {/* Action C: Accept New Margins (Tertiary/Ghost) */}
                  <button
                    onClick={handleAccept}
                    style={{
                      padding: '0 14px',
                      height: '42px',
                      borderRadius: '12px',
                      border: '1px solid transparent',
                      background: '#f8fafc',
                      color: '#64748b',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Accept Margins
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
