import React, { useRef } from 'react'
import { 
  FileText, 
  Printer, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Coffee, 
  Layers, 
  Clock, 
  Thermometer, 
  Sparkles,
  ShieldCheck,
  Flame,
  Snowflake,
  Scale
} from 'lucide-react'

export function BaristaSOPModal({
  isOpen = false,
  onClose = () => {},
  recipe = {},
  metrics = {}
}) {
  const printRef = useRef(null)

  if (!isOpen) return null

  const isHot = recipe.temperature === 'hot' || (recipe.name && recipe.name.toLowerCase().includes('hot'))
  const drinkName = recipe.name || 'Iced Brown Sugar Oat Shaken Espresso'
  const shopName = 'Kape Craft Studio & Bar'
  const vessel = recipe.vesselId?.includes('boba') ? '20oz Boba Cup' : recipe.vesselId?.includes('takeaway') ? '16oz Takeaway Cold Cup' : isHot ? '8oz Ceramic Café Cup' : '16oz Ribbed Highball Glass'

  const layers = (metrics?.layersDetailed && metrics.layersDetailed.length > 0)
    ? metrics.layersDetailed
    : (recipe?.layers || [
        { name: 'House Muscovado Syrup', volumeMl: 25, unitCostPerMl: 0.28 },
        { name: 'Blonde Espresso Double Shot', volumeMl: 36, unitCostPerMl: 0.42 },
        { name: 'Barista Oat Milk', volumeMl: 180, unitCostPerMl: 0.12, isTopOff: true }
      ])

  const totalVolume = layers.reduce((sum, l) => sum + (Number(l.calculatedVolumeMl || l.volumeMl || 30)), 0)
  const cogs = layers.reduce((sum, l) => sum + ((Number(l.calculatedVolumeMl || l.volumeMl || 30)) * (Number(l.unitCostPerMl) || 0.25)), 0) + (recipe.vesselCost || 8.5)
  const price = recipe.menuPrice || 185.00
  const marginPct = (((price - cogs) / price) * 100).toFixed(1)

  // Allergen identification
  const allergens = []
  const layersStr = layers.map(l => l.name.toLowerCase()).join(' ')
  if (layersStr.includes('oat')) allergens.push('Gluten / Oat')
  if (layersStr.includes('milk') || layersStr.includes('cream') || layersStr.includes('dairy')) allergens.push('Dairy (Lactose)')
  if (layersStr.includes('nut') || layersStr.includes('almond') || layersStr.includes('hazelnut')) allergens.push('Tree Nuts')
  if (allergens.length === 0) allergens.push('None (Vegan Friendly)')

  const handlePrint = () => {
    window.print()
  }

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
        {/* Modal Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
              }}
            >
              <FileText size={19} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                Barista Station Recipe SOP Card
                <span style={{ fontSize: '0.62rem', background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                  Station Ready
                </span>
              </h2>
              <p style={{ fontSize: '0.70rem', color: '#64748b', margin: '2px 0 0' }}>
                Standard Operating Procedure for consistent bar execution.
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

        {/* Scrollable Printable Station Sheet */}
        <div ref={printRef} style={{ padding: '18px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Card Overview Banner */}
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '18px', padding: '16px', color: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {shopName} • SOP FORMULATION
                </div>
                <h1 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '4px 0 0', color: '#ffffff' }}>
                  {drinkName}
                </h1>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.68rem', background: isHot ? '#ef4444' : '#0284c7', color: '#ffffff', padding: '3px 10px', borderRadius: '999px', fontWeight: 800 }}>
                  {isHot ? '🔥 HOT BUILD' : '❄️ ICED BUILD'}
                </span>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>
                  Target: ~{totalVolume}ml
                </div>
              </div>
            </div>

            {/* Quick Specs Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <div style={{ fontSize: '0.64rem', color: '#94a3b8' }}>Target Vessel</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc' }}>{vessel}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.64rem', color: '#94a3b8' }}>Food Cost / Cup</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4ade80' }}>₱{cogs.toFixed(2)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.64rem', color: '#94a3b8' }}>Gross Margin</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8' }}>{marginPct}%</div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Barista Build Sequence */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} color="#0284c7" />
                <span>Station Assembly Sequence (Build Order)</span>
              </label>
              <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>Bottom to Top</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {layers.map((layer, idx) => {
                const vol = Number(layer.calculatedVolumeMl || layer.volumeMl || 30)
                const layerCost = (vol * (Number(layer.unitCostPerMl) || 0.25)).toFixed(2)
                return (
                  <div
                    key={layer.id || idx}
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#0f172a',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.70rem',
                          fontWeight: 900
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                          {layer.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '1px' }}>
                          {layer.isTopOff ? 'Fill remainder of cup' : `Measure exactly ${vol}ml (${(vol * 1.02).toFixed(1)}g on scale)`}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#0284c7' }}>
                        {vol} ml
                      </div>
                      <div style={{ fontSize: '0.64rem', color: '#94a3b8' }}>
                        ₱{layerCost}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Barista Consistency Tips & Safeguards */}
          <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '14px', padding: '12px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#854d0e', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <AlertTriangle size={14} color="#ca8a04" />
              <span>Barista Consistency & Calibration Notes</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.70rem', color: '#713f12', lineHeight: 1.5 }}>
              <li><strong>Espresso Calibration:</strong> Pull blonde double shot at 18.0g dry dose → 36.0g liquid yield in 26–28s.</li>
              <li><strong>Temperature Control:</strong> If iced, pack crystal ice to 80% mark before pouring espresso over milk to preserve clean layering.</li>
              <li><strong>Syrup Dispersion:</strong> Swirl syrup with base layer in cup before adding ice to prevent syrup clumping at the bottom.</li>
            </ul>
          </div>

          {/* Allergen & Dietary Card */}
          <div style={{ display: 'flex', gap: '8px', background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.70rem', fontWeight: 800, color: '#334155' }}>
              ⚠️ Declared Allergens:
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {allergens.map((alg, aIdx) => (
                <span
                  key={aIdx}
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    background: alg.includes('None') ? '#dcfce7' : '#fee2e2',
                    color: alg.includes('None') ? '#166534' : '#991b1b',
                    padding: '2px 8px',
                    borderRadius: '999px'
                  }}
                >
                  {alg}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer / Print Action */}
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
            onClick={handlePrint}
            style={{
              flex: 2,
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
            }}
          >
            <Printer size={15} />
            <span>Print Station Recipe Card</span>
          </button>
        </div>

      </div>
    </div>
  )
}
