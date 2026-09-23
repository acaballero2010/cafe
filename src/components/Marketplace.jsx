import React, { useState } from 'react'
import { ShoppingBag, Users, Clock, ShieldCheck, CreditCard, Sparkles, Filter, Check, ArrowUpRight } from 'lucide-react'

export function Marketplace({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('all')

  const poolDeals = [
    {
      id: 'pool-pla-cups',
      title: 'West Coast Cafe Collective: 16oz Custom PLA Cups',
      supplier: 'EcoCraft Packaging Solutions',
      pledgedCount: 19,
      targetCount: 25,
      tierDiscount: '28% OFF',
      standardPrice: '$0.18 / unit',
      poolPrice: '$0.13 / unit',
      timeRemaining: '3 days left',
      participatingShops: ['Sightglass', 'Ritual', 'Equator', '+16 more']
    },
    {
      id: 'pool-uji-matcha',
      title: 'Specialty Tea Collective: Kyoto 1st-Harvest Uji Matcha (10kg)',
      supplier: 'Marukyu Koyamaen Direct',
      pledgedCount: 8,
      targetCount: 10,
      tierDiscount: '32% OFF',
      standardPrice: '$190.00 / kg',
      poolPrice: '$129.00 / kg',
      timeRemaining: '18 hours left',
      participatingShops: ['Matchaful', 'Boba Guys', 'Ten Ren', '+5 more']
    }
  ]

  const b2bSuppliers = [
    {
      id: 'sup-1',
      name: 'Oatly Barista Edition (Case of 12 x 32oz)',
      supplier: 'Sysco Direct B2B',
      category: 'dairy',
      price: 44.00,
      moq: '3 Cases',
      leadTime: 'Next Day Delivery',
      terms: 'Net-30 Terms Available',
      badge: 'Bestseller'
    },
    {
      id: 'sup-2',
      name: 'Oaxaca Single-Village Artisanal Mezcal (6 x 750ml)',
      supplier: 'Southern Spirits Craft Wholesale',
      category: 'spirits',
      price: 195.00,
      moq: '1 Case',
      leadTime: '2-3 Business Days',
      terms: 'Net-15 Terms Available',
      badge: 'Verified Craft'
    },
    {
      id: 'sup-3',
      name: 'Bossen Grade A Tapioca Pearls (Case of 6 x 3kg)',
      supplier: 'Bossen Food Corp',
      category: 'boba',
      price: 52.00,
      moq: '2 Cases',
      leadTime: 'Same Day Dispatch',
      terms: 'Net-30 Terms Available',
      badge: 'High Yield'
    },
    {
      id: 'sup-4',
      name: '12mm Compostable Bamboo Fiber Boba Straws (Box of 2000)',
      supplier: 'PlanetBoba Eco Supplies',
      category: 'packaging',
      price: 78.00,
      moq: '1 Box',
      leadTime: '2 Business Days',
      terms: 'Net-30 Terms Available',
      badge: 'Eco Certified'
    }
  ]

  const filteredSuppliers = activeCategory === 'all'
    ? b2bSuppliers
    : b2bSuppliers.filter(s => s.category === activeCategory)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Pool Buying Banner */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            <Users size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#fff' }}>
              Regional Group Buying Pools
            </h2>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Independent cafes pool order volume to unlock Tier-1 enterprise volume pricing.
            </p>
          </div>
        </div>

        {/* Pool Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {poolDeals.map(pool => {
            const progress = (pool.pledgedCount / pool.targetCount) * 100
            return (
              <div
                key={pool.id}
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="badge badge-warning" style={{ fontSize: '0.66rem' }}>
                      🔥 {pool.tierDiscount}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#fb7185', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {pool.timeRemaining}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#f8fafc', marginTop: '8px' }}>
                    {pool.title}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Supplier: {pool.supplier}
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Group Progress</span>
                    <span style={{ fontWeight: 700, color: '#38bdf8' }}>
                      {pool.pledgedCount} / {pool.targetCount} Cafes Pledged
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #f59e0b)' }} />
                  </div>
                </div>

                {/* Price & Join */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      {pool.standardPrice}
                    </span>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                      {pool.poolPrice}
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => alert(`Joined ${pool.title}! Added to regional delivery route with Net-30 invoice.`)}
                  >
                    <span>Join Pool (Net-30)</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* B2B Direct Supplier Catalog */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
              Verified Direct B2B Marketplace
            </h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Order raw ingredients directly with built-in Net-15 & Net-30 credit lines.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['all', 'dairy', 'boba', 'spirits', 'packaging'].map(cat => (
              <button
                key={cat}
                className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveCategory(cat)}
                style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Supplier Items List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {filteredSuppliers.map(item => (
            <div
              key={item.id}
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.62rem' }}>
                    {item.badge}
                  </span>
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                    {item.leadTime}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff', marginTop: '6px' }}>
                  {item.name}
                </h4>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Supplier: {item.supplier} • MOQ: {item.moq}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: '#a855f7' }}>
                <CreditCard size={12} />
                <span>{item.terms}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                  ${item.price.toFixed(2)}
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => alert(`Added ${item.name} to wholesale PO cart!`)}
                >
                  <ShoppingBag size={13} />
                  <span>Order PO</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
