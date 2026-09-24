import React, { useState } from 'react'
import { Search, X, Check, Star, Clock, Truck, ShieldCheck, ArrowRight, Sparkles, SlidersHorizontal, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react'

export function IngredientSupplierPickerModal({
  isOpen = true,
  onClose = () => {},
  onApplyIngredient = () => {},
  currentRecipeName = "Iced Brown Sugar Oat Espresso",
  currentPortionMl = 200,
  initialIngredientCategory = 'oat'
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Comprehensive Wholesale Supplier & SKU Database for PH Beverage Market
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
          id: 'sku-oatside',
          brand: 'Oatside Barista Blend (1L)',
          supplierName: 'Oatside Direct PH',
          isPreferred: true,
          isVerified: true,
          rating: 4.95,
          packCost: 160.00,
          packVolume: '1,000 ml',
          unitCostPerMl: 0.160,
          unitCostPerL: 160.00,
          inStock: true,
          leadTime: 'Next-day delivery',
          stockTag: 'Best Seller',
          badgeColor: '#059669',
          savingsDiff: 0
        },
        {
          id: 'sku-oatly',
          brand: 'Oatly Barista Edition (1L)',
          supplierName: 'Gourmet Direct PH',
          isPreferred: false,
          isVerified: true,
          rating: 4.9,
          packCost: 185.00,
          packVolume: '1,000 ml',
          unitCostPerMl: 0.185,
          unitCostPerL: 185.00,
          inStock: true,
          leadTime: 'Next-day delivery',
          stockTag: 'In Stock',
          badgeColor: '#0284c7',
          savingsDiff: -5.00 // costs ₱5 more per 200ml vs Oatside
        },
        {
          id: 'sku-milklab-oat',
          brand: 'MilkLab Oat Barista (1L)',
          supplierName: 'Barista Depot Manila',
          isPreferred: false,
          isVerified: true,
          rating: 4.8,
          packCost: 175.00,
          packVolume: '1,000 ml',
          unitCostPerMl: 0.175,
          unitCostPerL: 175.00,
          inStock: true,
          leadTime: '2-day delivery',
          stockTag: 'In Stock',
          badgeColor: '#0284c7',
          savingsDiff: -3.00
        },
        {
          id: 'sku-minor-figures',
          brand: 'Minor Figures Oat M*lk (1L)',
          supplierName: 'Specialty Ingredients PH',
          isPreferred: false,
          isVerified: true,
          rating: 4.8,
          packCost: 195.00,
          packVolume: '1,000 ml',
          unitCostPerMl: 0.195,
          unitCostPerL: 195.00,
          inStock: true,
          leadTime: '3-day lead time',
          stockTag: 'Specialty',
          badgeColor: '#7c3aed',
          savingsDiff: -7.00
        }
      ]
    },
    {
      id: 'ing-fresh-milk',
      name: 'Fresh Dairy Milk (Full Cream)',
      category: 'dairy',
      baseUom: 'ml',
      icon: '🥛',
      densityBrix: 11.5,
      description: 'Standard 3.8% butterfat whole milk for creamy microfoam texture.',
      suppliers: [
        {
          id: 'sku-nestle-fresh',
          brand: 'Nestlé Fresh Milk (1L)',
          supplierName: 'Metro Wholesale FMCG',
          isPreferred: true,
          isVerified: true,
          rating: 4.8,
          packCost: 105.00,
          packVolume: '1,000 ml',
          unitCostPerMl: 0.105,
          unitCostPerL: 105.00,
          inStock: true,
          leadTime: 'Daily delivery',
          stockTag: 'In Stock',
          badgeColor: '#059669',
          savingsDiff: 0
        },
        {
          id: 'sku-arla-fullcream',
          brand: 'Arla Organic Full Cream (1L)',
          supplierName: 'European Dairy Imports',
          isPreferred: false,
          isVerified: true,
          rating: 4.9,
          packCost: 120.00,
          packVolume: '1,000 ml',
          unitCostPerMl: 0.120,
          unitCostPerL: 120.00,
          inStock: true,
          leadTime: 'Next-day delivery',
          stockTag: 'Premium',
          badgeColor: '#0284c7',
          savingsDiff: -3.00
        },
        {
          id: 'sku-emborg-whole',
          brand: 'Emborg Barista Milk (1L)',
          supplierName: 'Barista Depot Manila',
          isPreferred: false,
          isVerified: true,
          rating: 4.7,
          packCost: 98.00,
          packVolume: '1,000 ml',
          unitCostPerMl: 0.098,
          unitCostPerL: 98.00,
          inStock: true,
          leadTime: '2-day delivery',
          stockTag: 'Value Pick',
          badgeColor: '#059669',
          savingsDiff: 1.40 // saves ₱1.40 per 200ml
        }
      ]
    },
    {
      id: 'ing-brown-sugar-syrup',
      name: 'Brown Sugar Syrup / Okinawa',
      category: 'syrup',
      baseUom: 'ml',
      icon: '🍯',
      densityBrix: 65.0,
      description: 'Slow-caramelized brown sugar cane syrup for shaken espressos & tiger boba.',
      suppliers: [
        {
          id: 'sku-torani-brown-sugar',
          brand: 'Torani Puremade Brown Sugar (750ml)',
          supplierName: 'Gourmet Direct PH',
          isPreferred: true,
          isVerified: true,
          rating: 4.9,
          packCost: 440.00,
          packVolume: '750 ml',
          unitCostPerMl: 0.587,
          inStock: true,
          leadTime: 'Next-day delivery',
          stockTag: 'Best Seller',
          badgeColor: '#059669',
          savingsDiff: 0
        },
        {
          id: 'sku-monin-spiced-bs',
          brand: 'Monin Brown Cane Sugar (700ml)',
          supplierName: 'Monin Official PH',
          isPreferred: false,
          isVerified: true,
          rating: 4.95,
          packCost: 480.00,
          packVolume: '700 ml',
          unitCostPerMl: 0.685,
          inStock: true,
          leadTime: 'Next-day delivery',
          stockTag: 'Top French Quality',
          badgeColor: '#7c3aed',
          savingsDiff: -2.45 // costs ₱2.45 more per 25ml
        },
        {
          id: 'sku-davinci-bs',
          brand: 'DaVinci Gourmet Brown Sugar (750ml)',
          supplierName: 'Beverage Solutions Manila',
          isPreferred: false,
          isVerified: true,
          rating: 4.75,
          packCost: 395.00,
          packVolume: '750 ml',
          unitCostPerMl: 0.526,
          inStock: true,
          leadTime: '2-day delivery',
          stockTag: 'High Margin',
          badgeColor: '#059669',
          savingsDiff: 1.52 // saves ₱1.52 per 25ml
        }
      ]
    },
    {
      id: 'ing-espresso-beans',
      name: 'Espresso Roast Beans',
      category: 'coffee',
      baseUom: 'g',
      icon: '☕',
      densityBrix: 8.0,
      description: 'Medium to dark espresso roasted whole beans for high extraction pressure.',
      suppliers: [
        {
          id: 'sku-house-espresso-blend',
          brand: 'Benguet & Santos House Blend (1kg)',
          supplierName: 'Highland Roasters Cordillera',
          isPreferred: true,
          isVerified: true,
          rating: 4.9,
          packCost: 850.00,
          packVolume: '1,000 g',
          unitCostPerMl: 0.850,
          inStock: true,
          leadTime: 'Freshly Roasted (2-day)',
          stockTag: 'Local Direct',
          badgeColor: '#059669',
          savingsDiff: 0
        },
        {
          id: 'sku-brazilian-santos',
          brand: '100% Brazilian Santos Single Origin (1kg)',
          supplierName: 'Manila Specialty Roasters',
          isPreferred: false,
          isVerified: true,
          rating: 4.85,
          packCost: 1100.00,
          packVolume: '1,000 g',
          unitCostPerMl: 1.10,
          inStock: true,
          leadTime: 'Next-day delivery',
          stockTag: '100% Arabica',
          badgeColor: '#0284c7',
          savingsDiff: -4.50
        }
      ]
    },
    {
      id: 'ing-ceremonial-matcha',
      name: 'Ceremonial Matcha Powder',
      category: 'tea',
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
          stockTag: 'Uji Direct',
          badgeColor: '#059669',
          savingsDiff: 0
        },
        {
          id: 'sku-shizuoka-barista',
          brand: 'Shizuoka Barista Grade Matcha (1kg)',
          supplierName: 'Zen Tea Imports PH',
          isPreferred: false,
          isVerified: true,
          rating: 4.8,
          packCost: 4800.00,
          packVolume: '1,000 g',
          unitCostPerMl: 4.80,
          inStock: true,
          leadTime: 'Next-day delivery',
          stockTag: 'High Margin',
          badgeColor: '#059669',
          savingsDiff: 9.25 // saves ₱9.25 per 5g dose
        }
      ]
    },
    {
      id: 'ing-black-tea',
      name: 'Black Tea Leaves (Assam / Sun Moon)',
      category: 'tea',
      baseUom: 'g',
      icon: '🧋',
      densityBrix: 6.0,
      description: 'High-tannin broken orange pekoe black tea for strong milk tea base.',
      suppliers: [
        {
          id: 'sku-sun-moon-ruby',
          brand: 'Taiwan Sun Moon Lake #18 Ruby (1kg)',
          supplierName: 'Taiwan Direct Boba Supply',
          isPreferred: true,
          isVerified: true,
          rating: 4.95,
          packCost: 950.00,
          packVolume: '1,000 g',
          unitCostPerMl: 0.95,
          inStock: true,
          leadTime: 'Next-day delivery',
          stockTag: 'Authentic Taiwan',
          badgeColor: '#059669',
          savingsDiff: 0
        },
        {
          id: 'sku-assam-bulk',
          brand: 'Commercial Assam CTC Black Tea (1kg)',
          supplierName: 'Metro Wholesale FMCG',
          isPreferred: false,
          isVerified: true,
          rating: 4.7,
          packCost: 650.00,
          packVolume: '1,000 g',
          unitCostPerMl: 0.65,
          inStock: true,
          leadTime: 'Next-day delivery',
          stockTag: 'High Value',
          badgeColor: '#059669',
          savingsDiff: 4.50
        }
      ]
    }
  ]

  const [selectedIngredientId, setSelectedIngredientId] = useState(masterIngredients[0].id)
  const [selectedSupplierSkuId, setSelectedSupplierSkuId] = useState(masterIngredients[0].suppliers[0].id)

  if (!isOpen) return null

  // Filtered ingredients
  const filteredIngredients = masterIngredients.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.suppliers.some(s => s.brand.toLowerCase().includes(searchQuery.toLowerCase()) || s.supplierName.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
      name: activeSku.brand,
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
        zIndex: 110,
        background: 'rgba(15, 23, 42, 0.70)',
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
          maxWidth: '580px',
          maxHeight: '92vh',
          overflowY: 'auto',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '28px 28px 0 0',
          padding: '18px 20px 32px',
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
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🔄 Compare & Swap Vendor SKU</span>
            </h2>
            <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0' }}>
              Compare wholesale pricing, supplier lead times, and switch brands with 1 tap.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Search & Category Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="text"
              placeholder="Search ingredient or brand (Oatside, Torani, Uji Matcha)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                boxSizing: 'border-box',
                background: '#f8fafc'
              }}
            />
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'all', label: 'All Raw Materials' },
              { id: 'dairy', label: '🥛 Milks & Plant' },
              { id: 'syrup', label: '🍯 Syrups & Sauces' },
              { id: 'coffee', label: '☕ Espresso Beans' },
              { id: 'tea', label: '🍵 Tea & Matcha' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '5px 10px',
                  borderRadius: '999px',
                  border: selectedCategory === cat.id ? '1px solid #059669' : '1px solid #e2e8f0',
                  background: selectedCategory === cat.id ? '#ecfdf5' : '#ffffff',
                  color: selectedCategory === cat.id ? '#047857' : '#64748b',
                  fontSize: '0.72rem',
                  fontWeight: selectedCategory === cat.id ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Ingredient Selector Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {filteredIngredients.map(item => {
            const isSelected = item.id === selectedIngredientId
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedIngredientId(item.id)
                  setSelectedSupplierSkuId(item.suppliers[0]?.id || '')
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #0f172a' : '1px solid #e2e8f0',
                  background: isSelected ? '#0f172a' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#334155',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            )
          })}
        </div>

        {/* 4. Active Supplier Comparison Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
              Available Verified Suppliers ({activeIngredient.suppliers.length})
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Portion: <strong>{currentPortionMl}{activeIngredient.baseUom}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeIngredient.suppliers.map(sku => {
              const isSelected = sku.id === selectedSupplierSkuId
              const skuPortionCost = (sku.unitCostPerMl * currentPortionMl).toFixed(2)
              const diffFromPreferred = (preferredSku.unitCostPerMl * currentPortionMl) - (sku.unitCostPerMl * currentPortionMl)
              
              return (
                <div
                  key={sku.id}
                  onClick={() => setSelectedSupplierSkuId(sku.id)}
                  style={{
                    border: `1.5px solid ${isSelected ? '#059669' : '#e2e8f0'}`,
                    background: isSelected ? '#f0fdf4' : '#ffffff',
                    borderRadius: '14px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                          {sku.brand}
                        </span>
                        {sku.isPreferred && (
                          <span style={{ fontSize: '0.65rem', background: '#ecfdf5', color: '#059669', padding: '1px 6px', borderRadius: '6px', fontWeight: 800 }}>
                            Preferred
                          </span>
                        )}
                        <span style={{ fontSize: '0.65rem', background: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: '6px', fontWeight: 600 }}>
                          {sku.stockTag}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', fontSize: '0.72rem', color: '#64748b' }}>
                        <span>🏢 {sku.supplierName}</span>
                        <span>•</span>
                        <span>⭐ {sku.rating}</span>
                        <span>•</span>
                        <span>🚚 {sku.leadTime}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.94rem', fontWeight: 900, color: '#0f172a' }}>
                        ₱{sku.packCost.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.70rem', color: '#64748b' }}>
                        ₱{sku.unitCostPerMl.toFixed(3)}/{activeIngredient.baseUom}
                      </div>
                    </div>
                  </div>

                  {/* Impact on This Drink's Cost */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px dashed #e2e8f0', fontSize: '0.74rem' }}>
                    <span style={{ color: '#475569' }}>
                      Cost in drink ({currentPortionMl}{activeIngredient.baseUom}): <strong>₱{skuPortionCost}</strong>
                    </span>

                    {diffFromPreferred > 0 ? (
                      <span style={{ color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <span>↓ Saves ₱{diffFromPreferred.toFixed(2)}/cup</span>
                      </span>
                    ) : diffFromPreferred < 0 ? (
                      <span style={{ color: '#d97706', fontWeight: 700 }}>
                        ↑ +₱{Math.abs(diffFromPreferred).toFixed(2)}/cup
                      </span>
                    ) : (
                      <span style={{ color: '#64748b' }}>Baseline Cost</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 5. Sticky Action Bar */}
        <div style={{ paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              background: '#f1f5f9',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            style={{
              flex: 2,
              padding: '12px',
              borderRadius: '12px',
              background: '#059669',
              border: 'none',
              fontSize: '0.84rem',
              fontWeight: 800,
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
            }}
          >
            <Check size={16} />
            <span>Switch to {activeSku.brand} (₱{portionCost})</span>
          </button>
        </div>

      </div>
    </div>
  )
}
