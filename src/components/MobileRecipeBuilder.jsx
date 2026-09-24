import React, { useState } from 'react'
import { Plus, Minus, GripVertical, Package, Sparkles, Sliders, ChevronDown, ChevronUp, Link2, Search, FolderPlus, BookmarkCheck, Check, X } from 'lucide-react'
import { VESSELS } from '../types/physics'
import { PACKAGING_ITEMS } from '../data/defaultCatalog'
import { calculateSubRecipeMetrics } from '../data/defaultSubRecipes'
import { IngredientSupplierPickerModal } from './IngredientSupplierPickerModal'
import { AiRecipeGeneratorModal } from './AiRecipeGeneratorModal'
import { DrinkDiscoveryModal } from './DrinkDiscoveryModal'
import { BenchmarkRecipesCarousel } from './BenchmarkRecipesCarousel'

export function MobileRecipeBuilder({
  recipe,
  catalog,
  subRecipes = [],
  includeScrap,
  setIncludeScrap,
  onUpdateRecipe,
  onLoadPreset,
  savedMenus = [],
  onSaveToMenu = () => {}
}) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showPackagingModal, setShowPackagingModal] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [pickerTargetPortion, setPickerTargetPortion] = useState(200)
  const [isAiGenOpen, setIsAiGenOpen] = useState(false)
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false)
  const [isSaveMenuModalOpen, setIsSaveMenuModalOpen] = useState(false)
  const [selectedTargetMenuId, setSelectedTargetMenuId] = useState(savedMenus[0]?.id || 'new')
  const [newMenuTitleInput, setNewMenuTitleInput] = useState('')
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('')

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

  const currentVessel = VESSELS.find(v => v.id === recipe.vesselId) || VESSELS[0]

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

  // Clean, concise portion stepper string without redundancy
  const getPortionLabel = (layer) => {
    if (layer.isTopOff) return 'Top-Off'
    const vol = layer.volumeMl || 0
    if (layer.layerType === 'espresso' || layer.ingredientId?.includes('espresso')) {
      const shots = Math.round(vol / 18)
      return `${shots || 2} shots (${vol}ml)`
    }
    if (layer.layerType === 'dense_syrup' || layer.ingredientId?.includes('syrup')) {
      const pumps = (vol / 12.5).toFixed(1).replace('.0', '')
      return `${pumps} pumps (${vol}ml)`
    }
    return `${vol}ml`
  }

  // Clean layer name without embedded measurement noise
  const getCleanName = (name) => {
    return name.replace(/\s*\([^)]*\)/g, '').trim()
  }

  // Clean metadata subtext
  const getLayerSubtext = (idx, total, isTopOff) => {
    if (idx === 0) return 'Layer 1 • Base foundation'
    if (isTopOff || idx === total - 1) return `Layer ${idx + 1} • Crown top-off`
    return `Layer ${idx + 1} • Middle stratum`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '680px', margin: '0 auto' }}>
      
      {/* 1. Clean Drink Title & Action Row (Stacked 2-Tier Layout - Zero Truncation!) */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '18px 20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        {/* Full-width Drink Title */}
        <div style={{ marginBottom: '14px' }}>
          <input
            type="text"
            value={recipe.name}
            onChange={(e) => onUpdateRecipe({ ...recipe, name: e.target.value })}
            style={{
              fontSize: '1.3rem', // ~22pt bold
              fontWeight: 800,
              color: '#0f172a', // text-slate-900
              fontFamily: 'var(--font-display)',
              border: 'none',
              padding: 0,
              width: '100%',
              outline: 'none',
              background: 'transparent',
              lineHeight: 1.3
            }}
            placeholder="Enter Drink Name..."
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
              Base Spec • {currentVessel.name.split(' (')[0]}
            </span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />
            <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 700 }}>
              ₱{(recipe.menuPrice || 180).toFixed(2)} Target Menu Price
            </span>
          </div>
        </div>

        {/* Action Button Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
          <button
            onClick={() => setIsDiscoveryOpen(true)}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              padding: '8px 6px',
              borderRadius: '12px',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              minHeight: '38px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease'
            }}
          >
            <Search size={13} color="#2563eb" />
            <span>Discover</span>
          </button>

          <button
            onClick={() => setIsAiGenOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #0f172a, #334155)',
              border: 'none',
              color: '#ffffff',
              padding: '8px 6px',
              borderRadius: '12px',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              minHeight: '38px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={13} color="#fbbf24" />
            <span>AI Gen</span>
          </button>

          <button
            onClick={onLoadPreset}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              padding: '8px 6px',
              borderRadius: '12px',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              minHeight: '38px',
              transition: 'all 0.15s ease'
            }}
          >
            <span>Presets</span>
          </button>

          <button
            onClick={() => setIsSaveMenuModalOpen(true)}
            style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#047857',
              padding: '8px 6px',
              borderRadius: '12px',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              minHeight: '38px',
              boxShadow: '0 1px 3px rgba(5, 150, 105, 0.12)',
              transition: 'all 0.15s ease'
            }}
          >
            <FolderPlus size={13} color="#059669" />
            <span>+ Menu</span>
          </button>
        </div>
      </div>

      {/* Save Recipe to Menu Modal */}
      {isSaveMenuModalOpen && (
        <div className="clean-modal-overlay" onClick={() => setIsSaveMenuModalOpen(false)}>
          <div className="clean-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  <FolderPlus size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Save Recipe to Menu
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
                    Add "{recipe.name}" to your shop lineups.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSaveMenuModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {saveSuccessMessage ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '18px', textAlign: 'center', color: '#047857', fontWeight: 800, fontSize: '0.88rem' }}>
                <Check size={24} color="#059669" style={{ margin: '0 auto 6px' }} />
                <div>{saveSuccessMessage}</div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (selectedTargetMenuId === 'new') {
                    if (!newMenuTitleInput.trim()) return
                    const newMenu = {
                      id: `menu-${Date.now()}`,
                      title: newMenuTitleInput,
                      description: 'Custom curated drink lineup.',
                      season: 'Core / Year-Round',
                      updatedAt: 'Just now',
                      drinks: [recipe]
                    }
                    onSaveToMenu(newMenu, true)
                    setSaveSuccessMessage(`✓ Created "${newMenu.title}" & added "${recipe.name}"!`)
                  } else {
                    const targetMenu = savedMenus.find(m => m.id === selectedTargetMenuId)
                    onSaveToMenu(recipe, false, selectedTargetMenuId)
                    setSaveSuccessMessage(`✓ Saved to "${targetMenu?.title || 'Menu'}"!`)
                  }

                  setTimeout(() => {
                    setIsSaveMenuModalOpen(false)
                    setSaveSuccessMessage('')
                    setNewMenuTitleInput('')
                  }, 1200)
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Select Target Menu Collection
                  </label>
                  <select
                    value={selectedTargetMenuId}
                    onChange={(e) => setSelectedTargetMenuId(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', background: '#ffffff', boxSizing: 'border-box' }}
                  >
                    {savedMenus.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({m.drinks.length} drinks)
                      </option>
                    ))}
                    <option value="new">+ Create New Menu Collection...</option>
                  </select>
                </div>

                {selectedTargetMenuId === 'new' && (
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      New Menu Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Signature Cold Drinks, Weekend Brunch..."
                      value={newMenuTitleInput}
                      onChange={(e) => setNewMenuTitleInput(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                    />
                  </div>
                )}

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.74rem', color: '#64748b' }}>
                  <strong>Drink Spec Summary:</strong> {recipe.name} • ₱{(recipe.menuPrice || 180).toFixed(2)} retail • {recipe.layers?.length || 3} layers
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setIsSaveMenuModalOpen(false)}
                    style={{ background: '#f1f5f9', border: 'none', padding: '9px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ background: '#059669', border: 'none', padding: '9px 16px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', cursor: 'pointer' }}
                  >
                    Confirm & Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. Cup & Size Selector */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '16px 18px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
                  minWidth: '100px',
                  padding: '10px 8px',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #0f172a' : '1px solid #e2e8f0',
                  background: isSelected ? '#ffffff' : '#f8fafc',
                  color: isSelected ? '#0f172a' : '#475569',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>{v.label}</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>{v.sub}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Ice Level Selector (iOS Segment) */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '16px 18px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Ice Level
        </label>
        <div
          style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '14px',
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
                  color: isSelected ? '#0f172a' : '#64748b',
                  fontSize: '0.84rem',
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

      {/* 4. Streamlined Recipe Build Order (Balanced 2-Row Layout, No Squishing!) */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '18px 20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Recipe Build Order
          </h2>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>
            {recipe.layers.length} Layers
          </span>
        </div>

        {/* List of 2-Row Ingredient Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recipe.layers.map((layer, idx) => (
            <div
              key={layer.id || idx}
              style={{
                background: layer.isTopOff ? '#f0fdf4' : '#ffffff',
                border: `1px solid ${layer.isTopOff ? '#bbf7d0' : '#e2e8f0'}`,
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}
            >
              {/* Row 1: Number Badge + Clean Ingredient Name + Drag Handle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
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
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}
                  >
                    {idx + 1}
                  </div>

                  <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {getCleanName(layer.name)}
                  </span>
                </div>

                {/* Drag Handle Icon (⋮⋮) */}
                <div style={{ color: '#94a3b8', cursor: 'grab', padding: '4px 2px', display: 'flex', alignItems: 'center' }} title="Reorder Sequence">
                  <GripVertical size={18} />
                </div>
              </div>

              {/* Row 2: Metadata Subtext (Left) + Compact Stepper (Right) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingTop: '2px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                  {getLayerSubtext(idx, recipe.layers.length, layer.isTopOff)}
                </span>

                {/* Stepper Pill or Top-Off Button */}
                {!layer.isTopOff ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      padding: '2px',
                      border: '1px solid #cbd5e1'
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
                        color: '#334155',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}
                      aria-label="Decrease volume"
                    >
                      <Minus size={13} />
                    </button>

                    <div style={{ minWidth: '95px', textAlign: 'center', fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', padding: '0 6px', fontFamily: 'var(--font-mono)' }}>
                      {getPortionLabel(layer)}
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
                        color: '#334155',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}
                      aria-label="Increase volume"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleToggleTopOff(idx)}
                    style={{
                      background: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      minHeight: '34px'
                    }}
                  >
                    Top-Off Liquid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 3. Missing Full-Width "+ Add Ingredient or Layer" Button + Link Supplier Action */}
        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {!showAddMenu ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowAddMenu(true)}
                style={{
                  flex: 1,
                  height: '48px',
                  borderRadius: '14px',
                  border: '2px dashed #cbd5e1',
                  background: '#f8fafc',
                  color: '#475569',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Plus size={16} />
                <span>+ Add Layer</span>
              </button>

              <button
                onClick={() => {
                  setPickerTargetPortion(200)
                  setIsPickerOpen(true)
                }}
                style={{
                  height: '48px',
                  padding: '0 14px',
                  borderRadius: '14px',
                  border: '1px solid #fed7aa',
                  background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                  color: '#b45309',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 1px 3px rgba(217, 119, 6, 0.08)'
                }}
              >
                <Link2 size={15} />
                <span>Link Supplier</span>
              </button>
            </div>
          ) : (
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155' }}>Select Item to Add:</span>
                <button
                  onClick={() => setShowAddMenu(false)}
                  style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 600 }}
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
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: '#0f172a',
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

      {/* Iconic Benchmark Specs Discovery Section (Placed below Recipe Build Order for optimal ergonomic flow) */}
      <BenchmarkRecipesCarousel
        onLoadBenchmarkSpec={(incomingSpec) => {
          const specToLoad = incomingSpec?.targetRecipe || incomingSpec
          if (specToLoad && (specToLoad.layers || specToLoad.name)) {
            onUpdateRecipe(specToLoad)
          }
        }}
        onBrowseAll={() => setIsDiscoveryOpen(true)}
      />

      {/* Ingredient & Supplier Picker Modal */}
      <IngredientSupplierPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        currentRecipeName={recipe.name}
        currentPortionMl={pickerTargetPortion}
        onApplyIngredient={({ ingredient, supplierSku, unitCostPerMl }) => {
          // Update or add layer with selected supplier quote
          const newLayer = {
            id: `layer-${Date.now()}`,
            ingredientId: ingredient.id,
            name: `${ingredient.name} (${supplierSku.brand.split(' (')[0]})`,
            volumeMl: pickerTargetPortion,
            unitCostPerMl: unitCostPerMl,
            colorHex: '#fef3c7',
            densityBrix: ingredient.densityBrix || 12,
            scrapType: 'milk_steam_pitcher',
            isTopOff: true,
            layerType: 'liquid'
          }
          let updated = recipe.layers.map(l => ({ ...l, isTopOff: false }))
          updated.push(newLayer)
          onUpdateRecipe({ ...recipe, layers: updated })
        }}
      />

      {/* AI Recipe Generator & Food Science Modal */}
      <AiRecipeGeneratorModal
        isOpen={isAiGenOpen}
        onClose={() => setIsAiGenOpen(false)}
        onLoadRecipeIntoStudio={(generatedStudioRecipe) => {
          onUpdateRecipe(generatedStudioRecipe)
        }}
      />

      {/* Drink Recipe Discovery & Guide Modal */}
      <DrinkDiscoveryModal
        isOpen={isDiscoveryOpen}
        onClose={() => setIsDiscoveryOpen(false)}
        onLoadIntoStudio={(discoveredRecipe) => {
          onUpdateRecipe(discoveredRecipe)
        }}
      />

      {/* 4. Packaging Auto-Bundle Section */}
      <div style={{ background: '#ffffff', borderRadius: '18px', padding: '16px 20px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={18} color="#64748b" />
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
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
                  border: isSelected ? '2px solid #0f172a' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  fontSize: '0.74rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: isSelected ? '#0f172a' : '#475569',
                  minHeight: '44px'
                }}
              >
                <div style={{ fontWeight: 800 }}>{pkg.name.split(' (')[0]}</div>
                <div style={{ color: '#64748b', marginTop: '2px' }}>+₱{pkg.unitCost.toFixed(2)}</div>
              </button>
            )
          })}
        </div>
      )}

      {/* 5. Food Science Accordion */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '0.76rem',
            fontWeight: 700,
            color: '#64748b',
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
                <strong style={{ color: '#0f172a' }}>Bar Shrinkage Buffer (+8% to 18%)</strong>
                <p style={{ color: '#64748b', marginTop: '2px' }}>
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
