import React, { useState } from 'react'
import { ArrowLeft, Printer, Download, Sparkles, Truck, Check, Share2, Tag, QrCode } from 'lucide-react'
import { AllergenBadgePills } from './AllergenBadgePills'
import { SugarTierCalculator } from './SugarTierCalculator'
import { SensoryRadarChart } from './SensoryRadarChart'
import { ThermalCupLabelModal } from './ThermalCupLabelModal'
import { PrintableTableTentModal } from './PrintableTableTentModal'
import { calculateSensoryProfile } from '../utils/beverageCalculators'
import { triggerHaptic } from '../utils/haptics'

export function SpecSheetView({
  recipe,
  metrics,
  onBackToBuilder,
  onOpenMarketplace,
  currentUser
}) {
  const [isCupLabelModalOpen, setIsCupLabelModalOpen] = useState(false)
  const [isTableTentModalOpen, setIsTableTentModalOpen] = useState(false)
  const sensoryProfile = calculateSensoryProfile(recipe)
  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <button
          className="btn-clean btn-clean-secondary"
          onClick={onBackToBuilder}
        >
          <ArrowLeft size={15} />
          <span>Back to Builder</span>
        </button>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              triggerHaptic('tap')
              setIsCupLabelModalOpen(true)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '10px',
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <Tag size={14} color="#38bdf8" />
            <span>Thermal Cup Sticker</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('tap')
              setIsTableTentModalOpen(true)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '10px',
              background: '#fffbeb',
              color: '#92400e',
              border: '1px solid #fde68a',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <QrCode size={14} color="#d97706" />
            <span>4x6" Table Standee</span>
          </button>

          <button
            className="btn-clean btn-clean-secondary"
            onClick={() => window.print()}
          >
            <Printer size={15} />
            <span>Print Spec</span>
          </button>
        </div>
      </div>

      {/* Printable iPadOS Spec Card */}
      <div
        className="card-clean"
        id="printable-spec-sheet"
        style={{
          padding: '28px',
          background: '#ffffff',
          borderRadius: 'var(--radius-2xl)',
          boxShadow: 'var(--shadow-float)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Header Block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '18px' }}>
          <div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--brand-amber)',
                background: 'var(--brand-amber-subtle)',
                border: '1px solid var(--brand-amber-light)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase'
              }}
            >
              {recipe.venue?.toUpperCase() || 'CAFE'} MASTER SPEC SHEET
            </span>

            <h1 style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginTop: '8px', lineHeight: 1.25 }}>
              {recipe.name}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {metrics.vessel.name} • {metrics.ice.name}
            </p>
          </div>

          {/* Economics Pill (₱) */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              ₱{recipe.menuPrice?.toFixed(2)}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--margin-green-bg)',
                border: '1px solid var(--margin-green-border)',
                color: '#059669',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 800,
                marginTop: '4px'
              }}
            >
              <span>{metrics.grossMarginPct.toFixed(0)}% Margin</span>
              <span>•</span>
              <span>+₱{metrics.grossProfit.toFixed(2)} profit</span>
            </div>
          </div>
        </div>

        {/* 1. Dietary & Allergen Compliance Section */}
        <AllergenBadgePills recipe={recipe} />

        {/* 2. Sugar Tier Sweetness Dosing Matrix */}
        <SugarTierCalculator recipe={recipe} standardCogs={metrics.totalCogs} />

        {/* 3. 5-Axis Sensory Flavor Radar Chart */}
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
            5-Axis Sensory Balance Radar
          </div>
          <SensoryRadarChart profile={sensoryProfile} size={220} />
        </div>

        {/* 4. Build Sequence */}
        <div>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
            Build Order (Bottom ➔ Top)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {metrics.layersDetailed.map((layer, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8f9fb',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      color: 'var(--brand-amber)',
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    {idx + 1}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {layer.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {layer.isTopOff ? 'Auto fill to rim line' : `Measure exactly ${layer.calculatedVolumeMl} ml`}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {layer.calculatedVolumeMl} ml ({layer.calculatedVolumeOz} oz)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Packaging Breakdown */}
        <div style={{ background: '#f8f9fb', padding: '16px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Packaging & Consumables
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            {(recipe.packagingIds || []).map((pkgId, idx) => (
              <span key={idx} style={{ background: '#ffffff', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                ✓ {pkgId.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Supplier Reorder Banner (₱) */}
        <div
          style={{
            background: 'var(--brand-amber-subtle)',
            border: '1px solid var(--brand-amber-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Truck size={20} color="#d97706" />
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--brand-espresso)' }}>
                Supplier Inventory Link
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--brand-amber)' }}>
                Wholesale ingredient catalog linked with live pricing in Philippine Pesos (₱).
              </div>
            </div>
          </div>

          <button
            className="btn-clean btn-clean-secondary btn-clean-sm"
            onClick={onOpenMarketplace}
          >
            Reorder PO
          </button>
        </div>
      </div>

      {/* Modals */}
      <ThermalCupLabelModal
        isOpen={isCupLabelModalOpen}
        onClose={() => setIsCupLabelModalOpen(false)}
        recipe={recipe}
        currentUser={currentUser}
      />

      <PrintableTableTentModal
        isOpen={isTableTentModalOpen}
        onClose={() => setIsTableTentModalOpen(false)}
        recipe={recipe}
        currentUser={currentUser}
      />
    </div>
  )
}
