<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Medicines Management</h1>
        <p class="text-gray-600 mt-1">Add, edit and manage medicines inventory</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2">
          <span class="material-icons text-[#3973a5]">medication</span>
          <div>
            <div class="text-sm text-gray-500">Total Medicines</div>
            <div class="font-bold text-lg">{{ medicines.length }}</div>
          </div>
        </div>
        <button @click="showAddModal = true"
          class="bg-[#800000] hover:bg-[#800000] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md">
          <span class="material-icons">add_circle</span>
          Add Medicine
        </button>
      </div>
    </div>

    <!-- Medicines Table Card -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="bg-[#800000] px-6 py-4">
        <h2 class="text-xl text-white font-semibold flex items-center gap-2">
          <span class="material-icons">medication</span>
          Medicines Inventory
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
              <input v-model="searchQuery"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none"
                type="text" placeholder="Search medicines..." />
            </div>
          </div>
          <!-- <div class="flex flex-wrap gap-2">
            <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm flex items-center gap-1 transition-all">
              <span class="material-icons text-sm">content_copy</span> Copy
            </button>
            <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm flex items-center gap-1 transition-all">
              <span class="material-icons text-sm">file_download</span> CSV
            </button>
            <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm flex items-center gap-1 transition-all">
              <span class="material-icons text-sm">table_view</span> Excel
            </button>
            <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm flex items-center gap-1 transition-all">
              <span class="material-icons text-sm">picture_as_pdf</span> PDF
            </button>
            <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm flex items-center gap-1 transition-all">
              <span class="material-icons text-sm">print</span> Print
            </button>
          </div> -->
        </div>

        <!-- Table -->
        <div class="overflow-x-auto rounded-lg border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredMedicines.length === 0">
                <td colspan="7" class="px-3 py-12 text-center text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <span class="material-icons text-5xl mb-3 text-gray-300">inventory</span>
                    <p class="text-lg font-medium">No medicines found</p>
                    <p class="text-sm">{{ searchQuery ? 'No medicines match your search' : 'Click the "Add Medicine" button to add your first medicine' }}</p>
                  </div>
                </td>
              </tr>
              <tr v-else v-for="(medicine, index) in filteredMedicines" :key="medicine.id"
                class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ index + 1 }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ medicine.name }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm text-gray-700">{{ medicine.dosage || '-' }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {{ medicine.form ? medicine.form.charAt(0).toUpperCase() + medicine.form.slice(1) : '-' }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm text-gray-700">{{ medicine.quantity || '-' }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm" :class="getExpirationClass(medicine.expirationDate)">
                    {{ medicine.expirationDate ? new Date(medicine.expirationDate).toLocaleDateString() : '-' }}
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <div class="flex gap-2">
                    <button @click="openEditModal(medicine)"
                      class="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded p-1.5 transition-colors">
                      <span class="material-icons text-base">edit</span>
                    </button>
                    <button @click="removeMedicine(medicine)"
                      class="bg-red-50 text-red-600 hover:bg-red-100 rounded p-1.5 transition-colors">
                      <span class="material-icons text-base">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredMedicines.length > 0" class="flex justify-between items-center mt-4 text-gray-500 text-sm">
          <div>
            Showing <span class="font-medium">{{ filteredMedicines.length }}</span> medicines
            <span v-if="searchQuery" class="text-gray-400">(filtered from {{ medicines.length }} total)</span>
          </div>
          <div class="flex items-center gap-2">
            <button class="bg-gray-100 px-3 py-1 rounded-md text-gray-500 disabled:opacity-50" disabled>
              <span class="material-icons text-sm">chevron_left</span>
            </button>
            <button class="bg-[#800000] px-3 py-1 rounded-md text-white">1</button>
            <button class="bg-gray-100 px-3 py-1 rounded-md text-gray-500 disabled:opacity-50" disabled>
              <span class="material-icons text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Medicine Modal -->
    <div v-if="showAddModal"
      class="fixed inset-0 backdrop-blur-md bg-gray-900/50 flex items-center justify-center z-50 transition-all duration-300">
      <div
        class="bg-white/90 backdrop-filter backdrop-blur-sm rounded-xl p-0 w-full max-w-3xl shadow-xl border border-white/20">
        <div class="bg-red-800 backdrop-filter backdrop-blur-sm px-6 py-4 rounded-t-xl">
          <div class="flex justify-between items-center">
            <h3 class="text-xl text-white font-semibold flex items-center gap-2">
              <span class="material-icons">add_circle</span>
              Add New Medicine
            </h3>
            <button @click="closeAddModal" class="text-white hover:text-gray-200 transition-colors">
              <span class="material-icons">close</span>
            </button>
          </div>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">Medicine Name</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">medication</span>
                  </div>
                  <input v-model="formData.name"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                    type="text" placeholder="Enter medicine name" required />
                </div>
              </div>

              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">Dosage</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">straighten</span>
                  </div>
                  <input v-model="formData.dosage"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                    type="text" placeholder="e.g. 500mg" required />
                </div>
              </div>

              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">Form</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">category</span>
                  </div>
                  <select v-model="formData.form"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all appearance-none"
                    required>
                    <option value="">Select form</option>
                    <option value="tablet">Tablet</option>
                    <option value="liquid">Liquid</option>

                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span class="material-icons text-gray-500">expand_more</span>
                  </div>
                </div>
              </div>

              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">Quantity</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">inventory</span>
                  </div>
                  <input v-model="formData.quantity"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                    type="number" min="1" placeholder="Enter quantity" required />
                </div>
              </div>

              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">Expiration Date</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">event</span>
                  </div>
                  <input v-model="formData.expirationDate"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                    type="month" required />
                </div>
              </div>
            </div>

            <div v-if="error" class="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <div class="flex items-center gap-2">
                <span class="material-icons text-red-500">error</span>
                <span>{{ error }}</span>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t mt-4">
              <button type="button" @click="closeAddModal"
                class="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit"
                class="bg-[#800000] text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                :disabled="loading">
                <span class="material-icons text-base">{{ loading ? 'hourglass_top' : 'save' }}</span>
                {{ loading ? 'Saving...' : 'Save Medicine' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal"
      class="fixed inset-0 backdrop-blur-md bg-gray-900/50 flex items-center justify-center z-50 transition-all duration-300">
      <div
        class="bg-white/90 backdrop-filter backdrop-blur-sm rounded-xl p-0 w-full max-w-lg shadow-xl border border-white/20">
        <div class="bg-[#3973a5]/90 backdrop-filter backdrop-blur-sm px-6 py-4 rounded-t-xl">
          <div class="flex justify-between items-center">
            <h3 class="text-xl text-white font-semibold flex items-center gap-2">
              <span class="material-icons">edit</span>
              Edit Medicine
            </h3>
            <button @click="closeEditModal" class="text-white hover:text-gray-200 transition-colors">
              <span class="material-icons">close</span>
            </button>
          </div>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleEdit" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-gray-700 font-medium mb-2">Medicine Name</label>
                <input v-model="editForm.name"
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                  type="text" required />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Dosage</label>
                <input v-model="editForm.dosage"
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                  type="text" required />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Form</label>
                <div class="relative">
                  <select v-model="editForm.form"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all appearance-none"
                    required>
                    <option value="">Select form</option>
                    <option value="tablet">Tablet</option>
                    <option value="capsule">Capsule</option>
                    <option value="liquid">Liquid</option>
                    <option value="injection">Injection</option>
                    <option value="cream">Cream</option>
                    <option value="ointment">Ointment</option>
                    <option value="other">Other</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span class="material-icons text-gray-500">expand_more</span>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Quantity</label>
                <input v-model="editForm.quantity"
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                  type="number" min="1" required />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Expiration Date</label>
                <input v-model="editForm.expirationDate"
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                  type="month" required />
              </div>
            </div>
            <div v-if="editError" class="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <div class="flex items-center gap-2">
                <span class="material-icons text-red-500">error</span>
                <span>{{ editError }}</span>
              </div>
            </div>
            <div class="flex justify-end gap-3 pt-4 border-t">
              <button type="button" @click="closeEditModal"
                class="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit"
                class="bg-[#3973a5] hover:bg-[#2c5a84] text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="editLoading">
                <span class="material-icons text-base">{{ editLoading ? 'hourglass_top' : 'save' }}</span>
                {{ editLoading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm"
      class="fixed inset-0 backdrop-blur-md bg-gray-900/50 flex items-center justify-center z-50 transition-all duration-300">
      <div
        class="bg-white/90 backdrop-filter backdrop-blur-sm rounded-xl p-0 w-full max-w-md shadow-xl border border-white/20">
        <div class="bg-red-500/90 backdrop-filter backdrop-blur-sm px-6 py-4 rounded-t-xl">
          <div class="flex justify-between items-center">
            <h3 class="text-xl text-white font-semibold flex items-center gap-2">
              <span class="material-icons">delete</span>
              Delete Medicine
            </h3>
            <button @click="cancelDelete" class="text-white hover:text-gray-200 transition-colors">
              <span class="material-icons">close</span>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="flex items-center gap-4 bg-red-50 p-4 rounded-lg mb-6">
            <span class="material-icons text-3xl text-red-500">warning</span>
            <div>
              <p class="text-gray-800 font-medium">Are you sure you want to delete this medicine?</p>
              <p class="text-gray-600 text-sm mt-1">This action cannot be undone.</p>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button @click="cancelDelete"
              class="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button @click="confirmDelete"
              class="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <span class="material-icons">delete</span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getDatabase, ref as dbRef, push, set, onValue, get, update, remove } from 'firebase/database'
import { app } from '../firebase'
import { useAuthStore } from '../stores/auth'

interface Medicine {
  id: string
  name: string
  dosage: string
  form: string
  quantity: string
  expirationDate: string
}

const authStore = useAuthStore()
const db = getDatabase(app)
const medicines = ref<Medicine[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')

// Add computed property for filtered medicines
const filteredMedicines = computed(() => {
  if (!searchQuery.value) return medicines.value
  
  const query = searchQuery.value.toLowerCase()
  return medicines.value.filter(medicine => 
    medicine.name.toLowerCase().includes(query) ||
    (medicine.dosage && medicine.dosage.toLowerCase().includes(query)) ||
    (medicine.form && medicine.form.toLowerCase().includes(query)) ||
    (medicine.quantity && medicine.quantity.toString().includes(query))
  )
})

const formData = ref({
  name: '',
  dosage: '',
  form: '',
  quantity: '',
  expirationDate: ''
})

// Add modal state
const showAddModal = ref(false)

// Edit modal state
const showEditModal = ref(false)
const editLoading = ref(false)
const editError = ref('')
const selectedMedicineId = ref('')
const editForm = ref({
  name: '',
  dosage: '',
  form: '',
  quantity: '',
  expirationDate: ''
})

// Delete modal state
const showDeleteConfirm = ref(false)
const medicineToDelete = ref<Medicine | null>(null)

// Fetch medicines from Firebase
const fetchMedicines = () => {
  const medicinesRef = dbRef(db, 'medicines')
  onValue(medicinesRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      medicines.value = Object.entries(data).map(([id, medicine]: [string, any]) => ({
        id,
        ...medicine
      }))
    } else {
      medicines.value = []
    }
  })
}

// Handle form submission
const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const currentUser = authStore.getCurrentUser()
    if (!currentUser) {
      error.value = 'You must be logged in to add a medicine'
      return
    }

    // Generate a custom medicine ID with prefix M-000000
    const medicinesRef = dbRef(db, 'medicines')
    const snapshot = await get(medicinesRef)
    const medicineCount = snapshot.size || 0
    const paddedCount = String(medicineCount + 1).padStart(6, '0')
    const medicineId = `M-${paddedCount}`
    
    // Save the medicine data
    await set(dbRef(db, `medicines/${medicineId}`), {
      name: formData.value.name,
      dosage: formData.value.dosage,
      form: formData.value.form,
      quantity: formData.value.quantity,
      expirationDate: formData.value.expirationDate,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.uid
    })

    // Reset form and close modal
    formData.value = {
      name: '',
      dosage: '',
      form: '',
      quantity: '',
      expirationDate: ''
    }
    closeAddModal()
  } catch (err: any) {
    error.value = err.message || 'Failed to save medicine'
  } finally {
    loading.value = false
  }
}

// Close add modal
const closeAddModal = () => {
  showAddModal.value = false
  error.value = ''
  formData.value = {
    name: '',
    dosage: '',
    form: '',
    quantity: '',
    expirationDate: ''
  }
}

// Edit functions
const openEditModal = (medicine: Medicine) => {
  selectedMedicineId.value = medicine.id
  editForm.value = {
    name: medicine.name,
    dosage: medicine.dosage || '',
    form: medicine.form || '',
    quantity: medicine.quantity || '',
    expirationDate: medicine.expirationDate || ''
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = {
    name: '',
    dosage: '',
    form: '',
    quantity: '',
    expirationDate: ''
  }
  editError.value = ''
  selectedMedicineId.value = ''
}

const handleEdit = async () => {
  try {
    editLoading.value = true
    editError.value = ''
    
    const currentUser = authStore.getCurrentUser()
    if (!currentUser) {
      editError.value = 'You must be logged in to edit a medicine'
      return
    }

    await update(dbRef(db, `medicines/${selectedMedicineId.value}`), {
      name: editForm.value.name,
      dosage: editForm.value.dosage,
      form: editForm.value.form,
      quantity: editForm.value.quantity,
      expirationDate: editForm.value.expirationDate,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser.uid
    })

    closeEditModal()
  } catch (err: any) {
    editError.value = err.message || 'Failed to update medicine'
  } finally {
    editLoading.value = false
  }
}

// Delete functions
const removeMedicine = (medicine: Medicine) => {
  medicineToDelete.value = medicine
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!medicineToDelete.value) return

  try {
    await remove(dbRef(db, `medicines/${medicineToDelete.value.id}`))
    showDeleteConfirm.value = false
    medicineToDelete.value = null
  } catch (err: any) {
    error.value = err.message || 'Failed to delete medicine'
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  medicineToDelete.value = null
}

// Check if expiration date is close or passed
const getExpirationClass = (expirationDate: string) => {
  if (!expirationDate) return 'text-gray-700'
  
  const today = new Date()
  const expDate = new Date(expirationDate)
  const diffTime = expDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'text-red-600 font-semibold'
  if (diffDays < 30) return 'text-amber-600 font-semibold'
  return 'text-green-700'
}

// Fetch medicines when component mounts
onMounted(() => {
  fetchMedicines()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style> 