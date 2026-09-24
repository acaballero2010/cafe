import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Clock, ChefHat, Sparkles, Printer, Check, ChevronDown, AlertTriangle, ShieldAlert, Timer, RotateCcw, X, DollarSign, ArrowRight } from 'lucide-react'
import { calculateSubRecipeMetrics } from '../data/defaultSubRecipes'

export function SubRecipeManager({
  subRecipes,
  catalog,
  onUpdateSubRecipes
}) {
  const [selectedSubId, setSelectedSubId] = useState(subRecipes[0]?.id || null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false)

  // Active Kitchen Batches with Live Expiration Timers
  const [activeBatches, setActiveBatches] = useState([
    {
      id: 'batch-01',
      name: 'Warm Muscovado Tapioca Pearls',
      prepTime: '07:30 AM',
      shelfLifeHours: 4,
      totalMinutes: 240,
      remainingMinutes: 142, // ~2h 22m remaining
      status: 'fresh',
      yieldWeight: '1,200g',
      cogs: 134.50
    },
    {
      id: 'batch-02',
      name: 'Sweet Sea Salt Cheese Foam',
      prepTime: 'Yesterday 04:00 PM',
      shelfLifeHours: 24,
      totalMinutes: 1440,
      remainingMinutes: 38, // 38m remaining -> expiring soon
      status: 'expiring_soon',
      yieldWeight: '800ml',
      cogs: 182.00
    },
    {
      id: 'batch-03',
      name: 'Earl Grey Tea Base Concentrate',
      prepTime: 'Yesterday 08:00 AM',
      shelfLifeHours: 12,
      totalMinutes: 720,
      remainingMinutes: 0, // Expired -> Discard
      status: 'expired',
      yieldWeight: '1,000ml',
      cogs: 48.00
    }
  ])

  // Waste & Spillage Audit Log
  const [wasteLogs, setWasteLogs] = useState([
    { id: 'w-1', time: '08:15 AM', type: 'Spill', reason: 'Dropped 16oz Shaken Espresso', lossPhp: 44.20, staff: 'Alex M.' },
    { id: 'w-2', time: '09:30 AM', type: 'Calibration', reason: 'Morning Grinder Dial-in (60g Espresso)', lossPhp: 43.50, staff: 'Rico T.' }
  ])

  // Waste logging form state
  const [wasteType, setWasteType] = useState('spill') // 'spill' | 'expired' | 'purge' | 'comp'
  const [wasteItemName, setWasteItemName] = useState('Iced Brown Sugar Shaken Espresso')
  const [wasteAmountPhp, setWasteAmountPhp] = useState(44.20)
  const [wasteNotes, setWasteNotes] = useState('')

  // Ticker for batch countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBatches(prev => prev.map(b => {
        if (b.remainingMinutes <= 0) return { ...b, status: 'expired', remainingMinutes: 0 }
        const newRemaining = b.remainingMinutes - 1
        const newStatus = newRemaining <= 45 ? 'expiring_soon' : 'fresh'
        return { ...b, remainingMinutes: newRemaining, status: newStatus }
      }))
    }, 60000) // update each minute
    return () => clearInterval(timer)
  }, [])

  const handleRecordWaste = () => {
    const newLog = {
      id: `w-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: wasteType === 'spill' ? 'Spill / Drop' : wasteType === 'expired' ? 'Expired Discard' : wasteType === 'purge' ? 'Dial-In Purge' : 'Customer Comp',
      reason: wasteNotes || wasteItemName,
      lossPhp: Number(wasteAmountPhp) || 0,
      staff: 'Shift Lead'
    }
    setWasteLogs([newLog, ...wasteLogs])
    setIsWasteModalOpen(false)
    setWasteNotes('')
  }

  const handleDiscardExpiredBatch = (batchId) => {
    const batch = activeBatches.find(b => b.id === batchId)
    if (batch) {
      const newLog = {
        id: `w-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Expired Discard',
        reason: `Discarded expired batch: ${batch.name} (${batch.yieldWeight})`,
        lossPhp: batch.cogs,
        staff: 'Station Lead'
      }
      setWasteLogs([newLog, ...wasteLogs])
      setActiveBatches(activeBatches.filter(b => b.id !== batchId))
    }
  }

  const activeSubRecipe = subRecipes.find(s => s.id === selectedSubId) || subRecipes[0]
  const metrics = activeSubRecipe ? calculateSubRecipeMetrics(activeSubRecipe, catalog) : null

  const handleUpdateActive = (updatedFields) => {
    const updated = subRecipes.map(s => s.id === activeSubRecipe.id ? { ...s, ...updatedFields } : s)
    onUpdateSubRecipes(updated)
  }

  const handleAddItem = (ingredientId) => {
    if (!activeSubRecipe || !ingredientId) return
    const ingredient = catalog.find(c => c.id === ingredientId)
    const newItem = {
      ingredientId,
      quantity: 500,
      uom: ingredient?.category === 'milk' || ingredient?.category === 'tea' ? 'ml' : 'g'
    }
    handleUpdateActive({
      items: [...(activeSubRecipe.items || []), newItem]
    })
    setShowAddMenu(false)
  }

  const handleItemQuantityChange = (idx, qty) => {
    const updatedItems = [...activeSubRecipe.items]
    updatedItems[idx] = {
      ...updatedItems[idx],
      quantity: Math.max(0, Number(qty))
    }
    handleUpdateActive({ items: updatedItems })
  }

  const handleRemoveItem = (idx) => {
    const updatedItems = activeSubRecipe.items.filter((_, i) => i !== idx)
    handleUpdateActive({ items: updatedItems })
  }

  const handleLogAndPrint = () => {
    setIsLogged(true)
    setTimeout(() => setIsLogged(false), 2500)
  }

  if (!activeSubRecipe || !metrics) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', margin: '0 auto', paddingBottom: '110px' }}>
      
      {/* 1. Operations Header with Waste Logger Quick Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'var(--font-display)' }}>
            Kitchen Prep & Batch Operations
          </h2>
          <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0' }}>
            Live shelf-life expiration timers, batch cost tracking & waste audit.
          </p>
        </div>

        <button
          onClick={() => setIsWasteModalOpen(true)}
          style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#e11d48',
            padding: '7px 12px',
            borderRadius: '12px',
            fontSize: '0.76rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 1px 2px rgba(225, 29, 72, 0.08)'
          }}
        >
          <Trash2 size={13} color="#e11d48" />
          <span>Log Waste / Spill</span>
        </button>
      </div>

      {/* 2. Active Prep Batches & Live Shelf-Life Expiration Tracker */}
      <div style={{ background: '#ffffff', borderRadius: '20px', padding: '16px 18px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Timer size={16} color="#d97706" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Prep Shelf-Life & Expiration Timers
            </span>
          </div>
          <span style={{ fontSize: '0.70rem', color: '#64748b', fontWeight: 600 }}>
            {activeBatches.filter(b => b.status !== 'expired').length} Active Batches
          </span>
        </div>

        {/* Live Batch Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeBatches.map(b => {
            const isExpired = b.status === 'expired'
            const isExpiringSoon = b.status === 'expiring_soon'
            const hoursLeft = Math.floor(b.remainingMinutes / 60)
            const minsLeft = b.remainingMinutes % 60
            const progressPct = Math.max(0, Math.min(100, (b.remainingMinutes / b.totalMinutes) * 100))

            return (
              <div
                key={b.id}
                style={{
                  background: isExpired ? '#fff1f2' : isExpiringSoon ? '#fffbeb' : '#f8fafc',
                  border: `1px solid ${isExpired ? '#fecdd3' : isExpiringSoon ? '#fde68a' : '#e2e8f0'}`,
                  borderRadius: '14px',
                  padding: '12px 14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 800, color: isExpired ? '#9f1239' : '#0f172a' }}>
                        {b.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '6px',
                          background: isExpired ? '#ef4444' : isExpiringSoon ? '#f59e0b' : '#10b981',
                          color: '#ffffff'
                        }}
                      >
                        {isExpired ? 'EXPIRED' : isExpiringSoon ? 'EXPIRING SOON' : 'FRESH'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                      Logged {b.prepTime} • Yield: {b.yieldWeight} • Batch Value: ₱{b.cogs.toFixed(2)}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {isExpired ? (
                      <button
                        onClick={() => handleDiscardExpiredBatch(b.id)}
                        style={{
                          background: '#e11d48',
                          color: '#ffffff',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        Discard & Log Waste
                      </button>
                    ) : (
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.92rem', color: isExpiringSoon ? '#b45309' : '#059669' }}>
                        {hoursLeft > 0 ? `${hoursLeft}h ` : ''}{minsLeft}m left
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                {!isExpired && (
                  <div style={{ marginTop: '8px', height: '4px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${progressPct}%`,
                        background: isExpiringSoon ? '#f59e0b' : '#10b981',
                        borderRadius: '9999px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. Waste & Spillage Modal */}
      {isWasteModalOpen && (
        <div className="clean-modal-overlay" onClick={() => setIsWasteModalOpen(false)}>
          <div className="clean-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
                  <Trash2 size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Log Kitchen Spill / Waste Event
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
                    Automatically deducts raw materials and accounts for unrecovered ₱ loss.
                  </p>
                </div>
              </div>
              <button onClick={() => setIsWasteModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Waste Reason Type Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px' }}>
              {[
                { id: 'spill', label: '💥 Dropped / Spilled Cup', defaultCost: 44.20 },
                { id: 'expired', label: '⏱️ Expired Batch Leftover', defaultCost: 65.00 },
                { id: 'purge', label: '☕ Espresso Dial-In Purge', defaultCost: 43.50 },
                { id: 'comp', label: '🎁 Customer Service Comp', defaultCost: 48.00 }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setWasteType(t.id)
                    setWasteAmountPhp(t.defaultCost)
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: wasteType === t.id ? '2px solid #e11d48' : '1px solid #e2e8f0',
                    background: wasteType === t.id ? '#fff1f2' : '#ffffff',
                    color: wasteType === t.id ? '#9f1239' : '#334155',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Item Name & Cost Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Item / Batch Description
                </label>
                <input
                  type="text"
                  value={wasteNotes}
                  onChange={(e) => setWasteNotes(e.target.value)}
                  placeholder="e.g. 16oz Shaken Oat Espresso dropped during rush"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Unrecovered Ingredient Cost (PHP ₱)
                </label>
                <input
                  type="number"
                  value={wasteAmountPhp}
                  onChange={(e) => setWasteAmountPhp(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setIsWasteModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', padding: '9px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleRecordWaste}
                style={{ background: '#e11d48', border: 'none', padding: '9px 16px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800, color: '#ffffff', cursor: 'pointer' }}
              >
                Confirm & Record Loss (₱{Number(wasteAmountPhp).toFixed(2)})
              </button>
            </div>

            {/* Waste Log History */}
            <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Today's Waste Audit Log (₱{wasteLogs.reduce((acc, l) => acc + l.lossPhp, 0).toFixed(2)} Total)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                {wasteLogs.map(log => (
                  <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', fontSize: '0.72rem' }}>
                    <div>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>{log.type}</span> • {log.reason}
                      <span style={{ color: '#94a3b8', marginLeft: '6px' }}>({log.time})</span>
                    </div>
                    <span style={{ fontWeight: 800, color: '#e11d48', fontFamily: 'var(--font-mono)' }}>
                      -₱{log.lossPhp.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Batch Selector Carousel (Non-Overlapping, Fixed Width Cards) */}
      <div>
        <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Select Kitchen Prep
        </label>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '6px',
            scrollbarWidth: 'none'
          }}
        >
          {subRecipes.map(s => {
            const isSelected = s.id === activeSubRecipe.id
            const m = calculateSubRecipeMetrics(s, catalog)
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSubId(s.id)}
                style={{
                  minWidth: '180px',
                  maxWidth: '220px',
                  flexShrink: 0,
                  background: isSelected ? '#ffffff' : '#f1f5f9',
                  border: isSelected ? '2px solid #d97706' : '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 3px 10px rgba(217, 119, 6, 0.12)' : 'none'
                }}
              >
                <div
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: isSelected ? '#0f172a' : '#475569',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={s.name}
                >
                  {s.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
                  ₱{m.effectiveUnitCostFormatted}/{s.yieldUom} • {s.shelfLifeHours}h shelf-life
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Active Batch Configuration Card (High-Contrast Light Theme) */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '18px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {/* Title & Description */}
        <div>
          <input
            type="text"
            value={activeSubRecipe.name}
            onChange={(e) => handleUpdateActive({ name: e.target.value })}
            style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#0f172a',
              fontFamily: 'var(--font-display)',
              border: 'none',
              padding: 0,
              width: '100%',
              outline: 'none',
              background: 'transparent'
            }}
            placeholder="Batch Prep Name"
          />
          <input
            type="text"
            value={activeSubRecipe.description || ''}
            onChange={(e) => handleUpdateActive({ description: e.target.value })}
            style={{
              fontSize: '0.82rem',
              color: '#64748b',
              marginTop: '4px',
              border: 'none',
              padding: 0,
              width: '100%',
              outline: 'none',
              background: 'transparent',
              fontWeight: 500
            }}
            placeholder="Slow-simmered dark tapioca pearls soaked in muscovado syrup."
          />
        </div>

        {/* Key Metric Trio (3-Column Stat Block) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            background: '#f8fafc',
            borderRadius: '14px',
            padding: '12px 14px',
            border: '1px solid #e2e8f0'
          }}
        >
          {/* Column 1: Target Yield */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Target Yield
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginTop: '2px' }}>
              <input
                type="number"
                value={activeSubRecipe.targetYieldQty}
                onChange={(e) => handleUpdateActive({ targetYieldQty: Number(e.target.value) })}
                style={{
                  width: '65px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  fontFamily: 'var(--font-mono)',
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{activeSubRecipe.yieldUom}</span>
            </div>
          </div>

          {/* Column 2: Shrinkage Loss */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Shrinkage Loss
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginTop: '2px' }}>
              <input
                type="number"
                step="1"
                min="0"
                max="50"
                value={(activeSubRecipe.prepWasteRate * 100).toFixed(0)}
                onChange={(e) => handleUpdateActive({ prepWasteRate: Number(e.target.value) / 100 })}
                style={{
                  width: '32px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#d97706',
                  fontFamily: 'var(--font-mono)',
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#d97706' }}>%</span>
            </div>
          </div>

          {/* Column 3: Shelf Life */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Shelf Life
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginTop: '2px' }}>
              <input
                type="number"
                min="1"
                value={activeSubRecipe.shelfLifeHours}
                onChange={(e) => handleUpdateActive({ shelfLifeHours: Number(e.target.value) })}
                style={{
                  width: '32px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#2563eb',
                  fontFamily: 'var(--font-mono)',
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#2563eb' }}>hrs</span>
            </div>
          </div>
        </div>

        {/* Shelf Life Texture Window Alert Pill */}
        <div
          style={{
            background: activeSubRecipe.shelfLifeHours <= 4 ? '#fff1f2' : '#f0f9ff',
            border: `1px solid ${activeSubRecipe.shelfLifeHours <= 4 ? '#fecdd3' : '#bae6fd'}`,
            borderRadius: '12px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Clock size={16} color={activeSubRecipe.shelfLifeHours <= 4 ? '#e11d48' : '#0284c7'} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.74rem', color: activeSubRecipe.shelfLifeHours <= 4 ? '#9f1239' : '#0369a1', fontWeight: 600, lineHeight: 1.3 }}>
            {activeSubRecipe.shelfLifeHours <= 4
              ? `Optimal gelatinization holds for ${activeSubRecipe.shelfLifeHours} hours. Expired prep scrap is absorbed in COGS.`
              : `Storage stable for up to ${activeSubRecipe.shelfLifeHours} hours (${(activeSubRecipe.shelfLifeHours / 24).toFixed(0)} days) at 2-4°C.`}
          </span>
        </div>
      </div>

      {/* 4. Raw Materials Included (Elevated White Cards) */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '18px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
            Raw Materials Included
          </h3>

          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#d97706',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            <span>+ Add Ingredient</span>
          </button>
        </div>

        {/* Add Ingredient Dropdown Menu */}
        {showAddMenu && (
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Choose Raw SKU:</span>
            <select
              autoFocus
              onChange={(e) => {
                handleAddItem(e.target.value)
              }}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#0f172a',
                background: '#ffffff',
                outline: 'none'
              }}
            >
              <option value="" disabled selected>Tap to select raw material...</option>
              {catalog.map(c => (
                <option key={c.id} value={c.id}>{c.name} (₱{c.unitCostPerMl.toFixed(3)}/unit)</option>
              ))}
            </select>
          </div>
        )}

        {/* List of Ingredients */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {metrics.itemsDetailed.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}
            >
              {/* Left: Title & Subtext */}
              <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.name.replace(/\s*\([^)]*\)/g, '').trim()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
                  {item.quantity.toLocaleString()} {item.uom} • Base material
                </div>
              </div>

              {/* Right: Cost Pill & Remove */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  ₱{item.totalCost.toFixed(2)}
                </div>

                <button
                  onClick={() => handleRemoveItem(idx)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Remove Ingredient"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Sticky Bottom Summary Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: '60px', // Above bottom navigation tabs
          left: 0,
          right: 0,
          zIndex: 45,
          padding: '0 16px 8px',
          pointerEvents: 'none'
        }}
        className="app-responsive-frame"
      >
        <div
          style={{
            background: '#0f172a',
            borderRadius: '20px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            boxShadow: '0 20px 30px -4px rgba(15, 23, 42, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            pointerEvents: 'auto'
          }}
        >
          {/* Left: Total Batch Cost */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.62rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
              Total Batch Cost
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1.1, marginTop: '2px' }}>
              ₱{metrics.realBatchCostWithWaste.toFixed(2)}
            </span>
            <span style={{ fontSize: '0.62rem', color: '#cbd5e1', fontWeight: 600, marginTop: '1px' }}>
              ₱{metrics.effectiveUnitCostFormatted} per {activeSubRecipe.yieldUom} yield
            </span>
          </div>

          {/* Right: Primary Log & Print Action */}
          <button
            onClick={handleLogAndPrint}
            style={{
              background: 'linear-gradient(135deg, #d97706, #b45309)',
              border: 'none',
              color: '#ffffff',
              padding: '9px 14px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)',
              cursor: 'pointer',
              minHeight: '40px',
              flexShrink: 0
            }}
          >
            {isLogged ? (
              <>
                <Check size={14} />
                <span>Timer Label Printed!</span>
              </>
            ) : (
              <>
                <Printer size={14} />
                <span>Log & Print Label</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  )
}

