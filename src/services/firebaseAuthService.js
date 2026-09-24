import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth, db } from '../firebase'
import { AuthDatabase } from '../utils/authDatabase'

// Google Auth Provider configured with select_account prompt
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export function formatAuthError(error) {
  if (!error) return 'An unexpected authentication error occurred.'
  const code = error.code || ''
  const msg = error.message || ''

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please verify your credentials.'
    case 'auth/user-not-found':
      return 'No registered account found with this email address.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address format.'
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing.'
    case 'auth/cancelled-popup-request':
      return 'Sign-in operation cancelled.'
    case 'auth/popup-blocked':
      return 'Google sign-in popup was blocked by your browser. Please allow popups.'
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.'
    case 'auth/too-many-requests':
      return 'Access temporarily disabled due to multiple failed login attempts. Please try again later.'
    default:
      return msg.replace('Firebase: ', '') || 'Authentication failed.'
  }
}

export function mapFirebaseUserToAppUser(fbUser, extraData = {}) {
  if (!fbUser) return null

  // Check if user already exists in AuthDatabase to preserve roles / profile details
  const users = AuthDatabase.getUsers()
  const existing = users.find(u => u.email?.toLowerCase() === fbUser.email?.toLowerCase())

  const role = existing?.role || (fbUser.email === 'admin@pourcraft.io' ? 'admin' : 'user')
  const title = extraData.title || existing?.title || 'Beverage Recipe Creator'
  const affiliation = extraData.affiliation || existing?.affiliation || 'Independent Creator & Consultant'
  const region = extraData.region || existing?.region || 'Metro Manila'

  const appUser = {
    id: fbUser.uid || `usr-${Date.now()}`,
    uid: fbUser.uid,
    name: fbUser.displayName || extraData.name || fbUser.email.split('@')[0],
    email: fbUser.email,
    photoURL: fbUser.photoURL || null,
    role, // 'admin' | 'user'
    title,
    affiliation,
    region,
    status: 'active',
    activeRecipesCount: existing?.activeRecipesCount || 12,
    lastActive: 'Just now',
    avatar: fbUser.photoURL || (role === 'admin' ? '👑' : '👨‍🍳')
  }

  // Update or insert into local auth database
  if (existing) {
    AuthDatabase.updateUser(existing.id, appUser)
  } else {
    AuthDatabase.addUser(appUser)
  }
  AuthDatabase.setCurrentUser(appUser)

  return appUser
}

export async function loginWithEmailPassword(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password)
    const appUser = mapFirebaseUserToAppUser(userCredential.user)
    return { success: true, user: appUser }
  } catch (error) {
    console.error('Firebase Email Sign In Error:', error)
    return { success: false, error: formatAuthError(error), raw: error }
  }
}

export async function registerWithEmailPassword(email, password, { name, shopName, region, role = 'cafe_owner' } = {}) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password)
    const fbUser = userCredential.user

    // Update Firebase display name
    if (name) {
      await updateProfile(fbUser, { displayName: name.trim() })
    }

    const appUser = mapFirebaseUserToAppUser(fbUser, { name, shopName, region, role })
    return { success: true, user: appUser }
  } catch (error) {
    console.error('Firebase Registration Error:', error)
    return { success: false, error: formatAuthError(error), raw: error }
  }
}

export async function loginWithGoogle() {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider)
    const appUser = mapFirebaseUserToAppUser(userCredential.user)
    return { success: true, user: appUser }
  } catch (error) {
    console.error('Firebase Google Sign In Error:', error)
    return { success: false, error: formatAuthError(error), raw: error }
  }
}

export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email.trim())
    return { success: true, message: `Password reset email sent to ${email.trim()}` }
  } catch (error) {
    return { success: false, error: formatAuthError(error) }
  }
}

export async function logoutFirebase() {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error('Firebase Sign Out Error:', error)
    return { success: false, error: formatAuthError(error) }
  }
}

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, (fbUser) => {
    if (fbUser) {
      const appUser = mapFirebaseUserToAppUser(fbUser)
      callback(appUser)
    } else {
      callback(null)
    }
  })
}
