<template>
  <section class="p-8">
    <h2 class="text-3xl text-gray-200 mb-6 font-semibold">Patients</h2>
    <div class="bg-[#232a2f] rounded-md shadow-md mb-10 p-6 border-t-4 border-[#3973a5]">
      <div class="text-lg text-gray-200 font-semibold mb-4">Add Patients</div>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-gray-200 font-semibold mb-1">Patient Name</label>
            <input 
              v-model="formData.name"
              class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" 
              type="text"
              required
            />
          </div>
          <div>
            <label class="block text-gray-200 font-semibold mb-1">Address</label>
            <input 
              v-model="formData.address"
              class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" 
              type="text"
              required
            />
          </div>
          <div>
            <label class="block text-gray-200 font-semibold mb-1">CNIC</label>
            <input 
              v-model="formData.cnic"
              class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" 
              type="text"
              required
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-gray-200 font-semibold mb-1">Date of Birth</label>
            <input 
              v-model="formData.dateOfBirth"
              class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" 
              type="date"
              required
            />
          </div>
          <div>
            <label class="block text-gray-200 font-semibold mb-1">Phone Number</label>
            <input 
              v-model="formData.phoneNumber"
              class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" 
              type="text"
              required
            />
          </div>
          <div>
            <label class="block text-gray-200 font-semibold mb-1">Gender</label>
            <select 
              v-model="formData.gender"
              class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
        <div class="flex justify-end">
          <button 
            type="submit" 
            class="bg-[#3973a5] text-white px-8 py-2 rounded disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
    <div class="bg-[#232a2f] rounded-md shadow-md p-6 border-t-4 border-[#3973a5]">
      <div class="text-lg text-gray-200 font-semibold mb-4">Total Patients</div>
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
              <th class="px-3 py-2 text-left">Patient Name</th>
              <th class="px-3 py-2 text-left">Address</th>
              <th class="px-3 py-2 text-left">CNIC</th>
              <th class="px-3 py-2 text-left">Date Of Birth</th>
              <th class="px-3 py-2 text-left">Phone Number</th>
              <th class="px-3 py-2 text-left">Gender</th>
              <th class="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(patient, index) in patients" :key="patient.id" class="border-b border-gray-700">
              <td class="px-3 py-2">{{ index + 1 }}</td>
              <td class="px-3 py-2">{{ patient.name }}</td>
              <td class="px-3 py-2">{{ patient.address }}</td>
              <td class="px-3 py-2">{{ patient.cnic }}</td>
              <td class="px-3 py-2">{{ formatDate(patient.dateOfBirth) }}</td>
              <td class="px-3 py-2">{{ patient.phoneNumber }}</td>
              <td class="px-3 py-2">{{ patient.gender }}</td>
              <td class="px-3 py-2">
                <div class="flex gap-2">
                  <button 
                    @click="openEditModal(patient)"
                    class="bg-[#3973a5] text-white rounded p-1"
                  >
                    <span class="material-icons text-base">edit</span>
                  </button>
                  <button 
                    @click="removePatient(patient)"
                    class="bg-red-500 text-white rounded p-1"
                  >
                    <span class="material-icons text-base">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-between items-center mt-2 text-gray-400 text-xs">
        <div>Showing {{ patients.length }} entries</div>
        <div class="flex items-center gap-1">
          <button class="bg-gray-700 px-2 py-1 rounded text-gray-400" disabled>Previous</button>
          <button class="bg-[#3973a5] px-3 py-1 rounded text-white">1</button>
          <button class="bg-gray-700 px-2 py-1 rounded text-gray-400" disabled>Next</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-[#232a2f] rounded-lg p-6 w-full max-w-2xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl text-gray-200 font-semibold">Edit Patient</h3>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-200">
            <span class="material-icons">close</span>
          </button>
        </div>
        <form @submit.prevent="handleEdit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-200 font-semibold mb-1">Patient Name</label>
              <input 
                v-model="editForm.name"
                class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" 
                type="text"
                required
              />
            </div>
            <div>
              <label class="block text-gray-200 font-semibold mb-1">Address</label>
              <input 
                v-model="editForm.address"
                class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" 
                type="text"
                required
              />
            </div>
            <div>
              <label class="block text-gray-200 font-semibold mb-1">CNIC</label>
              <input 
                v-model="editForm.cnic"
                class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" 
                type="text"
                required
              />
            </div>
            <div>
              <label class="block text-gray-200 font-semibold mb-1">Date of Birth</label>
              <input 
                v-model="editForm.dateOfBirth"
                class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" 
                type="date"
                required
              />
            </div>
            <div>
              <label class="block text-gray-200 font-semibold mb-1">Phone Number</label>
              <input 
                v-model="editForm.phoneNumber"
                class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" 
                type="text"
                required
              />
            </div>
            <div>
              <label class="block text-gray-200 font-semibold mb-1">Gender</label>
              <select 
                v-model="editForm.gender"
                class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
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

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-[#232a2f] rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl text-gray-200 font-semibold">Delete Patient</h3>
          <button @click="cancelDelete" class="text-gray-400 hover:text-gray-200">
            <span class="material-icons">close</span>
          </button>
        </div>
        <p class="text-gray-200 mb-6">Are you sure you want to delete this patient? This action cannot be undone.</p>
        <div class="flex justify-end gap-2">
          <button 
            @click="cancelDelete"
            class="bg-gray-600 text-white px-6 py-2 rounded"
          >
            Cancel
          </button>
          <button 
            @click="confirmDelete"
            class="bg-red-500 text-white px-6 py-2 rounded"
          >
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

interface Patient {
  id: string
  name: string
  address: string
  cnic: string
  dateOfBirth: string
  phoneNumber: string
  gender: string
  createdBy: string
}

const authStore = useAuthStore()
const db = getDatabase(app)
const patients = ref<Patient[]>([])
const loading = ref(false)
const error = ref('')

const formData = ref({
  name: '',
  address: '',
  cnic: '',
  dateOfBirth: '',
  phoneNumber: '',
  gender: ''
})

const showEditModal = ref(false)
const editLoading = ref(false)
const editError = ref('')
const selectedPatientId = ref('')

const editForm = ref({
  name: '',
  address: '',
  cnic: '',
  dateOfBirth: '',
  phoneNumber: '',
  gender: ''
})

const showDeleteConfirm = ref(false)
const patientToDelete = ref<Patient | null>(null)

// Format date to display in table
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Fetch patients from Firebase
const fetchPatients = () => {
  const patientsRef = dbRef(db, 'patients')
  onValue(patientsRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      patients.value = Object.entries(data).map(([id, patient]: [string, any]) => ({
        id,
        ...patient
      }))
    } else {
      patients.value = []
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
      error.value = 'You must be logged in to add a patient'
      return
    }
    
    // Create a new patient reference
    const patientsRef = dbRef(db, 'patients')
    const snapshot = await get(patientsRef)
    const patientCount = snapshot.size || 0
    const paddedCount = String(patientCount + 1).padStart(6, '0')
    const patientId = `P-${paddedCount}`

    // Save the patient data
    await set(dbRef(db, `patients/${patientId}`), {
      name: formData.value.name,
      address: formData.value.address,
      cnic: formData.value.cnic,
      dateOfBirth: formData.value.dateOfBirth,
      phoneNumber: formData.value.phoneNumber,
      gender: formData.value.gender,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.uid
    })

    // Reset form
    formData.value = {
      name: '',
      address: '',
      cnic: '',
      dateOfBirth: '',
      phoneNumber: '',
      gender: ''
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to save patient'
  } finally {
    loading.value = false
  }
}

const openEditModal = (patient: Patient) => {
  selectedPatientId.value = patient.id
  editForm.value = {
    name: patient.name,
    address: patient.address,
    cnic: patient.cnic,
    dateOfBirth: patient.dateOfBirth,
    phoneNumber: patient.phoneNumber,
    gender: patient.gender
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = {
    name: '',
    address: '',
    cnic: '',
    dateOfBirth: '',
    phoneNumber: '',
    gender: ''
  }
  editError.value = ''
  selectedPatientId.value = ''
}

const handleEdit = async () => {
  try {
    editLoading.value = true
    editError.value = ''
    
    const currentUser = authStore.getCurrentUser()
    if (!currentUser) {
      editError.value = 'You must be logged in to edit a patient'
      return
    }

    await update(dbRef(db, `patients/${selectedPatientId.value}`), {
      ...editForm.value,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser.uid
    })

    closeEditModal()
  } catch (err: any) {
    editError.value = err.message || 'Failed to update patient'
  } finally {
    editLoading.value = false
  }
}

const removePatient = (patient: Patient) => {
  patientToDelete.value = patient
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!patientToDelete.value) return

  try {
    await remove(dbRef(db, `patients/${patientToDelete.value.id}`))
    showDeleteConfirm.value = false
    patientToDelete.value = null
  } catch (err: any) {
    error.value = err.message || 'Failed to delete patient'
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  patientToDelete.value = null
}

// Fetch patients when component mounts
onMounted(() => {
  fetchPatients()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style> 