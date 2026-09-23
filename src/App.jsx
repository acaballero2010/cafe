import React, { useState, useEffect, useMemo } from 'react'
import { Header } from './components/Header'
import { BuildRecipePanel } from './components/BuildRecipePanel'
import { RealTimeCanvas } from './components/RealTimeCanvas'
import { ProfitSpecsPanel } from './components/ProfitSpecsPanel'
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
import { Layers, Sparkles, ShoppingBag, BarChart3, Receipt, BookOpen, ChefHat } from 'lucide-react'

export function App() {
  const [activeVenue, setActiveVenue] = useState('coffee')
  const [activeTab, setActiveTab] = useState('builder') // 'builder' | 'sub-recipes' | 'marketplace' | 'menu-matrix'
  const [isSpecSheetMode, setIsSpecSheetMode] = useState(false)
  const [catalog, setCatalog] = useState(DEFAULT_CATALOG)
  const [subRecipes, setSubRecipes] = useState(DEFAULT_SUB_RECIPES)
  const [currentRecipe, setCurrentRecipe] = useState(PRESET_RECIPES[0])
  const [includeScrap, setIncludeScrap] = useState(true)

  // Modals
  const [isOcrOpen, setIsOcrOpen] = useState(false)
  const [isBaristaCardOpen, setIsBaristaCardOpen] = useState(false)

  // Sync preset when venue changes
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

  // Compute live physics & economics
  const metrics = useMemo(() => {
    return calculateDrinkMetrics({
      vesselId: currentRecipe.vesselId,
      iceTypeId: currentRecipe.iceTypeId,
      layers: currentRecipe.layers,
      packagingItems: activePackagingItems,
      includeScrap: includeScrap,
      targetMarginPct: currentRecipe.targetMarginPct || 78,
      menuPrice: currentRecipe.menuPrice || 6.50
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
    <div className="app-container">
      {/* Top Header */}
      <Header
        activeVenue={activeVenue}
        setActiveVenue={setActiveVenue}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab)
          setIsSpecSheetMode(false)
        }}
        onOpenOcr={() => setIsOcrOpen(true)}
        onOpenBaristaCard={() => setIsBaristaCardOpen(true)}
        globalMarginPct={metrics.grossMarginPct}
      />

      {/* Main View Area */}
      <main style={{ padding: '20px' }}>
        {activeTab === 'builder' && (
          isSpecSheetMode ? (
            <SpecSheetView
              recipe={currentRecipe}
              metrics={metrics}
              onBackToBuilder={() => setIsSpecSheetMode(false)}
              onOpenMarketplace={() => setActiveTab('marketplace')}
            />
          ) : (
            /* 3-Column Clean Canvas Layout */
            <div className="workspace-three-col">
              {/* Column 1: Build Recipe (Inputs Only) */}
              <BuildRecipePanel
                recipe={currentRecipe}
                catalog={catalog}
                subRecipes={subRecipes}
                includeScrap={includeScrap}
                setIncludeScrap={setIncludeScrap}
                onUpdateRecipe={setCurrentRecipe}
                onLoadPreset={handleLoadPreset}
              />

              {/* Column 2: Real-Time Canvas (Visual Centerpiece) */}
              <RealTimeCanvas
                metrics={metrics}
                recipe={currentRecipe}
                onOpenSopCard={() => setIsBaristaCardOpen(true)}
              />

              {/* Column 3: Profit & Specs (Business Bottom Line) */}
              <ProfitSpecsPanel
                recipe={currentRecipe}
                metrics={metrics}
                onUpdateRecipe={setCurrentRecipe}
                onOpenSopCard={() => setIsBaristaCardOpen(true)}
                onOpenMarketplace={() => setActiveTab('marketplace')}
                onSwitchToSpecSheet={() => setIsSpecSheetMode(true)}
              />
            </div>
          )
        )}

        {activeTab === 'sub-recipes' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <SubRecipeManager
              subRecipes={subRecipes}
              catalog={catalog}
              onUpdateSubRecipes={setSubRecipes}
            />
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Marketplace onAddToCart={() => {}} />
          </div>
        )}

        {activeTab === 'menu-matrix' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <MenuMatrix
              currentRecipe={currentRecipe}
              metrics={metrics}
            />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-bar-clean">
        <button
          className={`mobile-nav-clean-item ${activeTab === 'builder' ? 'active' : ''}`}
          onClick={() => setActiveTab('builder')}
        >
          <Layers size={18} />
          <span>Studio</span>
        </button>
        <button
          className={`mobile-nav-clean-item ${activeTab === 'sub-recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('sub-recipes')}
        >
          <ChefHat size={18} />
          <span>Batches</span>
        </button>
        <button
          className={`mobile-nav-clean-item ${activeTab === 'marketplace' ? 'active' : ''}`}
          onClick={() => setActiveTab('marketplace')}
        >
          <ShoppingBag size={18} />
          <span>Market</span>
        </button>
        <button
          className={`mobile-nav-clean-item ${activeTab === 'menu-matrix' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu-matrix')}
        >
          <BarChart3 size={18} />
          <span>Matrix</span>
        </button>
      </nav>

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
