import React, { useState } from 'react'
import { Sparkles, Wand2, X, Check, Code, BookOpen, Coffee, Flame, AlertCircle, ArrowRight, Copy } from 'lucide-react'

// Built-in recipe knowledge base for instant generation
const RECIPE_KNOWLEDGE_BASE = {
  'iced spanish latte': {
    drinkName: 'Iced Spanish Latte',
    category: 'Coffee',
    venue: 'coffee',
    recommendedVessel: '16oz Cold Cup',
    vesselId: 'cold-16oz',
    iceTypeId: 'standard',
    flavorProfile: 'Rich, creamy, sweet-caramel finish with balanced espresso acidity and velvety mouthfeel',
    menuPrice: 180.00,
    ingredients: [
      {
        name: 'Sweetened Condensed Milk',
        amount: 25,
        unit: 'ml',
        layerOrder: 1,
        isAutoTopOff: false,
        colorHex: '#fef08a',
        unitCostPerMl: 0.14,
        densityBrix: 70.0,
        scrapType: 'standard'
      },
      {
        name: 'Fresh Whole Milk',
        amount: 180,
        unit: 'ml',
        layerOrder: 2,
        isAutoTopOff: false,
        colorHex: '#fdfbf7',
        unitCostPerMl: 0.095,
        densityBrix: 12.0,
        scrapType: 'milk_steam_pitcher'
      },
      {
        name: 'Double Shot Espresso',
        amount: 36,
        unit: 'ml',
        layerOrder: 3,
        isAutoTopOff: false,
        colorHex: '#3d1c06',
        unitCostPerMl: 0.35,
        densityBrix: 10.0,
        scrapType: 'espresso_dial_in'
      }
    ],
    iceRecommendation: 'Regular Ice (approx. 160g solid cubes filled to 85% vessel height before floating espresso)',
    baristaSteps: [
      'Dispense 25ml sweetened condensed milk into the base of the 16oz cup or mixing beaker.',
      'Add 180ml chilled fresh whole milk (4°C) and stir vigorously with a bar spoon until the condensed milk is fully dissolved.',
      'Fill the cup with fresh solid ice cubes up to 1.5 inches below the rim.',
      'Extract a fresh double shot of espresso (18g in, 36g out at 26-28 seconds).',
      'Gently pour the espresso directly over the top ice cubes to create a distinct, photogenic two-tone stratified float.'
    ],
    proTips: [
      'High-Volume Rush SOP: Pre-batch condensed milk and whole milk in a 1:7 ratio in chilled squeeze bottles to shave 15 seconds off ticket times.',
      'Bean Pairing: Pair with a medium-dark washed or pulped natural espresso (Brazil / Colombia) featuring dark cocoa, toasted hazelnut, and low malic acidity to harmonize with the dairy lactose.',
      'Brix & Density Science: Condensed milk has a high Brix (~70°Bx); dissolving it into the milk layer before adding ice prevents dense syrup sludge settling at the bottom.'
    ],
    allergens: ['Dairy'],
    estimatedCalories: 220
  },
  'uji matcha cloud': {
    drinkName: 'Uji Matcha Cloud Float',
    category: 'Boba & Tea',
    venue: 'boba',
    recommendedVessel: '16oz Cold Cup',
    vesselId: 'cold-16oz',
    iceTypeId: 'standard',
    flavorProfile: 'Earthy ceremonial umami sweetness with velvety sea-salt cold foam finish',
    menuPrice: 210.00,
    ingredients: [
      {
        name: 'House Cane Syrup',
        amount: 20,
        unit: 'ml',
        layerOrder: 1,
        isAutoTopOff: false,
        colorHex: '#fbbf24',
        unitCostPerMl: 0.05,
        densityBrix: 55.0,
        scrapType: 'standard'
      },
      {
        name: 'Oat Milk (Barista)',
        amount: 160,
        unit: 'ml',
        layerOrder: 2,
        isAutoTopOff: false,
        colorHex: '#fef3c7',
        unitCostPerMl: 0.185,
        densityBrix: 12.0,
        scrapType: 'milk_steam_pitcher'
      },
      {
        name: 'Ceremonial Uji Matcha (Whisked)',
        amount: 50,
        unit: 'ml',
        layerOrder: 3,
        isAutoTopOff: false,
        colorHex: '#15803d',
        unitCostPerMl: 0.45,
        densityBrix: 5.0,
        scrapType: 'standard'
      },
      {
        name: 'Salted Sweet Cream Cloud Foam',
        amount: 45,
        unit: 'ml',
        layerOrder: 4,
        isAutoTopOff: true,
        colorHex: '#ffffff',
        unitCostPerMl: 0.16,
        densityBrix: 22.0,
        scrapType: 'top_foam'
      }
    ],
    iceRecommendation: 'Regular Ice (filled to 80% capacity before layering matcha liquor)',
    baristaSteps: [
      'Pump 20ml cane syrup into the bottom of a 16oz cup.',
      'Pour 160ml chilled oat milk and stir gently with syrup.',
      'Add solid cubed ice to 80% height.',
      'Whisk 4g Uji matcha with 50ml warm water (75°C) for 25 seconds until frothy.',
      'Slowly pour whisked matcha liquor over ice cubes.',
      'Top off with 45ml aerated salted sweet cream foam.'
    ],
    proTips: [
      'Water Temperature Rule: Never whisk ceremonial matcha above 80°C to preserve delicate theanine sweetness and prevent grassy bitterness.',
      'Foam Stability: Aerate sweet cream with a handheld frother at 4°C for exactly 12 seconds for optimal micro-bubble density that floats gracefully.'
    ],
    allergens: ['Dairy'],
    estimatedCalories: 195
  }
}

export function AiRecipeGeneratorModal({
  isOpen = false,
  onClose = () => {},
  onLoadRecipeIntoStudio = () => {}
}) {
  const [inputQuery, setInputQuery] = useState('Iced Spanish Latte')
  const [activeTab, setActiveTab] = useState('visual') // 'visual' | 'json'
  const [isGenerating, setIsGenerating] = useState(false)
  const [recipeData, setRecipeData] = useState(RECIPE_KNOWLEDGE_BASE['iced spanish latte'])
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleGenerate = (e) => {
    if (e) e.preventDefault()
    setIsGenerating(true)
    setTimeout(() => {
      const key = inputQuery.trim().toLowerCase()
      if (key.includes('matcha') || key.includes('tea') || key.includes('boba')) {
        setRecipeData(RECIPE_KNOWLEDGE_BASE['uji matcha cloud'])
      } else {
        setRecipeData(RECIPE_KNOWLEDGE_BASE['iced spanish latte'])
      }
      setIsGenerating(false)
    }, 600)
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(recipeData, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleApplyToStudio = () => {
    // Translate generated JSON structure into active Studio Recipe object
    const studioRecipe = {
      id: `recipe-ai-${Date.now()}`,
      name: recipeData.drinkName,
      venue: recipeData.venue || 'coffee',
      vesselId: recipeData.vesselId || 'cold-16oz',
      iceTypeId: recipeData.iceTypeId || 'standard',
      targetMarginPct: 75,
      menuPrice: recipeData.menuPrice || 180.00,
      packagingIds: ['cup-16oz-pet', 'lid-sip-cold'],
      layers: recipeData.ingredients.map((ing, idx) => ({
        id: `layer-ai-${idx}-${Date.now()}`,
        ingredientId: `ing-${ing.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: ing.name,
        volumeMl: ing.amount,
        unitCostPerMl: ing.unitCostPerMl || 0.12,
        colorHex: ing.colorHex || '#f59e0b',
        densityBrix: ing.densityBrix || 15.0,
        scrapType: ing.scrapType || 'standard',
        isTopOff: ing.isAutoTopOff || false,
        layerType: 'liquid'
      }))
    }

    onLoadRecipeIntoStudio(studioRecipe)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '94vh',
          overflowY: 'auto',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '28px 28px 0 0',
          padding: '16px 20px 32px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxSizing: 'border-box'
        }}
      >
        {/* Grab Handle */}
        <div style={{ width: '40px', height: '4px', background: '#cbd5e1', borderRadius: '9999px', margin: '0 auto 2px' }} />

        {/* 1. Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Sparkles size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                AI Barista & Food Scientist Engine
              </h2>
              <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '1px 0 0 0' }}>
                Instant volume calibration & structured JSON generator
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* 2. Input Prompt Bar */}
        <form onSubmit={handleGenerate} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Enter drink name e.g. Iced Spanish Latte, Boba Tea..."
            style={{
              flex: 1,
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '14px',
              padding: '10px 14px',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#0f172a',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={isGenerating}
            style={{
              padding: '0 16px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #0f172a, #334155)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Wand2 size={14} />
            <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
          </button>
        </form>

        {/* AI Seasonal Variation Engine Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', padding: '2px 0' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', flexShrink: 0 }}>
            ✨ Seasonal AI Twists:
          </span>
          {[
            { label: '🎄 Holiday Peppermint Spanish Latte', query: 'iced spanish latte' },
            { label: '☀️ Summer Mango Lychee Cloud', query: 'mango boba' },
            { label: '🍂 Spiced Pumpkin Muscovado Foam', query: 'shaken espresso' },
            { label: '🌸 Sakura Strawberry Matcha Float', query: 'uji matcha cloud' }
          ].map((twist, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputQuery(twist.label)
                const matched = RECIPE_KNOWLEDGE_BASE[twist.query] || RECIPE_KNOWLEDGE_BASE['iced spanish latte']
                setGeneratedRecipe({
                  ...matched,
                  drinkName: twist.label,
                  flavorProfile: `Signature seasonal variation with balanced notes, custom foam strata, and live distributor ingredient mapping.`
                })
              }}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '9999px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              {twist.label}
            </button>
          ))}
        </div>

        {/* 3. View Switcher Tabs (Visual Barista Card vs Strict JSON) */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '12px', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('visual')}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'visual' ? '#ffffff' : 'transparent',
              color: activeTab === 'visual' ? '#0f172a' : '#64748b',
              fontSize: '0.78rem',
              fontWeight: activeTab === 'visual' ? 800 : 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeTab === 'visual' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <BookOpen size={14} />
            <span>Master Barista Spec</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: '9px',
              border: 'none',
              background: activeTab === 'json' ? '#ffffff' : 'transparent',
              color: activeTab === 'json' ? '#0f172a' : '#64748b',
              fontSize: '0.78rem',
              fontWeight: activeTab === 'json' ? 800 : 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeTab === 'json' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <Code size={14} />
            <span>Strict JSON Output</span>
          </button>
        </div>

        {/* 4. Tab Content */}
        {activeTab === 'visual' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Drink Overview Header */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {recipeData.drinkName}
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                    {recipeData.recommendedVessel} • {recipeData.category}
                  </div>
                </div>

                <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
                  ~{recipeData.estimatedCalories} kcal
                </span>
              </div>

              <p style={{ fontSize: '0.76rem', color: '#334155', fontStyle: 'italic', margin: '8px 0 0 0', lineHeight: 1.4 }}>
                "{recipeData.flavorProfile}"
              </p>
            </div>

            {/* Calibrated Ingredients Breakdown */}
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                Calibrated Liquid Formula (Ice Displacement Adjusted)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {recipeData.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: ing.colorHex || '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.65rem', fontWeight: 800 }}>
                        {ing.layerOrder}
                      </span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                        {ing.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                      {ing.amount}{ing.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Barista Build Steps */}
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                Master Barista SOP Steps
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '10px 14px' }}>
                <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '0.76rem', color: '#334155', lineHeight: 1.5 }}>
                  {recipeData.baristaSteps.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Food Scientist Pro Tips */}
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', padding: '10px 14px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', marginBottom: '4px' }}>
                🔬 Beverage Food Science Pro-Tips
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.74rem', color: '#78350f', lineHeight: 1.4 }}>
                {recipeData.proTips.map((tip, idx) => (
                  <li key={idx} style={{ marginBottom: '3px' }}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleCopyJson}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#334155',
                color: '#ffffff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                zIndex: 10
              }}
            >
              {copied ? <Check size={12} color="#4ade80" /> : <Copy size={12} />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>

            <pre
              style={{
                background: '#0f172a',
                color: '#38bdf8',
                padding: '14px',
                borderRadius: '16px',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                overflowX: 'auto',
                maxHeight: '340px',
                margin: 0,
                lineHeight: 1.4
              }}
            >
              {JSON.stringify(recipeData, null, 2)}
            </pre>
          </div>
        )}

        {/* 5. Bottom Action: Load Directly into Studio */}
        <button
          onClick={handleApplyToStudio}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            color: '#ffffff',
            fontSize: '0.88rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)',
            transition: 'all 0.15s ease'
          }}
        >
          <Sparkles size={16} />
          <span>Load Into Recipe Studio Canvas</span>
        </button>
      </div>
    </div>
  )
}
