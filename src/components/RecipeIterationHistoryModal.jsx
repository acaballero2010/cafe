import React, { useState } from 'react'
import {
  History,
  GitBranch,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sliders,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  X,
  Layers,
  DollarSign
} from 'lucide-react'
import { calculateSensoryProfile } from '../utils/beverageCalculators'

export function RecipeIterationHistoryModal({
  isOpen,
  onClose,
  recipe,
  onUpdateRecipe,
  currentUser
}) {
  const [newVersionNotes, setNewVersionNotes] = useState('')
  const [selectedVersionId, setSelectedVersionId] = useState(null)
  const [isCreatingVersion, setIsCreatingVersion] = useState(false)

  if (!isOpen || !recipe) return null

  // Ensure revisions array exists on recipe
  const revisions = recipe.revisions || [
    {
      id: 'rev-base-1',
      version: 'v1.0 (Original Baseline)',
      timestamp: '2026-09-01 10:00 AM',
      author: recipe.authorName || 'Marco Dela Cruz',
      notes: 'Initial production baseline recipe formulation.',
      cogs: recipe.cogs || 42.50,
      price: recipe.price || 180,
      layers: recipe.layers || []
    }
  ]

  const activeCompareRevision = revisions.find(r => r.id === selectedVersionId) || revisions[0]

  const handleCreateNewRevision = (e) => {
    e.preventDefault()
    if (!newVersionNotes.trim()) return

    const nextVerNum = (revisions.length + 1).toFixed(1)
    const newRev = {
      id: `rev-${Date.now()}`,
      version: `v${nextVerNum}`,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      author: currentUser?.name || 'Chef Marco D.',
      notes: newVersionNotes.trim(),
      cogs: recipe.cogs || 45.00,
      price: recipe.price || 180,
      layers: JSON.parse(JSON.stringify(recipe.layers || []))
    }

    const updatedRevisions = [newRev, ...revisions]
    onUpdateRecipe({
      ...recipe,
      revisions: updatedRevisions,
      currentVersion: newRev.version
    })

    setNewVersionNotes('')
    setIsCreatingVersion(false)
    setSelectedVersionId(newRev.id)
  }

  const handleRestoreVersion = (rev) => {
    onUpdateRecipe({
      ...recipe,
      layers: JSON.parse(JSON.stringify(rev.layers)),
      currentVersion: rev.version
    })
    onClose()
  }

  // Sensory Profile comparison
  const currentSensory = calculateSensoryProfile(recipe)
  const comparedSensory = calculateSensoryProfile(activeCompareRevision)

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '920px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#059669',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}>
              🔬
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                R&D Versioning & Iteration History
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Recipe: <strong>{recipe.title || recipe.name}</strong> • Compare sensory & COGS across test iterations.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: '#f1f5f9',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
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

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px' }}>
          {/* Left Column: Revision Timeline */}
          <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155' }}>REVISIONS TIMELINE</span>
              <button
                type="button"
                onClick={() => setIsCreatingVersion(true)}
                style={{
                  border: 'none',
                  background: '#ecfdf5',
                  color: '#059669',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={12} /> Save Snapshot
              </button>
            </div>

            {/* Create Snapshot Form */}
            {isCreatingVersion && (
              <form onSubmit={handleCreateNewRevision} style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>Iteration R&D Note:</div>
                <textarea
                  required
                  placeholder="e.g. Swapped regular dairy for barista oat milk, reduced vanilla syrup by 10ml."
                  value={newVersionNotes}
                  onChange={(e) => setNewVersionNotes(e.target.value)}
                  style={{
                    width: '100%',
                    height: '60px',
                    fontSize: '0.75rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '6px',
                    marginBottom: '8px',
                    resize: 'none'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setIsCreatingVersion(false)}
                    style={{ fontSize: '0.72rem', border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ fontSize: '0.72rem', border: 'none', background: '#059669', color: '#ffffff', padding: '4px 10px', borderRadius: '4px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Save Revision
                  </button>
                </div>
              </form>
            )}

            {/* List of Revisions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1 }}>
              {revisions.map((rev) => {
                const isSelected = rev.id === selectedVersionId || (selectedVersionId === null && rev.id === revisions[0].id)
                return (
                  <div
                    key={rev.id}
                    onClick={() => setSelectedVersionId(rev.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0fdf4' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.82rem', color: isSelected ? '#065f46' : '#1e293b' }}>
                        {rev.version}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{rev.timestamp}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#475569', lineHeight: '1.3' }}>
                      {rev.notes}
                    </p>
                    <div style={{ marginTop: '6px', fontSize: '0.68rem', color: '#059669', fontWeight: '600' }}>
                      By {rev.author}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Side-by-Side Comparison */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>
                Comparing: <span style={{ color: '#059669' }}>Active Studio</span> vs <span style={{ color: '#2563eb' }}>{activeCompareRevision.version}</span>
              </h3>
              <button
                type="button"
                onClick={() => handleRestoreVersion(activeCompareRevision)}
                style={{
                  border: 'none',
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RotateCcw size={12} /> Revert Studio to this Version
              </button>
            </div>

            {/* Sensory Axis Comparison */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                5-AXIS SENSORY RADAR SHIFTS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', textAlign: 'center' }}>
                {[
                  { label: 'Sweetness', curr: currentSensory.sweetness, comp: comparedSensory.sweetness },
                  { label: 'Acidity', curr: currentSensory.acidity, comp: comparedSensory.acidity },
                  { label: 'Bitterness', curr: currentSensory.bitterness, comp: comparedSensory.bitterness },
                  { label: 'Body', curr: currentSensory.body, comp: comparedSensory.body },
                  { label: 'Aroma', curr: currentSensory.aroma, comp: comparedSensory.aroma }
                ].map(axis => (
                  <div key={axis.label} style={{ background: '#ffffff', padding: '8px 4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{axis.label}</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                      {axis.curr} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>/ {axis.comp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer Formulation Diff Table */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 12px', color: '#475569' }}>Layer Ingredient</th>
                    <th style={{ padding: '8px 12px', color: '#059669' }}>Active Studio (ml)</th>
                    <th style={{ padding: '8px 12px', color: '#2563eb' }}>{activeCompareRevision.version} (ml)</th>
                    <th style={{ padding: '8px 12px', color: '#475569' }}>Volume Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {(recipe.layers || []).map((layer, idx) => {
                    const compLayer = activeCompareRevision.layers?.[idx] || {}
                    const currVol = Number(layer.volumeMl || 0)
                    const compVol = Number(compLayer.volumeMl || 0)
                    const delta = currVol - compVol

                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '8px 12px', fontWeight: '600', color: '#1e293b' }}>{layer.name}</td>
                        <td style={{ padding: '8px 12px', fontWeight: '700', color: '#059669' }}>{currVol} ml</td>
                        <td style={{ padding: '8px 12px', color: '#2563eb' }}>{compVol} ml</td>
                        <td style={{ padding: '8px 12px', fontWeight: '700', color: delta > 0 ? '#15803d' : delta < 0 ? '#dc2626' : '#64748b' }}>
                          {delta > 0 ? `+${delta} ml` : delta < 0 ? `${delta} ml` : 'Identical'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
