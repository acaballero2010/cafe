import React, { useState } from 'react'
import { Search, X, Check, Star, Clock, Truck, ShieldCheck, ArrowRight, Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react'

export function IngredientSupplierPickerModal({
  isOpen = true,
  onClose = () => {},
  onApplyIngredient = () => {},
  currentRecipeName = "Iced Brown Sugar Oat Espresso",
  currentPortionMl = 200
}) {
  const [searchQuery, setSearchQuery] = useState('Oat Milk')
  const [selectedIngredientId, setSelectedIngredientId] = useState('ing-oat-milk')
  const [selectedSupplierSkuId, setSelectedSupplierSkuId] = useState('sku-oatly')

  if (!isOpen) return null

  // Master Ingredients catalog
  const masterIngredients = [
    {
      id: 'ing-oat-milk',
      name: 'Oat Milk (Barista Formula)',
      category: 'dairy',
      baseUom: 'ml',
      icon: '🥛',
      densityBrix: 12.0,
      description: 'Plant-based dairy alternative engineered for micro-foaming and high-acid espresso pairing.',
      suppliers: [
        {
          id: 'sku-oatly',
          brand: 'Oatly Barista Edition (1L)',
          supplierName: 'Gourmet Direct PH',
          isPreferred: true,
          isVerified: true,
          rating: 4.9,
          packCost: 185.00,
          packVolume: '1,000 ml',
          unitCostPerMl: 0.185,
          unitCostPerL: 185.00,
          inStock: true,
          leadTime: 'Next-day delivery',
          stockTag: 'In Stock',
          badgeColor: '#059669',
          savingsDiff: 0 // baseline preferred
        },
        {
          id: 'sku-minor-figures',
          brand: 'Minor Figures Oat M*lk (1L)',
          supplierName: 'Barista Depot Manila',
          isPreferred: false,
          isVerified: true,
          rating: 4.8,
          packCost: 165.00,
          packVolume: '1,000 ml',
          unitCostPerMl: 0.165,
          unitCostPerL: 165.00,
          inStock: true,
          leadTime: '3-day lead time',
          stockTag: 'In Stock',
          badgeColor: '#0284c7',
          savingsDiff: 4.00 // saves ₱4 per 200ml
        },
        {
          id: 'sku-califia-farms',
          brand: 'Califia Farms Barista Blend (946ml)',
          supplierName: 'Specialty Ingredients PH',
          isPreferred: false,
          isVerified: true,
          rating: 4.7,
          packCost: 210.00,
          packVolume: '946 ml',
          unitCostPerMl: 0.222,
          unitCostPerL: 222.00,
          inStock: true,
          leadTime: 'Next-day delivery',
          stockTag: 'In Stock',
          badgeColor: '#059669',
          savingsDiff: -7.40 // costs ₱7.40 more per 200ml
        }
      ]
    },
    {
      id: 'ing-ceremonial-matcha',
      name: 'Ceremonial Matcha Powder',
      category: 'boba',
      baseUom: 'g',
      icon: '🍵',
      densityBrix: 5.0,
      description: 'First-harvest shade-grown stone ground tencha leaves from Uji, Kyoto.',
      suppliers: [
        {
          id: 'sku-uji-first-harvest',
          brand: '1st Harvest Kyoto Ceremonial (1kg)',
          supplierName: 'Matcha Manila Direct',
          isPreferred: true,
          isVerified: true,
          rating: 5.0,
          packCost: 6650.00,
          packVolume: '1,000 g',
          unitCostPerMl: 6.65,
          inStock: true,
          leadTime: 'Next-day delivery',
          stockTag: 'In Stock',
          savingsDiff: 0
        }
      ]
    }
  ]

  const activeIngredient = masterIngredients.find(i => i.id === selectedIngredientId) || masterIngredients[0]
  const activeSku = activeIngredient.suppliers.find(s => s.id === selectedSupplierSkuId) || activeIngredient.suppliers[0]
  const preferredSku = activeIngredient.suppliers.find(s => s.isPreferred) || activeIngredient.suppliers[0]

  // Recipe Portion Costing calculations
  const portionCost = (activeSku.unitCostPerMl * currentPortionMl).toFixed(2)
  const baselineCost = (preferredSku.unitCostPerMl * currentPortionMl)
  const currentCost = (activeSku.unitCostPerMl * currentPortionMl)
  const savingsPerCup = (baselineCost - currentCost).toFixed(2)
  const isSaving = Number(savingsPerCup) > 0
  const isHigher = Number(savingsPerCup) < 0

  const handleApply = () => {
    onApplyIngredient({
      ingredient: activeIngredient,
      supplierSku: activeSku,
      unitCostPerMl: activeSku.unitCostPerMl,
      portionCost: Number(portionCost)
    })
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '92vh',
          overflowY: 'auto',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '28px 28px 0 0',
          padding: '16px 20px 32px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxSizing: 'border-box'
        }}
      >
        {/* Grab Handle */}
        <div style={{ width: '40px', height: '4px', background: '#cbd5e1', borderRadius: '9999px', margin: '0 auto 2px' }} />

        {/* 1. Header & Title with Circular Dismiss */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Link Ingredient & Supplier
            </h2>
            <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Targeting: <strong style={{ color: '#0f172a' }}>{currentRecipeName}</strong> ({currentPortionMl}ml portion)
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '10px 14px',
            gap: '8px'
          }}
        >
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search raw materials, syrups, cups..."
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.84rem',
              color: '#0f172a',
              background: 'transparent',
              fontWeight: 500
            }}
          />
        </div>

        {/* 2. Active Master Ingredient Card */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              flexShrink: 0
            }}
          >
            {activeIngredient.icon}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                {activeIngredient.name}
              </span>
              <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                Master SKU
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0 0', lineHeight: 1.3 }}>
              {activeIngredient.description}
            </p>
          </div>
        </div>

        {/* 3. Registered Supplier Carousel / List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Live Supplier Quotes ({activeIngredient.suppliers.length} Available)
            </span>
            <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
              Auto-syncs live COGS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeIngredient.suppliers.map((sku) => {
              const isSelected = sku.id === selectedSupplierSkuId
              return (
                <div
                  key={sku.id}
                  onClick={() => setSelectedSupplierSkuId(sku.id)}
                  style={{
                    background: isSelected ? '#ffffff' : '#f8fafc',
                    border: isSelected ? '2px solid #d97706' : '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 3px 10px rgba(217, 119, 6, 0.12)' : 'none'
                  }}
                >
                  {/* Top Line: Brand Name + Preferred Badge + Radio Toggle */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                          {sku.brand}
                        </span>
                        {sku.isPreferred && (
                          <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', fontSize: '0.62rem', fontWeight: 800, padding: '1px 6px', borderRadius: '9999px' }}>
                            Preferred
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>{sku.supplierName}</span>
                        <span>•</span>
                        <span style={{ color: '#d97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Star size={10} fill="#d97706" color="#d97706" /> {sku.rating}
                        </span>
                      </div>
                    </div>

                    {/* Radio / Selection Circle */}
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: isSelected ? '6px solid #d97706' : '2px solid #cbd5e1',
                        background: '#ffffff',
                        flexShrink: 0
                      }}
                    />
                  </div>

                  {/* Pricing and Lead Time Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.94rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                        ₱{sku.packCost.toFixed(2)}/L
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                        (₱{sku.unitCostPerMl.toFixed(3)}/ml)
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>
                      <Truck size={12} color="#059669" />
                      <span>{sku.leadTime}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 4. Visual Recipe Margin Impact Feedback */}
        <div
          style={{
            background: isSaving ? '#ecfdf5' : isHigher ? '#fff1f2' : '#f8fafc',
            border: `1px solid ${isSaving ? '#a7f3d0' : isHigher ? '#fecdd3' : '#e2e8f0'}`,
            borderRadius: '16px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: isSaving ? '#065f46' : isHigher ? '#9f1239' : '#475569', textTransform: 'uppercase' }}>
              Drink Cost Impact ({currentPortionMl}ml Portion)
            </div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: isSaving ? '#047857' : isHigher ? '#be123c' : '#0f172a', marginTop: '2px' }}>
              {isSaving
                ? `✨ Switching saves ₱${savingsPerCup} per cup!`
                : isHigher
                ? `⚠️ Increases drink COGS by +₱${Math.abs(Number(savingsPerCup)).toFixed(2)}`
                : 'Using current baseline costing'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.66rem', color: '#64748b' }}>Ingredient Portion:</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
              ₱{portionCost}
            </div>
          </div>
        </div>

        {/* 5. Bottom Action Button */}
        <button
          onClick={handleApply}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)',
            transition: 'all 0.15s ease'
          }}
        >
          <Check size={16} />
          <span>Apply to Recipe • ₱{portionCost} total</span>
        </button>
      </div>
    </div>
  )
}
