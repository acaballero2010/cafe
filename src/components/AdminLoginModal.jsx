import React, { useState } from 'react'
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Mail, 
  X, 
  Check, 
  Sparkles, 
  ArrowRight,
  LogOut,
  Building2,
  Coffee,
  Crown
} from 'lucide-react'
import { AuthDatabase, INITIAL_USERS } from '../utils/authDatabase'
import { triggerHaptic } from '../utils/haptics'

export function AdminLoginModal({
  isOpen = false,
  onClose = () => {},
  currentUser,
  onLoginSuccess = () => {},
  onOpenAdminPortal = () => {}
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [activeTab, setActiveTab] = useState('quick') // 'quick' | 'form'

  if (!isOpen) return null

  const handleQuickLogin = (user) => {
    triggerHaptic('success')
    AuthDatabase.setCurrentUser(user)
    onLoginSuccess(user)
    onClose()
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    const users = AuthDatabase.getUsers()
    const match = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase())

    if (match) {
      triggerHaptic('success')
      AuthDatabase.setCurrentUser(match)
      onLoginSuccess(match)
      onClose()
    } else {
      // Create and log in as new cafe owner
      const newUser = AuthDatabase.addUser({
        name: email.split('@')[0],
        email: email.trim(),
        role: 'cafe_owner',
        shopName: `${email.split('@')[0]}'s Cafe`,
        branch: 'Main Branch',
        region: 'Metro Manila',
        tier: 'Standard Plan'
      })
      triggerHaptic('success')
      AuthDatabase.setCurrentUser(newUser)
      onLoginSuccess(newUser)
      onClose()
    }
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'platform_admin':
        return { label: 'Platform SuperAdmin', bg: '#fef3c7', color: '#b45309', border: '#fde68a', icon: <Crown size={12} /> }
      case 'head_barista':
        return { label: 'Head Barista', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', icon: <Coffee size={12} /> }
      default:
        return { label: 'Cafe Owner & R&D', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', icon: <Building2 size={12} /> }
    }
  }

  return (
    <div className="clean-modal-overlay" onClick={onClose}>
      <div 
        className="clean-modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '480px', padding: '24px' }}
      >
        <div className="modal-drag-handle" />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #111827, #374151)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <ShieldCheck size={20} color="#f59e0b" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                PourCraft User & Admin Access
              </h2>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0' }}>
                Role-based platform control & tenant switcher
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Active Session Card */}
        {currentUser && (
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '12px 14px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>{currentUser.avatar || '👤'}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                    {currentUser.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '999px',
                      background: getRoleBadge(currentUser.role).bg,
                      color: getRoleBadge(currentUser.role).color,
                      border: `1px solid ${getRoleBadge(currentUser.role).border}`
                    }}
                  >
                    {getRoleBadge(currentUser.role).label}
                  </span>
                </div>
                <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '1px 0 0' }}>
                  {currentUser.shopName} • {currentUser.email}
                </p>
              </div>
            </div>

            {currentUser.role === 'platform_admin' && (
              <button
                onClick={() => {
                  onClose()
                  onOpenAdminPortal()
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #d97706, #b45309)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)'
                }}
              >
                <span>Console</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        )}

        {/* Tab Toggle */}
        <div className="pill-group" style={{ marginBottom: '16px' }}>
          <button
            className={`pill-btn ${activeTab === 'quick' ? 'active' : ''}`}
            onClick={() => setActiveTab('quick')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <span>⚡ 1-Tap Quick Switch</span>
          </button>
          <button
            className={`pill-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <span>🔑 Credentials Login</span>
          </button>
        </div>

        {activeTab === 'quick' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 4px' }}>
              Switch Persona & Access Level
            </p>

            {AuthDatabase.getUsers().map(user => {
              const badge = getRoleBadge(user.role)
              const isCurrent = currentUser?.id === user.id
              return (
                <div
                  key={user.id}
                  onClick={() => handleQuickLogin(user)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: isCurrent ? '1.5px solid #d97706' : '1px solid #e2e8f0',
                    background: isCurrent ? '#fffbeb' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.25rem' }}>{user.avatar || '👤'}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                          {user.name}
                        </span>
                        <span
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: '4px',
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          {badge.icon}
                          {badge.label}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {user.shopName} • {user.region}
                      </span>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} /> Active
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                      Switch →
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {errorMsg && (
              <div style={{ padding: '8px 12px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecdd3', color: '#b91c1c', fontSize: '0.75rem' }}>
                {errorMsg}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="admin@pourcraft.io"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrorMsg('')
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-clean btn-clean-primary"
              style={{ width: '100%', marginTop: '6px' }}
            >
              <span>Sign In / Register</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
