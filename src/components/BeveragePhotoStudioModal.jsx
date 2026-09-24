import React, { useState, useRef, useEffect } from 'react'
import { 
  Camera, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  X, 
  Palette, 
  Smartphone, 
  Monitor, 
  Tag, 
  RefreshCw,
  Eye,
  SlidersHorizontal,
  FileText,
  Upload,
  Coffee,
  CheckCircle2,
  Sliders
} from 'lucide-react'

// Curated 8K Photorealistic Commercial Beverage Assets
const PHOTOREALISTIC_ASSETS = {
  'caramel-macchiato': {
    id: 'caramel-macchiato',
    name: 'Caramel Macchiato',
    cupType: 'Faceted Tall Glass',
    url: '/beverages/caramel-macchiato.jpg',
    temp: 'iced',
    icon: '🥛',
    logoBox: { x: 50, y: 55, width: 24, height: 16 }
  },
  'brown-sugar-shaken': {
    id: 'brown-sugar-shaken',
    name: 'Brown Sugar Shaken',
    cupType: 'Ribbed Highball',
    url: '/beverages/brown-sugar-shaken.jpg',
    temp: 'iced',
    icon: '🧊',
    logoBox: { x: 65, y: 52, width: 22, height: 16 }
  },
  'hot-spanish-latte': {
    id: 'hot-spanish-latte',
    name: 'Artisan Latte',
    cupType: 'Ceramic Café Mug',
    url: '/beverages/hot-latte-ceramic.jpg',
    temp: 'hot',
    icon: '☕',
    logoBox: { x: 50, y: 64, width: 26, height: 14 }
  },
  'takeaway-iced-cup': {
    id: 'takeaway-iced-cup',
    name: 'Takeaway Cup',
    cupType: 'Clear PET Cup',
    url: '/beverages/takeaway-iced-cup.jpg',
    temp: 'iced',
    icon: '🥤',
    logoBox: { x: 50, y: 58, width: 28, height: 18 }
  },
  'matcha-strawberry': {
    id: 'matcha-strawberry',
    name: 'Matcha Cloud',
    cupType: 'Cylindrical Glass',
    url: '/beverages/matcha-strawberry.jpg',
    temp: 'iced',
    icon: '🍵',
    logoBox: { x: 62, y: 56, width: 24, height: 16 }
  }
}

export function BeveragePhotoStudioModal({
  isOpen = false,
  onClose = () => {},
  recipe = {},
  metrics = {}
}) {
  const [aspectRatio, setAspectRatio] = useState('1:1') // '1:1' | '9:16' | '16:9' | '4:6'
  const [activeTab, setActiveTab] = useState('preview') // 'preview' | 'branding' | 'prompt' | 'copy'
  
  // Intelligent matching of default photo asset based on recipe
  const isRecipeHot = recipe.temperature === 'hot' || (recipe.name && recipe.name.toLowerCase().includes('hot'))
  const recipeNameLower = (recipe.name || '').toLowerCase()
  
  const getBestInitialAsset = () => {
    if (isRecipeHot) return 'hot-spanish-latte'
    if (recipeNameLower.includes('brown') || recipeNameLower.includes('shaken') || recipeNameLower.includes('espresso')) return 'brown-sugar-shaken'
    if (recipeNameLower.includes('matcha') || recipeNameLower.includes('strawberry')) return 'matcha-strawberry'
    if (recipe.vesselId?.includes('takeaway') || recipeNameLower.includes('takeaway')) return 'takeaway-iced-cup'
    return 'caramel-macchiato'
  }

  const [selectedAssetKey, setSelectedAssetKey] = useState(getBestInitialAsset())
  
  // Store Branding & Logo Customization
  const [storeName, setStoreName] = useState('KAPE CRAFT')
  const [tagline, setTagline] = useState('SPECIALTY COFFEE')
  const [showStoreLogo, setShowStoreLogo] = useState(true)
  const [logoStyle, setLogoStyle] = useState('gold') // 'gold' | 'white' | 'badge' | 'black'
  const [logoScale, setLogoScale] = useState(100)
  const [logoVerticalOffset, setLogoVerticalOffset] = useState(0)
  const [customLogoImage, setCustomLogoImage] = useState(null)
  
  // Marketing & Promo Overlays
  const [showPromoOverlay, setShowPromoOverlay] = useState(true)
  const [showPriceTag, setShowPriceTag] = useState(true)
  const [overlayStyle, setOverlayStyle] = useState('editorial') // 'editorial' | 'banner'
  
  const [isCopiedPrompt, setIsCopiedPrompt] = useState(false)
  const [isCopiedCaption, setIsCopiedCaption] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  
  const fileInputRef = useRef(null)

  useEffect(() => {
    setSelectedAssetKey(getBestInitialAsset())
  }, [recipe.name, recipe.temperature])

  if (!isOpen) return null

  const activePhoto = PHOTOREALISTIC_ASSETS[selectedAssetKey] || PHOTOREALISTIC_ASSETS['caramel-macchiato']

  const layers = (metrics?.layersDetailed && metrics.layersDetailed.length > 0)
    ? metrics.layersDetailed
    : (recipe?.layers || [
        { name: 'Brown Sugar / Muscovado', volumeMl: 25 },
        { name: 'Blonde Espresso Double Shot', volumeMl: 36 },
        { name: 'Barista Oat Milk', volumeMl: 180 }
      ])

  const drinkPrice = recipe.menuPrice || 185.00
  const drinkName = recipe.name || 'Iced Brown Sugar Oat Shaken Espresso'

  // Intelligent Prompt Synthesis
  const generatedAiPrompt = `Ultra-photorealistic 8k commercial beverage photography of ${isRecipeHot ? 'a hot artisanal' : 'an iced layered'} ${drinkName}. Served in a pristine ${activePhoto.cupType}${showStoreLogo ? ` featuring an elegant '${storeName}' café logo brandmark silkscreened onto the cup` : ''}. Visible ingredients: ${layers.map(l => l.name).join(', ')}. ${isRecipeHot ? 'Intricate swan latte art etched into velvety microfoam with subtle rising steam' : 'Thick rich syrup dripping down inside glass walls, crystalline clear ice cubes, glistening condensation drops'}. Placed on a luxury café counter in warm natural morning sunlight with soft cinematic café bokeh. Shot on Sony A7R V 85mm f/1.4 lens, 8k resolution, award-winning commercial advertising photography.`

  // Social Marketing Copy
  const generatedSocialCopy = `✨ INTRODUCING: Our Signature ${drinkName}! ✨

Crafted for true specialty coffee lovers. Handcrafted with precision layers of ${layers.map(l => l.name.replace(/\s*\([^)]*\)/g, '').trim()).join(', ')}.

🔥 Why you'll love every sip:
• 100% Premium Wholesale Grade Artisanal Ingredients
• Silky mouthfeel & rich lingering espresso notes
• Served in our signature ${activePhoto.cupType}

📍 Available daily at ${storeName}
🏷️ Introductory Price: ₱${drinkPrice.toFixed(2)}
🛵 Available for dine-in, take-out & delivery on GrabFood / FoodPanda!

#SpecialtyCoffeePH #ManilaCafe #BaristaDaily #CoffeeLoverPH #KapeTayo #ArtisanalBeverage`

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedAiPrompt)
    setIsCopiedPrompt(true)
    setTimeout(() => setIsCopiedPrompt(false), 2000)
  }

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedSocialCopy)
    setIsCopiedCaption(true)
    setTimeout(() => setIsCopiedCaption(false), 2000)
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => setCustomLogoImage(event.target.result)
      reader.readAsDataURL(file)
    }
  }

  // Render & Download High-Res PNG
  const handleDownloadImage = () => {
    setIsDownloading(true)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = activePhoto.url

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      let targetW = 1200
      let targetH = 1200

      if (aspectRatio === '9:16') {
        targetW = 1080
        targetH = 1920
      } else if (aspectRatio === '16:9') {
        targetW = 1920
        targetH = 1080
      } else if (aspectRatio === '4:6') {
        targetW = 1200
        targetH = 1800
      }

      canvas.width = targetW
      canvas.height = targetH

      // 1. Draw Base Photograph with aspect-ratio cover
      const scale = Math.max(targetW / img.width, targetH / img.height)
      const x = (targetW / 2) - (img.width / 2) * scale
      const y = (targetH / 2) - (img.height / 2) * scale
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

      // 2. Draw Store Logo Decal on Cup
      if (showStoreLogo) {
        const logoX = targetW * (activePhoto.logoBox.x / 100)
        const logoY = (targetH * (activePhoto.logoBox.y / 100)) + (logoVerticalOffset * 2)
        const logoW = (targetW * (activePhoto.logoBox.width / 100)) * (logoScale / 100)
        const logoH = (targetH * (activePhoto.logoBox.height / 100)) * (logoScale / 100)

        ctx.save()
        ctx.translate(logoX, logoY)

        if (customLogoImage) {
          const userLogo = new Image()
          userLogo.src = customLogoImage
          userLogo.onload = () => {
            ctx.globalAlpha = 0.88
            ctx.drawImage(userLogo, -logoW / 2, -logoH / 2, logoW, logoH)
            finalizeCanvas()
          }
          return
        } else {
          // Render Polished Logo Typography / Emblem
          if (logoStyle === 'gold') {
            ctx.fillStyle = '#fde68a'
            ctx.strokeStyle = '#f59e0b'
            ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
            ctx.shadowBlur = 8
          } else if (logoStyle === 'white') {
            ctx.fillStyle = '#ffffff'
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
            ctx.shadowBlur = 8
          } else if (logoStyle === 'badge') {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
            ctx.strokeStyle = '#f59e0b'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.roundRect(-logoW / 2, -logoH / 2, logoW, logoH, 10)
            ctx.fill()
            ctx.stroke()
            ctx.fillStyle = '#ffffff'
          } else {
            ctx.fillStyle = '#0f172a'
            ctx.strokeStyle = 'rgba(15, 23, 42, 0.5)'
          }

          // Main Store Name
          ctx.font = `900 ${Math.round(logoW * 0.16)}px sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(storeName.toUpperCase(), 0, -logoH * 0.12)

          // Accent Divider Line
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(-logoW * 0.3, logoH * 0.04)
          ctx.lineTo(logoW * 0.3, logoH * 0.04)
          ctx.stroke()

          // Secondary Tagline
          ctx.font = `700 ${Math.round(logoW * 0.08)}px sans-serif`
          ctx.fillText(tagline.toUpperCase(), 0, logoH * 0.22)

          ctx.restore()
        }
      }

      finalizeCanvas()

      function finalizeCanvas() {
        // 3. Editorial Promo Banner & Price Tag
        if (showPromoOverlay) {
          // Editorial Frosted Header Tag
          const bannerW = targetW * 0.88
          const bannerH = targetH * 0.11
          const bannerX = (targetW - bannerW) / 2
          const bannerY = targetH * 0.05

          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
          ctx.beginPath()
          ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 16)
          ctx.fill()
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)'
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.fillStyle = '#f59e0b'
          ctx.font = `800 ${Math.round(targetW * 0.016)}px sans-serif`
          ctx.textAlign = 'center'
          ctx.fillText(`${storeName.toUpperCase()} • SPECIALTY MENU`, targetW / 2, bannerY + (bannerH * 0.38))

          ctx.fillStyle = '#ffffff'
          ctx.font = `800 ${Math.round(targetW * 0.028)}px sans-serif`
          ctx.fillText(drinkName, targetW / 2, bannerY + (bannerH * 0.74))

          // Clean Price Badge
          if (showPriceTag) {
            const pillW = targetW * 0.22
            const pillH = targetH * 0.065
            const pillX = (targetW - pillW) / 2
            const pillY = targetH * 0.88

            ctx.fillStyle = '#059669'
            ctx.beginPath()
            ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2)
            ctx.fill()
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = 3
            ctx.stroke()

            ctx.fillStyle = '#ffffff'
            ctx.font = `900 ${Math.round(pillH * 0.46)}px sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(`₱${drinkPrice.toFixed(2)}`, targetW / 2, pillY + (pillH / 2))
          }
        }

        const imageURL = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = `${drinkName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-commercial-photo.png`
        link.href = imageURL
        link.click()
        setIsDownloading(false)
      }
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '94vh',
          overflowY: 'auto',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {/* 1. Modal Header */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.25)'
              }}
            >
              <Camera size={19} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.0rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                AI Beverage Photo Studio
                <span style={{ fontSize: '0.62rem', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                  8K Photo
                </span>
              </h2>
              <p style={{ fontSize: '0.70rem', color: '#64748b', margin: '2px 0 0' }}>
                Commercial photography with custom cup branding & logo.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Refined Segmented Tabs (Clean single-line layout) */}
        <div style={{ display: 'flex', background: '#f8fafc', padding: '5px 12px', borderBottom: '1px solid #e2e8f0', gap: '6px' }}>
          {[
            { id: 'preview', label: 'Photo Studio', icon: Camera },
            { id: 'branding', label: 'Cup Branding', icon: Palette },
            { id: 'prompt', label: 'AI Prompt', icon: Sparkles },
            { id: 'copy', label: 'Social Copy', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '7px 4px',
                  borderRadius: '9px',
                  border: 'none',
                  background: isActive ? '#0f172a' : 'transparent',
                  color: isActive ? '#ffffff' : '#64748b',
                  fontSize: '0.70rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* 3. Main Modal Content */}
        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* TAB 1: Photo Studio & Live Preview */}
          {activeTab === 'preview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* Aspect Ratio Selector Pills */}
              <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '10px' }}>
                {[
                  { id: '1:1', label: '1:1 Post' },
                  { id: '9:16', label: '9:16 Story' },
                  { id: '16:9', label: '16:9 Web' },
                  { id: '4:6', label: '4x6 Standee' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setAspectRatio(r.id)}
                    style={{
                      flex: 1,
                      padding: '5px 2px',
                      borderRadius: '7px',
                      border: 'none',
                      background: aspectRatio === r.id ? '#ffffff' : 'transparent',
                      color: aspectRatio === r.id ? '#0f172a' : '#64748b',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: aspectRatio === r.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Photorealistic Commercial Photograph Viewport */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: aspectRatio === '9:16' ? '9/14' : aspectRatio === '16:9' ? '16/10' : aspectRatio === '4:6' ? '4/5.5' : '1/1',
                  maxHeight: '370px',
                  borderRadius: '18px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  background: '#0f172a'
                }}
              >
                {/* Background 8K Commercial Photograph */}
                <img
                  src={activePhoto.url}
                  alt={activePhoto.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />

                {/* Live Custom Store Logo / Emblem Composited on Glass */}
                {showStoreLogo && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${activePhoto.logoBox.x}%`,
                      top: `${activePhoto.logoBox.y + (logoVerticalOffset / 6)}%`,
                      transform: 'translate(-50%, -50%)',
                      width: `${activePhoto.logoBox.width * (logoScale / 100)}%`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      pointerEvents: 'none',
                      zIndex: 10,
                      filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.6))'
                    }}
                  >
                    {customLogoImage ? (
                      <img
                        src={customLogoImage}
                        alt="Store Logo"
                        style={{
                          width: '100%',
                          maxHeight: '45px',
                          objectFit: 'contain',
                          opacity: 0.92
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          background: logoStyle === 'badge' ? 'rgba(15, 23, 42, 0.85)' : 'transparent',
                          padding: logoStyle === 'badge' ? '3px 8px' : '0',
                          borderRadius: '6px',
                          border: logoStyle === 'badge' ? '1px solid #f59e0b' : 'none'
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 900,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: logoStyle === 'gold' ? '#fde68a' : logoStyle === 'white' ? '#ffffff' : logoStyle === 'badge' ? '#fbbf24' : '#0f172a',
                            textShadow: logoStyle === 'gold' ? '0 1px 4px rgba(0,0,0,0.85)' : '0 1px 4px rgba(0,0,0,0.7)',
                            lineHeight: 1.1
                          }}
                        >
                          {storeName}
                        </div>
                        <div
                          style={{
                            fontSize: '0.44rem',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: logoStyle === 'gold' ? '#fbbf24' : '#f1f5f9',
                            marginTop: '2px',
                            opacity: 0.95
                          }}
                        >
                          {tagline}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Optional Clean Editorial Promo Overlays */}
                {showPromoOverlay && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '12px',
                        right: '12px',
                        background: 'rgba(15, 23, 42, 0.82)',
                        backdropFilter: 'blur(8px)',
                        padding: '6px 10px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        zIndex: 15,
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                    >
                      <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {storeName} • SPECIALTY MENU
                      </div>
                      <div style={{ fontSize: '0.80rem', fontWeight: 900, color: '#ffffff', margin: '1px 0 0' }}>
                        {drinkName}
                      </div>
                    </div>

                    {showPriceTag && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#059669',
                          color: '#ffffff',
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
                          fontWeight: 900,
                          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)',
                          zIndex: 15,
                          border: '2px solid #ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span style={{ fontSize: '0.56rem', fontWeight: 700, opacity: 0.9 }}>ONLY</span>
                        <span>₱{drinkPrice.toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Quick Inline Toggles Bar */}
              <div style={{ display: 'flex', gap: '8px', background: '#f8fafc', padding: '8px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.70rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showStoreLogo}
                    onChange={(e) => setShowStoreLogo(e.target.checked)}
                    style={{ accentColor: '#059669', cursor: 'pointer' }}
                  />
                  <span>Logo on Cup</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.70rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showPromoOverlay}
                    onChange={(e) => setShowPromoOverlay(e.target.checked)}
                    style={{ accentColor: '#059669', cursor: 'pointer' }}
                  />
                  <span>Header Tag</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.70rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showPriceTag}
                    onChange={(e) => setShowPriceTag(e.target.checked)}
                    style={{ accentColor: '#059669', cursor: 'pointer' }}
                  />
                  <span>Price Pill</span>
                </label>
              </div>

              {/* Beverage Shot & Cup Selector Strip */}
              <div>
                <label style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                  Select Cup & Shot Style
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                  {Object.entries(PHOTOREALISTIC_ASSETS).map(([key, item]) => {
                    const isSelected = selectedAssetKey === key
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedAssetKey(key)}
                        style={{
                          padding: '6px 2px',
                          borderRadius: '8px',
                          border: `1.5px solid ${isSelected ? '#059669' : '#e2e8f0'}`,
                          background: isSelected ? '#f0fdf4' : '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontSize: '1.05rem' }}>{item.icon}</div>
                        <div style={{ fontSize: '0.62rem', fontWeight: 800, color: isSelected ? '#065f46' : '#1e293b', marginTop: '2px', lineHeight: 1.1 }}>
                          {item.cupType.split(' ')[0]}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Download Action Button */}
              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                style={{
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '11px 16px',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                }}
              >
                {isDownloading ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
                <span>{isDownloading ? 'Rendering 8K PNG Graphic...' : 'Download High-Res Graphic (PNG)'}</span>
              </button>
            </div>
          )}

          {/* TAB 2: Cup Branding Customizer */}
          {activeTab === 'branding' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                    Store Name on Cup
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. KAPE CRAFT"
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', fontWeight: 800, boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                    Secondary Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. SPECIALTY COFFEE"
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.76rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Decal Stamp Finish
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                    {[
                      { id: 'gold', name: 'Gold Foil' },
                      { id: 'white', name: 'White Ink' },
                      { id: 'badge', name: 'Dark Crest' },
                      { id: 'black', name: 'Black Print' }
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => { setLogoStyle(st.id); setCustomLogoImage(null); }}
                        style={{
                          padding: '6px 2px',
                          borderRadius: '6px',
                          border: `1px solid ${logoStyle === st.id && !customLogoImage ? '#059669' : '#cbd5e1'}`,
                          background: logoStyle === st.id && !customLogoImage ? '#ecfdf5' : '#ffffff',
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {st.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                    Or Upload Custom Store Logo (PNG)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '100%',
                      padding: '7px',
                      borderRadius: '8px',
                      border: '1px dashed #94a3b8',
                      background: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Upload size={13} />
                    <span>{customLogoImage ? 'Change Uploaded Logo' : 'Upload PNG Logo'}</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>
                      Size: {logoScale}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={logoScale}
                      onChange={(e) => setLogoScale(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#059669' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>
                      Height (Y): {logoVerticalOffset}px
                    </label>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      value={logoVerticalOffset}
                      onChange={(e) => setLogoVerticalOffset(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#059669' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI Prompt Synthesizer */}
          {activeTab === 'prompt' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} color="#8b5cf6" />
                  <span>Synthesized 8K AI Prompt</span>
                </label>
                <button
                  onClick={handleCopyPrompt}
                  style={{
                    background: isCopiedPrompt ? '#ecfdf5' : '#f1f5f9',
                    border: `1px solid ${isCopiedPrompt ? '#a7f3d0' : '#cbd5e1'}`,
                    color: isCopiedPrompt ? '#059669' : '#475569',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isCopiedPrompt ? <Check size={11} color="#059669" /> : <Copy size={11} />}
                  <span>{isCopiedPrompt ? 'Copied!' : 'Copy Prompt'}</span>
                </button>
              </div>

              <textarea
                readOnly
                value={generatedAiPrompt}
                rows={7}
                style={{
                  width: '100%',
                  fontSize: '0.72rem',
                  lineHeight: '1.45',
                  fontFamily: 'monospace',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#1e293b',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* TAB 4: Social Marketing Copy */}
          {activeTab === 'copy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FileText size={12} color="#8b5cf6" />
                  <span>Facebook / Instagram Copy</span>
                </label>
                <button
                  onClick={handleCopyCaption}
                  style={{
                    background: isCopiedCaption ? '#ecfdf5' : '#f1f5f9',
                    border: `1px solid ${isCopiedCaption ? '#a7f3d0' : '#cbd5e1'}`,
                    color: isCopiedCaption ? '#059669' : '#475569',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isCopiedCaption ? <Check size={11} color="#059669" /> : <Copy size={11} />}
                  <span>{isCopiedCaption ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <textarea
                readOnly
                value={generatedSocialCopy}
                rows={9}
                style={{
                  width: '100%',
                  fontSize: '0.72rem',
                  lineHeight: '1.45',
                  fontFamily: 'inherit',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#334155',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
