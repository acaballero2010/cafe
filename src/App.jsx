import React, { useState, useEffect, useMemo } from 'react'
import { MobileHeader } from './components/MobileHeader'
import { MobileRecipeBuilder } from './components/MobileRecipeBuilder'
import { MobileStickyBottomBar } from './components/MobileStickyBottomBar'
import { MobileBottomSheet } from './components/MobileBottomSheet'
import { SpecSheetView } from './components/SpecSheetView'
import { SubRecipeManager } from './components/SubRecipeManager'
import { Marketplace } from './components/Marketplace'
import { MenuMatrix } from './components/MenuMatrix'
import { UserProfile } from './components/UserProfile'
import { BaristaCardModal } from './components/BaristaCardModal'
import { InvoiceOcrModal } from './components/InvoiceOcrModal'
import { SupplierPriceAlertCard } from './components/SupplierPriceAlertCard'
import { TrendingCommunityHubModal } from './components/TrendingCommunityHubModal'
import { DEFAULT_CATALOG, PACKAGING_ITEMS } from './data/defaultCatalog'
import { DEFAULT_SUB_RECIPES } from './data/defaultSubRecipes'
import { PRESET_RECIPES } from './data/presetRecipes'
import { INITIAL_TRENDING_RECIPES } from './data/trendingRecipes'
import { calculateDrinkMetrics } from './types/physics'
import { Layers, ChefHat, ShoppingBag, BarChart3, Receipt, BookOpen, User, Flame } from 'lucide-react'

export function App() {
  const [activeVenue, setActiveVenue] = useState('coffee')
  const [activeTab, setActiveTab] = useState('studio') // 'studio' | 'batches' | 'marketplace' | 'matrix' | 'profile'
  const [isSpecSheetMode, setIsSpecSheetMode] = useState(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [catalog, setCatalog] = useState(DEFAULT_CATALOG)
  const [subRecipes, setSubRecipes] = useState(DEFAULT_SUB_RECIPES)
  const [currentRecipe, setCurrentRecipe] = useState(PRESET_RECIPES[0])
  const [includeScrap, setIncludeScrap] = useState(true)
  const [trendingRecipes, setTrendingRecipes] = useState(INITIAL_TRENDING_RECIPES)
  const [isTrendingModalOpen, setIsTrendingModalOpen] = useState(false)

  // Saved Menus State
  const [savedMenus, setSavedMenus] = useState([
    {
      id: 'menu-summer-2026',
      title: '☀️ Summer 2026 Core Lineup',
      description: 'High-margin signature iced drinks, cold foams & shaken espressos.',
      season: 'Summer Season',
      updatedAt: 'Today',
      drinks: [
        PRESET_RECIPES[0],
        PRESET_RECIPES[1],
        PRESET_RECIPES[2] || PRESET_RECIPES[0]
      ]
    },
    {
      id: 'menu-core-espresso',
      title: '☕ Core Espresso & Classics',
      description: 'Daily driver milk lattes, americanos, and flat whites.',
      season: 'Core / Year-Round',
      updatedAt: 'Yesterday',
      drinks: [
        PRESET_RECIPES[0],
        PRESET_RECIPES[3] || PRESET_RECIPES[0]
      ]
    }
  ])

  // Marketplace State
  const [cartItems, setCartItems] = useState([
    {
      id: 'prod-1',
      skuId: 'oatly-barista',
      name: 'Oatly Barista Edition (Case 6 x 1L)',
      supplier: 'Gourmet Direct PH',
      category: 'dairy',
      price: 1260.00,
      qty: 2
    }
  ])
  const [activeRegion, setActiveRegion] = useState('Metro Manila')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false)

  // Modals
  const [isOcrOpen, setIsOcrOpen] = useState(false)
  const [isBaristaCardOpen, setIsBaristaCardOpen] = useState(false)
  const [showPriceAlert, setShowPriceAlert] = useState(true)

  // Sync preset when category changes
  useEffect(() => {
    const venueRecipe = PRESET_RECIPES.find(r => r.venue === activeVenue)
    if (venueRecipe) {
      setCurrentRecipe(venueRecipe)
    }
  }, [activeVenue])

  // Active packaging items
  const activePackagingItems = useMemo(() => {
    return PACKAGING_ITEMS.map(pkg => ({
      ...pkg,
      selected: (currentRecipe.packagingIds || []).includes(pkg.id)
    }))
  }, [currentRecipe.packagingIds])

  // Compute live physics & economics in PHP ₱
  const metrics = useMemo(() => {
    return calculateDrinkMetrics({
      vesselId: currentRecipe.vesselId,
      iceTypeId: currentRecipe.iceTypeId,
      layers: currentRecipe.layers,
      packagingItems: activePackagingItems,
      includeScrap: includeScrap,
      targetMarginPct: currentRecipe.targetMarginPct || 75,
      menuPrice: currentRecipe.menuPrice || 180.00
    })
  }, [currentRecipe, activePackagingItems, includeScrap])

  const handleLoadPreset = () => {
    const venuePresets = PRESET_RECIPES.filter(r => r.venue === activeVenue)
    const currentIndex = venuePresets.findIndex(r => r.id === currentRecipe.id)
    const nextPreset = venuePresets[(currentIndex + 1) % venuePresets.length] || PRESET_RECIPES[0]
    setCurrentRecipe(nextPreset)
  }

  const handleApplyPriceUpdates = (updatedItems) => {
    setCatalog(prevCatalog => {
      return prevCatalog.map(catItem => {
        const found = updatedItems.find(u => u.skuId === catItem.id)
        return found ? { ...catItem, unitCostPerMl: found.newUnitCost, packPrice: found.newPrice } : catItem
      })
    })

    setCurrentRecipe(prev => {
      const updatedLayers = prev.layers.map(layer => {
        const found = updatedItems.find(u => u.skuId === layer.ingredientId)
        return found ? { ...layer, unitCostPerMl: found.newUnitCost } : layer
      })
      return { ...prev, layers: updatedLayers }
    })
  }

  const handleCreateNewBatch = () => {
    const newBatch = {
      id: `sub-${Date.now()}`,
      name: 'New House Batch Prep',
      category: 'syrup',
      targetYieldQty: 1000,
      yieldUom: 'ml',
      prepWasteRate: 0.05,
      shelfLifeHours: 48,
      densityBrix: 50.0,
      colorHex: '#d97706',
      description: 'Slow-simmered house syrup or prep blend.',
      sopNotes: 'Combine raw materials, heat, cool, date stamp & store.',
      items: [
        { ingredientId: catalog[0]?.id || 'tiger-brown-sugar-syrup', quantity: 500, uom: 'ml' }
      ]
    }
    setSubRecipes(prev => [...prev, newBatch])
  }

  const handleSaveToMenu = (recipeOrMenu, isNewMenu = false, targetMenuId = null) => {
    if (isNewMenu) {
      setSavedMenus(prev => [recipeOrMenu, ...prev])
    } else {
      setSavedMenus(prev => prev.map(menu => {
        if (menu.id === targetMenuId) {
          const exists = menu.drinks.some(d => d.id === recipeOrMenu.id)
          const updatedDrinks = exists 
            ? menu.drinks.map(d => d.id === recipeOrMenu.id ? recipeOrMenu : d)
            : [...menu.drinks, { ...recipeOrMenu, id: `saved-${Date.now()}` }]
          return {
            ...menu,
            updatedAt: 'Just now',
            drinks: updatedDrinks
          }
        }
        return menu
      }))
    }
  }

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', color: '#111827', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Native Mobile Header & Dynamic Actions */}
      <MobileHeader
        activeVenue={activeVenue}
        setActiveVenue={setActiveVenue}
        activeTab={activeTab}
        totalBatches={subRecipes.length}
        cartCount={totalCartCount}
        activeRegion={activeRegion}
        onOpenRegion={() => setIsRegionModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onCreateBatch={handleCreateNewBatch}
        onOpenSop={() => setIsBaristaCardOpen(true)}
        onOpenOcr={() => setIsOcrOpen(true)}
        onOpenTrending={() => setIsTrendingModalOpen(true)}
      />

      {/* 2. Main Scrollable Container with 160px Bottom Scroll Clearance */}
      <main style={{ flex: 1, padding: '16px 16px 160px', maxWidth: '680px', width: '100%', margin: '0 auto' }}>
        {/* Supplier Price Shift & Margin Impact Alert Card */}
        {showPriceAlert && (
          <SupplierPriceAlertCard
            onAutoAdjustPrices={(impacted) => {
              // Update current recipe menuPrice if it's one of the impacted
              const match = impacted.find(i => currentRecipe.name.toLowerCase().includes(i.name.toLowerCase()))
              if (match) {
                setCurrentRecipe(prev => ({ ...prev, menuPrice: match.suggestedPrice }))
              }
            }}
            onCompareSuppliers={() => {
              setActiveTab('marketplace')
            }}
            onAcceptMargins={() => {
              // Updates catalog unit cost for fresh milk
              setCatalog(prev => prev.map(item => item.id.includes('milk') ? { ...item, unitCostPerMl: 0.110 } : item))
            }}
            onDismiss={() => setShowPriceAlert(false)}
          />
        )}
        {activeTab === 'studio' && (
          isSpecSheetMode ? (
            <SpecSheetView
              recipe={currentRecipe}
              metrics={metrics}
              onBackToBuilder={() => setIsSpecSheetMode(false)}
              onOpenMarketplace={() => setActiveTab('marketplace')}
            />
          ) : (
            <MobileRecipeBuilder
              recipe={currentRecipe}
              catalog={catalog}
              subRecipes={subRecipes}
              includeScrap={includeScrap}
              setIncludeScrap={setIncludeScrap}
              onUpdateRecipe={setCurrentRecipe}
              onLoadPreset={handleLoadPreset}
              savedMenus={savedMenus}
              onSaveToMenu={handleSaveToMenu}
              trendingRecipes={trendingRecipes}
              onUpdateTrendingRecipes={setTrendingRecipes}
              onOpenTrending={() => setIsTrendingModalOpen(true)}
            />
          )
        )}

        {activeTab === 'batches' && (
          <SubRecipeManager
            subRecipes={subRecipes}
            catalog={catalog}
            onUpdateSubRecipes={setSubRecipes}
          />
        )}

        {activeTab === 'marketplace' && (
          <Marketplace
            catalog={catalog}
            onUpdateCatalogPrice={handleApplyPriceUpdates}
            activeRegion={activeRegion}
            setActiveRegion={setActiveRegion}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            isRegionModalOpen={isRegionModalOpen}
            setIsRegionModalOpen={setIsRegionModalOpen}
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        )}

        {activeTab === 'matrix' && (
          <MenuMatrix
            currentRecipe={currentRecipe}
            metrics={metrics}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfile
            savedMenus={savedMenus}
            onUpdateSavedMenus={setSavedMenus}
            currentRecipe={currentRecipe}
            onLoadRecipeIntoStudio={(recipeToLoad) => {
              setCurrentRecipe(recipeToLoad)
            }}
            onOpenStudio={() => {
              setActiveTab('studio')
              setIsSpecSheetMode(false)
            }}
          />
        )}
      </main>

      {/* 3. Floating Sticky Bottom Bar (Studio Tab Only) */}
      {activeTab === 'studio' && !isSpecSheetMode && (
        <MobileStickyBottomBar
          metrics={metrics}
          onOpenBottomSheet={() => setIsBottomSheetOpen(true)}
        />
      )}

      {/* 4. Native Mobile Bottom Tab Navigation Bar */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 45,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '6px 8px calc(6px + env(safe-area-inset-bottom))',
          maxWidth: '680px',
          margin: '0 auto'
        }}
      >
        <button
          onClick={() => {
            setActiveTab('studio')
            setIsSpecSheetMode(false)
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'transparent',
            border: 'none',
            color: activeTab === 'studio' ? '#0f172a' : '#94a3b8',
            cursor: 'pointer',
            padding: '4px 8px',
            minHeight: '44px',
            justifyContent: 'center'
          }}
        >
          <Layers size={19} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'studio' ? 800 : 600 }}>Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('batches')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'transparent',
            border: 'none',
            color: activeTab === 'batches' ? '#0f172a' : '#94a3b8',
            cursor: 'pointer',
            padding: '4px 8px',
            minHeight: '44px',
            justifyContent: 'center'
          }}
        >
          <ChefHat size={19} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'batches' ? 800 : 600 }}>Batches</span>
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'transparent',
            border: 'none',
            color: activeTab === 'marketplace' ? '#0f172a' : '#94a3b8',
            cursor: 'pointer',
            padding: '4px 8px',
            minHeight: '44px',
            justifyContent: 'center'
          }}
        >
          <ShoppingBag size={19} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'marketplace' ? 800 : 600 }}>Market</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'transparent',
            border: 'none',
            color: activeTab === 'matrix' ? '#0f172a' : '#94a3b8',
            cursor: 'pointer',
            padding: '4px 8px',
            minHeight: '44px',
            justifyContent: 'center'
          }}
        >
          <BarChart3 size={19} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'matrix' ? 800 : 600 }}>Matrix</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('profile')
            setIsSpecSheetMode(false)
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'transparent',
            border: 'none',
            color: activeTab === 'profile' ? '#0f172a' : '#94a3b8',
            cursor: 'pointer',
            padding: '4px 8px',
            minHeight: '44px',
            justifyContent: 'center'
          }}
        >
          <User size={19} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'profile' ? 800 : 600 }}>Profile</span>
        </button>
      </nav>

      {/* 5. Mobile Bottom Sheet Drawer */}
      <MobileBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        recipe={currentRecipe}
        metrics={metrics}
        onUpdateRecipe={setCurrentRecipe}
        onOpenSopCard={() => {
          setIsBottomSheetOpen(false)
          setIsBaristaCardOpen(true)
        }}
        onOpenMarketplace={() => {
          setIsBottomSheetOpen(false)
          setActiveTab('marketplace')
        }}
      />

      {/* Modals */}
      <BaristaCardModal
        isOpen={isBaristaCardOpen}
        onClose={() => setIsBaristaCardOpen(false)}
        recipe={currentRecipe}
        metrics={metrics}
      />

      <InvoiceOcrModal
        isOpen={isOcrOpen}
        onClose={() => setIsOcrOpen(false)}
        onApplyPriceUpdates={handleApplyPriceUpdates}
      />

      <TrendingCommunityHubModal
        isOpen={isTrendingModalOpen}
        onClose={() => setIsTrendingModalOpen(false)}
        trendingRecipes={trendingRecipes}
        onUpdateTrendingRecipes={setTrendingRecipes}
        currentRecipe={currentRecipe}
        onLoadRecipeIntoStudio={(recipeToLoad) => {
          setCurrentRecipe(recipeToLoad)
          setActiveTab('studio')
          setIsSpecSheetMode(false)
        }}
        onSaveRecipeToMenu={handleSaveToMenu}
      />
    </div>
  )
}
