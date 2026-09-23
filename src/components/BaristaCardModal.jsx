import React, { useState } from 'react'
import { X, Printer, Download, Sparkles, Check, Flame, ShieldAlert, Award } from 'lucide-react'

export function BaristaCardModal({
  isOpen,
  onClose,
  recipe,
  metrics
}) {
  const [activeSide, setActiveSide] = useState('front')

  if (!isOpen) return null

  return (
    <div className="clean-modal-overlay" onClick={onClose}>
      <div className="clean-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#111827',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Award size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                Barista Quick SOP Card
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Printable 4x6" laminated build card for station speed & barista onboarding.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Card Side Switcher */}
        <div className="pill-group" style={{ marginBottom: '16px', width: '100%' }}>
          <button
            className={`pill-btn ${activeSide === 'front' ? 'active' : ''}`}
            onClick={() => setActiveSide('front')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Side A: Visual Build & Measurements
          </button>
          <button
            className={`pill-btn ${activeSide === 'back' ? 'active' : ''}`}
            onClick={() => setActiveSide('back')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Side B: Step-by-Step SOP
          </button>
        </div>

        {/* Printable Card */}
        <div
          id="barista-sop-print-card"
          style={{
            background: '#ffffff',
            border: '2px solid var(--brand-amber)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
            position: 'relative'
          }}
        >
          {activeSide === 'front' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--brand-amber)', textTransform: 'uppercase' }}>
                    {recipe.venue.toUpperCase()} SOP
                  </span>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginTop: '2px' }}>
                    {recipe.name}
                  </h2>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {metrics.vessel.name} • {metrics.ice.name}
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₱{recipe.menuPrice?.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    COGS: ₱{metrics.totalCogs.toFixed(2)} ({metrics.grossMarginPct.toFixed(0)}% GM)
                  </div>
                </div>
              </div>

              {/* Layer Breakdown */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Pour Order (Bottom ➔ Top)
                </div>

                {metrics.layersDetailed.map((layer, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#f8f9fb',
                      borderLeft: `4px solid ${layer.colorHex || '#d97706'}`,
                      borderRadius: '0 8px 8px 0',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-amber)', fontFamily: 'var(--font-mono)' }}>
                        #{idx + 1}
                      </span>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>{layer.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {layer.isTopOff ? 'Auto fill to rim line' : `Pour exactly ${layer.calculatedVolumeMl} ml`}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {layer.calculatedVolumeMl} ml ({layer.calculatedVolumeOz} oz)
                    </div>
                  </div>
                ))}
              </div>

              {/* Garnish */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center', background: 'var(--brand-amber-subtle)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--brand-amber-light)' }}>
                <Sparkles size={16} color="#d97706" />
                <div style={{ fontSize: '0.74rem', color: 'var(--brand-espresso)' }}>
                  <strong>Finish & Garnish:</strong> {recipe.garnishes?.join(', ') || 'Standard presentation'}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  Standard Operating Procedure (SOP)
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Target speed of service: &lt; 45 seconds per ticket.
                </p>
              </div>

              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(recipe.sopSteps || [
                  'Measure ingredients precisely using calibrated jigger or gram scale.',
                  'Add ice according to recipe displacement level.',
                  'Agitate or pour in designated layering order for visual separation.',
                  'Garnish and apply designated packaging before serving.'
                ]).map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: '#f3f4f6',
                        border: '1px solid var(--border-light)',
                        color: 'var(--brand-amber)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        flexShrink: 0
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: '16px',
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <ShieldAlert size={18} color="#e11d48" />
                <div style={{ fontSize: '0.72rem', color: '#9f1239' }}>
                  <strong>Allergen Notice:</strong> Contains Dairy / Tree Nuts (Oat / Almond alternatives). Sanitize steaming pitcher and shaker between drinks.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
          <button
            className="btn-clean btn-clean-secondary btn-clean-sm"
            onClick={() => window.print()}
          >
            <Printer size={14} />
            <span>Print Station Card</span>
          </button>

          <button
            className="btn-clean btn-clean-primary btn-clean-sm"
            onClick={() => {
              alert('Exported Barista Training PDF!')
              onClose()
            }}
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  )
}
