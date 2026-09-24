import React, { useState, useRef, useEffect } from 'react'
import { 
  Camera, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  X, 
  Sun, 
  Moon, 
  Palette, 
  Smartphone, 
  Monitor, 
  Tag, 
  Share2, 
  Sliders, 
  RefreshCw,
  Eye,
  Type,
  Maximize2,
  SlidersHorizontal,
  FileText,
  Upload,
  Image as ImageIcon,
  Coffee,
  ShieldCheck,
  Flame,
  Snowflake
} from 'lucide-react'

// Curated Photorealistic 8K Commercial Assets mapped to beverage categories & cup styles
const PHOTOREALISTIC_ASSETS = {
  'caramel-macchiato': {
    title: 'Iced Caramel Macchiato (Faceted Glass)',
    url: '/beverages/caramel-macchiato.jpg',
    cupType: 'Faceted Tall Glass',
    isCold: true,
    logoBox: { x: 50, y: 55, width: 28, height: 18, curvature: 0.15 }
  },
  'brown-sugar-shaken': {
    title: 'Iced Brown Sugar Oat Shaken Espresso (Ribbed Highball)',
    url: '/beverages/brown-sugar-shaken.jpg',
    cupType: 'Ribbed Highball Glass',
    isCold: true,
    logoBox: { x: 65, y: 52, width: 26, height: 18, curvature: 0.1 }
  },
  'hot-spanish-latte': {
    title: 'Hot Spanish Latte (Artisanal Ceramic Cup)',
    url: '/beverages/hot-latte-ceramic.jpg',
    cupType: 'Matte Ceramic Café Mug',
    isCold: false,
    logoBox: { x: 50, y: 64, width: 28, height: 16, curvature: 0.2 }
  },
  'takeaway-iced-cup': {
    title: 'Specialty Iced Latte (Clear Takeaway Cup)',
    url: '/beverages/takeaway-iced-cup.jpg',
    cupType: 'Clear PET Takeaway Cup',
    isCold: true,
    logoBox: { x: 50, y: 58, width: 32, height: 20, curvature: 0.12 }
  },
  'matcha-strawberry': {
    title: 'Iced Strawberry Matcha Cloud (Cylindrical Glass)',
    url: '/beverages/matcha-strawberry.jpg',
    cupType: 'Cylindrical Tumbler',
    isCold: true,
    logoBox: { x: 62, y: 56, width: 26, height: 18, curvature: 0.1 }
  }
}

export function BeveragePhotoStudioModal({
  isOpen = false,
  onClose = () => {},
  recipe = {},
  metrics = {}
}) {
  const [aspectRatio, setAspectRatio] = useState('1:1') // '1:1' | '9:16' | '16:9' | '4:6'
  const [activeTab, setActiveTab] = useState('preview') // 'preview' | 'branding' | 'prompt' | 'caption'
  
  // Recipe parameters matching
  const isRecipeHot = recipe.temperature === 'hot' || (recipe.name && recipe.name.toLowerCase().includes('hot'))
  const recipeNameLower = (recipe.name || '').toLowerCase()
  
  // Intelligent selection of default photo asset
  const determineDefaultAsset = () => {
    if (isRecipeHot) return 'hot-spanish-latte'
    if (recipeNameLower.includes('caramel') || recipeNameLower.includes('macchiato')) return 'caramel-macchiato'
    if (recipeNameLower.includes('matcha') || recipeNameLower.includes('strawberry')) return 'matcha-strawberry'
    if (recipe.vesselId?.includes('takeaway') || recipeNameLower.includes('takeaway') || recipeNameLower.includes('to go')) return 'takeaway-iced-cup'
    return 'caramel-macchiato'
  }

  const [selectedAssetKey, setSelectedAssetKey] = useState(determineDefaultAsset())
  
  // Store Branding Customization
  const [storeName, setStoreName] = useState('KAPE CRAFT')
  const [tagline, setTagline] = useState('Artisanal Specialty Coffee')
  const [showStoreLogo, setShowStoreLogo] = useState(true)
  const [logoStyle, setLogoStyle] = useState('gold') // 'gold' | 'white' | 'black' | 'badge'
  const [logoScale, setLogoScale] = useState(100) // %
  const [logoVerticalOffset, setLogoVerticalOffset] = useState(0) // px
  const [customLogoImage, setCustomLogoImage] = useState(null)
  
  // Promo Overlays
  const [showPromoOverlay, setShowPromoOverlay] = useState(true)
  const [showPriceTag, setShowPriceTag] = useState(true)
  const [isCopiedPrompt, setIsCopiedPrompt] = useState(false)
  const [isCopiedCaption, setIsCopiedCaption] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  
  const fileInputRef = useRef(null)

  useEffect(() => {
    setSelectedAssetKey(determineDefaultAsset())
  }, [recipe.name, recipe.temperature])

  if (!isOpen) return null

  const activePhoto = PHOTOREALISTIC_ASSETS[selectedAssetKey] || PHOTOREALISTIC_ASSETS['caramel-macchiato']

  const layers = (metrics?.layersDetailed && metrics.layersDetailed.length > 0)
    ? metrics.layersDetailed
    : (recipe?.layers || [
        { name: 'Vanilla / Caramel Syrup', volumeMl: 25 },
        { name: 'Fresh Whole Milk', volumeMl: 160 },
        { name: 'Espresso Double Shot', volumeMl: 36 },
        { name: 'Cold Foam & Caramel Drizzle', volumeMl: 30 }
      ])

  const drinkPrice = recipe.menuPrice || 185.00
  const drinkName = recipe.name || 'Iced Caramel Macchiato'

  // Intelligent Commercial Prompt Generator based on recipe ingredients, vessel, and branding
  const generatedAiPrompt = `Commercial 8k advertising food photography of an ${isRecipeHot ? 'artisanal hot' : 'iced layered'} ${drinkName}. Served in a ${activePhoto.cupType} with ${showStoreLogo ? `custom '${storeName}' cafe logo branding printed on the cup surface` : 'clean cup exterior'}. Visible delicious layers: ${layers.map(l => l.name).join(', ')}. ${isRecipeHot ? 'Intricate latte art rosette etched in glossy microfoam, gentle rising steam' : 'Crystalline artisanal ice cubes, thick rich drizzle cascading down interior glass walls, glistening cold condensation drops'}. Placed on an authentic marble café tabletop next to vintage spoon and whole roasted espresso beans. Natural 5000K daylight bokeh background, shot on Sony A7R V with 85mm f/1.4 G Master lens, ultra-sharp macro detail, cinematic lighting, photorealistic commercial beverage photography.`

  // Social Media Marketing Copy
  const generatedSocialCopy = `✨ INTRODUCING: Our Signature ${drinkName}! ✨

Crafted for true coffee connoisseurs. Built with precision layers of ${layers.map(l => l.name.replace(/\s*\([^)]*\)/g, '').trim()).join(', ')}.

🔥 Why you'll love every sip:
• 100% Premium Artisanal Wholesale Ingredients
• Balanced harmony (rich aromatics, velvety mouthfeel)
• Served fresh in our signature ${activePhoto.cupType}

📍 Available daily at ${storeName}
🏷️ Launch Price: ₱${drinkPrice.toFixed(2)}
🛵 Order for take-out or delivery via GrabFood & FoodPanda!

#PourCraft #SpecialtyCoffeePH #ManilaCafe #BaristaDaily #CoffeeLoverPH #KapeTayo #ArtisanBeverage`

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
      reader.onload = (event) => {
        setCustomLogoImage(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Composite Photorealistic Image + Store Logo Decal + Optional Overlays to High-Res Canvas
  const handleDownloadImage = () => {
    setIsDownloading(true)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = activePhoto.url

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      let targetW = 1920
      let targetH = 1080

      if (aspectRatio === '1:1') {
        targetW = 1200
        targetH = 1200
      } else if (aspectRatio === '9:16') {
        targetW = 1080
        targetH = 1920
      } else if (aspectRatio === '4:6') {
        targetW = 1200
        targetH = 1800
      }

      canvas.width = targetW
      canvas.height = targetH

      // 1. Draw base photorealistic image with aspect-ratio crop / cover
      const scale = Math.max(targetW / img.width, targetH / img.height)
      const x = (targetW / 2) - (img.width / 2) * scale
      const y = (targetH / 2) - (img.height / 2) * scale
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

      // 2. Composite Store Logo / Branding onto Cup
      if (showStoreLogo) {
        const logoX = targetW * (activePhoto.logoBox.x / 100)
        const logoY = (targetH * (activePhoto.logoBox.y / 100)) + logoVerticalOffset
        const logoW = (targetW * (activePhoto.logoBox.width / 100)) * (logoScale / 100)
        const logoH = (targetH * (activePhoto.logoBox.height / 100)) * (logoScale / 100)

        ctx.save()
        ctx.translate(logoX, logoY)

        if (customLogoImage) {
          const userLogo = new Image()
          userLogo.src = customLogoImage
          userLogo.onload = () => {
            ctx.globalAlpha = 0.85
            ctx.drawImage(userLogo, -logoW / 2, -logoH / 2, logoW, logoH)
            finalizeCanvas()
          }
          return
        } else {
          // Draw Stylized Store Emblem
          if (logoStyle === 'gold') {
            ctx.fillStyle = 'rgba(245, 158, 11, 0.9)'
            ctx.strokeStyle = 'rgba(254, 243, 199, 0.95)'
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
            ctx.shadowBlur = 6
          } else if (logoStyle === 'white') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
            ctx.shadowBlur = 6
          } else if (logoStyle === 'badge') {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
            ctx.strokeStyle = '#f59e0b'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.roundRect(-logoW / 2, -logoH / 2, logoW, logoH, 12)
            ctx.fill()
            ctx.stroke()
            ctx.fillStyle = '#ffffff'
          } else {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
            ctx.strokeStyle = 'rgba(15, 23, 42, 0.6)'
          }

          // Store Name Typography
          ctx.font = `800 ${Math.round(logoW * 0.16)}px 'Outfit', sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(storeName.toUpperCase(), 0, -logoH * 0.1)

          // Subtitle / Tagline
          ctx.font = `600 ${Math.round(logoW * 0.08)}px 'Inter', sans-serif`
          ctx.fillText(tagline.toUpperCase(), 0, logoH * 0.22)

          // Decorative border line
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(-logoW * 0.35, logoH * 0.05)
          ctx.lineTo(logoW * 0.35, logoH * 0.05)
          ctx.stroke()

          ctx.restore()
        }
      }

      finalizeCanvas()

      function finalizeCanvas() {
        // 3. Draw Optional Promo Header & Price Tag Overlays
        if (showPromoOverlay) {
          // Promo Top Banner
          ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'
          ctx.beginPath()
          ctx.roundRect(targetW * 0.08, targetH * 0.06, targetW * 0.84, targetH * 0.14, 16)
          ctx.fill()
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.fillStyle = '#f59e0b'
          ctx.font = `700 ${Math.round(targetW * 0.018)}px sans-serif`
          ctx.textAlign = 'center'
          ctx.fillText(storeName.toUpperCase() + ' • SPECIALTY RELEASE', targetW / 2, targetH * 0.10)

          ctx.fillStyle = '#ffffff'
          ctx.font = `800 ${Math.round(targetW * 0.032)}px sans-serif`
          ctx.fillText(drinkName, targetW / 2, targetH * 0.155)

          // Price Tag Pill
          if (showPriceTag) {
            const pillW = targetW * 0.22
            const pillH = targetH * 0.075
            const pillX = (targetW - pillW) / 2
            const pillY = targetH * 0.86

            ctx.fillStyle = '#059669'
            ctx.beginPath()
            ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2)
            ctx.fill()
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = 3
            ctx.stroke()

            ctx.fillStyle = '#ffffff'
            ctx.font = `800 ${Math.round(pillH * 0.48)}px sans-serif`
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
        background: 'rgba(15, 23, 42, 0.85)',
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
          maxWidth: '560px',
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
        {/* 1. Modal Header Bar */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
              }}
            >
              <Camera size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                AI Beverage Photo Studio
                <span style={{ fontSize: '0.64rem', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                  8K Photorealistic
                </span>
              </h2>
              <p style={{ fontSize: '0.70rem', color: '#64748b', margin: '2px 0 0' }}>
                Ultra-realistic commercial photos with customizable store branding & cups.
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

        {/* 2. Top Segmented Tabs Navigation */}
        <div style={{ display: 'flex', background: '#f8fafc', padding: '6px 14px', borderBottom: '1px solid #e2e8f0', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('preview')}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'preview' ? '#0f172a' : 'transparent',
              color: activeTab === 'preview' ? '#ffffff' : '#64748b',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Camera size={13} />
            <span>Studio Shot</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'branding' ? '#0f172a' : 'transparent',
              color: activeTab === 'branding' ? '#ffffff' : '#64748b',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Palette size={13} />
            <span>Cup Branding & Logo</span>
          </button>

          <button
            onClick={() => setActiveTab('prompt')}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'prompt' ? '#0f172a' : 'transparent',
              color: activeTab === 'prompt' ? '#ffffff' : '#64748b',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={13} />
            <span>AI Prompt</span>
          </button>

          <button
            onClick={() => setActiveTab('caption')}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'caption' ? '#0f172a' : 'transparent',
              color: activeTab === 'caption' ? '#ffffff' : '#64748b',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <FileText size={13} />
            <span>Copy</span>
          </button>
        </div>

        {/* 3. Main Content View Area */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* TAB 1: Photorealistic Studio & Live Preview */}
          {activeTab === 'preview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Aspect Ratio Selector Pills */}
              <div style={{ display: 'flex', gap: '6px', background: '#f8fafc', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <button
                  onClick={() => setAspectRatio('1:1')}
                  style={{
                    flex: 1,
                    padding: '6px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    background: aspectRatio === '1:1' ? '#0f172a' : 'transparent',
                    color: aspectRatio === '1:1' ? '#ffffff' : '#64748b',
                    fontSize: '0.70rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  1:1 Post
                </button>
                <button
                  onClick={() => setAspectRatio('9:16')}
                  style={{
                    flex: 1,
                    padding: '6px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    background: aspectRatio === '9:16' ? '#0f172a' : 'transparent',
                    color: aspectRatio === '9:16' ? '#ffffff' : '#64748b',
                    fontSize: '0.70rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  9:16 Story
                </button>
                <button
                  onClick={() => setAspectRatio('16:9')}
                  style={{
                    flex: 1,
                    padding: '6px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    background: aspectRatio === '16:9' ? '#0f172a' : 'transparent',
                    color: aspectRatio === '16:9' ? '#ffffff' : '#64748b',
                    fontSize: '0.70rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  16:9 Web
                </button>
                <button
                  onClick={() => setAspectRatio('4:6')}
                  style={{
                    flex: 1,
                    padding: '6px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    background: aspectRatio === '4:6' ? '#0f172a' : 'transparent',
                    color: aspectRatio === '4:6' ? '#ffffff' : '#64748b',
                    fontSize: '0.70rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  4x6 Standee
                </button>
              </div>

              {/* Photorealistic Commercial Photograph Viewport Frame */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: aspectRatio === '9:16' ? '9/14' : aspectRatio === '16:9' ? '16/10' : aspectRatio === '4:6' ? '4/5.5' : '1/1',
                  maxHeight: '390px',
                  borderRadius: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                  border: '1px solid #e2e8f0',
                  background: '#0f172a'
                }}
              >
                {/* Background Photorealistic Image */}
                <img
                  src={activePhoto.url}
                  alt={activePhoto.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />

                {/* Live Custom Store Logo / Emblem Composited directly on Cup */}
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
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                    }}
                  >
                    {customLogoImage ? (
                      <img
                        src={customLogoImage}
                        alt="Store Logo"
                        style={{
                          width: '100%',
                          maxHeight: '48px',
                          objectFit: 'contain',
                          opacity: 0.9
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          background: logoStyle === 'badge' ? 'rgba(15, 23, 42, 0.85)' : 'transparent',
                          padding: logoStyle === 'badge' ? '4px 8px' : '0',
                          borderRadius: '8px',
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
                            textShadow: logoStyle === 'gold' ? '0 1px 3px rgba(0,0,0,0.8)' : '0 1px 4px rgba(0,0,0,0.6)',
                            lineHeight: 1.1
                          }}
                        >
                          {storeName}
                        </div>
                        <div
                          style={{
                            fontSize: '0.45rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            color: logoStyle === 'gold' ? '#fbbf24' : '#e2e8f0',
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

                {/* Optional Promo Standee Top & Price Overlays */}
                {showPromoOverlay && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        right: '12px',
                        background: 'rgba(15, 23, 42, 0.82)',
                        backdropFilter: 'blur(8px)',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        zIndex: 15,
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                    >
                      <div style={{ fontSize: '0.58rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {storeName} • SPECIALTY MENU
                      </div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#ffffff', margin: '2px 0 0' }}>
                        {drinkName}
                      </div>
                    </div>

                    {showPriceTag && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '14px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#059669',
                          color: '#ffffff',
                          padding: '5px 14px',
                          borderRadius: '999px',
                          fontSize: '0.84rem',
                          fontWeight: 900,
                          boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
                          zIndex: 15,
                          border: '2px solid #ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span style={{ fontSize: '0.60rem', fontWeight: 700, opacity: 0.9 }}>ONLY</span>
                        <span>₱{drinkPrice.toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Vessel / Drink Variation Carousel Selector */}
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                  Select Beverage Shot & Cup Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {Object.entries(PHOTOREALISTIC_ASSETS).map(([key, item]) => {
                    const isSelected = selectedAssetKey === key
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedAssetKey(key)}
                        style={{
                          padding: '6px 8px',
                          borderRadius: '10px',
                          border: `1.5px solid ${isSelected ? '#059669' : '#e2e8f0'}`,
                          background: isSelected ? '#f0fdf4' : '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: isSelected ? '#065f46' : '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.cupType.split(' ')[0]} {item.cupType.split(' ')[1] || ''}
                        </div>
                        <div style={{ fontSize: '0.62rem', color: isSelected ? '#059669' : '#64748b', marginTop: '1px' }}>
                          {item.isCold ? '❄️ Iced' : '🔥 Hot'}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 1-Tap Download High-Res PNG Button */}
              <button
                onClick={handleDownloadImage}
                disabled={isDownloading}
                style={{
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)'
                }}
              >
                {isDownloading ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
                <span>{isDownloading ? 'Rendering 8K PNG Graphic...' : 'Download High-Res Graphic (PNG)'}</span>
              </button>
            </div>
          )}

          {/* TAB 2: Cup Branding & Store Logo Customizer */}
          {activeTab === 'branding' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.80rem', fontWeight: 800, color: '#0f172a' }}>Enable Cup Store Branding</span>
                  <input
                    type="checkbox"
                    checked={showStoreLogo}
                    onChange={(e) => setShowStoreLogo(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#059669', cursor: 'pointer' }}
                  />
                </div>

                {showStoreLogo && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.70rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Store Name / Café Title
                      </label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="e.g. KAPE CRAFT COFFEE"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.80rem', fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.70rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Secondary Tagline
                      </label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="e.g. ARTISANAL SPECIALTY"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.80rem', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.70rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                        Cup Decal Finish / Stamp Style
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                        {[
                          { id: 'gold', name: 'Gold Foil' },
                          { id: 'white', name: 'White Ink' },
                          { id: 'black', name: 'Black Print' },
                          { id: 'badge', name: 'Dark Crest' }
                        ].map(st => (
                          <button
                            key={st.id}
                            onClick={() => { setLogoStyle(st.id); setCustomLogoImage(null); }}
                            style={{
                              padding: '6px 4px',
                              borderRadius: '8px',
                              border: `1px solid ${logoStyle === st.id && !customLogoImage ? '#059669' : '#cbd5e1'}`,
                              background: logoStyle === st.id && !customLogoImage ? '#ecfdf5' : '#ffffff',
                              fontSize: '0.68rem',
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
                      <label style={{ fontSize: '0.70rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Or Upload Custom Logo Image (PNG / Transparent)
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
                          padding: '8px',
                          borderRadius: '8px',
                          border: '1px dashed #94a3b8',
                          background: '#ffffff',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: '#475569',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Upload size={14} />
                        <span>{customLogoImage ? 'Change Uploaded Logo' : 'Upload PNG Store Logo'}</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>
                          Size: {logoScale}%
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="160"
                          value={logoScale}
                          onChange={(e) => setLogoScale(Number(e.target.value))}
                          style={{ width: '100%', accentColor: '#059669' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '2px' }}>
                          Position (Y): {logoVerticalOffset}px
                        </label>
                        <input
                          type="range"
                          min="-40"
                          max="40"
                          value={logoVerticalOffset}
                          onChange={(e) => setLogoVerticalOffset(Number(e.target.value))}
                          style={{ width: '100%', accentColor: '#059669' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Promotional Standee Overlays */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155' }}>Social Promo Top Header & Title</span>
                  <input
                    type="checkbox"
                    checked={showPromoOverlay}
                    onChange={(e) => setShowPromoOverlay(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#059669', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155' }}>Price Badge (₱{drinkPrice.toFixed(2)})</span>
                  <input
                    type="checkbox"
                    checked={showPriceTag}
                    onChange={(e) => setShowPriceTag(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#059669', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Intelligent 8K AI Prompt Synthesizer */}
          {activeTab === 'prompt' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={13} color="#8b5cf6" />
                  <span>Synthesized 8K Midjourney / Flux Prompt</span>
                </label>
                <button
                  onClick={handleCopyPrompt}
                  style={{
                    background: isCopiedPrompt ? '#ecfdf5' : '#f1f5f9',
                    border: `1px solid ${isCopiedPrompt ? '#a7f3d0' : '#cbd5e1'}`,
                    color: isCopiedPrompt ? '#059669' : '#475569',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isCopiedPrompt ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                  <span>{isCopiedPrompt ? 'Copied!' : 'Copy Prompt'}</span>
                </button>
              </div>

              <textarea
                readOnly
                value={generatedAiPrompt}
                rows={8}
                style={{
                  width: '100%',
                  fontSize: '0.74rem',
                  lineHeight: '1.45',
                  fontFamily: 'monospace',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#1e293b',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{ fontSize: '0.68rem', color: '#64748b', margin: 0 }}>
                💡 Automatically constructed from your recipe ingredients, temperature, chosen cup vessel, and store name. Ready to paste into Midjourney v6, Flux, or DALL-E 3.
              </p>
            </div>
          )}

          {/* TAB 4: AI Social Media Copywriter */}
          {activeTab === 'caption' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={13} color="#8b5cf6" />
                  <span>Facebook & Instagram Marketing Copy</span>
                </label>
                <button
                  onClick={handleCopyCaption}
                  style={{
                    background: isCopiedCaption ? '#ecfdf5' : '#f1f5f9',
                    border: `1px solid ${isCopiedCaption ? '#a7f3d0' : '#cbd5e1'}`,
                    color: isCopiedCaption ? '#059669' : '#475569',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isCopiedCaption ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                  <span>{isCopiedCaption ? 'Copied!' : 'Copy Caption'}</span>
                </button>
              </div>

              <textarea
                readOnly
                value={generatedSocialCopy}
                rows={10}
                style={{
                  width: '100%',
                  fontSize: '0.74rem',
                  lineHeight: '1.5',
                  fontFamily: 'inherit',
                  padding: '12px',
                  borderRadius: '12px',
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
