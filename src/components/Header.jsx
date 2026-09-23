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
    { id: 'coffee', label: 'Coffee Lab', icon: '☕' },
    { id: 'boba', label: 'Boba & Tea', icon: '🧋' },
    { id: 'cocktail', label: 'Craft Lounge', icon: '🍸' }
  ]

  const navTabs = [
    { id: 'recipe-lab', label: 'Recipe Costing Lab', icon: Layers },
    { id: 'sub-recipes', label: 'Batch Preps & Yields', icon: ChefHat },
    { id: 'ai-studio', label: 'AI Visual Studio', icon: Sparkles },
    { id: 'marketplace', label: 'B2B Supply & Group Buy', icon: ShoppingBag },
    { id: 'menu-matrix', label: 'Menu Engineering', icon: BarChart3 }
  ]

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand */}
        <div className="brand-badge">
          <div className="brand-logo-icon">
            <Coffee size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>PourCraft</span>
              <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>OS PRO</span>
            </div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Specialty Beverage Costing & AI Studio
            </p>
          </div>
        </div>

        {/* Venue Switcher */}
        <div className="venue-selector">
          {venues.map(v => (
            <button
              key={v.id}
              className={`venue-btn ${activeVenue === v.id ? 'active' : ''}`}
              onClick={() => setActiveVenue(v.id)}
            >
              <span>{v.icon}</span>
              <span>{v.label}</span>
            </button>
          ))}
        </div>

        {/* Action Shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenOcr}
            title="Snap Invoice OCR"
          >
            <Receipt size={14} style={{ color: '#38bdf8' }} />
            <span style={{ display: 'none', md: 'inline' }}>Snap Invoice</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenBaristaCard}
            title="Barista SOP Card"
          >
            <BookOpen size={14} style={{ color: '#a855f7' }} />
            <span style={{ display: 'none', md: 'inline' }}>SOP Card</span>
          </button>

          <div
            className="glass-panel"
            style={{
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}
          >
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Avg GM</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              {globalMarginPct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="nav-tabs" style={{ marginTop: '8px', padding: '4px 0 0 0', border: 'none' }}>
        {navTabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </header>
  )
}
