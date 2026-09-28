import React, { useState, useMemo } from 'react'
import { X, Search, RefreshCw, Check, ArrowRight, Sparkles, Filter, ShieldCheck, ChevronRight, Scale, Info, DollarSign } from 'lucide-react'
import { detectLayerFlavorProfile } from '../utils/beverageCalculators'
import { DEFAULT_CATALOG } from '../data/defaultCatalog'

export function SkuSwapModal({
  isOpen = false,
  onClose = () => {},
  onSelectBrand = () => {},
  layer = {},
  layerIndex = 0,
  catalog = DEFAULT_CATALOG,
  recipePrice = 180
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTierFilter, setSelectedTierFilter] = useState('all') // 'all' | 'value' | 'signature' | 'artisanal'

  if (!isOpen || !layer) return null

  const currentVolume = Number(layer.volumeMl || 30)
  const currentUnitCost = Number(layer.unitCostPerMl || 0.15)
  const currentPortionCost = currentVolume * currentUnitCost
  const detectedFlavor = detectLayerFlavorProfile(layer)

  // Find all matching SKUs from catalog that share the flavor profile or category
  const matchingSkus = useMemo(() => {
    const pool = catalog.length > 0 ? catalog : DEFAULT_CATALOG

    return pool.filter(item => {
      // Exclude packaging
      if (item.category === 'packaging') return false

      const matchesSearch = searchQuery.trim() === '' || 
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesTier = selectedTierFilter === 'all' || item.tier === selectedTierFilter

      // If user typed a search query, show all search results
      if (searchQuery.trim().length > 0) {
        return matchesSearch && matchesTier
      }

      // Otherwise, filter by matching flavor type or category
      const itemFlavor = item.flavorType || detectLayerFlavorProfile(item)
      const matchesFlavor = itemFlavor === detectedFlavor || (item.category && item.category === layer.category)

      return matchesFlavor && matchesTier
    })
  }, [catalog, detectedFlavor, layer.category, searchQuery, selectedTierFilter])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '820px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#ffffff',
        borderRadius: '24px',
        padding: '24px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: '#eff6ff',
                color: '#1e40af',
                fontSize: '0.74rem',
                fontWeight: 800,
                padding: '4px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase'
              }}>
                Layer #{layerIndex + 1} • {currentVolume}{layer.unit || 'ml'}
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Profile: <strong style={{ color: '#0f172a' }}>{detectedFlavor.replace('_', ' ').toUpperCase()}</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '6px', margin: 0 }}>
              Swap Brand SKU for "{layer.name}"
            </h2>
            <p style={{ fontSize: '0.80rem', color: '#64748b', marginTop: '4px', margin: 0 }}>
              Compare competing brands side-by-side. See instant portion cost differences and profit margin shifts.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Active Spec Callout */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Current Layer Spec</div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{layer.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Brand: <strong>{layer.brand || layer.supplier || 'Specialty Standard'}</strong> • ₱{currentUnitCost.toFixed(3)}/ml
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Portion Cost ({currentVolume}ml)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
              ₱{currentPortionCost.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Search Bar & Tier Filter Pills */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{
            flex: 1,
            minWidth: '220px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
              placeholder="Search brands (Torani, Monin, 1883, Oatly, Ghirardelli, Top Creamery)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                outline: 'none',
                background: '#ffffff'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'all', label: 'All Tiers' },
              { id: 'value', label: '⚡ Value' },
              { id: 'signature', label: '⚖️ Signature' },
              { id: 'artisanal', label: '👑 Artisanal' }
            ].map(tier => (
              <button
                key={tier.id}
                onClick={() => setSelectedTierFilter(tier.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: selectedTierFilter === tier.id ? '1px solid #0f172a' : '1px solid #e2e8f0',
                  background: selectedTierFilter === tier.id ? '#0f172a' : '#f8fafc',
                  color: selectedTierFilter === tier.id ? '#ffffff' : '#475569',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {/* Competitor Brand Comparison List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {matchingSkus.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '16px' }}>
              <Info size={28} style={{ margin: '0 auto 8px', display: 'block' }} />
              <div style={{ fontWeight: 700, color: '#475569' }}>No matching brand SKUs found</div>
              <div style={{ fontSize: '0.76rem', marginTop: '4px' }}>Try clearing your search query or tier filter</div>
            </div>
          ) : (
            matchingSkus.map((sku) => {
              const skuUnitCost = Number(sku.unitCostPerMl || 0.15)
              const newPortionCost = currentVolume * skuUnitCost
              const costDelta = newPortionCost - currentPortionCost
              const isCurrent = (sku.id === layer.ingredientId || sku.name === layer.name || sku.brand === layer.brand)

              return (
                <div
                  key={sku.id}
                  style={{
                    border: isCurrent ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    background: isCurrent ? '#f0f9ff' : '#ffffff',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Left Column: Brand Name, Tier, Pack Size & Supplier */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: sku.tier === 'artisanal' ? '#faf5ff' : sku.tier === 'value' ? '#f0fdf4' : '#ecfdf5',
                        color: sku.tier === 'artisanal' ? '#7e22ce' : sku.tier === 'value' ? '#15803d' : '#059669',
                        border: `1px solid ${sku.tier === 'artisanal' ? '#e9d5ff' : sku.tier === 'value' ? '#bbf7d0' : '#a7f3d0'}`
                      }}>
                        {sku.tier === 'artisanal' ? '👑 ARTISANAL' : sku.tier === 'value' ? '⚡ VALUE' : '⚖️ SIGNATURE'}
                      </span>
                      <strong style={{ fontSize: '0.94rem', color: '#0f172a' }}>{sku.name}</strong>
                    </div>

                    <div style={{ fontSize: '0.74rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span>🏷️ Brand: <strong style={{ color: '#0f172a' }}>{sku.brand || 'Specialty Producer'}</strong></span>
                      <span style={{ color: '#cbd5e1' }}>•</span>
                      <span>📦 Pack: <strong>{sku.packSize || 'Standard Wholesale Pack'}</strong></span>
                      <span style={{ color: '#cbd5e1' }}>•</span>
                      <span>💰 ₱{(sku.packPrice || (skuUnitCost * 1000)).toFixed(2)} wholesale</span>
                    </div>

                    {sku.description && (
                      <div style={{ fontSize: '0.70rem', color: '#64748b', marginTop: '4px', fontStyle: 'italic' }}>
                        "{sku.description}"
                      </div>
                    )}
                  </div>

                  {/* Middle Column: Calculated Portion Cost & Delta */}
                  <div style={{ textAlign: 'right', minWidth: '130px' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      {currentVolume}ml Portion Cost
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                      ₱{newPortionCost.toFixed(2)}
                    </div>
                    
                    {/* Price Difference Indicator */}
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, marginTop: '2px' }}>
                      {isCurrent ? (
                        <span style={{ color: '#0284c7' }}>✓ Active in Recipe</span>
                      ) : costDelta > 0 ? (
                        <span style={{ color: '#b45309' }}>+₱{costDelta.toFixed(2)} / pour</span>
                      ) : (
                        <span style={{ color: '#16a34a' }}>-₱{Math.abs(costDelta).toFixed(2)} (Saves $)</span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Swap Action Button */}
                  <div>
                    {isCurrent ? (
                      <div style={{
                        padding: '8px 14px',
                        background: '#e0f2fe',
                        color: '#0369a1',
                        borderRadius: '10px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Check size={14} />
                        <span>Active</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          onSelectBrand({
                            ...layer,
                            name: sku.name,
                            brand: sku.brand,
                            unitCostPerMl: skuUnitCost,
                            ingredientId: sku.id,
                            supplier: sku.supplier,
                            tier: sku.tier || 'signature',
                            densityBrix: sku.densityBrix || layer.densityBrix
                          })
                          onClose()
                        }}
                        style={{
                          background: '#0f172a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <RefreshCw size={12} />
                        <span>Swap to Brand</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
