import { useAuthStore } from '../stores/auth'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export const authMiddleware = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const auth = getAuth()
  
  onAuthStateChanged(auth, (user) => {
    // Public routes that don't require authentication
    const publicRoutes = ['/login']
    const isPublicRoute = publicRoutes.includes(to.path)

    // If trying to access a public route while authenticated
    if (isPublicRoute && user) {
      next({ name: 'dashboard' })
      return
    }

    // If trying to access a protected route while not authenticated
    if (!isPublicRoute && !user) {
      next({ name: 'login' })
      return
    }

    // Allow access in all other cases
    next()
  })
} 