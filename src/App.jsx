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
import { DrinkRepositoryModal } from './components/DrinkRepositoryModal'
import { FloatingActionDock } from './components/FloatingActionDock'
import { BeveragePhotoStudioModal } from './components/BeveragePhotoStudioModal'
import { BaristaSOPModal } from './components/BaristaSOPModal'
import { BatchYieldCalculatorModal } from './components/BatchYieldCalculatorModal'
import { AdminLoginModal } from './components/AdminLoginModal'
import { PlatformAdminPortal } from './components/PlatformAdminPortal'
import { CafeOnboardingWizardModal } from './components/CafeOnboardingWizardModal'
import { AuthDatabase } from './utils/authDatabase'
import { DEFAULT_CATALOG, PACKAGING_ITEMS } from './data/defaultCatalog'
import { DEFAULT_SUB_RECIPES } from './data/defaultSubRecipes'
import { PRESET_RECIPES } from './data/presetRecipes'
import { INITIAL_TRENDING_RECIPES } from './data/trendingRecipes'
import { calculateDrinkMetrics } from './types/physics'
import { triggerHaptic } from './utils/haptics'
import { NativeToast } from './components/NativeToast'
import { Layers, ChefHat, ShoppingBag, BarChart3, Receipt, BookOpen, User, Flame, FlaskConical, ShieldCheck } from 'lucide-react'

export function App() {
  const [currentUser, setCurrentUser] = useState(() => AuthDatabase.getCurrentUser())
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false)
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false)
  const [isOnboardingWizardOpen, setIsOnboardingWizardOpen] = useState(false)
  const [showPriceAlert, setShowPriceAlert] = useState(true)
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
  const [isRepositoryOpen, setIsRepositoryOpen] = useState(false)
  const [isPhotoStudioOpen, setIsPhotoStudioOpen] = useState(false)
  const [isSopModalOpen, setIsSopModalOpen] = useState(false)
  const [isYieldModalOpen, setIsYieldModalOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('pourcraft_theme') === 'dark')
  const [toast, setToast] = useState(null)

  const showToast = (message, subtext = '', type = 'success', duration = 3000) => {
    setToast({ message, subtext, type, duration })
  }

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
    localStorage.setItem('pourcraft_theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

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
    triggerHaptic('selection')
    const venuePresets = PRESET_RECIPES.filter(r => r.venue === activeVenue)
    const currentIndex = venuePresets.findIndex(r => r.id === currentRecipe.id)
    const nextPreset = venuePresets[(currentIndex + 1) % venuePresets.length] || PRESET_RECIPES[0]
    setCurrentRecipe(nextPreset)
    showToast(`Swapped to ${nextPreset.name}`, `${nextPreset.volumeOz || 16}oz • ₱${nextPreset.menuPrice?.toFixed(2)}`, 'sparkle')
  }

  const handleApplyPriceUpdates = (updatedItems) => {
    triggerHaptic('success')
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
    showToast('Catalog Costs Updated', 'Live COGS recalculated across recipes', 'success')
  }

  const handleCreateNewBatch = () => {
    triggerHaptic('tap')
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
    showToast('New Batch Prep Initialized', '1,000ml yield formulation ready', 'success')
  }

  const handleSaveToMenu = (recipeOrMenu, isNewMenu = false, targetMenuId = null) => {
    triggerHaptic('success')
    if (isNewMenu) {
      setSavedMenus(prev => [recipeOrMenu, ...prev])
      showToast('New R&D Lineup Created', recipeOrMenu.title, 'success')
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
      showToast('Formulation Saved to R&D Lab', recipeOrMenu.name || 'Active Recipe', 'success')
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
        currentUser={currentUser}
        onOpenRegion={() => setIsRegionModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onCreateBatch={handleCreateNewBatch}
        onOpenSop={() => setIsBaristaCardOpen(true)}
        onOpenOcr={() => setIsOcrOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        onOpenTrending={() => setIsTrendingModalOpen(true)}
        onOpenRepository={() => setIsRepositoryOpen(true)}
      />

      {/* 2. Main Scrollable Container with 160px Bottom Scroll Clearance */}
      <main style={{ flex: 1, padding: '16px 16px 160px', maxWidth: '680px', width: '100%', margin: '0 auto' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Supplier Price Shift & Margin Impact Alert Card (Market Page Only) */}
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
                  // Already on marketplace
                }}
                onAcceptMargins={() => {
                  // Updates catalog unit cost for fresh milk
                  setCatalog(prev => prev.map(item => item.id.includes('milk') ? { ...item, unitCostPerMl: 0.110 } : item))
                }}
                onDismiss={() => setShowPriceAlert(false)}
              />
            )}
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
          </div>
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
            currentUser={currentUser}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
            onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
            onOpenOnboardingWizard={() => setIsOnboardingWizardOpen(true)}
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
          background: isDarkMode ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderTop: isDarkMode ? '1px solid #1e293b' : '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '6px 8px calc(6px + env(safe-area-inset-bottom))',
          maxWidth: '680px',
          margin: '0 auto'
        }}
      >
        <button
          onClick={() => {
            triggerHaptic('tap')
            setActiveTab('studio')
            setIsSpecSheetMode(false)
          }}
          className="mobile-nav-clean-item"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'transparent',
            border: 'none',
            color: activeTab === 'studio' ? (isDarkMode ? '#38bdf8' : '#0f172a') : (isDarkMode ? '#64748b' : '#94a3b8'),
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
          onClick={() => {
            triggerHaptic('tap')
            setActiveTab('batches')
          }}
          className="mobile-nav-clean-item"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'transparent',
            border: 'none',
            color: activeTab === 'batches' ? (isDarkMode ? '#38bdf8' : '#0f172a') : (isDarkMode ? '#64748b' : '#94a3b8'),
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
          onClick={() => {
            triggerHaptic('tap')
            setActiveTab('marketplace')
          }}
          className="mobile-nav-clean-item"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'transparent',
            border: 'none',
            color: activeTab === 'marketplace' ? (isDarkMode ? '#38bdf8' : '#0f172a') : (isDarkMode ? '#64748b' : '#94a3b8'),
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
          onClick={() => {
            triggerHaptic('tap')
            setActiveTab('matrix')
          }}
          className="mobile-nav-clean-item"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'transparent',
            border: 'none',
            color: activeTab === 'matrix' ? (isDarkMode ? '#38bdf8' : '#0f172a') : (isDarkMode ? '#64748b' : '#94a3b8'),
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
            triggerHaptic('tap')
            setActiveTab('profile')
            setIsSpecSheetMode(false)
          }}
          className="mobile-nav-clean-item"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'transparent',
            border: 'none',
            color: activeTab === 'profile' ? (isDarkMode ? '#38bdf8' : '#0f172a') : (isDarkMode ? '#64748b' : '#94a3b8'),
            cursor: 'pointer',
            padding: '4px 8px',
            minHeight: '44px',
            justifyContent: 'center'
          }}
        >
          <FlaskConical size={19} />
          <span style={{ fontSize: '0.68rem', fontWeight: activeTab === 'profile' ? 800 : 600 }}>R&D Lab</span>
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
          showToast(`Loaded ${recipeToLoad.name}`, 'Swapped active recipe in Studio', 'sparkle')
        }}
        onSaveRecipeToMenu={handleSaveToMenu}
      />

      <DrinkRepositoryModal
        isOpen={isRepositoryOpen}
        onClose={() => setIsRepositoryOpen(false)}
        onLoadRecipeIntoStudio={(recipeToLoad) => {
          setCurrentRecipe(recipeToLoad)
          setActiveTab('studio')
          setIsSpecSheetMode(false)
          showToast(`Cloned ${recipeToLoad.name}`, 'Swapped active recipe in Studio', 'sparkle')
        }}
        onSaveRecipeToMenu={handleSaveToMenu}
      />

      {/* Floating Thumb Quick Action Dock */}
      <FloatingActionDock
        onOpenStudio={() => setIsPhotoStudioOpen(true)}
        onOpenSop={() => setIsSopModalOpen(true)}
        onOpenYield={() => setIsYieldModalOpen(true)}
        onOpenRepo={() => setIsRepositoryOpen(true)}
        onOpenTrending={() => setIsTrendingModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => {
          const nextMode = !isDarkMode
          setIsDarkMode(nextMode)
          showToast(nextMode ? '🌙 Barista Night Mode' : '☀️ High-Contrast Day Mode', 'Visual theme switched', 'info', 2000)
        }}
      />

      <BeveragePhotoStudioModal
        isOpen={isPhotoStudioOpen}
        onClose={() => setIsPhotoStudioOpen(false)}
        recipe={currentRecipe}
        metrics={metrics}
      />

      <BaristaSOPModal
        isOpen={isSopModalOpen}
        onClose={() => setIsSopModalOpen(false)}
        recipe={currentRecipe}
        metrics={metrics}
      />

      <BatchYieldCalculatorModal
        isOpen={isYieldModalOpen}
        onClose={() => setIsYieldModalOpen(false)}
        recipe={currentRecipe}
        metrics={metrics}
      />

      {/* Admin Authentication & Persona Switcher Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user)
          showToast(`Logged in as ${user.name}`, `${user.shopName} • ${user.role}`, 'success')
        }}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        onOpenOnboardingWizard={() => setIsOnboardingWizardOpen(true)}
      />

      {/* Platform Admin Console & Supplier Pricelist Uploader */}
      <PlatformAdminPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        currentUser={currentUser}
        onPublishPricelistUpdates={(updates, supplierName) => {
          handleApplyPriceUpdates(updates)
          setShowPriceAlert(true)
          showToast(`Broadcasted ${supplierName} Pricelist`, `Updated ${updates.length} SKUs across wholesale catalog`, 'sparkle')
        }}
        onSwitchUser={(user) => {
          setCurrentUser(user)
          AuthDatabase.setCurrentUser(user)
          showToast(`Switched to ${user.name}`, user.shopName, 'info')
        }}
      />

      {/* 4-Step Commercial Cafe Onboarding Wizard */}
      <CafeOnboardingWizardModal
        isOpen={isOnboardingWizardOpen}
        onClose={() => setIsOnboardingWizardOpen(false)}
        onCompleteOnboarding={(data) => {
          const updatedUser = {
            ...currentUser,
            shopName: data.shopName,
            branch: data.branchLocation,
            region: data.region,
            name: data.ownerName
          }
          setCurrentUser(updatedUser)
          AuthDatabase.setCurrentUser(updatedUser)
          AuthDatabase.updateUser(updatedUser.id, updatedUser)

          setActiveRegion(data.region)
          setIncludeScrap(data.includeWasteScrap)

          if (data.seedRecipes && data.seedRecipes.length > 0) {
            setCurrentRecipe(data.seedRecipes[0])

            const newSeededMenu = {
              id: `menu-${Date.now()}`,
              title: `✨ ${data.shopName} Launch Lineup`,
              description: `Target ${data.targetMarginPct}% Gross Margin • Commercial Formulations`,
              season: 'Launch Season',
              updatedAt: 'Just now',
              drinks: data.seedRecipes
            }
            setSavedMenus(prev => [newSeededMenu, ...prev])
          }

          showToast(`Welcome, ${data.shopName}!`, `Seeded ${data.seedRecipes.length} formulations with ${data.targetMarginPct}% margin`, 'sparkle', 4000)
        }}
      />

      {/* Native Mobile Toast HUD / Dynamic Island System */}
      <NativeToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}
