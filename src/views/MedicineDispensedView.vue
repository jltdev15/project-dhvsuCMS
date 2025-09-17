<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Medicine Dispensed</h1>
        <p class="text-gray-600 mt-1">View and manage medicine dispensing records</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2">
          <span class="material-icons text-[#800000]">medication</span>
          <div>
            <div class="text-sm text-gray-500">Total Dispenses</div>
            <div class="font-bold text-lg">{{ dispenses.length }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dispenses Table Card -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="bg-[#800000] px-6 py-4">
        <h2 class="text-xl text-white font-semibold flex items-center gap-2">
          <span class="material-icons">medication</span>
          Dispense Records
        </h2>
      </div>
      <div class="p-6">
        <!-- Table Actions -->
        <div class="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div class="flex items-center gap-2 text-sm">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span class="material-icons text-gray-500 text-sm">search</span>
              </div>
              <input
                v-model="searchQuery"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none"
                type="text" placeholder="Search dispenses..." />
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto rounded-lg border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispense ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispensed Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicines</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredDispenses.length === 0">
                <td colspan="6" class="px-3 py-12 text-center text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <span class="material-icons text-5xl mb-3 text-gray-300">medication</span>
                    <p class="text-lg font-medium">No dispenses found</p>
                    <p class="text-sm">Dispense records will appear here when medicines are dispensed</p>
                  </div>
                </td>
              </tr>
              <tr v-else v-for="(dispense, index) in filteredDispenses" :key="dispense.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ index + 1 }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm font-medium text-[#800000]">{{ dispense.id }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ dispense.patientName }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm text-gray-700">{{ formatDate(dispense.dispensedAt) }}</div>
                </td>
                <td class="px-4 py-3">
                  <div class="space-y-1">
                    <div v-for="medicine in dispense.medicines" :key="medicine.medicineId" 
                      class="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                      {{ medicine.quantity }}x {{ medicine.medicineName }}
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="text-sm text-gray-700 max-w-xs truncate">{{ dispense.reason || '-' }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredDispenses.length > 0" class="flex justify-between items-center mt-4 text-gray-500 text-sm">
          <div>
            Showing <span class="font-medium">{{ filteredDispenses.length }}</span> dispenses
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'
import { app } from '../firebase'

const db = getDatabase(app)
const dispenses = ref<any[]>([])
const searchQuery = ref('')

// Format date to display in table (Philippines timezone)
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Manila'
  })
}

// Filter dispenses based on search query
const filteredDispenses = computed(() => {
  if (!searchQuery.value) return dispenses.value
  
  const query = searchQuery.value.toLowerCase()
  return dispenses.value.filter(dispense => 
    dispense.id.toLowerCase().includes(query) ||
    dispense.patientName.toLowerCase().includes(query) ||
    dispense.reason.toLowerCase().includes(query) ||
    dispense.medicines.some((medicine: any) => 
      medicine.medicineName.toLowerCase().includes(query)
    )
  )
})

// Fetch dispenses from Firebase
const fetchDispenses = () => {
  const dispensesRef = dbRef(db, 'dispenses')
  onValue(dispensesRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      dispenses.value = Object.entries(data)
        .map(([id, dispense]: [string, any]) => ({ id, ...dispense }))
        .sort((a: any, b: any) => new Date(b.dispensedAt).getTime() - new Date(a.dispensedAt).getTime())
    } else {
      dispenses.value = []
    }
  })
}

onMounted(() => {
  fetchDispenses()
})
</script>
