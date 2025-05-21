<template>
  <section class="p-8">
    <h2 class="text-3xl text-gray-200 mb-6 font-semibold">Medicines</h2>
    <div class="bg-[#232a2f] rounded-md shadow-md mb-10 p-6 border-t-4 border-[#3973a5]">
      <div class="text-lg text-gray-200 font-semibold mb-4">Add Medicine</div>
      <form @submit.prevent="handleSubmit" class="flex flex-col md:flex-row gap-4 items-center mb-2">
        <div class="flex-1 w-full">
          <label class="block text-gray-200 font-semibold mb-1">Medicine Name</label>
          <input v-model="formData.name"
            class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" type="text" required />
        </div>
        <button type="submit" class="bg-[#3973a5] text-white px-8 py-2 rounded mt-6 md:mt-0 disabled:opacity-50"
          :disabled="loading">
          {{ loading ? 'Saving...' : 'Save' }}
        </button>
      </form>
      <div v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</div>
    </div>
    <div class="bg-[#232a2f] rounded-md shadow-md p-6 border-t-4 border-[#3973a5]">
      <div class="text-lg text-gray-200 font-semibold mb-4">All Medicines</div>
      <div class="mb-4 flex flex-wrap gap-2">
        <button class="bg-gray-600 text-white px-3 py-1 rounded text-sm">Copy</button>
        <button class="bg-gray-600  text-white px-3 py-1 rounded text-sm">CSV</button>
        <button class="bg-gray-600 text-white px-3 py-1 rounded text-sm">Excel</button>
        <button class="bg-gray-600 text-white px-3 py-1 rounded text-sm">PDF</button>
        <button class="bg-gray-600 text-white px-3 py-1 rounded text-sm">Print</button>
        <button class="bg-gray-600 text-white px-3 py-1 rounded text-sm">Column visibility</button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm text-gray-200">
          <thead>
            <tr class="bg-[#3973a5] text-white">
              <th class="px-3 py-2 text-left">S.No</th>
              <th class="px-3 py-2 text-left">Medicine Name</th>
              <th class="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(medicine, index) in medicines" :key="medicine.id" class="border-b border-gray-700">
              <td class="px-3 py-2">{{ index + 1 }}</td>
              <td class="px-3 py-2">{{ medicine.name }}</td>
              <td class="px-3 py-2">
                <div class="flex gap-2">
                  <button @click="openEditModal(medicine)" class="bg-[#3973a5] text-white rounded p-1">
                    <span class="material-icons text-base">edit</span>
                  </button>
                  <button @click="removeMedicine(medicine)" class="bg-red-500 text-white rounded p-1">
                    <span class="material-icons text-base">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-between items-center mt-2 text-gray-400 text-xs">
        <div>Showing {{ medicines.length }} entries</div>
        <div class="flex items-center gap-1">
          <button class="bg-gray-700 px-2 py-1 rounded text-gray-400" disabled>Previous</button>
          <button class="bg-[#3973a5] px-3 py-1 rounded text-white">1</button>
          <button class="bg-gray-700 px-2 py-1 rounded text-gray-400" disabled>Next</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-[#232a2f] rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl text-gray-200 font-semibold">Edit Medicine</h3>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-200">
            <span class="material-icons">close</span>
          </button>
        </div>
        <form @submit.prevent="handleEdit" class="space-y-4">
          <div>
            <label class="block text-gray-200 font-semibold mb-1">Medicine Name</label>
            <input v-model="editForm.name"
              class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" type="text"
              required />
          </div>
          <div v-if="editError" class="text-red-500 text-sm">{{ editError }}</div>
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" @click="closeEditModal" class="bg-gray-600 text-white px-6 py-2 rounded">
              Cancel
            </button>
            <button type="submit" class="bg-[#3973a5] text-white px-6 py-2 rounded disabled:opacity-50"
              :disabled="editLoading">
              {{ editLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-[#232a2f] rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl text-gray-200 font-semibold">Delete Medicine</h3>
          <button @click="cancelDelete" class="text-gray-400 hover:text-gray-200">
            <span class="material-icons">close</span>
          </button>
        </div>
        <p class="text-gray-200 mb-6">Are you sure you want to delete this medicine? This action cannot be undone.</p>
        <div class="flex justify-end gap-2">
          <button @click="cancelDelete" class="bg-gray-600 text-white px-6 py-2 rounded">
            Cancel
          </button>
          <button @click="confirmDelete" class="bg-red-500 text-white px-6 py-2 rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDatabase, ref as dbRef, push, set, onValue, get, update, remove } from 'firebase/database'
import { app } from '../firebase'
import { useAuthStore } from '../stores/auth'

interface Medicine {
  id: string
  name: string
}

const authStore = useAuthStore()
const db = getDatabase(app)
const medicines = ref<Medicine[]>([])
const loading = ref(false)
const error = ref('')

const formData = ref({
  name: ''
})

// Edit modal state
const showEditModal = ref(false)
const editLoading = ref(false)
const editError = ref('')
const selectedMedicineId = ref('')
const editForm = ref({
  name: ''
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
      createdAt: new Date().toISOString(),
      createdBy: currentUser.uid
    })

    // Reset form
    formData.value = {
      name: ''
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to save medicine'
  } finally {
    loading.value = false
  }
}

// Edit functions
const openEditModal = (medicine: Medicine) => {
  selectedMedicineId.value = medicine.id
  editForm.value = {
    name: medicine.name
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = {
    name: ''
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

// Fetch medicines when component mounts
onMounted(() => {
  fetchMedicines()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');


.bg-red {
  background-color: red;
}
</style> 