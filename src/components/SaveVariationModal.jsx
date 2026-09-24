import React, { useState, useMemo } from 'react'
import { 
  X, BookmarkCheck, GitFork, Sparkles, Check, Globe, Lock, 
  Layers, ArrowRight, AlertCircle, Info, Coffee, Tag, DollarSign, Store
} from 'lucide-react'
import { triggerHaptic } from '../utils/haptics'

export function SaveVariationModal({
  isOpen,
  onClose,
  recipe,
  onUpdateRecipe,
  savedMenus = [],
  onSaveToMenu = () => {},
  onPublishToCommunity = () => {},
  currentUser
}) {
  const [activeTab, setActiveTab] = useState('private') // 'private' | 'community'
  const [variationName, setVariationName] = useState(recipe?.name || '')
  const [versionTag, setVersionTag] = useState(recipe?.version || 'v1.1')
  const [twistNote, setTwistNote] = useState(
    recipe?.variationNote || 
    recipe?.baristaNotes || 
    'Swapped base milk for oat milk and calibrated sweetness for higher clarity.'
  )
  const [targetSellingPrice, setTargetSellingPrice] = useState(recipe?.menuPrice || 190.00)
  const [selectedMenuId, setSelectedMenuId] = useState(savedMenus[0]?.id || 'new')
  const [newMenuTitle, setNewMenuTitle] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Calculate layer deltas between current recipe and parent recipe (if forked)
  const deltaAnalysis = useMemo(() => {
    if (!recipe?.forkedFrom?.layers) {
      return { hasParent: false, changes: [] }
    }

    const parentLayers = recipe.forkedFrom.layers
    const currentLayers = recipe.layers || []
    const changes = []

    // 1. Check removed or swapped layers
    parentLayers.forEach(pl => {
      const match = currentLayers.find(cl => cl.name === pl.name || cl.ingredientId === pl.ingredientId)
      if (!match) {
        changes.push({
          type: 'removed',
          text: `Removed "${pl.name}" (${pl.volumeMl}ml)`
        })
      } else if (match.volumeMl !== pl.volumeMl) {
        const diff = match.volumeMl - pl.volumeMl
        changes.push({
          type: 'adjusted',
          text: `Adjusted "${pl.name}": ${pl.volumeMl}ml ➔ ${match.volumeMl}ml (${diff > 0 ? `+${diff}ml` : `${diff}ml`})`
        })
      }
    })

    // 2. Check newly added layers
    currentLayers.forEach(cl => {
      const match = parentLayers.find(pl => pl.name === cl.name || pl.ingredientId === cl.ingredientId)
      if (!match) {
        changes.push({
          type: 'added',
          text: `Added "${cl.name}" (${cl.volumeMl}ml @ ₱${(cl.unitCostPerMl || 0.15).toFixed(2)}/ml)`
        })
      }
    })

    return {
      hasParent: true,
      parentName: recipe.forkedFrom.name,
      parentAuthor: recipe.forkedFrom.authorName || 'PourCraft Master',
      changes,
      changeCount: changes.length
    }
  }, [recipe])

  if (!isOpen) return null

  const calculateCogs = () => {
    if (!recipe?.layers) return 40.00
    const ingredientCost = recipe.layers.reduce((sum, l) => sum + ((l.volumeMl || 0) * (l.unitCostPerMl || 0.15)), 0)
    const packagingCost = 4.50
    return ingredientCost + packagingCost
  }

  const cogs = calculateCogs()
  const grossProfit = targetSellingPrice - cogs
  const marginPct = targetSellingPrice > 0 ? Math.round((grossProfit / targetSellingPrice) * 100) : 0

  const handleSavePrivate = (e) => {
    e.preventDefault()
    if (!variationName.trim()) {
      setErrorMessage('Please enter a recipe name.')
      return
    }

    triggerHaptic('success')
    const finalRecipe = {
      ...recipe,
      name: variationName.trim(),
      version: versionTag.trim() || 'v1.1',
      variationNote: twistNote.trim(),
      menuPrice: parseFloat(targetSellingPrice) || 190.00,
      targetMarginPct: marginPct,
      isCustomVariation: true,
      updatedAt: 'Just now',
      savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    onUpdateRecipe(finalRecipe)

    if (selectedMenuId === 'new') {
      const menuTitle = newMenuTitle.trim() || '🧪 My Lab Variations'
      const newMenu = {
        id: `menu-${Date.now()}`,
        title: menuTitle,
        description: 'Personal custom formulation collection.',
        season: 'Core / Year-Round',
        updatedAt: 'Just now',
        drinks: [finalRecipe]
      }
      onSaveToMenu(newMenu, true)
      setSuccessMessage(`Created collection "${menuTitle}" and saved "${finalRecipe.name}"!`)
    } else {
      const targetMenu = savedMenus.find(m => m.id === selectedMenuId)
      onSaveToMenu(finalRecipe, false, selectedMenuId)
      setSuccessMessage(`Saved "${finalRecipe.name}" to "${targetMenu?.title || 'Personal Library'}"!`)
    }

    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 1500)
  }

  const handlePublishCommunity = (e) => {
    e.preventDefault()
    if (!variationName.trim()) {
      setErrorMessage('Please enter a recipe title.')
      return
    }

    // Duplicate prevention check: if forked and 0 changes were made
    if (deltaAnalysis.hasParent && deltaAnalysis.changeCount === 0) {
      setErrorMessage('No recipe modifications detected yet. Adjust an ingredient ratio, milk type, or sweetness level before publishing as a community variation.')
      triggerHaptic('error')
      return
    }

    triggerHaptic('success')
    const communityRecipe = {
      ...recipe,
      id: `community-var-${Date.now()}`,
      name: variationName.trim(),
      version: versionTag.trim() || 'v1.1',
      variationNote: twistNote.trim(),
      menuPrice: parseFloat(targetSellingPrice) || 190.00,
      targetMarginPct: marginPct,
      authorName: currentUser?.name || 'Barista Creator',
      authorCafe: currentUser?.shopName || 'Specialty Coffee Lab',
      isPublicVariation: true,
      isUserUploaded: true,
      forkedFrom: recipe.forkedFrom || null,
      variationChanges: deltaAnalysis.changes,
      rating: 5.0,
      reviewsCount: 1,
      likesCount: 1,
      publishedAt: 'Just now'
    }

    onPublishToCommunity(communityRecipe)
    setSuccessMessage(`🎉 Published "${communityRecipe.name}" to Community Variations!`)
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 1600)
  }

  return (
    <div className="clean-modal-overlay" onClick={onClose} style={{ zIndex: 110 }}>
      <div 
        className="clean-modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '520px', padding: '22px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
              <BookmarkCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Save & Track Formulation
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
                Manage custom variation lineage, pricing & publishing.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Lineage & Delta Banner */}
        {deltaAnalysis.hasParent && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px 14px', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GitFork size={15} color="#2563eb" />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b' }}>
                Forked from <span style={{ color: '#2563eb' }}>{deltaAnalysis.parentName}</span>
              </span>
              <span style={{ fontSize: '0.68rem', color: '#64748b', marginLeft: 'auto' }}>
                Orig: {deltaAnalysis.parentAuthor}
              </span>
            </div>

            {/* Changes Detected */}
            {deltaAnalysis.changes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {deltaAnalysis.changes.length} Recipe Modification(s) Detected:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {deltaAnalysis.changes.map((ch, idx) => (
                    <span 
                      key={idx}
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: ch.type === 'added' ? '#ecfdf5' : ch.type === 'removed' ? '#fef2f2' : '#eff6ff',
                        color: ch.type === 'added' ? '#047857' : ch.type === 'removed' ? '#b91c1c' : '#1d4ed8',
                        border: `1px solid ${ch.type === 'added' ? '#a7f3d0' : ch.type === 'removed' ? '#fecaca' : '#bfdbfe'}`
                      }}
                    >
                      {ch.text}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Info size={13} color="#94a3b8" />
                <span>Identical to base formulation. You can tweak layer volumes in Studio before saving.</span>
              </div>
            )}
          </div>
        )}

        {/* Dual Save Selector Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection')
              setActiveTab('private')
              setErrorMessage('')
            }}
            style={{
              padding: '10px',
              borderRadius: '12px',
              border: `2px solid ${activeTab === 'private' ? '#0f172a' : '#e2e8f0'}`,
              background: activeTab === 'private' ? '#f8fafc' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontWeight: 800,
              fontSize: '0.78rem',
              color: activeTab === 'private' ? '#0f172a' : '#64748b'
            }}
          >
            <Lock size={14} color={activeTab === 'private' ? '#0f172a' : '#64748b'} />
            <span>Private Lab Library</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection')
              setActiveTab('community')
              setErrorMessage('')
            }}
            style={{
              padding: '10px',
              borderRadius: '12px',
              border: `2px solid ${activeTab === 'community' ? '#2563eb' : '#e2e8f0'}`,
              background: activeTab === 'community' ? '#eff6ff' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontWeight: 800,
              fontSize: '0.78rem',
              color: activeTab === 'community' ? '#2563eb' : '#64748b'
            }}
          >
            <Globe size={14} color={activeTab === 'community' ? '#2563eb' : '#64748b'} />
            <span>Publish to Community</span>
          </button>
        </div>

        {/* Success Alert */}
        {isSuccess ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '20px', textAlign: 'center', color: '#047857' }}>
            <Check size={28} color="#059669" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 800, fontSize: '0.94rem' }}>{successMessage}</div>
          </div>
        ) : (
          <form onSubmit={activeTab === 'private' ? handleSavePrivate : handlePublishCommunity} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {errorMessage && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '8px 12px', fontSize: '0.74rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={14} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Recipe Name & Version */}
            <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Variation Name
                </label>
                <input
                  type="text"
                  value={variationName}
                  onChange={(e) => setVariationName(e.target.value)}
                  placeholder="e.g. Spanish Latte (Oat Silk Twist)"
                  style={{ width: '100%', padding: '9px 10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Version Tag
                </label>
                <input
                  type="text"
                  value={versionTag}
                  onChange={(e) => setVersionTag(e.target.value)}
                  placeholder="e.g. v1.1"
                  style={{ width: '100%', padding: '9px 10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Twist & Technique Notes */}
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                {activeTab === 'community' ? 'What makes this variation unique? (Technique / Twist)' : 'Formulation Notes'}
              </label>
              <textarea
                rows={2}
                value={twistNote}
                onChange={(e) => setTwistNote(e.target.value)}
                placeholder="e.g. Swapped milk to Oatly Barista and dialed down sweetness by 15% for cleaner mouthfeel..."
                style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.78rem', resize: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Target SRP & Margin Preview */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', display: 'block' }}>
                  Target Selling Price (₱)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <span style={{ fontSize: '0.90rem', fontWeight: 800, color: '#0f172a' }}>₱</span>
                  <input
                    type="number"
                    value={targetSellingPrice}
                    onChange={(e) => setTargetSellingPrice(e.target.value)}
                    style={{ width: '75px', padding: '4px 6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 800 }}
                  />
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Total COGS: <strong>₱{cogs.toFixed(2)}</strong></span>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: marginPct >= 70 ? '#15803d' : '#d97706', marginTop: '1px' }}>
                  {marginPct}% Gross Margin
                </div>
              </div>
            </div>

            {/* Target Menu Selector (Private Mode) */}
            {activeTab === 'private' ? (
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Target Menu Collection
                </label>
                <select
                  value={selectedMenuId}
                  onChange={(e) => setSelectedMenuId(e.target.value)}
                  style={{ width: '100%', padding: '9px 10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.80rem', fontWeight: 600, boxSizing: 'border-box' }}
                >
                  {savedMenus.map(m => (
                    <option key={m.id} value={m.id}>📁 {m.title} ({m.drinks?.length || 0} drinks)</option>
                  ))}
                  <option value="new">+ Create New Collection...</option>
                </select>

                {selectedMenuId === 'new' && (
                  <input
                    type="text"
                    placeholder="Enter new collection name (e.g. 🍂 Autumn Signatures 2026)"
                    value={newMenuTitle}
                    onChange={(e) => setNewMenuTitle(e.target.value)}
                    style={{ width: '100%', marginTop: '6px', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.80rem', boxSizing: 'border-box' }}
                  />
                )}
              </div>
            ) : (
              /* Community Attribution Preview (Community Mode) */
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Store size={18} color="#2563eb" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#1e3a8a' }}>
                    Author: {currentUser?.name || 'Barista Creator'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#3b82f6' }}>
                    {currentUser?.shopName || 'Specialty Coffee Lab'} • Public Community Feed
                  </div>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              style={{
                width: '100%',
                background: activeTab === 'community' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#0f172a',
                border: 'none',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '4px',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
              }}
            >
              {activeTab === 'community' ? (
                <>
                  <Globe size={16} />
                  <span>Publish Variation to Community</span>
                </>
              ) : (
                <>
                  <BookmarkCheck size={16} color="#fbbf24" />
                  <span>Save to My Lab Formulations</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
