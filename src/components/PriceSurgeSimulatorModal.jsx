import React, { useState } from 'react'
import {
  TrendingUp,
  AlertTriangle,
  Sliders,
  DollarSign,
  Flame,
  ShieldAlert,
  ArrowUpRight,
  RefreshCw,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import { simulateCatalogPriceInflation } from '../utils/beverageCalculators'
import { PRESET_RECIPES } from '../data/presetRecipes'

export function PriceSurgeSimulatorModal({
  isOpen,
  onClose,
  recipes = PRESET_RECIPES,
  catalog = []
}) {
  const [dairySurge, setDairySurge] = useState(15)
  const [coffeeSurge, setCoffeeSurge] = useState(20)
  const [syrupSurge, setSyrupSurge] = useState(10)
  const [pkgSurge, setPkgSurge] = useState(10)
  const [cupsMonthly, setCupsMonthly] = useState(350)
  const [filterStatus, setFilterStatus] = useState('all') // 'all' | 'critical' | 'warning'

  if (!isOpen) return null

  const simulation = simulateCatalogPriceInflation(recipes, catalog, {
    dairyIncreasePct: dairySurge,
    coffeeIncreasePct: coffeeSurge,
    syrupIncreasePct: syrupSurge,
    packagingIncreasePct: pkgSurge,
    cupsSoldMonthlyPerDrink: cupsMonthly
  })

  const filteredImpacts = simulation.recipeImpacts.filter(r => {
    if (filterStatus === 'critical') return r.status === 'critical'
    if (filterStatus === 'warning') return r.status === 'warning'
    return true
  })

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
        background: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#ea580c',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              🔥
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                Supplier Inflation & Price Surge Stress-Tester
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                Simulate raw ingredient cost spikes across your whole menu & calculate protective price adjustments.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: '#f1f5f9',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
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

        {/* Body Content */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {/* Sliders Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            background: '#f8fafc',
            padding: '16px',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                <span>🥛 Dairy & Milks:</span>
                <span style={{ color: '#ea580c' }}>+{dairySurge}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                step={5}
                value={dairySurge}
                onChange={(e) => setDairySurge(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ea580c' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                <span>☕ Coffee Beans:</span>
                <span style={{ color: '#ea580c' }}>+{coffeeSurge}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={5}
                value={coffeeSurge}
                onChange={(e) => setCoffeeSurge(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ea580c' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                <span>🍯 Syrups & Sauces:</span>
                <span style={{ color: '#ea580c' }}>+{syrupSurge}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                step={5}
                value={syrupSurge}
                onChange={(e) => setSyrupSurge(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ea580c' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                <span>📦 Cups & Packaging:</span>
                <span style={{ color: '#ea580c' }}>+{pkgSurge}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                step={5}
                value={pkgSurge}
                onChange={(e) => setPkgSurge(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ea580c' }}
              />
            </div>
          </div>

          {/* Impact Stats Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#991b1b', textTransform: 'uppercase' }}>Monthly Profit At Risk</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#dc2626', margin: '4px 0' }}>
                -₱{simulation.totalMonthlyProfitLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#7f1d1d' }}>Across {recipes.length} menu items @ {cupsMonthly} cups/mo</div>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#92400e', textTransform: 'uppercase' }}>Vulnerable Items</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#d97706', margin: '4px 0' }}>
                {simulation.recipesAffected} of {recipes.length} drinks
              </div>
              <div style={{ fontSize: '0.72rem', color: '#78350f' }}>Margin erosion &gt; 2.0%</div>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#166534', textTransform: 'uppercase' }}>Avg Recommended Hike</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#15803d', margin: '4px 0' }}>
                +₱10 to ₱15 / cup
              </div>
              <div style={{ fontSize: '0.72rem', color: '#14532d' }}>Fully restores target 75% margins</div>
            </div>
          </div>

          {/* Recipes Breakdown Table */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0f172a' }}>Recipe Impact Analysis</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['all', 'critical', 'warning'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      border: '1px solid #cbd5e1',
                      background: filterStatus === st ? '#0f172a' : '#ffffff',
                      color: filterStatus === st ? '#ffffff' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {st.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 12px', color: '#475569' }}>Recipe</th>
                    <th style={{ padding: '8px 12px', color: '#475569' }}>Current SRP</th>
                    <th style={{ padding: '8px 12px', color: '#475569' }}>Current COGS</th>
                    <th style={{ padding: '8px 12px', color: '#dc2626' }}>Surged COGS</th>
                    <th style={{ padding: '8px 12px', color: '#475569' }}>Margin Shift</th>
                    <th style={{ padding: '8px 12px', color: '#15803d' }}>Recommended SRP</th>
                    <th style={{ padding: '8px 12px', color: '#dc2626' }}>Monthly Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredImpacts.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '10px 12px', fontWeight: '700', color: '#1e293b' }}>{item.title}</td>
                      <td style={{ padding: '10px 12px' }}>₱{item.menuPrice}</td>
                      <td style={{ padding: '10px 12px', color: '#64748b' }}>₱{item.currentCogs.toFixed(2)}</td>
                      <td style={{ padding: '10px 12px', fontWeight: '700', color: '#dc2626' }}>₱{item.surgedCogs.toFixed(2)} (+₱{item.cogsDelta})</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          fontWeight: '700',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: item.status === 'critical' ? '#fee2e2' : item.status === 'warning' ? '#fef3c7' : '#dcfce7',
                          color: item.status === 'critical' ? '#dc2626' : item.status === 'warning' ? '#d97706' : '#15803d'
                        }}>
                          {item.currentMarginPct}% → {item.surgedMarginPct}%
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: '800', color: '#15803d' }}>
                        ₱{item.recommendedPriceHike}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#dc2626', fontWeight: '600' }}>
                        -₱{item.monthlyLoss.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          background: '#f8fafc'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: '#0f172a',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  )
}
