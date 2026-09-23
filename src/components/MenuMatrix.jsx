import React from 'react'
import { BarChart3, Star, AlertCircle, ArrowUpRight, TrendingDown, DollarSign, Activity } from 'lucide-react'

export function MenuMatrix({ currentRecipe, metrics }) {
  const menuItems = [
    {
      id: 'item-1',
      name: 'Iced Brown Sugar Shaken Espresso',
      category: 'Star',
      salesVolume: 140, // cups/day
      cogs: 48.50,
      price: 185.00,
      marginPct: 73.8,
      badge: 'badge-success',
      action: 'Promote as hero signature'
    },
    {
      id: 'item-2',
      name: 'Strawberry Ceremonial Matcha Cloud',
      category: 'Star',
      salesVolume: 95,
      cogs: 52.00,
      price: 210.00,
      marginPct: 75.2,
      badge: 'badge-success',
      action: 'High social Instagram conversion'
    },
    {
      id: 'item-3',
      name: 'Traditional Hot Whole Milk Latte',
      category: 'Plowhorse',
      salesVolume: 210,
      cogs: 46.00,
      price: 140.00,
      marginPct: 67.1,
      badge: 'badge-warning',
      action: 'Increase retail price by +₱15 or reduce milk steaming pitcher waste'
    },
    {
      id: 'item-4',
      name: 'Single Origin Mt. Apo Pour-Over',
      category: 'Puzzle',
      salesVolume: 18,
      cogs: 65.00,
      price: 240.00,
      marginPct: 72.9,
      badge: 'badge-purple',
      action: 'Run AI render tasting campaign to drive origin awareness'
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 2x2 Menu Engineering Matrix */}
      <div className="card-clean" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}
              >
                <BarChart3 size={16} />
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                Menu Profitability Matrix (PHP ₱)
              </h2>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
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
                background: '#f8f9fb',
                border: '1px solid var(--border-light)',
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
                  <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '99px', fontSize: '0.68rem', fontWeight: 700 }}>
                    {item.category.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {item.salesVolume} cups / day
                  </span>
                </div>

                <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                  {item.name}
                </h4>

                <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '0.74rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>COGS: </span>
                    <strong style={{ color: 'var(--text-primary)' }}>₱{item.cogs.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Price: </span>
                    <strong style={{ color: 'var(--brand-amber)' }}>₱{item.price.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Margin: </span>
                    <strong style={{ color: '#059669' }}>{item.marginPct}%</strong>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-light)',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
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
      <div className="card-clean" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Activity size={18} color="#e11d48" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Invisible Waste & Bar Shrinkage Audit (Philippine Pesos ₱)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ background: '#f8f9fb', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Espresso Dial-In Purge</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e11d48', fontFamily: 'var(--font-mono)' }}>
              180g / day
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              -₱4,200 / mo grinder calibration loss
            </div>
          </div>

          <div style={{ background: '#f8f9fb', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Milk Pitcher Residual</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e11d48', fontFamily: 'var(--font-mono)' }}>
              650ml / day
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              -₱3,850 / mo over-pour foam discard
            </div>
          </div>

          <div style={{ background: '#f8f9fb', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Boba 4h Batch Expiration</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e11d48', fontFamily: 'var(--font-mono)' }}>
              1.2 kg / day
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              -₱3,100 / mo texture degradation discard
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', padding: '12px 14px', background: '#fff1f2', borderRadius: 'var(--radius-md)', border: '1px solid #fecdd3', fontSize: '0.76rem', color: '#9f1239' }}>
          💡 <strong>PourCraft Margin Protection:</strong> Enabling "Real-World Scrap Buffer (+8% to 18%)" automatically builds these prep losses into your retail drink pricing, protecting your net bottom-line profit.
        </div>
      </div>
    </div>
  )
}
