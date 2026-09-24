import React, { useState } from 'react'
import { BarChart3, Star, AlertCircle, ArrowUpRight, TrendingDown, DollarSign, Activity, Truck, ShoppingBag, Store, Sparkles, Check, Download } from 'lucide-react'

export function MenuMatrix({ currentRecipe, metrics }) {
  const [selectedChannel, setSelectedChannel] = useState('grabfood') // 'instore' | 'grabfood' | 'foodpanda' | 'wholesale'

  const basePrice = currentRecipe?.menuPrice || 185.00
  const baseCogs = metrics?.totalCogs || 44.20
  const baseProfit = basePrice - baseCogs // in-store profit

  const channels = [
    {
      id: 'instore',
      name: 'In-Store Dine-In / Takeout',
      icon: Store,
      takeRatePct: 0,
      badge: '0% Platform Fee',
      calcPrice: basePrice,
      platformFeePhp: 0,
      netProfitPhp: baseProfit,
      netMarginPct: ((baseProfit / basePrice) * 100).toFixed(1)
    },
    {
      id: 'grabfood',
      name: 'GrabFood Delivery App',
      icon: Truck,
      takeRatePct: 25,
      badge: '25% Platform Commission',
      // To preserve identical dollar profit: (P - COGS - 0.25*P) = baseProfit => 0.75*P = baseCogs + baseProfit => P = (baseCogs + baseProfit) / 0.75
      calcPrice: Math.ceil((baseCogs + baseProfit) / 0.75),
      platformFeePhp: Math.ceil((baseCogs + baseProfit) / 0.75) * 0.25,
      netProfitPhp: baseProfit,
      netMarginPct: ((baseProfit / Math.ceil((baseCogs + baseProfit) / 0.75)) * 100).toFixed(1)
    },
    {
      id: 'foodpanda',
      name: 'Foodpanda Delivery App',
      icon: ShoppingBag,
      takeRatePct: 28,
      badge: '28% Platform Commission',
      calcPrice: Math.ceil((baseCogs + baseProfit) / 0.72),
      platformFeePhp: Math.ceil((baseCogs + baseProfit) / 0.72) * 0.28,
      netProfitPhp: baseProfit,
      netMarginPct: ((baseProfit / Math.ceil((baseCogs + baseProfit) / 0.72)) * 100).toFixed(1)
    },
    {
      id: 'wholesale',
      name: 'Corporate Catering / Bulk (10+)',
      icon: DollarSign,
      takeRatePct: -15, // 15% discount
      badge: '15% Volume Discount',
      calcPrice: Math.round(basePrice * 0.85),
      platformFeePhp: 0,
      netProfitPhp: Math.round(basePrice * 0.85) - baseCogs,
      netMarginPct: (((Math.round(basePrice * 0.85) - baseCogs) / Math.round(basePrice * 0.85)) * 100).toFixed(1)
    }
  ]

  const activeCh = channels.find(c => c.id === selectedChannel) || channels[1]
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '680px', margin: '0 auto', paddingBottom: '100px' }}>
      
      {/* 1. Dynamic Multi-Channel Pricing & Delivery Commission Guard */}
      <div className="card-clean" style={{ padding: '20px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <Truck size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'var(--font-display)' }}>
                  Delivery Channel Pricing & Margin Guard
                </h3>
                <span style={{ background: '#dcfce7', color: '#166534', fontSize: '0.62rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                  ACTIVE
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0' }}>
                Auto-adjusts retail drink prices across GrabFood & Foodpanda to absorb 20-30% platform take-rates.
              </p>
            </div>
          </div>
        </div>

        {/* Channel Selector Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
          {channels.map(ch => {
            const isSel = ch.id === selectedChannel
            const Icon = ch.icon
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch.id)}
                style={{
                  background: isSel ? '#0f172a' : '#f8fafc',
                  border: isSel ? '2px solid #0f172a' : '1px solid #e2e8f0',
                  color: isSel ? '#ffffff' : '#334155',
                  padding: '10px 12px',
                  borderRadius: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Icon size={14} color={isSel ? '#fbbf24' : '#64748b'} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>{ch.name.split(' (')[0]}</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: isSel ? '#94a3b8' : '#64748b' }}>
                  {ch.badge}
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected Channel Economic Breakdown */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Channel: {activeCh.name}
              </span>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {currentRecipe?.name || 'Iced Brown Sugar Shaken Espresso'}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                Suggested Channel Price
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669', fontFamily: 'var(--font-mono)' }}>
                ₱{activeCh.calcPrice.toFixed(2)}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
            <div style={{ background: '#ffffff', padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.64rem', color: '#94a3b8', fontWeight: 700 }}>RAW COGS</div>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                ₱{baseCogs.toFixed(2)}
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.64rem', color: '#94a3b8', fontWeight: 700 }}>PLATFORM CUT</div>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#e11d48', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                -₱{activeCh.platformFeePhp.toFixed(2)}
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.64rem', color: '#94a3b8', fontWeight: 700 }}>NET POCKET PROFIT</div>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                +₱{activeCh.netProfitPhp.toFixed(2)}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={12} color="#059669" />
            <span>
              Preserves your target <strong>₱{baseProfit.toFixed(2)} net profit per cup</strong> regardless of commission rate.
            </span>
          </div>
        </div>
      </div>

      {/* 2. 2x2 Menu Engineering Matrix */}
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
