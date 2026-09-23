import React, { useState, useEffect, useMemo } from 'react'
import { MobileHeader } from './components/MobileHeader'
import { MobileRecipeBuilder } from './components/MobileRecipeBuilder'
import { MobileStickyBottomBar } from './components/MobileStickyBottomBar'
import { MobileBottomSheet } from './components/MobileBottomSheet'
import { SpecSheetView } from './components/SpecSheetView'
import { SubRecipeManager } from './components/SubRecipeManager'
import { Marketplace } from './components/Marketplace'
import { MenuMatrix } from './components/MenuMatrix'
import { BaristaCardModal } from './components/BaristaCardModal'
import { InvoiceOcrModal } from './components/InvoiceOcrModal'
import { DEFAULT_CATALOG, PACKAGING_ITEMS } from './data/defaultCatalog'
import { DEFAULT_SUB_RECIPES } from './data/defaultSubRecipes'
import { PRESET_RECIPES } from './data/presetRecipes'
import { calculateDrinkMetrics } from './types/physics'
import { Layers, ChefHat, ShoppingBag, BarChart3, Receipt, BookOpen } from 'lucide-react'

export function App() {
  const [activeVenue, setActiveVenue] = useState('coffee')
  const [activeTab, setActiveTab] = useState('studio') // 'studio' | 'batches' | 'marketplace' | 'matrix'
  const [isSpecSheetMode, setIsSpecSheetMode] = useState(false)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [catalog, setCatalog] = useState(DEFAULT_CATALOG)
  const [subRecipes, setSubRecipes] = useState(DEFAULT_SUB_RECIPES)
  const [currentRecipe, setCurrentRecipe] = useState(PRESET_RECIPES[0])
  const [includeScrap, setIncludeScrap] = useState(true)

  // Modals
  const [isOcrOpen, setIsOcrOpen] = useState(false)
  const [isBaristaCardOpen, setIsBaristaCardOpen] = useState(false)

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

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', color: '#111827', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Native Mobile Navigation Header & Category Carousel */}
      <MobileHeader
        activeVenue={activeVenue}
        setActiveVenue={setActiveVenue}
        onOpenSop={() => setIsBaristaCardOpen(true)}
        onOpenOcr={() => setIsOcrOpen(true)}
      />

      {/* 2. Main Scrollable Viewport */}
      <main style={{ flex: 1, padding: '16px 16px 140px', maxWidth: '680px', width: '100%', margin: '0 auto' }}>
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
          <Marketplace onAddToCart={() => {}} />
        )}

        {activeTab === 'matrix' && (
          <MenuMatrix
            currentRecipe={currentRecipe}
            metrics={metrics}
          />
        )}
      </main>

      {/* 3. Floating Sticky Bottom Bar (Active on Studio Tab) */}
      {activeTab === 'studio' && !isSpecSheetMode && (
        <MobileStickyBottomBar
          metrics={metrics}
          onOpenBottomSheet={() => setIsBottomSheetOpen(true)}
        />
      )}

      {/* 4. Native Mobile Bottom Navigation Bar */}
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
          padding: '6px 12px calc(6px + env(safe-area-inset-bottom))',
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
            color: activeTab === 'studio' ? '#451a03' : '#9ca3af',
            cursor: 'pointer',
            padding: '4px 10px'
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
            color: activeTab === 'batches' ? '#451a03' : '#9ca3af',
            cursor: 'pointer',
            padding: '4px 10px'
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
            color: activeTab === 'marketplace' ? '#451a03' : '#9ca3af',
            cursor: 'pointer',
            padding: '4px 10px'
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
            color: activeTab === 'matrix' ? '#451a03' : '#9ca3af',
            cursor: 'pointer',
            padding: '4px 10px'
          }}
        >
          <BarChart3 size={19} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'matrix' ? 800 : 600 }}>Matrix</span>
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
    </div>
  )
}
