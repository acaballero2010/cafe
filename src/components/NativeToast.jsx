import React, { useEffect } from 'react'
import { CheckCircle2, AlertCircle, Sparkles, Info, X } from 'lucide-react'

export function NativeToast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      onDismiss()
    }, toast.duration || 3200)
    return () => clearTimeout(timer)
  }, [toast, onDismiss])

  if (!toast) return null

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} color="#10b981" />
      case 'warning':
        return <AlertCircle size={18} color="#f59e0b" />
      case 'sparkle':
        return <Sparkles size={18} color="#8b5cf6" />
      default:
        return <Info size={18} color="#3b82f6" />
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 'calc(16px + env(safe-area-inset-top, 0px))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(17, 24, 39, 0.94)',
        color: '#ffffff',
        padding: '10px 18px',
        borderRadius: '999px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0,0,0,0.12)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        maxWidth: '92vw',
        animation: 'toastSpringIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        pointerEvents: 'auto',
        userSelect: 'none'
      }}
      onClick={onDismiss}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {getIcon()}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.84rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
          {toast.message}
        </span>
        {toast.subtext && (
          <span style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '-1px' }}>
            {toast.subtext}
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onDismiss()
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          padding: '2px',
          marginLeft: '4px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={14} />
      </button>
    </div>
  )
}
