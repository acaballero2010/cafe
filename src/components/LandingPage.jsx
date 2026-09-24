import React, { useState } from 'react'
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Camera, 
  FileText, 
  Scale, 
  ShoppingBag, 
  TrendingUp, 
  Zap, 
  Coffee, 
  Star, 
  ChevronRight, 
  Check, 
  Play, 
  Lock,
  Globe,
  Award,
  Crown,
  Users,
  MessageSquare,
  Flame,
  Search,
  BookOpen
} from 'lucide-react'
import { triggerHaptic } from '../utils/haptics'

export function LandingPage({
  onLaunchStudio = () => {},
  onOpenLogin = () => {},
  onOpenSignUp = () => {},
  onOpenAdmin = () => {}
}) {
  const [activeFeatureTab, setActiveFeatureTab] = useState('costing') // 'costing' | 'community' | 'sourcing' | 'sensory'

  const features = [
    {
      id: 'costing',
      title: '₱ Gram-Precision Beverage Costing & Margin Engine',
      icon: <Layers size={18} color="#d97706" />,
      desc: 'Calculate exact pour costs per milliliter with liquid density Brix, ice displacement physics, and barista purge allowances. Model instant gross margin across 12oz, 16oz, and 22oz formats.',
      stat: '78.5%',
      statLabel: 'Avg Target Gross Margin'
    },
    {
      id: 'community',
      title: '🔥 Recipe Creator Hub, Ratings & Tasting Reviews',
      icon: <Flame size={18} color="#ea580c" />,
      desc: 'Discover new formulations from top baristas, consultants, and mixologists. Rate recipes, leave sensory tasting notes, and publish your own signature drink recipes directly to the community.',
      stat: '5-Star',
      statLabel: 'Community Tasting Notes'
    },
    {
      id: 'sourcing',
      title: '🏬 Wholesale Ingredient Intelligence & Supplier Directory',
      icon: <ShoppingBag size={18} color="#15803d" />,
      desc: 'Explore vetted Philippine suppliers for specialty coffee beans, ceremonial matcha, boba syrups, and packaging. Direct wholesale catalogs with live price-spike alerts.',
      stat: '₱ PHP',
      statLabel: 'Direct Wholesale Sourcing'
    },
    {
      id: 'sensory',
      title: '🎯 Sensory Radar Profiling & Commercial Sub-Recipes',
      icon: <Scale size={18} color="#8b5cf6" />,
      desc: 'Map Sweetness, Acidity, Body, Bitterness, Aroma, and Creaminess with live sensory radar charts. Build reusable batch concentrates, syrups, and cold foams.',
      stat: '6-Axis',
      statLabel: 'Sensory Calibration'
    }
  ]

  const tiers = [
    {
      name: 'Independent Barista / Creator',
      price: 'Free',
      period: 'Forever',
      desc: 'For baristas, mixology enthusiasts, and recipe developers.',
      badge: 'FREE FOREVER',
      features: [
        'Full Gram-Precision Layer Costing Engine',
        'Explore Community Recipes & Rate Formulations',
        'Upload & Publish Signature Drink Formulations',
        'Direct PH Wholesale Supplier Directory Access'
      ],
      cta: 'Launch Free Studio Demo',
      highlight: false
    },
    {
      name: 'R&D Consultant & Architect',
      price: '₱1,490',
      period: '/ month',
      desc: 'For beverage consultants, coffee roasters & training specialists.',
      badge: 'MOST POPULAR',
      features: [
        'Unlimited Recipe Formulations & Collections',
        '8K Beverage Photo Studio & Visual Exports',
        'Sensory Radar Profiling & Commercial Sub-Recipes',
        'Standardized Barista SOP Sheet Exporter',
        'Supplier Wholesale Price-Spike Guard'
      ],
      cta: 'Start Consultant Account',
      highlight: true
    },
    {
      name: 'Platform SuperAdmin',
      price: 'Enterprise',
      period: 'Access',
      desc: 'For platform catalog curators and supplier pricelist administrators.',
      badge: 'ADMIN PORTAL',
      features: [
        'Master Ingredient Catalog Management',
        'CSV/Excel Wholesale Pricelist Broadcast',
        'Community Recipe Moderation & Spotlights',
        'Wholesale Supplier Account Ingestion',
        'Real-time Metric Monitoring & Tenant Control'
      ],
      cta: 'Admin Console Access',
      highlight: false
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#080c14', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Modern Sticky Landing Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(8, 12, 20, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '12px 20px'
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo & Brand */}
          <div 
            onClick={() => {
              triggerHaptic('tap')
              onLaunchStudio()
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <div 
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)'
              }}
            >
              <Zap size={18} />
            </div>
            <div>
              <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>
                PourCraft <span style={{ color: '#f59e0b' }}>OS</span>
              </span>
              <span style={{ display: 'block', fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Beverage R&D • Costing • Sourcing
              </span>
            </div>
          </div>

          {/* Nav Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                triggerHaptic('tap')
                onOpenLogin()
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>

            <button
              onClick={() => {
                triggerHaptic('success')
                onLaunchStudio()
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(217, 119, 6, 0.35)'
              }}
            >
              <span>Launch Studio</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section 
        style={{ 
          position: 'relative', 
          padding: '60px 20px 40px', 
          textAlign: 'center',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(217, 119, 6, 0.18), rgba(8, 12, 20, 0))'
        }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          
          {/* Eyebrow badge */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              fontSize: '0.74rem',
              fontWeight: 800,
              marginBottom: '18px'
            }}
          >
            <Sparkles size={14} />
            <span>THE RECIPE R&D, COSTING & SOURCING PLATFORM FOR BEVERAGE CREATORS</span>
          </div>

          <h1 
            style={{ 
              fontSize: 'clamp(2rem, 5vw, 3.4rem)', 
              fontWeight: 900, 
              lineHeight: 1.12, 
              color: '#ffffff', 
              letterSpacing: '-0.03em', 
              margin: '0 0 18px',
              fontFamily: 'var(--font-display)'
            }}
          >
            Master Beverage <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Formulation, Costing</span> & Ingredient Sourcing
          </h1>

          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: '#94a3b8', lineHeight: 1.6, margin: '0 auto 30px', maxWidth: '640px' }}>
            Engineered for baristas, beverage consultants, and R&D chefs. Compute gram-precision pour costs, explore ingredient physics, find verified wholesale suppliers in the Philippines, and share recipes with a community of craft creators.
          </p>

          {/* Main Action CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
            <button
              onClick={() => {
                triggerHaptic('success')
                onLaunchStudio()
              }}
              style={{
                padding: '14px 28px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.94rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(217, 119, 6, 0.45)'
              }}
            >
              <Zap size={18} />
              <span>Launch Live Recipe Studio</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('tap')
                onOpenSignUp()
              }}
              style={{
                padding: '14px 24px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                fontSize: '0.94rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Users size={16} />
              <span>Create Creator Account</span>
            </button>
          </div>

          {/* Social Proof Highlights */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', fontSize: '0.78rem', color: '#cbd5e1' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#22c55e" /> Free Access for Baristas & Creators
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#22c55e" /> Direct PH Wholesale Sourcing (₱ PHP)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#22c55e" /> Community Ratings & Tasting Reviews
            </span>
          </div>
        </div>
      </section>

      {/* 3. Interactive Feature Tabs */}
      <section style={{ padding: '40px 20px 60px', maxWidth: '1080px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: '0 0 8px', fontFamily: 'var(--font-display)' }}>
            Precision Tools for Beverage Innovators
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0 }}>
            Everything you need to design, cost, calibrate, source, and share professional drink formulas.
          </p>
        </div>

        {/* Feature Tab Selectors */}
        <div 
          style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            gap: '8px', 
            padding: '4px', 
            background: 'rgba(255, 255, 255, 0.04)', 
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '24px'
          }}
        >
          {features.map(f => {
            const isActive = activeFeatureTab === f.id
            return (
              <button
                key={f.id}
                onClick={() => {
                  triggerHaptic('tap')
                  setActiveFeatureTab(f.id)
                }}
                style={{
                  flex: '1 0 auto',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? '#1e293b' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {f.icon}
                <span>{f.title.split(' ')[1]}</span>
              </button>
            )
          })}
        </div>

        {/* Active Feature Detail Showcase Card */}
        {(() => {
          const current = features.find(f => f.id === activeFeatureTab) || features[0]
          return (
            <div
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '30px 24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'inline-flex', padding: '6px 12px', borderRadius: '8px', background: 'rgba(217, 119, 6, 0.15)', color: '#f59e0b', fontSize: '0.72rem', fontWeight: 800, marginBottom: '12px' }}>
                  CORE PILLAR
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', margin: '0 0 12px' }}>
                  {current.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 20px' }}>
                  {current.desc}
                </p>
                <button
                  onClick={() => {
                    triggerHaptic('tap')
                    onLaunchStudio()
                  }}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    color: '#0f172a',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Explore in Live Studio</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#f59e0b', fontFamily: 'var(--font-display)' }}>
                  {current.stat}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, marginTop: '4px' }}>
                  {current.statLabel}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '8px' }}>
                  Calibrated for Philippine specialty coffee, ceremonial matcha & craft tea creators
                </div>
              </div>
            </div>
          )
        })()}
      </section>

      {/* 4. Pricing / Access Tiers */}
      <section style={{ padding: '40px 20px 60px', maxWidth: '1080px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: '0 0 8px', fontFamily: 'var(--font-display)' }}>
            Transparent Access for Creators & Consultants
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0 }}>
            Start completely free as an independent barista or scale up with consultant R&D tools.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {tiers.map((t, idx) => (
            <div
              key={idx}
              style={{
                background: t.highlight ? '#1e293b' : '#0f172a',
                border: t.highlight ? '2px solid #d97706' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {t.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '20px',
                    background: t.highlight ? '#d97706' : 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    letterSpacing: '0.04em'
                  }}
                >
                  {t.badge}
                </span>
              )}

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: '0 0 4px' }}>
                  {t.name}
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '0 0 16px', minHeight: '32px' }}>
                  {t.desc}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-display)' }}>
                    {t.price}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {t.period}
                  </span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {t.features.map((feat, fIdx) => (
                    <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.76rem', color: '#cbd5e1' }}>
                      <Check size={14} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  triggerHaptic('tap')
                  if (t.name.includes('Admin')) {
                    onOpenAdmin()
                  } else if (t.price === 'Free') {
                    onLaunchStudio()
                  } else {
                    onOpenSignUp()
                  }
                }}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '10px',
                  background: t.highlight ? 'linear-gradient(135deg, #d97706, #b45309)' : 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border: t.highlight ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Footer */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '24px 20px', textAlign: 'center', fontSize: '0.74rem', color: '#64748b' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            © 2026 PourCraft OS. Philippine Beverage R&D, Costing & Creator Platform.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={onOpenAdmin}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Crown size={12} color="#f59e0b" />
              <span>Platform SuperAdmin</span>
            </button>
            <button
              onClick={onOpenLogin}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.74rem', cursor: 'pointer' }}
            >
              Creator Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
