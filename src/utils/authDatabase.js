/**
 * Persistent User Administration & Authentication Engine
 * Strict 2-Role System: 'admin' (Platform SuperAdmin) and 'user' (Beverage Creator / Barista / Consultant)
 */

const STORAGE_KEY_USERS = 'pourcraft_registered_users'
const STORAGE_KEY_AUTH = 'pourcraft_current_session'

export const INITIAL_USERS = [
  {
    id: 'usr-admin-1',
    name: 'Sarah Jenkins',
    email: 'admin@pourcraft.io',
    role: 'admin', // 'admin' | 'user'
    title: 'Platform SuperAdmin & Catalog Curator',
    affiliation: 'PourCraft Master Lab',
    region: 'Metro Manila',
    status: 'active',
    activeRecipesCount: 142,
    lastActive: 'Just now',
    avatar: '👑'
  },
  {
    id: 'usr-user-1',
    name: 'Marco Dela Cruz',
    email: 'marco@kapecraft.ph',
    role: 'user',
    title: 'Beverage R&D Consultant & Q-Grader',
    affiliation: 'Independent R&D Consultant',
    region: 'Metro Manila',
    status: 'active',
    activeRecipesCount: 24,
    lastActive: '5m ago',
    avatar: '👨‍🍳'
  },
  {
    id: 'usr-user-2',
    name: 'Elena Ramos',
    email: 'elena@matchabloom.ph',
    role: 'user',
    title: 'Matcha & Tea Formulation Specialist',
    affiliation: 'Matcha Bloom Creative Lab',
    region: 'Cebu',
    status: 'active',
    activeRecipesCount: 18,
    lastActive: '2h ago',
    avatar: '🍵'
  },
  {
    id: 'usr-user-3',
    name: 'Kyle Santos',
    email: 'kyle.s@kapecraft.ph',
    role: 'user',
    title: 'Head Barista & Recipe Engineer',
    affiliation: 'Craft Beverage Studio',
    region: 'Metro Manila',
    status: 'active',
    activeRecipesCount: 8,
    lastActive: 'Yesterday',
    avatar: '☕'
  },
  {
    id: 'usr-user-4',
    name: 'Anton Lim',
    email: 'anton@davaobrew.com',
    role: 'user',
    title: 'Specialty Coffee Trainer & Consultant',
    affiliation: 'Mindanao Coffee Guild',
    region: 'Davao',
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
    if (typeof window === 'undefined') return INITIAL_USERS[1] // Default to Creator User
    try {
      const data = localStorage.getItem(STORAGE_KEY_AUTH)
      if (!data) {
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
    const role = userData.role === 'admin' ? 'admin' : 'user'
    const newUser = {
      id: `usr-${Date.now()}`,
      status: 'active',
      role,
      activeRecipesCount: 0,
      lastActive: 'Just registered',
      avatar: role === 'admin' ? '👑' : '👨‍🍳',
      title: userData.title || 'Beverage Recipe Creator',
      affiliation: userData.affiliation || 'Independent Creator',
      region: userData.region || 'Metro Manila',
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
