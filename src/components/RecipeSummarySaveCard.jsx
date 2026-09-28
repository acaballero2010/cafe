import React, { useState, useEffect, useMemo } from 'react'
import {
  Save,
  Sparkles,
  GitFork,
  Check,
  Edit3,
  DollarSign,
  TrendingUp,
  Scale,
  Layers,
  Award,
  BookOpen,
  Share2,
  BookmarkCheck,
  AlertCircle,
  HelpCircle,
  FileText
} from 'lucide-react'
import { calculateSensoryProfile, analyzeAllergensAndNutrition } from '../utils/beverageCalculators'
import { calculateDrinkMetrics } from '../types/physics'

export function RecipeSummarySaveCard({
  recipe,
  metrics,
  onUpdateRecipe = () => {},
  onSaveRecipe = () => {},
  onOpenSaveModal = () => {},
  onOpenCostInspector = () => {},
  onOpenSopModal = () => {}
}) {
  const [isSavedSuccess, setIsSavedSuccess] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState(recipe?.name || 'Untitled Recipe')
  const [priceInput, setPriceInput] = useState(recipe?.menuPrice || recipe?.price || 180)

  useEffect(() => {
    setTitleInput(recipe?.name || 'Untitled Recipe')
  }, [recipe?.name])

  useEffect(() => {
    setPriceInput(recipe?.menuPrice || recipe?.price || 180)
  }, [recipe?.menuPrice, recipe?.price])

  const layers = recipe?.layers || []
  const sensory = calculateSensoryProfile(recipe)
  const nutrition = analyzeAllergensAndNutrition(recipe)

  // Use centralized drink metrics for 100% centavo-exact synchronization with floating bar
  const calculatedMetrics = useMemo(() => {
    if (metrics) return metrics
    return calculateDrinkMetrics({
      vesselId: recipe?.vesselId,
      iceTypeId: recipe?.iceTypeId,
      layers: recipe?.layers,
      packagingItems: [],
      includeScrap: true,
      menuPrice: Number(recipe?.menuPrice || recipe?.price || 180)
    })
  }, [metrics, recipe])

  const totalCogs = Number(calculatedMetrics.totalCogs.toFixed(2))
  const grossProfit = Number(calculatedMetrics.grossProfit.toFixed(2))
  const grossMarginPct = Number(calculatedMetrics.grossMarginPct.toFixed(1))
  const totalLiquidCost = Number((calculatedMetrics.realLiquidCostWithScrap || calculatedMetrics.nominalLiquidCost).toFixed(2))
  const packagingCost = Number(((calculatedMetrics.packagingCost || 0) + (calculatedMetrics.iceCost || 0)).toFixed(2))
  const menuPrice = Number(recipe?.menuPrice || recipe?.price || 180)

  let totalVolumeMl = 0
  layers.forEach(l => {
    totalVolumeMl += Number(l.volumeMl || 0)
  })

  const handleQuickSave = () => {
    const updated = {
      ...recipe,
      name: titleInput.trim() || recipe.name,
      menuPrice: Number(priceInput) || 180,
      price: Number(priceInput) || 180,
      lastSavedAt: new Date().toISOString()
    }
    onUpdateRecipe(updated)
    if (onSaveRecipe) {
      onSaveRecipe(updated)
    }
    setIsSavedSuccess(true)
    setTimeout(() => setIsSavedSuccess(false), 3000)
  }

  const handlePriceBlur = () => {
    const num = Number(priceInput)
    if (!isNaN(num) && num > 0) {
      onUpdateRecipe({ ...recipe, menuPrice: num, price: num })
    }
  }

  const handleTitleBlur = () => {
    if (titleInput.trim()) {
      onUpdateRecipe({ ...recipe, name: titleInput.trim() })
    }
    setIsEditingTitle(false)
  }

  // Active brand summary
  const brandList = layers.map(l => l.brand || l.supplier).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i)

  return (
    <div style={{
      background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
      borderRadius: '24px',
      padding: '20px 22px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.04)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Top Header: Title, Category & Version */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              background: '#eff6ff',
              color: '#1e40af',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '6px',
              textTransform: 'uppercase'
            }}>
              {recipe.status === 'menu' ? '🟢 Active Menu Spec' : '🧪 R&D Formulation'}
            </span>
            <span style={{
              background: '#f1f5f9',
              color: '#475569',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              {recipe.version || 'v1.0'}
            </span>
            {recipe.ingredientTier && (
              <span style={{
                background: recipe.ingredientTier === 'artisanal' ? '#faf5ff' : recipe.ingredientTier === 'value' ? '#f0fdf4' : '#ecfdf5',
                color: recipe.ingredientTier === 'artisanal' ? '#7e22ce' : recipe.ingredientTier === 'value' ? '#15803d' : '#059669',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px'
              }}>
                {recipe.ingredientTier === 'artisanal' ? '👑 Artisanal Spec' : recipe.ingredientTier === 'value' ? '⚡ Value Spec' : recipe.ingredientTier === 'hybrid' ? '✨ Custom Hybrid' : '⚖️ Signature Spec'}
              </span>
            )}
          </div>

          {/* Editable Recipe Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleBlur}
              placeholder="Name your recipe (e.g., Iced Salted Caramel Oat Latte)..."
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#0f172a',
                fontFamily: 'var(--font-display)',
                border: isEditingTitle ? '1px solid #0284c7' : '1px solid transparent',
                borderRadius: '8px',
                padding: '4px 6px',
                width: '100%',
                outline: 'none',
                background: isEditingTitle ? '#ffffff' : 'transparent',
                lineHeight: 1.2
              }}
              onFocus={() => setIsEditingTitle(true)}
            />
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
            {layers.length} Layers • {totalVolumeMl}ml Liquid Base • {sensory.avgBrix}° Brix
          </div>
        </div>

        {/* Save Quick Action Button */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleQuickSave}
            style={{
              background: isSavedSuccess ? '#16a34a' : 'linear-gradient(135deg, #0f172a, #1e293b)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '0.80rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.2)',
              transition: 'all 0.2s ease'
            }}
          >
            {isSavedSuccess ? (
              <>
                <Check size={15} />
                <span>Saved to Studio!</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Recipe Spec</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenSaveModal}
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Save as a new variation or publish to menu catalog"
          >
            <GitFork size={14} color="#0284c7" />
            <span>Save Twist / Fork</span>
          </button>
        </div>
      </div>

      {/* 4-Metric Financial & Yield Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
        {/* Metric 1: Total COGS */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Drink COGS
            </span>
            <button
              onClick={onOpenCostInspector}
              style={{ background: 'none', border: 'none', padding: 0, color: '#0284c7', fontSize: '0.66rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Formula ℹ️
            </button>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            ₱{totalCogs.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: '2px' }}>
            ₱{totalLiquidCost.toFixed(2)} liquid + ₱4.50 pack
          </div>
        </div>

        {/* Metric 2: Menu Selling Price (SRP) */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '12px 14px' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
            Target Menu Price (SRP)
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>₱</span>
            <input
              type="number"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              onBlur={handlePriceBlur}
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#0f172a',
                fontFamily: 'var(--font-mono)',
                width: '90px',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                padding: 0
              }}
            />
          </div>
          <div style={{ fontSize: '0.66rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
            Dine-in / Takeout rate
          </div>
        </div>

        {/* Metric 3: Net Profit */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '12px 14px' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
            Gross Profit / Pour
          </span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            +₱{grossProfit.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.66rem', color: '#15803d', fontWeight: 700, marginTop: '2px' }}>
            Cash margin per cup
          </div>
        </div>

        {/* Metric 4: Gross Margin % */}
        <div style={{ background: grossMarginPct >= 70 ? '#f0fdf4' : '#fffbeb', border: `1px solid ${grossMarginPct >= 70 ? '#bbf7d0' : '#fde68a'}`, borderRadius: '16px', padding: '12px 14px' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: grossMarginPct >= 70 ? '#15803d' : '#b45309', textTransform: 'uppercase' }}>
            Gross Margin %
          </span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: grossMarginPct >= 70 ? '#16a34a' : '#d97706', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            {grossMarginPct}%
          </div>
          <div style={{ fontSize: '0.66rem', color: grossMarginPct >= 70 ? '#15803d' : '#b45309', fontWeight: 700, marginTop: '2px' }}>
            {grossMarginPct >= 75 ? '⭐ High Profitability' : grossMarginPct >= 70 ? '✓ Standard Margin' : '⚠️ Low Margin'}
          </div>
        </div>
      </div>

      {/* Brand Stack & Dietary Tags Summary */}
      <div style={{
        background: '#ffffff',
        border: '1px dashed #cbd5e1',
        borderRadius: '14px',
        padding: '10px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '0.74rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 800, color: '#0f172a' }}>🏷️ Brand Stack:</span>
          <span style={{ color: '#475569' }}>
            {brandList.length > 0 ? brandList.join(' • ') : 'Specialty In-House & Wholesale Benchmark'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {nutrition.dietary.map((d, i) => (
            <span key={i} style={{ background: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
              {d}
            </span>
          ))}
          {nutrition.caffeineMg > 0 && (
            <span style={{ background: '#fffbeb', color: '#92400e', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
              ⚡ {nutrition.caffeineMg}mg Caffeine
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
