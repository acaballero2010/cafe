import React, { useState } from 'react'
import { 
  X, Plus, Trash2, Upload, Sparkles, CheckCircle2, Image as ImageIcon, 
  FlaskConical, DollarSign, Tag, Info, Layers, Coffee
} from 'lucide-react'
import { triggerHaptic } from '../utils/haptics'

export function UploadRecipeModal({
  isOpen,
  onClose,
  onSaveRecipe,
  currentUser
}) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('espresso')
  const [description, setDescription] = useState('')
  const [inspiredBy, setInspiredBy] = useState('')
  const [menuPrice, setMenuPrice] = useState(190.00)
  const [targetMarginPct, setTargetMarginPct] = useState(78)
  const [prepTime, setPrepTime] = useState('2 mins')
  const [photoUrl, setPhotoUrl] = useState('/beverages/caramel-macchiato.jpg')
  const [layers, setLayers] = useState([
    { id: 'ul-1', name: 'House Vanilla Syrup', volumeMl: 25, unitCostPerMl: 0.28, colorHex: '#d97706' },
    { id: 'ul-2', name: 'Fresh Milk / Oat Milk', volumeMl: 150, unitCostPerMl: 0.12, colorHex: '#ffffff' },
    { id: 'ul-3', name: 'Espresso Double Shot', volumeMl: 36, unitCostPerMl: 0.65, colorHex: '#422415' }
  ])
  const [sopStepInput, setSopStepInput] = useState('')
  const [sopSteps, setSopSteps] = useState([
    'Combine syrup base in 16oz cup with ice.',
    'Pour milk gently to create bottom layer.',
    'Float double espresso shot over the milk.'
  ])

  if (!isOpen) return null

  const handleAddLayer = () => {
    triggerHaptic('tap')
    setLayers(prev => [
      ...prev,
      {
        id: `ul-${Date.now()}`,
        name: 'New Custom Layer',
        volumeMl: 30,
        unitCostPerMl: 0.20,
        colorHex: '#38bdf8'
      }
    ])
  }

  const handleRemoveLayer = (id) => {
    triggerHaptic('tap')
    if (layers.length <= 1) return
    setLayers(prev => prev.filter(l => l.id !== id))
  }

  const handleLayerChange = (id, field, value) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  const handleAddSopStep = () => {
    if (!sopStepInput.trim()) return
    triggerHaptic('tap')
    setSopSteps(prev => [...prev, sopStepInput.trim()])
    setSopStepInput('')
  }

  const handleRemoveSopStep = (idx) => {
    triggerHaptic('tap')
    setSopSteps(prev => prev.filter((_, i) => i !== idx))
  }

  const totalCogs = layers.reduce((sum, l) => sum + ((l.volumeMl || 0) * (l.unitCostPerMl || 0.15)), 0)
  const grossProfit = menuPrice - totalCogs
  const calculatedMargin = menuPrice > 0 ? Math.round((grossProfit / menuPrice) * 100) : 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    triggerHaptic('success')
    const newRecipe = {
      id: `custom-uploaded-${Date.now()}`,
      name: name.trim(),
      category,
      categoryName: category === 'espresso' ? 'Specialty Espresso' : category === 'matcha' ? 'Ceremonial Matcha' : 'Artisan Boba & Tea',
      temp: 'iced',
      vesselId: 'cold-16oz',
      vesselName: '16oz Glass Tumbler',
      menuPrice: parseFloat(menuPrice) || 180.00,
      targetMarginPct: calculatedMargin,
      prepTime,
      difficulty: 'Medium',
      photoKey: 'caramel-macchiato',
      photoUrl,
      description: description.trim() || 'Custom formulation uploaded by user.',
      inspiredBy: inspiredBy.trim() || undefined,
      authorName: currentUser?.name || 'Barista Creator',
      authorCafe: currentUser?.shopName || 'Independent Studio',
      isUserUploaded: true,
      tags: ['Community Upload', 'Custom Recipe', `${calculatedMargin}% Margin`],
      layers,
      sopSteps,
      sensory: { sweetness: 65, acidity: 30, bitterness: 40, body: 80, aroma: 85, brix: 18.0 }
    }

    onSaveRecipe(newRecipe)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Upload size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Upload & Share Recipe
              </h2>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Publish custom formulation to your account & community
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: '#e2e8f0', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Basic Details */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>Drink Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ube Sea Salt Cloud Latte"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', marginTop: '4px' }}
            />
          </div>

          {/* Category & Inspired By */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '4px', background: '#ffffff' }}
              >
                <option value="espresso">Specialty Espresso</option>
                <option value="matcha">Ceremonial Matcha</option>
                <option value="boba">Artisan Boba & Tea</option>
                <option value="coldbrew">Cold Brew & Cascara</option>
                <option value="mocktails">Craft Mocktails</option>
                <option value="frappe">Frappes & Blended</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>Inspired By (Optional)</label>
              <input
                type="text"
                placeholder="e.g. % Arabica, Starbucks"
                value={inspiredBy}
                onChange={(e) => setInspiredBy(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '4px' }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>Description & Tasting Notes</label>
            <textarea
              rows={2}
              placeholder="Flavors, aroma notes, mouthfeel..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.82rem', marginTop: '4px', fontFamily: 'inherit' }}
            />
          </div>

          {/* Economics Bar (PHP ₱) */}
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b' }}>Target SRP (₱)</span>
              <input
                type="number"
                value={menuPrice}
                onChange={(e) => setMenuPrice(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '6px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}
              />
            </div>

            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b' }}>Live COGS (₱)</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#334155', marginTop: '6px' }}>
                ₱{totalCogs.toFixed(2)}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b' }}>Gross Margin</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: calculatedMargin >= 70 ? '#10b981' : '#f59e0b', marginTop: '6px' }}>
                {calculatedMargin}%
              </div>
            </div>
          </div>

          {/* Layer Stacking Configuration */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                Layers & Ingredients ({layers.length})
              </label>
              <button
                type="button"
                onClick={handleAddLayer}
                style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '8px', padding: '4px 8px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={12} /> Add Layer
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {layers.map((layer, index) => (
                <div key={layer.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', width: '16px' }}>{index + 1}</span>
                  <input
                    type="text"
                    value={layer.name}
                    onChange={(e) => handleLayerChange(layer.id, 'name', e.target.value)}
                    style={{ flex: 2, padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
                    <input
                      type="number"
                      value={layer.volumeMl}
                      onChange={(e) => handleLayerChange(layer.id, 'volumeMl', parseFloat(e.target.value) || 0)}
                      style={{ width: '45px', padding: '6px 4px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.78rem', textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>ml</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLayer(layer.id)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ paddingTop: '8px' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)'
              }}
            >
              <CheckCircle2 size={16} color="#38bdf8" />
              <span>Save & Publish Recipe</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
