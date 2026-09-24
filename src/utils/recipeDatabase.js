// Persistent Local & Cloud-Ready Recipe Database Engine
import { MASTER_RECIPE_REPOSITORY } from '../data/recipeRepository'

const STORAGE_KEY = 'pourcraft_recipe_database_v1'
const FAVORITES_KEY = 'pourcraft_recipe_favorites_v1'

export const RecipeDatabase = {
  // Initialize and get all recipes (Built-in Repository + User Custom Recipes)
  getAllRecipes: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const userCustom = stored ? JSON.parse(stored) : []
      
      // Combine master repository with user custom recipes
      const combined = [...MASTER_RECIPE_REPOSITORY]
      
      // Merge user recipes (avoiding duplicate IDs)
      userCustom.forEach(userRecipe => {
        const existingIdx = combined.findIndex(r => r.id === userRecipe.id)
        if (existingIdx >= 0) {
          combined[existingIdx] = userRecipe
        } else {
          combined.unshift(userRecipe)
        }
      })
      
      return combined
    } catch (e) {
      console.warn('Could not read from localStorage, using memory default', e)
      return MASTER_RECIPE_REPOSITORY
    }
  },

  // Save or update a recipe in database
  saveRecipe: (recipe) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const userCustom = stored ? JSON.parse(stored) : []
      
      const recipeToSave = {
        ...recipe,
        id: recipe.id || `custom-${Date.now()}`,
        updatedAt: new Date().toISOString(),
        isCustom: true
      }

      const existingIndex = userCustom.findIndex(r => r.id === recipeToSave.id)
      if (existingIndex >= 0) {
        userCustom[existingIndex] = recipeToSave
      } else {
        userCustom.unshift(recipeToSave)
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(userCustom))
      return recipeToSave
    } catch (e) {
      console.error('Error saving recipe to database:', e)
      return recipe
    }
  },

  // Delete a recipe from user database
  deleteRecipe: (recipeId) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return
      const userCustom = JSON.parse(stored)
      const filtered = userCustom.filter(r => r.id !== recipeId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch (e) {
      console.error('Error deleting recipe:', e)
    }
  },

  // Favorites tracking
  getFavorites: () => {
    try {
      const favs = localStorage.getItem(FAVORITES_KEY)
      return favs ? JSON.parse(favs) : ['repo-caramel-macchiato', 'repo-brown-sugar-shaken']
    } catch {
      return ['repo-caramel-macchiato']
    }
  },

  toggleFavorite: (recipeId) => {
    try {
      const favs = RecipeDatabase.getFavorites()
      let updated
      if (favs.includes(recipeId)) {
        updated = favs.filter(id => id !== recipeId)
      } else {
        updated = [...favs, recipeId]
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
      return updated
    } catch (e) {
      console.error('Error toggling favorite:', e)
      return []
    }
  },

  // Export full recipe database JSON
  exportDatabaseJSON: () => {
    const all = RecipeDatabase.getAllRecipes()
    const jsonStr = JSON.stringify(all, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pourcraft-recipe-database-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
}
