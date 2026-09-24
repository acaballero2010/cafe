import React from 'react'
import { ChevronLeft, MoreVertical, Sparkles, ShieldCheck, Crown, User } from 'lucide-react'
import { triggerHaptic } from '../utils/haptics'

export function MobileHeader({
  activeVenue,
  setActiveVenue,
  activeTab = 'studio',
  totalBatches = 3,
  cartCount = 2,
  activeRegion = 'Metro Manila',
  currentUser,
  onOpenRegion,
  onOpenCart,
  onCreateBatch,
  onOpenSop,
  onOpenOcr,
  onOpenAdminLogin = () => {},
  onOpenAdminPortal = () => {},
  onOpenTrending = () => {},
  onOpenRepository = () => {},
  onExitToLanding = () => {}
}) {
  const categories = [
    { id: 'coffee', label: 'Coffee' },
    { id: 'boba', label: 'Boba & Tea' },
    { id: 'cocktail', label: 'Cocktail' }
  ]

  const getTitle = () => {
    switch (activeTab) {
      case 'home': return 'PourCraft Home'
      case 'studio': return 'Recipe Studio'
      case 'rnd_lab': return 'R&D Formulation Lab'
      case 'batches': return 'Batch Preps'
      case 'marketplace': return 'Wholesale Market'
      case 'matrix': return 'Menu Matrix'
      case 'profile': return 'My Account & Studio'
      default: return 'PourCraft OS'
    }
  }

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e2e8f0' }}>
      {/* 1. iOS-Style Top System Bar */}
      <div
        className="app-responsive-frame"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '52px',
          padding: '0 16px'
        }}
      >
        {/* Top-Left Action */}
        {activeTab === 'marketplace' ? (
          <button
            onClick={onOpenRegion}
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <span>📍 {activeRegion}</span>
            <span style={{ fontSize: '0.65rem' }}>▾</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => {
                triggerHaptic('tap')
                onExitToLanding()
              }}
              style={{
                padding: '5px 10px',
                borderRadius: '999px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#475569',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Return to PourCraft Overview Landing Page"
            >
              <span>🏠</span>
              <span>Overview</span>
            </button>

            <button
              onClick={onOpenOcr}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                cursor: 'pointer'
              }}
              title="Scan Wholesale Invoice OCR"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        )}

        {/* Centered Title & Subtitle */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em', margin: 0 }}>
            {getTitle()}
          </h1>
          {activeTab === 'batches' && (
            <p style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, margin: '2px 0 0 0' }}>
              {totalBatches} Active Kitchen Preps • Auto-tracks shelf life
            </p>
          )}
        </div>

        {/* Top-Right: Dynamic Action Button & User/Admin Portal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {(currentUser?.role === 'admin' || currentUser?.role === 'platform_admin') && (
            <button
              onClick={() => {
                triggerHaptic('light')
                onOpenAdminPortal()
              }}
              style={{
                padding: '5px 9px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.68rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(217, 119, 6, 0.3)'
              }}
              title="Open Platform Admin Console"
            >
              <Crown size={12} />
              <span>Admin</span>
            </button>
          )}

          {/* Persona / Account Switcher Pill */}
          <button
            onClick={() => {
              triggerHaptic('tap')
              onOpenAdminLogin()
            }}
            style={{
              padding: '4px 8px',
              borderRadius: '999px',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontSize: '0.72rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
            title="Switch User / Admin Persona"
          >
            <span>{currentUser?.avatar || '👤'}</span>
            <span style={{ fontSize: '0.65rem' }}>▾</span>
          </button>

          {activeTab === 'marketplace' ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={onOpenCart}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
                title="Open Cart"
              >
                <span style={{ fontSize: '1rem' }}>🛍️</span>
              </button>
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#d97706',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
          ) : activeTab === 'batches' ? (
            <button
              onClick={onCreateBatch}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0f172a',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
              title="Create New Batch Prep"
              aria-label="Create New Batch"
            >
              <span style={{ fontSize: '1.15rem', fontWeight: 600, lineHeight: 1 }}>+</span>
            </button>
          ) : (
            <button
              onClick={onOpenSop}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0f172a',
                cursor: 'pointer'
              }}
              title="Menu Options & Barista SOP"
            >
              <MoreVertical size={18} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Horizontal Category Pills (Only on Recipe Studio) */}
      {activeTab === 'studio' && (
        <div
          className="app-responsive-frame"
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            padding: '4px 16px 10px',
            scrollbarWidth: 'none',
            alignItems: 'center'
          }}
        >
          {categories.map(cat => {
            const isActive = activeVenue === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => {
                  triggerHaptic('selection')
                  setActiveVenue(cat.id)
                }}
                style={{
                  flexShrink: 0,
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  border: isActive ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                  background: isActive ? '#0f172a' : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
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

          <button
            onClick={() => {
              triggerHaptic('light')
              onOpenRepository()
            }}
            style={{
              flexShrink: 0,
              padding: '6px 12px',
              borderRadius: '9999px',
              border: '1px solid #bfdbfe',
              background: '#eff6ff',
              color: '#1d4ed8',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginLeft: 'auto'
            }}
          >
            <span>📚 Recipe Repo</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light')
              onOpenTrending()
            }}
            style={{
              flexShrink: 0,
              padding: '6px 12px',
              borderRadius: '9999px',
              border: '1px solid #fde68a',
              background: '#fffbeb',
              color: '#d97706',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>🔥 Trending</span>
          </button>
        </div>
      )}
    </div>
  )
}
