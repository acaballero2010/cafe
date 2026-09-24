import React, { useState } from 'react'
import { 
  Flame, 
  Star, 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  X, 
  ArrowRight, 
  Sparkles, 
  Check, 
  TrendingUp, 
  ThumbsUp, 
  Share2, 
  Coffee, 
  Award, 
  User, 
  Send,
  FolderPlus,
  BookOpen,
  DollarSign
} from 'lucide-react'

export function TrendingCommunityHubModal({
  isOpen = false,
  onClose = () => {},
  trendingRecipes = [],
  onUpdateTrendingRecipes = () => {},
  currentRecipe = null,
  onLoadRecipeIntoStudio = () => {},
  onSaveRecipeToMenu = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('trending') // 'trending' | 'rating' | 'margin' | 'newest'
  const [expandedRecipeId, setExpandedRecipeId] = useState(trendingRecipes[0]?.id || null)

  // Review & Rating State for active selected recipe
  const [userRating, setUserRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [reviewerName, setReviewerName] = useState('Chef Marco D.')
  const [reviewerRole, setReviewerRole] = useState('Owner @ Kape Craft Studio')
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('')

  // "Feature My Recipe" Form State
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false)
  const [featureHeadline, setFeatureHeadline] = useState('')
  const [featureSuccess, setFeatureSuccess] = useState('')

  if (!isOpen) return null

  // Filter & Sort Recipes
  const filteredRecipes = trendingRecipes.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.authorCafe?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'coffee' && (r.category === 'Coffee' || r.venue === 'coffee')) ||
      (selectedCategory === 'tea' && (r.category?.includes('Tea') || r.category?.includes('Matcha'))) ||
      (selectedCategory === 'boba' && (r.category?.includes('Boba') || r.venue === 'boba'))

    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
    if (sortBy === 'margin') return (b.grossMarginPct || 0) - (a.grossMarginPct || 0)
    if (sortBy === 'newest') return (b.id.localeCompare(a.id))
    return (b.ratingsCount || 0) - (a.ratingsCount || 0)
  })

  const activeRecipe = trendingRecipes.find(r => r.id === expandedRecipeId) || filteredRecipes[0] || trendingRecipes[0]

  // Submit Rating & Comment
  const handlePostReview = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const newComment = {
      id: `comm-${Date.now()}`,
      userName: reviewerName || 'Barista',
      userRole: reviewerRole || 'Beverage Specialist',
      cafeLocation: 'Manila, PH',
      rating: userRating,
      timestamp: 'Just now',
      commentText: commentText.trim(),
      helpfulCount: 0
    }

    const updatedRecipes = trendingRecipes.map(r => {
      if (r.id === activeRecipe.id) {
        const existingComments = r.comments || []
        const currentCount = r.ratingsCount || existingComments.length || 1
        const currentAvg = r.rating || 4.8
        const newAvg = Number((((currentAvg * currentCount) + userRating) / (currentCount + 1)).toFixed(2))

        return {
          ...r,
          rating: newAvg,
          ratingsCount: currentCount + 1,
          comments: [newComment, ...existingComments]
        }
      }
      return r
    })

    onUpdateTrendingRecipes(updatedRecipes)
    setCommentText('')
    setReviewSuccessMessage('✓ Review & rating posted successfully!')
    setTimeout(() => setReviewSuccessMessage(''), 2500)
  }

  // Feature Current Active Recipe into Community
  const handleFeatureCurrentRecipe = (e) => {
    e.preventDefault()
    if (!currentRecipe) return

    const cogs = currentRecipe.layers?.reduce((sum, l) => sum + ((l.unitCostPerMl || 0.1) * (l.volumeMl || 30)), 0) || 42.50
    const price = currentRecipe.menuPrice || 180.00
    const margin = Math.round(((price - cogs) / price) * 100)

    const newFeatured = {
      id: `trend-${Date.now()}`,
      title: currentRecipe.name || 'New Signature Creation',
      authorName: reviewerName || 'Chef Marco D.',
      authorCafe: 'Kape Craft Studio & Bar (BGC, Taguig)',
      authorAvatar: '👨‍🍳',
      avatarBg: '#059669',
      category: currentRecipe.venue === 'boba' ? 'Milk Tea & Boba' : 'Coffee',
      venue: currentRecipe.venue || 'coffee',
      featuredBadge: '✨ Newly Featured',
      description: featureHeadline || currentRecipe.description || 'Crafted signature drink formula with calibrated layers.',
      retailPrice: price,
      cogsCost: Number(cogs.toFixed(2)),
      grossMarginPct: margin,
      targetVessel: currentRecipe.vesselId?.includes('boba') ? '20oz Boba Cup' : '16oz Cold Cup',
      vesselId: currentRecipe.vesselId || 'cold-16oz',
      iceTypeId: currentRecipe.iceTypeId || 'standard',
      rating: 5.0,
      ratingsCount: 1,
      layers: currentRecipe.layers || [],
      sopSteps: currentRecipe.sopSteps || [
        'Pump base syrup into vessel.',
        'Extract espresso shot or tea base.',
        'Add ice and shake or stir.',
        'Top off with milk or cold foam.'
      ],
      proTips: currentRecipe.proTips || 'Maintain exact measurement ratios for signature taste.',
      comments: [
        {
          id: `comm-${Date.now()}`,
          userName: reviewerName || 'Chef Marco D.',
          userRole: 'Creator & Owner',
          cafeLocation: 'Kape Craft Studio, BGC',
          rating: 5,
          timestamp: 'Just now',
          commentText: featureHeadline || 'Our signature house formulation. Tested and calibrated for speed and consistency.',
          helpfulCount: 1
        }
      ]
    }

    onUpdateTrendingRecipes([newFeatured, ...trendingRecipes])
    setExpandedRecipeId(newFeatured.id)
    setFeatureSuccess(`✓ "${newFeatured.title}" is now featured in the Trending Community Hub!`)
    setTimeout(() => {
      setIsFeatureModalOpen(false)
      setFeatureSuccess('')
      setFeatureHeadline('')
    }, 1500)
  }

  const handleHelpfulClick = (recipeId, commentId) => {
    const updated = trendingRecipes.map(r => {
      if (r.id === recipeId) {
        const updatedComments = (r.comments || []).map(c => {
          if (c.id === commentId) {
            return { ...c, helpfulCount: (c.helpfulCount || 0) + 1 }
          }
          return c
        })
        return { ...r, comments: updatedComments }
      }
      return r
    })
    onUpdateTrendingRecipes(updated)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 105,
        background: 'rgba(15, 23, 42, 0.70)',
        backdropFilter: 'blur(8px)',
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
          maxWidth: '960px',
          maxHeight: '94vh',
          overflowY: 'auto',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {/* 1. Header Bar */}
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}
            >
              <Flame size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Community Trending Hub
                <span style={{ fontSize: '0.68rem', background: '#fffbeb', color: '#d97706', padding: '2px 8px', borderRadius: '999px', fontWeight: 800, border: '1px solid #fde68a' }}>
                  Live Ratings & SOPs
                </span>
              </h2>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0' }}>
                Discover crowd-favorite commercial recipes, rate formulations, and share barista tips.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentRecipe && (
              <button
                onClick={() => setIsFeatureModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #0f172a, #334155)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}
              >
                <Flame size={14} color="#f59e0b" />
                <span>Feature My Drink</span>
              </button>
            )}

            <button
              onClick={onClose}
              style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Feature My Recipe Modal Overlay */}
        {isFeatureModalOpen && (
          <div className="clean-modal-overlay" style={{ zIndex: 120 }} onClick={() => setIsFeatureModalOpen(false)}>
            <div className="clean-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                    <Flame size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Feature Recipe to Community
                    </h3>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
                      Publish "{currentRecipe?.name}" to the live trending showcase.
                    </p>
                  </div>
                </div>
              </div>

              {featureSuccess ? (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '18px', textAlign: 'center', color: '#047857', fontWeight: 800, fontSize: '0.88rem' }}>
                  <Check size={24} color="#059669" style={{ margin: '0 auto 6px' }} />
                  <div>{featureSuccess}</div>
                </div>
              ) : (
                <form onSubmit={handleFeatureCurrentRecipe} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Creator / Café Byline
                    </label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Chef Marco D. @ Kape Craft Studio"
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Highlight Headline or Secret Technique
                    </label>
                    <textarea
                      rows={3}
                      value={featureHeadline}
                      onChange={(e) => setFeatureHeadline(e.target.value)}
                      placeholder="What makes this drink special? (e.g. Aerated with dark muscovado, 81% gross margin, signature triple-gradient)"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box', resize: 'none' }}
                    />
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.74rem', color: '#64748b' }}>
                    <strong>Will Include:</strong> Full {currentRecipe?.layers?.length || 3} layers, exact COGS, SOP instructions, and barista pro tips.
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setIsFeatureModalOpen(false)}
                      style={{ background: '#f1f5f9', border: 'none', padding: '9px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ background: '#ea580c', border: 'none', padding: '9px 16px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Flame size={14} />
                      <span>Publish & Feature Now</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 2. Filter & Sort Strip */}
        <div style={{ padding: '12px 22px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search trending drinks, creators, or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.80rem',
                background: '#ffffff',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {[
              { id: 'all', label: 'All Drinks' },
              { id: 'coffee', label: '☕ Coffee & Espresso' },
              { id: 'tea', label: '🍵 Matcha & Tea' },
              { id: 'boba', label: '🧋 Boba & Milk Tea' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '999px',
                  border: selectedCategory === cat.id ? '1px solid #0f172a' : '1px solid #cbd5e1',
                  background: selectedCategory === cat.id ? '#0f172a' : '#ffffff',
                  color: selectedCategory === cat.id ? '#ffffff' : '#475569',
                  fontSize: '0.72rem',
                  fontWeight: selectedCategory === cat.id ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.74rem', background: '#ffffff', fontWeight: 600 }}
            >
              <option value="trending">🔥 Most Popular</option>
              <option value="rating">⭐ Highest Rated</option>
              <option value="margin">💸 Highest Margin %</option>
              <option value="newest">🆕 Newest</option>
            </select>
          </div>
        </div>

        {/* 3. Main 2-Column Split: Recipe List (Left) & Active Recipe Detail + Reviews (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(360px, 1.3fr)', minHeight: '520px' }}>
          
          {/* Left Column: Trending Recipes List */}
          <div style={{ borderRight: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Trending Showcase ({filteredRecipes.length})
            </div>

            {filteredRecipes.map((recipe, idx) => {
              const isSelected = recipe.id === activeRecipe?.id
              return (
                <div
                  key={recipe.id}
                  onClick={() => setExpandedRecipeId(recipe.id)}
                  style={{
                    border: `1.5px solid ${isSelected ? '#f59e0b' : '#e2e8f0'}`,
                    background: isSelected ? '#fffbeb' : '#ffffff',
                    borderRadius: '14px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(245, 158, 11, 0.15)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.66rem', background: isSelected ? '#f59e0b' : '#f1f5f9', color: isSelected ? '#ffffff' : '#475569', padding: '2px 6px', borderRadius: '6px', fontWeight: 800 }}>
                        {recipe.featuredBadge || `#${idx + 1} Trending`}
                      </span>
                    </div>

                    {/* Star Rating Score */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: '#ffffff', padding: '2px 6px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                      <Star size={11} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f172a' }}>
                        {recipe.rating || 4.9}
                      </span>
                      <span style={{ fontSize: '0.64rem', color: '#64748b' }}>
                        ({recipe.ratingsCount || 1})
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {recipe.title}
                    </h4>
                    <p style={{ fontSize: '0.70rem', color: '#64748b', margin: '2px 0 0' }}>
                      By {recipe.authorName} • {recipe.authorCafe}
                    </p>
                  </div>

                  {/* Economics row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px dashed #e2e8f0', fontSize: '0.74rem' }}>
                    <span style={{ color: '#475569' }}>
                      COGS: <strong>₱{Number(recipe.cogsCost || 40).toFixed(2)}</strong>
                    </span>
                    <span style={{ color: '#059669', fontWeight: 800 }}>
                      {recipe.grossMarginPct || 78}% Gross Margin
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Column: Recipe Deep-Dive, Barista Instructions, & Interactive Comments */}
          {activeRecipe && (
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
              
              {/* Active Recipe Header */}
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.68rem', background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                        {activeRecipe.category}
                      </span>
                      <span style={{ fontSize: '0.68rem', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                        {activeRecipe.targetVessel}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                      {activeRecipe.title}
                    </h3>
                    <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '4px 0 0' }}>
                      Created by <strong>{activeRecipe.authorName}</strong> ({activeRecipe.authorCafe})
                    </p>
                  </div>

                  {/* 1-Tap Load in Studio Button */}
                  <button
                    onClick={() => {
                      onLoadRecipeIntoStudio(activeRecipe)
                      onClose()
                    }}
                    style={{
                      background: '#059669',
                      border: 'none',
                      color: '#ffffff',
                      padding: '8px 14px',
                      borderRadius: '12px',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
                    }}
                  >
                    <span>Load in Studio</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Economics Strip */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px', background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 700 }}>RETAIL PRICE</div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                      ₱{Number(activeRecipe.retailPrice || 180).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 700 }}>SHOP COGS</div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                      ₱{Number(activeRecipe.cogsCost || 44).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.64rem', color: '#059669', fontWeight: 700 }}>GROSS MARGIN</div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 900, color: '#059669', fontFamily: 'var(--font-mono)' }}>
                      {activeRecipe.grossMarginPct}%
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.64rem', color: '#f59e0b', fontWeight: 700 }}>AVG RATING</div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 900, color: '#d97706', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                      <span>{activeRecipe.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recipe Layers & Formulation */}
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                  Recipe Layers & Build Order
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(activeRecipe.layers || []).map((layer, lIdx) => (
                    <div
                      key={layer.id || lIdx}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.76rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: layer.colorHex || '#0f172a', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {lIdx + 1}
                        </span>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{layer.name}</span>
                      </div>
                      <span style={{ color: '#64748b', fontWeight: 600 }}>{layer.volumeMl || 30} ml</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SOP Instructions & Pro Tips */}
              <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '14px', padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Sparkles size={14} color="#d97706" />
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>
                    Creator Pro Tip & Secret Technique
                  </span>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#78350f', margin: 0, lineHeight: 1.45 }}>
                  {activeRecipe.proTips || 'Coat cup walls with syrup swirl for optimal marbling and shake with large cubes.'}
                </p>
              </div>

              {/* 4. Interactive Rating & Comments Section */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquare size={16} color="#0f172a" />
                    <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Barista Reviews & Operational Feedback ({activeRecipe.comments?.length || 0})
                    </h4>
                  </div>
                </div>

                {/* Add Review Box */}
                <form
                  onSubmit={handlePostReview}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155' }}>
                      Rate this recipe:
                    </span>
                    
                    {/* Star Rating Selector */}
                    <div style={{ display: 'flex', gap: '4px', cursor: 'pointer' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          size={18}
                          fill={(hoverRating || userRating) >= star ? '#f59e0b' : 'none'}
                          color={(hoverRating || userRating) >= star ? '#f59e0b' : '#cbd5e1'}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setUserRating(star)}
                          style={{ transition: 'all 0.1s ease' }}
                        />
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your barista feedback, supplier swaps, or tasting notes..."
                    required
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.78rem',
                      resize: 'none',
                      boxSizing: 'border-box',
                      background: '#ffffff'
                    }}
                  />

                  {reviewSuccessMessage && (
                    <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                      {reviewSuccessMessage}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      Posting as <strong>{reviewerName}</strong>
                    </span>
                    <button
                      type="submit"
                      style={{
                        background: '#0f172a',
                        border: 'none',
                        color: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Send size={12} />
                      <span>Post Review</span>
                    </button>
                  </div>
                </form>

                {/* List of Comments */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(activeRecipe.comments || []).map(comm => (
                    <div
                      key={comm.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>
                            {comm.userName}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#64748b', marginLeft: '6px' }}>
                            • {comm.userRole}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star
                              key={s}
                              size={11}
                              fill={comm.rating >= s ? '#f59e0b' : 'none'}
                              color={comm.rating >= s ? '#f59e0b' : '#cbd5e1'}
                            />
                          ))}
                        </div>
                      </div>

                      <p style={{ fontSize: '0.76rem', color: '#334155', margin: 0, lineHeight: 1.45 }}>
                        "{comm.commentText}"
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94a3b8', paddingTop: '4px' }}>
                        <span>{comm.timestamp}</span>
                        <button
                          onClick={() => handleHelpfulClick(activeRecipe.id, comm.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 4px'
                          }}
                        >
                          <ThumbsUp size={11} />
                          <span>Helpful ({comm.helpfulCount || 0})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  )
}
