import React, { useState, useMemo } from 'react'
import { 
  ShoppingBag, 
  ExternalLink, 
  Check, 
  Sparkles, 
  Search, 
  Star, 
  Truck, 
  ArrowRight, 
  TrendingDown, 
  Layers, 
  X, 
  ShieldCheck,
  Tag,
  DollarSign,
  Share2,
  Store
} from 'lucide-react'
import { getOffersForIngredient, generateAffiliateLink, AFFILIATE_CONFIG } from '../data/affiliateStoresData'
import { triggerHaptic } from '../utils/haptics'

export function IngredientAffiliateSourcingModal({
  isOpen = false,
  onClose = () => {},
  ingredient = null,
  allIngredients = [],
  onApplyStorePriceToLayer = () => {},
  onSelectAnotherIngredient = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIngredient, setSelectedIngredient] = useState(ingredient)
  const [copiedLinkOfferId, setCopiedLinkOfferId] = useState(null)
  const [appliedOfferId, setAppliedOfferId] = useState(null)
  const [sortBy, setSortBy] = useState('price') // 'price' | 'unit_cost' | 'rating'

  // Update selected ingredient when prop changes
  React.useEffect(() => {
    if (ingredient) {
      setSelectedIngredient(ingredient)
    }
  }, [ingredient])

  if (!isOpen) return null

  const activeIngredient = selectedIngredient || ingredient || (allIngredients[0] || { name: 'Oatly Barista Edition Oat Milk', unitCostPerMl: 0.21, id: 'oatly-barista' })
  const rawOffers = getOffersForIngredient(activeIngredient)

  const sortedOffers = [...rawOffers].sort((a, b) => {
    if (sortBy === 'price') return a.pricePhp - b.pricePhp
    if (sortBy === 'unit_cost') return a.unitCostPerMl - b.unitCostPerMl
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  const lowestPriceOffer = sortedOffers.reduce((min, o) => o.pricePhp < min.pricePhp ? o : min, sortedOffers[0])

  const handleOpenStore = (offer) => {
    triggerHaptic('tap')
    const finalUrl = generateAffiliateLink(offer.platform, offer.affiliateUrl)
    window.open(finalUrl, '_blank', 'noopener,noreferrer')
  }

  const handleApplyPrice = (offer) => {
    triggerHaptic('success')
    setAppliedOfferId(offer.id)
    onApplyStorePriceToLayer({
      unitCostPerMl: offer.unitCostPerMl,
      supplier: `${offer.sellerName} (${offer.platform})`,
      appliedPrice: offer.pricePhp
    })

    setTimeout(() => {
      setAppliedOfferId(null)
    }, 2500)
  }

  const handleCopyAffiliateLink = (offer) => {
    triggerHaptic('light')
    const finalUrl = generateAffiliateLink(offer.platform, offer.affiliateUrl)
    navigator.clipboard.writeText(finalUrl)
    setCopiedLinkOfferId(offer.id)
    setTimeout(() => setCopiedLinkOfferId(null), 2000)
  }

  return (
    <div className="clean-modal-overlay" onClick={onClose} style={{ zIndex: 125 }}>
      <div 
        className="clean-modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '640px', width: '96%', maxHeight: '92vh', padding: '22px', overflowY: 'auto' }}
      >
        <div className="modal-drag-handle" />

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
              }}
            >
              <ShoppingBag size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Compare Stores & Affiliate Buy
                </h2>
                <span style={{ fontSize: '0.62rem', background: '#ffedd5', color: '#c2410c', padding: '2px 6px', borderRadius: '999px', fontWeight: 800, border: '1px solid #fed7aa' }}>
                  Shopee • Lazada • Wholesale
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0' }}>
                Verified Philippine store offers with instant recipe cost calculation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Active Ingredient Spotlight Banner */}
        <div 
          style={{ 
            background: 'linear-gradient(135deg, #1e293b, #0f172a)', 
            color: '#ffffff', 
            borderRadius: '16px', 
            padding: '16px', 
            marginBottom: '18px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#f59e0b', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Selected Formulation Ingredient
              </span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, margin: '0 0 4px' }}>
                {activeIngredient.name}
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                Current Studio Cost: <span style={{ color: '#38bdf8', fontWeight: 800 }}>₱{activeIngredient.unitCostPerMl?.toFixed(3) || '0.210'}/ml</span>
              </p>
            </div>

            {lowestPriceOffer && (
              <div style={{ textAlign: 'right', background: 'rgba(255, 255, 255, 0.08)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <span style={{ fontSize: '0.62rem', color: '#4ade80', fontWeight: 800, display: 'block' }}>
                  Lowest Online Price
                </span>
                <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-display)' }}>
                  ₱{lowestPriceOffer.pricePhp.toFixed(2)}
                </span>
                <span style={{ fontSize: '0.65rem', color: '#cbd5e1', display: 'block' }}>
                  on {lowestPriceOffer.platform}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Filter & Sort Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155' }}>
            {sortedOffers.length} Verified Online Stores Offering This Item:
          </span>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setSortBy('price')}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: sortBy === 'price' ? '#0f172a' : '#ffffff',
                color: sortBy === 'price' ? '#ffffff' : '#64748b',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Lowest Price
            </button>
            <button
              onClick={() => setSortBy('unit_cost')}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: sortBy === 'unit_cost' ? '#0f172a' : '#ffffff',
                color: sortBy === 'unit_cost' ? '#ffffff' : '#64748b',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Lowest Cost/ml
            </button>
            <button
              onClick={() => setSortBy('rating')}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: sortBy === 'rating' ? '#0f172a' : '#ffffff',
                color: sortBy === 'rating' ? '#ffffff' : '#64748b',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Highest Rated
            </button>
          </div>
        </div>

        {/* Store Offer Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sortedOffers.map(offer => {
            const isShopee = offer.platform.includes('Shopee')
            const isLazada = offer.platform.includes('Lazada')
            const isWholesale = offer.platform.includes('Wholesale')

            return (
              <div
                key={offer.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}
              >
                {/* Store Header & Platform Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Platform Tag */}
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: 800,
                        fontSize: '0.68rem',
                        background: isShopee ? '#ee4d2d' : isLazada ? '#0f146d' : '#059669',
                        color: '#ffffff'
                      }}
                    >
                      {offer.platform}
                    </span>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                          {offer.sellerName}
                        </span>
                        {offer.isOfficialMall && (
                          <span style={{ fontSize: '0.6rem', color: '#16a34a', fontWeight: 800 }}>
                            ✓ Official
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.68rem', color: '#64748b', marginTop: '1px' }}>
                        <span style={{ color: '#d97706', fontWeight: 700 }}>★ {offer.rating}</span>
                        <span>•</span>
                        <span>{offer.reviewCount} orders</span>
                        <span>•</span>
                        <span>{offer.packSize}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Block */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-display)' }}>
                      ₱{offer.pricePhp.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#d97706', fontWeight: 700 }}>
                      ₱{offer.unitCostPerMl?.toFixed(3)} / ml
                    </div>
                  </div>
                </div>

                {/* Delivery and Highlight Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#475569', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Truck size={12} color="#0284c7" />
                    <span>{offer.deliveryEta}</span>
                  </span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>
                    {offer.badge}
                  </span>
                </div>

                {/* Actions: Buy Online & Apply Price to Recipe */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                  <button
                    onClick={() => handleOpenStore(offer)}
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: '10px',
                      background: isShopee 
                        ? 'linear-gradient(135deg, #ee4d2d, #ea580c)' 
                        : isLazada 
                        ? 'linear-gradient(135deg, #0f146d, #2563eb)' 
                        : 'linear-gradient(135deg, #059669, #047857)',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}
                  >
                    <span>🛒 Buy on {offer.platform.split(' ')[0]}</span>
                    <ExternalLink size={12} />
                  </button>

                  <button
                    onClick={() => handleApplyPrice(offer)}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '10px',
                      background: appliedOfferId === offer.id ? '#dcfce7' : '#f1f5f9',
                      color: appliedOfferId === offer.id ? '#15803d' : '#334155',
                      border: appliedOfferId === offer.id ? '1px solid #86efac' : '1px solid #cbd5e1',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Update current recipe layer with this store's price"
                  >
                    {appliedOfferId === offer.id ? (
                      <>
                        <Check size={13} color="#15803d" />
                        <span>Applied!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} color="#d97706" />
                        <span>Use This Price</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleCopyAffiliateLink(offer)}
                    style={{
                      padding: '9px 10px',
                      borderRadius: '10px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      color: '#64748b',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Copy Affiliate Sourcing Link"
                  >
                    <Share2 size={13} color={copiedLinkOfferId === offer.id ? '#16a34a' : '#64748b'} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Affiliate Disclosure Footer */}
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.68rem', color: '#94a3b8' }}>
          💡 When you purchase ingredients via these Shopee & Lazada partner links, PourCraft OS may earn a verified referral commission at no additional cost to you.
        </div>
      </div>
    </div>
  )
}
