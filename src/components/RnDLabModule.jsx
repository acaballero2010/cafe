import React, { useState, useMemo } from 'react'
import { 
  FlaskConical, Sparkles, Sliders, Scale, Thermometer, Droplets, 
  CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Zap, Clock,
  Layers, ShieldAlert, Award, ChevronRight, Calculator
} from 'lucide-react'
import { FLAVOR_PROFILES_DATABASE } from '../data/flavorPairingData'
import { triggerHaptic } from '../utils/haptics'

export function RnDLabModule({
  currentRecipe,
  onOpenStudioWithRecipe,
  onSaveToMenu
}) {
  const [activeModule, setActiveModule] = useState('pairing') // 'pairing' | 'brix' | 'batch' | 'dilution'
  const [selectedFlavorId, setSelectedFlavorId] = useState(FLAVOR_PROFILES_DATABASE[0].id)
  
  // Brix & Acidity Simulator State
  const [simulatedBrix, setSimulatedBrix] = useState(18.5)
  const [simulatedAcidity, setSimulatedAcidity] = useState(4.2)
  const [simulatedDairyFat, setSimulatedDairyFat] = useState(3.8)

  // Batch Yield Scaler State
  const [batchTargetVolumeLiters, setBatchTargetVolumeLiters] = useState(3.0)
  const [prepWastePercent, setPrepWastePercent] = useState(5)
  const [shelfLifeDays, setShelfLifeDays] = useState(4)

  // Dilution Simulator State
  const [selectedIceType, setSelectedIceType] = useState('standard') // 'cracked' | 'standard' | 'sphere' | 'pebble'
  const [dilutionElapsedMins, setDilutionElapsedMins] = useState(15)

  const selectedFlavor = useMemo(() => {
    return FLAVOR_PROFILES_DATABASE.find(f => f.id === selectedFlavorId) || FLAVOR_PROFILES_DATABASE[0]
  }, [selectedFlavorId])

  // Balance Score Algorithm
  const balanceScore = useMemo(() => {
    let score = 90
    // Ideal brix for iced coffee/tea is 16-22
    if (simulatedBrix < 12) score -= 20
    else if (simulatedBrix > 26) score -= 15

    // Ideal pH balance
    if (simulatedAcidity < 3.0 && simulatedDairyFat > 2.0) score -= 35 // curdling danger!
    return Math.max(20, Math.min(100, Math.round(score)))
  }, [simulatedBrix, simulatedAcidity, simulatedDairyFat])

  // Scaled Recipe Calculation
  const scaledBatchIngredients = useMemo(() => {
    const multiplier = (batchTargetVolumeLiters * 1000) / 473
    const wasteFactor = 1 + (prepWastePercent / 100)

    return (currentRecipe.layers || []).map(layer => {
      const singleMl = layer.volumeMl || 30
      const scaledMl = Math.round(singleMl * multiplier * wasteFactor)
      const costPerMl = layer.unitCostPerMl || 0.15
      const totalBatchCost = scaledMl * costPerMl
      return {
        name: layer.name,
        scaledMl,
        totalBatchCost,
        colorHex: layer.colorHex
      }
    })
  }, [currentRecipe, batchTargetVolumeLiters, prepWastePercent])

  const totalBatchCost = scaledBatchIngredients.reduce((sum, i) => sum + i.totalBatchCost, 0)
  const costPerLiter = batchTargetVolumeLiters > 0 ? (totalBatchCost / batchTargetVolumeLiters) : 0

  // Dilution Physics Matrix
  const dilutionMetrics = useMemo(() => {
    const meltRates = {
      cracked: 2.8,    // ml water melted per min
      pebble: 2.4,
      standard: 1.6,
      sphere: 0.9
    }
    const rate = meltRates[selectedIceType] || 1.6
    const waterAddedMl = Math.min(180, Math.round(rate * dilutionElapsedMins))
    const originalVol = 350
    const finalVol = originalVol + waterAddedMl
    const retentionPct = Math.round((originalVol / finalVol) * 100)
    const newBrix = (simulatedBrix * (originalVol / finalVol)).toFixed(1)

    return {
      waterAddedMl,
      retentionPct,
      newBrix,
      temperatureC: Math.max(1.2, (4.5 - (dilutionElapsedMins * 0.1))).toFixed(1)
    }
  }, [selectedIceType, dilutionElapsedMins, simulatedBrix])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }}>
      {/* 1. R&D Lab Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#db2777' }}>
            <FlaskConical size={18} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#db2777', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Beverage Science & Chemistry
            </span>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              R&D Formulation Lab
            </h1>
          </div>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
          Food-science diagnostics, molecular flavor pairing matrices, and commercial kitchen batch scalers.
        </p>
      </div>

      {/* 2. Sub-Module Navigation Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {[
          { id: 'pairing', label: 'Flavor Chemistry & Matrix', icon: <Sparkles size={14} /> },
          { id: 'brix', label: 'Brix & Acidity Balance', icon: <Sliders size={14} /> },
          { id: 'batch', label: 'Kitchen Batch Scaler', icon: <Scale size={14} /> },
          { id: 'dilution', label: 'Ice Dilution Physics', icon: <Droplets size={14} /> }
        ].map(mod => {
          const isActive = activeModule === mod.id
          return (
            <button
              key={mod.id}
              onClick={() => {
                triggerHaptic('tap')
                setActiveModule(mod.id)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: isActive ? 800 : 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                border: isActive ? '1px solid #0f172a' : '1px solid #e2e8f0',
                background: isActive ? '#0f172a' : '#ffffff',
                color: isActive ? '#ffffff' : '#475569',
                boxShadow: isActive ? '0 4px 10px rgba(15, 23, 42, 0.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {mod.icon}
              <span>{mod.label}</span>
            </button>
          )
        })}
      </div>

      {/* MODULE 1: MOLECULAR FLAVOR PAIRING MATRIX */}
      {activeModule === 'pairing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Base Flavor Selector */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Select Core Flavor Base:
            </span>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginTop: '10px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
              {FLAVOR_PROFILES_DATABASE.map(f => {
                const isSelected = selectedFlavorId === f.id
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      triggerHaptic('tap')
                      setSelectedFlavorId(f.id)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #ec4899' : '1px solid #e2e8f0',
                      background: isSelected ? '#fdf2f8' : '#ffffff',
                      color: isSelected ? '#be185d' : '#334155',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span>{f.icon}</span>
                    <span>{f.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Chemical Compounds Badges */}
            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>Primary Flavor Compounds (GC-MS):</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {selectedFlavor.primaryCompounds.map((comp, i) => (
                  <span key={i} style={{ fontSize: '0.72rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '3px 8px', borderRadius: '8px' }}>
                    ⚗️ {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Top Recommended Pairings List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0' }}>
              ✨ Recommended Molecular Synergies:
            </h3>

            {selectedFlavor.recommendedPairings.map((pairing, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                      {pairing.ingredient}
                    </span>
                    <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '2px 6px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800 }}>
                      {pairing.score}% Match
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#be185d', marginTop: '2px' }}>
                    {pairing.synergyType}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0', lineHeight: 1.35 }}>
                    {pairing.notes}
                  </p>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic('selection')
                    onOpenStudioWithRecipe(currentRecipe)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <span>Test</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Food Science Warnings */}
          <div style={{ background: '#fff1f2', borderRadius: '14px', border: '1px solid #fecdd3', padding: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <AlertTriangle size={18} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#9f1239' }}>Formulation Pitfalls to Avoid:</span>
              <ul style={{ margin: '4px 0 0', paddingLeft: '16px', fontSize: '0.75rem', color: '#be123c', lineHeight: 1.4 }}>
                {selectedFlavor.avoidPairings.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: BRIX & ACIDITY SENSORY BALANCE SIMULATOR */}
      {activeModule === 'brix' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Balance Gauge Card */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Sensory Taste Equilibrium
                </span>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: balanceScore >= 80 ? '#10b981' : balanceScore >= 60 ? '#f59e0b' : '#ef4444' }}>
                  {balanceScore}/100 • {balanceScore >= 80 ? 'Harmonic Gold Standard' : balanceScore >= 60 ? 'Acceptable Palate' : 'Curdling or Imbalance Risk'}
                </div>
              </div>

              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: balanceScore >= 80 ? '#ecfdf5' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: balanceScore >= 80 ? '#10b981' : '#ef4444' }}>
                <Award size={24} />
              </div>
            </div>

            {/* Slider 1: Sweetness (Brix) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                <span>Total Soluble Solids (°Brix):</span>
                <span style={{ color: '#d97706', fontWeight: 800 }}>{simulatedBrix}°Bx ({simulatedBrix < 14 ? 'Light / Specialty' : simulatedBrix <= 22 ? 'Standard Commercial' : 'Indulgent Dessert'})</span>
              </div>
              <input
                type="range"
                min="8"
                max="35"
                step="0.5"
                value={simulatedBrix}
                onChange={(e) => setSimulatedBrix(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#d97706', marginTop: '6px' }}
              />
            </div>

            {/* Slider 2: Acidity (pH) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                <span>Acidity Level (pH):</span>
                <span style={{ color: '#0284c7', fontWeight: 800 }}>pH {simulatedAcidity} ({simulatedAcidity < 3.2 ? 'High Citrus' : simulatedAcidity < 4.5 ? 'Moderate' : 'Neutral Dairy'})</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="6.8"
                step="0.1"
                value={simulatedAcidity}
                onChange={(e) => setSimulatedAcidity(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#0284c7', marginTop: '6px' }}
              />
            </div>

            {/* Slider 3: Dairy Fat % */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                <span>Lipid / Milk Fat Ratio:</span>
                <span style={{ color: '#8b5cf6', fontWeight: 800 }}>{simulatedDairyFat}% Butterfat / Oat Lipids</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.2"
                value={simulatedDairyFat}
                onChange={(e) => setSimulatedDairyFat(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#8b5cf6', marginTop: '6px' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: KITCHEN PRE-BATCH YIELD SCALER */}
      {activeModule === 'batch' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Scaling Recipe:
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0' }}>
                  {currentRecipe.name}
                </h3>
              </div>
              <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800 }}>
                {batchTargetVolumeLiters} Liters Batch
              </span>
            </div>

            {/* Batch Size Selector */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1.0, 2.0, 3.0, 5.0, 10.0].map((vol) => (
                <button
                  key={vol}
                  onClick={() => {
                    triggerHaptic('tap')
                    setBatchTargetVolumeLiters(vol)
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: batchTargetVolumeLiters === vol ? 800 : 600,
                    border: batchTargetVolumeLiters === vol ? '2px solid #0f172a' : '1px solid #e2e8f0',
                    background: batchTargetVolumeLiters === vol ? '#0f172a' : '#ffffff',
                    color: batchTargetVolumeLiters === vol ? '#ffffff' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {vol}L
                </button>
              ))}
            </div>

            {/* Ingredients Scaled Matrix */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Kitchen Formulation Scale (Inc. {prepWastePercent}% Scrap):</span>
              {scaledBatchIngredients.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.colorHex || '#d97706' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{item.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>{item.scaledMl} ml</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>₱{item.totalBatchCost.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Batch Economics */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700 }}>Total Batch COGS</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#15803d' }}>
                  ₱{totalBatchCost.toFixed(2)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700 }}>Cost Per Liter</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#15803d' }}>
                  ₱{costPerLiter.toFixed(2)} / L
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: ICE DILUTION PHYSICS SIMULATOR */}
      {activeModule === 'dilution' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Select Ice Geometry:
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { id: 'sphere', label: '2" Sphere', icon: '⚪', meltTag: 'Slowest (0.9ml/m)' },
                { id: 'standard', label: 'Cube Ice', icon: '🧊', meltTag: 'Medium (1.6ml/m)' },
                { id: 'pebble', label: 'Pebble/Nugget', icon: '🫧', meltTag: 'Fast (2.4ml/m)' },
                { id: 'cracked', label: 'Cracked', icon: '❄️', meltTag: 'Fastest (2.8ml/m)' }
              ].map(ice => (
                <button
                  key={ice.id}
                  onClick={() => {
                    triggerHaptic('tap')
                    setSelectedIceType(ice.id)
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '10px 6px',
                    borderRadius: '12px',
                    border: selectedIceType === ice.id ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    background: selectedIceType === ice.id ? '#f0f9ff' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{ice.icon}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{ice.label}</span>
                </button>
              ))}
            </div>

            {/* Time Elapsed Slider */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                <span>Serving Time Elapsed:</span>
                <span style={{ color: '#0284c7', fontWeight: 800 }}>{dilutionElapsedMins} Minutes</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={dilutionElapsedMins}
                onChange={(e) => setDilutionElapsedMins(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: '#0284c7', marginTop: '6px' }}
              />
            </div>

            {/* Live Dilution Results */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '4px' }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>Melted Water</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0284c7' }}>
                  +{dilutionMetrics.waterAddedMl} ml
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>Flavor Retention</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: dilutionMetrics.retentionPct >= 75 ? '#10b981' : '#f59e0b' }}>
                  {dilutionMetrics.retentionPct}%
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>Diluted Brix</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#d97706' }}>
                  {dilutionMetrics.newBrix}°Bx
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
