import React, { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Package, Sparkles, Sliders, Check } from 'lucide-react'
import { VESSELS, ICE_TYPES } from '../types/physics'
import { PACKAGING_ITEMS } from '../data/defaultCatalog'
import { calculateSubRecipeMetrics } from '../data/defaultSubRecipes'

export function BuildRecipePanel({
  recipe,
  catalog,
  subRecipes = [],
  includeScrap,
  setIncludeScrap,
  onUpdateRecipe,
  onLoadPreset
}) {
  const [showAdvancedScience, setShowAdvancedScience] = useState(false)
  const [isEditingPackaging, setIsEditingPackaging] = useState(false)

  const commonVessels = [
    { id: 'cold-16oz', label: '16oz Cold' },
    { id: 'boba-20oz', label: '20oz Boba' },
    { id: 'hot-12oz', label: '12oz Hot' },
    { id: 'coupe-7oz', label: '7oz Coupe' }
  ]

  const smartIceOptions = [
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
    onUpdateRecipe({
      ...recipe,
      vesselId,
      packagingIds: defaultPackaging
    })
  }

  const handleIceSelect = (iceTypeId) => {
    onUpdateRecipe({ ...recipe, iceTypeId })
  }

  const handleAddIngredient = (value) => {
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

    let updatedLayers = [...recipe.layers]
    if (newLayer.isTopOff) {
      updatedLayers = updatedLayers.map(l => ({ ...l, isTopOff: false }))
    }
    updatedLayers.push(newLayer)
    onUpdateRecipe({ ...recipe, layers: updatedLayers })
  }

  const handleRemoveLayer = (idx) => {
    const updatedLayers = recipe.layers.filter((_, i) => i !== idx)
    if (updatedLayers.length > 0 && !updatedLayers.some(l => l.isTopOff)) {
      updatedLayers[updatedLayers.length - 1].isTopOff = true
    }
    onUpdateRecipe({ ...recipe, layers: updatedLayers })
  }

  const handleVolumeChange = (idx, newVol) => {
    const updated = [...recipe.layers]
    updated[idx] = { ...updated[idx], volumeMl: Math.max(0, Number(newVol)) }
    onUpdateRecipe({ ...recipe, layers: updated })
  }

  const handleToggleTopOff = (idx) => {
    const updated = recipe.layers.map((l, i) => ({ ...l, isTopOff: i === idx }))
    onUpdateRecipe({ ...recipe, layers: updated })
  }

  const handleTogglePackagingItem = (pkgId) => {
    const current = recipe.packagingIds || []
    const updated = current.includes(pkgId) ? current.filter(id => id !== pkgId) : [...current, pkgId]
    onUpdateRecipe({ ...recipe, packagingIds: updated })
  }

  return (
    <div className="card-clean" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. Header & Drink Title (No Text Clipping) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-amber)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Step 1 • Build Recipe
          </span>
          <button
            className="btn-clean btn-clean-secondary btn-clean-sm"
            onClick={onLoadPreset}
            style={{ fontSize: '0.74rem' }}
          >
            <Sparkles size={13} color="#d97706" />
            <span>Presets</span>
          </button>
        </div>

        <textarea
          rows={2}
          value={recipe.name}
          onChange={(e) => onUpdateRecipe({ ...recipe, name: e.target.value })}
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            border: 'none',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '4px',
            width: '100%',
            outline: 'none',
            background: 'transparent',
            resize: 'none',
            lineHeight: 1.3
          }}
          placeholder="Drink Name..."
        />
      </div>

      {/* 2. Cup & Size Selector */}
      <div>
        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
          Cup & Size
        </label>
        <div className="pill-group" style={{ width: '100%' }}>
          {commonVessels.map(v => (
            <button
              key={v.id}
              className={`pill-btn ${recipe.vesselId === v.id ? 'active' : ''}`}
              onClick={() => handleVesselSelect(v.id)}
              style={{ flex: 1, justifyContent: 'center', padding: '6px 8px', fontSize: '0.76rem' }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Ice Level Selector */}
      <div>
        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
          Ice Level
        </label>
        <div className="pill-group" style={{ width: '100%' }}>
          {smartIceOptions.map(i => (
            <button
              key={i.id}
              className={`pill-btn ${recipe.iceTypeId === i.id ? 'active' : ''}`}
              onClick={() => handleIceSelect(i.id)}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Ingredients & Layer Stack (Clean & Spacious) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Ingredients & Sequence
          </label>

          <select
            onChange={(e) => {
              if (e.target.value) {
                handleAddIngredient(e.target.value)
                e.target.value = ''
              }
            }}
            style={{
              background: '#f8f9fb',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '5px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="" disabled selected>+ Add Item</option>
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

        {/* Clean Items List with Wrap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recipe.layers.map((layer, idx) => (
            <div
              key={layer.id || idx}
              style={{
                background: layer.isTopOff ? 'var(--margin-green-bg)' : '#ffffff',
                border: `1px solid ${layer.isTopOff ? 'var(--margin-green-border)' : 'var(--border-light)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}
            >
              {/* Color dot & Name with comfortable wrapping */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: layer.colorHex || '#d97706',
                    flexShrink: 0,
                    marginTop: '4px'
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-word', lineHeight: 1.3 }}>
                    {layer.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {layer.isTopOff ? 'Auto fill to rim line' : `${layer.volumeMl} ml`}
                  </div>
                </div>
              </div>

              {/* Volume input or Top-off pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {!layer.isTopOff && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      step="5"
                      value={layer.volumeMl}
                      onChange={(e) => handleVolumeChange(idx, e.target.value)}
                      style={{
                        width: '50px',
                        padding: '3px 4px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-xs)',
                        textAlign: 'right',
                        outline: 'none',
                        fontFamily: 'var(--font-mono)'
                      }}
                    />
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ml</span>
                  </div>
                )}

                <button
                  onClick={() => handleToggleTopOff(idx)}
                  title={layer.isTopOff ? 'Auto top-off active' : 'Set as auto top-off liquid'}
                  style={{
                    padding: '3px 6px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-light)',
                    background: layer.isTopOff ? '#059669' : '#f3f4f6',
                    color: layer.isTopOff ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  Top-Off
                </button>

                <button
                  onClick={() => handleRemoveLayer(idx)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Auto-Bundled Packaging (₱) */}
      <div style={{ background: '#f8f9fb', borderRadius: 'var(--radius-md)', padding: '12px 14px', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Package size={15} color="#6b7280" />
            <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Packaging Auto-Bundled ({recipe.packagingIds?.length || 2} items)
            </span>
          </div>

          <button
            onClick={() => setIsEditingPackaging(!isEditingPackaging)}
            style={{ fontSize: '0.72rem', color: 'var(--brand-amber)', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {isEditingPackaging ? 'Done' : 'Customize'}
          </button>
        </div>

        {isEditingPackaging && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '6px', marginTop: '10px' }}>
            {PACKAGING_ITEMS.map(pkg => {
              const isSelected = (recipe.packagingIds || []).includes(pkg.id)
              return (
                <button
                  key={pkg.id}
                  onClick={() => handleTogglePackagingItem(pkg.id)}
                  style={{
                    background: isSelected ? '#ffffff' : '#f1f3f5',
                    border: `1px solid ${isSelected ? '#111827' : 'var(--border-light)'}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 8px',
                    fontSize: '0.7rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)'
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{pkg.name.split(' (')[0]}</div>
                  <div>+₱{pkg.unitCost.toFixed(2)}</div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 6. Food Science Accordion */}
      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
        <button
          onClick={() => setShowAdvancedScience(!showAdvancedScience)}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '0.74rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sliders size={13} />
          <span>Advanced Food Science & Yield Settings</span>
          {showAdvancedScience ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {showAdvancedScience && (
          <div style={{ marginTop: '10px', background: '#f8f9fb', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.72rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Bar Shrinkage Buffer (+8% to 18%)</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                  Absorbs espresso dial-in purge, milk steam pitcher loss, & boba expiration directly into COGS.
                </p>
              </div>
              <input
                type="checkbox"
                checked={includeScrap}
                onChange={(e) => setIncludeScrap(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
