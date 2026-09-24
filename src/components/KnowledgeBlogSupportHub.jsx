import React, { useState, useMemo } from 'react'
import { 
  BookOpen, Newspaper, HelpCircle, Search, Sparkles, ChevronRight, 
  Clock, User, Tag, CheckCircle2, AlertTriangle, ArrowRight, 
  MessageSquare, Send, ThumbsUp, Bookmark, ExternalLink, X, Zap, 
  ShieldCheck, ArrowLeft, Star, Heart, Share2, Award, Coffee, FlaskConical
} from 'lucide-react'
import { KNOWLEDGE_ARTICLES, BLOG_POSTS, TROUBLESHOOTING_FAQS } from '../data/knowledgeBlogData'
import { triggerHaptic } from '../utils/haptics'

export function KnowledgeBlogSupportHub({
  onOpenStudioWithRecipe,
  onOpenRnDLab
}) {
  const [activeSection, setActiveSection] = useState('knowledge') // 'knowledge' | 'blog' | 'support'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null) // Active article or blog post for Full-Page view
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Rating & Comments State per article ID
  const [userRatings, setUserRatings] = useState({}) // { [articleId]: ratingNumber }
  const [articleComments, setArticleComments] = useState(() => {
    const initial = {}
    KNOWLEDGE_ARTICLES.forEach(a => { initial[a.id] = a.comments || [] })
    BLOG_POSTS.forEach(b => { initial[b.id] = b.comments || [] })
    return initial
  })
  const [newCommentText, setNewCommentText] = useState('')
  const [commentRating, setCommentRating] = useState(5)
  const [commentSubmitted, setCommentSubmitted] = useState(false)

  // AI Assistant Query State
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiResponse, setAiResponse] = useState(null)
  const [isAiThinking, setIsAiThinking] = useState(false)

  // Support Ticket State
  const [supportMessage, setSupportMessage] = useState('')
  const [supportSubmitted, setSupportSubmitted] = useState(false)

  // Filtered Knowledge Articles
  const filteredArticles = useMemo(() => {
    return KNOWLEDGE_ARTICLES.filter(art => {
      const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory
      const q = searchQuery.toLowerCase().trim()
      if (!q) return matchesCategory

      const matchesTitle = art.title.toLowerCase().includes(q)
      const matchesSummary = art.summary.toLowerCase().includes(q)
      const matchesTags = art.tags?.some(t => t.toLowerCase().includes(q))
      return matchesCategory && (matchesTitle || matchesSummary || matchesTags)
    })
  }, [selectedCategory, searchQuery])

  // Filtered Blog Posts
  const filteredBlogs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return BLOG_POSTS
    return BLOG_POSTS.filter(post => 
      post.title.toLowerCase().includes(q) || 
      post.summary?.toLowerCase().includes(q) ||
      post.category?.toLowerCase().includes(q) ||
      post.tags?.some(t => t.toLowerCase().includes(q))
    )
  }, [searchQuery])

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return TROUBLESHOOTING_FAQS
    return TROUBLESHOOTING_FAQS.filter(f => 
      f.question.toLowerCase().includes(q) || 
      f.answer.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    )
  }, [searchQuery])

  // Handle User Rating
  const handleRateArticle = (itemId, ratingValue) => {
    triggerHaptic('success')
    setUserRatings(prev => ({ ...prev, [itemId]: ratingValue }))
  }

  // Handle Add Comment
  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newCommentText.trim() || !selectedItem) return

    triggerHaptic('success')
    const newComment = {
      id: `c-user-${Date.now()}`,
      userName: 'You (Head Barista)',
      userRole: 'Verified Creator',
      rating: commentRating,
      timestamp: 'Just now',
      text: newCommentText.trim(),
      likes: 0
    }

    setArticleComments(prev => ({
      ...prev,
      [selectedItem.id]: [newComment, ...(prev[selectedItem.id] || [])]
    }))

    setNewCommentText('')
    setCommentSubmitted(true)
    setTimeout(() => setCommentSubmitted(false), 3000)
  }

  // Handle Like Comment
  const handleLikeComment = (itemId, commentId) => {
    triggerHaptic('tap')
    setArticleComments(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || []).map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c)
    }))
  }

  // Simulate AI Assistant instant answers
  const handleAskAi = (e) => {
    e.preventDefault()
    if (!aiQuestion.trim()) return

    triggerHaptic('selection')
    setIsAiThinking(true)
    setAiResponse(null)

    setTimeout(() => {
      setIsAiThinking(false)
      const q = aiQuestion.toLowerCase()
      if (q.includes('sour') || q.includes('dial') || q.includes('espresso')) {
        setAiResponse({
          title: '☕ Espresso Dialing Recommendation',
          answer: 'Your espresso is likely under-extracted (high acidity, salty astringency). We recommend: (1) Grind 2 notches finer, (2) Extend brew time to 28-30s, or (3) Increase water temperature to 93.5°C to pull sweeter soluble sugars.',
          suggestedArticle: KNOWLEDGE_ARTICLES[0]
        })
      } else if (q.includes('foam') || q.includes('milk') || q.includes('deflate')) {
        setAiResponse({
          title: '☁️ Cold Foam Stabilization Formulation',
          answer: 'Cold foam collapses when lipid/protein ratios are too low. Formulate with 60% fresh chilled milk + 40% heavy cream + 15ml vanilla syrup for structural density. Whip at 4°C for 18 seconds.',
          suggestedArticle: KNOWLEDGE_ARTICLES[1]
        })
      } else if (q.includes('curdle') || q.includes('citrus') || q.includes('yuzu') || q.includes('lemon')) {
        setAiResponse({
          title: '🍋 Acid-Protein Coagulation Prevention',
          answer: 'Citrus juice (pH < 2.5) coagulates dairy casein. For layered tonics: (1) Use oat milk or tonic soda without dairy, or (2) Separate the citrus syrup with dense ice before floating espresso.',
          suggestedArticle: null
        })
      } else {
        setAiResponse({
          title: '💡 Food-Science R&D Insight',
          answer: `For "${aiQuestion}", beverage chemistry suggests balancing the sugar density (target 16–20° Brix) and pairing with complementary lipid notes. Check our master guides or test in R&D Lab!`,
          suggestedArticle: null
        })
      }
    }, 550)
  }

  const handleSendSupport = (e) => {
    e.preventDefault()
    if (!supportMessage.trim()) return
    triggerHaptic('success')
    setSupportSubmitted(true)
    setTimeout(() => {
      setSupportSubmitted(false)
      setSupportMessage('')
    }, 3500)
  }

  // ==========================================
  // 1. FULL-PAGE ARTICLE / BLOG READER VIEW
  // ==========================================
  if (selectedItem) {
    const currentComments = articleComments[selectedItem.id] || []
    const currentUserRating = userRatings[selectedItem.id] || 0
    const displayedAvgRating = currentUserRating 
      ? (((selectedItem.rating * selectedItem.ratingsCount) + currentUserRating) / (selectedItem.ratingsCount + 1)).toFixed(2)
      : (selectedItem.rating || 4.90).toFixed(2)
    const displayedRatingsCount = currentUserRating ? (selectedItem.ratingsCount + 1) : selectedItem.ratingsCount

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '140px' }}>
        {/* Top Back Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
          <button
            onClick={() => {
              triggerHaptic('tap')
              setSelectedItem(null)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Academy</span>
          </button>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>
              {selectedItem.categoryName || selectedItem.category}
            </span>
          </div>
        </div>

        {/* Hero Banner Header */}
        <div style={{ borderRadius: '20px', overflow: 'hidden', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
          {selectedItem.image && (
            <div style={{ height: '180px', width: '100%', position: 'relative', background: '#1e293b' }}>
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80'
                }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#cbd5e1' }}>
                  <Clock size={13} />
                  <span>{selectedItem.readTime || '4 min read'}</span>
                  <span>•</span>
                  <span>{selectedItem.publishedDate || selectedItem.date || 'Sept 2026'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f59e0b', color: '#0f172a', padding: '3px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900 }}>
                  <Star size={13} fill="#0f172a" />
                  <span>{displayedAvgRating} ({displayedRatingsCount})</span>
                </div>
              </div>
            </div>
          )}

          {/* Article Info & Author */}
          <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 12px', lineHeight: 1.3 }}>
              {selectedItem.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '1.4rem' }}>{selectedItem.authorAvatar || '👨‍🍳'}</span>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                  {selectedItem.author}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {selectedItem.authorRole || 'Beverage Consultant'}
                </div>
              </div>
            </div>

            {/* Formatted Markdown Content */}
            <div style={{ marginTop: '20px', fontSize: '0.88rem', color: '#334155', lineHeight: 1.65 }}>
              <div style={{ whiteSpace: 'pre-line' }}>
                {selectedItem.content}
              </div>
            </div>

            {/* Tags Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              {(selectedItem.tags || []).map((tag, idx) => (
                <span key={idx} style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '8px', fontWeight: 600 }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Interactive 5-Star Rating Widget */}
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Article Rating & Quality
              </span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0' }}>
                How helpful was this food-science guide?
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#d97706' }}>
                ★ {displayedAvgRating}
              </div>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{displayedRatingsCount} barista ratings</span>
            </div>
          </div>

          {/* Interactive Star Buttons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
            {[1, 2, 3, 4, 5].map(starNum => {
              const isFilled = starNum <= (currentUserRating || Math.round(parseFloat(displayedAvgRating)))
              return (
                <button
                  key={starNum}
                  onClick={() => handleRateArticle(selectedItem.id, starNum)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    transition: 'transform 0.15s'
                  }}
                  title={`Rate ${starNum} Stars`}
                >
                  <Star 
                    size={28} 
                    color="#f59e0b" 
                    fill={isFilled ? '#f59e0b' : 'none'} 
                  />
                </button>
              )
            })}
            {currentUserRating > 0 && (
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', marginLeft: '6px', background: '#f0fdf4', padding: '3px 8px', borderRadius: '8px' }}>
                ✓ You rated {currentUserRating} ★
              </span>
            )}
          </div>
        </div>

        {/* 3. Barista Comments & Community Discussion */}
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} color="#2563eb" />
              <span>Barista Discussions ({currentComments.length})</span>
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Community peer review</span>
          </div>

          {/* Leave a Comment Form */}
          <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Your Rating:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setCommentRating(n)}
                    style={{ background: 'transparent', border: 'none', padding: '2px', cursor: 'pointer' }}
                  >
                    <Star size={16} color="#f59e0b" fill={n <= commentRating ? '#f59e0b' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              required
              placeholder="Share your cafe tasting experience, SOP tweaks, or questions with the community..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                fontSize: '0.84rem',
                fontFamily: 'inherit'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="submit"
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Send size={13} />
                <span>Post Comment</span>
              </button>

              {commentSubmitted && (
                <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                  ✓ Comment published!
                </span>
              )}
            </div>
          </form>

          {/* Comments Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
            {currentComments.map(c => (
              <div
                key={c.id}
                style={{
                  background: '#f8fafc',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>{c.userName}</span>
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>• {c.userRole}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ display: 'flex' }}>
                      {[...Array(c.rating || 5)].map((_, i) => (
                        <Star key={i} size={11} color="#f59e0b" fill="#f59e0b" />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{c.timestamp}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0, lineHeight: 1.4 }}>
                  {c.text}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                  <button
                    onClick={() => handleLikeComment(selectedItem.id, c.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '2px 6px',
                      borderRadius: '6px'
                    }}
                  >
                    <ThumbsUp size={12} />
                    <span>Helpful ({c.likes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // 2. MAIN ACADEMY & SUPPORT HUB OVERVIEW VIEW
  // ==========================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }}>
      {/* 1. Hub Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <BookOpen size={18} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              PourCraft Academy & Help Desk
            </span>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Knowledge Base, Blog & Support
            </h1>
          </div>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
          Food-science masterclasses, viral beverage trend breakdowns, and 24/7 barista troubleshooting.
        </p>
      </div>

      {/* 2. Universal Search Input */}
      <div style={{ position: 'relative' }}>
        <Search 
          size={18} 
          color="#94a3b8" 
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} 
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search guides, blog articles, SOPs, FAQs (e.g. Dialing, Curdling, Oat Milk)..."
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '13px 40px 13px 44px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            fontSize: '0.88rem',
            color: '#0f172a',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            outline: 'none'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              fontSize: '0.75rem',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* 3. Section Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '14px' }}>
        {[
          { id: 'knowledge', label: '📚 Knowledge Base', count: KNOWLEDGE_ARTICLES.length },
          { id: 'blog', label: '📰 Trends & Blog', count: BLOG_POSTS.length },
          { id: 'support', label: '🛠️ Support & FAQs', count: TROUBLESHOOTING_FAQS.length }
        ].map(tab => {
          const isActive = activeSection === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('tap')
                setActiveSection(tab.id)
              }}
              style={{
                flex: 1,
                padding: '9px 6px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#0f172a' : '#64748b',
                fontSize: '0.78rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease',
                textAlign: 'center'
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 4. AI Barista R&D Consultant Box */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '18px', padding: '16px', color: '#ffffff', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Sparkles size={16} color="#38bdf8" />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            AI Barista R&D Assistant
          </span>
        </div>

        <form onSubmit={handleAskAi} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Ask anything (e.g. 'Why is my espresso sour?' or 'How to stabilize cold foam?')..."
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={isAiThinking}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: '#38bdf8',
              color: '#0f172a',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isAiThinking ? <Sparkles size={14} className="animate-spin" /> : <span>Ask AI</span>}
          </button>
        </form>

        {/* AI Answer Card */}
        {aiResponse && (
          <div style={{ marginTop: '12px', padding: '12px 14px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8' }}>
              {aiResponse.title}
            </div>
            <p style={{ fontSize: '0.78rem', color: '#e2e8f0', margin: '6px 0 0', lineHeight: 1.45 }}>
              {aiResponse.answer}
            </p>
            {aiResponse.suggestedArticle && (
              <button
                onClick={() => setSelectedItem(aiResponse.suggestedArticle)}
                style={{ marginTop: '8px', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid #38bdf8', color: '#ffffff', borderRadius: '8px', padding: '4px 10px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Read Full Masterclass Guide</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* SECTION 1: KNOWLEDGE BASE ARTICLES */}
      {activeSection === 'knowledge' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredArticles.map(article => {
            const commentsCount = (articleComments[article.id] || []).length
            return (
              <div
                key={article.id}
                onClick={() => {
                  triggerHaptic('selection')
                  setSelectedItem(article)
                }}
                style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}
              >
                {/* Crisp Portrait Thumbnail */}
                <div 
                  style={{ 
                    width: '100px', 
                    height: '120px', 
                    borderRadius: '14px', 
                    background: '#1e293b', 
                    position: 'relative', 
                    flexShrink: 0,
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                  }}
                >
                  <img
                    src={article.image || '/beverages/caramel-macchiato.jpg'}
                    alt={article.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80'
                    }}
                  />
                  <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', color: '#38bdf8', padding: '2px 6px', borderRadius: '6px', fontSize: '0.62rem', fontWeight: 800 }}>
                    {article.categoryName}
                  </div>
                </div>

                {/* Right Side Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94a3b8' }}>
                    <span>{article.readTime} • {article.publishedDate}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#d97706', fontWeight: 800 }}>
                      <Star size={11} fill="#d97706" />
                      {article.rating}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.title}
                  </h3>

                  <p style={{ fontSize: '0.74rem', color: '#64748b', margin: 0, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.summary}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '4px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {(article.tags || []).slice(0, 2).map((t, idx) => (
                        <span key={idx} style={{ fontSize: '0.64rem', background: '#f8fafc', color: '#64748b', padding: '2px 5px', borderRadius: '6px' }}>
                          #{t}
                        </span>
                      ))}
                    </div>

                    <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <MessageSquare size={11} />
                      <span>{commentsCount}</span>
                      <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* SECTION 2: BEVERAGE SCIENCE & TRENDS BLOG */}
      {activeSection === 'blog' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredBlogs.map(post => {
            const commentsCount = (articleComments[post.id] || []).length
            return (
              <div
                key={post.id}
                onClick={() => {
                  triggerHaptic('selection')
                  setSelectedItem(post)
                }}
                style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  padding: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}
              >
                {/* Crisp Portrait Thumbnail (Shows Entire Vertical Glass Clearly) */}
                <div 
                  style={{ 
                    width: '105px', 
                    height: '125px', 
                    borderRadius: '14px', 
                    background: '#1e293b', 
                    position: 'relative', 
                    flexShrink: 0,
                    overflow: 'hidden',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                  }}
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80'
                    }}
                  />
                  <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', color: '#fbbf24', padding: '2px 6px', borderRadius: '6px', fontSize: '0.62rem', fontWeight: 800 }}>
                    {post.category}
                  </div>
                </div>

                {/* Right Side: Editorial Content & Metadata */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: '#94a3b8' }}>
                    <span>{post.author} • {post.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#d97706', fontWeight: 800 }}>
                      <Star size={11} fill="#d97706" />
                      {post.rating}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.title}
                  </h3>

                  <p style={{ fontSize: '0.74rem', color: '#64748b', margin: 0, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.summary || post.excerpt}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '4px' }}>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} />
                      {post.readTime}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <MessageSquare size={11} />
                      <span>{commentsCount} comments</span>
                      <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* SECTION 3: BARISTA SUPPORT & FAQS */}
      {activeSection === 'support' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* FAQ Accordion List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0' }}>
              🔍 Frequent Troubleshooting Inquiries:
            </h3>

            {filteredFaqs.map(faq => (
              <div
                key={faq.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.66rem', fontWeight: 800, background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '6px' }}>
                    {faq.category}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {faq.question}
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: 1.45 }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Support Ticket Form */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} color="#2563eb" />
              <span>Submit Barista Help Ticket or Formulation Request</span>
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
              Need a custom ingredient formulation, costing sheet review, or Shopee/Lazada SKU sync?
            </p>

            <form onSubmit={handleSendSupport} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea
                rows={3}
                required
                placeholder="Describe your question or request..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  fontFamily: 'inherit'
                }}
              />
              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Send size={13} />
                <span>Send to PourCraft Support</span>
              </button>
            </form>

            {supportSubmitted && (
              <div style={{ padding: '8px 12px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', color: '#065f46', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#059669" />
                <span>Ticket logged! An R&D specialist will review within 24 hours.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
