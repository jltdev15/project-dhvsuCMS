<template>
  <div v-if="!isAuthenticated" class="min-h-screen bg-gray-700 flex items-center justify-center">
    <div class="flex flex-col items-center">
      <img src="/logo/logo.png" alt="University Logo" class="w-44 mb-5" />
      <h1 class="text-white text-3xl font-normal mb-8 text-center">
        <span class="text-blue-500 font-bold">DHVSU</span> Clinic Management System
      </h1>
      <div class="bg-gray-800 px-9 py-8 rounded-lg shadow-lg min-w-[350px] flex flex-col items-stretch">
        <p class="text-gray-300 text-base mb-5 text-center">Please enter your login credentials</p>
        <div class="flex items-center bg-gray-900 rounded mb-4 px-3 border border-gray-900 focus-within:border-blue-500 transition">
          <span class="text-gray-400 text-lg mr-2">
            <i class="fas fa-user"></i>
          </span>
          <input 
            v-model="email"
            type="email" 
            placeholder="Email" 
            class="bg-transparent border-none outline-none text-white text-base py-3 flex-1" 
          />
        </div>
        <div class="flex items-center bg-gray-900 rounded mb-4 px-3 border border-gray-900 focus-within:border-blue-500 transition">
          <span class="text-gray-400 text-lg mr-2">
            <i class="fas fa-lock"></i>
          </span>
          <input 
            v-model="password"
            type="password" 
            placeholder="••••••" 
            class="bg-transparent border-none outline-none text-white text-base py-3 flex-1" 
          />
        </div>
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>
        <button 
          @click="handleSignIn"
          :disabled="loading"
          class="bg-blue-500 hover:bg-blue-700 text-white rounded py-3 text-lg font-semibold mt-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
        <p class="text-gray-400 text-sm mt-4 text-center">
          Don't have an account? 
          <router-link to="/register" class="text-blue-500 hover:text-blue-400">Create one</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const isAuthenticated = ref(false)

onMounted(() => {
  isAuthenticated.value = authStore.isAuthenticated()
  if (isAuthenticated.value) {
    router.replace('/')
  }
})

const handleSignIn = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  try {
    loading.value = true
    error.value = ''
    const emailToUse = email.value.includes('@') ? email.value : `${email.value}@gmail.com`
    await authStore.signIn(emailToUse, password.value)
    router.replace('/')
  } catch (err: any) {
    error.value = err.message || 'Failed to sign in'
  } finally {
    loading.value = false
  }
}
</script>
