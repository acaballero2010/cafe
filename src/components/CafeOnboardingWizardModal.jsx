import React, { useState } from 'react'
import { 
  Store, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Coffee, 
  Layers, 
  CheckCircle2, 
  X, 
  Percent, 
  Award,
  Zap,
  Flame,
  Scale,
  ShieldCheck
} from 'lucide-react'
import { MASTER_RECIPE_REPOSITORY } from '../data/recipeRepository'
import { triggerHaptic } from '../utils/haptics'

export function CafeOnboardingWizardModal({
  isOpen = false,
  onClose = () => {},
  onCompleteOnboarding = () => {}
}) {
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Shop Identity
  const [shopName, setShopName] = useState('Artisan Roast & Pour')
  const [branchLocation, setBranchLocation] = useState('BGC High Street, Taguig')
  const [region, setRegion] = useState('Metro Manila')
  const [ownerName, setOwnerName] = useState('Chef & Founder')

  // Step 2: Financial Benchmarks
  const [targetMarginPct, setTargetMarginPct] = useState(78) // 70%, 75%, 78%, 82%
  const [includeWasteScrap, setIncludeWasteScrap] = useState(true)
  const [currencySymbol, setCurrencySymbol] = useState('PHP (₱)')

  // Step 3: Beverage Category Focus
  const [selectedFocus, setSelectedFocus] = useState(['espresso', 'matcha']) // array of category keys

  // Step 4: Starter Drinks to Seed
  const [selectedSeedRecipes, setSelectedSeedRecipes] = useState(() => {
    return [
      MASTER_RECIPE_REPOSITORY[0], // Spanish Latte
      MASTER_RECIPE_REPOSITORY[1], // Brown Sugar Shaken
      MASTER_RECIPE_REPOSITORY[2], // Ceremonial Matcha Latte
      MASTER_RECIPE_REPOSITORY[3], // Tiger Brown Sugar Boba
      MASTER_RECIPE_REPOSITORY[4]  // Vanilla Sweet Cream Cold Brew
    ].filter(Boolean)
  })

  if (!isOpen) return null

  const categories = [
    { id: 'espresso', name: 'Specialty Espresso', icon: '☕', desc: 'Lattes, Flat Whites, Shaken Espressos' },
    { id: 'matcha', name: 'Ceremonial Matcha', icon: '🍵', desc: 'Uji Matcha, Hojicha, Cloud Foams' },
    { id: 'boba', name: 'Boba & Milk Tea', icon: '🧋', desc: 'Brown Sugar Pearls, Cheese Mousse' },
    { id: 'coldbrew', name: 'Draft Cold Brew', icon: '🧊', desc: 'Sweet Cream Floats, Citrus Tonics' },
    { id: 'mocktails', name: 'Craft Mocktails', icon: '🍸', desc: 'Layered Botanicals, Yuzu Sparklers' },
    { id: 'frappe', name: 'Blended Frappes', icon: '🍧', desc: 'Caramel Crunch, Matcha Freezes' }
  ]

  const handleToggleFocus = (categoryId) => {
    triggerHaptic('tap')
    let nextFocus
    if (selectedFocus.includes(categoryId)) {
      if (selectedFocus.length > 1) {
        nextFocus = selectedFocus.filter(id => id !== categoryId)
      } else {
        nextFocus = selectedFocus
      }
    } else {
      nextFocus = [...selectedFocus, categoryId]
    }
    setSelectedFocus(nextFocus)

    // Update suggested seed recipes based on chosen focus
    const matchedRecipes = MASTER_RECIPE_REPOSITORY.filter(r => nextFocus.includes(r.category)).slice(0, 6)
    if (matchedRecipes.length > 0) {
      setSelectedSeedRecipes(matchedRecipes)
    }
  }

  const handleToggleSeedRecipe = (recipe) => {
    triggerHaptic('selection')
    if (selectedSeedRecipes.some(r => r.id === recipe.id)) {
      if (selectedSeedRecipes.length > 1) {
        setSelectedSeedRecipes(selectedSeedRecipes.filter(r => r.id !== recipe.id))
      }
    } else {
      setSelectedSeedRecipes([...selectedSeedRecipes, recipe])
    }
  }

  const handleFinish = () => {
    triggerHaptic('success')
    const onboardingResult = {
      shopName: shopName.trim() || 'My Coffee Studio',
      branchLocation: branchLocation.trim() || 'Main Branch',
      region: region,
      ownerName: ownerName.trim() || 'Head Beverage Architect',
      targetMarginPct: targetMarginPct,
      includeWasteScrap: includeWasteScrap,
      currency: currencySymbol,
      focusCategories: selectedFocus,
      seedRecipes: selectedSeedRecipes
    }
    onCompleteOnboarding(onboardingResult)
    onClose()
  }

  return (
    <div className="clean-modal-overlay" style={{ zIndex: 140 }}>
      <div 
        className="clean-modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '580px', width: '96%', maxHeight: '92vh', padding: '24px', overflowY: 'auto' }}
      >
        <div className="modal-drag-handle" />

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Cafe R&D Onboarding Wizard
              </h2>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0' }}>
                Step {currentStep} of 4 • Commercial Setup & Menu Seeding
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

        {/* 4-Step Progress Bar Indicator */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '22px' }}>
          {[1, 2, 3, 4].map(step => (
            <div
              key={step}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '999px',
                background: currentStep >= step ? '#d97706' : '#e2e8f0',
                transition: 'all 0.25s ease'
              }}
            />
          ))}
        </div>

        {/* STEP 1: SHOP IDENTITY */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'slideUpFade 0.25s ease' }}>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px', display: 'flex', gap: '8px' }}>
              <Store size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#92400e', margin: 0 }}>
                  Tell us about your Cafe or Beverage Brand
                </h4>
                <p style={{ fontSize: '0.72rem', color: '#b45309', margin: '2px 0 0' }}>
                  We’ll personalize your costing metrics, commercial decal exports, and station build sheets.
                </p>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Cafe / Store Name
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Kape Craft Studio"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 600, boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Branch Location
                </label>
                <input
                  type="text"
                  value={branchLocation}
                  onChange={(e) => setBranchLocation(e.target.value)}
                  placeholder="e.g. BGC High Street"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Wholesale Hub Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#ffffff' }}
                >
                  <option value="Metro Manila">Metro Manila (NCR)</option>
                  <option value="Cebu">Cebu & Visayas</option>
                  <option value="Davao">Davao & Mindanao</option>
                  <option value="North Luzon">North & Central Luzon</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Head Architect / Owner Name
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Chef Marco D."
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        )}

        {/* STEP 2: FINANCIAL BENCHMARKS */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'slideUpFade 0.25s ease' }}>
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '12px', display: 'flex', gap: '8px' }}>
              <TrendingUp size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#065f46', margin: 0 }}>
                  Set Your Target Gross Profit Margins
                </h4>
                <p style={{ fontSize: '0.72rem', color: '#047857', margin: '2px 0 0' }}>
                  PourCraft OS auto-computes optimal menu pricing in Philippine Pesos based on live ingredient COGS.
                </p>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Default Target Gross Margin (%)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[70, 75, 78, 82].map(pct => {
                  const isSel = targetMarginPct === pct
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        triggerHaptic('selection')
                        setTargetMarginPct(pct)
                      }}
                      style={{
                        padding: '12px 6px',
                        borderRadius: '12px',
                        border: isSel ? '2px solid #059669' : '1px solid #e2e8f0',
                        background: isSel ? '#ecfdf5' : '#ffffff',
                        color: isSel ? '#065f46' : '#334155',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{pct}%</span>
                      <span style={{ fontSize: '0.62rem', fontWeight: 600, color: isSel ? '#059669' : '#94a3b8' }}>
                        {pct === 78 ? '★ Recommended' : pct >= 80 ? 'High Profit' : 'Standard'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', background: '#f8fafc' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                    Include Barista Scrap & Purge Factor (5%)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                    Factors in milk jug steaming residue, espresso grinder purging, and syrup bottle cling.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={includeWasteScrap}
                  onChange={(e) => {
                    triggerHaptic('tap')
                    setIncludeWasteScrap(e.target.checked)
                  }}
                  style={{ width: '18px', height: '18px', accentColor: '#d97706', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: BEVERAGE CATEGORY FOCUS */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'slideUpFade 0.25s ease' }}>
            <p style={{ fontSize: '0.74rem', color: '#64748b', margin: 0 }}>
              Select all drink categories your cafe serves or plans to develop:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {categories.map(cat => {
                const isSelected = selectedFocus.includes(cat.id)
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleToggleFocus(cat.id)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #d97706' : '1px solid #e2e8f0',
                      background: isSelected ? '#fffbeb' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{cat.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{cat.name}</span>
                        {isSelected && <Check size={14} color="#d97706" />}
                      </div>
                      <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '2px 0 0' }}>
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 4: SEED STARTER R&D MENU */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'slideUpFade 0.25s ease' }}>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '12px', display: 'flex', gap: '8px' }}>
              <Coffee size={18} color="#1d4ed8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e40af', margin: 0 }}>
                  Starter Formulations Auto-Selected
                </h4>
                <p style={{ fontSize: '0.72rem', color: '#1d4ed8', margin: '2px 0 0' }}>
                  We’ve pre-loaded these commercial recipes complete with COGS, Brix density, and Barista SOPs into your workspace.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {MASTER_RECIPE_REPOSITORY.filter(r => selectedFocus.includes(r.category)).slice(0, 6).map(recipe => {
                const isSelected = selectedSeedRecipes.some(r => r.id === recipe.id)
                return (
                  <div
                    key={recipe.id}
                    onClick={() => handleToggleSeedRecipe(recipe)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: isSelected ? '1.5px solid #059669' : '1px solid #e2e8f0',
                      background: isSelected ? '#ecfdf5' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{recipe.icon || '☕'}</span>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                          {recipe.name}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {recipe.volumeOz}oz • COGS: ₱{recipe.targetCogsPhp?.toFixed(2)} • Margin: {recipe.grossMarginPct}%
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
                        ₱{recipe.menuPrice?.toFixed(2)}
                      </span>
                      <div 
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: isSelected ? '#059669' : '#e2e8f0',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {isSelected && <Check size={12} />}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '22px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          {currentStep > 1 ? (
            <button
              onClick={() => {
                triggerHaptic('tap')
                setCurrentStep(prev => prev - 1)
              }}
              className="btn-clean btn-clean-secondary"
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              onClick={() => {
                triggerHaptic('tap')
                setCurrentStep(prev => prev + 1)
              }}
              className="btn-clean btn-clean-primary"
              style={{ padding: '8px 20px', fontSize: '0.82rem' }}
            >
              <span>Continue</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="btn-clean btn-clean-accent"
              style={{ padding: '9px 22px', fontSize: '0.84rem' }}
            >
              <Zap size={14} />
              <span>Launch My Cafe Studio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
