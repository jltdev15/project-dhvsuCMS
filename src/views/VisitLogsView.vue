<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Visit Logs</h1>
        <p class="text-gray-600 mt-1">View and manage clinic visit records</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2">
          <span class="material-icons text-[#800000]">event_note</span>
          <div>
            <div class="text-sm text-gray-500">Total Visits</div>
            <div class="font-bold text-lg">{{ visits.length }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Visits Table Card -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="bg-[#800000] px-6 py-4">
        <h2 class="text-xl text-white font-semibold flex items-center gap-2">
          <span class="material-icons">event_note</span>
          Visit Records
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
                type="text" placeholder="Search visits..." />
            </div>
          </div>

          <div v-if="displayMonthName" class="flex items-center gap-2 text-sm bg-[#800000]/10 text-[#800000] px-3 py-2 rounded-lg">
            <span class="material-icons text-base">filter_alt</span>
            <span>Filtered by: <span class="font-semibold">{{ displayMonthName }}</span></span>
            <button @click="clearMonthFilter" class="ml-1 text-[#800000] hover:text-[#5a0000]" aria-label="Clear month filter">
              <span class="material-icons text-base">close</span>
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto rounded-lg border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicines</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredVisits.length === 0">
                <td colspan="6" class="px-3 py-12 text-center text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <span class="material-icons text-5xl mb-3 text-gray-300">event_note</span>
                    <p class="text-lg font-medium">No visits found</p>
                    <p class="text-sm">Visit records will appear here when logged</p>
                  </div>
                </td>
              </tr>
              <tr v-else v-for="(visit, index) in filteredVisits" :key="visit.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ index + 1 }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ visit.patientName }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm text-gray-700">{{ formatDate(visit.timestamp) }}</div>
                </td>
                <td class="px-4 py-3">
                  <div class="text-sm text-gray-700 max-w-xs truncate">{{ visit.reason }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="visit.dispenseId ? 'bg-[#FFB81C]/20 text-[#800000]' : 'bg-green-100 text-green-800'">
                    {{ visit.dispenseId ? 'Medicine Dispensed' : 'Manual Log' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div v-if="visit.medicinesDispensed" class="text-sm text-gray-700 max-w-xs truncate">
                    {{ visit.medicinesDispensed }}
                  </div>
                  <div v-else class="text-sm text-gray-400">No Medicines Dispensed</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredVisits.length > 0" class="flex justify-between items-center mt-4 text-gray-500 text-sm">
          <div>
            Showing <span class="font-medium">{{ filteredVisits.length }}</span> visits
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'
import { app } from '../firebase'
import { useRoute, useRouter } from 'vue-router'

const db = getDatabase(app)
const visits = ref<any[]>([])
const searchQuery = ref('')
const route = useRoute()
const router = useRouter()
const monthQuery = ref<string | null>(null)

const monthAbbrevs = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const fullMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

const getMonthIndexFromQuery = (q: string | null): number | null => {
  if (!q) return null
  const lower = q.toLowerCase()
  const idx = monthAbbrevs.indexOf(lower)
  return idx >= 0 ? idx : null
}

// Format date to display in table (Philippines timezone)
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  
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

const displayMonthName = computed(() => {
  const idx = getMonthIndexFromQuery(monthQuery.value)
  return idx === null ? '' : fullMonthNames[idx]
})

const clearMonthFilter = () => {
  monthQuery.value = null
  router.push({ name: route.name as string, query: { ...route.query, month: undefined } })
}

// Filter visits based on month query and search query
const filteredVisits = computed(() => {
  const monthIdx = getMonthIndexFromQuery(monthQuery.value)
  const byMonth = monthIdx === null
    ? visits.value
    : visits.value.filter((visit) => {
        if (!visit.timestamp) return false
        const d = new Date(visit.timestamp)
        if (isNaN(d.getTime())) return false
        return d.getMonth() === monthIdx
      })

  if (!searchQuery.value) return byMonth

  const query = searchQuery.value.toLowerCase()
  return byMonth.filter(visit => 
    (visit.patientName && visit.patientName.toLowerCase().includes(query)) ||
    (visit.reason && visit.reason.toLowerCase().includes(query)) ||
    (visit.medicinesDispensed && visit.medicinesDispensed.toLowerCase().includes(query))
  )
})

// Fetch visits from Firebase
const fetchVisits = () => {
  const visitsRef = dbRef(db, 'clinic-visits')
  onValue(visitsRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      visits.value = Object.entries(data)
        .map(([id, visit]: [string, any]) => ({ id, ...visit }))
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    } else {
      visits.value = []
    }
  })
}

onMounted(() => {
  fetchVisits()
  monthQuery.value = (route.query.month as string) || null
})

watch(() => route.query.month, (newVal) => {
  monthQuery.value = (newVal as string) || null
})
</script>
