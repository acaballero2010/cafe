import React, { useState } from 'react'
import { Sparkles, ArrowRight, TrendingUp, CheckCircle2, Info, Flame, Star, Coffee, Check, RefreshCw, Zap } from 'lucide-react'
import { MASTER_RECIPE_REPOSITORY } from '../data/recipeRepository'
import { triggerHaptic } from '../utils/haptics'

export function BenchmarkRecipesCarousel({
  currentRecipe = {},
  onLoadBenchmarkSpec = () => {},
  onBrowseAll = () => {}
}) {
  const [loadedSpecId, setLoadedSpecId] = useState(null)

  // Find closely related recipes based on current recipe category
  const relatedRecipes = React.useMemo(() => {
    const currentCategory = currentRecipe.category || 'espresso'
    const sameCategory = MASTER_RECIPE_REPOSITORY.filter(r => r.id !== currentRecipe.id && (r.category === currentCategory || r.categoryName === currentRecipe.categoryName))
    const others = MASTER_RECIPE_REPOSITORY.filter(r => r.id !== currentRecipe.id && r.category !== currentCategory)
    return [...sameCategory, ...others].slice(0, 6)
  }, [currentRecipe])

  const handleLoad = (item) => {
    triggerHaptic('selection')
    setLoadedSpecId(item.id)
    const clonedRecipe = {
      ...item,
      id: `rec_var_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: item.name.includes('Twist') ? item.name : `${item.name} (My Twist)`,
      version: 'v1.1 (Draft)',
      forkedFrom: {
        id: item.id,
        name: item.name,
        authorName: item.authorName || 'PourCraft Master Specs',
        authorCafe: item.authorCafe || 'Master Repository',
        category: item.category,
        menuPrice: item.menuPrice,
        layers: JSON.parse(JSON.stringify(item.layers || []))
      },
      isCustomVariation: true,
      isUserUploaded: false
    }
    onLoadBenchmarkSpec(clonedRecipe)
    setTimeout(() => setLoadedSpecId(null), 2500)
  }

  const calculateCogs = (item) => {
    if (!item.layers) return 42.00
    return item.layers.reduce((sum, l) => sum + ((l.volumeMl || 30) * (l.unitCostPerMl || 0.15)), 0)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h2 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
              Closely Related & Trending Variations
            </h2>
            <span style={{ fontSize: '0.70rem', color: '#64748b' }}>
              Clone signature commercial formulations directly into Studio.
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic('tap')
            onBrowseAll()
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#2563eb',
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <span>Repo (200+)</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
        {relatedRecipes.map((item) => {
          const cogs = calculateCogs(item)
          const margin = item.targetMarginPct || Math.round(((item.menuPrice - cogs) / item.menuPrice) * 100)
          const isLoaded = loadedSpecId === item.id

          return (
            <div
              key={item.id}
              style={{
                width: '260px',
                flexShrink: 0,
                background: '#ffffff',
                borderRadius: '18px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Card Image Banner */}
              <div style={{ height: '110px', background: '#1e293b', position: 'relative' }}>
                <img
                  src={item.photoUrl || '/beverages/caramel-macchiato.jpg'}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80'
                  }}
                />
                <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '4px' }}>
                  {item.inspiredBy ? (
                    <span style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', color: '#fef08a', padding: '2px 7px', borderRadius: '6px', fontSize: '0.64rem', fontWeight: 800 }}>
                      {item.inspiredBy}
                    </span>
                  ) : (
                    <span style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', color: '#ffffff', padding: '2px 7px', borderRadius: '6px', fontSize: '0.64rem', fontWeight: 800 }}>
                      {item.categoryName}
                    </span>
                  )}
                </div>
                <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#10b981', color: '#ffffff', padding: '2px 6px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800 }}>
                  {margin}% GM
                </div>
              </div>

              {/* Card Content */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '0.90rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', lineHeight: 1.25 }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                </div>

                {/* Economics */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '6px 8px', borderRadius: '8px', border: '1px solid #f1f5f9', marginTop: '6px' }}>
                  <div>
                    <span style={{ fontSize: '0.62rem', color: '#64748b', display: 'block' }}>COGS</span>
                    <strong style={{ fontSize: '0.78rem', color: '#0f172a' }}>₱{cogs.toFixed(2)}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.62rem', color: '#64748b', display: 'block' }}>Target SRP</span>
                    <strong style={{ fontSize: '0.78rem', color: '#0284c7' }}>₱{item.menuPrice?.toFixed(2)}</strong>
                  </div>
                </div>

                {/* Clone / Load Button */}
                <button
                  onClick={() => handleLoad(item)}
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    padding: '8px',
                    borderRadius: '10px',
                    background: isLoaded ? '#10b981' : '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'background 0.2s'
                  }}
                >
                  {isLoaded ? (
                    <>
                      <Check size={13} />
                      <span>Loaded in Studio!</span>
                    </>
                  ) : (
                    <>
                      <Zap size={13} color="#38bdf8" />
                      <span>Clone in Studio</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
