import React, { useState, useEffect, useMemo } from 'react'
import { 
  Search, Flame, Sparkles, TrendingUp, Compass, Heart, Layers, ArrowRight, 
  ChevronRight, ChevronLeft, FlaskConical, ChefHat, Star, Clock, 
  Zap, Info, PlusCircle, CheckCircle2, BookmarkCheck, SlidersHorizontal, 
  ExternalLink, Coffee, Eye, Award
} from 'lucide-react'
import { MASTER_RECIPE_REPOSITORY } from '../data/recipeRepository'
import { BARISTA_FUN_FACTS } from '../data/baristaFunFacts'
import { triggerHaptic } from '../utils/haptics'

export function ExploreHomeDashboard({
  onOpenStudioWithRecipe,
  onOpenBlankStudio,
  onOpenRnDLab,
  onOpenUploadRecipe,
  onOpenTrendingModal,
  onOpenRepositoryModal,
  onSaveToCollection,
  currentUser,
  savedRecipeIds = []
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [isHoveredSlide, setIsHoveredSlide] = useState(false)
  const [likedRecipeIds, setLikedRecipeIds] = useState(() => new Set(savedRecipeIds))

  // Slideshow Featured drinks
  const featuredSlides = useMemo(() => {
    return MASTER_RECIPE_REPOSITORY.slice(0, 5)
  }, [])

  // Auto-advance hero carousel every 5s if not hovered
  useEffect(() => {
    if (isHoveredSlide) return
    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % featuredSlides.length)
    }, 5500)
    return () => clearInterval(interval)
  }, [featuredSlides.length, isHoveredSlide])

  // Toggle favorite
  const handleToggleFavorite = (e, recipe) => {
    e.stopPropagation()
    triggerHaptic('selection')
    setLikedRecipeIds(prev => {
      const next = new Set(prev)
      if (next.has(recipe.id)) {
        next.delete(recipe.id)
      } else {
        next.add(recipe.id)
      }
      return next
    })
    if (onSaveToCollection) {
      onSaveToCollection(recipe)
    }
  }

  // Next Fun Fact
  const handleNextFact = () => {
    triggerHaptic('tap')
    setCurrentFactIndex(prev => (prev + 1) % BARISTA_FUN_FACTS.length)
  }

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return MASTER_RECIPE_REPOSITORY.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      const q = searchQuery.toLowerCase().trim()
      if (!q) return matchesCategory

      const matchesName = item.name.toLowerCase().includes(q)
      const matchesDesc = item.description?.toLowerCase().includes(q)
      const matchesInspired = item.inspiredBy?.toLowerCase().includes(q)
      const matchesTags = item.tags?.some(t => t.toLowerCase().includes(q))
      const matchesIngredients = item.layers?.some(l => l.name.toLowerCase().includes(q))

      return matchesCategory && (matchesName || matchesDesc || matchesInspired || matchesTags || matchesIngredients)
    })
  }, [selectedCategory, searchQuery])

  const currentSlide = featuredSlides[currentSlideIndex] || featuredSlides[0]
  const currentFact = BARISTA_FUN_FACTS[currentFactIndex] || BARISTA_FUN_FACTS[0]

  const categories = [
    { id: 'all', label: 'All Recipes', icon: '✨' },
    { id: 'espresso', label: 'Specialty Espresso', icon: '☕' },
    { id: 'matcha', label: 'Ceremonial Matcha', icon: '🍵' },
    { id: 'boba', label: 'Artisan Boba & Teas', icon: '🧋' },
    { id: 'coldbrew', label: 'Cold Brews & Tonics', icon: '🧊' },
    { id: 'mocktails', label: 'Craft Mocktails', icon: '🍸' },
    { id: 'frappe', label: 'Frappes & Blended', icon: '🍧' }
  ]

  // Calculate quick stats for display
  const calculateCogs = (recipe) => {
    if (!recipe.layers) return 42.50
    return recipe.layers.reduce((sum, l) => sum + (l.volumeMl * (l.unitCostPerMl || 0.15)), 0)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '32px' }}>
      {/* 1. Header Greeting & Universal Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                PourCraft Discovery
              </span>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: '#fef3c7', color: '#92400e', fontWeight: 800 }}>
                PH Edition 🇵🇭
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0', letterSpacing: '-0.02em' }}>
              Welcome back, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Barista'} 👋
            </h1>
          </div>

          <button
            onClick={() => {
              triggerHaptic('tap')
              if (onOpenUploadRecipe) onOpenUploadRecipe()
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
            }}
          >
            <PlusCircle size={15} color="#38bdf8" />
            <span>Upload Recipe</span>
          </button>
        </div>

        {/* Universal Search Input */}
        <div style={{ position: 'relative' }}>
          <Search 
            size={18} 
            color="#94a3b8" 
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 200+ recipes, ingredients (e.g. Oat Milk, Uji Matcha), clones..."
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '13px 40px 13px 44px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              fontSize: '0.88rem',
              color: '#0f172a',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                fontSize: '0.75rem',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => {
                  triggerHaptic('tap')
                  setSelectedCategory(cat.id)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '24px',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 800 : 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #0f172a' : '1px solid #e2e8f0',
                  background: isSelected ? '#0f172a' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#475569',
                  boxShadow: isSelected ? '0 4px 10px rgba(15, 23, 42, 0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Hero Featured Slideshow Carousel */}
      {!searchQuery && selectedCategory === 'all' && (
        <div 
          onMouseEnter={() => setIsHoveredSlide(true)}
          onMouseLeave={() => setIsHoveredSlide(false)}
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
            color: '#ffffff',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.22)',
            minHeight: '260px'
          }}
        >
          {/* Background Decorative Accent */}
          <div 
            style={{
              position: 'absolute',
              right: '-40px',
              top: '-40px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(217, 119, 6, 0.35) 0%, rgba(0, 0, 0, 0) 70%)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxSizing: 'border-box' }}>
            {/* Top Bar: Badge & Navigation Dots */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  background: 'rgba(217, 119, 6, 0.2)', 
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#fbbf24', 
                  padding: '4px 10px', 
                  borderRadius: '12px', 
                  fontSize: '0.72rem', 
                  fontWeight: 800,
                  textTransform: 'uppercase'
                }}>
                  <Flame size={13} />
                  Featured Signature
                </span>
                {currentSlide.inspiredBy && (
                  <span style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    color: '#e2e8f0', 
                    padding: '4px 8px', 
                    borderRadius: '10px', 
                    fontSize: '0.7rem', 
                    fontWeight: 600 
                  }}>
                    {currentSlide.inspiredBy}
                  </span>
                )}
              </div>

              {/* Slide Indicators */}
              <div style={{ display: 'flex', gap: '5px' }}>
                {featuredSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      triggerHaptic('tap')
                      setCurrentSlideIndex(idx)
                    }}
                    style={{
                      width: idx === currentSlideIndex ? '20px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      background: idx === currentSlideIndex ? '#f59e0b' : 'rgba(255, 255, 255, 0.3)',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Slide Body: Visual + Details */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', margin: '14px 0', zIndex: 2 }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                  {currentSlide.name}
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: '0 0 12px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {currentSlide.description}
                </p>

                {/* Economics Quick Pill */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.12)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8' }}>
                    ₱{currentSlide.menuPrice?.toFixed(2)} SRP
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 800, color: '#34d399' }}>
                    {currentSlide.targetMarginPct}% Gross Margin
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.72rem', color: '#94a3b8' }}>
                    COGS ~₱{calculateCogs(currentSlide).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Recipe Image Thumbnail */}
              <div 
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '16px',
                  background: '#27272a',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '2px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                  position: 'relative'
                }}
              >
                <img
                  src={currentSlide.photoUrl}
                  alt={currentSlide.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80'
                  }}
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2, paddingTop: '6px' }}>
              <button
                onClick={(e) => handleToggleFavorite(e, currentSlide)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  color: likedRecipeIds.has(currentSlide.id) ? '#f43f5e' : '#e2e8f0',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Heart size={14} fill={likedRecipeIds.has(currentSlide.id) ? '#f43f5e' : 'none'} />
                <span>{likedRecipeIds.has(currentSlide.id) ? 'Saved' : 'Save'}</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    triggerHaptic('selection')
                    onOpenStudioWithRecipe(currentSlide)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#f59e0b',
                    color: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '9px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
                  }}
                >
                  <FlaskConical size={15} />
                  <span>Clone & Tweak in Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Daily Barista & Food-Science Fun Fact Box */}
      <div 
        style={{
          borderRadius: '18px',
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '1px solid #fde68a',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 4px 12px rgba(217, 119, 6, 0.06)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>{currentFact.icon}</span>
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Food-Science Tidbit • {currentFact.category}
              </span>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#78350f', margin: 0 }}>
                {currentFact.title}
              </h4>
            </div>
          </div>

          <button
            onClick={handleNextFact}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: '10px',
              background: '#ffffff',
              border: '1px solid #fde68a',
              color: '#b45309',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
            }}
          >
            <Sparkles size={12} />
            <span>Next Fact 💡</span>
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: '#92400e', margin: 0, lineHeight: 1.45 }}>
          {currentFact.fact}
        </p>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.65)', 
          padding: '8px 12px', 
          borderRadius: '10px', 
          fontSize: '0.75rem', 
          color: '#78350f', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px' 
        }}>
          <Zap size={13} color="#d97706" style={{ flexShrink: 0 }} />
          <span><strong>Barista Pro-Tip:</strong> {currentFact.proTip}</span>
        </div>
      </div>

      {/* 4. Quick Actions Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <button
          onClick={() => {
            triggerHaptic('tap')
            onOpenBlankStudio()
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '14px 10px',
            borderRadius: '16px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#0f172a',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <FlaskConical size={18} />
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>New Studio</span>
          <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Blank Drink</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('tap')
            onOpenRnDLab()
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '14px 10px',
            borderRadius: '16px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#0f172a',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#db2777' }}>
            <Sparkles size={18} />
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>R&D Chemistry</span>
          <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Flavor Pairings</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('tap')
            onOpenTrendingModal()
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '14px 10px',
            borderRadius: '16px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#0f172a',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
            <Flame size={18} />
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>PH Trends</span>
          <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Community SOP</span>
        </button>
      </div>

      {/* 5. Stored Master Recipes Repository Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              {selectedCategory === 'all' ? 'Master Recipe Repository' : categories.find(c => c.id === selectedCategory)?.label}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Showing {filteredRecipes.length} commercial formulations ready to clone & cost
            </span>
          </div>

          <button
            onClick={() => {
              triggerHaptic('tap')
              onOpenRepositoryModal()
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              color: '#d97706',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <span>View All (200+)</span>
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Recipe Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {filteredRecipes.map((recipe) => {
            const cogs = calculateCogs(recipe)
            const margin = recipe.targetMarginPct || Math.round(((recipe.menuPrice - cogs) / recipe.menuPrice) * 100)
            const isLiked = likedRecipeIds.has(recipe.id)

            return (
              <div
                key={recipe.id}
                onClick={() => {
                  triggerHaptic('selection')
                  onOpenStudioWithRecipe(recipe)
                }}
                style={{
                  borderRadius: '16px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}
              >
                {/* Card Top: Image + Tags */}
                <div style={{ position: 'relative', height: '140px', background: '#1e293b' }}>
                  <img
                    src={recipe.photoUrl}
                    alt={recipe.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80'
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.75) 0%, transparent 60%)' }} />

                  {/* Badges on Image */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                    {recipe.inspiredBy && (
                      <span style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', color: '#fef08a', padding: '3px 8px', borderRadius: '8px', fontSize: '0.68rem', fontWeight: 700 }}>
                        {recipe.inspiredBy}
                      </span>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => handleToggleFavorite(e, recipe)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}
                  >
                    <Heart size={15} color={isLiked ? '#f43f5e' : '#64748b'} fill={isLiked ? '#f43f5e' : 'none'} />
                  </button>

                  {/* Price on Image Bottom */}
                  <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>SRP Retail</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
                        ₱{recipe.menuPrice?.toFixed(2)}
                      </div>
                    </div>

                    <span style={{ background: '#10b981', color: '#ffffff', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                      {margin}% GM
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', lineHeight: 1.25 }}>
                      {recipe.name}
                    </h4>
                    <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {recipe.description}
                    </p>
                  </div>

                  {/* Layer Stack preview pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {(recipe.layers || []).slice(0, 3).map((layer, idx) => (
                      <span key={idx} style={{ fontSize: '0.66rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '6px' }}>
                        {layer.name}
                      </span>
                    ))}
                    {(recipe.layers || []).length > 3 && (
                      <span style={{ fontSize: '0.66rem', background: '#f1f5f9', color: '#64748b', padding: '2px 5px', borderRadius: '6px' }}>
                        +{(recipe.layers.length - 3)}
                      </span>
                    )}
                  </div>

                  {/* Action Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={12} />
                        {recipe.prepTime || '2 mins'}
                      </span>
                      <span>•</span>
                      <span>COGS ₱{cogs.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        triggerHaptic('selection')
                        onOpenStudioWithRecipe(recipe)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <span>Studio</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
