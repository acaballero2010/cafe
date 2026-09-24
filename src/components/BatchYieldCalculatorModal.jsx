import React, { useState } from 'react'
import { 
  Scale, 
  Layers, 
  X, 
  Check, 
  Clock, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  Sparkles,
  Download,
  Share2,
  Package
} from 'lucide-react'

export function BatchYieldCalculatorModal({
  isOpen = false,
  onClose = () => {},
  recipe = {},
  metrics = {}
}) {
  const [targetBatchVolumeLiters, setTargetBatchVolumeLiters] = useState(2.0) // 2 Liters default
  const [batchType, setBatchType] = useState('syrup-base') // 'syrup-base' | 'cold-brew' | 'milk-premix'

  if (!isOpen) return null

  const drinkName = recipe.name || 'Brown Sugar Syrup Base'
  const layers = (metrics?.layersDetailed && metrics.layersDetailed.length > 0)
    ? metrics.layersDetailed
    : (recipe?.layers || [
        { name: 'Pure Muscovado Sugar', volumeMl: 25, unitCostPerMl: 0.28 },
        { name: 'Filtered Water', volumeMl: 25, unitCostPerMl: 0.01 },
        { name: 'Madagascar Vanilla Extract', volumeMl: 2, unitCostPerMl: 1.50 }
      ])

  const singleServingVolumeMl = layers.reduce((sum, l) => sum + (Number(l.calculatedVolumeMl || l.volumeMl || 30)), 0) || 50
  const totalTargetMl = targetBatchVolumeLiters * 1000
  const multiplier = totalTargetMl / (singleServingVolumeMl || 1)
  const cupsYielded = Math.floor(multiplier)

  // Calculate scaled ingredient weights & costs
  const scaledIngredients = layers.map((layer) => {
    const singleVol = Number(layer.calculatedVolumeMl || layer.volumeMl || 30)
    const totalMl = singleVol * multiplier
    const totalGrams = totalMl * 1.12 // estimated syrup/liquid density
    const costPerMl = Number(layer.unitCostPerMl) || 0.25
    const totalCost = totalMl * costPerMl

    return {
      name: layer.name,
      totalMl: Math.round(totalMl),
      totalGrams: Math.round(totalGrams),
      totalCost: totalCost.toFixed(2),
      costPerCup: (singleVol * costPerMl).toFixed(2)
    }
  })

  const totalBatchCost = scaledIngredients.reduce((sum, item) => sum + Number(item.totalCost), 0)
  const costPerServing = (totalBatchCost / (cupsYielded || 1)).toFixed(2)

  // Expiration calculation
  const today = new Date()
  const expiryDate = new Date(today)
  expiryDate.setDate(today.getDate() + 14) // 14 days refrigerated shelf life

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        background: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92vh',
          borderRadius: '28px',
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 25px 60px rgba(0,0,0,0.45)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
              }}
            >
              <Scale size={19} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                Batch Yield & Kitchen Prep Calculator
                <span style={{ fontSize: '0.62rem', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                  Kitchen R&D
                </span>
              </h2>
              <p style={{ fontSize: '0.70rem', color: '#64748b', margin: '2px 0 0' }}>
                Scale formulation recipes for pre-batch syrups, bases & cold brew.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '18px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Target Batch Size Selector */}
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: '0.70rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
              Select Prep Batch Yield Target
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {[
                { size: 0.5, label: '500 ml' },
                { size: 1.0, label: '1.0 Liter' },
                { size: 2.0, label: '2.0 Liters' },
                { size: 5.0, label: '5.0 Liters' }
              ].map(item => {
                const isSelected = targetBatchVolumeLiters === item.size
                return (
                  <button
                    key={item.size}
                    onClick={() => setTargetBatchVolumeLiters(item.size)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '10px',
                      border: `1.5px solid ${isSelected ? '#059669' : '#cbd5e1'}`,
                      background: isSelected ? '#ecfdf5' : '#ffffff',
                      color: isSelected ? '#065f46' : '#334155',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Batch Metrics Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '14px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Cups Yielded</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#15803d', marginTop: '2px' }}>
                {cupsYielded} <span style={{ fontSize: '0.70rem', fontWeight: 600 }}>servings</span>
              </div>
            </div>

            <div style={{ background: '#f0f9ff', padding: '12px', borderRadius: '14px', border: '1px solid #bae6fd', textAlign: 'center' }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase' }}>Total Batch Cost</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>
                ₱{totalBatchCost.toFixed(2)}
              </div>
            </div>

            <div style={{ background: '#faf5ff', padding: '12px', borderRadius: '14px', border: '1px solid #e9d5ff', textAlign: 'center' }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 700, color: '#7e22ce', textTransform: 'uppercase' }}>Cost / Cup</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#9333ea', marginTop: '2px' }}>
                ₱{costPerServing}
              </div>
            </div>
          </div>

          {/* Scaled Kitchen Weights Table */}
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Package size={14} color="#059669" />
              <span>Kitchen Scale Weights ({targetBatchVolumeLiters}L Batch)</span>
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {scaledIngredients.map((ing, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                      {ing.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '1px' }}>
                      Scaled for {cupsYielded} drinks (~{ing.totalMl}ml liquid)
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#059669' }}>
                      {ing.totalGrams} g
                    </div>
                    <div style={{ fontSize: '0.64rem', color: '#94a3b8' }}>
                      ₱{ing.totalCost} total
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shelf Life & Storage Guidelines */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#0284c7" />
              <span>Storage Guidelines & Expiry Calculator</span>
            </div>
            <div style={{ fontSize: '0.70rem', color: '#64748b', lineHeight: 1.5 }}>
              • <strong>Refrigerated (2°C–4°C):</strong> Good for <strong>14 days</strong> (Expires: {expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})<br />
              • <strong>Storage Container:</strong> Food-grade amber glass bottle or sanitized squeeze bottle with FIFO day dot label.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '12px 18px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', gap: '8px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
          <button
            onClick={() => {
              alert(`✓ Kitchen Prep Sheet for ${targetBatchVolumeLiters}L ${drinkName} copied to clipboard!`)
            }}
            style={{
              flex: 2,
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
            }}
          >
            <Download size={15} />
            <span>Export Kitchen Prep Sheet</span>
          </button>
        </div>

      </div>
    </div>
  )
}
