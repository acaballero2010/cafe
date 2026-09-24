import React, { useState } from 'react'
import { Star, MessageSquare, Send, ThumbsUp, Flame, Sparkles, Check, User } from 'lucide-react'

export function CommunityReviewsSection({
  recipe,
  onOpenTrendingHub = () => {},
  onFeatureRecipe = () => {}
}) {
  const [userRating, setUserRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [reviewerName, setReviewerName] = useState('Chef Marco D.')
  const [localComments, setLocalComments] = useState([
    {
      id: 'lc-1',
      userName: 'Bea Alcantara',
      userRole: 'Specialty Beverage Consultant',
      rating: 5,
      timestamp: 'Yesterday',
      commentText: 'Calibrated perfectly for 16oz cold cup with 35% ice displacement. Shaking for a solid 10 seconds is essential for the velvety microfoam head.',
      helpfulCount: 14
    },
    {
      id: 'lc-2',
      userName: 'Alvin Reyes',
      userRole: 'Head Barista @ Kohi Craft',
      rating: 5,
      timestamp: '3 days ago',
      commentText: 'Tested with both Torani and Monin brown sugar. Torani Puremade delivers the richest caramelized notes with espresso.',
      helpfulCount: 8
    }
  ])
  const [postSuccess, setPostSuccess] = useState('')

  const handlePostReview = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const newComment = {
      id: `lc-${Date.now()}`,
      userName: reviewerName || 'Verified Barista',
      userRole: 'Owner @ Kape Craft Studio',
      rating: userRating,
      timestamp: 'Just now',
      commentText: commentText.trim(),
      helpfulCount: 0
    }

    setLocalComments([newComment, ...localComments])
    setCommentText('')
    setPostSuccess('✓ Review posted to community feed!')
    setTimeout(() => setPostSuccess(''), 2500)
  }

  const handleHelpful = (id) => {
    setLocalComments(prev => prev.map(c => c.id === id ? { ...c, helpfulCount: c.helpfulCount + 1 } : c))
  }

  const avgRating = (localComments.reduce((sum, c) => sum + c.rating, 0) / (localComments.length || 1)).toFixed(1)

  return (
    <div style={{ background: '#ffffff', borderRadius: '20px', padding: '18px 20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={16} fill="#d97706" />
          </div>
          <div>
            <h2 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
              Community Ratings & Barista Reviews
            </h2>
            <span style={{ fontSize: '0.70rem', color: '#64748b' }}>
              {localComments.length} verified barista reviews • {avgRating} ★ average
            </span>
          </div>
        </div>

        <button
          onClick={onOpenTrendingHub}
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#d97706',
            padding: '5px 10px',
            borderRadius: '8px',
            fontSize: '0.72rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Flame size={12} color="#ea580c" />
          <span>Trending Hub</span>
        </button>
      </div>

      {/* Write a Review Box */}
      <form
        onSubmit={handlePostReview}
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155' }}>
            Rate this formula:
          </span>

          {/* 5-Star Input */}
          <div style={{ display: 'flex', gap: '3px', cursor: 'pointer' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={17}
                fill={(hoverRating || userRating) >= star ? '#f59e0b' : 'none'}
                color={(hoverRating || userRating) >= star ? '#f59e0b' : '#cbd5e1'}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setUserRating(star)}
                style={{ transition: 'all 0.1s ease' }}
              />
            ))}
          </div>
        </div>

        <textarea
          rows={2}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={`Leave tasting notes, barista tips, or supplier recommendations for ${recipe?.name || 'this drink'}...`}
          required
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.78rem',
            resize: 'none',
            boxSizing: 'border-box',
            background: '#ffffff'
          }}
        />

        {postSuccess && (
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
            {postSuccess}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
            Posting as <strong>{reviewerName}</strong>
          </span>
          <button
            type="submit"
            style={{
              background: '#0f172a',
              border: 'none',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Send size={11} />
            <span>Submit Review</span>
          </button>
        </div>
      </form>

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {localComments.map(comm => (
          <div
            key={comm.id}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>
                  {comm.userName}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#64748b', marginLeft: '6px' }}>
                  • {comm.userRole}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    size={11}
                    fill={comm.rating >= s ? '#f59e0b' : 'none'}
                    color={comm.rating >= s ? '#f59e0b' : '#cbd5e1'}
                  />
                ))}
              </div>
            </div>

            <p style={{ fontSize: '0.76rem', color: '#334155', margin: 0, lineHeight: 1.45 }}>
              "{comm.commentText}"
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.66rem', color: '#94a3b8', paddingTop: '2px' }}>
              <span>{comm.timestamp}</span>
              <button
                onClick={() => handleHelpful(comm.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 4px'
                }}
              >
                <ThumbsUp size={11} />
                <span>Helpful ({comm.helpfulCount || 0})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
