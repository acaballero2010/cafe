import React, { useState } from 'react'
import { Plus, Trash2, Clock, ChefHat, AlertCircle, Sparkles, Scale, Percent, ArrowRight } from 'lucide-react'
import { calculateSubRecipeMetrics } from '../data/defaultSubRecipes'

export function SubRecipeManager({
  subRecipes,
  catalog,
  onUpdateSubRecipes
}) {
  const [selectedSubId, setSelectedSubId] = useState(subRecipes[0]?.id || null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)

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

  const handleCreateNewBatch = () => {
    const newBatch = {
      id: `sub-${Date.now()}`,
      name: 'New House Batch / Syrup Prep',
      category: 'syrup',
      targetYieldQty: 1000,
      yieldUom: 'ml',
      prepWasteRate: 0.05,
      shelfLifeHours: 48,
      densityBrix: 50.0,
      colorHex: '#d97706',
      description: 'House-made infusion or cooked batch.',
      sopNotes: 'Combine ingredients, heat to 85°C, cool, strain and date label.',
      items: [
        { ingredientId: catalog[0]?.id || 'tiger-brown-sugar-syrup', quantity: 500, uom: 'ml' }
      ]
    }
    onUpdateSubRecipes([...subRecipes, newBatch])
    setSelectedSubId(newBatch.id)
    setIsCreatingNew(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Sub-Recipe Selector & Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}
              >
                <ChefHat size={18} />
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#fff' }}>
                Batch Preps & Sub-Recipe Engine
              </h2>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Compounds raw ingredients into kitchen preps (Boba batches, cheese caps, cold brew) with cooking shrinkage & shelf-life timers.
            </p>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleCreateNewBatch}
          >
            <Plus size={14} />
            <span>New Batch Prep</span>
          </button>
        </div>

        {/* Batch Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
          {subRecipes.map(s => {
            const isSelected = s.id === activeSubRecipe?.id
            const m = calculateSubRecipeMetrics(s, catalog)
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSubId(s.id)}
                style={{
                  background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 0, 0, 0.25)',
                  border: isSelected ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  cursor: 'pointer',
                  color: isSelected ? '#fbbf24' : 'var(--text-secondary)',
                  textAlign: 'left',
                  minWidth: '170px'
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{s.name}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  ${m.effectiveUnitCostFormatted}/{s.yieldUom} • {s.shelfLifeHours}h shelf-life
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Sub-Recipe Detail Editor */}
      {activeSubRecipe && metrics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Left: Ingredients & Recipe Form */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  value={activeSubRecipe.name}
                  onChange={(e) => handleUpdateActive({ name: e.target.value })}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px dashed var(--border-medium)',
                    color: '#ffffff',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    width: '100%',
                    paddingBottom: '4px',
                    outline: 'none'
                  }}
                />
                <input
                  type="text"
                  value={activeSubRecipe.description || ''}
                  onChange={(e) => handleUpdateActive({ description: e.target.value })}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    width: '100%',
                    marginTop: '4px',
                    outline: 'none'
                  }}
                  placeholder="Batch description and prep notes..."
                />
              </div>
            </div>

            {/* Target Yield & Shelf Life */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Target Yield
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <input
                    type="number"
                    value={activeSubRecipe.targetYieldQty}
                    onChange={(e) => handleUpdateActive({ targetYieldQty: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 8px',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      fontFamily: 'var(--font-mono)',
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{activeSubRecipe.yieldUom}</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Prep Shrinkage Loss
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="50"
                    value={(activeSubRecipe.prepWasteRate * 100).toFixed(0)}
                    onChange={(e) => handleUpdateActive({ prepWasteRate: Number(e.target.value) / 100 })}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 8px',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      color: '#fb7185',
                      fontFamily: 'var(--font-mono)',
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>%</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Shelf Life (Hours)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <input
                    type="number"
                    min="1"
                    value={activeSubRecipe.shelfLifeHours}
                    onChange={(e) => handleUpdateActive({ shelfLifeHours: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 8px',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      color: '#38bdf8',
                      fontFamily: 'var(--font-mono)',
                      outline: 'none'
                    }}
                  />
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>hrs</span>
                </div>
              </div>
            </div>

            {/* Raw Ingredients in this Batch */}
            <div style={{ marginTop: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Raw Ingredients Added
                </span>

                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddItem(e.target.value)
                      e.target.value = ''
                    }
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#ffffff',
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="" disabled selected>+ Add Raw SKU</option>
                  {catalog.map(c => (
                    <option key={c.id} value={c.id} style={{ background: '#111827', color: '#fff' }}>
                      {c.name} (${c.unitCostPerMl.toFixed(4)}/unit)
                    </option>
                  ))}
                </select>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {metrics.itemsDetailed.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                        ${item.unitCost.toFixed(4)} / {item.uom}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleItemQuantityChange(idx, e.target.value)}
                        style={{
                          width: '70px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '4px 6px',
                          fontSize: '0.8rem',
                          color: '#ffffff',
                          textAlign: 'right',
                          fontFamily: 'var(--font-mono)',
                          outline: 'none'
                        }}
                      />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.uom}</span>

                      <div style={{ minWidth: '55px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                        ${item.totalCost.toFixed(2)}
                      </div>

                      <button
                        onClick={() => handleRemoveItem(idx)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Batch Economics & Shelf Life Timer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Batch Cost Card */}
            <div
              className="glass-panel-heavy"
              style={{
                padding: '20px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Effective Compound Unit Cost
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                ${metrics.effectiveUnitCostFormatted}{' '}
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  / {activeSubRecipe.yieldUom}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Standard Serving Cost ({metrics.standardServingQty}{activeSubRecipe.yieldUom}):{' '}
                <strong style={{ color: '#fbbf24' }}>${metrics.servingCost.toFixed(2)}</strong> ({metrics.servingsPerBatch} servings/batch)
              </div>

              {/* Breakdown */}
              <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.74rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Raw Ingredients Total:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#fff' }}>${metrics.rawBatchCost.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Prep Cooking Shrinkage (+{(activeSubRecipe.prepWasteRate * 100).toFixed(0)}%):</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#fb7185' }}>+${metrics.prepWasteDollar.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, paddingTop: '4px', borderTop: '1px dashed var(--border-subtle)' }}>
                  <span style={{ color: '#f8fafc' }}>Total True Batch Cost:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>${metrics.realBatchCostWithWaste.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shelf-Life & Texture Window Alert */}
            <div
              style={{
                background: activeSubRecipe.shelfLifeHours <= 4 ? 'rgba(244, 63, 94, 0.12)' : 'rgba(56, 189, 248, 0.1)',
                border: activeSubRecipe.shelfLifeHours <= 4 ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                gap: '12px'
              }}
            >
              <Clock size={20} color={activeSubRecipe.shelfLifeHours <= 4 ? '#fb7185' : '#38bdf8'} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>
                  {activeSubRecipe.shelfLifeHours <= 4 ? 'Critical Texture Freshness Window' : 'Batch Storage Window'}
                </h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  {activeSubRecipe.shelfLifeHours <= 4
                    ? `This prep holds optimal gelatinized texture for ${activeSubRecipe.shelfLifeHours} hours. Unused portion at shift end must be discarded; scrap is pre-absorbed in finished drink COGS.`
                    : `Refrigerated storage valid for up to ${activeSubRecipe.shelfLifeHours} hours (${(activeSubRecipe.shelfLifeHours / 24).toFixed(0)} days) at 2-4°C.`}
                </p>
              </div>
            </div>

            {/* SOP Preparation Instructions */}
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                Batch SOP Kitchen Steps
              </div>
              <textarea
                value={activeSubRecipe.sopNotes || ''}
                onChange={(e) => handleUpdateActive({ sopNotes: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 10px',
                  color: '#e2e8f0',
                  fontSize: '0.74rem',
                  lineHeight: 1.4,
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
