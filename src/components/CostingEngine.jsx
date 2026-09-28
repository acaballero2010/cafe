import React, { useState } from 'react'
import {
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  Percent,
  Package,
  Layers,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Sliders,
  ChefHat,
  Flame,
  History,
  Maximize2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck
} from 'lucide-react'
import { VESSELS, ICE_TYPES, SCRAP_PROFILES } from '../types/physics'
import { PACKAGING_ITEMS } from '../data/defaultCatalog'
import { calculateSubRecipeMetrics } from '../data/defaultSubRecipes'
import { calculateTargetPriceLadder } from '../utils/beverageCalculators'
import { MultiCupScalerPanel } from './MultiCupScalerPanel'
import { DeliveryMarginSimulator } from './DeliveryMarginSimulator'
import { PriceSurgeSimulatorModal } from './PriceSurgeSimulatorModal'
import { RecipeIterationHistoryModal } from './RecipeIterationHistoryModal'
import { IngredientTierSelectorCard } from './IngredientTierSelectorCard'

export function CostingEngine({
  recipe,
  catalog,
  subRecipes = [],
  metrics,
  includeScrap,
  setIncludeScrap,
  onUpdateRecipe,
  onLoadPreset,
  currentUser
}) {
  const [activeTab, setActiveTab] = useState('builder') // 'builder' | 'multicup' | 'delivery' | 'ladder'
  const [showScrapInfo, setShowScrapInfo] = useState(false)
  const [selectedPackagingIds, setSelectedPackagingIds] = useState(recipe.packagingIds || ['cup-16oz-pet', 'lid-sip-cold', 'kraft-sleeve'])
  
  // Modals
  const [isSurgeModalOpen, setIsSurgeModalOpen] = useState(false)
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false)

  const handleVesselChange = (vesselId) => {
    onUpdateRecipe({ ...recipe, vesselId })
  }

  const handleIceChange = (iceTypeId) => {
    onUpdateRecipe({ ...recipe, iceTypeId })
  }

  const handleLayerVolumeChange = (idx, newVolume) => {
    const updatedLayers = [...recipe.layers]
    updatedLayers[idx] = {
      ...updatedLayers[idx],
      volumeMl: Math.max(0, Number(newVolume))
    }
    onUpdateRecipe({ ...recipe, layers: updatedLayers })
  }

  const handleToggleTopOff = (idx) => {
    const updatedLayers = recipe.layers.map((l, i) => ({
      ...l,
      isTopOff: i === idx
    }))
    onUpdateRecipe({ ...recipe, layers: updatedLayers })
  }

  const handleRemoveLayer = (idx) => {
    const updatedLayers = recipe.layers.filter((_, i) => i !== idx)
    if (updatedLayers.length > 0 && !updatedLayers.some(l => l.isTopOff)) {
      updatedLayers[updatedLayers.length - 1].isTopOff = true
    }
    onUpdateRecipe({ ...recipe, layers: updatedLayers })
  }

  const handleAddIngredientOrSubRecipe = (value) => {
    if (!value) return

    if (value.startsWith('sub:')) {
      const subId = value.replace('sub:', '')
      const sub = subRecipes.find(s => s.id === subId)
      if (!sub) return

      const subMetrics = calculateSubRecipeMetrics(sub, catalog)
      const newLayer = {
        id: `layer-sub-${Date.now()}`,
        isSubRecipe: true,
        subRecipeId: sub.id,
        ingredientId: sub.id,
        name: `[Batch] ${sub.name}`,
        volumeMl: sub.yieldUom === 'g' ? 60 : 50,
        unitCostPerMl: subMetrics.effectiveUnitCost,
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

  const handleTogglePackaging = (pkgId) => {
    let updated
    if (selectedPackagingIds.includes(pkgId)) {
      updated = selectedPackagingIds.filter(id => id !== pkgId)
    } else {
      updated = [...selectedPackagingIds, pkgId]
    }
    setSelectedPackagingIds(updated)
    onUpdateRecipe({ ...recipe, packagingIds: updated })
  }

  const {
    nominalLiquidCost,
    realLiquidCostWithScrap,
    scrapLossDollar,
    packagingCost,
    iceCost,
    totalCogs,
    grossProfit,
    grossMarginPct,
    suggestedMenuPrice
  } = metrics

  const isHealthyMargin = grossMarginPct >= 75
  const isWarningMargin = grossMarginPct >= 65 && grossMarginPct < 75

  // Calculate Reverse Price Ladder
  const priceLadder = calculateTargetPriceLadder(totalCogs)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Recipe Header & Meta */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                value={recipe.name || recipe.title}
                onChange={(e) => onUpdateRecipe({ ...recipe, name: e.target.value, title: e.target.value })}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px dashed var(--border-medium)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  width: '100%',
                  paddingBottom: '4px',
                  outline: 'none'
                }}
                placeholder="Recipe Title"
              />
              <span style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#38bdf8',
                padding: '2px 8px',
                borderRadius: '6px',
                whiteSpace: 'nowrap'
              }}>
                {recipe.currentVersion || 'v1.0'}
              </span>
            </div>

            <input
              type="text"
              value={recipe.description || ''}
              onChange={(e) => onUpdateRecipe({ ...recipe, description: e.target.value })}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                width: '100%',
                marginTop: '6px',
                outline: 'none'
              }}
              placeholder="Menu description & flavor profile notes..."
            />
          </div>

          {/* Quick Tool Actions */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsVersionModalOpen(true)}
              title="View R&D Revisions & Version Diff"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <History size={14} color="#34d399" />
              <span>R&D Versions</span>
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsSurgeModalOpen(true)}
              title="Simulate Ingredient Inflation & Price Surges"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Flame size={14} color="#f97316" />
              <span>Surge Stress-Test</span>
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={onLoadPreset}
              title="Load Signature Recipe Presets"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Sparkles size={14} color="#fbbf24" />
              <span>Presets</span>
            </button>
          </div>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '10px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {[
            { id: 'builder', label: '🧪 Recipe Builder', desc: 'Layers & Physics' },
            { id: 'tiers', label: '✨ Ingredient Tiers', desc: 'Value / Signature / Reserve' },
            { id: 'multicup', label: '📐 Multi-Cup Sizing', desc: '12oz / 16oz / 22oz / 1L' },
            { id: 'delivery', label: '🛵 Delivery & Grab/Panda', desc: '25% Commissions' },
            { id: 'ladder', label: '🎯 Target Margin Ladder', desc: 'Reverse Pricing Solver' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: activeTab === tab.id ? '1px solid #38bdf8' : '1px solid transparent',
                background: activeTab === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                color: activeTab === tab.id ? '#38bdf8' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? '700' : '500',
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Builder (Vessels & Ice) */}
        {activeTab === 'builder' && (
          <>
            {/* 1. Vessel Shape Picker */}
            <div style={{ marginTop: '18px' }}>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                1. Serving Glassware / To-Go Vessel
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '8px',
                  marginTop: '8px'
                }}
              >
                {VESSELS.map(v => (
                  <button
                    key={v.id}
                    onClick={() => handleVesselChange(v.id)}
                    style={{
                      background: recipe.vesselId === v.id ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 0, 0, 0.25)',
                      border: recipe.vesselId === v.id ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 10px',
                      color: recipe.vesselId === v.id ? '#fbbf24' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{v.name.split(' (')[0]}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {v.volumeMl} ml ({v.volumeOz} oz)
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Ice Displacement Level */}
            <div style={{ marginTop: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  2. Ice Displacement Level
                </label>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  {metrics.ice.name} (-{metrics.iceDisplacementMl} ml / -{(metrics.iceDisplacementMl / 29.57).toFixed(1)} oz)
                </span>
              </div>

              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {ICE_TYPES.map(i => (
                  <button
                    key={i.id}
                    onClick={() => handleIceChange(i.id)}
                    style={{
                      background: recipe.iceTypeId === i.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 0, 0, 0.25)',
                      border: recipe.iceTypeId === i.id ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 10px',
                      fontSize: '0.74rem',
                      color: recipe.iceTypeId === i.id ? '#38bdf8' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {i.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tab: Ingredient Tiers Preset */}
      {activeTab === 'tiers' && (
        <IngredientTierSelectorCard
          recipe={recipe}
          catalog={catalog}
          onUpdateRecipe={onUpdateRecipe}
        />
      )}

      {/* Tab 2: Multi-Cup Sizing Matrix */}
      {activeTab === 'multicup' && (
        <MultiCupScalerPanel
          recipe={recipe}
          onApplyScaledRecipe={(scaled) => {
            onUpdateRecipe(scaled)
            setActiveTab('builder')
          }}
          targetMarginPct={75}
        />
      )}

      {/* Tab 3: Delivery Channel Simulator */}
      {activeTab === 'delivery' && (
        <DeliveryMarginSimulator
          recipe={recipe}
          baseCogs={totalCogs}
          basePrice={recipe.price || recipe.menuPrice || 180}
          targetMarginPct={75}
        />
      )}

      {/* Tab 4: Target Margin Ladder */}
      {activeTab === 'ladder' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                🎯 Target Margin & Reverse Price Ladder
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Shows the exact retail menu price needed to achieve each gross margin target, factoring in 1.5% e-wallet fees.
              </p>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(56,189,248,0.12)', padding: '4px 10px', borderRadius: '8px' }}>
              Base COGS: ₱{totalCogs.toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            {priceLadder.map(tier => (
              <div
                key={tier.targetMarginPct}
                onClick={() => onUpdateRecipe({ ...recipe, menuPrice: tier.charmPrice, price: tier.charmPrice })}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: tier.targetMarginPct === 75 ? '2px solid #34d399' : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  {tier.targetMarginPct}% TARGET MARGIN
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: tier.targetMarginPct >= 75 ? '#34d399' : '#fbbf24', margin: '4px 0' }}>
                  ₱{tier.charmPrice}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Gross Profit: <strong style={{ color: '#ffffff' }}>+₱{tier.grossProfit.toFixed(2)}</strong>
                </div>
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: tier.targetMarginPct === 75 ? '#059669' : 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Set as SRP
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Layer Stack (Raw SKUs & Batch Preps) */}
      {activeTab === 'builder' && (
        <>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, fontFamily: 'var(--font-display)', margin: 0 }}>
                  3. Layer Stack (Raw SKUs & Batch Preps)
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Add raw ingredients or house sub-recipes (tapioca batches, cheese caps, cold brew).
                </p>
              </div>

              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddIngredientOrSubRecipe(e.target.value)
                    e.target.value = ''
                  }
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  color: '#ffffff',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="" disabled selected>+ Add Layer / Batch</option>
                <optgroup label="✨ House Batch Preps (Sub-Recipes)">
                  {subRecipes.map(s => (
                    <option key={s.id} value={`sub:${s.id}`}>
                      [Batch] {s.name} (₱{calculateSubRecipeMetrics(s, catalog).effectiveUnitCostFormatted}/{s.yieldUom})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🥛 Dairy & Plant Milks">
                  {catalog.filter(c => c.category === 'milk').map(c => (
                    <option key={c.id} value={c.id}>{c.name} (₱{(c.unitCostPerMl * 1000).toFixed(0)}/L)</option>
                  ))}
                </optgroup>
                <optgroup label="☕ Coffee & Concentrates">
                  {catalog.filter(c => c.category === 'coffee' || c.category === 'concentrate').map(c => (
                    <option key={c.id} value={c.id}>{c.name} (₱{c.unitCostPerMl.toFixed(3)}/ml)</option>
                  ))}
                </optgroup>
                <optgroup label="🍯 Syrups, Purees & Sweeteners">
                  {catalog.filter(c => c.category === 'syrup' || c.category === 'sweetener').map(c => (
                    <option key={c.id} value={c.id}>{c.name} (₱{c.unitCostPerMl.toFixed(3)}/ml)</option>
                  ))}
                </optgroup>
                <optgroup label="🍵 Teas & Botanicals">
                  {catalog.filter(c => c.category === 'tea' || c.category === 'botanical').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Layer Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {metrics.layersDetailed.map((layer, idx) => (
                <div
                  key={layer.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: layer.isTopOff ? '1px dashed #38bdf8' : '1px solid var(--border-subtle)'
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: layer.colorHex || '#f59e0b',
                      flexShrink: 0
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {layer.name}
                      {layer.isSubRecipe && (
                        <span style={{ fontSize: '0.65rem', background: '#3b82f6', color: '#ffffff', padding: '1px 5px', borderRadius: '4px' }}>
                          BATCH PREP
                        </span>
                      )}
                      {layer.isTopOff && (
                        <span style={{ fontSize: '0.65rem', background: '#0284c7', color: '#ffffff', padding: '1px 5px', borderRadius: '4px' }}>
                          AUTO TOP-OFF
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      ₱{(layer.unitCostPerMl || 0).toFixed(3)}/ml • {SCRAP_PROFILES[layer.scrapType]?.name || 'Standard'} (+{(layer.scrapRate * 100).toFixed(0)}% scrap)
                    </div>
                  </div>

                  {/* Volume Input or Top-Off Display */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {layer.isTopOff ? (
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                        {layer.calculatedVolumeMl} ml
                      </span>
                    ) : (
                      <>
                        <input
                          type="number"
                          min="0"
                          value={layer.volumeMl}
                          onChange={(e) => handleLayerVolumeChange(idx, e.target.value)}
                          style={{
                            width: '60px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid var(--border-medium)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '4px 6px',
                            color: '#ffffff',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.82rem',
                            outline: 'none'
                          }}
                        />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ml</span>
                      </>
                    )}
                  </div>

                  {/* Real Cost with Scrap */}
                  <div style={{ width: '65px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600, color: '#34d399' }}>
                    ₱{layer.realCost.toFixed(2)}
                  </div>

                  {/* Top-off Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleTopOff(idx)}
                    style={{
                      border: 'none',
                      background: layer.isTopOff ? '#0284c7' : 'rgba(255, 255, 255, 0.05)',
                      color: layer.isTopOff ? '#ffffff' : 'var(--text-muted)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      cursor: 'pointer'
                    }}
                    title="Set this layer to automatically fill remaining vessel capacity"
                  >
                    Top-Off
                  </button>

                  {/* Remove Layer */}
                  <button
                    type="button"
                    onClick={() => handleRemoveLayer(idx)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Packaging Consumables */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, fontFamily: 'var(--font-display)', margin: 0 }}>
                4. Packaging & Consumables
              </h3>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                Total: ₱{packagingCost.toFixed(2)} / cup
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '8px' }}>
              {PACKAGING_ITEMS.map(pkg => {
                const isSelected = selectedPackagingIds.includes(pkg.id)
                return (
                  <button
                    key={pkg.id}
                    onClick={() => handleTogglePackaging(pkg.id)}
                    style={{
                      background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 0, 0, 0.25)',
                      border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-secondary)' }}>
                        {pkg.name}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        ₱{pkg.unitCost.toFixed(2)}
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 size={14} color="#38bdf8" />}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Global Financial Metrics Bar */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              True Prime COGS
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fb7185', fontFamily: 'var(--font-mono)' }}>
              ₱{totalCogs.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
              Liquid (₱{realLiquidCostWithScrap.toFixed(2)}) + Pack (₱{(packagingCost + iceCost).toFixed(2)})
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Gross Margin
            </div>
            <div
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: isHealthyMargin ? '#34d399' : isWarningMargin ? '#fbbf24' : '#fb7185',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {grossMarginPct.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
              Profit: <span style={{ color: '#34d399', fontWeight: 700 }}>+₱{grossProfit.toFixed(2)}</span> / pour
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Current Menu Price
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-accent)', fontWeight: 700 }}>₱</span>
              <input
                type="number"
                step="5"
                min="0"
                value={recipe.menuPrice || recipe.price || 180}
                onChange={(e) => onUpdateRecipe({ ...recipe, menuPrice: Number(e.target.value), price: Number(e.target.value) })}
                style={{
                  width: '90px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 8px',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Suggested Price (75% GM)
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              ₱{Math.ceil(suggestedMenuPrice / 5) * 5}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
              Recommended specialty anchor
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '18px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem'
          }}
        >
          <div style={{ color: 'var(--text-secondary)' }}>
            <strong>Monthly Profit Run-Rate</strong> (at 120 pours/day):
          </div>
          <div style={{ fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)', fontSize: '0.94rem' }}>
            +₱{(grossProfit * 120 * 30).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / month gross margin
          </div>
        </div>
      </div>

      {/* Modals */}
      <PriceSurgeSimulatorModal
        isOpen={isSurgeModalOpen}
        onClose={() => setIsSurgeModalOpen(false)}
        recipes={[recipe]}
        catalog={catalog}
      />

      <RecipeIterationHistoryModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        recipe={recipe}
        onUpdateRecipe={onUpdateRecipe}
        currentUser={currentUser}
      />
    </div>
  )
}
