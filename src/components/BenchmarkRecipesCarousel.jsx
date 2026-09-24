import React, { useState } from 'react'
import { Sparkles, ArrowRight, TrendingUp, CheckCircle2, Info, Flame, Star, Coffee, Check } from 'lucide-react'

export function BenchmarkRecipesCarousel({
  onLoadBenchmarkSpec = () => {},
  onBrowseAll = () => {}
}) {
  const [loadedSpecId, setLoadedSpecId] = useState(null)

  const benchmarkSpecs = [
    {
      id: 'spec-shaken-espresso',
      cloneBadge: '⭐ Seattle Classic Clone',
      badgeColor: '#fef3c7',
      badgeTextColor: '#b45309',
      title: 'Brown Sugar Shaken Oat Espresso',
      category: 'Coffee',
      typicalChainPrice: 210,
      shopCogs: 44.20,
      potentialMarginPct: 79,
      ingredientsPreview: 'Oat Milk • Blonde Espresso • Spiced Brown Sugar',
      targetRecipe: {
        id: 'recipe-shaken-espresso-bench',
        name: 'Iced Brown Sugar Shaken Oat Espresso',
        venue: 'coffee',
        vesselId: 'cold-16oz',
        iceTypeId: 'standard',
        targetMarginPct: 79,
        menuPrice: 195.00,
        description: 'Blonde espresso double-shot shaken vigorously over spiced brown sugar syrup, topped off with chilled barista oat milk.',
        garnishes: ['Ceylon Cinnamon Dust', 'Double Wall Rim'],
        packagingIds: ['cup-16oz-pet', 'lid-sip-cold', 'kraft-sleeve'],
        layers: [
          { id: 'layer-syrup', ingredientId: 'tiger-brown-sugar-syrup', name: 'Spiced Brown Sugar Syrup', volumeMl: 25, unitCostPerMl: 0.28, colorHex: '#3b1d0b', densityBrix: 65, scrapType: 'standard', layerType: 'dense_syrup', isTopOff: false },
          { id: 'layer-espresso', ingredientId: 'ethiopia-espresso', name: 'Blonde Espresso (Triple Shot)', volumeMl: 45, unitCostPerMl: 0.38, colorHex: '#422415', densityBrix: 10, scrapType: 'espresso', layerType: 'espresso', isTopOff: false },
          { id: 'layer-milk', ingredientId: 'oatly-barista', name: 'Oatly Barista Oat Milk (Top-Off)', volumeMl: 120, unitCostPerMl: 0.185, colorHex: '#f4ede2', densityBrix: 12, isTopOff: true, scrapType: 'milk_steaming', layerType: 'milk' }
        ],
        sopSteps: [
          'Pump 25ml Spiced Brown Sugar Syrup into stainless shaker.',
          'Pull 45ml Blonde Espresso directly over syrup.',
          'Add 1 full scoop ice (140g) and shake vigorously for 12 seconds.',
          'Strain over fresh ice in 16oz cup and top with 120ml Oatly Barista Oat Milk.'
        ]
      }
    },
    {
      id: 'spec-tiger-boba',
      cloneBadge: '🧋 Taiwanese Boba Clone',
      badgeColor: '#ffedd5',
      badgeTextColor: '#c2410c',
      title: 'Tiger Brown Sugar Flame Boba',
      category: 'Boba & Tea',
      typicalChainPrice: 190,
      shopCogs: 38.50,
      potentialMarginPct: 80,
      ingredientsPreview: 'Brown Sugar Tapioca • Whole Milk • Muscovado Swirl',
      targetRecipe: {
        id: 'recipe-tiger-boba-bench',
        name: 'Tiger Brown Sugar Flame Boba',
        venue: 'boba',
        vesselId: 'boba-20oz',
        iceTypeId: 'standard',
        targetMarginPct: 80,
        menuPrice: 185.00,
        description: 'Slow-cooked muscovado brown sugar boba pearls swirled along the cup walls, filled with cold fresh milk.',
        garnishes: ['Torched Muscovado Sugar', 'Cream Cloud'],
        packagingIds: ['cup-16oz-pet', 'lid-dome-boba', 'boba-bamboo-straw'],
        layers: [
          { id: 'layer-boba', ingredientId: 'brown-sugar-pearls', name: 'Warm Brown Sugar Tapioca', volumeMl: 60, unitCostPerMl: 0.12, colorHex: '#160802', densityBrix: 65, scrapType: 'boba_pearls', layerType: 'bottom_boba', isTopOff: false },
          { id: 'layer-stripes', ingredientId: 'muscovado-syrup', name: 'Muscovado Wall Stripes', volumeMl: 20, unitCostPerMl: 0.14, colorHex: '#78350f', densityBrix: 70, scrapType: 'standard', layerType: 'dense_syrup', isTopOff: false },
          { id: 'layer-milk', ingredientId: 'fresh-milk', name: 'Fresh Whole Milk (4°C)', volumeMl: 180, unitCostPerMl: 0.095, colorHex: '#fdfbf7', densityBrix: 12, isTopOff: true, scrapType: 'milk_steaming', layerType: 'milk' }
        ],
        sopSteps: [
          'Scoop 60g warm brown sugar tapioca into 20oz boba cup.',
          'Rotate cup 45° to coat walls with 20ml rich muscovado syrup.',
          'Add ice to 80% mark, then top off with 180ml chilled fresh whole milk.'
        ]
      }
    },
    {
      id: 'spec-strawberry-matcha',
      cloneBadge: '🍵 Kyoto Cloud Tea Clone',
      badgeColor: '#ecfdf5',
      badgeTextColor: '#047857',
      title: 'Strawberry Uji Matcha Cloud',
      category: 'Boba & Tea',
      typicalChainPrice: 230,
      shopCogs: 51.80,
      potentialMarginPct: 77,
      ingredientsPreview: 'Ceremonial Matcha • Strawberry Puree • Cloud Foam',
      targetRecipe: {
        id: 'recipe-matcha-cloud-bench',
        name: 'Strawberry Uji Matcha Cloud Latte',
        venue: 'boba',
        vesselId: 'cold-16oz',
        iceTypeId: 'standard',
        targetMarginPct: 77,
        menuPrice: 215.00,
        description: 'Tri-layer signature: organic strawberry puree base, oat milk core, floated with whisked ceremonial Kyoto matcha.',
        garnishes: ['Matcha Dust', 'Freeze-Dried Strawberry'],
        packagingIds: ['cup-16oz-pet', 'lid-sip-cold', 'custom-logo-label'],
        layers: [
          { id: 'layer-strawberry', ingredientId: 'strawberry-puree', name: 'Organic Strawberry Puree', volumeMl: 40, unitCostPerMl: 0.35, colorHex: '#c9184a', densityBrix: 48, scrapType: 'standard', layerType: 'dense_syrup', isTopOff: false },
          { id: 'layer-oatmilk', ingredientId: 'oatly-barista', name: 'Oat Milk Barista Base', volumeMl: 150, unitCostPerMl: 0.185, colorHex: '#fcf8f2', densityBrix: 12, scrapType: 'milk_steaming', layerType: 'milk', isTopOff: false },
          { id: 'layer-matcha', ingredientId: 'ceremonial-matcha', name: 'Ceremonial Uji Matcha Float', volumeMl: 50, unitCostPerMl: 0.45, colorHex: '#15803d', densityBrix: 5, isTopOff: true, layerType: 'tea_concentrate' }
        ],
        sopSteps: [
          'Pour 40ml strawberry puree at the bottom of cup.',
          'Fill cup with regular ice.',
          'Gently pour 150ml oat milk over ice to create clean mid layer.',
          'Whisk 3g Uji matcha with 50ml 80°C water; float gently over milk using bar spoon.'
        ]
      }
    },
    {
      id: 'spec-spanish-latte',
      cloneBadge: '☕ Latin Espresso Classic',
      badgeColor: '#fef3c7',
      badgeTextColor: '#b45309',
      title: 'Iced Sweet Spanish Latte',
      category: 'Coffee',
      typicalChainPrice: 175,
      shopCogs: 34.10,
      potentialMarginPct: 81,
      ingredientsPreview: 'Condensed Milk • Double Espresso • Fresh Milk',
      targetRecipe: {
        id: 'recipe-spanish-latte-bench',
        name: 'Iced Sweet Spanish Latte',
        venue: 'coffee',
        vesselId: 'cold-16oz',
        iceTypeId: 'standard',
        targetMarginPct: 81,
        menuPrice: 175.00,
        description: 'Sweetened condensed milk dissolved with fresh espresso shots, layered over cold milk and ice.',
        garnishes: ['Cinnamon Quill', 'Nutmeg Grate'],
        packagingIds: ['cup-16oz-pet', 'lid-sip-cold'],
        layers: [
          { id: 'layer-condensed', ingredientId: 'condensed-milk', name: 'Sweetened Condensed Milk', volumeMl: 25, unitCostPerMl: 0.14, colorHex: '#fef08a', densityBrix: 70, scrapType: 'standard', layerType: 'dense_syrup', isTopOff: false },
          { id: 'layer-milk', ingredientId: 'fresh-milk', name: 'Fresh Whole Milk', volumeMl: 180, unitCostPerMl: 0.095, colorHex: '#fdfbf7', densityBrix: 12, scrapType: 'milk_steaming', layerType: 'milk', isTopOff: false },
          { id: 'layer-espresso', ingredientId: 'ethiopia-espresso', name: 'Double Espresso Float', volumeMl: 36, unitCostPerMl: 0.35, colorHex: '#3d1c06', densityBrix: 10, isTopOff: true, scrapType: 'espresso', layerType: 'espresso' }
        ],
        sopSteps: [
          'Add 25ml condensed milk to bottom of cup.',
          'Fill cup with ice cubes to 80% mark.',
          'Pour 180ml fresh milk.',
          'Pull 36ml double espresso and pour gently over ice for layered gradient.'
        ]
      }
    }
  ]

  const handleLoad = (spec) => {
    setLoadedSpecId(spec.id)
    onLoadBenchmarkSpec(spec.targetRecipe || spec)
    setTimeout(() => {
      setLoadedSpecId(null)
    }, 2500)
  }

  return (
    <div style={{ margin: '20px 0 10px' }}>
      {/* 1. Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px', padding: '0 4px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
              Iconic Benchmark Specs
            </h2>
            <span style={{ background: '#dbeafe', color: '#1e40af', fontSize: '0.62rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px' }}>
              PRO
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0', fontWeight: 500 }}>
            Reverse-engineered chain favorites with live supplier costing
          </p>
        </div>

        <button
          onClick={onBrowseAll}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#d97706',
            fontSize: '0.76rem',
            fontWeight: 800,
            cursor: 'pointer',
            padding: '4px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            flexShrink: 0
          }}
        >
          <span>Browse All (18)</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 2. Horizontal Recipe Cards (Fixed width 260px, rounded-2xl, soft shadow) */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          paddingBottom: '8px',
          paddingRight: '16px',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {benchmarkSpecs.map((spec) => {
          const isLoaded = loadedSpecId === spec.id
          return (
            <div
              key={spec.id}
              style={{
                width: '260px',
                minWidth: '260px',
                maxWidth: '260px',
                background: '#ffffff',
                borderRadius: '20px',
                border: isLoaded ? '2px solid #10b981' : '1px solid #e2e8f0',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isLoaded ? '0 4px 14px rgba(16, 185, 129, 0.18)' : '0 2px 10px rgba(0,0,0,0.04)',
                boxSizing: 'border-box',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}
            >
              {/* Top Area: Badge & Title */}
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: spec.badgeColor,
                    color: spec.badgeTextColor,
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    marginBottom: '8px'
                  }}
                >
                  {spec.cloneBadge}
                </div>

                <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                  {spec.title}
                </h3>

                {/* Ingredients List Preview */}
                <div style={{ fontSize: '0.70rem', color: '#64748b', lineHeight: 1.3, marginBottom: '12px' }}>
                  {spec.ingredientsPreview}
                </div>
              </div>

              {/* Middle Area: Economics Comparison Row (High visual appeal) */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9',
                  borderRadius: '14px',
                  padding: '10px 12px',
                  marginBottom: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Typical Chain Price:</span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>
                    ₱{spec.typicalChainPrice.toFixed(2)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                      Your Shop COGS:
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#059669', fontFamily: 'var(--font-mono)' }}>
                      ₱{spec.shopCogs.toFixed(2)} <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>/ cup</span>
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      color: '#047857',
                      fontSize: '0.64rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '6px'
                    }}
                  >
                    {spec.potentialMarginPct}% Margin
                  </div>
                </div>
              </div>

              {/* Bottom Area: Action Button */}
              <button
                onClick={() => handleLoad(spec)}
                style={{
                  width: '100%',
                  height: '38px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isLoaded ? '#10b981' : '#0f172a',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: isLoaded ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
                }}
              >
                {isLoaded ? (
                  <>
                    <Check size={14} color="#ffffff" strokeWidth={3} />
                    <span>Loaded into Studio!</span>
                  </>
                ) : (
                  <>
                    <span>Load Spec & Ingredients</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* 3. Subtle Legally Compliant Disclaimer Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', padding: '0 4px' }}>
        <Info size={11} color="#94a3b8" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '0.64rem', color: '#94a3b8', margin: 0, lineHeight: 1.3 }}>
          Recipes are independent culinary reverse-engineering benchmarks and are not affiliated with or endorsed by referenced commercial brands.
        </p>
      </div>
    </div>
  )
}
