import React, { useState } from 'react'
import { X, Copy, Check, MessageCircle, Phone, Share2, Send, ExternalLink, ShieldCheck } from 'lucide-react'
import { triggerHaptic } from '../utils/haptics'

export function ViberWhatsappPoModal({
  isOpen = false,
  onClose = () => {},
  poData,
  currentUser
}) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !poData) return null

  const shopName = currentUser?.shopName || 'Metro Manila Specialty Cafe'
  const poNumber = poData.poNumber || `PO-${new Date().getFullYear()}-8921`
  const supplierName = poData.supplier || 'Gourmet Direct PH (Wholesale)'
  const items = poData.items || []
  const total = poData.total || 0
  const terms = poData.terms || 'Net-30 Commercial Terms'
  const region = poData.region || 'Metro Manila Express'

  const formattedItemsText = items
    .map((item, idx) => `• ${item.name} (${item.packSize || item.moq || 'Standard Pack'}) x ${item.qty} = ₱${((item.price || 0) * (item.qty || 1)).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`)
    .join('\n')

  const poMessage = `🧾 *POURCRAFT OFFICIAL PURCHASE ORDER*
━━━━━━━━━━━━━━━━━━━━
📄 *PO Number:* #${poNumber}
🏬 *Supplier:* ${supplierName}
🏪 *Buyer Cafe:* ${shopName}
📍 *Delivery Destination:* ${region}
💳 *Payment Terms:* ${terms}
⏱️ *Order Date:* ${new Date().toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}

📦 *ORDER LINE ITEMS:*
${formattedItemsText}
━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL AMOUNT: ₱${total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}*

Please confirm invoice generation, item availability, and dispatch schedule. Thank you!`

  const handleCopy = () => {
    navigator.clipboard.writeText(poMessage)
    setCopied(true)
    triggerHaptic('success')
    setTimeout(() => setCopied(false), 3000)
  }

  const handleOpenWhatsapp = () => {
    triggerHaptic('tap')
    const encoded = encodeURIComponent(poMessage)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  const handleOpenViber = () => {
    triggerHaptic('tap')
    const encoded = encodeURIComponent(poMessage)
    window.open(`viber://forward?text=${encoded}`, '_blank')
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 95,
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
          maxWidth: '520px',
          padding: '22px',
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
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={18} color="#38bdf8" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                Supplier Viber & WhatsApp Dispatch
              </h3>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b' }}>
                1-Tap formatted B2B PO messenger for local distributors
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

        {/* Message Preview Box */}
        <div
          style={{
            background: '#0f172a',
            color: '#f8fafc',
            borderRadius: '14px',
            padding: '14px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.74rem',
            lineHeight: 1.45,
            whiteSpace: 'pre-wrap',
            maxHeight: '260px',
            overflowY: 'auto',
            border: '1px solid #334155'
          }}
        >
          {poMessage}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {/* Viber Button */}
            <button
              onClick={handleOpenViber}
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: '#7360f2',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(115, 96, 242, 0.3)'
              }}
            >
              <MessageCircle size={16} />
              <span>Send via Viber</span>
            </button>

            {/* WhatsApp Button */}
            <button
              onClick={handleOpenWhatsapp}
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: '#25d366',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
              }}
            >
              <Send size={16} />
              <span>Send via WhatsApp</span>
            </button>
          </div>

          {/* Copy to Clipboard */}
          <button
            onClick={handleCopy}
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: copied ? '#10b981' : '#f1f5f9',
              color: copied ? '#ffffff' : '#0f172a',
              border: '1px solid #cbd5e1',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>PO Message Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy Formatted PO Text</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
