import React, { useState, useEffect, useMemo } from 'react'
import { Header } from './components/Header'
import { DrinkVisualizer } from './components/DrinkVisualizer'
import { CostingEngine } from './components/CostingEngine'
import { SubRecipeManager } from './components/SubRecipeManager'
import { AiRenderStudio } from './components/AiRenderStudio'
import { Marketplace } from './components/Marketplace'
import { MenuMatrix } from './components/MenuMatrix'
import { BaristaCardModal } from './components/BaristaCardModal'
import { InvoiceOcrModal } from './components/InvoiceOcrModal'
import { DEFAULT_CATALOG, PACKAGING_ITEMS } from './data/defaultCatalog'
import { DEFAULT_SUB_RECIPES, calculateSubRecipeMetrics } from './data/defaultSubRecipes'
import { PRESET_RECIPES } from './data/presetRecipes'
import { calculateDrinkMetrics } from './types/physics'
import { Layers, Sparkles, ShoppingBag, BarChart3, Receipt, BookOpen, ChefHat } from 'lucide-react'

export function App() {
  const [activeVenue, setActiveVenue] = useState('coffee')
  const [activeTab, setActiveTab] = useState('recipe-lab')
  const [catalog, setCatalog] = useState(DEFAULT_CATALOG)
  const [subRecipes, setSubRecipes] = useState(DEFAULT_SUB_RECIPES)
  const [currentRecipe, setCurrentRecipe] = useState(PRESET_RECIPES[0])
  const [includeScrap, setIncludeScrap] = useState(true)

  // Modals
  const [isOcrOpen, setIsOcrOpen] = useState(false)
  const [isBaristaCardOpen, setIsBaristaCardOpen] = useState(false)

  // Update recipe when venue changes
  useEffect(() => {
    const venueRecipe = PRESET_RECIPES.find(r => r.venue === activeVenue)
    if (venueRecipe) {
      setCurrentRecipe(venueRecipe)
    }
  }, [activeVenue])

  // Get active packaging items
  const activePackagingItems = useMemo(() => {
    return PACKAGING_ITEMS.map(pkg => ({
      ...pkg,
      selected: (currentRecipe.packagingIds || []).includes(pkg.id)
    }))
  }, [currentRecipe.packagingIds])

  // Compute live physics, displacement, and true COGS metrics
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

  // Preset quick picker
  const handleLoadPreset = () => {
    const venuePresets = PRESET_RECIPES.filter(r => r.venue === activeVenue)
    const currentIndex = venuePresets.findIndex(r => r.id === currentRecipe.id)
    const nextPreset = venuePresets[(currentIndex + 1) % venuePresets.length] || PRESET_RECIPES[0]
    setCurrentRecipe(nextPreset)
  }

  // Handle OCR price sync
  const handleApplyPriceUpdates = (updatedItems) => {
    // 1. Update Catalog
    setCatalog(prevCatalog => {
      return prevCatalog.map(catItem => {
        const foundUpdate = updatedItems.find(u => u.skuId === catItem.id)
        if (foundUpdate) {
          return {
            ...catItem,
            unitCostPerMl: foundUpdate.newUnitCost,
            packPrice: foundUpdate.newPrice
          }
        }
        return catItem
      })
    })

    // 2. Update current recipe if affected
    setCurrentRecipe(prevRecipe => {
      const updatedLayers = prevRecipe.layers.map(layer => {
        const foundUpdate = updatedItems.find(u => u.skuId === layer.ingredientId)
        if (foundUpdate) {
          return {
            ...layer,
            unitCostPerMl: foundUpdate.newUnitCost
          }
        }
        return layer
      })
      return {
        ...prevRecipe,
        layers: updatedLayers
      }
    })
  }

  return (
    <div className="app-viewport" data-venue={activeVenue}>
      {/* Top Global Header */}
      <Header
        activeVenue={activeVenue}
        setActiveVenue={setActiveVenue}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenOcr={() => setIsOcrOpen(true)}
        onOpenBaristaCard={() => setIsBaristaCardOpen(true)}
        globalMarginPct={metrics.grossMarginPct}
      />

      {/* Main Workspace Layout */}
      <main className="workspace-grid">
        {/* Left Column: Live Visualizer Stage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <DrinkVisualizer
            metrics={metrics}
            recipe={currentRecipe}
            onEditLayer={(idx) => {}}
          />

          {/* Preset Selector Widget */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              Signature Drink Library
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {PRESET_RECIPES.map(p => {
                const isSelected = p.id === currentRecipe.id
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveVenue(p.venue)
                      setCurrentRecipe(p)
                    }}
                    style={{
                      background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 0, 0, 0.25)',
                      border: isSelected ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      color: isSelected ? '#fbbf24' : 'var(--text-secondary)'
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                        {p.venue.toUpperCase()} • ${p.menuPrice.toFixed(2)}
                      </div>
                    </div>
                    <span className="badge badge-info" style={{ fontSize: '0.62rem' }}>
                      {p.iceTypeId.toUpperCase()}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Tab Content */}
        <div>
          {activeTab === 'recipe-lab' && (
            <CostingEngine
              recipe={currentRecipe}
              catalog={catalog}
              subRecipes={subRecipes}
              metrics={metrics}
              includeScrap={includeScrap}
              setIncludeScrap={setIncludeScrap}
              onUpdateRecipe={setCurrentRecipe}
              onLoadPreset={handleLoadPreset}
            />
          )}

          {activeTab === 'sub-recipes' && (
            <SubRecipeManager
              subRecipes={subRecipes}
              catalog={catalog}
              onUpdateSubRecipes={setSubRecipes}
            />
          )}

          {activeTab === 'ai-studio' && (
            <AiRenderStudio
              recipe={currentRecipe}
              metrics={metrics}
            />
          )}

          {activeTab === 'marketplace' && (
            <Marketplace
              onAddToCart={() => {}}
            />
          )}

          {activeTab === 'menu-matrix' && (
            <MenuMatrix
              currentRecipe={currentRecipe}
              metrics={metrics}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-bar">
        <button
          className={`mobile-nav-item ${activeTab === 'recipe-lab' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipe-lab')}
        >
          <Layers size={18} />
          <span>Costing</span>
        </button>
        <button
          className={`mobile-nav-item ${activeTab === 'sub-recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('sub-recipes')}
        >
          <ChefHat size={18} />
          <span>Batches</span>
        </button>
        <button
          className={`mobile-nav-item ${activeTab === 'ai-studio' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-studio')}
        >
          <Sparkles size={18} />
          <span>AI Studio</span>
        </button>
        <button
          className={`mobile-nav-item ${activeTab === 'marketplace' ? 'active' : ''}`}
          onClick={() => setActiveTab('marketplace')}
        >
          <ShoppingBag size={18} />
          <span>Market</span>
        </button>
        <button
          className={`mobile-nav-item ${activeTab === 'menu-matrix' ? 'active' : ''}`}
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
