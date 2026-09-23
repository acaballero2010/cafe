import React from 'react'
import { BarChart3, Star, AlertCircle, ArrowUpRight, TrendingDown, DollarSign, Activity } from 'lucide-react'

export function MenuMatrix({ currentRecipe, metrics }) {
  const menuItems = [
    {
      id: 'item-1',
      name: 'Iced Brown Sugar Shaken Espresso',
      category: 'Star',
      salesVolume: 140, // cups/day
      cogs: 1.28,
      price: 6.75,
      marginPct: 81.0,
      badge: 'badge-success',
      action: 'Promote as hero signature'
    },
    {
      id: 'item-2',
      name: 'Strawberry Ceremonial Matcha Cloud',
      category: 'Star',
      salesVolume: 95,
      cogs: 1.45,
      price: 7.25,
      marginPct: 80.0,
      badge: 'badge-success',
      action: 'High social conversion'
    },
    {
      id: 'item-3',
      name: 'Traditional Hot Whole Milk Latte',
      category: 'Plowhorse',
      salesVolume: 210,
      cogs: 1.82,
      price: 5.25,
      marginPct: 65.3,
      badge: 'badge-warning',
      action: 'Increase price by +$0.50 or reduce pitcher over-pour'
    },
    {
      id: 'item-4',
      name: 'Single Origin Geisha Pour-Over',
      category: 'Puzzle',
      salesVolume: 18,
      cogs: 2.80,
      price: 11.00,
      marginPct: 74.5,
      badge: 'badge-purple',
      action: 'Run AI render tasting campaign to drive awareness'
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 2x2 Menu Engineering Matrix */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}
              >
                <BarChart3 size={18} />
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#fff' }}>
                Menu Engineering Profitability Matrix
              </h2>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Classifies your beverage menu by gross margin contribution vs sales velocity.
            </p>
          </div>
        </div>

        {/* 2x2 Matrix Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {menuItems.map(item => (
            <div
              key={item.id}
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${item.badge}`} style={{ fontSize: '0.66rem' }}>
                    {item.category.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {item.salesVolume} cups / day
                  </span>
                </div>

                <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#f8fafc', marginTop: '6px' }}>
                  {item.name}
                </h4>

                <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '0.74rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>COGS: </span>
                    <strong style={{ color: '#fff' }}>${item.cogs.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Price: </span>
                    <strong style={{ color: '#fbbf24' }}>${item.price.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Margin: </span>
                    <strong style={{ color: '#34d399' }}>{item.marginPct}%</strong>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <strong>Operator Action:</strong> {item.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Waste & Shrinkage Live Audit */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Activity size={18} color="#f43f5e" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#fff' }}>
            Invisible Waste & Bar Shrinkage Audit
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Espresso Dial-In Purge</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fb7185', fontFamily: 'var(--font-mono)' }}>
              180g / day
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
              -$148.00 / mo grinder calibration loss
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Milk Pitcher Residual</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fb7185', fontFamily: 'var(--font-mono)' }}>
              650ml / day
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
              -$84.50 / mo over-pour foam discard
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Boba 4h Batch Expiration</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fb7185', fontFamily: 'var(--font-mono)' }}>
              1.2 kg / day
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
              -$112.00 / mo texture degradation dump
            </div>
          </div>
        </div>

        <div style={{ marginTop: '14px', padding: '10px 14px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.3)', fontSize: '0.74rem', color: '#fecdd3' }}>
          💡 <strong>PourCraft Costing Protection:</strong> By enabling "Real-World Scrap Buffer (+8-18%)", these losses are automatically absorbed into your drink retail pricing, protecting your net bottom-line.
        </div>
      </div>
    </div>
  )
}
