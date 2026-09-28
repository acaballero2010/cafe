import React, { useState } from 'react'
import { X, HelpCircle, Calculator, Percent, Sparkles, Check, ArrowRight, ShieldCheck, Scale, AlertCircle, TrendingUp, Info } from 'lucide-react'

export function CostComputationModal({
  isOpen = false,
  onClose = () => {},
  recipe = {},
  selectedLayer = null
}) {
  const [activeTab, setActiveTab] = useState('recipe') // 'recipe' | 'formula' | 'waste'
  const [targetMarginPct, setTargetMarginPct] = useState(75)

  if (!isOpen) return null

  const layers = recipe?.layers || []
  const menuPrice = recipe?.menuPrice || recipe?.price || 180

  // Calculate totals
  let totalLiquidCost = 0
  layers.forEach(l => {
    const vol = Number(l.volumeMl || 0)
    const unitRate = Number(l.unitCostPerMl || 0.15)
    totalLiquidCost += (vol * unitRate)
  })

  const packagingCost = 4.50 // Standard cup, lid, straw, carrier
  const wasteBufferPct = 3.0 // 3% residual clinging / ice melt
  const wasteBufferAmount = Number((totalLiquidCost * (wasteBufferPct / 100)).toFixed(2))
  const totalCogs = Number((totalLiquidCost + packagingCost + wasteBufferAmount).toFixed(2))
  const grossProfit = Number((menuPrice - totalCogs).toFixed(2))
  const currentMarginPct = menuPrice > 0 ? Number(((grossProfit / menuPrice) * 100).toFixed(1)) : 0
  const suggestedSellingPrice = Math.ceil((totalCogs / ((100 - targetMarginPct) / 100)) / 5) * 5

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
        maxWidth: '780px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#ffffff',
        borderRadius: '24px',
        padding: '24px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                color: '#ffffff',
                padding: '6px 10px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 800
              }}>
                <Calculator size={16} />
                <span>Cost Engineering Engine</span>
              </div>
              <span style={{ fontSize: '0.74rem', background: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '6px', fontWeight: 700 }}>
                Philippine Peso (₱) Spec
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '8px', margin: 0 }}>
              How Ingredient & Recipe Cost is Computed
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', margin: 0 }}>
              Transparent mathematical formulas behind portion yields, wholesale pack sizes, and net gross margins.
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

        {/* Tab Navigation */}
        <div style={{ display: 'flex', background: '#f8fafc', padding: '4px', borderRadius: '12px', gap: '4px', marginBottom: '18px' }}>
          <button
            onClick={() => setActiveTab('recipe')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'recipe' ? '#ffffff' : 'transparent',
              color: activeTab === 'recipe' ? '#0f172a' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'recipe' ? 800 : 600,
              cursor: 'pointer',
              boxShadow: activeTab === 'recipe' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            📋 Recipe Breakdown ({layers.length} Layers)
          </button>
          <button
            onClick={() => setActiveTab('formula')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'formula' ? '#ffffff' : 'transparent',
              color: activeTab === 'formula' ? '#0f172a' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'formula' ? 800 : 600,
              cursor: 'pointer',
              boxShadow: activeTab === 'formula' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            📐 Exact Mathematical Formulas
          </button>
          <button
            onClick={() => setActiveTab('waste')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'waste' ? '#ffffff' : 'transparent',
              color: activeTab === 'waste' ? '#0f172a' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: activeTab === 'waste' ? 800 : 600,
              cursor: 'pointer',
              boxShadow: activeTab === 'waste' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            ⚖️ Target Margin & Pricing
          </button>
        </div>

        {/* Tab 1: Recipe Breakdown */}
        {activeTab === 'recipe' && (
          <div>
            {/* Top Stat Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '18px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Liquid Raw Cost</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>₱{totalLiquidCost.toFixed(2)}</div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>{layers.reduce((s, l) => s + (l.volumeMl || 0), 0)}ml total volume</div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Packaging & Scrap</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>₱{(packagingCost + wasteBufferAmount).toFixed(2)}</div>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8' }}>Cup, lid, straw + 3% scrap</div>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '12px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>Total Beverage COGS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e40af', marginTop: '2px' }}>₱{totalCogs.toFixed(2)}</div>
                <div style={{ fontSize: '0.66rem', color: '#3b82f6' }}>per finished pour</div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '12px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>Gross Margin @ ₱{menuPrice}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>{currentMarginPct}%</div>
                <div style={{ fontSize: '0.66rem', color: '#15803d' }}>+₱{grossProfit.toFixed(2)} profit / cup</div>
              </div>
            </div>

            {/* Layer Table */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 800 }}># Layer Ingredient & Brand</th>
                    <th style={{ padding: '10px 12px', fontWeight: 800 }}>Dose</th>
                    <th style={{ padding: '10px 12px', fontWeight: 800 }}>Wholesale Rate</th>
                    <th style={{ padding: '10px 12px', fontWeight: 800 }}>Loss Buffer</th>
                    <th style={{ padding: '10px 14px', fontWeight: 800, textAlign: 'right' }}>Layer Portion Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {layers.map((l, i) => {
                    const vol = Number(l.volumeMl || 0)
                    const unitRate = Number(l.unitCostPerMl || 0.15)
                    const cost = vol * unitRate
                    return (
                      <tr key={i} style={{ borderBottom: i < layers.length - 1 ? '1px solid #f1f5f9' : 'none', background: '#ffffff' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{l.name}</div>
                          <div style={{ fontSize: '0.70rem', color: '#64748b', marginTop: '2px' }}>
                            🏷️ {l.brand || l.supplier || 'Specialty Benchmark'}
                          </div>
                        </td>
                        <td style={{ padding: '12px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#334155' }}>
                          {vol}{l.unit || 'ml'}
                        </td>
                        <td style={{ padding: '12px 12px', fontFamily: 'var(--font-mono)', color: '#475569' }}>
                          ₱{unitRate.toFixed(3)} / {l.unit || 'ml'}
                        </td>
                        <td style={{ padding: '12px 12px', color: '#64748b' }}>
                          <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.70rem', fontWeight: 600 }}>
                            {l.scrapType === 'milk_steaming' ? '12% steam loss' : l.scrapType === 'espresso' ? '15% grind purge' : '3% residual'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                          ₱{cost.toFixed(2)}
                        </td>
                      </tr>
                    )
                  })}
                  {/* Packaging Row */}
                  <tr style={{ background: '#f8fafc', borderTop: '1px dashed #cbd5e1' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#475569' }}>
                      📦 Standard Packaging Set (16oz PET / PP Cup + Lid + Straw)
                    </td>
                    <td style={{ padding: '10px 12px', color: '#64748b' }}>1 unit</td>
                    <td style={{ padding: '10px 12px', color: '#64748b' }}>₱4.50 / set</td>
                    <td style={{ padding: '10px 12px', color: '#64748b' }}>Included</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>₱4.50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Exact Formula */}
        {activeTab === 'formula' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', marginBottom: '8px' }}>
                1. Ingredient Unit Rate Calculation
              </div>
              <div style={{ background: '#0f172a', color: '#38bdf8', padding: '12px 16px', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Unit Cost Rate (₱/ml) = Wholesale Pack Price (₱) ÷ [ Net Pack Volume (ml) × (1 - Waste Scrap %) ]
              </div>
              <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '10px', lineHeight: 1.5, margin: 0 }}>
                <strong>Example:</strong> A 750ml bottle of <em>Torani Puremade Vanilla Syrup</em> costs <strong>₱480.00</strong> wholesale. With a 3% bottle cling/pump loss (yielding 727.5ml usable syrup):
                <br />
                <code>₱480 ÷ 727.5ml = <strong>₱0.660 / ml</strong></code> (or ₱6.60 per 10ml pump).
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', marginBottom: '8px' }}>
                2. Layer Portion Cost Formula
              </div>
              <div style={{ background: '#0f172a', color: '#4ade80', padding: '12px 16px', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Layer Cost (₱) = Recipe Dose (ml or g) × Unit Cost Rate (₱/ml or ₱/g)
              </div>
              <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '10px', lineHeight: 1.5, margin: 0 }}>
                If this recipe calls for <strong>20ml</strong> of Vanilla Syrup:
                <br />
                <code>20ml × ₱0.660 = <strong>₱13.20</strong></code>
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', marginBottom: '8px' }}>
                3. Total Drink COGS & Gross Profit
              </div>
              <div style={{ background: '#0f172a', color: '#facc15', padding: '12px 16px', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Total COGS = Σ(Layer Costs) + Packaging Consumables + Ice/Prep Buffer
                <br />
                Gross Margin % = [ (Menu Price - Total COGS) ÷ Menu Price ] × 100
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Target Margin & Pricing Slider */}
        {activeTab === 'waste' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                  Target Beverage Gross Margin: <span style={{ color: '#0284c7' }}>{targetMarginPct}%</span>
                </span>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Industry standard: 70% – 80%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                step="1"
                value={targetMarginPct}
                onChange={(e) => setTargetMarginPct(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: '#0284c7' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>
                <span>50% (High Volume / Low Margin)</span>
                <span>75% (Specialty Benchmark)</span>
                <span>90% (Ultra High Margin)</span>
              </div>
            </div>

            {/* Pricing Recommendations Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.70rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Dine-In / Takeout SRP</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>₱{suggestedSellingPrice}</div>
                <div style={{ fontSize: '0.70rem', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>{targetMarginPct}% Gross Margin</div>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.70rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>Grab / Foodpanda (25% Comm.)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>₱{Math.ceil((suggestedSellingPrice / 0.75) / 5) * 5}</div>
                <div style={{ fontSize: '0.70rem', color: '#d97706', fontWeight: 700, marginTop: '2px' }}>Maintains {targetMarginPct}% Net Margin</div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.70rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>Net Profit Per Cup</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>₱{(suggestedSellingPrice - totalCogs).toFixed(2)}</div>
                <div style={{ fontSize: '0.70rem', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>Cash gross profit</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Got it, Close Inspector
          </button>
        </div>
      </div>
    </div>
  )
}
