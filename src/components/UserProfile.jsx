import React, { useState } from 'react'
import { 
  User, 
  Store, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  BookOpen, 
  FolderPlus, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Download, 
  Share2, 
  Layers, 
  Coffee, 
  ShieldCheck, 
  Clock, 
  FileText, 
  ChevronRight,
  ExternalLink
} from 'lucide-react'

export function UserProfile({
  savedMenus,
  onUpdateSavedMenus,
  currentRecipe,
  onLoadRecipeIntoStudio,
  onOpenStudio
}) {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    shopName: 'Kape Craft Studio & Bar',
    branch: 'Bonifacio Global City, Taguig',
    ownerName: 'Chef Marco D.',
    role: 'Owner & Head Beverage Architect',
    targetMarginPct: 75,
    currency: 'PHP (₱)',
    joinedDate: 'Member since Aug 2025'
  })

  // Modal for creating new menu collection
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false)
  const [newMenuTitle, setNewMenuTitle] = useState('')
  const [newMenuDescription, setNewMenuDescription] = useState('')
  const [newMenuSeason, setNewMenuSeason] = useState('Core / Year-Round')

  // Active expanded menu ID
  const [expandedMenuId, setExpandedMenuId] = useState(savedMenus[0]?.id || null)

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setIsEditingProfile(false)
  }

  const handleCreateMenu = (e) => {
    e.preventDefault()
    if (!newMenuTitle.trim()) return

    const newMenu = {
      id: `menu-${Date.now()}`,
      title: newMenuTitle,
      description: newMenuDescription || 'Custom curated drink collection.',
      season: newMenuSeason,
      updatedAt: 'Just now',
      drinks: currentRecipe ? [currentRecipe] : []
    }

    onUpdateSavedMenus([newMenu, ...savedMenus])
    setExpandedMenuId(newMenu.id)
    setNewMenuTitle('')
    setNewMenuDescription('')
    setIsCreateMenuOpen(false)
  }

  const handleDeleteMenu = (menuId) => {
    if (savedMenus.length <= 1) {
      alert('You must keep at least one saved menu.')
      return
    }
    if (confirm('Are you sure you want to delete this menu collection?')) {
      const updated = savedMenus.filter(m => m.id !== menuId)
      onUpdateSavedMenus(updated)
      if (expandedMenuId === menuId) {
        setExpandedMenuId(updated[0]?.id || null)
      }
    }
  }

  const handleRemoveDrinkFromMenu = (menuId, drinkId) => {
    const updated = savedMenus.map(menu => {
      if (menu.id === menuId) {
        return {
          ...menu,
          drinks: menu.drinks.filter(d => d.id !== drinkId)
        }
      }
      return menu
    })
    onUpdateSavedMenus(updated)
  }

  const handleAddCurrentDrinkToMenu = (menuId) => {
    if (!currentRecipe) return
    const updated = savedMenus.map(menu => {
      if (menu.id === menuId) {
        // Prevent exact duplicate ID
        const exists = menu.drinks.some(d => d.id === currentRecipe.id || d.name === currentRecipe.name)
        if (exists) {
          alert(`"${currentRecipe.name}" is already in this menu.`)
          return menu
        }
        return {
          ...menu,
          drinks: [...menu.drinks, currentRecipe]
        }
      }
      return menu
    })
    onUpdateSavedMenus(updated)
    alert(`✓ Added "${currentRecipe.name}" to menu!`)
  }

  // Calculate overall stats across all saved menus
  const allDrinks = savedMenus.flatMap(m => m.drinks)
  const avgCogs = allDrinks.length > 0 
    ? allDrinks.reduce((acc, d) => acc + (d.layers?.reduce((lAcc, l) => lAcc + (l.volumeMl * l.unitCostPerMl), 0) || 42), 0) / allDrinks.length
    : 44.20
  const avgPrice = allDrinks.length > 0
    ? allDrinks.reduce((acc, d) => acc + (d.menuPrice || 180), 0) / allDrinks.length
    : 185.00
  const avgMargin = (((avgPrice - avgCogs) / avgPrice) * 100).toFixed(1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '680px', margin: '0 auto', paddingBottom: '120px' }}>
      
      {/* 1. Shop & Operator Profile Header Card */}
      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            {/* Avatar / Shop Icon */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #0f172a, #334155)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                flexShrink: 0
              }}
            >
              <Store size={26} color="#fbbf24" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
                  {profileData.shopName}
                </h2>
                <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.62rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                  PRO SHOP
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                <MapPin size={12} color="#64748b" />
                <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  {profileData.branch}
                </span>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                {profileData.ownerName} • {profileData.role}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '6px 10px',
              borderRadius: '10px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Edit3 size={12} />
            <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>

        {/* Profile Edit Form Drawer */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.70rem', fontWeight: 700, color: '#64748b' }}>Shop / Café Name</label>
                <input
                  type="text"
                  value={profileData.shopName}
                  onChange={(e) => setProfileData({ ...profileData, shopName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.80rem', fontWeight: 600, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.70rem', fontWeight: 700, color: '#64748b' }}>Branch / City</label>
                <input
                  type="text"
                  value={profileData.branch}
                  onChange={(e) => setProfileData({ ...profileData, branch: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.80rem', fontWeight: 600, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.70rem', fontWeight: 700, color: '#64748b' }}>Operator Name</label>
                <input
                  type="text"
                  value={profileData.ownerName}
                  onChange={(e) => setProfileData({ ...profileData, ownerName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.80rem', fontWeight: 600, boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.70rem', fontWeight: 700, color: '#64748b' }}>Target Gross Margin (%)</label>
                <input
                  type="number"
                  value={profileData.targetMarginPct}
                  onChange={(e) => setProfileData({ ...profileData, targetMarginPct: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.80rem', fontWeight: 600, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                padding: '9px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              Save Shop Settings
            </button>
          </form>
        )}

        {/* Key Store KPIs Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '16px' }}>
          <div style={{ background: '#f8fafc', padding: '10px 8px', borderRadius: '14px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
            <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>SAVED MENUS</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              {savedMenus.length}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px 8px', borderRadius: '14px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
            <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>DRINK SPECS</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              {allDrinks.length}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px 8px', borderRadius: '14px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
            <div style={{ fontSize: '0.62rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>AVG MARGIN</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#059669', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              {avgMargin}%
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px 8px', borderRadius: '14px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
            <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>AVG COGS</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              ₱{avgCogs.toFixed(0)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Saved Menus Section Header & Create Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'var(--font-display)' }}>
            Saved Menus & Lineups ({savedMenus.length})
          </h3>
          <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0' }}>
            Curate, organize, and export customized drink lineups for your café.
          </p>
        </div>

        <button
          onClick={() => setIsCreateMenuOpen(true)}
          style={{
            background: '#0f172a',
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
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)'
          }}
        >
          <Plus size={14} color="#fbbf24" />
          <span>New Menu</span>
        </button>
      </div>

      {/* Create New Menu Modal */}
      {isCreateMenuOpen && (
        <div className="clean-modal-overlay" onClick={() => setIsCreateMenuOpen(false)}>
          <div className="clean-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                  <FolderPlus size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Create New Menu Collection
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
                    Group drink recipes into a seasonal or branch-specific lineup.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateMenu} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Menu Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer 2026 Refreshers, Late Night Mocktails..."
                  value={newMenuTitle}
                  onChange={(e) => setNewMenuTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Season / Schedule
                </label>
                <select
                  value={newMenuSeason}
                  onChange={(e) => setNewMenuSeason(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', background: '#ffffff', boxSizing: 'border-box' }}
                >
                  <option value="Core / Year-Round">Core / Year-Round Menu</option>
                  <option value="Summer Season">Summer Season</option>
                  <option value="Holiday / Winter">Holiday / Christmas Lineup</option>
                  <option value="Late Night Specials">Late Night Specials</option>
                  <option value="Pop-up / Event">Pop-Up & Catering</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Description / Notes
                </label>
                <textarea
                  placeholder="e.g. High-margin signatures optimized for fast rush bar workflow."
                  value={newMenuDescription}
                  onChange={(e) => setNewMenuDescription(e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.80rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateMenuOpen(false)}
                  style={{ background: '#f1f5f9', border: 'none', padding: '9px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#0f172a', border: 'none', padding: '9px 16px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', cursor: 'pointer' }}
                >
                  Create Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. List of Saved Menus (Expandable Cards) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {savedMenus.map(menu => {
          const isExpanded = expandedMenuId === menu.id
          const menuCogs = menu.drinks.length > 0
            ? menu.drinks.reduce((acc, d) => acc + (d.layers?.reduce((lAcc, l) => lAcc + (l.volumeMl * l.unitCostPerMl), 0) || 42), 0) / menu.drinks.length
            : 40.00
          const menuPrice = menu.drinks.length > 0
            ? menu.drinks.reduce((acc, d) => acc + (d.menuPrice || 180), 0) / menu.drinks.length
            : 180.00
          const menuMargin = (((menuPrice - menuCogs) / menuPrice) * 100).toFixed(1)

          return (
            <div
              key={menu.id}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: isExpanded ? '2px solid #0f172a' : '1px solid #e2e8f0',
                padding: '18px 20px',
                boxShadow: isExpanded ? '0 4px 16px rgba(15, 23, 42, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Menu Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ cursor: 'pointer', flex: 1 }} onClick={() => setExpandedMenuId(isExpanded ? null : menu.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {menu.title}
                    </h4>
                    <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.64rem', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px' }}>
                      {menu.season}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '4px 0 0 0' }}>
                    {menu.description} • <strong>{menu.drinks.length} Drinks</strong> • Updated {menu.updatedAt}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => {
                      alert(`Exported Master Menu PDF & Spec Sheet for "${menu.title}"!`)
                    }}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Export Full Menu PDF"
                  >
                    <Download size={12} />
                    <span>Export</span>
                  </button>

                  <button
                    onClick={() => handleDeleteMenu(menu.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '6px'
                    }}
                    title="Delete Menu"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Menu Economics Pill Summary */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', background: '#f8fafc', padding: '8px 12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700 }}>AVG COGS</span>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                    ₱{menuCogs.toFixed(2)}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700 }}>AVG RETAIL</span>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                    ₱{menuPrice.toFixed(2)}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.62rem', color: '#059669', fontWeight: 700 }}>WEIGHTED MARGIN</span>
                  <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#059669', fontFamily: 'var(--font-mono)' }}>
                    {menuMargin}%
                  </div>
                </div>
              </div>

              {/* Expanded Menu Drinks List */}
              {isExpanded && (
                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Drinks in this Lineup ({menu.drinks.length})
                    </span>

                    {currentRecipe && (
                      <button
                        onClick={() => handleAddCurrentDrinkToMenu(menu.id)}
                        style={{
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          color: '#059669',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Plus size={12} />
                        <span>+ Add Current Studio Drink</span>
                      </button>
                    )}
                  </div>

                  {menu.drinks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: '0.78rem' }}>
                      No drinks in this menu yet. Click "+ Add Current Studio Drink" or create recipes in Studio.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {menu.drinks.map((drink, dIdx) => {
                        const drinkCogs = drink.layers?.reduce((acc, l) => acc + (l.volumeMl * l.unitCostPerMl), 0) || 44.20
                        const drinkMargin = ((( (drink.menuPrice || 180) - drinkCogs) / (drink.menuPrice || 180)) * 100).toFixed(0)

                        return (
                          <div
                            key={drink.id || dIdx}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '12px',
                              padding: '10px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '10px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '8px',
                                  background: '#0f172a',
                                  color: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  flexShrink: 0
                                }}
                              >
                                #{dIdx + 1}
                              </div>

                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {drink.name}
                                </div>
                                <div style={{ fontSize: '0.70rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                                  <span>COGS: ₱{drinkCogs.toFixed(2)}</span>
                                  <span>•</span>
                                  <span>Retail: ₱{(drink.menuPrice || 180).toFixed(2)}</span>
                                  <span>•</span>
                                  <strong style={{ color: '#059669' }}>{drinkMargin}% GM</strong>
                                  <span style={{ color: '#2563eb', fontWeight: 600 }}>📋 {(drink.sopSteps?.length || 4)} SOP Steps</span>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                onClick={() => {
                                  onLoadRecipeIntoStudio(drink)
                                  onOpenStudio()
                                }}
                                style={{
                                  background: '#0f172a',
                                  border: 'none',
                                  color: '#ffffff',
                                  padding: '5px 10px',
                                  borderRadius: '8px',
                                  fontSize: '0.70rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <span>Load in Studio</span>
                                <ArrowRight size={11} />
                              </button>

                              <button
                                onClick={() => handleRemoveDrinkFromMenu(menu.id, drink.id)}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#94a3b8',
                                  cursor: 'pointer',
                                  padding: '4px'
                                }}
                                title="Remove from Menu"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
