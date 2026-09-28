import React, { useState } from 'react'
import {
  ShoppingBag,
  Percent,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  PackageCheck,
  ArrowRight,
  Info
} from 'lucide-react'
import { calculateChannelCosting, SALES_CHANNELS } from '../utils/beverageCalculators'

export function DeliveryMarginSimulator({
  recipe,
  baseCogs = 42.50,
  basePrice = 180,
  targetMarginPct = 75
}) {
  const [dineInPrice, setDineInPrice] = useState(basePrice)
  const [deliveryPackagingCost, setDeliveryPackagingCost] = useState(8.50)
  const [grabCommission, setGrabCommission] = useState(25)
  const [foodPandaCommission, setFoodPandaCommission] = useState(25)

  const channelData = calculateChannelCosting(baseCogs, dineInPrice, targetMarginPct)

  return (
    <div className="delivery-margin-simulator" style={{
      background: 'var(--card-bg, #ffffff)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid var(--border-color, #e2e8f0)',
      boxShadow: '0 4px 20px -2px rgba(0,0,0,0.06)'
    }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🛵</span>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary, #0f172a)' }}>
              Delivery Channel & Platform Commission Simulator
            </h3>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '999px',
              background: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe'
            }}>
              Grab & Panda Ready
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary, #64748b)' }}>
            Simulate 20%-30% platform commissions and specialized tamper-proof delivery packaging so your cafe never sells at a loss.
          </p>
        </div>

        {/* Dine-In Price Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569' }}>Base Dine-In SRP:</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', color: '#0f172a', marginRight: '2px' }}>₱</span>
            <input
              type="number"
              value={dineInPrice}
              onChange={(e) => setDineInPrice(Math.max(10, Number(e.target.value)))}
              style={{
                width: '65px',
                fontWeight: '800',
                fontSize: '0.9rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '2px 6px',
                color: '#0f172a'
              }}
            />
          </div>
        </div>
      </div>

      {/* Channel Comparison Table */}
      <div style={{ overflowX: 'auto', marginBottom: '18px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', color: '#475569', fontWeight: '700' }}>Sales Channel</th>
              <th style={{ padding: '10px 12px', color: '#475569', fontWeight: '700' }}>Platform Fee</th>
              <th style={{ padding: '10px 12px', color: '#475569', fontWeight: '700' }}>Packaging Addon</th>
              <th style={{ padding: '10px 12px', color: '#475569', fontWeight: '700' }}>Channel COGS</th>
              <th style={{ padding: '10px 12px', color: '#15803d', fontWeight: '700' }}>Recommended Price</th>
              <th style={{ padding: '10px 12px', color: '#dc2626', fontWeight: '700' }}>Platform Cut</th>
              <th style={{ padding: '10px 12px', color: '#2563eb', fontWeight: '700' }}>Net Profit / Cup</th>
              <th style={{ padding: '10px 12px', color: '#475569', fontWeight: '700' }}>Net Margin %</th>
            </tr>
          </thead>
          <tbody>
            {channelData.map((ch) => {
              const isDelivery = ch.commissionPct > 0
              const isWarning = ch.netMarginPct < 60

              return (
                <tr
                  key={ch.channelId}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: ch.channelId === 'dine_in' ? 'rgba(240, 253, 244, 0.4)' : '#ffffff'
                  }}
                >
                  <td style={{ padding: '12px', fontWeight: '700', color: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{ch.channelId === 'dine_in' ? '☕' : ch.channelId === 'grabfood' ? '🟢' : ch.channelId === 'foodpanda' ? '🩷' : '📦'}</span>
                      {ch.name}
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: ch.commissionPct > 0 ? '#dc2626' : '#64748b', fontWeight: '600' }}>
                    {ch.commissionPct}% {ch.paymentFeePct > 0 ? `+ ${ch.paymentFeePct}% gateway` : ''}
                  </td>
                  <td style={{ padding: '12px', color: '#64748b' }}>
                    ₱{ch.packagingAddon.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', fontWeight: '600', color: '#334155' }}>
                    ₱{ch.totalChannelCogs.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      fontWeight: '800',
                      fontSize: '0.92rem',
                      color: isDelivery ? '#047857' : '#0f172a',
                      background: isDelivery ? '#ecfdf5' : '#f8fafc',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: isDelivery ? '1px solid #a7f3d0' : '1px solid #e2e8f0'
                    }}>
                      ₱{ch.activePrice}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#dc2626', fontWeight: '600' }}>
                    -₱{(ch.commissionDeduction + ch.paymentFeeDeduction).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', fontWeight: '700', color: '#2563eb' }}>
                    ₱{ch.netProfit.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      color: isWarning ? '#b45309' : '#15803d',
                      background: isWarning ? '#fef3c7' : '#dcfce7',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {ch.netMarginPct}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Key Insight Box */}
      <div style={{
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <Info size={18} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.78rem', color: '#0369a1', lineHeight: '1.4' }}>
          <strong>GrabFood / FoodPanda Price Markup Rule:</strong> If your dine-in price is <strong>₱{dineInPrice}</strong>, listing at <strong>₱{channelData.find(c => c.channelId === 'grabfood')?.suggestedPrice || 235}</strong> on GrabFood/FoodPanda covers the 25% platform deduction + delivery packaging, giving you the same ₱{channelData[0].netProfit.toFixed(2)} net profit in your pocket.
        </div>
      </div>
    </div>
  )
}
