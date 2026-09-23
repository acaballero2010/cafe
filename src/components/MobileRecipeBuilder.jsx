import React, { useState } from 'react'
import { Plus, Minus, GripVertical, Package, Sparkles, Sliders, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
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
  const [showAddMenu, setShowAddMenu] = useState(false)

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

  const handleStepVolume = (idx, delta) => {
    const updated = [...recipe.layers]
    const currentVol = Number(updated[idx].volumeMl || 0)
    updated[idx] = {
      ...updated[idx],
      volumeMl: Math.max(0, currentVol + delta)
    }
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
      setShowAddMenu(false)
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
    setShowAddMenu(false)
  }

  // Generate clean portion label
  const getPortionLabel = (layer) => {
    if (layer.isTopOff) return 'Top-Off Liquid'
    const vol = layer.volumeMl || 0
    if (layer.layerType === 'espresso') {
      const shots = Math.round(vol / 18)
      return `${vol}ml (${shots || 2} shots)`
    }
    if (layer.layerType === 'dense_syrup') {
      const pumps = (vol / 12.5).toFixed(1).replace('.0', '')
      return `${pumps} pumps (${vol}ml)`
    }
    return `${vol} ml`
  }

  // Generate layer sequence label
  const getSequenceSubtext = (idx, total, isTopOff) => {
    if (idx === 0) return 'Poured 1st • Base foundation'
    if (isTopOff || idx === total - 1) return `Poured ${idx + 1}${idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'} • Crown layer`
    return `Poured ${idx + 1}${idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'} • Middle stratum`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '680px', margin: '0 auto', paddingBottom: '130px' }}>
      {/* 1. Prominent Drink Title Hero Block */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={recipe.name}
              onChange={(e) => onUpdateRecipe({ ...recipe, name: e.target.value })}
              style={{
                fontSize: '1.28rem',
                fontWeight: 800,
                color: '#111827',
                fontFamily: 'var(--font-display)',
                border: 'none',
                borderBottom: '1px solid transparent',
                paddingBottom: '2px',
                width: '100%',
                outline: 'none',
                background: 'transparent',
                lineHeight: 1.3
              }}
              placeholder="Iced Brown Sugar Shaken Espresso"
            />
            <div style={{ fontSize: '0.74rem', color: '#9ca3af', marginTop: '4px', fontWeight: 500 }}>
              Tap to rename • Created Today
            </div>
          </div>

          <button
            onClick={onLoadPreset}
            style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              color: '#d97706',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0
            }}
          >
            <Sparkles size={12} />
            <span>Presets</span>
          </button>
        </div>
      </div>

      {/* 2. Cup & Size (Scrollable Segmented Bar) */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '16px 18px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
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
                  border: isSelected ? '2px solid #111827' : '1px solid #e5e7eb',
                  background: isSelected ? '#ffffff' : '#f9fafb',
                  color: isSelected ? '#111827' : '#4b5563',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                <div style={{ fontSize: '0.84rem', fontWeight: 800 }}>{v.label}</div>
                <div style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: '2px' }}>{v.sub}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Ice Level (iOS 3-Segment Control) */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '16px 18px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
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
                  padding: '10px 0',
                  borderRadius: '10px',
                  border: 'none',
                  background: isSelected ? '#ffffff' : 'transparent',
                  color: isSelected ? '#111827' : '#6b7280',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease',
                  minHeight: '44px'
                }}
              >
                {seg.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Streamlined Recipe Build Order */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Recipe Build Order
          </h2>
          <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>
            {recipe.layers.length} Layers
          </span>
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
                gap: '12px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              {/* Left: Swatch & Clean Title/Subtext */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: layer.colorHex || '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    flexShrink: 0
                  }}
                >
                  {idx + 1}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111827', lineHeight: 1.25 }}>
                    {layer.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '2px' }}>
                    {getSequenceSubtext(idx, recipe.layers.length, layer.isTopOff)}
                  </div>
                </div>
              </div>

              {/* Right: Sleek Touch Stepper & Reorder Handle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {!layer.isTopOff ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#f3f4f6',
                      borderRadius: '12px',
                      padding: '2px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <button
                      onClick={() => handleStepVolume(idx, -5)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#374151',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
                      }}
                    >
                      <Minus size={14} />
                    </button>

                    <div style={{ minWidth: '80px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800, color: '#111827', padding: '0 4px', fontFamily: 'var(--font-mono)' }}>
                      {getPortionLabel(layer)}
                    </div>

                    <button
                      onClick={() => handleStepVolume(idx, 5)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#374151',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
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
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      minHeight: '40px'
                    }}
                  >
                    Top-Off Liquid
                  </button>
                )}

                {/* Native Drag Reorder Handle (≡) */}
                <div style={{ color: '#9ca3af', cursor: 'grab', padding: '4px', display: 'flex', alignItems: 'center' }} title="Reorder Sequence">
                  <GripVertical size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clean Full-Width Dashed "+ Add Ingredient" Button */}
        <div style={{ marginTop: '14px' }}>
          {!showAddMenu ? (
            <button
              onClick={() => setShowAddMenu(true)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                border: '2px dashed #d1d5db',
                background: '#f9fafb',
                color: '#374151',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
                minHeight: '44px'
              }}
            >
              <Plus size={16} />
              <span>Add Ingredient to Sequence</span>
            </button>
          ) : (
            <div style={{ background: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '14px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#374151' }}>Select Item to Add:</span>
                <button
                  onClick={() => setShowAddMenu(false)}
                  style={{ background: 'transparent', border: 'none', color: '#6b7280', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
              </div>

              <select
                autoFocus
                onChange={(e) => handleAddLayer(e.target.value)}
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: '#111827',
                  cursor: 'pointer',
                  outline: 'none',
                  minHeight: '44px'
                }}
              >
                <option value="" disabled selected>Tap to choose ingredient...</option>
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
          )}
        </div>
      </div>

      {/* 5. Packaging Auto-Bundle Pill */}
      <div style={{ background: '#ffffff', borderRadius: '18px', padding: '16px 20px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={18} color="#6b7280" />
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#111827' }}>
            Packaging Auto-Bundled ({recipe.packagingIds?.length || 2} items)
          </span>
        </div>

        <button
          onClick={() => setShowPackagingModal(!showPackagingModal)}
          style={{ fontSize: '0.76rem', color: '#d97706', fontWeight: 800, background: 'transparent', border: 'none', cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center' }}
        >
          {showPackagingModal ? 'Done' : 'Customize'}
        </button>
      </div>

      {showPackagingModal && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
          {PACKAGING_ITEMS.map(pkg => {
            const isSelected = (recipe.packagingIds || []).includes(pkg.id)
            return (
              <button
                key={pkg.id}
                onClick={() => {
                  const current = recipe.packagingIds || []
                  const updated = current.includes(pkg.id) ? current.filter(id => id !== pkg.id) : [...current, pkg.id]
                  onUpdateRecipe({ ...recipe, packagingIds: updated })
                }}
                style={{
                  background: isSelected ? '#fffbeb' : '#ffffff',
                  border: isSelected ? '2px solid #111827' : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  fontSize: '0.74rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: isSelected ? '#111827' : '#4b5563',
                  minHeight: '44px'
                }}
              >
                <div style={{ fontWeight: 800 }}>{pkg.name.split(' (')[0]}</div>
                <div style={{ color: '#6b7280', marginTop: '2px' }}>+₱{pkg.unitCost.toFixed(2)}</div>
              </button>
            )
          })}
        </div>
      )}

      {/* 6. Collapsible Food Science Drawer */}
      <div>
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
            gap: '6px',
            minHeight: '44px'
          }}
        >
          <Sliders size={14} />
          <span>Advanced Food Science & Scrap Buffer</span>
          {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showAdvanced && (
          <div style={{ marginTop: '8px', background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '0.74rem' }}>
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
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
