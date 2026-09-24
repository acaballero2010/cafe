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
  Crown,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { AuthDatabase, INITIAL_USERS } from '../utils/authDatabase'
import { loginWithEmailPassword, loginWithGoogle } from '../services/firebaseAuthService'
import { triggerHaptic } from '../utils/haptics'

export function AdminLoginModal({
  isOpen = false,
  onClose = () => {},
  currentUser,
  onLoginSuccess = () => {},
  onOpenAdminPortal = () => {},
  onOpenOnboardingWizard = () => {}
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('quick') // 'quick' | 'form'

  if (!isOpen) return null

  const handleQuickLogin = (user) => {
    triggerHaptic('success')
    AuthDatabase.setCurrentUser(user)
    onLoginSuccess(user)
    onClose()
  }

  const handleGoogleSignIn = async () => {
    setErrorMsg('')
    setIsLoading(true)
    triggerHaptic('tap')

    try {
      const res = await loginWithGoogle()
      if (res.success) {
        triggerHaptic('success')
        onLoginSuccess(res.user)
        onClose()
      } else {
        triggerHaptic('error')
        setErrorMsg(res.error)
      }
    } catch (err) {
      console.error('Google sign in error:', err)
      setErrorMsg('Google authentication failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.')
      return
    }

    setIsLoading(true)
    triggerHaptic('tap')

    try {
      const res = await loginWithEmailPassword(email, password)
      if (res.success) {
        triggerHaptic('success')
        onLoginSuccess(res.user)
        onClose()
      } else {
        triggerHaptic('error')
        setErrorMsg(res.error)
      }
    } catch (err) {
      console.error('Login error:', err)
      setErrorMsg('Authentication failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return { label: 'Platform SuperAdmin', bg: '#fef3c7', color: '#b45309', border: '#fde68a', icon: <Crown size={12} /> }
    }
    return { label: 'Beverage Creator / R&D', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', icon: <Coffee size={12} /> }
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
                PourCraft Access & Firebase Auth
              </h2>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0' }}>
                Role-based platform control & tenant management
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

            {(currentUser.role === 'admin' || currentUser.role === 'platform_admin') && (
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
            <span>🔑 Firebase Credentials</span>
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
          <div>
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>OR EMAIL / PASSWORD</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {errorMsg && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '8px 12px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecdd3', color: '#b91c1c', fontSize: '0.75rem' }}>
                  <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span>{errorMsg}</span>
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
                    required
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
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
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

              <button
                type="submit"
                disabled={isLoading}
                className="btn-clean btn-clean-primary"
                style={{ width: '100%', marginTop: '6px', opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In with Firebase</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Setup Wizard Footer Trigger */}
        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              onClose()
              onOpenOnboardingWizard()
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '10px',
              background: '#fffbeb',
              border: '1px dashed #d97706',
              color: '#92400e',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} color="#d97706" />
            <span>Setup New Cafe Brand (4-Step Wizard)</span>
          </button>
        </div>
      </div>
    </div>
  )
}
