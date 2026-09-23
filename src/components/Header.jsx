import React from 'react'
import { Coffee, Sparkles, Receipt, BookOpen, ShoppingBag, BarChart3, Layers, ChefHat } from 'lucide-react'

export function Header({
  activeVenue,
  setActiveVenue,
  activeTab,
  setActiveTab,
  onOpenOcr,
  onOpenBaristaCard,
  globalMarginPct = 78.4
}) {
  const venues = [
    { id: 'coffee', label: 'Coffee' },
    { id: 'boba', label: 'Boba & Tea' },
    { id: 'cocktail', label: 'Cocktail' }
  ]

  const navTabs = [
    { id: 'builder', label: 'Drink Studio', icon: Layers },
    { id: 'sub-recipes', label: 'Batch Preps', icon: ChefHat },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'menu-matrix', label: 'Engineering', icon: BarChart3 }
  ]

  return (
    <header className="app-top-nav">
      <div className="top-nav-inner">
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: '#111827',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Coffee size={18} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                PourCraft
              </div>
            </div>
          </div>

          {/* Venue Segmented Control */}
          <div className="pill-group">
            {venues.map(v => (
              <button
                key={v.id}
                className={`pill-btn ${activeVenue === v.id ? 'active' : ''}`}
                onClick={() => setActiveVenue(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Tabs (Studio / Batches / Marketplace / Matrix) */}
        <div className="pill-group">
          {navTabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                className={`pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Right Tools & Margin Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn-clean btn-clean-secondary btn-clean-sm"
            onClick={onOpenOcr}
          >
            <Receipt size={14} color="#0284c7" />
            <span>Snap Invoice</span>
          </button>

          <button
            className="btn-clean btn-clean-secondary btn-clean-sm"
            onClick={onOpenBaristaCard}
          >
            <BookOpen size={14} color="#7c3aed" />
            <span>Quick SOP</span>
          </button>

          <div
            style={{
              background: 'var(--margin-green-bg)',
              border: '1px solid var(--margin-green-border)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 600 }}>Margin</span>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>
              {globalMarginPct.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
