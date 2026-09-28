import React, { useState } from 'react'
import { Plus, Minus, GripVertical, Package, Sparkles, Sliders, ChevronDown, ChevronUp, Link2, Search, FolderPlus, BookmarkCheck, Check, X, Camera, RefreshCw, BookOpen, Lightbulb, Trash2, Edit3, Wrench, Flame, Star, MessageSquare, FileText, Scale, ShoppingBag, GitFork } from 'lucide-react'
import { VESSELS } from '../types/physics'
import { PACKAGING_ITEMS } from '../data/defaultCatalog'
import { calculateSubRecipeMetrics } from '../data/defaultSubRecipes'
import { IngredientSupplierPickerModal } from './IngredientSupplierPickerModal'
import { IngredientAffiliateSourcingModal } from './IngredientAffiliateSourcingModal'
import { AiRecipeGeneratorModal } from './AiRecipeGeneratorModal'
import { DrinkDiscoveryModal } from './DrinkDiscoveryModal'
import { BeveragePhotoStudioModal } from './BeveragePhotoStudioModal'
import { BenchmarkRecipesCarousel } from './BenchmarkRecipesCarousel'
import { CommunityReviewsSection } from './CommunityReviewsSection'
import { TrendingCommunityHubModal } from './TrendingCommunityHubModal'
import { SensoryFlavorRadar } from './SensoryFlavorRadar'
import { CostBreakdownRing } from './CostBreakdownRing'
import { BaristaSOPModal } from './BaristaSOPModal'
import { BatchYieldCalculatorModal } from './BatchYieldCalculatorModal'
import { DrinkRepositoryModal } from './DrinkRepositoryModal'
import { SaveVariationModal } from './SaveVariationModal'
import { MultiCupScalerPanel } from './MultiCupScalerPanel'
import { DeliveryMarginSimulator } from './DeliveryMarginSimulator'
import { PriceSurgeSimulatorModal } from './PriceSurgeSimulatorModal'
import { RecipeIterationHistoryModal } from './RecipeIterationHistoryModal'
import { IngredientTierSelectorCard } from './IngredientTierSelectorCard'
import { SkuSwapModal } from './SkuSwapModal'
import { CostComputationModal } from './CostComputationModal'
import { RecipeSummarySaveCard } from './RecipeSummarySaveCard'

export function MobileRecipeBuilder({
  recipe,
  catalog,
  subRecipes = [],
  includeScrap,
  setIncludeScrap,
  onUpdateRecipe,
  onLoadPreset,
  savedMenus = [],
  onSaveToMenu = () => {},
  trendingRecipes = [],
  onUpdateTrendingRecipes = () => {},
  onOpenTrending = () => {},
  currentUser
}) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showPackagingModal, setShowPackagingModal] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [activePickerLayerIndex, setActivePickerLayerIndex] = useState(null)
  const [pickerTargetPortion, setPickerTargetPortion] = useState(200)
  const [isAiGenOpen, setIsAiGenOpen] = useState(false)
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false)
  const [isRepositoryModalOpen, setIsRepositoryModalOpen] = useState(false)
  const [isPhotoStudioOpen, setIsPhotoStudioOpen] = useState(false)
  const [isTrendingHubOpen, setIsTrendingHubOpen] = useState(false)
  const [isSaveMenuModalOpen, setIsSaveMenuModalOpen] = useState(false)
  const [isSopModalOpen, setIsSopModalOpen] = useState(false)
  const [isYieldModalOpen, setIsYieldModalOpen] = useState(false)
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false)
  const [activeAffiliateIngredient, setActiveAffiliateIngredient] = useState(null)
  const [isMultiCupOpen, setIsMultiCupOpen] = useState(false)
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false)
  const [isSurgeOpen, setIsSurgeOpen] = useState(false)
  const [isVersionOpen, setIsVersionOpen] = useState(false)
  const [isCostModalOpen, setIsCostModalOpen] = useState(false)
  const [isBrandSwapModalOpen, setIsBrandSwapModalOpen] = useState(false)
  const [activeSwapLayerIndex, setActiveSwapLayerIndex] = useState(null)
  const [recipeVersionTag, setRecipeVersionTag] = useState(recipe.version || 'v1.0')
  const [recipeStatus, setRecipeStatus] = useState(recipe.status || 'rnd') // 'rnd' | 'menu'
  const [selectedTargetMenuId, setSelectedTargetMenuId] = useState(savedMenus[0]?.id || 'new')
  const [newMenuTitleInput, setNewMenuTitleInput] = useState('')
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('')
  const [newStepText, setNewStepText] = useState('')
  const [isAddingStep, setIsAddingStep] = useState(false)
  const [editingStepIndex, setEditingStepIndex] = useState(null)

  const handleOpenAffiliateModal = (layer, idx) => {
    setActiveAffiliateIngredient({
      id: layer.ingredientId || layer.id,
      name: layer.name,
      unitCostPerMl: layer.unitCostPerMl,
      packSize: layer.packSize,
      supplier: layer.supplier,
      layerIndex: idx
    })
    setIsAffiliateModalOpen(true)
  }

  const handleApplyAffiliatePriceToLayer = (data) => {
    if (activeAffiliateIngredient && activeAffiliateIngredient.layerIndex !== undefined) {
      const idx = activeAffiliateIngredient.layerIndex
      const updated = [...recipe.layers]
      if (updated[idx]) {
        updated[idx] = {
          ...updated[idx],
          unitCostPerMl: data.unitCostPerMl || updated[idx].unitCostPerMl,
          supplier: data.supplier || updated[idx].supplier
        }
        onUpdateRecipe({ ...recipe, layers: updated })
      }
    }
  }

  const handleAddSopStep = (stepText) => {
    if (!stepText.trim()) return
    const currentSteps = recipe.sopSteps && recipe.sopSteps.length > 0 
      ? recipe.sopSteps 
      : [
          'Pump base syrup/flavoring into vessel or shaker.',
          'Extract espresso shot or steep tea base.',
          'Add calibrated ice and shake or stir evenly.',
          'Top off with fresh milk or foam to rim line.'
        ]
    onUpdateRecipe({ ...recipe, sopSteps: [...currentSteps, stepText.trim()] })
    setNewStepText('')
    setIsAddingStep(false)
  }

  const handleUpdateSopStep = (idx, updatedText) => {
    const currentSteps = [...(recipe.sopSteps || [
      'Pump base syrup/flavoring into vessel or shaker.',
      'Extract espresso shot or steep tea base.',
      'Add calibrated ice and shake or stir evenly.',
      'Top off with fresh milk or foam to rim line.'
    ])]
    currentSteps[idx] = updatedText
    onUpdateRecipe({ ...recipe, sopSteps: currentSteps })
  }

  const handleDeleteSopStep = (idx) => {
    const currentSteps = (recipe.sopSteps || [
      'Pump base syrup/flavoring into vessel or shaker.',
      'Extract espresso shot or steep tea base.',
      'Add calibrated ice and shake or stir evenly.',
      'Top off with fresh milk or foam to rim line.'
    ]).filter((_, i) => i !== idx)
    onUpdateRecipe({ ...recipe, sopSteps: currentSteps })
  }

  const handleUpdateProTip = (tipText) => {
    onUpdateRecipe({ ...recipe, proTips: tipText, baristaNotes: tipText })
  }

  const handleApplySupplierSwap = (data) => {
    if (activePickerLayerIndex !== null && recipe.layers[activePickerLayerIndex]) {
      const updated = [...recipe.layers]
      updated[activePickerLayerIndex] = {
        ...updated[activePickerLayerIndex],
        name: data.name || data.supplierSku?.brand || updated[activePickerLayerIndex].name,
        unitCostPerMl: data.unitCostPerMl || data.supplierSku?.unitCostPerMl || updated[activePickerLayerIndex].unitCostPerMl,
        ingredientId: data.supplierSku?.id || updated[activePickerLayerIndex].ingredientId
      }
      onUpdateRecipe({ ...recipe, layers: updated })
      setActivePickerLayerIndex(null)
    }
  }

  const vesselPills = [
    { id: 'cold-16oz', label: '16oz Cold', sub: '473ml' },
    { id: 'boba-20oz', label: '20oz Boba', sub: '591ml' },
    { id: 'hot-12oz', label: '12oz Hot', sub: '355ml' },
    { id: 'coupe-7oz', label: '7oz Coupe', sub: '210ml' }
  ]

  const iceSegments = [
    { id: 'standard', label: 'Regular Ice' },
    { id: 'light', label: 'Less Ice' },
    { id: 'none', label: 'No Ice' }
  ]

  const currentVessel = VESSELS.find(v => v.id === recipe.vesselId) || VESSELS[0]

  const handleVesselSelect = (vesselId) => {
    let defaultPackaging = ['cup-16oz-pet', 'lid-sip-cold']
    if (vesselId.includes('boba')) {
      defaultPackaging = ['cup-16oz-pet', 'lid-dome-boba', 'boba-bamboo-straw']
    } else if (vesselId.includes('coupe')) {
      defaultPackaging = ['cocktail-garnish-pick']
    }
    onUpdateRecipe({ ...recipe, vesselId, packagingIds: defaultPackaging })
  }

  const handleStepVolume = (idx, delta) => {
    const updated = [...recipe.layers]
    const currentVol = Number(updated[idx].volumeMl || 0)
    updated[idx] = {
      ...updated[idx],
      volumeMl: Math.max(0, currentVol + delta)
    }
    onUpdateRecipe({ ...recipe, layers: updated })
  }

  const handleToggleTopOff = (idx) => {
    const updated = recipe.layers.map((l, i) => ({ ...l, isTopOff: i === idx }))
    onUpdateRecipe({ ...recipe, layers: updated })
  }

  const handleAddLayer = (value) => {
    if (!value) return

    if (value.startsWith('sub:')) {
      const subId = value.replace('sub:', '')
      const sub = subRecipes.find(s => s.id === subId)
      if (!sub) return

      const subM = calculateSubRecipeMetrics(sub, catalog)
      const newLayer = {
        id: `layer-sub-${Date.now()}`,
        isSubRecipe: true,
        subRecipeId: sub.id,
        ingredientId: sub.id,
        name: sub.name,
        volumeMl: sub.yieldUom === 'g' ? 60 : 50,
        unitCostPerMl: subM.effectiveUnitCost,
        colorHex: sub.colorHex || '#160802',
        densityBrix: sub.densityBrix || 50,
        scrapType: 'boba_pearls',
        isTopOff: false,
        layerType: sub.yieldUom === 'g' ? 'bottom_boba' : 'top_foam'
      }
      onUpdateRecipe({ ...recipe, layers: [...recipe.layers, newLayer] })
      setShowAddMenu(false)
      return
    }

    const item = catalog.find(c => c.id === value)
    if (!item) return

    const newLayer = {
      id: `layer-${Date.now()}`,
      ingredientId: item.id,
      name: item.name,
      brand: item.brand || item.supplier || 'Specialty Catalog',
      tier: item.tier || 'signature',
      supplier: item.supplier,
      volumeMl: item.category === 'milk' || item.category === 'tea' ? 0 : 30,
      unitCostPerMl: item.unitCostPerMl,
      colorHex: item.colorHex || '#f59e0b',
      densityBrix: item.densityBrix || 10,
      scrapType: item.scrapType || 'standard',
      isTopOff: item.category === 'milk' || item.category === 'tea',
      layerType: item.layerType || 'liquid'
    }

    let updated = [...recipe.layers]
    if (newLayer.isTopOff) {
      updated = updated.map(l => ({ ...l, isTopOff: false }))
    }
    updated.push(newLayer)
    onUpdateRecipe({ ...recipe, layers: updated, ingredientTier: 'hybrid' })
    setShowAddMenu(false)
  }

  // Clean, concise portion stepper string without redundancy
  const getPortionLabel = (layer) => {
    if (layer.isTopOff) return 'Top-Off'
    const vol = layer.volumeMl || 0
    if (layer.layerType === 'espresso' || layer.ingredientId?.includes('espresso')) {
      const shots = Math.round(vol / 18)
      return `${shots || 2} shots (${vol}ml)`
    }
    if (layer.layerType === 'dense_syrup' || layer.ingredientId?.includes('syrup')) {
      const pumps = (vol / 12.5).toFixed(1).replace('.0', '')
      return `${pumps} pumps (${vol}ml)`
    }
    return `${vol}ml`
  }

  // Clean layer name without embedded measurement noise
  const getCleanName = (name) => {
    return name.replace(/\s*\([^)]*\)/g, '').trim()
  }

  // Clean metadata subtext
  const getLayerSubtext = (idx, total, isTopOff) => {
    if (idx === 0) return 'Layer 1 • Base foundation'
    if (isTopOff || idx === total - 1) return `Layer ${idx + 1} • Crown top-off`
    return `Layer ${idx + 1} • Middle stratum`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', margin: '0 auto' }}>
      
      {/* 1. Executive Recipe Summary, Live Costing & Instant Save Card */}
      <RecipeSummarySaveCard
        recipe={recipe}
        onUpdateRecipe={onUpdateRecipe}
        onSaveRecipe={(updated) => {
          if (onSaveToMenu) {
            onSaveToMenu(updated)
          }
        }}
        onOpenSaveModal={() => setIsSaveMenuModalOpen(true)}
        onOpenCostInspector={() => setIsCostModalOpen(true)}
        onOpenSopModal={() => setIsSopModalOpen(true)}
      />

      {/* Streamlined Secondary R&D Utilities Strip (Collapsible / Non-intrusive) */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '10px 14px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsRepositoryModalOpen(true)}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <BookOpen size={13} color="#2563eb" />
            <span>Recipe Repo</span>
          </button>

          <button
            onClick={() => setIsPhotoStudioOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              border: 'none',
              color: '#ffffff',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 4px rgba(236, 72, 153, 0.2)'
            }}
          >
            <Camera size={13} color="#ffffff" />
            <span>Photo 8K</span>
          </button>

          <button
            onClick={() => setIsSopModalOpen(true)}
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              color: '#0369a1',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <FileText size={13} color="#0284c7" />
            <span>Barista SOP</span>
          </button>

          <button
            onClick={() => setIsYieldModalOpen(true)}
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Scale size={13} color="#16a34a" />
            <span>Yield</span>
          </button>
        </div>

        {/* Dropdown for Advanced Simulators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setIsMultiCupOpen(true)}
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#475569',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.70rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
            title="Auto-scale recipe across 12oz, 16oz, 22oz"
          >
            <span>📐 Multi-Cup</span>
          </button>

          <button
            onClick={() => setIsDeliveryOpen(true)}
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#475569',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.70rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
            title="GrabFood / FoodPanda delivery margin simulator"
          >
            <span>🛵 Delivery %</span>
          </button>

          <button
            onClick={() => setIsSurgeOpen(true)}
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#475569',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.70rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
            title="Price inflation stress test"
          >
            <span>🔥 Surge</span>
          </button>

          <button
            onClick={() => setIsVersionOpen(true)}
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#475569',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.70rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
            title="R&D Version lineage comparison"
          >
            <span>🔬 History</span>
          </button>
        </div>
      </div>

      {/* Save Formulation & Variation Lineage Modal */}
      <SaveVariationModal
        isOpen={isSaveMenuModalOpen}
        onClose={() => setIsSaveMenuModalOpen(false)}
        recipe={recipe}
        onUpdateRecipe={onUpdateRecipe}
        savedMenus={savedMenus}
        onSaveToMenu={onSaveToMenu}
        onPublishToCommunity={(communityRecipe) => {
          onUpdateTrendingRecipes([communityRecipe, ...trendingRecipes])
        }}
        currentUser={currentUser}
      />

      {/* Multi-Cup Sizing Modal */}
      {isMultiCupOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{ width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', borderRadius: '20px', padding: '16px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <button
                type="button"
                onClick={() => setIsMultiCupOpen(false)}
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>
            <MultiCupScalerPanel
              recipe={recipe}
              onApplyScaledRecipe={(scaled) => {
                onUpdateRecipe(scaled)
                setIsMultiCupOpen(false)
              }}
              targetMarginPct={75}
            />
          </div>
        </div>
      )}

      {/* Delivery Margin Simulator Modal */}
      {isDeliveryOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{ width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', borderRadius: '20px', padding: '16px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <button
                type="button"
                onClick={() => setIsDeliveryOpen(false)}
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>
            <DeliveryMarginSimulator
              recipe={recipe}
              baseCogs={recipe.layers?.reduce((s, l) => s + ((l.volumeMl || 0) * (l.unitCostPerMl || 0.15)), 0) + 10}
              basePrice={recipe.menuPrice || recipe.price || 180}
              targetMarginPct={75}
            />
          </div>
        </div>
      )}

      {/* Price Surge Stress-Test Modal */}
      <PriceSurgeSimulatorModal
        isOpen={isSurgeOpen}
        onClose={() => setIsSurgeOpen(false)}
        recipes={[recipe]}
        catalog={catalog}
      />

      {/* Recipe Iteration History Modal */}
      <RecipeIterationHistoryModal
        isOpen={isVersionOpen}
        onClose={() => setIsVersionOpen(false)}
        recipe={recipe}
        onUpdateRecipe={onUpdateRecipe}
        currentUser={currentUser}
      />

      {/* Multi-Brand SKU Swap Modal */}
      {isBrandSwapModalOpen && activeSwapLayerIndex !== null && recipe.layers[activeSwapLayerIndex] && (
        <SkuSwapModal
          isOpen={isBrandSwapModalOpen}
          onClose={() => {
            setIsBrandSwapModalOpen(false)
            setActiveSwapLayerIndex(null)
          }}
          layer={recipe.layers[activeSwapLayerIndex]}
          layerIndex={activeSwapLayerIndex}
          catalog={catalog}
          recipePrice={recipe.menuPrice || 180}
          onSelectBrand={(updatedLayer) => {
            const updated = [...recipe.layers]
            updated[activeSwapLayerIndex] = updatedLayer
            onUpdateRecipe({
              ...recipe,
              ingredientTier: 'hybrid',
              layers: updated
            })
            setIsBrandSwapModalOpen(false)
            setActiveSwapLayerIndex(null)
          }}
        />
      )}

      {/* Transparent Cost Formula & Margin Computation Inspector Modal */}
      <CostComputationModal
        isOpen={isCostModalOpen}
        onClose={() => setIsCostModalOpen(false)}
        recipe={recipe}
      />


      {/* 2. Compact Serving Specification Bar (Cup Vessel + Ice Ratio in 1 Sleek Row) */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '12px 16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      }}>
        {/* Left: Vessel Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
            🥤 Cup Size:
          </span>
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
            {vesselPills.map(v => {
              const isSelected = recipe.vesselId === v.id
              return (
                <button
                  key={v.id}
                  onClick={() => handleVesselSelect(v.id)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                    background: isSelected ? '#0f172a' : '#f8fafc',
                    color: isSelected ? '#ffffff' : '#475569',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{v.label}</span>
                  <span style={{ fontSize: '0.64rem', opacity: 0.8 }}>({v.sub})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Ice Level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
            🧊 Ice:
          </span>
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '2px', borderRadius: '8px', gap: '2px' }}>
            {iceSegments.map(seg => {
              const isSelected = recipe.iceTypeId === seg.id
              return (
                <button
                  key={seg.id}
                  onClick={() => onUpdateRecipe({ ...recipe, iceTypeId: seg.id })}
                  style={{
                    padding: '5px 9px',
                    borderRadius: '6px',
                    border: 'none',
                    background: isSelected ? '#ffffff' : 'transparent',
                    color: isSelected ? '#0f172a' : '#64748b',
                    fontSize: '0.72rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  {seg.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3.5 Intelligent Quality & Ingredient Tier Presets (Value / Signature / Artisanal) */}
      <IngredientTierSelectorCard
        recipe={recipe}
        catalog={catalog}
        onUpdateRecipe={onUpdateRecipe}
      />

      {/* 4. Streamlined Recipe Build Order (Balanced 2-Row Layout, No Squishing!) */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '18px 20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Recipe Build Order
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsCostModalOpen(true)}
              style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                color: '#0369a1',
                fontSize: '0.70rem',
                fontWeight: 800,
                padding: '4px 8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
              title="View mathematical COGS formula, pack yields, and target margin calculations"
            >
              <FileText size={12} color="#0284c7" />
              <span>How Cost is Computed</span>
            </button>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>
              {recipe.layers.length} Layers
            </span>
          </div>
        </div>

        {/* List of 2-Row Ingredient Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recipe.layers.map((layer, idx) => (
            <div
              key={layer.id || idx}
              style={{
                background: layer.isTopOff ? '#f0fdf4' : '#ffffff',
                border: `1px solid ${layer.isTopOff ? '#bbf7d0' : '#e2e8f0'}`,
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}
            >
              {/* Row 1: Number Badge + Clean Ingredient Name + Tier Tag + Drag Handle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: layer.colorHex || '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}
                  >
                    {idx + 1}
                  </div>

                  <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {getCleanName(layer.name)}
                  </span>

                  {/* Quality Tier Indicator Pill */}
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: '800',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: layer.isSubRecipe ? '#fef3c7' : layer.tier === 'artisanal' ? '#faf5ff' : layer.tier === 'value' ? '#f0f9ff' : '#ecfdf5',
                    color: layer.isSubRecipe ? '#b45309' : layer.tier === 'artisanal' ? '#7e22ce' : layer.tier === 'value' ? '#0284c7' : '#059669',
                    border: `1px solid ${layer.isSubRecipe ? '#fde68a' : layer.tier === 'artisanal' ? '#e9d5ff' : layer.tier === 'value' ? '#bae6fd' : '#a7f3d0'}`,
                    whiteSpace: 'nowrap'
                  }}>
                    {layer.isSubRecipe ? '✨ BATCH PREP' : layer.tier === 'artisanal' ? '👑 ARTISANAL' : layer.tier === 'value' ? '⚡ VALUE' : '⚖️ SIGNATURE'}
                  </span>
                </div>

                {/* Drag Handle Icon (⋮⋮) */}
                <div style={{ color: '#94a3b8', cursor: 'grab', padding: '4px 2px', display: 'flex', alignItems: 'center' }} title="Reorder Sequence">
                  <GripVertical size={18} />
                </div>
              </div>

              {/* Row 2: Brand/Supplier Subtitle (Left) + Compact Stepper (Right) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingTop: '2px' }}>
                <div style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#64748b' }}>🏷️ Brand:</span>
                  <span style={{ color: '#0f172a', fontWeight: 700 }}>{layer.brand || layer.supplier || 'Specialty Benchmark'}</span>
                  <span style={{ color: '#94a3b8' }}>• ₱{(layer.unitCostPerMl || 0).toFixed(3)}/ml</span>
                </div>

                {/* Stepper Pill or Top-Off Button */}
                {!layer.isTopOff ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      padding: '2px',
                      border: '1px solid #cbd5e1'
                    }}
                  >
                    <button
                      onClick={() => handleStepVolume(idx, -5)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#334155',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}
                      aria-label="Decrease volume"
                    >
                      <Minus size={13} />
                    </button>

                    <div style={{ minWidth: '95px', textAlign: 'center', fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', padding: '0 6px', fontFamily: 'var(--font-mono)' }}>
                      {getPortionLabel(layer)}
                    </div>

                    <button
                      onClick={() => handleStepVolume(idx, 5)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#334155',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}
                      aria-label="Increase volume"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleToggleTopOff(idx)}
                    style={{
                      background: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      minHeight: '34px'
                    }}
                  >
                    Top-Off Liquid
                  </button>
                )}
              </div>

              {/* Row 3: Supplier SKU Info & Instant "Swap Vendor" Action */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px dashed #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#64748b' }}>
                  <span style={{ fontSize: '0.66rem', background: layer.isSubRecipe ? '#fef3c7' : '#f1f5f9', color: layer.isSubRecipe ? '#b45309' : '#475569', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>
                    {layer.isSubRecipe ? 'HOUSE PREP BATCH' : 'WHOLESALE SKU'}
                  </span>
                  <button
                    onClick={() => setIsCostModalOpen(true)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      fontWeight: 700,
                      color: '#0f172a',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                    title="Click to view full calculation breakdown"
                  >
                    <span>₱{((layer.unitCostPerMl || 0.1) * (layer.volumeMl || 30)).toFixed(2)} portion cost</span>
                    <span style={{ color: '#0284c7', fontSize: '0.68rem' }}>ℹ️</span>
                  </button>
                </div>

                {!layer.isSubRecipe && (
                  <button
                    onClick={() => {
                      setActiveSwapLayerIndex(idx)
                      setIsBrandSwapModalOpen(true)
                    }}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.70rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                    }}
                    title="Swap ingredient brand and compare live pricing differences"
                  >
                    <RefreshCw size={11} color="#0284c7" />
                    <span>Swap Brand / SKU</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 3. Add Layer & Link Supplier Buttons */}
        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {!showAddMenu ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowAddMenu(true)}
                style={{
                  flex: 1,
                  height: '48px',
                  borderRadius: '14px',
                  border: '2px dashed #cbd5e1',
                  background: '#f8fafc',
                  color: '#475569',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Plus size={16} />
                <span>+ Add Layer / Brand SKU</span>
              </button>

              <button
                onClick={() => {
                  setPickerTargetPortion(200)
                  setIsPickerOpen(true)
                }}
                style={{
                  height: '48px',
                  padding: '0 14px',
                  borderRadius: '14px',
                  border: '1px solid #fed7aa',
                  background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                  color: '#b45309',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 1px 3px rgba(217, 119, 6, 0.08)'
                }}
                title="Link custom B2B supplier price or marketplace vendor"
              >
                <Link2 size={15} />
                <span>Link Wholesale SKU</span>
              </button>
            </div>
          ) : (
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155' }}>Select Brand SKU to Add:</span>
                <button
                  onClick={() => setShowAddMenu(false)}
                  style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Cancel
                </button>
              </div>

              <select
                autoFocus
                onChange={(e) => handleAddLayer(e.target.value)}
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer',
                  outline: 'none',
                  minHeight: '44px'
                }}
              >
                <option value="" disabled selected>Tap to choose brand ingredient...</option>
                <optgroup label="✨ House Batch Preps">
                  {subRecipes.map(s => (
                    <option key={s.id} value={`sub:${s.id}`}>[Batch] {s.name}</option>
                  ))}
                </optgroup>
                <optgroup label="👑 Artisanal Reserve Brands (Luxury)">
                  {catalog.filter(c => c.tier === 'artisanal').map(c => (
                    <option key={c.id} value={c.id}>[👑 {c.brand}] {c.name} (₱{c.unitCostPerMl.toFixed(3)}/ml)</option>
                  ))}
                </optgroup>
                <optgroup label="⚖️ Signature Standard Brands (Craft Cafe)">
                  {catalog.filter(c => c.tier === 'signature').map(c => (
                    <option key={c.id} value={c.id}>[⚖️ {c.brand}] {c.name} (₱{c.unitCostPerMl.toFixed(3)}/ml)</option>
                  ))}
                </optgroup>
                <optgroup label="⚡ Value Bar Brands (Commercial Economy)">
                  {catalog.filter(c => c.tier === 'value').map(c => (
                    <option key={c.id} value={c.id}>[⚡ {c.brand}] {c.name} (₱{c.unitCostPerMl.toFixed(3)}/ml)</option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 4.4 Sensory Flavor Profile Radar & Balance Matrix */}
      <SensoryFlavorRadar
        recipe={recipe}
        metrics={{ layersDetailed: recipe.layers }}
      />

      {/* 4.5 Packaging Auto-Bundle Section */}
      <div style={{ background: '#ffffff', borderRadius: '18px', padding: '16px 20px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={18} color="#64748b" />
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
            Packaging Auto-Bundled ({recipe.packagingIds?.length || 2} items)
          </span>
        </div>

        <button
          onClick={() => setShowPackagingModal(!showPackagingModal)}
          style={{ fontSize: '0.76rem', color: '#d97706', fontWeight: 800, background: 'transparent', border: 'none', cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center' }}
        >
          {showPackagingModal ? 'Done' : 'Customize'}
        </button>
      </div>

      {showPackagingModal && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
          {PACKAGING_ITEMS.map(pkg => {
            const isSelected = (recipe.packagingIds || []).includes(pkg.id)
            return (
              <button
                key={pkg.id}
                onClick={() => {
                  const current = recipe.packagingIds || []
                  const updated = current.includes(pkg.id) ? current.filter(id => id !== pkg.id) : [...current, pkg.id]
                  onUpdateRecipe({ ...recipe, packagingIds: updated })
                }}
                style={{
                  background: isSelected ? '#fffbeb' : '#ffffff',
                  border: isSelected ? '2px solid #0f172a' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  fontSize: '0.74rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: isSelected ? '#0f172a' : '#475569',
                  minHeight: '44px'
                }}
              >
                <div style={{ fontWeight: 800 }}>{pkg.name.split(' (')[0]}</div>
                <div style={{ color: '#64748b', marginTop: '2px' }}>+₱{pkg.unitCost.toFixed(2)}</div>
              </button>
            )
          })}
        </div>
      )}

      {/* 4.6 Ingredient Cost Distribution Donut Ring */}
      <CostBreakdownRing
        recipe={recipe}
        metrics={{ layersDetailed: recipe.layers }}
        onOpenSupplierPicker={(layerIdx) => {
          setActivePickerLayerIndex(layerIdx)
          setIsPickerOpen(true)
        }}
      />

      {/* 4.7 Barista Preparation Instructions & Pro Tips SOP Card */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '18px 20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                Preparation Instructions & SOP
              </h2>
              <span style={{ fontSize: '0.70rem', color: '#64748b' }}>
                Step-by-step method and barista technique for this recipe.
              </span>
            </div>
          </div>

          <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
            {(recipe.sopSteps && recipe.sopSteps.length > 0 ? recipe.sopSteps.length : 4)} Steps
          </span>
        </div>

        {/* Step by Step List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(recipe.sopSteps && recipe.sopSteps.length > 0
            ? recipe.sopSteps
            : [
                `Pump ${recipe.layers[0]?.name || 'base syrup'} into vessel or stainless shaker.`,
                `Add ${recipe.layers[1]?.name || 'espresso/tea base'} and combine evenly.`,
                `Add calibrated regular ice (35% displacement) and shake vigorously for 10-12s.`,
                `Top off with ${recipe.layers[2]?.name || 'fresh cold milk'} to rim line and garnish.`
              ]
          ).map((step, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '10px 12px'
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontSize: '0.70rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}
              >
                {idx + 1}
              </div>

              {editingStepIndex === idx ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input
                    type="text"
                    defaultValue={step}
                    autoFocus
                    onBlur={(e) => {
                      handleUpdateSopStep(idx, e.target.value)
                      setEditingStepIndex(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateSopStep(idx, e.currentTarget.value)
                        setEditingStepIndex(null)
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid #059669',
                      fontSize: '0.80rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '0.66rem', color: '#64748b' }}>Press Enter or tap outside to save</span>
                </div>
              ) : (
                <div
                  onClick={() => setEditingStepIndex(idx)}
                  style={{
                    flex: 1,
                    fontSize: '0.80rem',
                    color: '#334155',
                    lineHeight: '1.4',
                    cursor: 'text',
                    fontWeight: 500
                  }}
                  title="Click to edit step"
                >
                  {step}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={() => setEditingStepIndex(idx)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                  title="Edit Step"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => handleDeleteSopStep(idx)}
                  style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '2px' }}
                  title="Delete Step"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Step Action */}
        {isAddingStep ? (
          <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
            <input
              type="text"
              placeholder="e.g. Strain over regular ice and dust with cinnamon..."
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddSopStep(newStepText)
                }
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.80rem'
              }}
            />
            <button
              onClick={() => handleAddSopStep(newStepText)}
              style={{ background: '#059669', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Add
            </button>
            <button
              onClick={() => setIsAddingStep(false)}
              style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '8px 10px', borderRadius: '10px', fontSize: '0.78rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingStep(true)}
            style={{
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '10px',
              padding: '8px 12px',
              color: '#059669',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Plus size={13} />
            <span>+ Add Preparation Step</span>
          </button>
        )}

        {/* Barista Pro Tip & Commercial Secret Box */}
        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '14px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={15} color="#d97706" />
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>
              Barista Pro Tip & Food Science Secret
            </span>
          </div>

          <textarea
            rows={2}
            value={recipe.proTips || recipe.baristaNotes || 'Coat cup walls with syrup swirl before pouring for signature marble drizzle. Shake with large dense cubes for 10-12s to aerate velvety microfoam without over-diluting.'}
            onChange={(e) => handleUpdateProTip(e.target.value)}
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              padding: '8px 10px',
              fontSize: '0.78rem',
              color: '#78350f',
              lineHeight: '1.4',
              resize: 'none',
              boxSizing: 'border-box'
            }}
            placeholder="Enter commercial technique tips for your staff..."
          />
        </div>
      </div>

      {/* 4.8 Community Ratings & Barista Reviews */}
      <CommunityReviewsSection
        recipe={recipe}
        onOpenTrendingHub={() => setIsTrendingHubOpen(true)}
        onFeatureRecipe={() => setIsTrendingHubOpen(true)}
      />

      {/* 4.9 Closely Related & Trending Variations Carousel (Bottom Inspiration Section) */}
      <BenchmarkRecipesCarousel
        currentRecipe={recipe}
        onLoadBenchmarkSpec={(incomingSpec) => {
          const specToLoad = incomingSpec?.targetRecipe || incomingSpec
          if (specToLoad && (specToLoad.layers || specToLoad.name)) {
            onUpdateRecipe(specToLoad)
          }
        }}
        onBrowseAll={() => setIsDiscoveryOpen(true)}
      />

      {/* 4.10 Food Science & Scrap Buffer Accordion */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '0.76rem',
            fontWeight: 700,
            color: '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            minHeight: '44px'
          }}
        >
          <Sliders size={14} />
          <span>Advanced Food Science & Scrap Buffer</span>
          {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showAdvanced && (
          <div style={{ marginTop: '8px', background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid #e5e7eb', fontSize: '0.74rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#0f172a' }}>Bar Shrinkage Buffer (+8% to 18%)</strong>
                <p style={{ color: '#64748b', marginTop: '2px' }}>
                  Absorbs espresso dial-in purge, milk steam pitcher loss, & boba expiration directly into COGS.
                </p>
              </div>
              <input
                type="checkbox"
                checked={includeScrap}
                onChange={(e) => setIncludeScrap(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 6. Studio Modals */}
      <DrinkDiscoveryModal
        isOpen={isDiscoveryOpen}
        onClose={() => setIsDiscoveryOpen(false)}
        onLoadRecipe={(loadedRecipe) => {
          onUpdateRecipe(loadedRecipe)
          setIsDiscoveryOpen(false)
        }}
      />

      <AiRecipeGeneratorModal
        isOpen={isAiGenOpen}
        onClose={() => setIsAiGenOpen(false)}
        onApplyRecipe={(generatedRecipe) => {
          onUpdateRecipe(generatedRecipe)
          setIsAiGenOpen(false)
        }}
      />

      <IngredientSupplierPickerModal
        isOpen={isPickerOpen}
        onClose={() => {
          setIsPickerOpen(false)
          setActivePickerLayerIndex(null)
        }}
        onApplyIngredient={handleApplySupplierSwap}
        currentRecipeName={recipe.name}
        currentPortionMl={pickerTargetPortion}
      />

      <BeveragePhotoStudioModal
        isOpen={isPhotoStudioOpen}
        onClose={() => setIsPhotoStudioOpen(false)}
        recipe={recipe}
        metrics={{ layersDetailed: recipe.layers }}
      />

      <BaristaSOPModal
        isOpen={isSopModalOpen}
        onClose={() => setIsSopModalOpen(false)}
        recipe={recipe}
        metrics={{ layersDetailed: recipe.layers }}
      />

      <BatchYieldCalculatorModal
        isOpen={isYieldModalOpen}
        onClose={() => setIsYieldModalOpen(false)}
        recipe={recipe}
        metrics={{ layersDetailed: recipe.layers }}
      />

      <TrendingCommunityHubModal
        isOpen={isTrendingHubOpen}
        onClose={() => setIsTrendingHubOpen(false)}
        trendingRecipes={trendingRecipes}
        onUpdateTrendingRecipes={onUpdateTrendingRecipes}
        currentRecipe={recipe}
        onLoadRecipeIntoStudio={(recipeToLoad) => {
          onUpdateRecipe(recipeToLoad)
          setIsTrendingHubOpen(false)
        }}
        onSaveRecipeToMenu={onSaveToMenu}
      />

      <DrinkRepositoryModal
        isOpen={isRepositoryModalOpen}
        onClose={() => setIsRepositoryModalOpen(false)}
        onLoadRecipeIntoStudio={(recipeToLoad) => {
          onUpdateRecipe(recipeToLoad)
          setIsRepositoryModalOpen(false)
        }}
        onSaveRecipeToMenu={onSaveToMenu}
      />

      <IngredientAffiliateSourcingModal
        isOpen={isAffiliateModalOpen}
        onClose={() => setIsAffiliateModalOpen(false)}
        ingredient={activeAffiliateIngredient}
        allIngredients={catalog}
        onApplyStorePriceToLayer={handleApplyAffiliatePriceToLayer}
      />
    </div>
  )
}
