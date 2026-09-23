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
  Sliders
} from 'lucide-react'
import { VESSELS, ICE_TYPES, SCRAP_PROFILES } from '../types/physics'
import { PACKAGING_ITEMS } from '../data/defaultCatalog'

export function CostingEngine({
  recipe,
  catalog,
  metrics,
  includeScrap,
  setIncludeScrap,
  onUpdateRecipe,
  onLoadPreset
}) {
  const [showScrapInfo, setShowScrapInfo] = useState(false)
  const [selectedPackagingIds, setSelectedPackagingIds] = useState(recipe.packagingIds || ['cup-16oz-pet', 'lid-sip-cold', 'kraft-sleeve'])

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
    // If we removed the top off layer, assign top off to the last liquid layer if any
    if (updatedLayers.length > 0 && !updatedLayers.some(l => l.isTopOff)) {
      updatedLayers[updatedLayers.length - 1].isTopOff = true
    }
    onUpdateRecipe({ ...recipe, layers: updatedLayers })
  }

  const handleAddIngredient = (ingredientId) => {
    const item = catalog.find(c => c.id === ingredientId)
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

    // If new layer is top off, remove top off from existing
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
    suggestedMenuPrice,
    targetMarginPct
  } = metrics

  const isHealthyMargin = grossMarginPct >= 75
  const isWarningMargin = grossMarginPct >= 65 && grossMarginPct < 75

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Recipe Header & Meta */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={recipe.name}
              onChange={(e) => onUpdateRecipe({ ...recipe, name: e.target.value })}
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
              placeholder="Recipe Title (e.g., Iced Salted Caramel Cream Foam)"
            />
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

          {/* Quick Presets Button */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={onLoadPreset}
              title="Load Signature Recipe Presets"
            >
              <Sparkles size={14} style={{ color: '#fbbf24' }} />
              <span>Presets</span>
            </button>
          </div>
        </div>

        {/* 1. Vessel Geometry & Shape Picker */}
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

        {/* 2. Ice Displacement Level Slider */}
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
      </div>

      {/* 3. Layer Stack & Liquid Displacement Builder */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
              3. Ingredient Layers & Density Ordering
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Layers are stacked by specific gravity. Auto top-off calculates exact milk/tea fill.
            </p>
          </div>

          {/* Add Layer Picker */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleAddIngredient(e.target.value)
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
            <option value="" disabled selected>+ Add Ingredient</option>
            {catalog.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#111827', color: '#fff' }}>
                [{c.category.toUpperCase()}] {c.name} (${c.unitCostPerMl.toFixed(4)}/ml)
              </option>
            ))}
          </select>
        </div>

        {/* Layers List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {metrics.layersDetailed.map((layer, idx) => (
            <div
              key={layer.id || idx}
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: `1px solid ${layer.isTopOff ? 'rgba(52, 211, 153, 0.4)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              {/* Layer Color swatch & name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '4px',
                    background: layer.colorHex || '#f59e0b',
                    boxShadow: `0 0 8px ${layer.colorHex || '#f59e0b'}40`
                  }}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                    {layer.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
                    <span>Density: {layer.densityBrix}° Brix</span>
                    <span>•</span>
                    <span style={{ color: '#fbbf24' }}>
                      ${layer.unitCostPerMl.toFixed(4)}/ml
                    </span>
                    {includeScrap && (
                      <span style={{ color: '#f43f5e' }}>
                        (+{(layer.scrapRate * 100).toFixed(0)}% scrap)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Volume Input or Top-off badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {layer.isTopOff ? (
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#34d399',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Auto Top-Off:</span>
                    <span>{layer.calculatedVolumeMl} ml</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="number"
                      min="0"
                      max="600"
                      step="5"
                      value={recipe.layers[idx]?.volumeMl || 0}
                      onChange={(e) => handleLayerVolumeChange(idx, e.target.value)}
                      style={{
                        width: '64px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '4px 6px',
                        fontSize: '0.8rem',
                        color: '#ffffff',
                        textAlign: 'right',
                        fontFamily: 'var(--font-mono)',
                        outline: 'none'
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ml</span>
                  </div>
                )}

                {/* Layer Cost */}
                <div style={{ minWidth: '60px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                  ${(includeScrap ? layer.realCost : layer.nominalCost).toFixed(2)}
                </div>

                {/* Toggle Top-Off */}
                <button
                  onClick={() => handleToggleTopOff(idx)}
                  title={layer.isTopOff ? 'Auto top-off active' : 'Set as auto-calculated top-off liquid'}
                  style={{
                    background: layer.isTopOff ? '#10b981' : 'transparent',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: layer.isTopOff ? '#ffffff' : 'var(--text-muted)',
                    padding: '4px 6px',
                    fontSize: '0.66rem',
                    cursor: 'pointer'
                  }}
                >
                  Top-Off
                </button>

                {/* Delete Layer */}
                <button
                  onClick={() => handleRemoveLayer(idx)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title="Remove Layer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Packaging & Consumables Check */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
              4. Packaging & Bar Consumables
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Independent cups, lids, straw, sleeve, sticker & ice cost.
            </p>
          </div>
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
            +${(packagingCost + iceCost).toFixed(2)} / drink
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
          {PACKAGING_ITEMS.map(pkg => {
            const isSelected = selectedPackagingIds.includes(pkg.id)
            return (
              <button
                key={pkg.id}
                onClick={() => handleTogglePackaging(pkg.id)}
                style={{
                  background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(0, 0, 0, 0.25)',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600 }}>{pkg.name}</div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>{pkg.supplier}</div>
                </div>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  ${pkg.unitCost.toFixed(2)}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 5. Scrap & Real-World Waste Factor */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          background: includeScrap ? 'rgba(244, 63, 94, 0.08)' : 'rgba(0, 0, 0, 0.2)',
          border: includeScrap ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color={includeScrap ? '#fb7185' : '#94a3b8'} />
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>
                Real-World Bar Scrap & Dial-In Factor
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Includes espresso grinder purge (8%), milk pitcher loss (15%), & boba batch expiry (18%).
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className={`btn btn-sm ${includeScrap ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setIncludeScrap(!includeScrap)}
              style={{ fontSize: '0.74rem' }}
            >
              {includeScrap ? 'Scrap Enabled (+8-18%)' : 'Nominal Only'}
            </button>
          </div>
        </div>

        {includeScrap && (
          <div style={{ marginTop: '10px', fontSize: '0.74rem', color: '#fecdd3', display: 'flex', gap: '12px' }}>
            <span>Nominal Liquid: ${nominalLiquidCost.toFixed(2)}</span>
            <span>➔</span>
            <span>Real Liquid Cost: ${realLiquidCostWithScrap.toFixed(2)}</span>
            <span style={{ fontWeight: 700 }}>(-${scrapLossDollar.toFixed(2)} shrinkage buffer)</span>
          </div>
        )}
      </div>

      {/* 6. COGS, Margins & Price Recommendation Terminal */}
      <div
        className="glass-panel-heavy"
        style={{
          padding: '24px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          {/* Total COGS */}
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total True COGS
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              ${totalCogs.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
              Liquid (${realLiquidCostWithScrap.toFixed(2)}) + Pack (${(packagingCost + iceCost).toFixed(2)})
            </div>
          </div>

          {/* Gross Margin % */}
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
              Profit: <span style={{ color: '#34d399', fontWeight: 700 }}>+${grossProfit.toFixed(2)}</span> / pour
            </div>
          </div>

          {/* Menu Price Input */}
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Current Menu Price
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-accent)', fontWeight: 700 }}>$</span>
              <input
                type="number"
                step="0.25"
                min="0"
                value={recipe.menuPrice || 6.00}
                onChange={(e) => onUpdateRecipe({ ...recipe, menuPrice: Number(e.target.value) })}
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

          {/* Suggested Price at 80% GM */}
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Suggested Price (80% GM)
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              ${suggestedMenuPrice.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
              Recommended specialty anchor
            </div>
          </div>
        </div>

        {/* 150 Cups/Day Profit Projection */}
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
            +${(grossProfit * 120 * 30).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / month gross margin
          </div>
        </div>
      </div>
    </div>
  )
}
