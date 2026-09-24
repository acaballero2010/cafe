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
  Eye,
  Globe,
  Radio,
  Key,
  Code2,
  Lock,
  Terminal,
  Activity,
  CheckCheck,
  ShoppingBag,
  Share2,
  ExternalLink,
  Percent
} from 'lucide-react'
import { AuthDatabase } from '../utils/authDatabase'
import { MASTER_SUPPLIERS, SAMPLE_PRICELISTS } from '../data/suppliersData'
import { AFFILIATE_CONFIG, generateAffiliateLink } from '../data/affiliateStoresData'
import { triggerHaptic } from '../utils/haptics'

export function PlatformAdminPortal({
  isOpen = false,
  onClose = () => {},
  currentUser,
  onPublishPricelistUpdates = () => {},
  onSwitchUser = () => {}
}) {
  const [activeTab, setActiveTab] = useState('pricelists') // 'pricelists' | 'api_sync' | 'affiliates' | 'users' | 'suppliers'
  const [users, setUsers] = useState(() => AuthDatabase.getUsers())
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all') // 'all' | 'admin' | 'user'
  const [regionFilter, setRegionFilter] = useState('all')

  // CSV Pricelist Uploader State
  const [selectedSupplierId, setSelectedSupplierId] = useState('sup-gourmet-ph')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [stagedPricelist, setStagedPricelist] = useState(SAMPLE_PRICELISTS['sup-gourmet-ph'] || [])
  const [publishSuccess, setPublishSuccess] = useState(false)

  // Supplier API Integration State
  const [apiSupplierId, setApiSupplierId] = useState('sup-gourmet-ph')
  const [apiEndpoint, setApiEndpoint] = useState('https://api.gourmetdirect.ph/v2/wholesale/catalog')
  const [apiToken, setApiToken] = useState('pc_live_sec_89df24b1790a')
  const [isApiSyncing, setIsApiSyncing] = useState(false)
  const [apiSyncLog, setApiSyncLog] = useState(null)
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true)
  const [webhookUrl, setWebhookUrl] = useState('https://pourcraft-os.web.app/api/webhooks/supplier-prices')

  // Affiliate Program Settings State
  const [shopeeTag, setShopeeTag] = useState(AFFILIATE_CONFIG.shopeeAffiliateId)
  const [lazadaTag, setLazadaTag] = useState(AFFILIATE_CONFIG.lazadaAffiliateId)
  const [tiktokTag, setTiktokTag] = useState(AFFILIATE_CONFIG.tiktokAffiliateId)
  const [commRate, setCommRate] = useState(AFFILIATE_CONFIG.defaultCommissionRatePct)
  const [affiliateSaveMsg, setAffiliateSaveMsg] = useState('')

  // New User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState('user')
  const [newUserTitle, setNewUserTitle] = useState('Beverage Recipe Creator')
  const [newUserAffiliation, setNewUserAffiliation] = useState('')
  const [newUserRegion, setNewUserRegion] = useState('Metro Manila')

  if (!isOpen) return null

  const selectedSupplier = MASTER_SUPPLIERS.find(s => s.id === selectedSupplierId) || MASTER_SUPPLIERS[0]
  const selectedApiSupplier = MASTER_SUPPLIERS.find(s => s.id === apiSupplierId) || MASTER_SUPPLIERS[0]

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.affiliation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.shopName?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchRole = roleFilter === 'all' || u.role === roleFilter
      const matchRegion = regionFilter === 'all' || u.region === regionFilter
      return matchSearch && matchRole && matchRegion
    })
  }, [users, searchQuery, roleFilter, regionFilter])

  // Handle supplier change in CSV uploader
  const handleSelectSupplier = (supplierId) => {
    setSelectedSupplierId(supplierId)
    setStagedPricelist(SAMPLE_PRICELISTS[supplierId] || [
      { skuId: 'sample-sku-1', name: 'Artisanal Flavor Syrup (1L)', category: 'Syrups', oldPrice: 380.00, newPrice: 410.00, uom: 'ml', packSize: 1000, unitCost: 0.410, moq: 4, effectiveDate: '2026-10-01' }
    ])
    setUploadedFile(null)
    setPublishSuccess(false)
  }

  // Simulate file drop / CSV upload
  const handleSimulateFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadedFile(file)
    triggerHaptic('light')

    setTimeout(() => {
      setIsUploading(false)
      const sample = SAMPLE_PRICELISTS[selectedSupplierId] || SAMPLE_PRICELISTS['sup-gourmet-ph']
      setStagedPricelist(sample)
      triggerHaptic('success')
    }, 600)
  }

  // Broadcast and publish pricelist updates
  const handlePublishPricelist = () => {
    triggerHaptic('heavy')
    setPublishSuccess(true)

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

  // Trigger Supplier API Live Sync
  const handleTriggerApiSync = () => {
    setIsApiSyncing(true)
    triggerHaptic('tap')

    setTimeout(() => {
      setIsApiSyncing(false)
      const itemsCount = stagedPricelist.length || 18
      setApiSyncLog({
        timestamp: new Date().toLocaleTimeString(),
        status: 'success',
        statusCode: 200,
        latencyMs: 128,
        supplierName: selectedApiSupplier.name,
        syncedSkusCount: itemsCount,
        payloadSample: {
          supplierId: apiSupplierId,
          syncBatchId: `sync-${Date.now()}`,
          currency: 'PHP',
          skusUpdated: stagedPricelist.map(i => ({ sku: i.skuId, pricePhp: i.newPrice, unitCost: i.unitCost }))
        }
      })

      const updates = stagedPricelist.map(item => ({
        skuId: item.skuId,
        name: item.name,
        newPrice: item.newPrice,
        newUnitCost: item.unitCost,
        supplier: selectedApiSupplier.name
      }))
      onPublishPricelistUpdates(updates, selectedApiSupplier.name)
      triggerHaptic('success')
    }, 1200)
  }

  // Save Affiliate Settings
  const handleSaveAffiliateSettings = (e) => {
    e.preventDefault()
    triggerHaptic('success')
    AFFILIATE_CONFIG.shopeeAffiliateId = shopeeTag
    AFFILIATE_CONFIG.lazadaAffiliateId = lazadaTag
    AFFILIATE_CONFIG.tiktokAffiliateId = tiktokTag
    AFFILIATE_CONFIG.defaultCommissionRatePct = Number(commRate)
    setAffiliateSaveMsg('✓ Affiliate partner IDs & commission rates updated successfully!')
    setTimeout(() => setAffiliateSaveMsg(''), 3000)
  }

  // Create new user
  const handleCreateUserSubmit = (e) => {
    e.preventDefault()
    if (!newUserName.trim() || !newUserEmail.trim()) return

    const created = AuthDatabase.addUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      title: newUserTitle.trim() || 'Beverage Recipe Creator',
      affiliation: newUserAffiliation.trim() || 'Independent Creator',
      region: newUserRegion
    })

    setUsers(AuthDatabase.getUsers())
    setIsAddUserModalOpen(false)
    setNewUserName('')
    setNewUserEmail('')
    setNewUserAffiliation('')
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
        style={{ maxWidth: '920px', width: '96%', maxHeight: '92vh', padding: '24px', overflowY: 'auto' }}
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
                  Platform SuperAdmin Console
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
                  SYSTEM MASTER
                </span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '2px 0 0' }}>
                CSV pricelist ingestion, supplier REST API sync, Shopee/Lazada affiliate hub & creator user management
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
            gap: '8px', 
            background: '#f8fafc', 
            padding: '4px', 
            borderRadius: '14px', 
            border: '1px solid #e2e8f0', 
            marginBottom: '20px',
            overflowX: 'auto'
          }}
        >
          <button
            onClick={() => setActiveTab('pricelists')}
            style={{
              flex: '1 0 auto',
              padding: '9px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'pricelists' ? '#ffffff' : 'transparent',
              color: activeTab === 'pricelists' ? '#0f172a' : '#64748b',
              fontWeight: 800,
              fontSize: '0.76rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: activeTab === 'pricelists' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <FileSpreadsheet size={15} color={activeTab === 'pricelists' ? '#d97706' : '#64748b'} />
            <span>📁 CSV Ingestion</span>
          </button>

          <button
            onClick={() => setActiveTab('api_sync')}
            style={{
              flex: '1 0 auto',
              padding: '9px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'api_sync' ? '#ffffff' : 'transparent',
              color: activeTab === 'api_sync' ? '#0f172a' : '#64748b',
              fontWeight: 800,
              fontSize: '0.76rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: activeTab === 'api_sync' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <Radio size={15} color={activeTab === 'api_sync' ? '#0284c7' : '#64748b'} />
            <span>⚡ Supplier APIs</span>
          </button>

          <button
            onClick={() => setActiveTab('affiliates')}
            style={{
              flex: '1 0 auto',
              padding: '9px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'affiliates' ? '#ffffff' : 'transparent',
              color: activeTab === 'affiliates' ? '#0f172a' : '#64748b',
              fontWeight: 800,
              fontSize: '0.76rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: activeTab === 'affiliates' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <ShoppingBag size={15} color={activeTab === 'affiliates' ? '#ea580c' : '#64748b'} />
            <span>🛒 Affiliate Partners & Comm</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              flex: '1 0 auto',
              padding: '9px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'users' ? '#ffffff' : 'transparent',
              color: activeTab === 'users' ? '#0f172a' : '#64748b',
              fontWeight: 800,
              fontSize: '0.76rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: activeTab === 'users' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <Users size={15} color={activeTab === 'users' ? '#16a34a' : '#64748b'} />
            <span>👥 Creators ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('suppliers')}
            style={{
              flex: '1 0 auto',
              padding: '9px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'suppliers' ? '#ffffff' : 'transparent',
              color: activeTab === 'suppliers' ? '#0f172a' : '#64748b',
              fontWeight: 800,
              fontSize: '0.76rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: activeTab === 'suppliers' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <Store size={15} color={activeTab === 'suppliers' ? '#9333ea' : '#64748b'} />
            <span>🏬 Suppliers ({MASTER_SUPPLIERS.length})</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: CSV / EXCEL PRICELIST INGESTION                       */}
        {/* ============================================================ */}
        {activeTab === 'pricelists' && (
          <div>
            {/* Supplier Selector Grid */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Select Wholesale Supplier for CSV Pricelist Update
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                {MASTER_SUPPLIERS.map(sup => {
                  const isSelected = sup.id === selectedSupplierId
                  return (
                    <div
                      key={sup.id}
                      onClick={() => handleSelectSupplier(sup.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #d97706' : '1px solid #e2e8f0',
                        background: isSelected ? '#fffbeb' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{sup.name}</span>
                        {isSelected && <Check size={14} color="#d97706" />}
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                        {sup.category} • {sup.skuCount} SKUs
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* CSV File Upload Dropzone */}
            <div
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '24px 20px',
                textAlign: 'center',
                background: '#f8fafc',
                marginBottom: '20px',
                position: 'relative'
              }}
            >
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
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
              <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', background: '#fffbeb', color: '#d97706', marginBottom: '10px' }}>
                <UploadCloud size={24} />
              </div>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                {isUploading ? 'Parsing Pricelist CSV...' : uploadedFile ? `Uploaded: ${uploadedFile.name}` : 'Drop supplier CSV / Excel pricelist file here'}
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 12px' }}>
                Supports standard columns: SKU_ID, Item_Name, Category, New_Price_PHP, Pack_Size, UOM
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={downloadSampleTemplate}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Download size={13} />
                  <span>Download Sample CSV Template</span>
                </button>
              </div>
            </div>

            {/* Staged Pricelist Diff Viewer */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                    Parsed Items from {selectedSupplier.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>
                    {stagedPricelist.length} SKU line items ready for wholesale broadcast
                  </span>
                </div>

                <button
                  onClick={handlePublishPricelist}
                  disabled={stagedPricelist.length === 0}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: publishSuccess ? '#16a34a' : 'linear-gradient(135deg, #d97706, #b45309)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)'
                  }}
                >
                  {publishSuccess ? (
                    <>
                      <CheckCheck size={14} />
                      <span>Broadcasted to Studio!</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Broadcast Pricelist to App</span>
                    </>
                  )}
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', color: '#475569', fontWeight: 700 }}>
                      <th style={{ padding: '10px 14px' }}>SKU Code</th>
                      <th style={{ padding: '10px 14px' }}>Ingredient Item</th>
                      <th style={{ padding: '10px 14px' }}>Pack Size</th>
                      <th style={{ padding: '10px 14px' }}>Old Price</th>
                      <th style={{ padding: '10px 14px' }}>New Wholesale ₱</th>
                      <th style={{ padding: '10px 14px' }}>Delta %</th>
                      <th style={{ padding: '10px 14px' }}>Portion Unit Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stagedPricelist.map((item, idx) => {
                      const diff = item.newPrice - item.oldPrice
                      const pct = item.oldPrice > 0 ? ((diff / item.oldPrice) * 100).toFixed(1) : '0.0'
                      const isSpike = diff > 0
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: isSpike ? '#fffbeb' : '#ffffff' }}>
                          <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#64748b' }}>
                            {item.skuId}
                          </td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>
                            {item.name}
                          </td>
                          <td style={{ padding: '10px 14px', color: '#64748b' }}>
                            {item.packSize}{item.uom}
                          </td>
                          <td style={{ padding: '10px 14px', color: '#94a3b8' }}>
                            ₱{item.oldPrice.toFixed(2)}
                          </td>
                          <td style={{ padding: '10px 14px', fontWeight: 800, color: '#0f172a' }}>
                            ₱{item.newPrice.toFixed(2)}
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <span 
                              style={{ 
                                padding: '2px 6px', 
                                borderRadius: '4px', 
                                fontWeight: 800, 
                                fontSize: '0.68rem',
                                background: diff > 0 ? '#fee2e2' : diff < 0 ? '#dcfce7' : '#f1f5f9',
                                color: diff > 0 ? '#dc2626' : diff < 0 ? '#16a34a' : '#64748b'
                              }}
                            >
                              {diff > 0 ? `+${pct}% ↗` : diff < 0 ? `${pct}% ↘` : '0%'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#d97706' }}>
                            ₱{item.unitCost?.toFixed(3)} / {item.uom}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: BIG SUPPLIER REST API & WEBHOOK CONNECTORS            */}
        {/* ============================================================ */}
        {activeTab === 'api_sync' && (
          <div>
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '14px', padding: '14px 16px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Radio size={22} color="#0284c7" style={{ flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0369a1', margin: 0 }}>
                  Automated B2B Supplier Integration Hub
                </h3>
                <p style={{ fontSize: '0.72rem', color: '#0c4a6e', margin: '2px 0 0' }}>
                  Direct REST API connectors and webhook endpoints for automated wholesale catalog synchronization across major Philippine beverage distributors.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              {/* Connector Configuration Form */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px' }}>
                <h4 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Code2 size={16} color="#d97706" />
                  <span>Supplier REST API Config</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Target Wholesale Supplier
                    </label>
                    <select
                      value={apiSupplierId}
                      onChange={(e) => {
                        setApiSupplierId(e.target.value)
                        const sup = MASTER_SUPPLIERS.find(s => s.id === e.target.value)
                        if (sup) {
                          setApiEndpoint(`https://api.${sup.name.toLowerCase().replace(/\s+/g, '')}.ph/v2/catalog`)
                        }
                      }}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', fontWeight: 700 }}
                    >
                      {MASTER_SUPPLIERS.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      API Endpoint URL (GET / POST)
                    </label>
                    <input
                      type="text"
                      value={apiEndpoint}
                      onChange={(e) => setApiEndpoint(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.74rem', fontFamily: 'monospace', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Wholesale B2B API Token / Secret
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Key size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="password"
                        value={apiToken}
                        onChange={(e) => setApiToken(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.74rem', fontFamily: 'monospace', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155' }}>Daily Auto-Sync Cron</span>
                    <input
                      type="checkbox"
                      checked={autoSyncEnabled}
                      onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>

                  <button
                    onClick={handleTriggerApiSync}
                    disabled={isApiSyncing}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: isApiSyncing ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                      opacity: isApiSyncing ? 0.7 : 1
                    }}
                  >
                    <RefreshCw size={14} className={isApiSyncing ? 'animate-spin' : ''} />
                    <span>{isApiSyncing ? 'Connecting & Syncing Catalog...' : 'Test Connection & Sync Now'}</span>
                  </button>
                </div>
              </div>

              {/* Webhook & Live Status Panel */}
              <div style={{ background: '#0f172a', color: '#f8fafc', borderRadius: '16px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={16} color="#4ade80" />
                      <span>Live Sync Terminal & Telemetry</span>
                    </h4>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                      CONNECTED
                    </span>
                  </div>

                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '0 0 12px' }}>
                    Incoming Webhook Endpoint for automated price-push alerts from supplier ERP systems:
                  </p>

                  <div style={{ background: '#1e293b', padding: '8px 10px', borderRadius: '8px', border: '1px solid #334155', fontSize: '0.7rem', fontFamily: 'monospace', color: '#38bdf8', wordBreak: 'break-all', marginBottom: '14px' }}>
                    {webhookUrl}
                  </div>

                  {apiSyncLog ? (
                    <div style={{ background: '#1e293b', borderRadius: '8px', padding: '10px', border: '1px solid #334155' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', marginBottom: '6px' }}>
                        <span>Last sync: {apiSyncLog.timestamp}</span>
                        <span style={{ color: '#4ade80', fontWeight: 800 }}>HTTP {apiSyncLog.statusCode} ({apiSyncLog.latencyMs}ms)</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#f8fafc', fontWeight: 700, marginBottom: '6px' }}>
                        ✓ Successfully pulled {apiSyncLog.syncedSkusCount} verified SKUs from {apiSyncLog.supplierName}
                      </div>
                      <pre style={{ fontSize: '0.64rem', color: '#cbd5e1', background: '#090d16', padding: '6px', borderRadius: '4px', overflowX: 'auto', margin: 0 }}>
                        {JSON.stringify(apiSyncLog.payloadSample, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '24px 12px', color: '#64748b', fontSize: '0.74rem' }}>
                      Click "Test Connection & Sync Now" to verify endpoint handshake.
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '12px', fontSize: '0.66rem', color: '#64748b', borderTop: '1px solid #334155', paddingTop: '8px' }}>
                  🔒 SSL TLS 1.3 Encryption • Rate Limit: 10,000 req/hour
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: AFFILIATE PARTNERS & EARNINGS HUB                     */}
        {/* ============================================================ */}
        {activeTab === 'affiliates' && (
          <div>
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '14px', padding: '14px 16px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShoppingBag size={24} color="#ea580c" style={{ flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#9a3412', margin: 0 }}>
                  Shopee & Lazada Affiliate Monetization Hub
                </h3>
                <p style={{ fontSize: '0.72rem', color: '#c2410c', margin: '2px 0 0' }}>
                  When baristas and beverage creators explore ingredients in recipes and click through to buy on Shopee or Lazada, your affiliate tag is automatically injected for verified referral revenue.
                </p>
              </div>
            </div>

            {/* Metrics Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Referral Clicks</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0', fontFamily: 'var(--font-display)' }}>1,482</div>
                <span style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 700 }}>+18.4% this week</span>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Converted Orders</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0', fontFamily: 'var(--font-display)' }}>184</div>
                <span style={{ fontSize: '0.65rem', color: '#0284c7', fontWeight: 700 }}>12.4% Conv. Rate</span>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Gross Sourcing GMV</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0', fontFamily: 'var(--font-display)' }}>₱142,850</div>
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Estimated GMV</span>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '14px' }}>
                <span style={{ fontSize: '0.68rem', color: '#b45309', fontWeight: 700, textTransform: 'uppercase' }}>Est. Affiliate Payout</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#d97706', margin: '4px 0 0', fontFamily: 'var(--font-display)' }}>₱9,285.25</div>
                <span style={{ fontSize: '0.65rem', color: '#b45309', fontWeight: 700 }}>6.5% Net Commission</span>
              </div>
            </div>

            {/* Affiliate Partner Config Form */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={16} color="#ea580c" />
                <span>Affiliate Partner Credentials & Tracking IDs</span>
              </h4>

              {affiliateSaveMsg && (
                <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', padding: '8px 12px', borderRadius: '8px', fontSize: '0.74rem', marginBottom: '12px' }}>
                  {affiliateSaveMsg}
                </div>
              )}

              <form onSubmit={handleSaveAffiliateSettings} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>
                    Shopee Affiliate Partner Tag / ID
                  </label>
                  <input
                    type="text"
                    value={shopeeTag}
                    onChange={(e) => setShopeeTag(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>
                    Lazada Affiliate Partner Tag / ID
                  </label>
                  <input
                    type="text"
                    value={lazadaTag}
                    onChange={(e) => setLazadaTag(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>
                    TikTok Shop Affiliate Tag / ID
                  </label>
                  <input
                    type="text"
                    value={tiktokTag}
                    onChange={(e) => setTiktokTag(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>
                    Avg Commission Payout (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={commRate}
                    onChange={(e) => setCommRate(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)'
                    }}
                  >
                    <Check size={14} />
                    <span>Save Affiliate Credentials</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Top Converting Ingredients Table */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Top Sourced Ingredients Across Community
                </h4>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', color: '#475569', fontWeight: 700 }}>
                    <th style={{ padding: '10px 14px' }}>Ingredient</th>
                    <th style={{ padding: '10px 14px' }}>Top Converting Store</th>
                    <th style={{ padding: '10px 14px' }}>Clicks</th>
                    <th style={{ padding: '10px 14px' }}>Orders</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Est. Commission</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>Oatly Barista Edition (1L)</td>
                    <td style={{ padding: '10px 14px', color: '#ee4d2d', fontWeight: 700 }}>Shopee Mall • Oatly Official</td>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>412</td>
                    <td style={{ padding: '10px 14px', color: '#059669', fontWeight: 700 }}>58</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, color: '#d97706' }}>₱3,120.00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>Kyoto Uji Ceremonial Matcha (100g)</td>
                    <td style={{ padding: '10px 14px', color: '#0f146d', fontWeight: 700 }}>Lazada Flagship • Kyoto Uji PH</td>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>285</td>
                    <td style={{ padding: '10px 14px', color: '#059669', fontWeight: 700 }}>34</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, color: '#d97706' }}>₱2,450.00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>Monin Salted Caramel Syrup (700ml)</td>
                    <td style={{ padding: '10px 14px', color: '#ee4d2d', fontWeight: 700 }}>Shopee Mall • Monin PH</td>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>198</td>
                    <td style={{ padding: '10px 14px', color: '#059669', fontWeight: 700 }}>26</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, color: '#d97706' }}>₱1,180.00</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>Top Creamery Tapioca Pearls (1kg)</td>
                    <td style={{ padding: '10px 14px', color: '#ee4d2d', fontWeight: 700 }}>Shopee Mall • Top Creamery</td>
                    <td style={{ padding: '10px 14px', color: '#64748b' }}>340</td>
                    <td style={{ padding: '10px 14px', color: '#059669', fontWeight: 700 }}>42</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, color: '#d97706' }}>₱940.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: USER & CREATOR MANAGEMENT                             */}
        {/* ============================================================ */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 0 200px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search creators by name, email, specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.74rem', fontWeight: 700 }}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Platform Admin</option>
                  <option value="user">Beverage Creator / R&D</option>
                </select>

                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #16a34a, #15803d)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)'
                  }}
                >
                  <Plus size={14} />
                  <span>Add User</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: '#475569', fontWeight: 700 }}>
                    <th style={{ padding: '10px 14px' }}>User / Creator</th>
                    <th style={{ padding: '10px 14px' }}>Role</th>
                    <th style={{ padding: '10px 14px' }}>Specialty / Affiliation</th>
                    <th style={{ padding: '10px 14px' }}>Region</th>
                    <th style={{ padding: '10px 14px' }}>Recipes</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => {
                    const isAdmin = user.role === 'admin'
                    return (
                      <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.1rem' }}>{user.avatar || '👤'}</span>
                            <div>
                              <div style={{ fontWeight: 800, color: '#0f172a' }}>{user.name}</div>
                              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              background: isAdmin ? '#fef3c7' : '#eff6ff',
                              color: isAdmin ? '#b45309' : '#1d4ed8',
                              border: `1px solid ${isAdmin ? '#fde68a' : '#bfdbfe'}`
                            }}
                          >
                            {isAdmin ? '👑 SuperAdmin' : '👨‍🍳 Creator'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', color: '#334155', fontWeight: 600 }}>
                          <div>{user.title || 'Beverage Consultant'}</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{user.affiliation || user.shopName || 'Independent'}</div>
                        </td>
                        <td style={{ padding: '10px 14px', color: '#64748b' }}>
                          {user.region || 'Metro Manila'}
                        </td>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: '#d97706' }}>
                          {user.activeRecipesCount || 12}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                            <button
                              onClick={() => {
                                onSwitchUser(user)
                                onClose()
                              }}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                background: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                color: '#334155',
                                cursor: 'pointer'
                              }}
                              title="Switch active session to this user"
                            >
                              Impersonate
                            </button>
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                style={{
                                  padding: '4px 6px',
                                  borderRadius: '6px',
                                  background: '#fee2e2',
                                  border: '1px solid #fca5a5',
                                  color: '#dc2626',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: MASTER WHOLESALE SUPPLIERS DIRECTORY                  */}
        {/* ============================================================ */}
        {activeTab === 'suppliers' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
            {MASTER_SUPPLIERS.map(sup => (
              <div
                key={sup.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {sup.name}
                    </h3>
                    <span style={{ fontSize: '0.62rem', background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '999px', fontWeight: 800 }}>
                      VERIFIED
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 10px' }}>
                    {sup.category}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.7rem', color: '#475569' }}>
                    <div><strong>Terms:</strong> {sup.terms} • <strong>Min Order:</strong> ₱{sup.minOrderPhp}</div>
                    <div><strong>Region:</strong> {sup.region}</div>
                    <div><strong>Catalog:</strong> {sup.skuCount} active ingredients</div>
                  </div>
                </div>

                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 800 }}>
                    ★ {sup.rating}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedSupplierId(sup.id)
                      setActiveTab('pricelists')
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#d97706',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <span>Update Pricelist</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add User */}
        {isAddUserModalOpen && (
          <div className="clean-modal-overlay" style={{ zIndex: 130 }} onClick={() => setIsAddUserModalOpen(false)}>
            <div className="clean-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Add Platform User
                </h3>
                <button onClick={() => setIsAddUserModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>Full Name</label>
                  <input type="text" required placeholder="Chef Sarah Santos" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>Email</label>
                  <input type="email" required placeholder="sarah@beveragelab.ph" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>Specialty / Title</label>
                  <input type="text" placeholder="e.g. Senior Barista / Q-Grader / Consultant" value={newUserTitle} onChange={(e) => setNewUserTitle(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>Store / Brand Name (Optional)</label>
                  <input type="text" placeholder="e.g. Luna Roastworks (or blank)" value={newUserAffiliation} onChange={(e) => setNewUserAffiliation(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>Role</label>
                    <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.76rem' }}>
                      <option value="user">Beverage Creator</option>
                      <option value="admin">Platform Admin</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '3px' }}>Region</label>
                    <select value={newUserRegion} onChange={(e) => setNewUserRegion(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.76rem' }}>
                      <option value="Metro Manila">Metro Manila</option>
                      <option value="Cebu">Cebu</option>
                      <option value="Davao">Davao</option>
                      <option value="North Luzon">North Luzon</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '8px',
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #16a34a, #15803d)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Create User
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
