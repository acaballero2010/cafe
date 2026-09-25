import React, { useState } from 'react'
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  RotateCcw, 
  Send, 
  ExternalLink, 
  DollarSign, 
  Download,
  AlertCircle
} from 'lucide-react'
import { triggerHaptic } from '../utils/haptics'

export const SAMPLE_ORDERS_DATA = [
  {
    id: 'po-2026-4821',
    poNumber: 'PO-2026-4821',
    supplier: 'Gourmet Direct PH (Wholesale)',
    orderDate: 'Today, 8:30 AM',
    eta: 'Today, 2:30 PM • Metro Manila Express',
    status: 'in_transit',
    statusLabel: '🚚 In Transit (Lalamove Driver Assigned)',
    driverInfo: 'Kuya Mark (Toyota LiteAce • Plate NDF-8921)',
    paymentTerms: 'Net-30 Commercial Terms',
    total: 3780.00,
    items: [
      { name: 'Oatly Barista Edition (Case 6 x 1L)', qty: 3, price: 1260.00, packSize: '6 x 1L' }
    ]
  },
  {
    id: 'po-2026-4109',
    poNumber: 'PO-2026-4109',
    supplier: 'Top Creamery Mfg',
    orderDate: 'Yesterday, 11:15 AM',
    eta: 'Delivered Yesterday at 4:10 PM',
    status: 'delivered',
    statusLabel: '✅ Delivered & Verified at Bar Counter',
    driverInfo: 'Transportify Logistics Express',
    paymentTerms: 'Net-15 Invoice',
    total: 4800.00,
    items: [
      { name: 'Top Creamery Raw Tapioca (6 x 3kg)', qty: 2, price: 2400.00, packSize: '6 x 3kg' }
    ]
  },
  {
    id: 'po-2026-3980',
    poNumber: 'PO-2026-3980',
    supplier: 'Matcha Manila Direct',
    orderDate: 'Sep 22, 2026',
    eta: 'Delivered Sep 23, 2026',
    status: 'delivered',
    statusLabel: '✅ Delivered & Verified at Bar Counter',
    driverInfo: 'LBC Air Cargo Direct',
    paymentTerms: 'Instant Settlement (GCash B2B)',
    total: 6650.00,
    items: [
      { name: '1st-Harvest Uji Ceremonial Matcha (1kg)', qty: 1, price: 6650.00, packSize: '1kg Vacuum Foil' }
    ]
  }
]

export function MarketplaceOrdersTracking({
  orders = SAMPLE_ORDERS_DATA,
  onOpenMessenger = () => {},
  onReorder = () => {}
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
            Active Purchase Orders & Commercial Deliveries
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748b' }}>
            Track Lalamove / Transportify logistics dispatch & Net terms status
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {orders.map(order => {
          const isInTransit = order.status === 'in_transit'
          return (
            <div
              key={order.id}
              style={{
                background: '#ffffff',
                borderRadius: '18px',
                border: isInTransit ? '1.5px solid #38bdf8' : '1px solid #e2e8f0',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: isInTransit ? '0 4px 14px rgba(56, 189, 248, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              {/* Top Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.86rem', fontWeight: 900, color: '#0f172a' }}>
                      #{order.poNumber}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>•</span>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155' }}>
                      {order.supplier}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                    Ordered: {order.orderDate}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                    ₱{order.total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </div>
                  <span style={{ fontSize: '0.66rem', color: '#059669', fontWeight: 700 }}>
                    {order.paymentTerms}
                  </span>
                </div>
              </div>

              {/* Status Banner */}
              <div
                style={{
                  background: isInTransit ? '#f0f9ff' : '#f0fdf4',
                  border: isInTransit ? '1px solid #bae6fd' : '1px solid #bbf7d0',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.74rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={15} color={isInTransit ? '#0284c7' : '#16a34a'} />
                  <span style={{ fontWeight: 800, color: isInTransit ? '#0369a1' : '#15803d' }}>
                    {order.statusLabel}
                  </span>
                </div>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  {order.driverInfo}
                </span>
              </div>

              {/* Line Items */}
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                    <span style={{ color: '#334155' }}>
                      <strong>{item.qty}x</strong> {item.name} ({item.packSize})
                    </span>
                    <span style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                      ₱{(item.price * item.qty).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => {
                    triggerHaptic('tap')
                    onOpenMessenger(order)
                  }}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Send size={12} color="#7360f2" />
                  <span>Send via Viber / WA</span>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic('success')
                    onReorder(order)
                  }}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    background: '#0f172a',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <RotateCcw size={12} color="#38bdf8" />
                  <span>1-Tap Reorder PO</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
