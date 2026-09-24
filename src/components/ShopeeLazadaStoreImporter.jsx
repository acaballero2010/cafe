import React, { useState } from 'react'
import { 
  ShoppingBag, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  Store, 
  DollarSign, 
  Tag, 
  Percent, 
  Globe, 
  Star, 
  Send,
  Download,
  AlertCircle
} from 'lucide-react'
import { AFFILIATE_CONFIG, generateAffiliateLink } from '../data/affiliateStoresData'
import { triggerHaptic } from '../utils/haptics'

export const OFFICIAL_STORE_PRESETS = [
  {
    id: 'oatly-shopee',
    brand: 'Oatly Official Store PH',
    platform: 'Shopee Mall',
    storeUrl: 'https://shopee.ph/oatlyofficialstore',
    category: 'Plant Milk',
    logo: '🥛',
    itemsCount: 4,
    products: [
      { id: 'imp-oat-1', name: 'Oatly Barista Edition Oat Milk (1L)', sku: 'OAT-BAR-1L', pricePhp: 210.00, oldPricePhp: 225.00, packSize: '1000ml', unitCost: 0.210, stock: 1420, rating: 4.9, image: '🥛', affiliateUrl: 'https://shopee.ph/oatly-barista-1l', isMall: true, selected: true },
      { id: 'imp-oat-2', name: 'Oatly Barista Edition Wholesale Case (6 x 1L)', sku: 'OAT-BAR-CASE6', pricePhp: 1230.00, oldPricePhp: 1350.00, packSize: '6000ml', unitCost: 0.205, stock: 380, rating: 4.9, image: '📦', affiliateUrl: 'https://shopee.ph/oatly-case-6', isMall: true, selected: true },
      { id: 'imp-oat-3', name: 'Oatly Organic Whole Oat Milk (1L)', sku: 'OAT-ORG-1L', pricePhp: 230.00, oldPricePhp: 240.00, packSize: '1000ml', unitCost: 0.230, stock: 540, rating: 4.8, image: '🌱', affiliateUrl: 'https://shopee.ph/oatly-organic-1l', isMall: true, selected: true },
      { id: 'imp-oat-4', name: 'Oatly Chocolate Oat Milk Drink (1L)', sku: 'OAT-CHOC-1L', pricePhp: 235.00, oldPricePhp: 250.00, packSize: '1000ml', unitCost: 0.235, stock: 290, rating: 4.9, image: '🍫', affiliateUrl: 'https://shopee.ph/oatly-chocolate-1l', isMall: true, selected: true }
    ]
  },
  {
    id: 'topcreamery-lazada',
    brand: 'Top Creamery Official Flagship',
    platform: 'Lazada Flagship',
    storeUrl: 'https://www.lazada.com.ph/shop/top-creamery-flagship',
    category: 'Syrups & Boba Powders',
    logo: '🧋',
    itemsCount: 4,
    products: [
      { id: 'imp-tc-1', name: 'Top Creamery Brown Sugar Tiger Syrup (2.5kg)', sku: 'TC-BS-25KG', pricePhp: 480.00, oldPricePhp: 510.00, packSize: '2500ml', unitCost: 0.192, stock: 920, rating: 4.9, image: '🍯', affiliateUrl: 'https://www.lazada.com.ph/top-creamery-tiger-syrup', isMall: true, selected: true },
      { id: 'imp-tc-2', name: 'Top Creamery Ube Taro Cloud Powder (1kg)', sku: 'TC-TARO-1KG', pricePhp: 385.00, oldPricePhp: 410.00, packSize: '1000g', unitCost: 0.385, stock: 680, rating: 4.8, image: '🍠', affiliateUrl: 'https://www.lazada.com.ph/top-creamery-taro', isMall: true, selected: true },
      { id: 'imp-tc-3', name: 'Top Creamery Tapioca Pearls Black (1kg)', sku: 'TC-BOBA-1KG', pricePhp: 120.00, oldPricePhp: 130.00, packSize: '1000g', unitCost: 0.120, stock: 2400, rating: 4.9, image: '🧋', affiliateUrl: 'https://www.lazada.com.ph/top-creamery-boba', isMall: true, selected: true },
      { id: 'imp-tc-4', name: 'Top Creamery Cheesecake Foam Wall Powder (1kg)', sku: 'TC-CHEESE-1KG', pricePhp: 420.00, oldPricePhp: 450.00, packSize: '1000g', unitCost: 0.420, stock: 450, rating: 4.9, image: '🧀', affiliateUrl: 'https://www.lazada.com.ph/top-creamery-cheese', isMall: true, selected: true }
    ]
  },
  {
    id: 'monin-shopee',
    brand: 'Monin Gourmet Syrups Philippines',
    platform: 'Shopee Mall',
    storeUrl: 'https://shopee.ph/monin_philippines',
    category: 'Gourmet Syrups',
    logo: '🍾',
    itemsCount: 4,
    products: [
      { id: 'imp-mon-1', name: 'Monin Salted Caramel Gourmet Syrup (700ml)', sku: 'MON-SCAR-700', pricePhp: 540.00, oldPricePhp: 560.00, packSize: '700ml', unitCost: 0.771, stock: 430, rating: 5.0, image: '🍮', affiliateUrl: 'https://shopee.ph/monin-salted-caramel', isMall: true, selected: true },
      { id: 'imp-mon-2', name: 'Monin Madagascar Vanilla Syrup (700ml)', sku: 'MON-VAN-700', pricePhp: 540.00, oldPricePhp: 560.00, packSize: '700ml', unitCost: 0.771, stock: 610, rating: 4.9, image: '🌼', affiliateUrl: 'https://shopee.ph/monin-vanilla', isMall: true, selected: true },
      { id: 'imp-mon-3', name: 'Monin White Peach Puree Blend (1L)', sku: 'MON-PCH-1L', pricePhp: 680.00, oldPricePhp: 720.00, packSize: '1000ml', unitCost: 0.680, stock: 290, rating: 4.9, image: '🍑', affiliateUrl: 'https://shopee.ph/monin-peach-puree', isMall: true, selected: true },
      { id: 'imp-mon-4', name: 'Monin Hazelnut Syrup Sugar-Free (700ml)', sku: 'MON-HAZ-SF-700', pricePhp: 560.00, oldPricePhp: 580.00, packSize: '700ml', unitCost: 0.800, stock: 180, rating: 4.8, image: '🌰', affiliateUrl: 'https://shopee.ph/monin-hazelnut-sf', isMall: true, selected: true }
    ]
  },
  {
    id: 'yardstick-shopee',
    brand: 'Yardstick Specialty Coffee Roasters',
    platform: 'Shopee Mall',
    storeUrl: 'https://shopee.ph/yardstickcoffee',
    category: 'Specialty Espresso',
    logo: '☕',
    itemsCount: 3,
    products: [
      { id: 'imp-yd-1', name: 'Yardstick Golden Ticket Espresso Blend (1kg Whole Bean)', sku: 'YD-GT-1KG', pricePhp: 1450.00, oldPricePhp: 1550.00, packSize: '1000g', unitCost: 1.450, stock: 180, rating: 5.0, image: '☕', affiliateUrl: 'https://shopee.ph/yardstick-golden-ticket', isMall: true, selected: true },
      { id: 'imp-yd-2', name: 'Yardstick Ethiopia Guji Washed Single Origin (250g)', sku: 'YD-ETH-250G', pricePhp: 650.00, oldPricePhp: 680.00, packSize: '250g', unitCost: 2.600, stock: 95, rating: 5.0, image: '🍒', affiliateUrl: 'https://shopee.ph/yardstick-ethiopia', isMall: true, selected: true },
      { id: 'imp-yd-3', name: 'Yardstick Brazil Mogiana Natural (1kg Espresso Roast)', sku: 'YD-BRZ-1KG', pricePhp: 1380.00, oldPricePhp: 1450.00, packSize: '1000g', unitCost: 1.380, stock: 140, rating: 4.9, image: '🍫', affiliateUrl: 'https://shopee.ph/yardstick-brazil', isMall: true, selected: true }
    ]
  }
]

export function ShopeeLazadaStoreImporter({
  onPublishToCatalog = () => {}
}) {
  const [targetUrl, setTargetUrl] = useState('https://shopee.ph/oatlyofficialstore')
  const [selectedPlatform, setSelectedPlatform] = useState('Shopee Mall')
  const [isScraping, setIsScraping] = useState(false)
  const [stagedProducts, setStagedProducts] = useState(OFFICIAL_STORE_PRESETS[0].products)
  const [currentBrand, setCurrentBrand] = useState(OFFICIAL_STORE_PRESETS[0].brand)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [appliedAffiliateTag, setAppliedAffiliateTag] = useState(AFFILIATE_CONFIG.shopeeAffiliateId)

  const handleSelectPreset = (preset) => {
    triggerHaptic('selection')
    setTargetUrl(preset.storeUrl)
    setSelectedPlatform(preset.platform)
    setCurrentBrand(preset.brand)
    setStagedProducts(preset.products)
    setAppliedAffiliateTag(preset.platform.includes('Shopee') ? AFFILIATE_CONFIG.shopeeAffiliateId : AFFILIATE_CONFIG.lazadaAffiliateId)
  }

  const handleScrapeStore = (e) => {
    e.preventDefault()
    if (!targetUrl.trim()) return

    setIsScraping(true)
    triggerHaptic('tap')

    setTimeout(() => {
      setIsScraping(false)
      const matched = OFFICIAL_STORE_PRESETS.find(p => targetUrl.toLowerCase().includes(p.id.split('-')[0]))
      if (matched) {
        setStagedProducts(matched.products)
        setCurrentBrand(matched.brand)
      } else {
        // Custom parsed store items simulation
        const isShopee = targetUrl.toLowerCase().includes('shopee')
        const isLazada = targetUrl.toLowerCase().includes('lazada')
        const platformName = isShopee ? 'Shopee Mall' : isLazada ? 'Lazada Flagship' : 'Official Store'
        const customStoreName = targetUrl.split('/').pop().replace(/[-_]/g, ' ').toUpperCase() || 'OFFICIAL SUPPLIER PH'

        setCurrentBrand(customStoreName)
        setSelectedPlatform(platformName)
        setStagedProducts([
          {
            id: `imp-cust-${Date.now()}-1`,
            name: `${customStoreName} Signature Ingredient Pack (1L)`,
            sku: `IMP-${Date.now().toString().slice(-4)}-1`,
            pricePhp: 380.00,
            oldPricePhp: 410.00,
            packSize: '1000ml',
            unitCost: 0.380,
            stock: 500,
            rating: 4.9,
            image: '📦',
            affiliateUrl: generateAffiliateLink(isShopee ? 'Shopee' : 'Lazada', targetUrl, isShopee ? AFFILIATE_CONFIG.shopeeAffiliateId : AFFILIATE_CONFIG.lazadaAffiliateId),
            isMall: true,
            selected: true
          },
          {
            id: `imp-cust-${Date.now()}-2`,
            name: `${customStoreName} Wholesale Commercial Case (6 x 1L)`,
            sku: `IMP-${Date.now().toString().slice(-4)}-2`,
            pricePhp: 2150.00,
            oldPricePhp: 2350.00,
            packSize: '6000ml',
            unitCost: 0.358,
            stock: 120,
            rating: 5.0,
            image: '🏷️',
            affiliateUrl: generateAffiliateLink(isShopee ? 'Shopee' : 'Lazada', targetUrl, isShopee ? AFFILIATE_CONFIG.shopeeAffiliateId : AFFILIATE_CONFIG.lazadaAffiliateId),
            isMall: true,
            selected: true
          }
        ])
      }
      triggerHaptic('success')
    }, 1100)
  }

  const handleToggleProduct = (id) => {
    triggerHaptic('selection')
    setStagedProducts(prev => prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p))
  }

  const handlePriceChange = (id, newPrice) => {
    const price = Math.max(1, Number(newPrice) || 0)
    setStagedProducts(prev => prev.map(p => {
      if (p.id === id) {
        const vol = parseInt(p.packSize, 10) || 1000
        return { ...p, pricePhp: price, unitCost: price / vol }
      }
      return p
    }))
  }

  const handlePublishAll = () => {
    triggerHaptic('success')
    const selectedItems = stagedProducts.filter(p => p.selected)
    if (selectedItems.length === 0) return

    onPublishToCatalog(selectedItems, currentBrand)
    setPublishSuccess(true)
    setTimeout(() => setPublishSuccess(false), 4000)
  }

  const handleDownloadCsv = () => {
    const csvContent = 'SKU,Name,Brand,Platform,Pack_Size,Price_PHP,Unit_Cost_PHP,Stock,Rating,Affiliate_URL\n' +
      stagedProducts.map(p => `${p.sku},"${p.name}","${currentBrand}","${selectedPlatform}",${p.packSize},${p.pricePhp},${p.unitCost.toFixed(3)},${p.stock},${p.rating},"${p.affiliateUrl}"`).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${currentBrand.toLowerCase().replace(/\s+/g, '_')}_shopee_lazada_import.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    triggerHaptic('light')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* 1. Header Banner */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', 
          color: '#ffffff', 
          borderRadius: '16px', 
          padding: '16px 20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={22} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>
              Shopee Mall & Lazada Official Store Importer
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#fed7aa' }}>
              Auto-extract wholesale ingredient listings, live prices in ₱ PHP, and attach PourCraft affiliate tracking tags.
            </p>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.70rem', fontWeight: 800 }}>
          Tag: {appliedAffiliateTag}
        </div>
      </div>

      {/* 2. Official Brand Presets Picker */}
      <div>
        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
          Select Verified Philippine Supplier Official Store:
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
          {OFFICIAL_STORE_PRESETS.map(preset => {
            const isSelected = preset.brand === currentBrand
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #ea580c' : '1px solid #e2e8f0',
                  background: isSelected ? '#fff7ed' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{preset.logo}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>
                    {preset.brand}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#64748b' }}>
                    {preset.platform} • {preset.itemsCount} SKUs
                  </div>
                </div>
                {isSelected && <Check size={14} color="#ea580c" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Custom URL Scraper Input */}
      <form onSubmit={handleScrapeStore} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0f172a' }}>
            Store URL or Product Listing Link
          </label>
          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
            Supports Shopee Mall, Lazada Flagship, & Direct B2B
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Globe size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://shopee.ph/oatlyofficialstore or https://www.lazada.com.ph/shop/top-creamery"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 12px 10px 36px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isScraping}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              background: isScraping ? '#94a3b8' : '#0f172a',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.2)'
            }}
          >
            {isScraping ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Scraping Store...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} color="#38bdf8" />
                <span>Extract Listings</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* 4. Extracted Product Listings Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
              Extracted Products from {currentBrand}
            </div>
            <div style={{ fontSize: '0.70rem', color: '#64748b' }}>
              {stagedProducts.filter(p => p.selected).length} of {stagedProducts.length} items selected for broadcast
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleDownloadCsv}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePublishAll}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                background: publishSuccess ? '#16a34a' : 'linear-gradient(135deg, #ea580c, #c2410c)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 6px rgba(234, 88, 12, 0.25)'
              }}
            >
              {publishSuccess ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Published to Marketplace!</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Publish to Wholesale Directory</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#475569', fontWeight: 700 }}>
                <th style={{ padding: '10px 14px', width: '40px' }}>Select</th>
                <th style={{ padding: '10px 14px' }}>SKU Code</th>
                <th style={{ padding: '10px 14px' }}>Product Title</th>
                <th style={{ padding: '10px 14px' }}>Pack Size</th>
                <th style={{ padding: '10px 14px' }}>Price (₱ PHP)</th>
                <th style={{ padding: '10px 14px' }}>Unit Cost</th>
                <th style={{ padding: '10px 14px' }}>Stock & Rating</th>
                <th style={{ padding: '10px 14px' }}>Affiliate Sourcing Link</th>
              </tr>
            </thead>
            <tbody>
              {stagedProducts.map((prod) => (
                <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9', background: prod.selected ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <input
                      type="checkbox"
                      checked={prod.selected}
                      onChange={() => handleToggleProduct(prod.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#64748b' }}>
                    {prod.sku}
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>
                    <span style={{ marginRight: '6px' }}>{prod.image}</span>
                    <span>{prod.name}</span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>
                    {prod.packSize}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>₱</span>
                      <input
                        type="number"
                        value={prod.pricePhp}
                        onChange={(e) => handlePriceChange(prod.id, e.target.value)}
                        style={{ width: '70px', padding: '3px 6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 800, fontSize: '0.78rem' }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#d97706' }}>
                    ₱{prod.unitCost.toFixed(3)}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>{prod.stock} in stock</span>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.66rem' }}>⭐ {prod.rating}</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <a
                      href={generateAffiliateLink(selectedPlatform.includes('Shopee') ? 'Shopee' : 'Lazada', prod.affiliateUrl, appliedAffiliateTag)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '0.68rem'
                      }}
                    >
                      <span>Store Link</span>
                      <ExternalLink size={10} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
