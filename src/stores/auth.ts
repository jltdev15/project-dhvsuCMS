import { defineStore } from 'pinia'
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  type User
} from 'firebase/auth'
import { app } from '../firebase'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const auth = getAuth(app)
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // Set persistence to LOCAL (persists even after browser restart)
  setPersistence(auth, browserLocalPersistence)

  // Initialize auth state listener
  onAuthStateChanged(auth, (newUser) => {
    user.value = newUser
    initialized.value = true
    if (newUser) {
      console.log('Current User Information:', {
        uid: newUser.uid,
        email: newUser.email,
        emailVerified: newUser.emailVerified,
        displayName: newUser.displayName,
        photoURL: newUser.photoURL,
        phoneNumber: newUser.phoneNumber,
        metadata: {
          creationTime: newUser.metadata.creationTime,
          lastSignInTime: newUser.metadata.lastSignInTime
        }
      })
    } else {
      console.log('No user is currently signed in')
    }
  })

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        error.value = 'Account not found'
      } else if (err.code === 'auth/wrong-password') {
        error.value = 'Incorrect password'
      } else {
        error.value = err.message || 'Failed to sign in'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      loading.value = true
      error.value = null
      await firebaseSignOut(auth)
    } catch (err: any) {
      error.value = err.message || 'Failed to sign out'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user.value
  }

  // Check if auth is initialized
  const isInitialized = () => {
    return initialized.value
  }

  // Get current user information
  const getCurrentUser = () => {
    if (!user.value) return null
    return {
      uid: user.value.uid,
      email: user.value.email,
      emailVerified: user.value.emailVerified,
      displayName: user.value.displayName,
      photoURL: user.value.photoURL,
      phoneNumber: user.value.phoneNumber,
      metadata: {
        creationTime: user.value.metadata.creationTime,
        lastSignInTime: user.value.metadata.lastSignInTime
      }
    }
  }

  return {
    user,
    loading,
    error,
    initialized,
    signIn,
    signOut,
    isAuthenticated,
    isInitialized,
    getCurrentUser
  }
}) 