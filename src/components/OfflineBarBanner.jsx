import React, { useState } from 'react'
import { WifiOff, Wifi, Download, CheckCircle2, X, Sparkles, ShieldCheck } from 'lucide-react'
import { triggerHaptic } from '../utils/haptics'

export function OfflineBarBanner({
  isOnline = true,
  canInstall = false,
  onInstall = () => {}
}) {
  const [dismissInstall, setDismissInstall] = useState(false)

  if (isOnline && (!canInstall || dismissInstall)) {
    return null
  }

  return (
    <div style={{ position: 'sticky', top: 54, zIndex: 39, width: '100%' }}>
      {/* 1. Offline Mode Alert */}
      {!isOnline && (
        <div
          style={{
            background: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
            color: '#fef3c7',
            padding: '7px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.74rem',
            fontWeight: 700,
            borderBottom: '1px solid #b45309',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(254, 243, 199, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WifiOff size={12} color="#fde68a" />
            </div>
            <span>
              <strong>⚡ Offline Bar Mode Active:</strong> All 200+ recipes & studio calculations cached locally.
            </span>
          </div>

          <span style={{ fontSize: '0.66rem', background: 'rgba(0,0,0,0.25)', padding: '2px 8px', borderRadius: '999px', color: '#fde68a' }}>
            Zero Downtime
          </span>
        </div>
      )}

      {/* 2. PWA Tablet / Mobile Home Screen Install Banner */}
      {isOnline && canInstall && !dismissInstall && (
        <div
          style={{
            background: '#0f172a',
            color: '#ffffff',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.74rem',
            borderBottom: '1px solid #334155'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={14} color="#fbbf24" />
            <span>Install PourCraft App for full-screen cafe tablet operation</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => {
                triggerHaptic('success')
                onInstall()
              }}
              style={{
                background: '#fbbf24',
                color: '#0f172a',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.68rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Download size={11} />
              <span>Install App</span>
            </button>
            <button
              onClick={() => setDismissInstall(true)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
