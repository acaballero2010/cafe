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
          vendor: 'Gourmet Direct / BakeEtc Manila #MNL-8842',
          invoiceDate: 'Oct 24, 2026',
          invoiceTotal: 14850.00,
          items: [
            {
              skuId: 'oatly-barista',
              name: 'Oatly Barista Edition (Case of 6 x 1L)',
              oldPrice: 1260.00,
              newPrice: 1380.00,
              changePct: 9.5,
              oldUnitCost: 0.210,
              newUnitCost: 0.230,
              affectedRecipes: ['Iced Brown Sugar Shaken', 'Strawberry Matcha Cloud']
            },
            {
              skuId: 'organic-whole-milk',
              name: 'Magnolia / Emborg Fresh Milk (Case 12 x 1L)',
              oldPrice: 1140.00,
              newPrice: 1180.00,
              changePct: 3.5,
              oldUnitCost: 0.095,
              newUnitCost: 0.098,
              affectedRecipes: ['Tiger Stripe Brown Sugar Milk']
            }
          ]
        })
      } else {
        setScannedData({
          vendor: 'Top Creamery Food Mfg Corp Manila',
          invoiceDate: 'Oct 23, 2026',
          invoiceTotal: 8450.00,
          items: [
            {
              skuId: 'tiger-boba-pearls',
              name: 'Raw Black Tapioca Pearls (Case 6 x 3kg)',
              oldPrice: 2400.00,
              newPrice: 2550.00,
              changePct: 6.2,
              oldUnitCost: 0.160,
              newUnitCost: 0.170,
              affectedRecipes: ['Tiger Stripe Brown Sugar Milk']
            },
            {
              skuId: 'tiger-brown-sugar-syrup',
              name: 'House Muscovado Brown Sugar Syrup (2.5kg)',
              oldPrice: 650.00,
              newPrice: 690.00,
              changePct: 6.1,
              oldUnitCost: 0.342,
              newUnitCost: 0.363,
              affectedRecipes: ['Iced Brown Sugar Shaken', 'Tiger Stripe Brown Sugar Milk']
            }
          ]
        })
      }
    }, 1000)
  }

  const handleApply = () => {
    if (scannedData && onApplyPriceUpdates) {
      onApplyPriceUpdates(scannedData.items)
    }
    alert('✅ Updated ingredient costs across all recipes in Philippine Pesos (₱)!')
    onClose()
  }

  return (
    <div className="clean-modal-overlay" onClick={onClose}>
      <div className="clean-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Camera size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                Snap-to-Cost: Supplier Invoice OCR
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Bypass manual data entry. Auto-sync wholesale invoice prices directly to recipe margins.
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

        {/* Upload Stage */}
        {!scannedData ? (
          <div>
            <div
              style={{
                border: '2px dashed var(--border-light)',
                borderRadius: 'var(--radius-xl)',
                padding: '36px 20px',
                textAlign: 'center',
                background: '#f8f9fb',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284c7'
                }}
              >
                <Upload size={22} />
              </div>

              <div>
                <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Upload Vendor Delivery Receipt (PDF / Photo)
                </h4>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Supports Manila Coffee Roasters, Metro Foodservice, Top Creamery & Boba Distributors
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  className="btn-clean btn-clean-primary btn-clean-sm"
                  onClick={() => handleSimulateScan('dairy')}
                  disabled={isScanning}
                >
                  <FileText size={14} />
                  <span>Simulate Dairy Distributor Invoice</span>
                </button>

                <button
                  className="btn-clean btn-clean-secondary btn-clean-sm"
                  onClick={() => handleSimulateScan('boba')}
                  disabled={isScanning}
                >
                  <FileText size={14} />
                  <span>Simulate Boba Supplier Invoice</span>
                </button>
              </div>

              {isScanning && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontSize: '0.78rem', marginTop: '10px' }}>
                  <RefreshCw size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Extracting line items in PHP (₱)...</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Scanned Metadata */}
            <div
              style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0369a1' }}>
                  {scannedData.vendor}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Date: {scannedData.invoiceDate} • Total: ₱{scannedData.invoiceTotal.toLocaleString()}
                </div>
              </div>

              <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '3px 8px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700 }}>
                ✓ OCR VERIFIED
              </span>
            </div>

            {/* Diff table */}
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Extracted Price Changes & Impact
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {scannedData.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Unit cost: ₱{item.oldUnitCost.toFixed(3)}/ml ➔ <strong style={{ color: '#d97706' }}>₱{item.newUnitCost.toFixed(3)}/ml</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          ₱{item.oldPrice.toFixed(2)}
                        </span>
                        <ArrowRight size={12} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#e11d48', fontFamily: 'var(--font-mono)' }}>
                          ₱{item.newPrice.toFixed(2)}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#e11d48' }}>
                        +{item.changePct}% Price Increase
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-light)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    Impacts: <strong style={{ color: 'var(--text-primary)' }}>{item.affectedRecipes.join(', ')}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                className="btn-clean btn-clean-secondary btn-clean-sm"
                onClick={() => setScannedData(null)}
              >
                Scan Another
              </button>

              <button
                className="btn-clean btn-clean-primary"
                onClick={handleApply}
              >
                <Sparkles size={14} />
                <span>Sync & Recalculate Margins (₱)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
