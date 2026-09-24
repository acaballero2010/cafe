import React from 'react'
import { X, Printer, QrCode, Sparkles, Award, Compass, Heart } from 'lucide-react'
import { triggerHaptic } from '../utils/haptics'

export function PrintableTableTentModal({
  isOpen = false,
  onClose = () => {},
  recipe,
  currentUser
}) {
  if (!isOpen || !recipe) return null

  const handlePrint = () => {
    triggerHaptic('success')
    window.print()
  }

  const drinkImage = recipe.image || '/beverages/caramel-macchiato.jpg'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        background: 'rgba(15, 23, 42, 0.8)',
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
          maxWidth: '460px',
          padding: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={16} color="#fbbf24" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>
                Printable Table Tent / Standee
              </h3>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b' }}>
                4" x 6" Cafe Counter Display Card
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

        {/* 4x6 Table Tent Physical Preview */}
        <div
          id="printable-table-tent"
          style={{
            background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            border: '2px solid #fbbf24'
          }}
        >
          {/* Hero Image */}
          <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
            <img
              src={drinkImage}
              alt={recipe.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = '/beverages/caramel-macchiato.jpg' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 60%)' }} />
            
            <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
              <span style={{ background: '#fbbf24', color: '#0f172a', padding: '3px 8px', borderRadius: '999px', fontSize: '0.66rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Featured Signature
              </span>
            </div>

            <div style={{ position: 'absolute', bottom: '10px', left: '14px', right: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>
                  {recipe.name}
                </h2>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                  {currentUser?.shopName || 'Craft Beverage Bar'}
                </div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fbbf24' }}>
                ₱{Number(recipe.menuPrice || 180).toFixed(0)}
              </div>
            </div>
          </div>

          {/* Description & Taste Notes */}
          <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              {recipe.description || 'Artisan handcrafted beverage layered with high-density house ingredients and crystal clear ice.'}
            </p>

            {/* QR Code & Scan Prompt */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.08)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#f8fafc' }}>
                  📱 Scan to View Specs & Order
                </div>
                <div style={{ fontSize: '0.64rem', color: '#94a3b8', marginTop: '2px' }}>
                  Calories: ~185 kcal • 100% Arabica
                </div>
              </div>

              {/* QR Code Icon Graphic */}
              <div style={{ background: '#ffffff', padding: '4px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QrCode size={40} color="#0f172a" />
              </div>
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
          <Printer size={16} color="#fbbf24" />
          <span>Print Counter Standee (4" x 6")</span>
        </button>
      </div>
    </div>
  )
}
