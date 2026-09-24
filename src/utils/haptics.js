/**
 * Native Web Vibration / Haptic Feedback Engine
 * Provides subtle tactile feedback on mobile devices supporting the Vibration API.
 */

export const triggerHaptic = (type = 'light') => {
  if (typeof window === 'undefined' || !navigator.vibrate) return

  try {
    switch (type) {
      case 'selection':
      case 'tap':
        navigator.vibrate(8) // ultra crisp 8ms tap
        break
      case 'light':
        navigator.vibrate(15)
        break
      case 'medium':
        navigator.vibrate(25)
        break
      case 'heavy':
        navigator.vibrate(40)
        break
      case 'success':
        navigator.vibrate([15, 40, 25]) // pleasant double pulse
        break
      case 'warning':
        navigator.vibrate([30, 60, 30])
        break
      case 'error':
        navigator.vibrate([50, 40, 50, 40, 50])
        break
      default:
        navigator.vibrate(12)
    }
  } catch {
    // Fail silently on browsers without vibration permissions
  }
}
