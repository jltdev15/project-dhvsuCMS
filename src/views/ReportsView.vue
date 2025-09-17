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
    <div class="grid grid-cols-2 gap-6">
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



            <div class="flex justify-end gap-3 pt-4 border-t">
              <button type="submit"
                class="bg-[#800000] hover:bg-[#600000] text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                :disabled="visitsLoading">
                <span class="material-icons text-base">{{ visitsLoading ? 'hourglass_top' : 'print' }}</span>
                {{ visitsLoading ? 'Generating...' : 'Print Report' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Medicine Inventory Report Card -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-[#800000] px-6 py-4">
          <h2 class="text-xl text-white font-semibold flex items-center gap-2">
            <span class="material-icons">inventory_2</span>
            Medicine Inventory Report
          </h2>
        </div>
        <div class="p-6">
          <form @submit.prevent="generateMedicineInventoryReport" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">Start Date <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">calendar_today</span>
                  </div>
                  <input v-model="medicineInventoryReport.startDate"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all"
                    type="date" 
                    :disabled="medicineInventoryLoading"
                    :max="medicineInventoryReport.endDate || undefined" />
                </div>
              </div>

              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">End Date <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">calendar_today</span>
                  </div>
                  <input v-model="medicineInventoryReport.endDate"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all"
                    type="date" 
                    :disabled="medicineInventoryLoading"
                    :min="medicineInventoryReport.startDate || undefined" />
                </div>
              </div>
            </div>



            <div class="flex justify-end gap-3 pt-4 border-t">
              <button type="submit"
                class="bg-[#800000] hover:bg-[#600000] text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                :disabled="medicineInventoryLoading">
                <span class="material-icons text-base">{{ medicineInventoryLoading ? 'hourglass_top' : 'print' }}</span>
                {{ medicineInventoryLoading ? 'Generating...' : 'Print Inventory Report' }}
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

// Medicine Inventory Report State
const medicineInventoryReport = ref({
  startDate: '',
  endDate: ''
})
const medicineInventoryLoading = ref(false)
const medicineInventoryError = ref('')
const medicineInventorySuccess = ref('')

// Removed single-medicine filter; report is date-range based

// Utilities for date formatting
const formatDate = (d: Date) => {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const formatDateTime = (value?: string) => {
  if (!value) return ''
  
  // Since the timestamp is stored as Philippine time but with 'Z' suffix,
  // we need to parse it as if it's already in local time
  // Remove the 'Z' and parse as local time
  const localTimeString = value.replace('Z', '')
  const d = new Date(localTimeString)
  if (isNaN(d.getTime())) return ''
  
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
}

// Print functionality
const printReport = (title: string, content: string) => {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        @media print {
          @page { margin: 0.5in; }
          body { font-family: Arial, sans-serif; font-size: 12px; }
          .header { background-color: #800000; color: white; padding: 20px; text-align: center; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header .subtitle { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
          .content { line-height: 1.6; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .no-data { text-align: center; color: #666; font-style: italic; padding: 20px; }
        }
        @media screen {
          body { font-family: Arial, sans-serif; font-size: 14px; margin: 20px; }
          .header { background-color: #800000; color: white; padding: 20px; text-align: center; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header .subtitle { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
          .content { line-height: 1.6; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .no-data { text-align: center; color: #666; font-style: italic; padding: 20px; }
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `)
  
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
  printWindow.close()
}

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

    // Fetch patient visits data from Firebase
    const visitsRef = dbRef(db, 'clinic-visits')
    const visitsSnap = await get(visitsRef)
    const visitsData = visitsSnap.exists() ? visitsSnap.val() : {}

    // Filter visits by date range
    const startDate = new Date(visitsReport.value.startDate)
    const endDate = new Date(visitsReport.value.endDate)
    endDate.setHours(23, 59, 59, 999)

    const filteredVisits = Object.entries(visitsData)
      .map(([id, visit]: [string, any]) => ({ id, ...visit }))
      .filter((visit: any) => {
        const visitDate = new Date(visit.timestamp || visit.visitDate || visit.createdAt)
        return visitDate >= startDate && visitDate <= endDate
      })
      .sort((a: any, b: any) => new Date(b.timestamp || b.visitDate || b.createdAt).getTime() - new Date(a.timestamp || a.visitDate || a.createdAt).getTime())

    // Generate HTML content for printing
    const reportContent = `
      <div class="header">
        <h1>Patient Visits Report</h1>
        <div class="subtitle">Date Range: ${formatDate(startDate)} to ${formatDate(endDate)}</div>
      </div>
      <div class="content">
        <p><strong>Total Visits:</strong> ${filteredVisits.length}</p>
        <p><strong>Report Period:</strong> ${formatDate(startDate)} to ${formatDate(endDate)}</p>
        <p><strong>Generated:</strong> ${formatDateTime(new Date().toISOString())}</p>
        
        ${filteredVisits.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Visit ID</th>
                <th>Patient Name</th>
                <th>Visit Date</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              ${filteredVisits.map((visit: any) => `
                <tr>
                  <td>${visit.id || 'N/A'}</td>
                  <td>${visit.patientName || 'N/A'}</td>
                  <td>${formatDateTime(visit.timestamp || visit.visitDate || visit.createdAt)}</td>
                  <td>${visit.reason || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `
          <div class="no-data">No visits found for the selected date range.</div>
        `}
      </div>
      <div class="footer">
        <p>Generated by DHVSU CMS on ${formatDateTime(new Date().toISOString())}</p>
      </div>
    `

    // Print the report
    printReport('Patient Visits Report', reportContent)
    visitsSuccess.value = 'Report printed successfully!'
    
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

// Generate Medicine Inventory Report
const generateMedicineInventoryReport = async () => {
  try {
    // Validate dates only if both provided
    if (medicineInventoryReport.value.startDate && medicineInventoryReport.value.endDate) {
      const dateError = validateDates(medicineInventoryReport.value.startDate, medicineInventoryReport.value.endDate)
      if (dateError) {
        medicineInventoryError.value = dateError
        return
      }
    }

    medicineInventoryLoading.value = true
    medicineInventoryError.value = ''
    medicineInventorySuccess.value = ''

    const currentUser = authStore.getCurrentUser()
    if (!currentUser) {
      medicineInventoryError.value = 'You must be logged in to generate reports'
      return
    }

    // Compute date boundaries (inclusive) in ISO format
    const start = medicineInventoryReport.value.startDate
      ? new Date(medicineInventoryReport.value.startDate)
      : new Date('1970-01-01T00:00:00Z')
    start.setHours(0, 0, 0, 0)
    const end = medicineInventoryReport.value.endDate
      ? new Date(medicineInventoryReport.value.endDate)
      : new Date('2999-12-31T23:59:59Z')
    end.setHours(23, 59, 59, 999)

    // Fetch medicines from Firebase Realtime Database
    const medicinesSnap = await get(dbRef(db, 'medicines'))
    const medicinesMap = medicinesSnap.exists() ? medicinesSnap.val() : {}

    const results = Object.entries(medicinesMap).map(([id, value]: [string, any]) => {
      const record = value as any
      return { id, ...record }
    }).filter((record: any) => {
      const dateStr: string | undefined = record.updatedAt || record.createdAt
      if (!dateStr) return false
      const recordDate = new Date(dateStr)
      return recordDate >= start && recordDate <= end
    }).sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''))

    // Generate HTML content for printing
    const reportContent = `
      <div class="header">
        <h1>Medicine Inventory Report</h1>
        <div class="subtitle">Date Range: ${formatDate(start)} to ${formatDate(end)}</div>
      </div>
      <div class="content">
        <p><strong>Total Medicines:</strong> ${results.length}</p>
        <p><strong>Report Period:</strong> ${formatDate(start)} to ${formatDate(end)}</p>
        <p><strong>Generated:</strong> ${formatDateTime(new Date().toISOString())}</p>
        
        ${results.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Dosage</th>
                <th>Form</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              ${results.map((medicine: any) => `
                <tr>
                  <td>${medicine.id || 'N/A'}</td>
                  <td>${medicine.name || 'N/A'}</td>
                  <td>${medicine.dosage || 'N/A'}</td>
                  <td>${medicine.form || 'N/A'}</td>
                  <td>${medicine.quantity || 'N/A'}</td>
                  <td>${medicine.expirationDate || 'N/A'}</td>
                  <td>${formatDateTime(medicine.updatedAt || medicine.createdAt)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `
          <div class="no-data">No medicines found for the selected date range.</div>
        `}
      </div>
      <div class="footer">
        <p>Generated by DHVSU CMS on ${formatDateTime(new Date().toISOString())}</p>
      </div>
    `

    // Print the report
    printReport('Medicine Inventory Report', reportContent)
    medicineInventorySuccess.value = 'Report printed successfully!'
    
    // Reset form after success
    setTimeout(() => {
      medicineInventoryReport.value = {
        startDate: '',
        endDate: ''
      }
      medicineInventorySuccess.value = ''
    }, 2000)

  } catch (err: any) {
    medicineInventoryError.value = err.message || 'Failed to generate inventory report'
  } finally {
    medicineInventoryLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style> 