import React, { useState, useRef, useEffect } from 'react'
import { 
  ChevronDown, Crown, User, ShieldCheck, LogOut, FileText, 
  Sparkles, ExternalLink, Moon, Sun, ShoppingBag
} from 'lucide-react'
import { triggerHaptic } from '../utils/haptics'

export function MobileHeader({
  activeVenue,
  setActiveVenue,
  activeTab = 'home',
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const categories = [
    { id: 'coffee', label: 'Coffee' },
    { id: 'boba', label: 'Boba & Tea' },
    { id: 'cocktail', label: 'Cocktail' }
  ]

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isUserMenuOpen])

  const getTitle = () => {
    switch (activeTab) {
      case 'home': return 'PourCraft'
      case 'studio': return 'Recipe Studio'
      case 'rnd_lab': return 'R&D Formulation Lab'
      case 'batches': return 'Batch Preps'
      case 'marketplace': return 'Wholesale Market'
      case 'matrix': return 'Menu Matrix'
      case 'profile': return 'My Account'
      default: return 'PourCraft'
    }
  }

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'platform_admin'

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e2e8f0' }}>
      {/* 1. Sleek Streamlined Top Bar */}
      <div
        className="app-responsive-frame"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '54px',
          padding: '0 16px'
        }}
      >
        {/* Left Side: Clean Brand Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
              fontSize: '1rem'
            }}
          >
            🧪
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
            {getTitle()}
          </span>
        </div>

        {/* Right Side: Streamlined Actions & User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }} ref={menuRef}>
          {/* Marketplace Cart Button if on market tab */}
          {activeTab === 'marketplace' && (
            <button
              onClick={onOpenCart}
              style={{
                position: 'relative',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Open Cart"
            >
              <ShoppingBag size={16} color="#0f172a" />
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
            </button>
          )}

          {/* Unified Profile & Persona Avatar Button */}
          <button
            onClick={() => {
              triggerHaptic('tap')
              setIsUserMenuOpen(!isUserMenuOpen)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px 5px 8px',
              borderRadius: '24px',
              background: isAdmin ? '#fffbeb' : '#f8fafc',
              border: isAdmin ? '1px solid #fde68a' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>{currentUser?.avatar || (isAdmin ? '👑' : '👨‍🍳')}</span>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: isAdmin ? '#b45309' : '#334155' }}>
              {currentUser?.name ? currentUser.name.split(' ')[0] : 'Account'}
            </span>
            <ChevronDown size={13} color={isAdmin ? '#b45309' : '#64748b'} style={{ transform: isUserMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {/* Streamlined Dropdown Menu */}
          {isUserMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '230px',
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e2e8f0',
                padding: '8px',
                zIndex: 60,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              {/* User Info Header */}
              <div style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                  {currentUser?.name || 'Barista User'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <span>{currentUser?.shopName || 'PourCraft Studio'}</span>
                  <span>•</span>
                  <span style={{ color: isAdmin ? '#d97706' : '#10b981', fontWeight: 700 }}>
                    {isAdmin ? 'Admin' : 'Creator'}
                  </span>
                </div>
              </div>

              {/* Admin Portal (if admin) */}
              {isAdmin && (
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    triggerHaptic('selection')
                    onOpenAdminPortal()
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    color: '#b45309',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Crown size={14} color="#d97706" />
                  <span>Admin Wholesale Console</span>
                </button>
              )}

              {/* Barista SOP Sheet */}
              <button
                onClick={() => {
                  setIsUserMenuOpen(false)
                  triggerHaptic('tap')
                  onOpenSop()
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#334155',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <FileText size={14} color="#64748b" />
                <span>Barista Station SOP</span>
              </button>

              {/* Persona Switcher */}
              <button
                onClick={() => {
                  setIsUserMenuOpen(false)
                  triggerHaptic('tap')
                  onOpenAdminLogin()
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#334155',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <User size={14} color="#64748b" />
                <span>Switch User / Admin</span>
              </button>

              {/* Return to Overview Landing */}
              <button
                onClick={() => {
                  setIsUserMenuOpen(false)
                  triggerHaptic('tap')
                  onExitToLanding()
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderTop: '1px solid #f1f5f9',
                  marginTop: '2px'
                }}
              >
                <LogOut size={14} color="#94a3b8" />
                <span>Exit to Overview</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Category Filter Pills (Studio Tab Only) */}
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
