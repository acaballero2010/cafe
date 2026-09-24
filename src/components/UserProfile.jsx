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
  ExternalLink,
  Camera,
  Scale,
  FlaskConical,
  BookmarkCheck,
  Award
} from 'lucide-react'
import { BeveragePhotoStudioModal } from './BeveragePhotoStudioModal'
import { BaristaSOPModal } from './BaristaSOPModal'
import { BatchYieldCalculatorModal } from './BatchYieldCalculatorModal'

export function UserProfile({
  savedMenus,
  onUpdateSavedMenus,
  currentRecipe,
  currentUser,
  onOpenAdminLogin = () => {},
  onOpenAdminPortal = () => {},
  onOpenOnboardingWizard = () => {},
  onExitToLanding = () => {},
  onLoadRecipeIntoStudio,
  onOpenStudio
}) {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'rnd' | 'menu'
  const [profileData, setProfileData] = useState({
    shopName: 'Kape Craft Studio & Bar',
    branch: 'Bonifacio Global City, Taguig',
    ownerName: 'Chef Marco D.',
    role: 'Owner & Head Beverage Architect',
    targetMarginPct: 75,
    currency: 'PHP (₱)',
    joinedDate: 'Member since Aug 2025'
  })

  // Modals for recipe actions
  const [activeDrinkForModal, setActiveDrinkForModal] = useState(null)
  const [isPhotoStudioOpen, setIsPhotoStudioOpen] = useState(false)
  const [isSopModalOpen, setIsSopModalOpen] = useState(false)
  const [isYieldModalOpen, setIsYieldModalOpen] = useState(false)

  // Modal for creating new collection
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
    if (confirm('Are you sure you want to delete this collection?')) {
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

  const handleToggleDrinkStatus = (menuId, drinkId) => {
    const updated = savedMenus.map(menu => {
      if (menu.id === menuId) {
        return {
          ...menu,
          drinks: menu.drinks.map(d => {
            if (d.id === drinkId) {
              const nextStatus = d.status === 'menu' ? 'rnd' : 'menu'
              return { ...d, status: nextStatus }
            }
            return d
          })
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
        const exists = menu.drinks.some(d => d.id === currentRecipe.id || d.name === currentRecipe.name)
        if (exists) {
          alert(`"${currentRecipe.name}" is already in this collection.`)
          return menu
        }
        return {
          ...menu,
          drinks: [...menu.drinks, { ...currentRecipe, status: currentRecipe.status || 'rnd' }]
        }
      }
      return menu
    })
    onUpdateSavedMenus(updated)
    alert(`✓ Added "${currentRecipe.name}" to collection!`)
  }

  // Calculate overall stats across all saved formulations
  const allDrinks = savedMenus.flatMap(m => m.drinks)
  const rndCount = allDrinks.filter(d => d.status === 'rnd').length
  const menuCount = allDrinks.filter(d => d.status === 'menu' || !d.status).length

  const avgCogs = allDrinks.length > 0 
    ? allDrinks.reduce((acc, d) => acc + (d.layers?.reduce((lAcc, l) => lAcc + (l.volumeMl * (l.unitCostPerMl || 0.25)), 0) || 42), 0) / allDrinks.length
    : 44.20
  const avgPrice = allDrinks.length > 0
    ? allDrinks.reduce((acc, d) => acc + (d.menuPrice || 180), 0) / allDrinks.length
    : 185.00
  const avgMargin = (((avgPrice - avgCogs) / avgPrice) * 100).toFixed(1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', margin: '0 auto', paddingBottom: '120px' }}>
      
      {/* 1. Shop & Operator Profile Header Card */}
      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0f172a, #334155)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                flexShrink: 0
              }}
            >
              <FlaskConical size={24} color="#fbbf24" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {currentUser?.shopName || profileData.shopName}
                </h2>
                <span 
                  style={{ 
                    fontSize: '0.64rem', 
                    background: currentUser?.role === 'platform_admin' ? '#fef3c7' : '#ecfdf5', 
                    color: currentUser?.role === 'platform_admin' ? '#b45309' : '#059669', 
                    padding: '2px 8px', 
                    borderRadius: '999px', 
                    fontWeight: 800,
                    border: currentUser?.role === 'platform_admin' ? '1px solid #fde68a' : '1px solid #a7f3d0'
                  }}
                >
                  {currentUser?.tier || 'R&D Verified'}
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{currentUser?.name || profileData.ownerName}</span>
                <span>•</span>
                <span>{currentUser?.role === 'platform_admin' ? 'SuperAdmin' : currentUser?.role === 'head_barista' ? 'Head Barista' : 'Cafe Owner'}</span>
              </p>
              <p style={{ fontSize: '0.70rem', color: '#94a3b8', margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={11} />
                <span>{currentUser?.branch || profileData.branch}</span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {currentUser?.role === 'platform_admin' && (
              <button
                onClick={onOpenAdminPortal}
                style={{
                  background: 'linear-gradient(135deg, #d97706, #b45309)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 6px rgba(217, 119, 6, 0.3)'
                }}
              >
                <span>👑 Admin Console</span>
              </button>
            )}

            <button
              onClick={onOpenOnboardingWizard}
              style={{
                background: '#fffbeb',
                color: '#b45309',
                border: '1px solid #fde68a',
                padding: '6px 10px',
                borderRadius: '10px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Launch 4-Step Cafe Setup Wizard"
            >
              <Sparkles size={12} color="#d97706" />
              <span>Wizard</span>
            </button>

            <button
              onClick={onOpenAdminLogin}
              style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                padding: '6px 10px',
                borderRadius: '10px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>🔄 Switch</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('tap')
                onExitToLanding()
              }}
              style={{
                background: '#f8fafc',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                padding: '6px 10px',
                borderRadius: '10px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Return to Overview Landing Page"
            >
              <span>🏠</span>
              <span>Overview</span>
            </button>

            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              style={{
                background: isEditingProfile ? '#0f172a' : '#f8fafc',
                color: isEditingProfile ? '#ffffff' : '#334155',
                border: '1px solid #e2e8f0',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Edit3 size={12} />
              <span>{isEditingProfile ? 'Done' : 'Edit'}</span>
            </button>
          </div>
        </div>

        {/* Edit Profile Drawer */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>Shop Name</label>
                <input
                  type="text"
                  value={profileData.shopName}
                  onChange={(e) => setProfileData({ ...profileData, shopName: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>Branch Location</label>
                <input
                  type="text"
                  value={profileData.branch}
                  onChange={(e) => setProfileData({ ...profileData, branch: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer' }}
            >
              Save Shop Settings
            </button>
          </form>
        )}

        {/* Key Store KPIs Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '14px' }}>
          <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '12px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
            <div style={{ fontSize: '0.60rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>R&D RECIPES</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
              {allDrinks.length}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '12px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
            <div style={{ fontSize: '0.60rem', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase' }}>ON LIVE MENU</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>
              {menuCount}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '12px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
            <div style={{ fontSize: '0.60rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>AVG MARGIN</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#059669', marginTop: '2px' }}>
              {avgMargin}%
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '12px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
            <div style={{ fontSize: '0.60rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>AVG COGS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
              ₱{avgCogs.toFixed(0)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. R&D Lab Formulation Collections Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
        <div>
          <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🧪 Beverage R&D Lab & Formulations</span>
            <span style={{ fontSize: '0.66rem', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
              {savedMenus.length} Collections
            </span>
          </h3>
          <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0 0' }}>
            Manage recipe iterations, station SOP sheets & batch yields.
          </p>
        </div>

        <button
          onClick={() => setIsCreateMenuOpen(true)}
          style={{
            background: '#0f172a',
            border: 'none',
            color: '#ffffff',
            padding: '8px 12px',
            borderRadius: '12px',
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)'
          }}
        >
          <Plus size={13} color="#fbbf24" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '3px', borderRadius: '10px' }}>
        {[
          { id: 'all', label: `All Formulations (${allDrinks.length})` },
          { id: 'rnd', label: `🧪 In R&D (${rndCount})` },
          { id: 'menu', label: `🚀 Active Menu (${menuCount})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '6px 4px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab.id ? '#ffffff' : 'transparent',
              color: activeTab === tab.id ? '#0f172a' : '#64748b',
              fontSize: '0.70rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Create New Collection Modal */}
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
                    Create R&D Collection
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
                    Group formulations for seasonal releases or testing.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateMenu} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Collection Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Signature Cold Foams, Artisanal Matcha R&D..."
                  value={newMenuTitle}
                  onChange={(e) => setNewMenuTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Category / Schedule
                </label>
                <select
                  value={newMenuSeason}
                  onChange={(e) => setNewMenuSeason(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#ffffff', boxSizing: 'border-box' }}
                >
                  <option value="Core / Year-Round">Core / Year-Round Menu</option>
                  <option value="R&D Formulation">Active R&D Formulation</option>
                  <option value="Summer Season">Summer Season</option>
                  <option value="Holiday / Winter">Holiday / Christmas Lineup</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateMenuOpen(false)}
                  style={{ background: '#f1f5f9', border: 'none', padding: '8px 14px', borderRadius: '10px', fontSize: '0.76rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#0f172a', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '0.76rem', fontWeight: 800, color: '#ffffff', cursor: 'pointer' }}
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. List of R&D Formulation Collections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {savedMenus.map(menu => {
          const isExpanded = expandedMenuId === menu.id
          
          const filteredDrinks = menu.drinks.filter(d => {
            if (activeTab === 'rnd') return d.status === 'rnd'
            if (activeTab === 'menu') return d.status === 'menu' || !d.status
            return true
          })

          const menuCogs = menu.drinks.length > 0
            ? menu.drinks.reduce((acc, d) => acc + (d.layers?.reduce((lAcc, l) => lAcc + (l.volumeMl * (l.unitCostPerMl || 0.25)), 0) || 42), 0) / menu.drinks.length
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
                padding: '16px 18px',
                boxShadow: isExpanded ? '0 4px 16px rgba(15, 23, 42, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ cursor: 'pointer', flex: 1 }} onClick={() => setExpandedMenuId(isExpanded ? null : menu.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontSize: '1.0rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {menu.title}
                    </h4>
                    <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
                      {menu.season}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '3px 0 0 0' }}>
                    {menu.description} • <strong>{menu.drinks.length} Formulations</strong> • Updated {menu.updatedAt}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => handleDeleteMenu(menu.id)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
                    title="Delete Collection"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Formulation Metrics Pill */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', background: '#f8fafc', padding: '8px 12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.60rem', color: '#94a3b8', fontWeight: 700 }}>AVG COGS</span>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                    ₱{menuCogs.toFixed(2)}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.60rem', color: '#94a3b8', fontWeight: 700 }}>AVG RETAIL</span>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                    ₱{menuPrice.toFixed(2)}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.60rem', color: '#059669', fontWeight: 700 }}>GROSS MARGIN</span>
                  <div style={{ fontSize: '0.84rem', fontWeight: 900, color: '#059669' }}>
                    {menuMargin}%
                  </div>
                </div>
              </div>

              {/* Expanded Recipes List */}
              {isExpanded && (
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.70rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Recipe Formulations ({filteredDrinks.length})
                    </span>

                    {currentRecipe && (
                      <button
                        onClick={() => handleAddCurrentDrinkToMenu(menu.id)}
                        style={{
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          color: '#059669',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Plus size={11} />
                        <span>+ Add Current Studio Drink</span>
                      </button>
                    )}
                  </div>

                  {filteredDrinks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: '0.74rem' }}>
                      No recipes matching "{activeTab}" filter in this collection.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {filteredDrinks.map((drink, dIdx) => {
                        const drinkCogs = drink.layers?.reduce((acc, l) => acc + (l.volumeMl * (l.unitCostPerMl || 0.25)), 0) || 44.20
                        const drinkPrice = drink.menuPrice || 180.00
                        const drinkMargin = (((drinkPrice - drinkCogs) / drinkPrice) * 100).toFixed(0)
                        const isMenu = drink.status === 'menu'

                        return (
                          <div
                            key={drink.id || dIdx}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '14px',
                              padding: '12px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                                    {drink.name}
                                  </span>
                                  <span style={{ fontSize: '0.62rem', background: '#e2e8f0', color: '#334155', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                    {drink.version || 'v1.0'}
                                  </span>
                                  <button
                                    onClick={() => handleToggleDrinkStatus(menu.id, drink.id)}
                                    style={{
                                      border: 'none',
                                      fontSize: '0.62rem',
                                      fontWeight: 800,
                                      padding: '2px 8px',
                                      borderRadius: '999px',
                                      cursor: 'pointer',
                                      background: isMenu ? '#ecfdf5' : '#f1f5f9',
                                      color: isMenu ? '#059669' : '#64748b'
                                    }}
                                  >
                                    {isMenu ? '🚀 Live on Menu' : '🧪 In R&D'}
                                  </button>
                                </div>

                                <div style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', gap: '6px', marginTop: '2px' }}>
                                  <span>COGS: ₱{drinkCogs.toFixed(2)}</span>
                                  <span>•</span>
                                  <span>Retail: ₱{drinkPrice.toFixed(2)}</span>
                                  <span>•</span>
                                  <strong style={{ color: '#059669' }}>{drinkMargin}% GM</strong>
                                </div>
                              </div>

                              <button
                                onClick={() => handleRemoveDrinkFromMenu(menu.id, drink.id)}
                                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                                title="Remove"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                            {/* 4 Action Buttons for this specific Recipe */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', paddingTop: '6px', borderTop: '1px solid #e2e8f0' }}>
                              <button
                                onClick={() => {
                                  onLoadRecipeIntoStudio(drink)
                                  onOpenStudio()
                                }}
                                style={{
                                  background: '#0f172a',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '5px 4px',
                                  borderRadius: '8px',
                                  fontSize: '0.66rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '2px'
                                }}
                              >
                                <span>Edit Studio</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveDrinkForModal(drink)
                                  setIsPhotoStudioOpen(true)
                                }}
                                style={{
                                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '5px 4px',
                                  borderRadius: '8px',
                                  fontSize: '0.66rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '2px'
                                }}
                              >
                                <Camera size={11} />
                                <span>Photo 8K</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveDrinkForModal(drink)
                                  setIsSopModalOpen(true)
                                }}
                                style={{
                                  background: '#f0f9ff',
                                  border: '1px solid #bae6fd',
                                  color: '#0369a1',
                                  padding: '5px 4px',
                                  borderRadius: '8px',
                                  fontSize: '0.66rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '2px'
                                }}
                              >
                                <FileText size={11} />
                                <span>SOP Card</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveDrinkForModal(drink)
                                  setIsYieldModalOpen(true)
                                }}
                                style={{
                                  background: '#f0fdf4',
                                  border: '1px solid #bbf7d0',
                                  color: '#15803d',
                                  padding: '5px 4px',
                                  borderRadius: '8px',
                                  fontSize: '0.66rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '2px'
                                }}
                              >
                                <Scale size={11} />
                                <span>Prep Yield</span>
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

      {/* Embedded Modals for R&D Actions */}
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
  )
}
