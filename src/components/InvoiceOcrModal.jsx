import React, { useState } from 'react'
import { X, Camera, Upload, CheckCircle2, AlertTriangle, FileText, ArrowRight, RefreshCw, Sparkles } from 'lucide-react'

export function InvoiceOcrModal({
  isOpen,
  onClose,
  onApplyPriceUpdates
}) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState(null)

  if (!isOpen) return null

  const handleSimulateScan = (vendorType) => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      if (vendorType === 'dairy') {
        setScannedData({
          vendor: 'Sysco Metro Supply #40921',
          invoiceDate: 'Oct 24, 2026',
          invoiceTotal: 842.50,
          items: [
            {
              skuId: 'oatly-barista',
              name: 'Oatly Barista Edition (Case of 12 x 32oz)',
              oldPrice: 44.00,
              newPrice: 48.50,
              changePct: 10.2,
              oldUnitCost: 0.00387,
              newUnitCost: 0.00427,
              affectedRecipes: ['Iced Brown Sugar Shaken', 'Strawberry Matcha Cloud']
            },
            {
              skuId: 'organic-whole-milk',
              name: 'Organic Valley Whole Milk (4 x 1 Gal)',
              oldPrice: 22.00,
              newPrice: 22.50,
              changePct: 2.2,
              oldUnitCost: 0.00145,
              newUnitCost: 0.00148,
              affectedRecipes: ['Tiger Stripe Brown Sugar Milk']
            }
          ]
        })
      } else {
        setScannedData({
          vendor: 'Bossen Food Corp Boba B2B',
          invoiceDate: 'Oct 23, 2026',
          invoiceTotal: 1240.00,
          items: [
            {
              skuId: 'tiger-boba-pearls',
              name: 'Raw Tapioca Pearls (Case of 6 x 3kg)',
              oldPrice: 52.00,
              newPrice: 54.00,
              changePct: 3.8,
              oldUnitCost: 0.0034,
              newUnitCost: 0.0036,
              affectedRecipes: ['Tiger Stripe Brown Sugar Milk']
            },
            {
              skuId: 'tiger-brown-sugar-syrup',
              name: 'House Okinawa Spiced Brown Sugar (2.5kg)',
              oldPrice: 14.50,
              newPrice: 15.20,
              changePct: 4.8,
              oldUnitCost: 0.0076,
              newUnitCost: 0.0080,
              affectedRecipes: ['Iced Brown Sugar Shaken', 'Tiger Stripe Brown Sugar Milk']
            }
          ]
        })
      }
    }, 1200)
  }

  const handleApply = () => {
    if (scannedData && onApplyPriceUpdates) {
      onApplyPriceUpdates(scannedData.items)
    }
    alert('✅ Successfully updated unit costs across all affected recipes!')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Camera size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#fff' }}>
                Snap-to-Cost: Supplier Invoice OCR
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Bypass manual data entry. Auto-sync wholesale invoice line items to recipe costs.
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

        {/* Upload / Capture Stage */}
        {!scannedData ? (
          <div>
            <div
              style={{
                border: '2px dashed var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                padding: '36px 20px',
                textAlign: 'center',
                background: 'rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8'
                }}
              >
                <Upload size={24} />
              </div>

              <div>
                <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc' }}>
                  Upload Vendor Delivery Receipt or Invoice PDF / Photo
                </h4>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Supports Sysco, US Foods, UNFI, Roasters & Specialty Distributors
                </p>
              </div>

              {/* Sample Invoices Quick-Trigger */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleSimulateScan('dairy')}
                  disabled={isScanning}
                >
                  <FileText size={14} />
                  <span>Simulate Sysco Dairy Invoice</span>
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleSimulateScan('boba')}
                  disabled={isScanning}
                >
                  <FileText size={14} />
                  <span>Simulate Boba Supplier Invoice</span>
                </button>
              </div>

              {isScanning && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.8rem', marginTop: '10px' }}>
                  <RefreshCw size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Extracting line items & recalculating margins...</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Scanned Invoice Metadata */}
            <div
              style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#38bdf8' }}>
                  {scannedData.vendor}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  Invoice Date: {scannedData.invoiceDate} • Total: ${scannedData.invoiceTotal.toFixed(2)}
                </div>
              </div>

              <span className="badge badge-success">
                <CheckCircle2 size={12} /> OCR VERIFIED
              </span>
            </div>

            {/* Price Changes Diff Table */}
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Extracted Price Fluctuations & Recipe Impact
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {scannedData.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ffffff' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Unit cost: ${item.oldUnitCost.toFixed(5)}/ml ➔ <span style={{ color: '#fbbf24', fontWeight: 700 }}>${item.newUnitCost.toFixed(5)}/ml</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          ${item.oldPrice.toFixed(2)}
                        </span>
                        <ArrowRight size={12} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fb7185', fontFamily: 'var(--font-mono)' }}>
                          ${item.newPrice.toFixed(2)}
                        </span>
                      </div>
                      <span className="badge badge-danger" style={{ fontSize: '0.62rem', marginTop: '2px' }}>
                        +{item.changePct}% Price Hike
                      </span>
                    </div>
                  </div>

                  {/* Impacted Recipes */}
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                    Impacts: <strong style={{ color: '#f8fafc' }}>{item.affectedRecipes.join(', ')}</strong> (Estimated -1.8% to -2.4% Gross Margin shift)
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setScannedData(null)}
              >
                Scan Another Invoice
              </button>

              <button
                className="btn btn-primary"
                onClick={handleApply}
                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
              >
                <Sparkles size={16} />
                <span>Sync & Recalculate All Margins</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
