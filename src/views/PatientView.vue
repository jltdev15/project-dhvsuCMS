<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Patients Management</h1>
        <p class="text-gray-600 mt-1">Add, edit and manage patient records</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2">
          <span class="material-icons text-[#3973a5]">people</span>
          <div>
            <div class="text-sm text-gray-500">Total Patients</div>
            <div class="font-bold text-lg">{{ patients.length }}</div>
          </div>
        </div>
        <button @click="showAddModal = true"
          class="bg-[#800000] hover:bg-[#800000] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-md">
          <span class="material-icons">add_circle</span>
          Add Patient
        </button>
      </div>
    </div>

    <!-- Patients Table Card -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="bg-[#800000] px-6 py-4">
        <h2 class="text-xl text-white font-semibold flex items-center gap-2">
          <span class="material-icons">people</span>
          Patients Records
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
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none"
                type="text" placeholder="Search patients..." />
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto rounded-lg border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="patients.length === 0">
                <td colspan="7" class="px-3 py-12 text-center text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <span class="material-icons text-5xl mb-3 text-gray-300">people</span>
                    <p class="text-lg font-medium">No patients found</p>
                    <p class="text-sm">Click the "Add Patient" button to add your first patient</p>
                  </div>
                </td>
              </tr>
              <tr v-else v-for="(patient, index) in patients" :key="patient.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ index + 1 }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ patient.name }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm text-gray-700">{{ patient.address }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm text-gray-700">{{ formatDate(patient.dateOfBirth) }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm text-gray-700">{{ patient.phoneNumber }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="patient.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'">
                    {{ patient.gender }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <div class="flex gap-2">
                    <button @click="openEditModal(patient)"
                      class="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded p-1.5 transition-colors">
                      <span class="material-icons text-base">edit</span>
                    </button>
                    <button @click="removePatient(patient)"
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
        <div v-if="patients.length > 0" class="flex justify-between items-center mt-4 text-gray-500 text-sm">
          <div>
            Showing <span class="font-medium">{{ patients.length }}</span> patients
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

    <!-- Add Patient Modal -->
    <div v-if="showAddModal"
      class="fixed inset-0 backdrop-blur-md bg-gray-900/50 flex items-center justify-center z-50 transition-all duration-300">
      <div
        class="bg-white/90 backdrop-filter backdrop-blur-sm rounded-xl p-0 w-full max-w-3xl shadow-xl border border-white/20">
        <div class="bg-[#3973a5]/90 backdrop-filter backdrop-blur-sm px-6 py-4 rounded-t-xl">
          <div class="flex justify-between items-center">
            <h3 class="text-xl text-white font-semibold flex items-center gap-2">
              <span class="material-icons">add_circle</span>
              Add New Patient
            </h3>
            <button @click="closeAddModal" class="text-white hover:text-gray-200 transition-colors">
              <span class="material-icons">close</span>
            </button>
          </div>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
            <!-- Success Message -->
            <div v-if="success" class="p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
              <div class="flex items-center gap-2">
                <span class="material-icons text-green-500">check_circle</span>
                <span>{{ success }}</span>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <div class="flex items-center gap-2">
                <span class="material-icons text-red-500">error</span>
                <span>{{ error }}</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">Student ID Number <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">badge</span>
                  </div>
                  <input v-model="formData.studentId"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                    type="text" 
                    placeholder="Enter student ID number" 
                    required 
                    :disabled="loading"
                    @input="formData.studentId = formData.studentId.toUpperCase()" />
                </div>
              </div>

              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">Patient Name <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">person</span>
                  </div>
                  <input v-model="formData.name"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                    type="text" 
                    placeholder="Enter patient name" 
                    required 
                    :disabled="loading" />
                </div>
              </div>

              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">Phone Number <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">phone</span>
                  </div>
                  <input v-model="formData.phoneNumber"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                    type="text" 
                    placeholder="09XX-XXXXXXX" 
                    required 
                    :disabled="loading" />
                </div>
              </div>

              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">Date of Birth <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">event</span>
                  </div>
                  <input v-model="formData.dateOfBirth"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                    type="date" 
                    required 
                    :disabled="loading" />
                </div>
              </div>

              <div class="w-full">
                <label class="block text-gray-700 font-medium mb-2">Gender <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">wc</span>
                  </div>
                  <select v-model="formData.gender"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all appearance-none"
                    required 
                    :disabled="loading">
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span class="material-icons text-gray-500">expand_more</span>
                  </div>
                </div>
              </div>

              <div class="w-full md:col-span-3">
                <label class="block text-gray-700 font-medium mb-2">Address <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">home</span>
                  </div>
                  <input v-model="formData.address"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                    type="text" 
                    placeholder="Enter address" 
                    required 
                    :disabled="loading" />
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t mt-4">
              <button type="button" 
                @click="closeAddModal"
                class="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                :disabled="loading">
                Cancel
              </button>
              <button type="submit"
                class="bg-[#3973a5] hover:bg-[#2c5a84] text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                :disabled="loading">
                <span class="material-icons text-base">{{ loading ? 'hourglass_top' : 'save' }}</span>
                {{ loading ? 'Saving...' : 'Save Patient' }}
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
        class="bg-white/90 backdrop-filter backdrop-blur-sm rounded-xl p-0 w-full max-w-3xl shadow-xl border border-white/20">
        <div class="bg-[#3973a5]/90 backdrop-filter backdrop-blur-sm px-6 py-4 rounded-t-xl">
          <div class="flex justify-between items-center">
            <h3 class="text-xl text-white font-semibold flex items-center gap-2">
              <span class="material-icons">edit</span>
              Edit Patient
            </h3>
            <button @click="closeEditModal" class="text-white hover:text-gray-200 transition-colors">
              <span class="material-icons">close</span>
            </button>
          </div>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleEdit" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label class="block text-gray-700 font-medium mb-2">Student ID Number</label>
                <input v-model="editForm.studentId"
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                  type="text" required />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Patient Name</label>
                <input v-model="editForm.name"
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                  type="text" required />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Address</label>
                <input v-model="editForm.address"
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                  type="text" required />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Date of Birth</label>
                <input v-model="editForm.dateOfBirth"
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                  type="date" required />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Phone Number</label>
                <input v-model="editForm.phoneNumber"
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                  type="text" required />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Gender</label>
                <select v-model="editForm.gender"
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all appearance-none"
                  required>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
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
              Delete Patient
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
              <p class="text-gray-800 font-medium">Are you sure you want to delete this patient?</p>
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
import { ref, onMounted } from 'vue'
import { getDatabase, ref as dbRef, push, set, onValue, get, update, remove } from 'firebase/database'
import { app } from '../firebase'
import { useAuthStore } from '../stores/auth'

interface Patient {
  id: string
  name: string
  address: string
  dateOfBirth: string
  phoneNumber: string
  gender: string
  studentId: string
  createdBy: string
}

const authStore = useAuthStore()
const db = getDatabase(app)
const patients = ref<Patient[]>([])
const loading = ref(false)
const error = ref('')
const success = ref('')

// Add modal state
const showAddModal = ref(false)

const formData = ref({
  name: '',
  address: '',
  dateOfBirth: '',
  phoneNumber: '',
  gender: '',
  studentId: ''
})

const showEditModal = ref(false)
const editLoading = ref(false)
const editError = ref('')
const selectedPatientId = ref('')

const editForm = ref({
  name: '',
  address: '',
  dateOfBirth: '',
  phoneNumber: '',
  gender: '',
  studentId: ''
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

// Validation rules
const validateForm = () => {
  error.value = ''
  
  // Validate Student ID (should be alphanumeric and at least 5 characters)
  if (!/^[A-Za-z0-9]{5,}$/.test(formData.value.studentId)) {
    error.value = 'Student ID must be at least 5 characters long and contain only letters and numbers'
    return false
  }

  // Validate Phone Number (should be in format: 09XX-XXXXXXX)
  if (!/^09\d{2}-\d{7}$/.test(formData.value.phoneNumber)) {
    error.value = 'Phone number must be in format: 09XX-XXXXXXX'
    return false
  }

  // Validate Date of Birth (should not be in future)
  const dob = new Date(formData.value.dateOfBirth)
  if (dob > new Date()) {
    error.value = 'Date of birth cannot be in the future'
    return false
  }

  // Check if student ID already exists
  const studentIdExists = patients.value.some(p => p.studentId === formData.value.studentId)
  if (studentIdExists) {
    error.value = 'Student ID already exists'
    return false
  }

  return true
}

// Handle form submission
const handleSubmit = async () => {
  try {
    if (!validateForm()) {
      return
    }

    loading.value = true
    error.value = ''
    success.value = ''
    
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
      name: formData.value.name.trim(),
      address: formData.value.address.trim(),
      dateOfBirth: formData.value.dateOfBirth,
      phoneNumber: formData.value.phoneNumber.trim(),
      gender: formData.value.gender,
      studentId: formData.value.studentId.trim().toUpperCase(),
      createdAt: new Date().toISOString(),
      createdBy: currentUser.uid
    })

    // Show success message
    success.value = 'Patient added successfully!'
    
    // Reset form and close modal after 1.5 seconds
    setTimeout(() => {
      closeAddModal()
    }, 1500)

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
    dateOfBirth: patient.dateOfBirth,
    phoneNumber: patient.phoneNumber,
    gender: patient.gender,
    studentId: patient.studentId
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = {
    name: '',
    address: '',
    dateOfBirth: '',
    phoneNumber: '',
    gender: '',
    studentId: ''
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

// Close add modal
const closeAddModal = () => {
  showAddModal.value = false
  error.value = ''
  success.value = ''
  formData.value = {
    name: '',
    address: '',
    dateOfBirth: '',
    phoneNumber: '',
    gender: '',
    studentId: ''
  }
}

// Fetch patients when component mounts
onMounted(() => {
  fetchPatients()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style> 