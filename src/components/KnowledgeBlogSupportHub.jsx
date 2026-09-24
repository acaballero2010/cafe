import React, { useState, useMemo } from 'react'
import { 
  BookOpen, Newspaper, HelpCircle, Search, Sparkles, ChevronRight, 
  Clock, User, Tag, CheckCircle2, AlertTriangle, ArrowRight, 
  MessageSquare, Send, ThumbsUp, Bookmark, ExternalLink, X, Zap, ShieldCheck
} from 'lucide-react'
import { KNOWLEDGE_ARTICLES, BLOG_POSTS, TROUBLESHOOTING_FAQS } from '../data/knowledgeBlogData'
import { triggerHaptic } from '../utils/haptics'

export function KnowledgeBlogSupportHub({
  onOpenStudioWithRecipe,
  onOpenRnDLab
}) {
  const [activeSection, setActiveSection] = useState('knowledge') // 'knowledge' | 'blog' | 'support'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

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
          suggestedLink: 'kb-espresso-dialing'
        })
      } else if (q.includes('foam') || q.includes('milk') || q.includes('deflate')) {
        setAiResponse({
          title: '☁️ Cold Foam Stabilization Formulation',
          answer: 'Cold foam collapses when lipid/protein ratios are too low. Formulate with 60% fresh chilled milk + 40% heavy cream + 15ml vanilla syrup for structural density. Whip at 4°C for 18 seconds.',
          suggestedLink: 'faq-cold-foam-deflating'
        })
      } else if (q.includes('curdle') || q.includes('citrus') || q.includes('yuzu') || q.includes('lemon')) {
        setAiResponse({
          title: '🍋 Acid-Protein Coagulation Prevention',
          answer: 'Citrus juice (pH < 2.5) coagulates dairy casein. For layered tonics: (1) Use oat milk or tonic soda without dairy, or (2) Separate the citrus syrup with dense ice before floating espresso.',
          suggestedLink: 'faq-citrus-curdling'
        })
      } else {
        setAiResponse({
          title: '💡 Food-Science R&D Insight',
          answer: `For "${aiQuestion}", beverage chemistry suggests balancing the sugar density (target 16–20° Brix) and pairing with complementary lipid notes. Test this formulation directly in the R&D Lab or Recipe Studio!`,
          suggestedLink: null
        })
      }
    }, 600)
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
          </div>
        )}
      </div>

      {/* SECTION 1: KNOWLEDGE BASE ARTICLES */}
      {activeSection === 'knowledge' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredArticles.map(article => (
            <div
              key={article.id}
              onClick={() => {
                triggerHaptic('selection')
                setSelectedArticle(article)
              }}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                transition: 'transform 0.15s'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800 }}>
                    {article.categoryName}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {article.readTime}
                  </span>
                </div>

                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', lineHeight: 1.3 }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  {article.summary}
                </p>

                <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                  {article.tags.map((t, idx) => (
                    <span key={idx} style={{ fontSize: '0.66rem', background: '#f8fafc', color: '#475569', padding: '2px 6px', borderRadius: '6px' }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: BEVERAGE SCIENCE & TRENDS BLOG */}
      {activeSection === 'blog' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {BLOG_POSTS.map(post => (
            <div
              key={post.id}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '140px', background: '#1e293b', position: 'relative' }}>
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80'
                  }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', color: '#fbbf24', padding: '3px 8px', borderRadius: '8px', fontSize: '0.68rem', fontWeight: 800 }}>
                  {post.category}
                </div>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                  <span>{post.author} • {post.date}</span>
                  <span>{post.views}</span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
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

      {/* 5. Article Reader Modal */}
      {selectedArticle && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setSelectedArticle(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                  {selectedArticle.categoryName} • {selectedArticle.readTime}
                </span>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0' }}>
                  {selectedArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                style={{ background: '#e2e8f0', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto', fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
              <div style={{ whiteSpace: 'pre-line' }}>
                {selectedArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
