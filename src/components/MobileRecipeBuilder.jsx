import React, { useState } from 'react'
import { Plus, Minus, Trash2, ArrowUp, ArrowDown, Package, Sparkles, Sliders, ChevronDown, ChevronUp, GripVertical, Coffee } from 'lucide-react'
import { VESSELS } from '../types/physics'
import { PACKAGING_ITEMS } from '../data/defaultCatalog'
import { calculateSubRecipeMetrics } from '../data/defaultSubRecipes'

export function MobileRecipeBuilder({
  recipe,
  catalog,
  subRecipes = [],
  includeScrap,
  setIncludeScrap,
  onUpdateRecipe,
  onLoadPreset
}) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showPackagingModal, setShowPackagingModal] = useState(false)

  const vesselPills = [
    { id: 'cold-16oz', label: '16oz Cold', sub: '473ml' },
    { id: 'boba-20oz', label: '20oz Boba', sub: '591ml' },
    { id: 'hot-12oz', label: '12oz Hot', sub: '355ml' },
    { id: 'coupe-7oz', label: '7oz Coupe', sub: '210ml' }
  ]

  const iceSegments = [
    { id: 'standard', label: 'Regular Ice' },
    { id: 'light', label: 'Less Ice' },
    { id: 'none', label: 'No Ice' }
  ]

  const handleVesselSelect = (vesselId) => {
    let defaultPackaging = ['cup-16oz-pet', 'lid-sip-cold']
    if (vesselId.includes('boba')) {
      defaultPackaging = ['cup-16oz-pet', 'lid-dome-boba', 'boba-bamboo-straw']
    } else if (vesselId.includes('coupe')) {
      defaultPackaging = ['cocktail-garnish-pick']
    }
    onUpdateRecipe({ ...recipe, vesselId, packagingIds: defaultPackaging })
  }

  // Stepper increment/decrement
  const handleStepVolume = (idx, delta) => {
    const updated = [...recipe.layers]
    const currentVol = Number(updated[idx].volumeMl || 0)
    updated[idx] = {
      ...updated[idx],
      volumeMl: Math.max(0, currentVol + delta)
    }
    onUpdateRecipe({ ...recipe, layers: updated })
  }

  // Move layer sequence up / down
  const handleMoveLayer = (idx, direction) => {
    const targetIdx = idx + direction
    if (targetIdx < 0 || targetIdx >= recipe.layers.length) return
    const updated = [...recipe.layers]
    const temp = updated[idx]
    updated[idx] = updated[targetIdx]
    updated[targetIdx] = temp
    onUpdateRecipe({ ...recipe, layers: updated })
  }

  const handleRemoveLayer = (idx) => {
    const updated = recipe.layers.filter((_, i) => i !== idx)
    if (updated.length > 0 && !updated.some(l => l.isTopOff)) {
      updated[updated.length - 1].isTopOff = true
    }
    onUpdateRecipe({ ...recipe, layers: updated })
  }

  const handleToggleTopOff = (idx) => {
    const updated = recipe.layers.map((l, i) => ({ ...l, isTopOff: i === idx }))
    onUpdateRecipe({ ...recipe, layers: updated })
  }

  const handleAddLayer = (value) => {
    if (!value) return

    if (value.startsWith('sub:')) {
      const subId = value.replace('sub:', '')
      const sub = subRecipes.find(s => s.id === subId)
      if (!sub) return

      const subM = calculateSubRecipeMetrics(sub, catalog)
      const newLayer = {
        id: `layer-sub-${Date.now()}`,
        isSubRecipe: true,
        subRecipeId: sub.id,
        ingredientId: sub.id,
        name: sub.name,
        volumeMl: sub.yieldUom === 'g' ? 60 : 50,
        unitCostPerMl: subM.effectiveUnitCost,
        colorHex: sub.colorHex || '#160802',
        densityBrix: sub.densityBrix || 50,
        scrapType: 'boba_pearls',
        isTopOff: false,
        layerType: sub.yieldUom === 'g' ? 'bottom_boba' : 'top_foam'
      }
      onUpdateRecipe({ ...recipe, layers: [...recipe.layers, newLayer] })
      return
    }

    const item = catalog.find(c => c.id === value)
    if (!item) return

    const newLayer = {
      id: `layer-${Date.now()}`,
      ingredientId: item.id,
      name: item.name,
      volumeMl: item.category === 'milk' || item.category === 'tea' ? 0 : 30,
      unitCostPerMl: item.unitCostPerMl,
      colorHex: item.colorHex || '#f59e0b',
      densityBrix: item.densityBrix || 10,
      scrapType: item.scrapType || 'standard',
      isTopOff: item.category === 'milk' || item.category === 'tea',
      layerType: item.layerType || 'liquid'
    }

    let updated = [...recipe.layers]
    if (newLayer.isTopOff) {
      updated = updated.map(l => ({ ...l, isTopOff: false }))
    }
    updated.push(newLayer)
    onUpdateRecipe({ ...recipe, layers: updated })
  }

  const handleTogglePackaging = (pkgId) => {
    const current = recipe.packagingIds || []
    const updated = current.includes(pkgId) ? current.filter(id => id !== pkgId) : [...current, pkgId]
    onUpdateRecipe({ ...recipe, packagingIds: updated })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '680px', margin: '0 auto' }}>
      {/* 1. Bold 22pt Drink Title & Presets */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Drink Configuration
          </span>
          <button
            onClick={onLoadPreset}
            style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#92400e',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={12} />
            <span>Preset Recipes</span>
          </button>
        </div>

        <input
          type="text"
          value={recipe.name}
          onChange={(e) => onUpdateRecipe({ ...recipe, name: e.target.value })}
          style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: '#111827',
            fontFamily: 'var(--font-display)',
            border: 'none',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '6px',
            width: '100%',
            outline: 'none',
            background: 'transparent',
            lineHeight: 1.3
          }}
          placeholder="Drink Name..."
        />
      </div>

      {/* 2. Cup & Size (Horizontal Scrollable Segmented Bar) */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '18px 20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '10px' }}>
          Cup Vessel & Size
        </label>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
          {vesselPills.map(v => {
            const isSelected = recipe.vesselId === v.id
            return (
              <button
                key={v.id}
                onClick={() => handleVesselSelect(v.id)}
                style={{
                  flex: 1,
                  minWidth: '105px',
                  padding: '10px 12px',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #451a03' : '1px solid #e5e7eb',
                  background: isSelected ? '#fffbeb' : '#ffffff',
                  color: isSelected ? '#451a03' : '#4b5563',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>{v.label}</div>
                <div style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: '2px' }}>{v.sub}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Ice Level (iOS 3-Segment Control) */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '18px 20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '10px' }}>
          Ice Level
        </label>
        <div
          style={{
            display: 'flex',
            background: '#f3f4f6',
            padding: '4px',
            borderRadius: '12px',
            gap: '4px'
          }}
        >
          {iceSegments.map(seg => {
            const isSelected = recipe.iceTypeId === seg.id
            return (
              <button
                key={seg.id}
                onClick={() => onUpdateRecipe({ ...recipe, iceTypeId: seg.id })}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  borderRadius: '10px',
                  border: 'none',
                  background: isSelected ? '#ffffff' : 'transparent',
                  color: isSelected ? '#111827' : '#6b7280',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {seg.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Refactored Ingredient Cards (Thumb Steppers & Sequence Handles) */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#111827' }}>
              Ingredient Strata & Order
            </label>
            <p style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
              Poured from bottom (1) to top
            </p>
          </div>

          {/* Add Dropdown */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleAddLayer(e.target.value)
                e.target.value = ''
              }
            }}
            style={{
              background: '#f9fafb',
              border: '1px solid #d1d5db',
              borderRadius: '10px',
              padding: '7px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#111827',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="" disabled selected>+ Add Ingredient</option>
            <optgroup label="✨ House Batch Preps">
              {subRecipes.map(s => (
                <option key={s.id} value={`sub:${s.id}`}>[Batch] {s.name}</option>
              ))}
            </optgroup>
            <optgroup label="📦 Raw Ingredients">
              {catalog.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Clean Ergonomic Layer Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recipe.layers.map((layer, idx) => (
            <div
              key={layer.id || idx}
              style={{
                background: layer.isTopOff ? '#ecfdf5' : '#ffffff',
                border: `1px solid ${layer.isTopOff ? '#a7f3d0' : '#e5e7eb'}`,
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              {/* Layer Sequence Number & Color Swatch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: layer.colorHex || '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    flexShrink: 0,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}
                >
                  {idx + 1}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                    {layer.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                    {layer.isTopOff ? 'Auto fill to rim line' : `Portion: ${layer.volumeMl} ml`}
                  </div>
                </div>
              </div>

              {/* Touch Stepper (- / +) or Top-off Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {!layer.isTopOff ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#f3f4f6',
                      borderRadius: '10px',
                      padding: '2px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <button
                      onClick={() => handleStepVolume(idx, -5)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#374151',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}
                    >
                      <Minus size={14} />
                    </button>

                    <div style={{ minWidth: '46px', textAlign: 'center', fontSize: '0.82rem', fontWeight: 800, color: '#111827', fontFamily: 'var(--font-mono)' }}>
                      {layer.volumeMl}
                    </div>

                    <button
                      onClick={() => handleStepVolume(idx, 5)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#374151',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleToggleTopOff(idx)}
                    style={{
                      background: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Top-Off Liquid
                  </button>
                )}

                {/* Sequence Shift Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button
                    onClick={() => handleMoveLayer(idx, -1)}
                    disabled={idx === 0}
                    style={{
                      width: '24px',
                      height: '16px',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb',
                      background: '#f9fafb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: idx === 0 ? 'default' : 'pointer',
                      opacity: idx === 0 ? 0.3 : 1
                    }}
                  >
                    <ArrowUp size={11} />
                  </button>
                  <button
                    onClick={() => handleMoveLayer(idx, 1)}
                    disabled={idx === recipe.layers.length - 1}
                    style={{
                      width: '24px',
                      height: '16px',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb',
                      background: '#f9fafb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: idx === recipe.layers.length - 1 ? 'default' : 'pointer',
                      opacity: idx === recipe.layers.length - 1 ? 0.3 : 1
                    }}
                  >
                    <ArrowDown size={11} />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemoveLayer(idx)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Packaging Auto-Bundle Pill */}
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: '14px 18px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={16} color="#6b7280" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827' }}>
            Packaging Auto-Bundled ({recipe.packagingIds?.length || 2} items)
          </span>
        </div>

        <button
          onClick={() => setShowPackagingModal(!showPackagingModal)}
          style={{ fontSize: '0.74rem', color: '#c2410c', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          {showPackagingModal ? 'Done' : 'Customize'}
        </button>
      </div>

      {showPackagingModal && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px', padding: '0 4px' }}>
          {PACKAGING_ITEMS.map(pkg => {
            const isSelected = (recipe.packagingIds || []).includes(pkg.id)
            return (
              <button
                key={pkg.id}
                onClick={() => handleTogglePackaging(pkg.id)}
                style={{
                  background: isSelected ? '#fffbeb' : '#ffffff',
                  border: isSelected ? '2px solid #451a03' : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '8px 10px',
                  fontSize: '0.72rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: isSelected ? '#451a03' : '#4b5563'
                }}
              >
                <div style={{ fontWeight: 700 }}>{pkg.name.split(' (')[0]}</div>
                <div style={{ color: '#6b7280', marginTop: '2px' }}>+₱{pkg.unitCost.toFixed(2)}</div>
              </button>
            )
          })}
        </div>
      )}

      {/* 6. Collapsible Food Science Drawer */}
      <div style={{ padding: '0 4px', marginBottom: '80px' }}>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '0.76rem',
            fontWeight: 700,
            color: '#6b7280',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sliders size={14} />
          <span>Advanced Food Science & Scrap Buffer</span>
          {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showAdvanced && (
          <div style={{ marginTop: '10px', background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1px solid #e5e7eb', fontSize: '0.74rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#111827' }}>Bar Shrinkage Buffer (+8% to 18%)</strong>
                <p style={{ color: '#6b7280', marginTop: '2px' }}>
                  Absorbs espresso dial-in purge, milk steam pitcher loss, & boba expiration directly into COGS.
                </p>
              </div>
              <input
                type="checkbox"
                checked={includeScrap}
                onChange={(e) => setIncludeScrap(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
