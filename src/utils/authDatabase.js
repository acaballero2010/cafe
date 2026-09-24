/**
 * Persistent User Administration & Authentication Engine
 * Stores registered users, cafe organizations, and roles with localStorage persistence.
 */

const STORAGE_KEY_USERS = 'pourcraft_registered_users'
const STORAGE_KEY_AUTH = 'pourcraft_current_session'

export const INITIAL_USERS = [
  {
    id: 'usr-admin-1',
    name: 'Admin Sarah Jenkins',
    email: 'admin@pourcraft.io',
    role: 'platform_admin', // 'platform_admin' | 'cafe_owner' | 'head_barista'
    shopName: 'PourCraft Platform HQ',
    branch: 'Global Operations / PH Hub',
    region: 'Metro Manila',
    tier: 'Platform SuperAdmin',
    status: 'active',
    activeRecipesCount: 142,
    lastActive: 'Just now',
    avatar: '👑'
  },
  {
    id: 'usr-owner-1',
    name: 'Chef Marco Dela Cruz',
    email: 'marco@kapecraft.ph',
    role: 'cafe_owner',
    shopName: 'Kape Craft Studio & Bar',
    branch: 'BGC High Street, Taguig',
    region: 'Metro Manila',
    tier: 'Enterprise R&D',
    status: 'active',
    activeRecipesCount: 24,
    lastActive: '5m ago',
    avatar: '👨‍🍳'
  },
  {
    id: 'usr-owner-2',
    name: 'Elena Ramos',
    email: 'elena@matchabloom.ph',
    role: 'cafe_owner',
    shopName: 'Matcha Bloom Botanicals',
    branch: 'Cebu IT Park, Cebu City',
    region: 'Cebu',
    tier: 'Pro Commercial',
    status: 'active',
    activeRecipesCount: 18,
    lastActive: '2h ago',
    avatar: '🍵'
  },
  {
    id: 'usr-barista-1',
    name: 'Kyle Santos',
    email: 'kyle.s@kapecraft.ph',
    role: 'head_barista',
    shopName: 'Kape Craft Studio & Bar',
    branch: 'BGC High Street, Taguig',
    region: 'Metro Manila',
    tier: 'Station Access',
    status: 'active',
    activeRecipesCount: 8,
    lastActive: 'Yesterday',
    avatar: '☕'
  },
  {
    id: 'usr-owner-3',
    name: 'Anton Lim',
    email: 'anton@davaobrew.com',
    role: 'cafe_owner',
    shopName: 'Mount Apo Specialty Roasters',
    branch: 'Lanang, Davao City',
    region: 'Davao',
    tier: 'Pro Commercial',
    status: 'active',
    activeRecipesCount: 15,
    lastActive: '3d ago',
    avatar: '🏔️'
  }
]

export class AuthDatabase {
  static getUsers() {
    if (typeof window === 'undefined') return INITIAL_USERS
    try {
      const data = localStorage.getItem(STORAGE_KEY_USERS)
      if (!data) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_USERS))
        return INITIAL_USERS
      }
      return JSON.parse(data)
    } catch {
      return INITIAL_USERS
    }
  }

  static saveUsers(users) {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users))
    } catch (e) {
      console.error('Failed to save users database', e)
    }
  }

  static getCurrentUser() {
    if (typeof window === 'undefined') return INITIAL_USERS[1] // Default to Cafe Owner
    try {
      const data = localStorage.getItem(STORAGE_KEY_AUTH)
      if (!data) {
        // Default login as Cafe Owner
        const defaultUser = INITIAL_USERS[1]
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(defaultUser))
        return defaultUser
      }
      return JSON.parse(data)
    } catch {
      return INITIAL_USERS[1]
    }
  }

  static setCurrentUser(user) {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user))
    } catch (e) {
      console.error('Failed to set current user', e)
    }
  }

  static addUser(userData) {
    const users = this.getUsers()
    const newUser = {
      id: `usr-${Date.now()}`,
      status: 'active',
      activeRecipesCount: 0,
      lastActive: 'Just registered',
      avatar: userData.role === 'platform_admin' ? '👑' : userData.role === 'cafe_owner' ? '🏬' : '☕',
      ...userData
    }
    const updated = [newUser, ...users]
    this.saveUsers(updated)
    return newUser
  }

  static updateUser(id, partial) {
    const users = this.getUsers()
    const updated = users.map(u => u.id === id ? { ...u, ...partial } : u)
    this.saveUsers(updated)
    return updated
  }

  static deleteUser(id) {
    const users = this.getUsers()
    const updated = users.filter(u => u.id !== id)
    this.saveUsers(updated)
    return updated
  }
}
