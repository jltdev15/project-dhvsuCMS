<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Reports Management</h1>
        <p class="text-gray-600 mt-1">Generate and view various reports</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2">
          <span class="material-icons text-[#800000]">assessment</span>
          <div>
            <div class="text-sm text-gray-500">Available Reports</div>
            <div class="font-bold text-lg">2</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reports Cards -->
    <div class="grid grid-cols-1 gap-6">
      <!-- Patient Visits Report Card -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-[#800000] px-6 py-4">
          <h2 class="text-xl text-white font-semibold flex items-center gap-2">
            <span class="material-icons">event_note</span>
            Patient Visits Report
          </h2>
        </div>
        <div class="p-6">
          <form @submit.prevent="generateVisitsReport" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">Start Date <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">calendar_today</span>
                  </div>
                  <input v-model="visitsReport.startDate"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all"
                    type="date" 
                    required 
                    :disabled="visitsLoading"
                    :max="visitsReport.endDate || undefined" />
                </div>
              </div>

              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">End Date <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">calendar_today</span>
                  </div>
                  <input v-model="visitsReport.endDate"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all"
                    type="date" 
                    required 
                    :disabled="visitsLoading"
                    :min="visitsReport.startDate || undefined" />
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="visitsError" class="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <div class="flex items-center gap-2">
                <span class="material-icons text-red-500">error</span>
                <span>{{ visitsError }}</span>
              </div>
            </div>

            <!-- Success Message -->
            <div v-if="visitsSuccess" class="p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
              <div class="flex items-center gap-2">
                <span class="material-icons text-green-500">check_circle</span>
                <span>{{ visitsSuccess }}</span>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t">
              <button type="submit"
                class="bg-[#800000] hover:bg-[#600000] text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                :disabled="visitsLoading">
                <span class="material-icons text-base">{{ visitsLoading ? 'hourglass_top' : 'picture_as_pdf' }}</span>
                {{ visitsLoading ? 'Generating...' : 'Generate PDF Report' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Disease Report Card -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-[#800000] px-6 py-4">
          <h2 class="text-xl text-white font-semibold flex items-center gap-2">
            <span class="material-icons">coronavirus</span>
            Disease Based Report
          </h2>
        </div>
        <div class="p-6">
          <form @submit.prevent="generateDiseaseReport" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">Disease/Condition <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">medical_services</span>
                  </div>
                  <select v-model="diseaseReport.disease"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all appearance-none"
                    required 
                    :disabled="diseaseLoading">
                    <option value="">Select disease/condition</option>
                    <option v-for="disease in diseases" :key="disease" :value="disease">
                      {{ disease }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span class="material-icons text-gray-500">expand_more</span>
                  </div>
                </div>
              </div>

              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">Start Date <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">calendar_today</span>
                  </div>
                  <input v-model="diseaseReport.startDate"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all"
                    type="date" 
                    required 
                    :disabled="diseaseLoading"
                    :max="diseaseReport.endDate || undefined" />
                </div>
              </div>

              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">End Date <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">calendar_today</span>
                  </div>
                  <input v-model="diseaseReport.endDate"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all"
                    type="date" 
                    required 
                    :disabled="diseaseLoading"
                    :min="diseaseReport.startDate || undefined" />
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="diseaseError" class="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <div class="flex items-center gap-2">
                <span class="material-icons text-red-500">error</span>
                <span>{{ diseaseError }}</span>
              </div>
            </div>

            <!-- Success Message -->
            <div v-if="diseaseSuccess" class="p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
              <div class="flex items-center gap-2">
                <span class="material-icons text-green-500">check_circle</span>
                <span>{{ diseaseSuccess }}</span>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t">
              <button type="submit"
                class="bg-[#800000] hover:bg-[#600000] text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                :disabled="diseaseLoading">
                <span class="material-icons text-base">{{ diseaseLoading ? 'hourglass_top' : 'picture_as_pdf' }}</span>
                {{ diseaseLoading ? 'Generating...' : 'Generate PDF Report' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getDatabase, ref as dbRef, query, orderByChild, startAt, endAt, get } from 'firebase/database'
import { app } from '../firebase'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const db = getDatabase(app)

// Patient Visits Report State
const visitsReport = ref({
  startDate: '',
  endDate: ''
})
const visitsLoading = ref(false)
const visitsError = ref('')
const visitsSuccess = ref('')

// Disease Report State
const diseaseReport = ref({
  disease: '',
  startDate: '',
  endDate: ''
})
const diseaseLoading = ref(false)
const diseaseError = ref('')
const diseaseSuccess = ref('')

// Sample diseases list - you should fetch this from your database
const diseases = [
  'Common Cold',
  'Flu',
  'Fever',
  'Headache',
  'Stomach Ache',
  'Dental Issues',
  'Eye Problems',
  'Skin Conditions',
  'Respiratory Issues',
  'Other'
]

// Validate dates
const validateDates = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) {
    return 'Please select both start and end dates'
  }

  const start = new Date(startDate)
  const end = new Date(endDate)
  const today = new Date()

  if (start > end) {
    return 'Start date cannot be after end date'
  }

  if (end > today) {
    return 'End date cannot be in the future'
  }

  return ''
}

// Generate Patient Visits Report
const generateVisitsReport = async () => {
  try {
    // Validate dates
    const dateError = validateDates(visitsReport.value.startDate, visitsReport.value.endDate)
    if (dateError) {
      visitsError.value = dateError
      return
    }

    visitsLoading.value = true
    visitsError.value = ''
    visitsSuccess.value = ''

    const currentUser = authStore.getCurrentUser()
    if (!currentUser) {
      visitsError.value = 'You must be logged in to generate reports'
      return
    }

    // TODO: Implement actual report generation logic here
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    visitsSuccess.value = 'Report generated successfully!'
    
    // Reset form after success
    setTimeout(() => {
      visitsReport.value = {
        startDate: '',
        endDate: ''
      }
      visitsSuccess.value = ''
    }, 2000)

  } catch (err: any) {
    visitsError.value = err.message || 'Failed to generate report'
  } finally {
    visitsLoading.value = false
  }
}

// Generate Disease Report
const generateDiseaseReport = async () => {
  try {
    // Validate dates
    const dateError = validateDates(diseaseReport.value.startDate, diseaseReport.value.endDate)
    if (dateError) {
      diseaseError.value = dateError
      return
    }

    if (!diseaseReport.value.disease) {
      diseaseError.value = 'Please select a disease/condition'
      return
    }

    diseaseLoading.value = true
    diseaseError.value = ''
    diseaseSuccess.value = ''

    const currentUser = authStore.getCurrentUser()
    if (!currentUser) {
      diseaseError.value = 'You must be logged in to generate reports'
      return
    }

    // TODO: Implement actual report generation logic here
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    diseaseSuccess.value = 'Report generated successfully!'
    
    // Reset form after success
    setTimeout(() => {
      diseaseReport.value = {
        disease: '',
        startDate: '',
        endDate: ''
      }
      diseaseSuccess.value = ''
    }, 2000)

  } catch (err: any) {
    diseaseError.value = err.message || 'Failed to generate report'
  } finally {
    diseaseLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style> 