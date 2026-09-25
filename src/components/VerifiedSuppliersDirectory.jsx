import React, { useState } from 'react'
import { 
  Store, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  Search,
  Truck,
  CheckCircle2,
  Package
} from 'lucide-react'
import { MASTER_SUPPLIERS } from '../data/suppliersData'
import { triggerHaptic } from '../utils/haptics'

export function VerifiedSuppliersDirectory({
  onSelectSupplier = () => {},
  onOpenMessenger = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')

  const filteredSuppliers = MASTER_SUPPLIERS.filter(sup => {
    const matchesSearch = sup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sup.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sup.region.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === 'all' || sup.region.toLowerCase().includes(selectedRegion.toLowerCase())
    return matchesSearch && matchesRegion
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Search & Region Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '10px 14px',
            gap: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}
        >
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified distributors (e.g. Oatly, Boba King, Matcha)..."
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.82rem',
              color: '#0f172a',
              background: 'transparent',
              fontWeight: 500
            }}
          />
        </div>

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          style={{
            height: '42px',
            padding: '0 10px',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#334155',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Regions</option>
          <option value="manila">Metro Manila</option>
          <option value="luzon">Luzon</option>
          <option value="cebu">Cebu & Visayas</option>
          <option value="nationwide">Nationwide</option>
        </select>
      </div>

      {/* Supplier Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {filteredSuppliers.map(sup => (
          <div
            key={sup.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              position: 'relative'
            }}
          >
            <div>
              {/* Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Store size={16} color="#d97706" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                      {sup.name}
                    </h4>
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      {sup.category}
                    </span>
                  </div>
                </div>

                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', fontSize: '0.70rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px' }}>
                  <Star size={11} fill="#d97706" color="#d97706" /> {sup.rating}
                </span>
              </div>

              {/* Badges Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', margin: '8px 0', fontSize: '0.70rem' }}>
                <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.62rem' }}>Payment Terms</span>
                  <strong style={{ color: '#0f172a' }}>{sup.terms}</strong>
                </div>

                <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.62rem' }}>Min Order (MOQ)</span>
                  <strong style={{ color: '#059669' }}>₱{sup.minOrderPhp.toLocaleString()}</strong>
                </div>

                <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.62rem' }}>Dispatch Lead Time</span>
                  <strong style={{ color: '#0284c7' }}>{sup.leadTimeDays === 1 ? 'Next-Day Express' : `${sup.leadTimeDays} Days`}</strong>
                </div>

                <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.62rem' }}>Catalog SKUs</span>
                  <strong style={{ color: '#7c3aed' }}>{sup.skuCount} Products</strong>
                </div>
              </div>

              {/* Region */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: '#64748b', marginTop: '4px' }}>
                <MapPin size={12} color="#94a3b8" />
                <span>Warehouse: {sup.region}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={() => {
                  triggerHaptic('tap')
                  onOpenMessenger(sup)
                }}
                style={{
                  padding: '8px 10px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <MessageCircle size={13} color="#7360f2" />
                <span>Viber / WA</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic('tap')
                  onSelectSupplier(sup)
                }}
                style={{
                  padding: '8px 10px',
                  borderRadius: '10px',
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <Package size={13} color="#38bdf8" />
                <span>View SKUs</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
