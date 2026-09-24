import React, { useState } from 'react'
import { X, Printer, CheckCircle2, Tag, Coffee, Sliders } from 'lucide-react'
import { triggerHaptic } from '../utils/haptics'

export function ThermalCupLabelModal({
  isOpen = false,
  onClose = () => {},
  recipe,
  sugarPct = 100,
  iceType = 'Regular Ice',
  currentUser
}) {
  const [customerName, setCustomerName] = useState('Walk-in Barista')
  const [orderNumber, setOrderNumber] = useState('A-108')
  const [selectedSugar, setSelectedSugar] = useState(sugarPct)
  const [selectedIce, setSelectedIce] = useState(iceType)

  if (!isOpen || !recipe) return null

  const handlePrint = () => {
    triggerHaptic('success')
    window.print()
  }

  const currentDate = new Date().toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
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
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '440px',
          padding: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={16} color="#38bdf8" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>
                Thermal Cup Sticker (50x30mm)
              </h3>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b' }}>
                Standard ESC/POS Barista Station Cup Label
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={16} color="#64748b" />
          </button>
        </div>

        {/* Live Thermal Label Preview (50x30mm Aspect Ratio Styled) */}
        <div
          id="printable-thermal-label"
          style={{
            background: '#fffdf0',
            border: '2px dashed #94a3b8',
            borderRadius: '10px',
            padding: '12px 14px',
            fontFamily: '"JetBrains Mono", monospace',
            color: '#0f172a',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}
        >
          {/* Shop Header & Order # */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #0f172a', paddingBottom: '4px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {currentUser?.shopName || 'POURCRAFT CAFE'}
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: 900, background: '#0f172a', color: '#ffffff', padding: '1px 6px', borderRadius: '4px' }}>
              #{orderNumber}
            </span>
          </div>

          {/* Drink Name & Size */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '2px 0' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, lineHeight: 1.15 }}>
                {recipe.name}
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155' }}>
                [{recipe.vesselName || '16oz Cup'}] • {recipe.temp === 'hot' ? '🔥 HOT' : '🧊 ICED'}
              </div>
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 900 }}>
              ₱{Number(recipe.menuPrice || 180).toFixed(0)}
            </span>
          </div>

          {/* Modifiers / Dosing Specs */}
          <div style={{ fontSize: '0.72rem', fontWeight: 700, background: 'rgba(0,0,0,0.05)', padding: '4px 6px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div>• Sweetness: <strong>{selectedSugar}% Sweet</strong></div>
            <div>• Ice: <strong>{selectedIce}</strong></div>
            {recipe.layers?.slice(0, 3).map((l, i) => (
              <div key={i} style={{ color: '#475569', fontSize: '0.66rem' }}>
                ✓ {l.name} ({l.volumeMl}ml)
              </div>
            ))}
          </div>

          {/* Footer Barista & Timestamp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.64rem', color: '#64748b', borderTop: '1px solid #cbd5e1', paddingTop: '4px', marginTop: '2px' }}>
            <span>Barista: {currentUser?.name?.split(' ')[0] || 'Admin'}</span>
            <span>{currentDate}</span>
          </div>
        </div>

        {/* Customization Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>Order Tag</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569' }}>Sugar %</label>
              <select
                value={selectedSugar}
                onChange={(e) => setSelectedSugar(Number(e.target.value))}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }}
              >
                <option value={100}>100% Standard</option>
                <option value={75}>75% Less Sweet</option>
                <option value={50}>50% Half Sweet</option>
                <option value={25}>25% Light Sweet</option>
                <option value={0}>0% Unsweetened</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handlePrint}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
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
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
          }}
        >
          <Printer size={16} color="#38bdf8" />
          <span>Print Thermal Label (ESC/POS)</span>
        </button>
      </div>
    </div>
  )
}
