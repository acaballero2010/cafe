import React from 'react'
import { 
  Camera, 
  FileText, 
  Scale, 
  BookOpen, 
  Moon, 
  Sun, 
  Sparkles,
  Flame
} from 'lucide-react'

export function FloatingActionDock({
  onOpenStudio = () => {},
  onOpenSop = () => {},
  onOpenYield = () => {},
  onOpenRepo = () => {},
  onOpenTrending = () => {},
  isDarkMode = false,
  onToggleTheme = () => {}
}) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '76px', // floats right above the mobile bottom nav (56px)
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 45,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '5px 8px',
        borderRadius: '999px',
        background: isDarkMode ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: isDarkMode 
          ? '0 12px 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)' 
          : '0 8px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
        maxWidth: '92vw',
        animation: 'slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* 1. 8K Photo Studio */}
      <button
        onClick={onOpenStudio}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '6px 10px',
          borderRadius: '999px',
          border: 'none',
          background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
          color: '#ffffff',
          fontSize: '0.68rem',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)',
          whiteSpace: 'nowrap'
        }}
      >
        <Camera size={13} />
        <span>Studio</span>
      </button>

      {/* 2. Barista Station SOP */}
      <button
        onClick={onOpenSop}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 9px',
          borderRadius: '999px',
          border: isDarkMode ? '1px solid #1e293b' : '1px solid #e2e8f0',
          background: isDarkMode ? '#1e293b' : '#f8fafc',
          color: isDarkMode ? '#38bdf8' : '#0284c7',
          fontSize: '0.68rem',
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        <FileText size={12} />
        <span>SOP</span>
      </button>

      {/* 3. Kitchen Batch Yield */}
      <button
        onClick={onOpenYield}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 9px',
          borderRadius: '999px',
          border: isDarkMode ? '1px solid #1e293b' : '1px solid #e2e8f0',
          background: isDarkMode ? '#1e293b' : '#f8fafc',
          color: isDarkMode ? '#4ade80' : '#15803d',
          fontSize: '0.68rem',
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        <Scale size={12} />
        <span>Yield</span>
      </button>

      {/* 4. Recipe Repository */}
      <button
        onClick={onOpenRepo}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 9px',
          borderRadius: '999px',
          border: isDarkMode ? '1px solid #1e293b' : '1px solid #e2e8f0',
          background: isDarkMode ? '#1e293b' : '#f8fafc',
          color: isDarkMode ? '#fbbf24' : '#b45309',
          fontSize: '0.68rem',
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        <BookOpen size={12} />
        <span>Repo</span>
      </button>

      {/* Divider */}
      <span style={{ width: '1px', height: '16px', background: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }} />

      {/* 5. Dark / Light Theme Mode Toggle */}
      <button
        onClick={onToggleTheme}
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: 'none',
          background: isDarkMode ? '#334155' : '#f1f5f9',
          color: isDarkMode ? '#fde68a' : '#475569',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Barista Night Mode'}
      >
        {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </div>
  )
}
