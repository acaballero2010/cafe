import React from 'react'
import { AlertCircle, Zap, Flame, ShieldCheck, Heart, Leaf } from 'lucide-react'
import { analyzeAllergensAndNutrition } from '../utils/beverageCalculators'

export function AllergenBadgePills({
  recipe,
  isDarkMode = false
}) {
  const { allergens, dietary, caffeineMg, caloriesKcal } = analyzeAllergensAndNutrition(recipe)

  return (
    <div
      style={{
        background: isDarkMode ? '#1e293b' : '#ffffff',
        border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={16} color="#10b981" />
          <h4 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
            Dietary & Allergen Compliance
          </h4>
        </div>
        <span style={{ fontSize: '0.66rem', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
          Auto-Verified
        </span>
      </div>

      {/* Badges Flow */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {/* Caffeine Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '8px',
            background: caffeineMg > 100 ? '#fef3c7' : '#f1f5f9',
            border: caffeineMg > 100 ? '1px solid #fde68a' : '1px solid #e2e8f0',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: caffeineMg > 100 ? '#92400e' : '#475569'
          }}
        >
          <Zap size={12} color={caffeineMg > 100 ? '#d97706' : '#64748b'} />
          <span>Caffeine: ~{caffeineMg} mg</span>
        </div>

        {/* Calories Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '8px',
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#be123c'
          }}
        >
          <Flame size={12} color="#e11d48" />
          <span>~{caloriesKcal} kcal</span>
        </div>

        {/* Dietary Certifications */}
        {dietary.map(d => (
          <div
            key={d}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '8px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#15803d'
            }}
          >
            <Leaf size={12} color="#16a34a" />
            <span>{d}</span>
          </div>
        ))}

        {/* Allergen Warnings */}
        {allergens.length > 0 ? (
          allergens.map(a => (
            <div
              key={a}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '8px',
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#c2410c'
              }}
            >
              <AlertCircle size={12} color="#ea580c" />
              <span>Contains: {a}</span>
            </div>
          ))
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '8px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#15803d'
            }}
          >
            <ShieldCheck size={12} color="#16a34a" />
            <span>No Common Allergens</span>
          </div>
        )}
      </div>
    </div>
  )
}
