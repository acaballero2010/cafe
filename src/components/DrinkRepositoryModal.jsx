import React, { useState, useMemo } from 'react'
import { 
  BookOpen, 
  Search, 
  Filter, 
  X, 
  Sparkles, 
  Check, 
  Flame, 
  Snowflake, 
  ArrowRight, 
  Layers, 
  Coffee, 
  Scale, 
  FileText, 
  Camera, 
  Star, 
  Bookmark, 
  Download, 
  Plus, 
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react'
import { RecipeDatabase } from '../utils/recipeDatabase'
import { SensoryFlavorRadar } from './SensoryFlavorRadar'
import { BeveragePhotoStudioModal } from './BeveragePhotoStudioModal'
import { BaristaSOPModal } from './BaristaSOPModal'
import { BatchYieldCalculatorModal } from './BatchYieldCalculatorModal'

export function DrinkRepositoryModal({
  isOpen = false,
  onClose = () => {},
  onLoadRecipeIntoStudio = () => {},
  onSaveRecipeToMenu = () => {}
}) {
  const [recipes, setRecipes] = useState(() => RecipeDatabase.getAllRecipes())
  const [favorites, setFavorites] = useState(() => RecipeDatabase.getFavorites())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all') // 'all' | 'espresso' | 'matcha' | 'boba' | 'coldbrew' | 'mocktails' | 'frappe'
  const [selectedTemp, setSelectedTemp] = useState('all') // 'all' | 'hot' | 'iced'
  const [onlyHighMargin, setOnlyHighMargin] = useState(false)
  const [onlyFavorites, setOnlyFavorites] = useState(false)

  // Selected Recipe for deep inspection drawer
  const [inspectingRecipe, setInspectingRecipe] = useState(null)

  // Modals for deep actions
  const [activeDrinkForModal, setActiveDrinkForModal] = useState(null)
  const [isPhotoStudioOpen, setIsPhotoStudioOpen] = useState(false)
  const [isSopModalOpen, setIsSopModalOpen] = useState(false)
  const [isYieldModalOpen, setIsYieldModalOpen] = useState(false)

  const categories = [
    { id: 'all', name: 'All Drinks', icon: '✨' },
    { id: 'espresso', name: 'Espresso', icon: '☕' },
    { id: 'matcha', name: 'Matcha & Tea', icon: '🍵' },
    { id: 'boba', name: 'Boba & Milk', icon: '🧋' },
    { id: 'coldbrew', name: 'Cold Brew', icon: '🧊' },
    { id: 'mocktails', name: 'Mocktails', icon: '🍸' },
    { id: 'frappe', name: 'Frappes', icon: '🍧' }
  ]

  const handleToggleFavorite = (e, recipeId) => {
    e.stopPropagation()
    const updated = RecipeDatabase.toggleFavorite(recipeId)
    setFavorites(updated)
  }

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      // Search match
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch = !query || 
        recipe.name.toLowerCase().includes(query) ||
        recipe.categoryName?.toLowerCase().includes(query) ||
        (recipe.tags && recipe.tags.some(t => t.toLowerCase().includes(query))) ||
        (recipe.layers && recipe.layers.some(l => l.name.toLowerCase().includes(query)))

      // Category match
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory

      // Temp match
      const matchesTemp = selectedTemp === 'all' || recipe.temp === selectedTemp

      // Margin match (>78%)
      const matchesMargin = !onlyHighMargin || (recipe.targetMarginPct || 75) >= 78

      // Favorites match
      const matchesFav = !onlyFavorites || favorites.includes(recipe.id)

      return matchesSearch && matchesCategory && matchesTemp && matchesMargin && matchesFav
    })
  }, [recipes, searchQuery, selectedCategory, selectedTemp, onlyHighMargin, onlyFavorites, favorites])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 115,
        background: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92vh',
          borderRadius: '28px',
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 25px 60px rgba(0,0,0,0.45)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {/* 1. Repository Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0f172a, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
              }}
            >
              <BookOpen size={20} color="#fbbf24" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                Master Drink Recipe Database
                <span style={{ fontSize: '0.64rem', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                  ₱ PHP Costed
                </span>
              </h2>
              <p style={{ fontSize: '0.70rem', color: '#64748b', margin: '2px 0 0' }}>
                Curated commercial café recipes with 8K photos & Barista SOPs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Search & Filter Bar */}
        <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search recipes, ingredients (e.g. oat milk, matcha, caramel)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 34px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '0.78rem',
                background: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Horizontal Scroll Pills */}
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
            {categories.map(cat => {
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '999px',
                    border: `1px solid ${isSelected ? '#0f172a' : '#e2e8f0'}`,
                    background: isSelected ? '#0f172a' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#475569',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>

          {/* Quick Filter Badges (Hot/Cold, High Margin, Bookmarks) */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedTemp(selectedTemp === 'all' ? 'iced' : selectedTemp === 'iced' ? 'hot' : 'all')}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                border: `1px solid ${selectedTemp !== 'all' ? '#0284c7' : '#cbd5e1'}`,
                background: selectedTemp !== 'all' ? '#f0f9ff' : '#ffffff',
                color: selectedTemp !== 'all' ? '#0369a1' : '#475569',
                fontSize: '0.66rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {selectedTemp === 'all' ? '🌡️ All Temps' : selectedTemp === 'iced' ? '❄️ Iced Only' : '🔥 Hot Only'}
            </button>

            <button
              onClick={() => setOnlyHighMargin(!onlyHighMargin)}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                border: `1px solid ${onlyHighMargin ? '#059669' : '#cbd5e1'}`,
                background: onlyHighMargin ? '#ecfdf5' : '#ffffff',
                color: onlyHighMargin ? '#065f46' : '#475569',
                fontSize: '0.66rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ⭐ High Margin (≥78%)
            </button>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                border: `1px solid ${onlyFavorites ? '#eab308' : '#cbd5e1'}`,
                background: onlyFavorites ? '#fefce8' : '#ffffff',
                color: onlyFavorites ? '#854d0e' : '#475569',
                fontSize: '0.66rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Bookmark size={11} color={onlyFavorites ? '#ca8a04' : '#64748b'} />
              <span>Saved ({favorites.length})</span>
            </button>
          </div>
        </div>

        {/* 3. Recipe Cards Grid / List */}
        <div style={{ padding: '14px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '0.70rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px' }}>
            <span>Showing <strong>{filteredRecipes.length}</strong> drink formulations</span>
            <button
              onClick={RecipeDatabase.exportDatabaseJSON}
              style={{ background: 'transparent', border: 'none', color: '#0284c7', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              <Download size={11} />
              <span>Backup DB (.json)</span>
            </button>
          </div>

          {filteredRecipes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <BookOpen size={28} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1e293b' }}>No recipes match your filter</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Try clearing search keywords or category filters.</div>
            </div>
          ) : (
            filteredRecipes.map(item => {
              const isFav = favorites.includes(item.id)
              const cogs = item.layers?.reduce((sum, l) => sum + (l.volumeMl * (l.unitCostPerMl || 0.25)), 0) + (item.vesselCost || 8.5)
              const margin = (((item.menuPrice - cogs) / item.menuPrice) * 100).toFixed(0)

              return (
                <div
                  key={item.id}
                  onClick={() => setInspectingRecipe(item)}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  {/* Photo Thumbnail */}
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative',
                      flexShrink: 0,
                      background: '#0f172a'
                    }}
                  >
                    <img
                      src={item.photoUrl || '/beverages/caramel-macchiato.jpg'}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: '2px', left: '2px', fontSize: '0.58rem', background: 'rgba(0,0,0,0.7)', color: '#ffffff', padding: '1px 4px', borderRadius: '4px', fontWeight: 700 }}>
                      {item.temp === 'hot' ? '🔥 Hot' : '❄️ Iced'}
                    </div>
                  </div>

                  {/* Info Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </h4>
                        <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '1px' }}>
                          {item.vesselName} • {item.prepTime}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleToggleFavorite(e, item.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: isFav ? '#eab308' : '#cbd5e1' }}
                        title={isFav ? 'Remove Favorite' : 'Save to Favorites'}
                      >
                        <Star size={16} fill={isFav ? '#eab308' : 'none'} />
                      </button>
                    </div>

                    {/* Cost & Margin Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669' }}>
                        ₱{item.menuPrice.toFixed(2)}
                      </span>
                      <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                        COGS: ₱{cogs.toFixed(1)}
                      </span>
                      <span style={{ fontSize: '0.62rem', background: '#ecfdf5', color: '#059669', padding: '1px 6px', borderRadius: '999px', fontWeight: 800 }}>
                        {margin}% GM
                      </span>
                    </div>

                    {/* Tag Pills */}
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                      {(item.tags || []).slice(0, 2).map((tag, tIdx) => (
                        <span key={tIdx} style={{ fontSize: '0.58rem', background: '#f1f5f9', color: '#475569', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ChevronRight size={16} color="#94a3b8" />
                </div>
              )
            })
          )}
        </div>

        {/* 4. Detailed Recipe Inspector Modal Drawer */}
        {inspectingRecipe && (
          <div className="clean-modal-overlay" onClick={() => setInspectingRecipe(null)} style={{ zIndex: 125 }}>
            <div
              className="clean-modal-card"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', padding: '18px' }}
            >
              {/* Top Banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.62rem', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '999px', fontWeight: 800, textTransform: 'uppercase' }}>
                    {inspectingRecipe.categoryName}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0' }}>
                    {inspectingRecipe.name}
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0' }}>
                    {inspectingRecipe.description}
                  </p>
                </div>

                <button
                  onClick={() => setInspectingRecipe(null)}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* 8K Photo Preview in Drawer */}
              <div style={{ width: '100%', height: '180px', borderRadius: '16px', overflow: 'hidden', position: 'relative', marginBottom: '12px', background: '#0f172a' }}>
                <img
                  src={inspectingRecipe.photoUrl || '/beverages/caramel-macchiato.jpg'}
                  alt={inspectingRecipe.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(15, 23, 42, 0.85)', color: '#ffffff', padding: '3px 10px', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 800 }}>
                  ₱{inspectingRecipe.menuPrice.toFixed(2)}
                </div>
              </div>

              {/* Sensory Radar & Flavor Notes */}
              <div style={{ marginBottom: '14px' }}>
                <SensoryFlavorRadar
                  recipe={inspectingRecipe}
                  metrics={{ layersDetailed: inspectingRecipe.layers }}
                />
              </div>

              {/* Layer-by-Layer Formula */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.70rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Commercial Formulation Layers ({inspectingRecipe.layers?.length || 0})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {inspectingRecipe.layers?.map((layer, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', background: '#ffffff', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{idx + 1}. {layer.name}</span>
                      <span style={{ fontWeight: 800, color: '#0284c7' }}>{layer.volumeMl} ml</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Multi-Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '10px' }}>
                <button
                  onClick={() => {
                    setActiveDrinkForModal(inspectingRecipe)
                    setIsPhotoStudioOpen(true)
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    border: 'none',
                    color: '#ffffff',
                    padding: '9px',
                    borderRadius: '10px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Camera size={13} />
                  <span>8K Photo Studio</span>
                </button>

                <button
                  onClick={() => {
                    setActiveDrinkForModal(inspectingRecipe)
                    setIsSopModalOpen(true)
                  }}
                  style={{
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    color: '#0369a1',
                    padding: '9px',
                    borderRadius: '10px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <FileText size={13} />
                  <span>Station SOP Card</span>
                </button>
              </div>

              {/* Clone to Studio Primary CTA */}
              <button
                onClick={() => {
                  onLoadRecipeIntoStudio(inspectingRecipe)
                  setInspectingRecipe(null)
                  onClose()
                }}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: 'none',
                  color: '#ffffff',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)'
                }}
              >
                <span>🧪 Clone & Customize in Studio</span>
                <ArrowRight size={15} color="#fbbf24" />
              </button>
            </div>
          </div>
        )}

        {/* Embedded Sub-Modals */}
        {activeDrinkForModal && (
          <>
            <BeveragePhotoStudioModal
              isOpen={isPhotoStudioOpen}
              onClose={() => setIsPhotoStudioOpen(false)}
              recipe={activeDrinkForModal}
              metrics={{ layersDetailed: activeDrinkForModal.layers }}
            />

            <BaristaSOPModal
              isOpen={isSopModalOpen}
              onClose={() => setIsSopModalOpen(false)}
              recipe={activeDrinkForModal}
              metrics={{ layersDetailed: activeDrinkForModal.layers }}
            />

            <BatchYieldCalculatorModal
              isOpen={isYieldModalOpen}
              onClose={() => setIsYieldModalOpen(false)}
              recipe={activeDrinkForModal}
              metrics={{ layersDetailed: activeDrinkForModal.layers }}
            />
          </>
        )}

      </div>
    </div>
  )
}
