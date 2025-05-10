<template>
  <section class="p-8">
    <h2 class="text-3xl text-gray-200 mb-6 font-semibold">Medicine Details</h2>
    <div class="bg-[#232a2f] rounded-md shadow-md mb-10 p-6 border-t-4 border-[#3973a5]">
      <div class="text-lg text-gray-200 font-semibold mb-4">Add Medicine Details</div>
      <form @submit.prevent="handleSubmit" class="flex flex-col md:flex-row gap-4 items-center mb-2">
        <div class="flex-1 w-full">
          <label class="block text-gray-200 font-semibold mb-1">Select Medicine</label>
          <select 
            v-model="selectedMedicine"
            class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200"
          >
            <option value="">Select Medicine</option>
            <option 
              v-for="medicine in medicines" 
              :key="medicine.id" 
              :value="medicine.id"
            >
              {{ medicine.name }}
            </option>
          </select>
        </div>
        <div class="flex-1 w-full">
          <label class="block text-gray-200 font-semibold mb-1">Packing</label>
          <input 
            v-model="packing"
            class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" 
            type="text" 
          />
        </div>
        <button 
          type="submit" 
          class="bg-[#3973a5] text-white px-8 py-2 rounded mt-6 md:mt-0"
          :disabled="loading"
        >
          {{ loading ? 'Saving...' : 'Save' }}
        </button>
      </form>
      <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
    </div>
    <div class="bg-[#232a2f] rounded-md shadow-md p-6 border-t-4 border-[#3973a5]">
      <div class="text-lg text-gray-200 font-semibold mb-4">Medicine Details</div>
      <div class="mb-4 flex flex-wrap gap-2">
        <button class="bg-gray-600 text-white px-3 py-1 rounded text-sm">Copy</button>
        <button class="bg-gray-600 text-white px-3 py-1 rounded text-sm">CSV</button>
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
              <th class="px-3 py-2 text-left">Packing</th>
              <th class="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(detail, index) in medicineDetails" 
              :key="detail.id"
              class="border-b border-gray-700"
            >
              <td class="px-3 py-2">{{ index + 1 }}</td>
              <td class="px-3 py-2">{{ detail.medicineName }}</td>
              <td class="px-3 py-2">{{ detail.packing }}</td>
              <td class="px-3 py-2">
                <button 
                  @click="openEditModal(detail)"
                  class="bg-[#3973a5] text-white rounded p-1"
                >
                  <span class="material-icons text-base">edit</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-[#232a2f] rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl text-gray-200 font-semibold">Edit Medicine Details</h3>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-200">
            <span class="material-icons">close</span>
          </button>
        </div>
        <form @submit.prevent="handleEdit" class="space-y-4">
          <div>
            <label class="block text-gray-200 font-semibold mb-1">Select Medicine</label>
            <select 
              v-model="editForm.medicineId"
              class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200"
            >
              <option value="">Select Medicine</option>
              <option 
                v-for="medicine in medicines" 
                :key="medicine.id" 
                :value="medicine.id"
              >
                {{ medicine.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-gray-200 font-semibold mb-1">Packing</label>
            <input 
              v-model="editForm.packing"
              class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" 
              type="text"
            />
          </div>
          <div v-if="editError" class="text-red-500 text-sm">{{ editError }}</div>
          <div class="flex justify-end gap-2 mt-6">
            <button 
              type="button"
              @click="closeEditModal"
              class="bg-gray-600 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="bg-[#3973a5] text-white px-6 py-2 rounded disabled:opacity-50"
              :disabled="editLoading"
            >
              {{ editLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDatabase, ref as dbRef, onValue, push, set, update } from 'firebase/database'
import { app } from '../firebase'
import { useAuthStore } from '../stores/auth'

interface Medicine {
  id: string
  name: string
}

interface MedicineDetail {
  id: string
  medicineId: string
  medicineName: string
  packing: string
  createdAt: string
  createdBy: string
}

const authStore = useAuthStore()
const db = getDatabase(app)
const medicines = ref<Medicine[]>([])
const medicineDetails = ref<MedicineDetail[]>([])
const selectedMedicine = ref('')
const packing = ref('')
const loading = ref(false)
const error = ref('')

// Edit modal state
const showEditModal = ref(false)
const editLoading = ref(false)
const editError = ref('')
const selectedDetailId = ref('')
const editForm = ref({
  medicineId: '',
  packing: ''
})

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

// Fetch medicine details
const fetchMedicineDetails = () => {
  const detailsRef = dbRef(db, 'medicineDetails')
  onValue(detailsRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      medicineDetails.value = Object.entries(data).map(([id, detail]: [string, any]) => ({
        id,
        ...detail
      }))
    } else {
      medicineDetails.value = []
    }
  })
}

// Handle form submission
const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    if (!selectedMedicine.value || !packing.value) {
      error.value = 'Please fill in all fields'
      return
    }

    const currentUser = authStore.getCurrentUser()
    if (!currentUser) {
      error.value = 'You must be logged in to add medicine details'
      return
    }

    const selectedMedicineData = medicines.value.find(m => m.id === selectedMedicine.value)
    if (!selectedMedicineData) {
      error.value = 'Selected medicine not found'
      return
    }

    // Create a new medicine detail entry
    const detailsRef = dbRef(db, 'medicineDetails')
    const newDetailRef = push(detailsRef)
    
    await set(newDetailRef, {
      medicineId: selectedMedicine.value,
      medicineName: selectedMedicineData.name,
      packing: packing.value,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.uid
    })

    // Reset form
    selectedMedicine.value = ''
    packing.value = ''
  } catch (err: any) {
    error.value = err.message || 'Failed to save medicine details'
  } finally {
    loading.value = false
  }
}

// Edit functions
const openEditModal = (detail: MedicineDetail) => {
  selectedDetailId.value = detail.id
  editForm.value = {
    medicineId: detail.medicineId,
    packing: detail.packing
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = {
    medicineId: '',
    packing: ''
  }
  editError.value = ''
  selectedDetailId.value = ''
}

const handleEdit = async () => {
  try {
    editLoading.value = true
    editError.value = ''
    
    if (!editForm.value.medicineId || !editForm.value.packing) {
      editError.value = 'Please fill in all fields'
      return
    }

    const currentUser = authStore.getCurrentUser()
    if (!currentUser) {
      editError.value = 'You must be logged in to edit medicine details'
      return
    }

    const selectedMedicineData = medicines.value.find(m => m.id === editForm.value.medicineId)
    if (!selectedMedicineData) {
      editError.value = 'Selected medicine not found'
      return
    }

    await update(dbRef(db, `medicineDetails/${selectedDetailId.value}`), {
      medicineId: editForm.value.medicineId,
      medicineName: selectedMedicineData.name,
      packing: editForm.value.packing,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser.uid
    })

    closeEditModal()
  } catch (err: any) {
    editError.value = err.message || 'Failed to update medicine details'
  } finally {
    editLoading.value = false
  }
}

// Fetch data when component mounts
onMounted(() => {
  fetchMedicines()
  fetchMedicineDetails()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style> 