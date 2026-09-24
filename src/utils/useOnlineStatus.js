import { useState, useEffect } from 'react'

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' 
      ? navigator.onLine 
      : true
  })
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Capture PWA install prompt for custom install CTA
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredInstallPrompt(e)
    }

    // Detect if already installed / standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
    setIsInstalled(isStandalone)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const promptInstall = async () => {
    if (!deferredInstallPrompt) return false
    deferredInstallPrompt.prompt()
    const { outcome } = await deferredInstallPrompt.userChoice
    setDeferredInstallPrompt(null)
    return outcome === 'accepted'
  }

  return {
    isOnline,
    canInstall: !!deferredInstallPrompt && !isInstalled,
    isInstalled,
    promptInstall
  }
}
