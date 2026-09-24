import React, { useState, useEffect } from 'react'
import { X, Printer, Download, Sparkles, Check, Flame, ShieldAlert, Award, QrCode, Play, Pause, RotateCcw, Clock, Volume2, Tablet, Smartphone, Tag } from 'lucide-react'
import { ThermalCupLabelModal } from './ThermalCupLabelModal'
import { PrintableTableTentModal } from './PrintableTableTentModal'
import { triggerHaptic } from '../utils/haptics'

export function BaristaCardModal({
  isOpen,
  onClose,
  recipe,
  metrics,
  currentUser
}) {
  const [activeSide, setActiveSide] = useState('front') // 'front' | 'back' | 'station'
  const [shotSeconds, setShotSeconds] = useState(25)
  const [isShotRunning, setIsShotRunning] = useState(false)
  const [shakeSeconds, setShakeSeconds] = useState(12)
  const [isShakeRunning, setIsShakeRunning] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [isCupLabelOpen, setIsCupLabelOpen] = useState(false)
  const [isTableTentOpen, setIsTableTentOpen] = useState(false)

  // Shot Timer Effect
  useEffect(() => {
    let interval = null
    if (isShotRunning && shotSeconds > 0) {
      interval = setInterval(() => {
        setShotSeconds(prev => prev - 1)
      }, 1000)
    } else if (shotSeconds === 0) {
      setIsShotRunning(false)
    }
    return () => clearInterval(interval)
  }, [isShotRunning, shotSeconds])

  // Shake Timer Effect
  useEffect(() => {
    let interval = null
    if (isShakeRunning && shakeSeconds > 0) {
      interval = setInterval(() => {
        setShakeSeconds(prev => prev - 1)
      }, 1000)
    } else if (shakeSeconds === 0) {
      setIsShakeRunning(false)
    }
    return () => clearInterval(interval)
  }, [isShakeRunning, shakeSeconds])

  if (!isOpen) return null

  const stationUrl = `https://pourcraft.app/station/${recipe.id || 'current'}`

  return (
    <div className="clean-modal-overlay" onClick={onClose}>
      <div className="clean-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: activeSide === 'station' ? '740px' : '640px', transition: 'max-width 0.2s ease' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
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
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                Barista Station Mode & SOP
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Hands-free tablet workflow, printable 4x6" cards & live extraction timers.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowQrModal(!showQrModal)}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <QrCode size={14} color="#0f172a" />
              <span>QR Pair</span>
            </button>

            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* QR Code Deep-Link Overlay */}
        {showQrModal && (
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              {/* Dynamic QR SVG */}
              <div style={{ background: '#ffffff', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'inline-block' }}>
                <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="140" height="140" fill="white" />
                  {/* Outer Frame & Corner Position Markers */}
                  <rect x="10" y="10" width="36" height="36" rx="4" stroke="#0f172a" strokeWidth="6" fill="white" />
                  <rect x="20" y="20" width="16" height="16" rx="2" fill="#0f172a" />
                  <rect x="94" y="10" width="36" height="36" rx="4" stroke="#0f172a" strokeWidth="6" fill="white" />
                  <rect x="104" y="20" width="16" height="16" rx="2" fill="#0f172a" />
                  <rect x="10" y="94" width="36" height="36" rx="4" stroke="#0f172a" strokeWidth="6" fill="white" />
                  <rect x="20" y="104" width="16" height="16" rx="2" fill="#0f172a" />
                  {/* QR Pattern Data Dots */}
                  <rect x="54" y="14" width="8" height="8" fill="#0f172a" />
                  <rect x="70" y="14" width="8" height="8" fill="#0f172a" />
                  <rect x="54" y="30" width="16" height="8" fill="#0f172a" />
                  <rect x="78" y="30" width="8" height="16" fill="#0f172a" />
                  <rect x="14" y="54" width="16" height="8" fill="#0f172a" />
                  <rect x="38" y="54" width="8" height="16" fill="#0f172a" />
                  <rect x="54" y="54" width="32" height="32" rx="4" fill="#d97706" />
                  <rect x="94" y="54" width="16" height="8" fill="#0f172a" />
                  <rect x="118" y="54" width="8" height="16" fill="#0f172a" />
                  <rect x="14" y="78" width="8" height="8" fill="#0f172a" />
                  <rect x="30" y="78" width="16" height="8" fill="#0f172a" />
                  <rect x="94" y="78" width="8" height="16" fill="#0f172a" />
                  <rect x="110" y="78" width="16" height="8" fill="#0f172a" />
                  <rect x="54" y="94" width="16" height="8" fill="#0f172a" />
                  <rect x="78" y="94" width="8" height="8" fill="#0f172a" />
                  <rect x="54" y="110" width="8" height="16" fill="#0f172a" />
                  <rect x="70" y="118" width="16" height="8" fill="#0f172a" />
                  <rect x="94" y="102" width="16" height="16" fill="#0f172a" />
                  <rect x="118" y="118" width="8" height="8" fill="#0f172a" />
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
              Scan to Launch Hands-Free Wall Tablet Mode
            </div>
            <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '4px 0 0' }}>
              Pair prep station tablets, iPad mounts, or barista mobile devices instantly.
            </p>
          </div>
        )}

        {/* Card Side Switcher */}
        <div className="pill-group" style={{ marginBottom: '16px', width: '100%', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
          <button
            className={`pill-btn ${activeSide === 'front' ? 'active' : ''}`}
            onClick={() => setActiveSide('front')}
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.76rem', fontWeight: activeSide === 'front' ? 800 : 600 }}
          >
            Side A: Measurements
          </button>
          <button
            className={`pill-btn ${activeSide === 'back' ? 'active' : ''}`}
            onClick={() => setActiveSide('back')}
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.76rem', fontWeight: activeSide === 'back' ? 800 : 600 }}
          >
            Side B: Step SOP
          </button>
          <button
            className={`pill-btn ${activeSide === 'station' ? 'active' : ''}`}
            onClick={() => setActiveSide('station')}
            style={{ flex: 1.2, justifyContent: 'center', fontSize: '0.76rem', fontWeight: activeSide === 'station' ? 800 : 600, color: activeSide === 'station' ? '#ffffff' : '#b45309', background: activeSide === 'station' ? '#0f172a' : 'transparent' }}
          >
            ⚡ Live Station Tablet
          </button>
        </div>

        {/* Printable Card / Station Mode View */}
        {activeSide === 'station' ? (
          /* Hands-Free Kitchen Station Mode */
          <div style={{ background: '#0f172a', borderRadius: '20px', padding: '24px', color: '#ffffff', boxShadow: '0 8px 30px rgba(0,0,0,0.35)' }}>
            {/* Station Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ background: '#3b82f6', color: '#ffffff', fontSize: '0.70rem', fontWeight: 900, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                  KITCHEN PREP STATION • SPEED TARGET &lt;45s
                </span>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', margin: '8px 0 2px 0', letterSpacing: '-0.02em' }}>
                  {recipe.name}
                </h1>
                <div style={{ fontSize: '0.86rem', color: '#94a3b8' }}>
                  {metrics.vessel.name} • {metrics.ice.name}
                </div>
              </div>

              {/* Live Interactive Station Timers */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* 25s Espresso Shot Timer */}
                <div style={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '14px', padding: '8px 12px', textAlign: 'center', minWidth: '95px' }}>
                  <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Shot Timer</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: shotSeconds === 0 ? '#10b981' : '#fbbf24' }}>
                    {shotSeconds}s
                  </div>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '4px' }}>
                    <button
                      onClick={() => setIsShotRunning(!isShotRunning)}
                      style={{ background: isShotRunning ? '#ef4444' : '#10b981', border: 'none', borderRadius: '6px', color: '#fff', padding: '3px 6px', cursor: 'pointer' }}
                    >
                      {isShotRunning ? <Pause size={10} /> : <Play size={10} />}
                    </button>
                    <button
                      onClick={() => { setIsShotRunning(false); setShotSeconds(25) }}
                      style={{ background: '#334155', border: 'none', borderRadius: '6px', color: '#fff', padding: '3px 6px', cursor: 'pointer' }}
                    >
                      <RotateCcw size={10} />
                    </button>
                  </div>
                </div>

                {/* 12s Shaker Countdown */}
                <div style={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '14px', padding: '8px 12px', textAlign: 'center', minWidth: '95px' }}>
                  <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Shake Agitate</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: shakeSeconds === 0 ? '#10b981' : '#38bdf8' }}>
                    {shakeSeconds}s
                  </div>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '4px' }}>
                    <button
                      onClick={() => setIsShakeRunning(!isShakeRunning)}
                      style={{ background: isShakeRunning ? '#ef4444' : '#38bdf8', border: 'none', borderRadius: '6px', color: '#fff', padding: '3px 6px', cursor: 'pointer' }}
                    >
                      {isShakeRunning ? <Pause size={10} /> : <Play size={10} />}
                    </button>
                    <button
                      onClick={() => { setIsShakeRunning(false); setShakeSeconds(12) }}
                      style={{ background: '#334155', border: 'none', borderRadius: '6px', color: '#fff', padding: '3px 6px', cursor: 'pointer' }}
                    >
                      <RotateCcw size={10} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* High-Contrast Large-Print Layer Build Order */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {metrics.layersDetailed.map((layer, idx) => {
                const pumpInfo = layer.volumeMl <= 30 ? ` (~${Math.round(layer.volumeMl / 10)} pumps)` : ''
                return (
                  <div
                    key={idx}
                    style={{
                      background: '#1e293b',
                      borderLeft: `6px solid ${layer.colorHex || '#d97706'}`,
                      borderRadius: '12px',
                      padding: '12px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                        STEP {idx + 1}
                      </span>
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                          {layer.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                          {layer.isTopOff ? 'Auto top off smoothly to fill rim' : `Pour calibrated portion${pumpInfo}`}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                        {layer.calculatedVolumeMl} ml
                      </span>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {layer.calculatedVolumeOz} oz
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Station Garnish & Speed Callout */}
            <div style={{ marginTop: '16px', background: 'rgba(217, 119, 6, 0.15)', border: '1px solid #d97706', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#fbbf24" />
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fef3c7' }}>
                  Garnish: {recipe.garnishes?.join(', ') || 'Ceylon Cinnamon Dust'}
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>
                Packaging: {metrics.packagingDetailed?.map(p => p.name.split(' (')[0]).join(' + ') || 'PET Cup + Sip Lid'}
              </span>
            </div>
          </div>
        ) : (
          /* Side A & Side B Printable Views */
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
        )}

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                triggerHaptic('tap')
                setIsCupLabelOpen(true)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                borderRadius: '8px',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Tag size={13} color="#38bdf8" />
              <span>Cup Sticker</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('tap')
                setIsTableTentOpen(true)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                borderRadius: '8px',
                background: '#fffbeb',
                color: '#92400e',
                border: '1px solid #fde68a',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <QrCode size={13} color="#d97706" />
              <span>Table Standee</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn-clean btn-clean-secondary btn-clean-sm"
              onClick={() => window.print()}
            >
              <Printer size={14} />
              <span>Print Station</span>
            </button>

            <button
              className="btn-clean btn-clean-primary btn-clean-sm"
              onClick={() => {
                alert('Exported Barista Training PDF!')
                onClose()
              }}
            >
              <Download size={14} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ThermalCupLabelModal
        isOpen={isCupLabelOpen}
        onClose={() => setIsCupLabelOpen(false)}
        recipe={recipe}
        currentUser={currentUser}
      />

      <PrintableTableTentModal
        isOpen={isTableTentOpen}
        onClose={() => setIsTableTentOpen(false)}
        recipe={recipe}
        currentUser={currentUser}
      />
    </div>
  )
}
