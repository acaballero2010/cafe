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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: '#a855f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Award size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#fff' }}>
                Barista SOP Training & Station Card
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Printable 4x6" laminated build card for bar stations & staff onboarding.
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
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            className={`btn btn-sm ${activeSide === 'front' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSide('front')}
            style={{ flex: 1 }}
          >
            Side A: Visual Layer Build & Measurements
          </button>
          <button
            className={`btn btn-sm ${activeSide === 'back' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSide('back')}
            style={{ flex: 1 }}
          >
            Side B: Step-by-Step SOP & Speed Technique
          </button>
        </div>

        {/* The Printable 4x6 Card Container */}
        <div
          id="barista-sop-print-card"
          style={{
            background: '#0d131d',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            position: 'relative'
          }}
        >
          {activeSide === 'front' ? (
            <div>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                <div>
                  <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
                    {recipe.venue.toUpperCase()} SOP
                  </span>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
                    {recipe.name}
                  </h2>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {metrics.vessel.name} • {metrics.ice.name}
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>
                    ${recipe.menuPrice?.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    COGS: ${metrics.totalCogs.toFixed(2)} ({metrics.grossMarginPct.toFixed(0)}% GM)
                  </div>
                </div>
              </div>

              {/* Layer Breakdown Sequence */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Pour Order (Bottom ➔ Top)
                </div>

                {metrics.layersDetailed.map((layer, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderLeft: `4px solid ${layer.colorHex || '#f59e0b'}`,
                      borderRadius: '0 8px 8px 0',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                        #{idx + 1}
                      </span>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>{layer.name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {layer.isTopOff ? 'Auto fill to rim line' : `Pour exactly ${layer.calculatedVolumeMl} ml`}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                      {layer.calculatedVolumeMl} ml ({layer.calculatedVolumeOz} oz)
                    </div>
                  </div>
                ))}
              </div>

              {/* Garnishes & Finish */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '8px' }}>
                <Sparkles size={16} color="#fbbf24" />
                <div style={{ fontSize: '0.74rem', color: '#f8fafc' }}>
                  <strong>Finish & Garnish:</strong> {recipe.garnishes?.join(', ') || 'Standard presentation'}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Back: Detailed SOP Steps */}
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)' }}>
                  Standard Operating Procedure (SOP)
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
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
                        background: 'rgba(245, 158, 11, 0.2)',
                        border: '1px solid #f59e0b',
                        color: '#fbbf24',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#e2e8f0', lineHeight: 1.4 }}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>

              {/* Allergen & Quality Control Box */}
              <div
                style={{
                  marginTop: '16px',
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <ShieldAlert size={18} color="#fb7185" />
                <div style={{ fontSize: '0.72rem', color: '#fecdd3' }}>
                  <strong>Allergen Warning:</strong> Contains Dairy / Tree Nuts (Oat Milk / Almond Milk alternatives). Always sanitize steam wand & shaker between drinks.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => window.print()}
          >
            <Printer size={14} />
            <span>Print Station Card</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              alert('Exported Barista Training PDF & High-Res Card!')
              onClose()
            }}
          >
            <Download size={14} />
            <span>Download PDF Kit</span>
          </button>
        </div>
      </div>
    </div>
  )
}
