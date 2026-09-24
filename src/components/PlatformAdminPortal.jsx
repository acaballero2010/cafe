import React, { useState, useMemo } from 'react'
import { 
  ShieldCheck, 
  Users, 
  UploadCloud, 
  FileSpreadsheet, 
  TrendingUp, 
  Store, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertTriangle, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  DollarSign, 
  Coffee, 
  Truck, 
  Star, 
  Clock, 
  Layers, 
  RefreshCw,
  X,
  Send,
  Eye
} from 'lucide-react'
import { AuthDatabase } from '../utils/authDatabase'
import { MASTER_SUPPLIERS, SAMPLE_PRICELISTS } from '../data/suppliersData'
import { triggerHaptic } from '../utils/haptics'

export function PlatformAdminPortal({
  isOpen = false,
  onClose = () => {},
  currentUser,
  onPublishPricelistUpdates = () => {},
  onSwitchUser = () => {}
}) {
  const [activeTab, setActiveTab] = useState('pricelists') // 'pricelists' | 'users' | 'suppliers' | 'analytics'
  const [users, setUsers] = useState(() => AuthDatabase.getUsers())
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all') // 'all' | 'platform_admin' | 'cafe_owner' | 'head_barista'
  const [regionFilter, setRegionFilter] = useState('all')

  // Pricelist Uploader State
  const [selectedSupplierId, setSelectedSupplierId] = useState('sup-gourmet-ph')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [stagedPricelist, setStagedPricelist] = useState(SAMPLE_PRICELISTS['sup-gourmet-ph'] || [])
  const [publishSuccess, setPublishSuccess] = useState(false)

  // New User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState('cafe_owner')
  const [newUserShop, setNewUserShop] = useState('')
  const [newUserBranch, setNewUserBranch] = useState('')
  const [newUserRegion, setNewUserRegion] = useState('Metro Manila')
  const [newUserTier, setNewUserTier] = useState('Pro Commercial')

  if (!isOpen) return null

  const selectedSupplier = MASTER_SUPPLIERS.find(s => s.id === selectedSupplierId) || MASTER_SUPPLIERS[0]

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.shopName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchRole = roleFilter === 'all' || u.role === roleFilter
      const matchRegion = regionFilter === 'all' || u.region === regionFilter
      return matchSearch && matchRole && matchRegion
    })
  }, [users, searchQuery, roleFilter, regionFilter])

  // Handle supplier change
  const handleSelectSupplier = (supplierId) => {
    setSelectedSupplierId(supplierId)
    setStagedPricelist(SAMPLE_PRICELISTS[supplierId] || [
      { skuId: 'sample-sku-1', name: 'Artisanal Flavor Syrup (1L)', category: 'Syrups', oldPrice: 380.00, newPrice: 410.00, uom: 'ml', packSize: 1000, unitCost: 0.410, moq: 4, effectiveDate: '2026-10-01' }
    ])
    setUploadedFile(null)
    setPublishSuccess(false)
  }

  // Simulate file drop / upload
  const handleSimulateFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadedFile(file)
    triggerHaptic('light')

    setTimeout(() => {
      setIsUploading(false)
      // Provide dynamic parsed items
      const sample = SAMPLE_PRICELISTS[selectedSupplierId] || SAMPLE_PRICELISTS['sup-gourmet-ph']
      setStagedPricelist(sample)
      triggerHaptic('success')
    }, 600)
  }

  // Broadcast and publish pricelist updates
  const handlePublishPricelist = () => {
    triggerHaptic('heavy')
    setPublishSuccess(true)

    // Convert staged items to updates format for catalog
    const updates = stagedPricelist.map(item => ({
      skuId: item.skuId,
      name: item.name,
      newPrice: item.newPrice,
      newUnitCost: item.unitCost,
      supplier: selectedSupplier.name
    }))

    onPublishPricelistUpdates(updates, selectedSupplier.name)

    setTimeout(() => {
      setPublishSuccess(false)
    }, 4000)
  }

  // Create new user
  const handleCreateUserSubmit = (e) => {
    e.preventDefault()
    if (!newUserName.trim() || !newUserEmail.trim()) return

    const created = AuthDatabase.addUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      shopName: newUserShop.trim() || `${newUserName}'s Cafe`,
      branch: newUserBranch.trim() || 'Main Branch',
      region: newUserRegion,
      tier: newUserTier
    })

    setUsers(AuthDatabase.getUsers())
    setIsAddUserModalOpen(false)
    setNewUserName('')
    setNewUserEmail('')
    setNewUserShop('')
    setNewUserBranch('')
    triggerHaptic('success')
  }

  const handleDeleteUser = (id) => {
    if (confirm('Are you sure you want to remove this user account?')) {
      const updated = AuthDatabase.deleteUser(id)
      setUsers(updated)
      triggerHaptic('warning')
    }
  }

  const downloadSampleTemplate = () => {
    const csvContent = 'SKU_ID,Item_Name,Category,Old_Price_PHP,New_Price_PHP,UOM,Pack_Size,MOQ,Effective_Date\n' +
      stagedPricelist.map(i => `${i.skuId},"${i.name}",${i.category},${i.oldPrice},${i.newPrice},${i.uom},${i.packSize},${i.moq},${i.effectiveDate}`).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${selectedSupplier.name.toLowerCase().replace(/\s+/g, '_')}_pricelist_2026.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    triggerHaptic('light')
  }

  return (
    <div className="clean-modal-overlay" onClick={onClose} style={{ zIndex: 120 }}>
      <div 
        className="clean-modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '840px', width: '96%', maxHeight: '92vh', padding: '24px', overflowY: 'auto' }}
      >
        <div className="modal-drag-handle" />

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)'
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Platform Admin Console
                </h1>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: '#fef3c7',
                    color: '#b45309',
                    border: '1px solid #fde68a'
                  }}
                >
                  SUPERADMIN
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0' }}>
                Tenant user administration, wholesale supplier ingestion & catalog broadcasting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '6px', 
            borderBottom: '1px solid #e2e8f0', 
            marginBottom: '20px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}
        >
          <button
            onClick={() => setActiveTab('pricelists')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              background: activeTab === 'pricelists' ? '#f8fafc' : 'transparent',
              color: activeTab === 'pricelists' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'pricelists' ? 800 : 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderBottom: activeTab === 'pricelists' ? '2.5px solid #d97706' : 'none'
            }}
          >
            <FileSpreadsheet size={16} color={activeTab === 'pricelists' ? '#d97706' : '#64748b'} />
            <span>Supplier Pricelists</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              background: activeTab === 'users' ? '#f8fafc' : 'transparent',
              color: activeTab === 'users' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'users' ? 800 : 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderBottom: activeTab === 'users' ? '2.5px solid #d97706' : 'none'
            }}
          >
            <Users size={16} color={activeTab === 'users' ? '#d97706' : '#64748b'} />
            <span>User & Cafe Tenants ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('suppliers')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              background: activeTab === 'suppliers' ? '#f8fafc' : 'transparent',
              color: activeTab === 'suppliers' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'suppliers' ? 800 : 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderBottom: activeTab === 'suppliers' ? '2.5px solid #d97706' : 'none'
            }}
          >
            <Truck size={16} color={activeTab === 'suppliers' ? '#d97706' : '#64748b'} />
            <span>Wholesale Suppliers ({MASTER_SUPPLIERS.length})</span>
          </button>
        </div>

        {/* TAB 1: SUPPLIER PRICELIST UPLOADER */}
        {activeTab === 'pricelists' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Control Bar */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0'
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Select Wholesale Supplier
                </label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => handleSelectSupplier(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    background: '#ffffff',
                    outline: 'none'
                  }}
                >
                  {MASTER_SUPPLIERS.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Payment Terms: <strong>{selectedSupplier.terms}</strong> • Min Order: ₱{selectedSupplier.minOrderPhp.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Download CSV Template
                </label>
                <button
                  onClick={downloadSampleTemplate}
                  className="btn-clean btn-clean-secondary"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.78rem' }}
                >
                  <Download size={14} />
                  <span>Download {selectedSupplier.name} Format (.CSV)</span>
                </button>
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '28px 20px',
                textAlign: 'center',
                background: isUploading ? '#fffbeb' : '#fafafa',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                type="file"
                accept=".csv, .xlsx, .xls, .json"
                onChange={handleSimulateFileUpload}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%'
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div 
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <UploadCloud size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {uploadedFile ? `Uploaded: ${uploadedFile.name}` : 'Drop supplier pricelist (.CSV, .XLSX) or Click to Browse'}
                  </h3>
                  <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '4px 0 0' }}>
                    Auto-maps SKU codes, pack weights, density Brix, unit costs & effective margin dates
                  </p>
                </div>
              </div>
            </div>

            {/* Parsed Diff & Price Impact Preview */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Staged Price Shift Preview ({stagedPricelist.length} SKUs)
                  </h3>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: '#ecfdf5',
                      color: '#059669',
                      border: '1px solid #a7f3d0'
                    }}
                  >
                    Ready to Broadcast
                  </span>
                </div>

                <button
                  onClick={handlePublishPricelist}
                  className="btn-clean btn-clean-accent"
                  style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                >
                  <Send size={14} />
                  <span>Publish to Wholesale Market</span>
                </button>
              </div>

              {publishSuccess && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    color: '#065f46',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px',
                    animation: 'toastSpringIn 0.3s ease-out'
                  }}
                >
                  <CheckCircle2 size={18} color="#059669" />
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>
                      Pricelist Broadcasted to All Cafe Tenants!
                    </span>
                    <p style={{ fontSize: '0.72rem', margin: '1px 0 0' }}>
                      Wholesale catalog updated with {selectedSupplier.name} rates. Margin shift alerts generated.
                    </p>
                  </div>
                </div>
              )}

              {/* Items Table */}
              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>SKU & Name</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>Category</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>Previous Pack</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>New Pack (₱)</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>Unit Cost</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>Shift %</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700 }}>MOQ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stagedPricelist.map((item, idx) => {
                      const diffPct = ((item.newPrice - item.oldPrice) / item.oldPrice) * 100
                      const isIncrease = diffPct > 0
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                            <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'monospace' }}>{item.skuId}</span>
                          </td>
                          <td style={{ padding: '10px 12px', color: '#475569' }}>{item.category}</td>
                          <td style={{ padding: '10px 12px', color: '#64748b', textDecoration: isIncrease ? 'line-through' : 'none' }}>
                            ₱{item.oldPrice.toFixed(2)}
                          </td>
                          <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a' }}>
                            ₱{item.newPrice.toFixed(2)}
                          </td>
                          <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#334155' }}>
                            ₱{item.unitCost.toFixed(3)}/{item.uom}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: isIncrease ? '#fff1f2' : diffPct < 0 ? '#ecfdf5' : '#f1f5f9',
                                color: isIncrease ? '#e11d48' : diffPct < 0 ? '#059669' : '#64748b'
                              }}
                            >
                              {diffPct > 0 ? `+${diffPct.toFixed(1)}%` : diffPct < 0 ? `${diffPct.toFixed(1)}%` : '0%'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', color: '#475569' }}>{item.moq} pk</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER & CAFE TENANTS */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Top Filter & Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search name, shop, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{ padding: '8px 10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.78rem', outline: 'none' }}
                >
                  <option value="all">All Roles</option>
                  <option value="platform_admin">Platform SuperAdmin</option>
                  <option value="cafe_owner">Cafe Owner</option>
                  <option value="head_barista">Head Barista</option>
                </select>

                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  style={{ padding: '8px 10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.78rem', outline: 'none' }}
                >
                  <option value="all">All Regions</option>
                  <option value="Metro Manila">Metro Manila</option>
                  <option value="Cebu">Cebu</option>
                  <option value="Davao">Davao</option>
                </select>

                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="btn-clean btn-clean-primary"
                  style={{ padding: '8px 14px', fontSize: '0.78rem' }}
                >
                  <Plus size={14} />
                  <span>Add Tenant</span>
                </button>
              </div>
            </div>

            {/* Users Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {filteredUsers.map(user => {
                const isCurrent = currentUser?.id === user.id
                return (
                  <div
                    key={user.id}
                    style={{
                      background: '#ffffff',
                      border: isCurrent ? '1.5px solid #d97706' : '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '14px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '1.4rem' }}>{user.avatar || '👤'}</span>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            background: user.role === 'platform_admin' ? '#fef3c7' : user.role === 'cafe_owner' ? '#eff6ff' : '#f0fdf4',
                            color: user.role === 'platform_admin' ? '#b45309' : user.role === 'cafe_owner' ? '#1d4ed8' : '#15803d',
                            border: '1px solid rgba(0,0,0,0.05)'
                          }}
                        >
                          {user.tier}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
                        {user.name}
                      </h4>
                      <p style={{ fontSize: '0.74rem', color: '#64748b', margin: 0 }}>
                        {user.email}
                      </p>

                      <div style={{ marginTop: '8px', padding: '8px', borderRadius: '8px', background: '#f8fafc', fontSize: '0.72rem', color: '#334155' }}>
                        <div>🏬 <strong>{user.shopName}</strong></div>
                        <div style={{ color: '#64748b', marginTop: '2px' }}>📍 {user.branch} ({user.region})</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                        {user.activeRecipesCount} Formulations
                      </span>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => {
                            onSwitchUser(user)
                            onClose()
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: 'none',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Switch
                        </button>
                        {user.role !== 'platform_admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            style={{
                              padding: '4px',
                              borderRadius: '6px',
                              background: '#fef2f2',
                              color: '#dc2626',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                            title="Remove User"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SUPPLIERS DIRECTORY */}
        {activeTab === 'suppliers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {MASTER_SUPPLIERS.map(sup => (
                <div
                  key={sup.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {sup.name}
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>
                        ★ {sup.rating}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {sup.category}
                    </span>

                    <div style={{ marginTop: '10px', fontSize: '0.72rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div>💳 Terms: <strong>{sup.terms}</strong> (MOQ ₱{sup.minOrderPhp.toLocaleString()})</div>
                      <div>🚚 Lead Time: <strong>{sup.leadTimeDays} Business Day</strong></div>
                      <div>📍 Coverage: <strong>{sup.region}</strong></div>
                      <div>📞 {sup.contact}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleSelectSupplier(sup.id)
                      setActiveTab('pricelists')
                    }}
                    className="btn-clean btn-clean-secondary"
                    style={{ width: '100%', padding: '6px 10px', fontSize: '0.74rem' }}
                  >
                    <UploadCloud size={13} />
                    <span>Upload New Pricelist</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL: ADD NEW USER / TENANT */}
        {isAddUserModalOpen && (
          <div className="clean-modal-overlay" style={{ zIndex: 130 }}>
            <div className="clean-modal-card" style={{ maxWidth: '440px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Add Registered Cafe Tenant
                </h3>
                <button
                  onClick={() => setIsAddUserModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chef Anton Luna"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="anton@lunabrew.ph"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
                    Cafe / Shop Name
                  </label>
                  <input
                    type="text"
                    placeholder="Luna Artisan Brews"
                    value={newUserShop}
                    onChange={(e) => setNewUserShop(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
                      Role
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                    >
                      <option value="cafe_owner">Cafe Owner</option>
                      <option value="head_barista">Head Barista</option>
                      <option value="platform_admin">Platform Admin</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
                      Region
                    </label>
                    <select
                      value={newUserRegion}
                      onChange={(e) => setNewUserRegion(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                    >
                      <option value="Metro Manila">Metro Manila</option>
                      <option value="Cebu">Cebu</option>
                      <option value="Davao">Davao</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-clean btn-clean-primary"
                  style={{ width: '100%', marginTop: '6px' }}
                >
                  <span>Register Tenant</span>
                  <Check size={14} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
