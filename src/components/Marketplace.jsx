import React, { useState } from 'react'
import { ShoppingBag, Users, Clock, ShieldCheck, CreditCard, Sparkles, Filter, Check, ArrowUpRight } from 'lucide-react'

export function Marketplace({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('all')

  const poolDeals = [
    {
      id: 'pool-pla-cups',
      title: 'Metro Manila Café Collective: 16oz U-Cups (PET/PLA)',
      supplier: 'EcoPack Manila Solutions',
      pledgedCount: 19,
      targetCount: 25,
      tierDiscount: '28% OFF',
      standardPrice: '₱5.80 / cup',
      poolPrice: '₱4.10 / cup',
      timeRemaining: '3 days left',
      participatingShops: ['Yardstick', 'Habitual', 'Crema', '+16 more']
    },
    {
      id: 'pool-uji-matcha',
      title: 'Philippine Tea Collective: 1st-Harvest Uji Matcha (5kg Bulk)',
      supplier: 'Matcha Manila Direct Direct',
      pledgedCount: 8,
      targetCount: 10,
      tierDiscount: '30% OFF',
      standardPrice: '₱9,500 / kg',
      poolPrice: '₱6,650 / kg',
      timeRemaining: '18 hours left',
      participatingShops: ['Tsujiri PH', 'Boba Hub', 'The Matcha Lab', '+5 more']
    }
  ]

  const b2bSuppliers = [
    {
      id: 'sup-1',
      name: 'Oatly Barista Edition (Case of 6 x 1L)',
      supplier: 'BakeEtc / Gourmet Direct PH',
      category: 'dairy',
      price: 1260.00,
      moq: '3 Cases',
      leadTime: 'Next Day Metro Manila Delivery',
      terms: 'Net-30 Terms Available',
      badge: 'Bestseller'
    },
    {
      id: 'sup-2',
      name: 'Top Creamery Raw Tapioca Pearls (Case 6 x 3kg)',
      supplier: 'Top Creamery Food Mfg',
      category: 'boba',
      price: 2400.00,
      moq: '2 Cases',
      leadTime: 'Same Day Dispatch',
      terms: 'Net-30 Terms Available',
      badge: 'High Yield'
    },
    {
      id: 'sup-3',
      name: '12mm Compostable Bamboo Fiber Straws (Box of 2000)',
      supplier: 'EcoFriendly PH',
      category: 'packaging',
      price: 3000.00,
      moq: '1 Box',
      leadTime: '2 Business Days',
      terms: 'Net-30 Terms Available',
      badge: 'Eco Certified'
    },
    {
      id: 'sup-4',
      name: 'Benguet / Sagada Specialty Arabica (5kg Sack)',
      supplier: 'Cordillera Coffee Alliance',
      category: 'coffee',
      price: 4500.00,
      moq: '1 Sack',
      leadTime: '3-4 Days Direct from Origin',
      terms: 'Net-15 Terms Available',
      badge: 'Direct Trade'
    }
  ]

  const filteredSuppliers = activeCategory === 'all'
    ? b2bSuppliers
    : b2bSuppliers.filter(s => s.category === activeCategory)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Pool Buying Banner */}
      <div className="card-clean" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
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
            <Users size={16} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Regional Group Buying Pools (Philippines)
            </h2>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Independent local coffee shops pool order volume to unlock Tier-1 bulk discounts.
            </p>
          </div>
        </div>

        {/* Pool Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {poolDeals.map(pool => {
            const progress = (pool.pledgedCount / pool.targetCount) * 100
            return (
              <div
                key={pool.id}
                style={{
                  background: '#f8f9fb',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ background: 'var(--brand-amber-subtle)', color: 'var(--brand-amber)', border: '1px solid var(--brand-amber-light)', padding: '2px 8px', borderRadius: '99px', fontSize: '0.68rem', fontWeight: 800 }}>
                      🔥 {pool.tierDiscount}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {pool.timeRemaining}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
                    {pool.title}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Supplier: {pool.supplier}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Group Progress</span>
                    <span style={{ fontWeight: 700, color: 'var(--brand-amber)' }}>
                      {pool.pledgedCount} / {pool.targetCount} Cafes Pledged
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #d97706, #059669)' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      {pool.standardPrice}
                    </span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>
                      {pool.poolPrice}
                    </div>
                  </div>

                  <button
                    className="btn-clean btn-clean-primary btn-clean-sm"
                    onClick={() => alert(`Joined ${pool.title}! Added to Metro Manila delivery pool on Net-30 terms.`)}
                  >
                    <span>Join Pool (Net-30)</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Direct B2B Supplier Catalog */}
      <div className="card-clean" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Direct Wholesale Marketplace (PHP ₱)
            </h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Order raw ingredients directly with built-in Net-15 & Net-30 trade credit.
            </p>
          </div>

          <div className="pill-group">
            {['all', 'dairy', 'boba', 'packaging', 'coffee'].map(cat => (
              <button
                key={cat}
                className={`pill-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {filteredSuppliers.map(item => (
            <div
              key={item.id}
              style={{
                background: '#f8f9fb',
                border: '1px solid var(--border-light)',
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
                  <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>
                    {item.badge}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {item.leadTime}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                  {item.name}
                </h4>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Supplier: {item.supplier} • MOQ: {item.moq}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#7c3aed', fontWeight: 600 }}>
                <CreditCard size={12} />
                <span>{item.terms}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  ₱{item.price.toLocaleString()}
                </div>

                <button
                  className="btn-clean btn-clean-secondary btn-clean-sm"
                  onClick={() => alert(`Added ${item.name} to purchase order!`)}
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
