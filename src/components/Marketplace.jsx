import React, { useState } from 'react'
import { 
  Search, 
  SlidersHorizontal, 
  Users, 
  Clock, 
  Star, 
  Plus, 
  Minus, 
  Trash2, 
  Check, 
  ChevronRight, 
  ShoppingBag, 
  MapPin, 
  X, 
  CreditCard, 
  Truck, 
  Download, 
  Share2, 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  FileText 
} from 'lucide-react'

export function Marketplace({
  catalog = [],
  onUpdateCatalogPrice,
  activeRegion = 'Metro Manila',
  setActiveRegion,
  isCartOpen = false,
  setIsCartOpen,
  isRegionModalOpen = false,
  setIsRegionModalOpen,
  cartItems = [],
  setCartItems
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured') // 'featured' | 'price-asc' | 'rating'
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedPool, setSelectedPool] = useState(null)
  const [showAllPoolsModal, setShowAllPoolsModal] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [filterNet30Only, setFilterNet30Only] = useState(false)
  const [filterSameDayOnly, setFilterSameDayOnly] = useState(false)

  // PO & Checkout states
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState('net30') // 'net30' | 'net15' | 'gcash' | 'cod'
  const [confirmedPo, setConfirmedPo] = useState(null)
  const [autoSyncInventory, setAutoSyncInventory] = useState(true)

  // Pledge form state
  const [pledgeQuantity, setPledgeQuantity] = useState(2)
  const [pledgeSuccess, setPledgeSuccess] = useState(false)

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'packaging', label: '📦 Packaging' },
    { id: 'boba', label: '🧋 Boba & Teas' },
    { id: 'beans', label: '☕ Beans' },
    { id: 'dairy', label: '🥛 Dairy' },
    { id: 'bar', label: '🍸 Bar' }
  ]

  const regions = [
    { id: 'Metro Manila', leadTime: 'Next-Day Delivery', fee: 'Free above ₱3,500' },
    { id: 'Cebu & Visayas', leadTime: '2-3 Business Days', fee: '₱350 / Free above ₱8,000' },
    { id: 'Davao & Mindanao', leadTime: '3-4 Business Days', fee: '₱420 / Free above ₱10,000' },
    { id: 'Baguio & Cordillera', leadTime: '1-2 Days Direct Origin', fee: '₱200 flat' },
    { id: 'Clark & Pampanga', leadTime: 'Same / Next Day', fee: '₱180 flat' }
  ]

  const poolDeals = [
    {
      id: 'pool-1',
      title: '16oz U-Cups (PET/PLA)',
      category: 'packaging',
      supplier: 'EcoPack Manila',
      rating: 4.9,
      reviews: 142,
      pledgedCount: 19,
      targetCount: 25,
      tierDiscount: '28% OFF',
      standardPrice: 5.80,
      poolPrice: 4.10,
      unitLabel: 'cup',
      timeRemaining: '3d left',
      icon: '🥤',
      imgBg: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
      minPledge: 500,
      pledgeUnit: 'cups (1 Box = 1,000 pcs)',
      unitCostSavings: '₱1.70/cup (Save ₱1,700 per box)',
      participatingShops: ['Yardstick Coffee', 'Habitual Coffee', 'Crema & Milk', '+16 more']
    },
    {
      id: 'pool-2',
      title: '1st-Harvest Uji Ceremonial Matcha (5kg Bulk)',
      category: 'boba',
      supplier: 'Matcha Manila Direct',
      rating: 5.0,
      reviews: 89,
      pledgedCount: 8,
      targetCount: 10,
      tierDiscount: '30% OFF',
      standardPrice: 9500.00,
      poolPrice: 6650.00,
      unitLabel: 'kg',
      timeRemaining: '18h left',
      icon: '🍵',
      imgBg: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
      minPledge: 1,
      pledgeUnit: 'kg aluminum foil vacuum packs',
      unitCostSavings: '₱2,850/kg saved (₱0.33/ml vs ₱0.48/ml spec)',
      participatingShops: ['Tsujiri PH', 'The Matcha Lab', 'Boba Studio Makati', '+5 more']
    },
    {
      id: 'pool-3',
      title: 'Oatly Barista Edition (Pallet / 60 Cases)',
      category: 'dairy',
      supplier: 'Gourmet Direct PH',
      rating: 4.8,
      reviews: 210,
      pledgedCount: 14,
      targetCount: 20,
      tierDiscount: '22% OFF',
      standardPrice: 1260.00,
      poolPrice: 980.00,
      unitLabel: 'case',
      timeRemaining: '2d left',
      icon: '🥛',
      imgBg: 'linear-gradient(135deg, #fef3c7, #fde68a)',
      minPledge: 2,
      pledgeUnit: 'cases (6 x 1L)',
      unitCostSavings: '₱280/case saved (₱163/L vs ₱210/L)',
      participatingShops: ['Chapter Coffee', 'Resonate Coffee', 'Commune Poblacion', '+11 more']
    },
    {
      id: 'pool-4',
      title: 'Benguet Highland Peaberry Specialty (60kg Bag)',
      category: 'beans',
      supplier: 'Cordillera Coffee Alliance',
      rating: 4.9,
      reviews: 64,
      pledgedCount: 4,
      targetCount: 6,
      tierDiscount: '25% OFF',
      standardPrice: 5200.00,
      poolPrice: 3900.00,
      unitLabel: '5kg pack',
      timeRemaining: '4d left',
      icon: '☕',
      imgBg: 'linear-gradient(135deg, #ffedd5, #fed7aa)',
      minPledge: 1,
      pledgeUnit: '5kg grainpro sacks',
      unitCostSavings: '₱1,300/sack saved (₱780/kg)',
      participatingShops: ['El Union', 'Fat Seed', '+2 more']
    }
  ]

  const directProducts = [
    {
      id: 'prod-1',
      skuId: 'oatly-barista',
      name: 'Oatly Barista Edition (Case 6 x 1L)',
      supplier: 'Gourmet Direct PH',
      category: 'dairy',
      price: 1260.00,
      unitEquiv: '₱210.00 / Liter (₱0.210/ml)',
      moq: '3 Cases',
      leadTime: 'Next-day delivery',
      rating: 4.9,
      reviews: 320,
      icon: '🥛',
      imgBg: '#fef3c7',
      net30: true,
      description: 'The global standard barista oat milk. Foams perfectly with dense micro-foam, neutral sweetness that highlights espresso notes.',
      tierDiscounts: [
        { qty: '1-4 Cases', price: '₱1,260.00' },
        { qty: '5-19 Cases', price: '₱1,180.00 (Save 6%)' },
        { qty: '20+ Cases', price: '₱1,090.00 (Save 13%)' }
      ]
    },
    {
      id: 'prod-2',
      skuId: 'tiger-boba-pearls',
      name: 'Top Creamery Raw Tapioca (6 x 3kg)',
      supplier: 'Top Creamery Mfg',
      category: 'boba',
      price: 2400.00,
      unitEquiv: '₱133.33 / kg (₱0.133/g raw)',
      moq: '2 Cases',
      leadTime: 'Same-day dispatch',
      rating: 4.8,
      reviews: 184,
      icon: '🧋',
      imgBg: '#fee2e2',
      net30: true,
      description: 'Quick-cook black tapioca boba pearls with 4-hour soft chew window. Formulated specifically for Muscovado brown sugar marbling.',
      tierDiscounts: [
        { qty: '1-3 Cases', price: '₱2,400.00' },
        { qty: '4+ Cases', price: '₱2,250.00' }
      ]
    },
    {
      id: 'prod-3',
      skuId: 'boba-bamboo-straw',
      name: '12mm Bamboo Fiber Straws (2000 pcs)',
      supplier: 'EcoFriendly PH',
      category: 'packaging',
      price: 3000.00,
      unitEquiv: '₱1.50 / straw',
      moq: '1 Box',
      leadTime: 'Next-day delivery',
      rating: 4.9,
      reviews: 95,
      icon: '🥢',
      imgBg: '#ecfdf5',
      net30: true,
      description: '100% plant-based bamboo fiber boba straws. Does not get soggy in iced drinks for over 6 hours; fully biodegradable.',
      tierDiscounts: [
        { qty: '1-2 Boxes', price: '₱3,000.00' },
        { qty: '3+ Boxes', price: '₱2,700.00' }
      ]
    },
    {
      id: 'prod-4',
      skuId: 'ethiopia-espresso',
      name: 'Benguet Highland Arabica (5kg Sack)',
      supplier: 'Cordillera Coffee Alliance',
      category: 'beans',
      price: 4500.00,
      unitEquiv: '₱900.00 / kg (₱16.20 per 18g double shot)',
      moq: '1 Sack',
      leadTime: '2-3 days direct origin',
      rating: 5.0,
      reviews: 112,
      icon: '☕',
      imgBg: '#ffedd5',
      net30: false,
      description: 'Single-origin washed Arabica from Atok, Benguet (1,500 MASL). Tasting notes: Brown sugar, orange peel, milk chocolate finish.',
      tierDiscounts: [
        { qty: '1-2 Sacks', price: '₱4,500.00' },
        { qty: '3+ Sacks', price: '₱4,150.00' }
      ]
    },
    {
      id: 'prod-5',
      skuId: 'artisanal-mezcal',
      name: 'Del Maguey Vida Mezcal (750ml)',
      supplier: 'Craft Spirits Manila',
      category: 'bar',
      price: 2850.00,
      unitEquiv: '₱3.80 / ml (₱171 per 45ml pour)',
      moq: '2 Bottles',
      leadTime: 'Next-day delivery',
      rating: 4.9,
      reviews: 58,
      icon: '🍸',
      imgBg: '#ede9fe',
      net30: true,
      description: 'Handcrafted Espadín mezcal twice distilled in wood-fired copper stills. Smoky agave, tropical fruit, and ginger aromatics.',
      tierDiscounts: [
        { qty: '1-5 Bottles', price: '₱2,850.00' },
        { qty: '6+ Bottles', price: '₱2,650.00' }
      ]
    },
    {
      id: 'prod-6',
      skuId: 'tiger-brown-sugar-syrup',
      name: 'House Muscovado Raw Sugar Syrup (5L Jug)',
      supplier: 'Negros Cane Collective',
      category: 'beans',
      price: 1650.00,
      unitEquiv: '₱0.330 / ml (68° Brix)',
      moq: '1 Jug',
      leadTime: 'Same-day dispatch',
      rating: 4.8,
      reviews: 77,
      icon: '🍯',
      imgBg: '#fdf4ff',
      net30: true,
      description: 'Natural unrefined Muscovado syrup boiled from fresh sugarcane juice. Deep molasses notes perfect for tiger boba and shaken espresso.',
      tierDiscounts: [
        { qty: '1-3 Jugs', price: '₱1,650.00' },
        { qty: '4+ Jugs', price: '₱1,500.00' }
      ]
    }
  ]

  // Cart Management
  const handleAddToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const handleUpdateCartQty = (id, delta) => {
    setCartItems(prev => {
      return prev
        .map(i => {
          if (i.id === id) {
            const newQty = i.qty + delta
            return newQty > 0 ? { ...i, qty: newQty } : null
          }
          return i
        })
        .filter(Boolean)
    })
  }

  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id))
  }

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0)

  // Handle Checkout / PO Creation
  const handlePlaceOrder = () => {
    const poNum = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    setConfirmedPo({
      poNumber: poNum,
      items: [...cartItems],
      total: cartTotal,
      terms: selectedPaymentTerms === 'net30' ? 'Net-30 Commercial Invoice' : selectedPaymentTerms === 'net15' ? 'Net-15 Invoice' : 'Instant Settlement',
      deliveryDate: 'Tomorrow, 10:00 AM - 2:00 PM',
      region: activeRegion
    })

    // If autoSync is enabled, sync the prices back into catalog
    if (autoSyncInventory && onUpdateCatalogPrice) {
      cartItems.forEach(item => {
        if (item.skuId) {
          // calculate new unit cost
          const newUnitCost = item.price / (item.skuId.includes('oatly') ? 6000 : item.skuId.includes('tapioca') ? 18000 : 1000)
          onUpdateCatalogPrice([{ skuId: item.skuId, newUnitCost, newPrice: item.price }])
        }
      })
    }

    setCartItems([])
  }

  // Filter and Sort direct products
  const filteredProducts = directProducts
    .filter(item => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesNet30 = !filterNet30Only || item.net30
      const matchesSameDay = !filterSameDayOnly || item.leadTime.includes('Same-day')
      return matchesCat && matchesSearch && matchesNet30 && matchesSameDay
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%', margin: '0 auto', paddingBottom: '120px' }}>
      
      {/* 1. Search Bar & Filter Trigger */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '10px 14px',
            gap: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}
        >
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search beans, syrups, cups, boba..."
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.84rem',
              color: '#0f172a',
              background: 'transparent',
              fontWeight: 500
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFiltersModal(true)}
          style={{
            height: '44px',
            padding: '0 14px',
            borderRadius: '16px',
            border: (filterNet30Only || filterSameDayOnly) ? '1.5px solid #d97706' : '1px solid #e2e8f0',
            background: (filterNet30Only || filterSameDayOnly) ? '#fffbeb' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: (filterNet30Only || filterSameDayOnly) ? '#b45309' : '#334155',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}
        >
          <SlidersHorizontal size={15} color={(filterNet30Only || filterSameDayOnly) ? '#b45309' : '#475569'} />
          <span>Filters</span>
          {(filterNet30Only || filterSameDayOnly) && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706' }} />}
        </button>
      </div>

      {/* Horizontal Category Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '2px',
          scrollbarWidth: 'none'
        }}
      >
        {categories.map(cat => {
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                borderRadius: '9999px',
                border: isActive ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                background: isActive ? '#0f172a' : '#ffffff',
                color: isActive ? '#ffffff' : '#475569',
                fontSize: '0.78rem',
                fontWeight: isActive ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* 2. Group Buying Section ("Active Group Pools") */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Active Group Pools
            </h2>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Co-purchase with {poolDeals.reduce((acc, p) => acc + p.pledgedCount, 0)} local cafés for volume discounts
            </span>
          </div>

          <button
            onClick={() => setShowAllPoolsModal(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#d97706',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            <span>View All ({poolDeals.length})</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {poolDeals.slice(0, 2).map(pool => {
            const percent = Math.round((pool.pledgedCount / pool.targetCount) * 100)
            return (
              <div
                key={pool.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '14px',
                  display: 'flex',
                  gap: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                {/* Left: 64x64 Thumbnail */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '14px',
                    background: pool.imgBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    flexShrink: 0
                  }}
                >
                  {pool.icon}
                </div>

                {/* Right: Content Details */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {/* Top Badge Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        background: '#fffbeb',
                        color: '#b45309',
                        border: '1px solid #fde68a',
                        borderRadius: '9999px',
                        padding: '2px 8px',
                        fontSize: '0.66rem',
                        fontWeight: 800
                      }}
                    >
                      🔥 {pool.tierDiscount}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} /> {pool.timeRemaining}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3
                    onClick={() => setSelectedPool(pool)}
                    style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: '2px 0 0 0', lineHeight: 1.25, cursor: 'pointer' }}
                  >
                    {pool.title}
                  </h3>

                  {/* Supplier Line */}
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{pool.supplier}</span>
                    <span>•</span>
                    <span style={{ color: '#d97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Star size={11} fill="#d97706" color="#d97706" /> {pool.rating}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ margin: '4px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '3px', fontWeight: 600 }}>
                      <span style={{ color: '#475569' }}>{pool.pledgedCount} / {pool.targetCount} Cafes Pledged</span>
                      <span style={{ color: '#059669', fontWeight: 800 }}>({percent}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: '#059669', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '4px', marginTop: '2px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through', marginRight: '4px' }}>
                        ₱{pool.standardPrice.toLocaleString()}
                      </span>
                      <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#047857', fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>
                        ₱{pool.poolPrice.toLocaleString()} / {pool.unitLabel}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setSelectedPool(pool)
                          setPledgeQuantity(2)
                          setPledgeSuccess(false)
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #d97706, #b45309)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '7px 14px',
                          borderRadius: '10px',
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(217, 119, 6, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>Join Pool</span>
                      </button>
                      <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
                        Net-30 terms available
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. Direct Wholesale Catalog (2-Column Grid) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Direct Supplier Catalog
            </h2>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Delivering to <strong style={{ color: '#0f172a' }}>{activeRegion}</strong>
            </span>
          </div>

          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
            {filteredProducts.length} Products
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {filteredProducts.map(item => {
            const inCart = cartItems.find(c => c.id === item.id)
            return (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '18px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  gap: '8px'
                }}
              >
                <div>
                  {/* Product Thumbnail & Icon */}
                  <div
                    onClick={() => setSelectedProduct(item)}
                    style={{
                      height: '80px',
                      borderRadius: '12px',
                      background: item.imgBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.2rem',
                      marginBottom: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Supplier & Rating */}
                  <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' }}>{item.supplier}</span>
                    <span style={{ color: '#d97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Star size={10} fill="#d97706" color="#d97706" /> {item.rating}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h4
                    onClick={() => setSelectedProduct(item)}
                    style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', margin: '3px 0', lineHeight: 1.25, minHeight: '32px', cursor: 'pointer' }}
                  >
                    {item.name}
                  </h4>

                  {/* MOQ & Lead Time */}
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                    <div>MOQ: <strong style={{ color: '#334155' }}>{item.moq}</strong></div>
                    <div style={{ color: '#059669', fontWeight: 600, marginTop: '1px' }}>{item.leadTime}</div>
                  </div>
                </div>

                {/* Price & Quick Order Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                      ₱{item.price.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    style={{
                      background: inCart ? '#059669' : '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                    title="Add to Cart"
                  >
                    {inCart ? <Check size={12} /> : <Plus size={12} />}
                    <span>{inCart ? `${inCart.qty} In Cart` : 'Order'}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: B2B Cart & PO Checkout Drawer */}
      {/* ========================================================= */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '540px',
              maxHeight: '88vh',
              overflowY: 'auto',
              margin: '0 auto',
              background: '#ffffff',
              borderRadius: '28px 28px 0 0',
              padding: '18px 20px 32px',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Grab Handle */}
            <div style={{ width: '40px', height: '4px', background: '#cbd5e1', borderRadius: '9999px', margin: '0 auto' }} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Wholesale Purchase Order
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Delivery Region: <strong style={{ color: '#0f172a' }}>{activeRegion}</strong>
                </p>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
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
                  color: '#475569'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 0', color: '#64748b' }}>
                <ShoppingBag size={36} style={{ margin: '0 auto 8px', color: '#cbd5e1' }} />
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.94rem' }}>Your wholesale cart is empty</div>
                <p style={{ fontSize: '0.78rem', marginTop: '4px' }}>Browse raw beans, oat milk cases, and U-cups above.</p>
              </div>
            ) : (
              <>
                {/* Smart Basket Consolidator Optimizer Banner */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                    border: '1px solid #86efac',
                    borderRadius: '16px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Sparkles size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#065f46' }}>
                        Smart Basket Optimization: Save ₱450 Shipping
                      </div>
                      <div style={{ fontSize: '0.70rem', color: '#047857', marginTop: '1px' }}>
                        Consolidating multi-vendor items into <strong>Gourmet Direct PH</strong> eliminates split freight fees & hits free delivery MOQ.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert('⚡ Cart auto-consolidated! Swapped items to single master distributor with ₱0 split delivery fee.')
                    }}
                    style={{
                      background: '#059669',
                      border: 'none',
                      color: '#ffffff',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)'
                    }}
                  >
                    Auto-Optimize
                  </button>
                </div>

                {/* Cart Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                          ₱{item.price.toLocaleString()} / unit • {item.supplier}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => handleUpdateCartQty(item.id, -1)}
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#334155'
                          }}
                        >
                          <Minus size={11} />
                        </button>
                        <span style={{ fontSize: '0.86rem', fontWeight: 800, minWidth: '20px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handleUpdateCartQty(item.id, 1)}
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#334155'
                          }}
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <div style={{ minWidth: '70px', textAlign: 'right', fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                        ₱{(item.price * item.qty).toLocaleString()}
                      </div>

                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* B2B Payment Terms Selector */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    Payment & Trade Credit Terms
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    {[
                      { id: 'net30', label: 'Net-30 Invoice', sub: 'Pay in 30 days' },
                      { id: 'net15', label: 'Net-15 Invoice', sub: 'Pay in 15 days' },
                      { id: 'gcash', label: 'GCash / Bank', sub: 'Instant settlement' },
                      { id: 'cod', label: 'COD Cash', sub: 'Upon delivery' }
                    ].map(term => (
                      <button
                        key={term.id}
                        onClick={() => setSelectedPaymentTerms(term.id)}
                        style={{
                          background: selectedPaymentTerms === term.id ? '#ffffff' : 'transparent',
                          border: selectedPaymentTerms === term.id ? '2px solid #0f172a' : '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '8px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          boxShadow: selectedPaymentTerms === term.id ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>{term.label}</div>
                        <div style={{ fontSize: '0.64rem', color: '#64748b' }}>{term.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inventory Cost Sync Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>Auto-Sync with Recipe Studio</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Updates recipe COGS automatically based on these new wholesale prices.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSyncInventory}
                    onChange={(e) => setAutoSyncInventory(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>

                {/* Order Summary & Primary CTA */}
                <div style={{ paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569' }}>Total PO Amount:</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                      ₱{cartTotal.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '14px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #d97706, #b45309)',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)'
                    }}
                  >
                    <FileText size={16} />
                    <span>Issue B2B Purchase Order</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: PO Confirmation & Receipt Modal */}
      {/* ========================================================= */}
      {confirmedPo && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setConfirmedPo(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                border: '2px solid #a7f3d0'
              }}
            >
              <CheckCircle2 size={28} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Purchase Order Issued!
            </h3>

            <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '12px', border: '1px solid #e2e8f0', textAlign: 'left', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>PO Reference:</span>
                <strong style={{ color: '#0f172a', fontFamily: 'var(--font-mono)' }}>{confirmedPo.poNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Terms:</span>
                <strong style={{ color: '#059669' }}>{confirmedPo.terms}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Est. Delivery:</span>
                <strong style={{ color: '#0f172a' }}>{confirmedPo.deliveryDate}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px dashed #cbd5e1' }}>
                <span style={{ color: '#475569', fontWeight: 700 }}>Total Billed:</span>
                <strong style={{ color: '#0f172a', fontSize: '0.94rem', fontFamily: 'var(--font-mono)' }}>
                  ₱{confirmedPo.total.toLocaleString()}
                </strong>
              </div>
            </div>

            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Vendors have received your dispatch request. Invoice copy sent to your registered business email.
            </div>

            <button
              onClick={() => setConfirmedPo(null)}
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '12px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Done & Return to Studio
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: Group Pool Pledge Modal */}
      {/* ========================================================= */}
      {selectedPool && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
          onClick={() => setSelectedPool(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '540px',
              background: '#ffffff',
              borderRadius: '28px 28px 0 0',
              padding: '18px 20px 32px',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ width: '40px', height: '4px', background: '#cbd5e1', borderRadius: '9999px', margin: '0 auto' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <span style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', borderRadius: '9999px', padding: '2px 8px', fontSize: '0.68rem', fontWeight: 800 }}>
                  🔥 {selectedPool.tierDiscount} Group Tier
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
                  {selectedPool.title}
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#64748b', margin: 0 }}>
                  Supplier: {selectedPool.supplier} • ⭐ {selectedPool.rating} ({selectedPool.reviews} reviews)
                </p>
              </div>

              <button onClick={() => setSelectedPool(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            {/* Savings Banner */}
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '10px 12px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#065f46' }}>
                Collective Cost Advantage: {selectedPool.unitCostSavings}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#047857', marginTop: '2px' }}>
                Regular: ₱{selectedPool.standardPrice.toLocaleString()} ➔ Group Rate: <strong>₱{selectedPool.poolPrice.toLocaleString()} / {selectedPool.unitLabel}</strong>
              </div>
            </div>

            {/* Pledging Stepper */}
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Your Café's Pledge Allocation
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                  {selectedPool.pledgeUnit}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setPledgeQuantity(Math.max(1, pledgeQuantity - 1))}
                    style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Minus size={13} />
                  </button>
                  <span style={{ fontSize: '1rem', fontWeight: 800, minWidth: '30px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                    {pledgeQuantity}
                  </span>
                  <button
                    onClick={() => setPledgeQuantity(pledgeQuantity + 1)}
                    style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Total Calculation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '4px' }}>
              <span style={{ fontSize: '0.84rem', color: '#64748b' }}>Pledge Commitment (Net-30):</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#047857', fontFamily: 'var(--font-mono)' }}>
                ₱{(selectedPool.poolPrice * pledgeQuantity).toLocaleString()}
              </span>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => {
                setPledgeSuccess(true)
                setTimeout(() => {
                  setSelectedPool(null)
                  setPledgeSuccess(false)
                }, 1500)
              }}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '14px',
                border: 'none',
                background: pledgeSuccess ? '#059669' : 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)'
              }}
            >
              {pledgeSuccess ? (
                <>
                  <Check size={16} />
                  <span>Pledge Confirmed on Net-30!</span>
                </>
              ) : (
                <>
                  <Users size={16} />
                  <span>Confirm Pledge ({pledgeQuantity} units)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: Region Switcher Sheet */}
      {/* ========================================================= */}
      {isRegionModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
          onClick={() => setIsRegionModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '540px',
              background: '#ffffff',
              borderRadius: '28px 28px 0 0',
              padding: '18px 20px 32px',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ width: '40px', height: '4px', background: '#cbd5e1', borderRadius: '9999px', margin: '0 auto' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Select Delivery Region
              </h3>
              <button onClick={() => setIsRegionModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {regions.map(r => {
                const isSelected = activeRegion === r.id
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setActiveRegion(r.id)
                      setIsRegionModalOpen(false)
                    }}
                    style={{
                      background: isSelected ? '#fffbeb' : '#ffffff',
                      border: isSelected ? '2px solid #d97706' : '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{r.id}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{r.leadTime} • {r.fee}</div>
                    </div>
                    {isSelected && <Check size={16} color="#d97706" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: Product Detail & Spec Sheet */}
      {/* ========================================================= */}
      {selectedProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '540px',
              maxHeight: '85vh',
              overflowY: 'auto',
              background: '#ffffff',
              borderRadius: '28px 28px 0 0',
              padding: '18px 20px 32px',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ width: '40px', height: '4px', background: '#cbd5e1', borderRadius: '9999px', margin: '0 auto' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: selectedProduct.imgBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                  {selectedProduct.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {selectedProduct.name}
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                    {selectedProduct.supplier} • ⭐ {selectedProduct.rating}
                  </div>
                </div>
              </div>

              <button onClick={() => setSelectedProduct(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4, margin: 0 }}>
              {selectedProduct.description}
            </p>

            {/* Cost Conversion Block */}
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.76rem' }}>
              <div style={{ color: '#64748b' }}>Recipe Unit Conversion:</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                {selectedProduct.unitEquiv}
              </div>
            </div>

            {/* Volume Tier Table */}
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Tiered Volume Pricing
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {selectedProduct.tierDiscounts.map((t, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: idx === 0 ? '#ffffff' : '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.76rem' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{t.qty}</span>
                    <span style={{ fontWeight: 800, color: idx === 0 ? '#0f172a' : '#059669', fontFamily: 'var(--font-mono)' }}>{t.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={() => {
                handleAddToCart(selectedProduct)
                setSelectedProduct(null)
                setIsCartOpen(true)
              }}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '14px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Plus size={16} />
              <span>Add to Cart (₱{selectedProduct.price.toLocaleString()})</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 6: Filters & Sort Drawer */}
      {/* ========================================================= */}
      {showFiltersModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
          onClick={() => setShowFiltersModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '540px',
              background: '#ffffff',
              borderRadius: '28px 28px 0 0',
              padding: '18px 20px 32px',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ width: '40px', height: '4px', background: '#cbd5e1', borderRadius: '9999px', margin: '0 auto' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Filter & Sort Marketplace
              </h3>
              <button onClick={() => setShowFiltersModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            {/* Sort Options */}
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Sort By
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'featured', label: 'Bestselling' },
                  { id: 'price-asc', label: 'Price: Low-High' },
                  { id: 'rating', label: 'Top Rated ⭐' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      borderRadius: '10px',
                      border: sortBy === s.id ? '2px solid #0f172a' : '1px solid #e2e8f0',
                      background: sortBy === s.id ? '#ffffff' : '#f8fafc',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: sortBy === s.id ? '#0f172a' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Switches */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>Net-30 Trade Credit Eligible Only</span>
                <input
                  type="checkbox"
                  checked={filterNet30Only}
                  onChange={(e) => setFilterNet30Only(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>Same-Day / Next-Day Dispatch Only</span>
                <input
                  type="checkbox"
                  checked={filterSameDayOnly}
                  onChange={(e) => setFilterSameDayOnly(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>
            </div>

            <button
              onClick={() => setShowFiltersModal(false)}
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '12px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 7: View All Pools Modal */}
      {/* ========================================================= */}
      {showAllPoolsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
          onClick={() => setShowAllPoolsModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '540px',
              maxHeight: '88vh',
              overflowY: 'auto',
              background: '#ffffff',
              borderRadius: '28px 28px 0 0',
              padding: '18px 20px 32px',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ width: '40px', height: '4px', background: '#cbd5e1', borderRadius: '9999px', margin: '0 auto' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                All Active Group Pools ({poolDeals.length})
              </h3>
              <button onClick={() => setShowAllPoolsModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {poolDeals.map(pool => (
                <div
                  key={pool.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '12px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: pool.imgBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                    {pool.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pool.title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>₱{pool.poolPrice.toLocaleString()} / {pool.unitLabel} ({pool.tierDiscount})</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAllPoolsModal(false)
                      setSelectedPool(pool)
                    }}
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
