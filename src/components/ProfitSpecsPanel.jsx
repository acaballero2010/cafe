import React from 'react'
import { DollarSign, TrendingUp, ShoppingBag, BookOpen, Truck, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react'

export function ProfitSpecsPanel({
  recipe,
  metrics,
  onUpdateRecipe,
  onOpenSopCard,
  onOpenMarketplace,
  onSwitchToSpecSheet
}) {
  const {
    totalCogs,
    nominalLiquidCost,
    realLiquidCostWithScrap,
    packagingCost,
    iceCost,
    grossProfit,
    grossMarginPct,
    suggestedMenuPrice
  } = metrics

  const handlePriceChange = (newPrice) => {
    onUpdateRecipe({
      ...recipe,
      menuPrice: Math.max(0, Number(newPrice))
    })
  }

  const isHighMargin = grossMarginPct >= 75
  const isMedMargin = grossMarginPct >= 65 && grossMarginPct < 75

  return (
    <div className="card-clean" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-amber)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Step 3 • Profit & Specs
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
            Unit Economics (PHP)
          </h3>
        </div>

        <button
          onClick={onSwitchToSpecSheet}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '0.74rem',
            fontWeight: 700,
            color: 'var(--brand-amber)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <span>Spec Sheet</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* 2. Total Cost vs Margin Hero Card */}
      <div
        style={{
          background: '#f8f9fb',
          borderRadius: 'var(--radius-lg)',
          padding: '18px',
          border: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Unit Cost (COGS)
            </span>
            <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              ₱{totalCogs.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Liquid: ₱{realLiquidCostWithScrap.toFixed(2)} • Pack: ₱{(packagingCost + iceCost).toFixed(2)}
            </div>
          </div>

          {/* Margin Soft Green Badge */}
          <div
            style={{
              background: isHighMargin ? 'var(--margin-green-bg)' : isMedMargin ? 'var(--margin-amber-bg)' : 'var(--margin-rose-bg)',
              border: `1px solid ${isHighMargin ? 'var(--margin-green-border)' : isMedMargin ? 'var(--margin-amber-border)' : 'var(--margin-rose-border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              textAlign: 'right'
            }}
          >
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: isHighMargin ? '#059669' : isMedMargin ? '#d97706' : '#e11d48', textTransform: 'uppercase' }}>
              Gross Margin
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: isHighMargin ? '#059669' : isMedMargin ? '#d97706' : '#e11d48', fontFamily: 'var(--font-mono)' }}>
              {grossMarginPct.toFixed(0)}%
            </div>
            <div style={{ fontSize: '0.66rem', fontWeight: 600, color: isHighMargin ? '#047857' : '#b45309' }}>
              +₱{grossProfit.toFixed(2)} profit / cup
            </div>
          </div>
        </div>
      </div>

      {/* 3. Retail Price Slider & Input (Philippine Peso ₱) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Target Retail Menu Price
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>₱</span>
            <input
              type="number"
              step="5"
              min="0"
              value={recipe.menuPrice || 180.00}
              onChange={(e) => handlePriceChange(e.target.value)}
              style={{
                width: '85px',
                padding: '4px 6px',
                fontSize: '1.1rem',
                fontWeight: 800,
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'right',
                fontFamily: 'var(--font-mono)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Clean Interactive Slider */}
        <input
          type="range"
          min="60.00"
          max="400.00"
          step="5.00"
          value={recipe.menuPrice || 180.00}
          onChange={(e) => handlePriceChange(e.target.value)}
          className="clean-slider"
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          <span>Min: ₱60</span>
          <span style={{ color: 'var(--brand-amber)', fontWeight: 600 }}>Suggested: ₱{suggestedMenuPrice.toFixed(0)} (80% GM)</span>
          <span>Max: ₱400</span>
        </div>
      </div>

      {/* 4. Monthly Profit Projection Run-Rate in ₱ */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Monthly Run-Rate
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Based on 120 pours / day
            </div>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>
            +₱{(grossProfit * 120 * 30).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}> / mo</span>
          </div>
        </div>
      </div>

      {/* 5. Supplier Short-Circuit Shortcut */}
      <div
        style={{
          background: 'var(--brand-amber-subtle)',
          border: '1px solid var(--brand-amber-light)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}
      >
        <Truck size={18} color="#d97706" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--brand-espresso)' }}>
            Wholesale Reorder Available
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--brand-amber)', marginTop: '2px' }}>
            2 Manila distributors have stock from ₱210/L with Net-30 terms.
          </div>
        </div>
        <button
          className="btn-clean btn-clean-secondary btn-clean-sm"
          onClick={onOpenMarketplace}
          style={{ fontSize: '0.7rem' }}
        >
          View
        </button>
      </div>

      {/* 6. Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
        <button
          className="btn-clean btn-clean-primary"
          onClick={onOpenMarketplace}
          style={{ width: '100%', padding: '10px' }}
        >
          <ShoppingBag size={15} />
          <span>Order Ingredients (Net-30)</span>
        </button>

        <button
          className="btn-clean btn-clean-secondary"
          onClick={onOpenSopCard}
          style={{ width: '100%', padding: '10px' }}
        >
          <BookOpen size={15} />
          <span>Export Barista Quick SOP</span>
        </button>
      </div>
    </div>
  )
}
