import React, { useState } from 'react'
import { 
  Zap, 
  Lock, 
  Mail, 
  Store, 
  User, 
  MapPin, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Coffee, 
  Crown, 
  Sparkles, 
  ArrowLeft,
  Eye,
  EyeOff,
  Building2
} from 'lucide-react'
import { AuthDatabase } from '../utils/authDatabase'
import { triggerHaptic } from '../utils/haptics'

export function AuthPage({
  initialMode = 'signin', // 'signin' | 'signup'
  onLoginSuccess = () => {},
  onBackToLanding = () => {},
  onOpenOnboarding = () => {}
}) {
  const [mode, setMode] = useState(initialMode) // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')

  // Sign Up Form State
  const [signUpShopName, setSignUpShopName] = useState('')
  const [signUpOwnerName, setSignUpOwnerName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpRegion, setSignUpRegion] = useState('Metro Manila')
  const [signUpCategory, setSignUpCategory] = useState('espresso')

  const handleQuickLogin = (user) => {
    triggerHaptic('success')
    AuthDatabase.setCurrentUser(user)
    onLoginSuccess(user)
  }

  const handleSignInSubmit = (e) => {
    e.preventDefault()
    if (!signInEmail.trim()) {
      setErrorMsg('Please enter your business email.')
      return
    }

    const users = AuthDatabase.getUsers()
    const match = users.find(u => u.email.toLowerCase() === signInEmail.trim().toLowerCase())

    if (match) {
      triggerHaptic('success')
      AuthDatabase.setCurrentUser(match)
      onLoginSuccess(match)
    } else {
      // Auto-register and log in
      const created = AuthDatabase.addUser({
        name: signInEmail.split('@')[0],
        email: signInEmail.trim(),
        role: 'cafe_owner',
        shopName: `${signInEmail.split('@')[0]}'s Cafe Studio`,
        branch: 'Main Branch',
        region: 'Metro Manila',
        tier: 'Standard Plan'
      })
      triggerHaptic('success')
      AuthDatabase.setCurrentUser(created)
      onLoginSuccess(created)
    }
  }

  const handleSignUpSubmit = (e) => {
    e.preventDefault()
    if (!signUpEmail.trim() || !signUpShopName.trim()) {
      setErrorMsg('Please fill in your shop name and business email.')
      return
    }

    const created = AuthDatabase.addUser({
      name: signUpOwnerName.trim() || signUpShopName.trim(),
      email: signUpEmail.trim(),
      role: 'cafe_owner',
      shopName: signUpShopName.trim(),
      branch: 'Flagship Branch',
      region: signUpRegion,
      tier: 'Pro Commercial R&D'
    })

    triggerHaptic('success')
    AuthDatabase.setCurrentUser(created)
    onLoginSuccess(created)
    onOpenOnboarding()
  }

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        background: '#080c14', 
        color: '#f8fafc', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative'
      }}
    >
      {/* Background glow ambient */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.12) 0%, rgba(8, 12, 20, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Back button */}
      <button
        onClick={() => {
          triggerHaptic('tap')
          onBackToLanding()
        }}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: '#cbd5e1',
          padding: '8px 14px',
          borderRadius: '999px',
          fontSize: '0.78rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <ArrowLeft size={14} />
        <span>Back to Overview</span>
      </button>

      {/* Main Auth Container Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '28px 24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div 
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #d97706, #b45309)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(217, 119, 6, 0.4)',
              marginBottom: '12px'
            }}
          >
            <Zap size={22} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0, fontFamily: 'var(--font-display)' }}>
            PourCraft <span style={{ color: '#f59e0b' }}>OS</span>
          </h2>
          <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '4px 0 0' }}>
            {mode === 'signin' ? 'Sign in to your Beverage R&D workspace' : 'Create your cafe tenant & seed initial formulations'}
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div 
          style={{ 
            display: 'flex', 
            background: 'rgba(255, 255, 255, 0.06)', 
            padding: '4px', 
            borderRadius: '999px', 
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <button
            onClick={() => {
              triggerHaptic('tap')
              setMode('signin')
              setErrorMsg('')
            }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '999px',
              border: 'none',
              background: mode === 'signin' ? '#ffffff' : 'transparent',
              color: mode === 'signin' ? '#0f172a' : '#94a3b8',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              triggerHaptic('tap')
              setMode('signup')
              setErrorMsg('')
            }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '999px',
              border: 'none',
              background: mode === 'signup' ? '#d97706' : 'transparent',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Create Shop Account
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '0.75rem', marginBottom: '14px' }}>
            {errorMsg}
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Business Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="chef@kapecraft.ph"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 38px 10px 38px',
                    borderRadius: '10px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(217, 119, 6, 0.35)',
                marginTop: '4px'
              }}
            >
              <span>Sign In to Studio</span>
              <ArrowRight size={14} />
            </button>

            {/* Quick Persona Demo Switcher */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                ⚡ 1-Tap Quick Access (Demo Profiles)
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {AuthDatabase.getUsers().slice(0, 4).map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    style={{
                      padding: '7px 8px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#cbd5e1',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      textAlign: 'left'
                    }}
                  >
                    <span>{u.avatar || '👤'}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '3px' }}>
                Cafe / Store Brand Name
              </label>
              <div style={{ position: 'relative' }}>
                <Store size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Luna Roastworks"
                  value={signUpShopName}
                  onChange={(e) => setSignUpShopName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '3px' }}>
                Head Architect / Owner Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Chef Anton Luna"
                  value={signUpOwnerName}
                  onChange={(e) => setSignUpOwnerName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '3px' }}>
                Business Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  placeholder="anton@lunaroast.ph"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '3px' }}>
                  Wholesale Region
                </label>
                <select
                  value={signUpRegion}
                  onChange={(e) => setSignUpRegion(e.target.value)}
                  style={{ width: '100%', padding: '9px 10px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.78rem' }}
                >
                  <option value="Metro Manila">Metro Manila</option>
                  <option value="Cebu">Cebu</option>
                  <option value="Davao">Davao</option>
                  <option value="North Luzon">North Luzon</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '3px' }}>
                  Primary Focus
                </label>
                <select
                  value={signUpCategory}
                  onChange={(e) => setSignUpCategory(e.target.value)}
                  style={{ width: '100%', padding: '9px 10px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '0.78rem' }}
                >
                  <option value="espresso">☕ Specialty Espresso</option>
                  <option value="matcha">🍵 Ceremonial Matcha</option>
                  <option value="boba">🧋 Boba & Milk Tea</option>
                  <option value="mocktails">🍸 Craft Mocktails</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(217, 119, 6, 0.35)',
                marginTop: '4px'
              }}
            >
              <Sparkles size={14} />
              <span>Create Shop & Launch Wizard</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
