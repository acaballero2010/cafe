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
  Store, 
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
  Users
} from 'lucide-react'
import { triggerHaptic } from '../utils/haptics'

export function LandingPage({
  onLaunchStudio = () => {},
  onOpenLogin = () => {},
  onOpenSignUp = () => {},
  onOpenAdmin = () => {}
}) {
  const [activeFeatureTab, setActiveFeatureTab] = useState('costing') // 'costing' | 'studio' | 'sop' | 'market'

  const features = [
    {
      id: 'costing',
      title: '₱ Precision Beverage Physics & Costing',
      icon: <Layers size={18} color="#d97706" />,
      desc: 'Calculate exact portion costs per milliliter with liquid density Brix, ice displacement physics, and a 5% barista scrap purge allowance.',
      stat: '78.5%',
      statLabel: 'Avg Target Gross Margin'
    },
    {
      id: 'studio',
      title: '📸 8K Photorealistic Marketing Studio',
      icon: <Camera size={18} color="#ec4899" />,
      desc: 'Generate commercial menu collaterals, custom cup logo decals, and social media formats (1:1 Square, 9:16 Story, 4x6 Tabletop Standees).',
      stat: '8K UHD',
      statLabel: 'Commercial Decal Exports'
    },
    {
      id: 'sop',
      title: '📋 Barista Station SOP & Kitchen Pre-Batch',
      icon: <FileText size={18} color="#0284c7" />,
      desc: 'Turn formulation R&D into step-by-step station build sheets with allergen flags, ice weights, and 500ml–5L prep yield calculators with shelf-life timers.',
      stat: '100%',
      statLabel: 'Recipe Consistency'
    },
    {
      id: 'market',
      title: '🏬 Wholesale Supplier Network & Price-Shift Guard',
      icon: <ShoppingBag size={18} color="#15803d" />,
      desc: 'Direct purchasing from vetted distributors (Dairy, Matcha, Syrups, Packaging) with automated margin impact alerts when ingredient prices shift.',
      stat: 'Net-30',
      statLabel: 'Wholesale Payment Terms'
    }
  ]

  const tiers = [
    {
      name: 'Starter Barista',
      price: 'Free',
      period: 'Forever',
      desc: 'For independent baristas & single-station coffee popups.',
      badge: 'POPULAR',
      features: [
        'Up to 15 Active Recipe Formulations',
        'Live ₱ PHP Layer Costing Engine',
        'Barista Station SOP Card Generator',
        'Basic Commercial Photo Studio'
      ],
      cta: 'Start Free Demo',
      highlight: false
    },
    {
      name: 'Pro R&D Studio',
      price: '₱1,490',
      period: '/ month',
      desc: 'For specialty cafes, cocktail bars & expanding milk tea shops.',
      badge: 'RECOMMENDED',
      features: [
        'Unlimited Formulations & Collections',
        '8K Marketing Studio with Custom Logo Decals',
        'Kitchen Batch Prep & Shelf-Life Tracker',
        'Wholesale Marketplace Net-30 Ordering',
        'Delivery Commission 25% Guard Matrix'
      ],
      cta: 'Launch 14-Day Pro Trial',
      highlight: true
    },
    {
      name: 'Enterprise Multi-Branch',
      price: '₱3,890',
      period: '/ month',
      desc: 'For cafe chains, franchise operations & wholesale roasters.',
      badge: 'MULTI-BRANCH',
      features: [
        'Multi-Store Inventory Synchronization',
        'Platform SuperAdmin & Role Delegation',
        'Automated Supplier Pricelist Bulk Ingestion',
        'Dedicated R&D Beverage Consultant',
        'Custom Point-of-Sale Export APIs'
      ],
      cta: 'Contact Sales / Admin',
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
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)'
              }}
            >
              <Zap size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-display)' }}>
                  PourCraft <span style={{ color: '#f59e0b' }}>OS</span>
                </span>
                <span style={{ fontSize: '0.62rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '1px 6px', borderRadius: '4px', fontWeight: 800, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  v2.0
                </span>
              </div>
              <p style={{ fontSize: '0.68rem', color: '#94a3b8', margin: 0 }}>
                Beverage R&D • Costing • AI Studio
              </p>
            </div>
          </div>

          {/* Nav Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                triggerHaptic('light')
                onOpenLogin()
              }}
              style={{
                background: 'transparent',
                color: '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '7px 14px',
                borderRadius: '999px',
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
                onOpenSignUp()
              }}
              style={{
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#ffffff',
                border: 'none',
                padding: '7px 16px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 10px rgba(217, 119, 6, 0.35)'
              }}
            >
              <span>Get Started</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section style={{ padding: '60px 20px 40px', maxWidth: '1120px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        
        {/* Glow ambient background */}
        <div 
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, rgba(217, 119, 6, 0.15) 0%, rgba(8, 12, 20, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* Hero Pill */}
        <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '6px 14px', borderRadius: '999px', marginBottom: '20px' }}>
          <Sparkles size={14} color="#f59e0b" />
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f59e0b' }}>
            Built for Philippine Specialty Cafes, Tea Bars & Mixology Labs
          </span>
        </div>

        {/* Main Headline */}
        <h1 
          style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.4rem)', 
            fontWeight: 900, 
            lineHeight: 1.15, 
            letterSpacing: '-0.03em', 
            color: '#ffffff', 
            maxWidth: '860px', 
            margin: '0 auto 18px',
            fontFamily: 'var(--font-display)'
          }}
        >
          Engineer High-Margin Drink Formulations & Commercial <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>8K AI Collaterals</span>
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: '#94a3b8', maxWidth: '640px', margin: '0 auto 32px', lineHeight: 1.6 }}>
          Eliminate guesswork in beverage COGS. Real-time ₱ PHP layer costing, density Brix layering, custom logo cup mockups, and automatic margin protection when dairy and syrup prices shift.
        </p>

        {/* Hero CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
          <button
            onClick={() => {
              triggerHaptic('success')
              onLaunchStudio()
            }}
            style={{
              padding: '14px 28px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #d97706, #b45309)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(217, 119, 6, 0.45)',
              transition: 'transform 0.15s ease'
            }}
          >
            <span>Launch Demo Recipe Studio</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => {
              triggerHaptic('light')
              onOpenSignUp()
            }}
            style={{
              padding: '14px 24px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Store size={16} color="#38bdf8" />
            <span>Create Free Shop Account</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', flexWrap: 'wrap', color: '#64748b', fontSize: '0.78rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="#10b981" />
            <span>Exclusively in Philippine Pesos (₱)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="#10b981" />
            <span>Net-30 Wholesale Integration</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="#10b981" />
            <span>8K Photo Decal Generation</span>
          </div>
        </div>
      </section>

      {/* 3. Interactive Feature Tabs */}
      <section style={{ padding: '40px 20px', maxWidth: '1120px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: 0, fontFamily: 'var(--font-display)' }}>
            The Complete Beverage R&D Suite
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '6px 0 0' }}>
            Everything your cafe needs from initial recipe formulation to high-volume barista station execution.
          </p>
        </div>

        {/* Feature Pill Selectors */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}
        >
          {features.map(f => {
            const isSel = activeFeatureTab === f.id
            return (
              <div
                key={f.id}
                onClick={() => {
                  triggerHaptic('tap')
                  setActiveFeatureTab(f.id)
                }}
                style={{
                  background: isSel ? '#1e293b' : 'rgba(30, 41, 59, 0.4)',
                  border: isSel ? '1.5px solid #d97706' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    {f.icon}
                    <h3 style={{ fontSize: '0.86rem', fontWeight: 800, color: isSel ? '#ffffff' : '#cbd5e1', margin: 0 }}>
                      {f.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    {f.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{f.statLabel}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>{f.stat}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. Commercial Pricing & Subscription Plans */}
      <section style={{ padding: '40px 20px 60px', maxWidth: '1120px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: 0, fontFamily: 'var(--font-display)' }}>
            Transparent Commercial Pricing in PHP (₱)
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '6px 0 0' }}>
            Scale from single-popups to nationwide multi-branch operations. Cancel anytime.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {tiers.map((t, idx) => (
            <div
              key={idx}
              style={{
                background: t.highlight ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' : 'rgba(15, 23, 42, 0.6)',
                border: t.highlight ? '2px solid #d97706' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: t.highlight ? '0 12px 30px rgba(217, 119, 6, 0.25)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {t.name}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.64rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: t.highlight ? '#d97706' : 'rgba(255,255,255,0.08)',
                      color: '#ffffff'
                    }}
                  >
                    {t.badge}
                  </span>
                </div>

                <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.4 }}>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {t.features.map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#cbd5e1' }}>
                      <Check size={14} color="#10b981" style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic('tap')
                  if (t.name.includes('Enterprise')) {
                    onOpenAdmin()
                  } else {
                    onOpenSignUp()
                  }
                }}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '12px',
                  background: t.highlight ? 'linear-gradient(135deg, #d97706, #b45309)' : 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border: t.highlight ? 'none' : '1px solid rgba(255,255,255,0.15)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>{t.cta}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px 20px',
          background: '#04070c',
          marginTop: 'auto'
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#ffffff' }}>PourCraft OS</span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>• The Commercial Beverage Operating System</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.74rem', color: '#94a3b8' }}>
            <button
              onClick={onOpenAdmin}
              style={{ background: 'none', border: 'none', color: '#f59e0b', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Crown size={12} />
              <span>Platform SuperAdmin</span>
            </button>
            <span>© 2026 PourCraft Systems Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
