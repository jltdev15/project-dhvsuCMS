<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Patients Management</h1>
        <p class="text-gray-600 mt-1">Add, edit and manage patient records</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="bg-white px-4 py-2 rounded-lg shadow flex items-start gap-2">
  
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
                  <div @click.stop>
                    <button @click="(e) => toggleActionMenu(patient.id, e)"
                      class="bg-gray-50 hover:bg-gray-100 text-gray-700 rounded p-1.5 transition-colors">
                      <span class="material-icons">more_vert</span>
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
        <div class="bg-[#800000]/90 backdrop-filter backdrop-blur-sm px-6 py-4 rounded-t-xl">
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
                <label class="block text-gray-700 font-medium mb-2">ID Number <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">badge</span>
                  </div>
                  <input v-model="formData.studentId"
                    class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#3973a5] focus:border-[#3973a5] outline-none transition-all"
                    type="text" 
                    placeholder="Enter ID number" 
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
                class="bg-[#800000] text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
        <div class="bg-[#800000]/90 backdrop-filter backdrop-blur-sm px-6 py-4 rounded-t-xl">
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
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all"
                  type="text" required />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Patient Name</label>
                <input v-model="editForm.name"
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all"
                  type="text" required />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Address</label>
                <input v-model="editForm.address"
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all"
                  type="text" required />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Date of Birth</label>
                <input v-model="editForm.dateOfBirth"
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all"
                  type="date" required />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Phone Number</label>
                <input v-model="editForm.phoneNumber"
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all"
                  type="text" required />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Gender</label>
                <select v-model="editForm.gender"
                  class="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all appearance-none"
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
                class="bg-[#800000] hover:bg-[#600000] text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

  <!-- Global portal for row action menu -->
  <Teleport to="body">
    <div v-if="openActionMenuId && actionMenuPos" class="fixed z-[9999]" :style="{ top: actionMenuPos.top + 'px', left: actionMenuPos.left + 'px' }">
      <div class="w-44 bg-white border border-gray-200 rounded-md shadow-lg">
        <button @click="openDispenseModal(patients.find(p => p.id === openActionMenuId)!) ; closeActionMenu()"
          class="w-full text-left px-3 py-2 text-sm hover:bg-[#FFB81C]/10">Dispense</button>
        <button @click="openLogVisitModal(patients.find(p => p.id === openActionMenuId)!) ; closeActionMenu()"
          class="w-full text-left px-3 py-2 text-sm hover:bg-green-50">Log Visit</button>
        <button @click="openHistoryModal(patients.find(p => p.id === openActionMenuId)!) ; closeActionMenu()"
          class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">View History</button>
        <button @click="openEditModal(patients.find(p => p.id === openActionMenuId)!) ; closeActionMenu()"
          class="w-full text-left px-3 py-2 text-sm hover:bg-blue-50">Edit</button>
        <button @click="removePatient(patients.find(p => p.id === openActionMenuId)!) ; closeActionMenu()"
          class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
      </div>
    </div>
  </Teleport>

  <!-- Dispense Modal -->
  <div v-if="showDispenseModal"
    class="fixed inset-0 backdrop-blur-md bg-gray-900/50 flex items-center justify-center z-50 transition-all duration-300">
    <div class="bg-white/90 backdrop-filter backdrop-blur-sm rounded-xl p-0 w-full max-w-4xl shadow-xl border border-white/20">
      <div class="bg-[#800000] px-6 py-4 rounded-t-xl">
        <div class="flex justify-between items-center">
          <h3 class="text-xl text-white font-semibold flex items-center gap-2">
            <span class="material-icons">local_pharmacy</span>
            Dispense Medicine
          </h3>
          <button @click="closeDispenseModal" class="text-white hover:text-gray-200 transition-colors">
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>
      <div class="p-6">
        <form @submit.prevent="handleDispense" class="space-y-5">
          <!-- Patient Info -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Patient Information</h4>
            <p class="text-sm text-gray-600">{{ selectedPatientForDispense?.name }} ({{ selectedPatientForDispense?.studentId }})</p>
          </div>

          <!-- Success Message -->
          <div v-if="dispenseSuccess" class="p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
            <div class="flex items-center gap-2">
              <span class="material-icons text-green-500">check_circle</span>
              <span>{{ dispenseSuccess }}</span>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="dispenseError" class="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <div class="flex items-center gap-2">
              <span class="material-icons text-red-500">error</span>
              <span>{{ dispenseError }}</span>
            </div>
          </div>

          <!-- Add Medicine Section -->
          <div class="bg-[#FFB81C]/10 border border-[#FFB81C]/30 p-4 rounded-lg">
            <h4 class="font-medium text-[#800000] mb-3 flex items-center gap-2">
              <span class="material-icons text-[#FFB81C]">add_circle</span>
              Add Medicine
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div class="w-full md:col-span-3">
                <label class="block text-gray-700 font-medium mb-2">Medicine</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">medication</span>
                  </div>
                <select v-model="dispenseForm.medicineId"
                  class="w-full bg-white border border-[#800000]/30 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all appearance-none"
                  :disabled="dispenseLoading">
                    <option value="">Select medicine</option>
                    <option v-for="medicine in medicines" :key="medicine.id" :value="medicine.id" 
                      :disabled="medicine.quantity === 0 || isExpired(medicine.expirationDate)">
                      {{ medicine.name }} ({{ medicine.dosage }}) - Qty: {{ medicine.quantity }}
                      {{ medicine.quantity === 0 ? ' - OUT OF STOCK' : '' }}
                      {{ isExpired(medicine.expirationDate) ? ' - EXPIRED' : '' }}
                    </option>
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
                  <input v-model.number="dispenseForm.quantity"
                    class="w-full bg-white border border-[#800000]/30 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all"
                    type="number" 
                    min="1"
                    :disabled="dispenseLoading" />
                </div>
              </div>

              <div class="w-full md:col-span-2">
                <label class="block text-gray-700 font-medium mb-2">Reason for Dispensing</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="material-icons text-gray-500">description</span>
                  </div>
                  <input v-model="dispenseForm.reason" type="text"
                    placeholder="e.g., Headache, Fever, Pain relief, etc. (Optional)"
                    class="w-full bg-white border border-[#800000]/30 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none transition-all"
                    :disabled="dispenseLoading">
                </div>
              </div>

              <div class="w-full flex items-end">
                <button type="button" @click="addMedicine"
                  class="w-full bg-[#800000] hover:bg-[#660000] text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  :disabled="dispenseLoading || !dispenseForm.medicineId">
                  <span class="material-icons text-base">add</span>
                  Add 
                </button>
              </div>
            </div>
          </div>

          <!-- Selected Medicines List -->
          <div v-if="selectedMedicines.length > 0" class="bg-white border border-[#800000]/20 rounded-lg">
            <div class="px-4 py-3 border-b border-[#800000]/20 bg-[#800000]/5">
              <h4 class="font-medium text-[#800000] flex items-center gap-2">
                <span class="material-icons text-[#FFB81C]">inventory_2</span>
                Selected Medicines
              </h4>
            </div>
            <div class="divide-y divide-gray-200">
              <div v-for="medicine in selectedMedicines" :key="medicine.id" class="px-4 py-3">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">{{ medicine.name }}</div>
                    <div class="text-sm text-gray-500">{{ medicine.dosage }}</div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-2">
                      <label class="text-sm text-gray-600">Qty:</label>
                      <input v-model.number="medicine.quantity"
                        @change="updateMedicineQuantity(medicine.id, medicine.quantity)"
                        class="w-16 px-2 py-1 text-sm border border-[#800000]/30 rounded focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none"
                        type="number" 
                        :min="1" 
                        :max="medicine.availableQuantity" />
                      <span class="text-xs text-gray-500">/ {{ medicine.availableQuantity }}</span>
                    </div>
                    <button @click="removeMedicine(medicine.id)"
                      class="text-red-500 hover:text-red-700 p-1">
                      <span class="material-icons text-base">delete</span>
                    </button>
                  </div>
                </div>
                <div v-if="medicine.reason" class="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                  <span class="font-medium">Reason:</span> {{ medicine.reason }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button type="button" 
              @click="closeDispenseModal"
              class="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              :disabled="dispenseLoading">
              Cancel
            </button>
            <button type="submit"
              class="bg-[#800000] hover:bg-[#660000] text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              :disabled="dispenseLoading">
              <span class="material-icons text-base">{{ dispenseLoading ? 'hourglass_top' : 'local_pharmacy' }}</span>
              {{ dispenseLoading ? 'Dispensing...' : 'Dispense Medicine' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Patient Medication History Modal -->
  <div v-if="showHistoryModal"
    class="fixed inset-0 backdrop-blur-md bg-gray-900/50 flex items-center justify-center z-50 transition-all duration-300">
    <div class="bg-white/90 backdrop-filter backdrop-blur-sm rounded-xl p-0 w-full max-w-5xl shadow-xl border border-white/20">
      <div class="bg-[#800000] px-6 py-4 rounded-t-xl">
        <div class="flex justify-between items-center">
          <h3 class="text-xl text-white font-semibold flex items-center gap-2">
            <span class="material-icons">history</span>
            Medication History - {{ selectedPatientForHistory?.name }}
          </h3>
          <button @click="closeHistoryModal" class="text-white hover:text-gray-200 transition-colors">
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>
      <div class="p-6">
        <!-- Loading State -->
        <div v-if="historyLoading" class="flex justify-center items-center py-8">
          <div class="flex items-center gap-3">
            <span class="material-icons animate-spin text-[#800000]">hourglass_top</span>
            <span class="text-gray-600">Loading medication history...</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="patientDispenseHistory.length === 0" class="text-center py-12">
          <span class="material-icons text-6xl text-gray-300 mb-4">medication</span>
          <h4 class="text-lg font-medium text-gray-900 mb-2">No Medication History</h4>
          <p class="text-gray-600">This patient has no dispensed medications yet.</p>
        </div>

        <!-- History List -->
        <div v-else class="space-y-4">
          <div v-for="dispense in patientDispenseHistory" :key="dispense.id" 
            class="bg-white border border-[#800000]/20 rounded-lg p-4">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h4 class="font-medium text-[#800000]">Dispense #{{ dispense.id }}</h4>
                <p class="text-sm text-gray-600">{{ formatDate(dispense.dispensedAt) }}</p>
              </div>
              <span class="px-2 py-1 bg-[#FFB81C]/20 text-[#800000] text-xs rounded-full">
                {{ dispense.medicines?.length || 0 }} medicine(s)
              </span>
            </div>
            
            <!-- Medicines List -->
            <div class="space-y-2">
              <div v-for="medicine in dispense.medicines" :key="medicine.medicineId"
                class="py-2 px-3 bg-gray-50 rounded">
                <div class="flex justify-between items-center mb-1">
                  <div>
                    <span class="font-medium text-gray-900">{{ medicine.medicineName }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="text-sm text-gray-600">Quantity: {{ medicine.quantity }}</span>
                  </div>
                </div>
                <div v-if="dispense.reason" class="text-sm text-gray-600">
                  <span class="font-medium">Reason:</span> {{ dispense.reason }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Stats -->
        <div v-if="patientDispenseHistory.length > 0" class="mt-6 p-4 bg-[#FFB81C]/10 rounded-lg">
          <h4 class="font-medium text-[#800000] mb-2">Summary</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Total Dispenses:</span>
              <span class="font-medium text-[#800000] ml-2">{{ patientDispenseHistory.length }}</span>
            </div>
            <div>
              <span class="text-gray-600">Total Medicines:</span>
              <span class="font-medium text-[#800000] ml-2">
                {{ patientDispenseHistory.reduce((total, d) => total + (d.medicines?.length || 0), 0) }}
              </span>
            </div>
            <div>
              <span class="text-gray-600">Last Dispense:</span>
              <span class="font-medium text-[#800000] ml-2">
                {{ patientDispenseHistory[0] ? formatDate(patientDispenseHistory[0].dispensedAt) : 'N/A' }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button @click="closeHistoryModal"
            class="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Log Visit Modal -->
  <div v-if="showLogVisitModal"
    class="fixed inset-0 backdrop-blur-md bg-gray-900/50 flex items-center justify-center z-50 transition-all duration-300">
    <div class="bg-white/90 backdrop-filter backdrop-blur-sm rounded-xl p-0 w-full max-w-2xl shadow-xl border border-white/20">
      <div class="bg-[#800000] px-6 py-4 rounded-t-xl">
        <div class="flex justify-between items-center">
          <h3 class="text-xl text-white font-semibold flex items-center gap-2">
            <span class="material-icons">event_note</span>
            Log Clinic Visit - {{ selectedPatientForVisit?.name }}
          </h3>
          <button @click="closeLogVisitModal" class="text-white hover:text-gray-200 transition-colors">
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>
      <div class="p-6">
        <form @submit.prevent="handleLogVisit" class="flex flex-col gap-5">
          <!-- Success Message -->
          <div v-if="visitSuccess" class="p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
            <div class="flex items-center gap-2">
              <span class="material-icons text-green-500">check_circle</span>
              <span>{{ visitSuccess }}</span>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="visitError" class="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <div class="flex items-center gap-2">
              <span class="material-icons text-red-500">error</span>
              <span>{{ visitError }}</span>
            </div>
          </div>

          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-1.5">Visit Date *</label>
            <input v-model="visitForm.visitDate" type="datetime-local" required
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none" />
          </div>

          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-1.5">Reason for Visit *</label>
            <textarea v-model="visitForm.reason" required rows="3" placeholder="Describe the reason for the visit..."
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none resize-none"></textarea>
          </div>


          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeLogVisitModal"
              class="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="visitLoading"
              class="px-6 py-2.5 bg-[#800000] text-white font-medium rounded-lg hover:bg-[#700000] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
              <span v-if="visitLoading" class="material-icons animate-spin text-sm">hourglass_top</span>
              <span v-else class="material-icons text-sm">save</span>
              {{ visitLoading ? 'Logging Visit...' : 'Log Visit' }}
            </button>
          </div>
        </form>
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

// Dispense modal state
const showDispenseModal = ref(false)
const selectedPatientForDispense = ref<Patient | null>(null)
const dispenseLoading = ref(false)
const dispenseError = ref('')
const dispenseSuccess = ref('')
const medicines = ref<any[]>([])

const dispenseForm = ref({
  medicineId: '',
  quantity: 1,
  reason: ''
})

const selectedMedicines = ref<Array<{
  id: string
  name: string
  dosage: string
  quantity: number
  availableQuantity: number
  reason: string
}>>([])

// Format date to display in table (Philippines timezone)
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Manila'
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

// Fetch medicines from Firebase
const fetchMedicines = async () => {
  try {
    const medicinesRef = dbRef(db, 'medicines')
    const snapshot = await get(medicinesRef)
    if (snapshot.exists()) {
      const data = snapshot.val()
      medicines.value = Object.entries(data).map(([id, medicine]: [string, any]) => ({
        id,
        ...medicine
      }))
    }
  } catch (err) {
    console.error('Failed to fetch medicines:', err)
  }
}

// Dispense modal handlers
const openDispenseModal = (patient: Patient) => {
  selectedPatientForDispense.value = patient
  dispenseForm.value = { medicineId: '', quantity: 1, reason: '' }
  selectedMedicines.value = []
  dispenseError.value = ''
  dispenseSuccess.value = ''
  showDispenseModal.value = true
  fetchMedicines()
}

const closeDispenseModal = () => {
  showDispenseModal.value = false
  selectedPatientForDispense.value = null
  dispenseForm.value = { medicineId: '', quantity: 1, reason: '' }
  selectedMedicines.value = []
  dispenseError.value = ''
  dispenseSuccess.value = ''
}

const addMedicine = () => {
  if (!dispenseForm.value.medicineId || dispenseForm.value.quantity <= 0) {
    dispenseError.value = 'Please select a medicine and enter a valid quantity'
    return
  }

  // Reason is optional - no validation needed

  const medicine = medicines.value.find(m => m.id === dispenseForm.value.medicineId)
  if (!medicine) {
    dispenseError.value = 'Selected medicine not found'
    return
  }

  // Check if already added
  if (selectedMedicines.value.some(m => m.id === medicine.id)) {
    dispenseError.value = 'This medicine is already added'
    return
  }

  // Check if medicine is out of stock
  if (medicine.quantity === 0) {
    dispenseError.value = `❌ ${medicine.name} is out of stock (0 available)`
    return
  }

  // Check if medicine is expired
  if (medicine.expirationDate) {
    const today = new Date()
    const expiryDate = new Date(medicine.expirationDate + '-01') // Add day to make it first of month
    if (expiryDate <= today) {
      dispenseError.value = `⚠️ ${medicine.name} has expired (Expiry: ${medicine.expirationDate})`
      return
    }
    
    // Check if medicine expires within 30 days
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    if (expiryDate <= thirtyDaysFromNow) {
      dispenseError.value = `⚠️ ${medicine.name} expires soon (Expiry: ${medicine.expirationDate}). Proceed with caution.`
      // Allow adding but show warning
    }
  }

  // Check available quantity
  if (medicine.quantity < dispenseForm.value.quantity) {
    dispenseError.value = `Insufficient quantity. Available: ${medicine.quantity}`
    return
  }

  selectedMedicines.value.push({
    id: medicine.id,
    name: medicine.name,
    dosage: medicine.dosage,
    quantity: dispenseForm.value.quantity,
    availableQuantity: medicine.quantity,
    reason: dispenseForm.value.reason || ''
  })

  // Reset form
  dispenseForm.value = { medicineId: '', quantity: 1, reason: '' }
  dispenseError.value = ''
}

const removeMedicine = (medicineId: string) => {
  selectedMedicines.value = selectedMedicines.value.filter(m => m.id !== medicineId)
}

const updateMedicineQuantity = (medicineId: string, newQuantity: number) => {
  const medicine = selectedMedicines.value.find(m => m.id === medicineId)
  if (medicine && newQuantity > 0 && newQuantity <= medicine.availableQuantity) {
    medicine.quantity = newQuantity
  }
}

// Helper function to check if medicine is expired
const isExpired = (expirationDate: string) => {
  if (!expirationDate) return false
  const today = new Date()
  const expiryDate = new Date(expirationDate + '-01') // Add day to make it first of month
  return expiryDate <= today
}

const handleDispense = async () => {
  if (!selectedPatientForDispense.value || selectedMedicines.value.length === 0) {
    dispenseError.value = 'Please add at least one medicine'
    return
  }

  try {
    dispenseLoading.value = true
    dispenseError.value = ''
    dispenseSuccess.value = ''

    const currentUser = authStore.getCurrentUser()
    if (!currentUser) {
      dispenseError.value = 'You must be logged in to dispense medicine'
      return
    }

    // Create dispense record
    const dispenseRef = dbRef(db, 'dispenses')
    const snapshot = await get(dispenseRef)
    const dispenseCount = snapshot.size || 0
    const paddedCount = String(dispenseCount + 1).padStart(6, '0')
    const dispenseId = `D-${paddedCount}`

    // Process each selected medicine
    const dispensedMedicines = []
    for (const selectedMedicine of selectedMedicines.value) {
      // Update medicine quantity
      const newQuantity = selectedMedicine.availableQuantity - selectedMedicine.quantity
      await update(dbRef(db, `medicines/${selectedMedicine.id}`), {
        quantity: newQuantity,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.uid
      })

      dispensedMedicines.push({
        medicineId: selectedMedicine.id,
        medicineName: selectedMedicine.name,
        quantity: selectedMedicine.quantity,
        reason: selectedMedicine.reason || ''
      })
    }

    // Create dispense record with all medicines
    await set(dbRef(db, `dispenses/${dispenseId}`), {
      patientId: selectedPatientForDispense.value.id,
      patientName: selectedPatientForDispense.value.name,
      medicines: dispensedMedicines,
      reason: selectedMedicines.value[0]?.reason || '', // Use first medicine's reason as overall reason
      dispensedAt: new Date().toISOString(),
      dispensedBy: currentUser.uid
    })

    // Create clinic visit record
    const visitsRef = dbRef(db, 'clinic-visits')
    const visitsSnapshot = await get(visitsRef)
    const visitCount = visitsSnapshot.size || 0
    const paddedVisitCount = String(visitCount + 1).padStart(6, '0')
    const visitId = `V-${paddedVisitCount}`

    await set(dbRef(db, `clinic-visits/${visitId}`), {
      patientId: selectedPatientForDispense.value.id,
      patientName: selectedPatientForDispense.value.name,
      reason: selectedMedicines.value[0]?.reason || '',
      medicinesDispensed: dispensedMedicines.map(m => m.medicineName).join(', '),
      timestamp: new Date().toISOString(),
      recordedBy: currentUser.uid,
      dispenseId: dispenseId // Link to the dispense record
    })

    const medicineNames = dispensedMedicines.map(m => `${m.quantity}x ${m.medicineName}`).join(', ')
    dispenseSuccess.value = `Successfully dispensed ${medicineNames} to ${selectedPatientForDispense.value.name}`
    
    // Close modal after success
    setTimeout(() => {
      closeDispenseModal()
    }, 2000)

  } catch (err: any) {
    dispenseError.value = err.message || 'Failed to dispense medicine'
  } finally {
    dispenseLoading.value = false
  }
}

const viewPatient = (patient: Patient) => {
  // TODO: Navigate to a detailed view if available
  console.log('View patient', patient.id)
}

// Patient medication history state
const showHistoryModal = ref(false)
const selectedPatientForHistory = ref<Patient | null>(null)
const patientDispenseHistory = ref<any[]>([])
const historyLoading = ref(false)

// Log visit modal state
const showLogVisitModal = ref(false)
const selectedPatientForVisit = ref<Patient | null>(null)
const visitLoading = ref(false)
const visitError = ref('')
const visitSuccess = ref('')

const visitForm = ref({
  visitDate: '',
  reason: ''
})

const openHistoryModal = async (patient: Patient) => {
  selectedPatientForHistory.value = patient
  showHistoryModal.value = true
  await fetchPatientDispenseHistory(patient.id)
}

const closeHistoryModal = () => {
  showHistoryModal.value = false
  selectedPatientForHistory.value = null
  patientDispenseHistory.value = []
}

// Log visit modal handlers
const openLogVisitModal = (patient: Patient) => {
  selectedPatientForVisit.value = patient
  
  // Get current date/time in Philippines timezone (UTC+8)
  const now = new Date()
  // Convert to Philippines timezone by adjusting for UTC+8
  const philippinesOffset = 8 * 60 // 8 hours in minutes
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  const philippinesTime = new Date(utc + (philippinesOffset * 60000))
  
  // Format for datetime-local input (YYYY-MM-DDTHH:MM)
  const year = philippinesTime.getFullYear()
  const month = String(philippinesTime.getMonth() + 1).padStart(2, '0')
  const day = String(philippinesTime.getDate()).padStart(2, '0')
  const hours = String(philippinesTime.getHours()).padStart(2, '0')
  const minutes = String(philippinesTime.getMinutes()).padStart(2, '0')
  const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}`
  
  visitForm.value = {
    visitDate: localDateTime, // Set current date/time in Philippines timezone
    reason: ''
  }
  visitError.value = ''
  visitSuccess.value = ''
  showLogVisitModal.value = true
}

const closeLogVisitModal = () => {
  showLogVisitModal.value = false
  selectedPatientForVisit.value = null
  visitForm.value = {
    visitDate: '',
    reason: ''
  }
  visitError.value = ''
  visitSuccess.value = ''
}

const handleLogVisit = async () => {
  if (!selectedPatientForVisit.value) {
    visitError.value = 'No patient selected'
    return
  }

  try {
    visitLoading.value = true
    visitError.value = ''
    visitSuccess.value = ''

    const currentUser = authStore.getCurrentUser()
    if (!currentUser) {
      visitError.value = 'You must be logged in to log a visit'
      return
    }

    // Create clinic visit record
    const visitsRef = dbRef(db, 'clinic-visits')
    const visitsSnapshot = await get(visitsRef)
    const visitCount = visitsSnapshot.size || 0
    const paddedVisitCount = String(visitCount + 1).padStart(6, '0')
    const visitId = `V-${paddedVisitCount}`

    // Convert the provided date-time to explicit Philippine time (+08:00) for storage
    // `visitForm.value.visitDate` is in the format YYYY-MM-DDTHH:mm (from datetime-local)
    // We persist it as Manila local time with an explicit offset to avoid ambiguity across timezones.
    const visitStr: string = visitForm.value.visitDate
    const [datePart, timePart] = visitStr.split('T')
    const [y, m, d] = datePart.split('-').map((v) => parseInt(v, 10))
    const [hh, mm] = (timePart || '00:00').split(':').map((v) => parseInt(v, 10))
    // Build RFC3339 string with +08:00 offset (Asia/Manila has no DST)
    const yyyy = String(y).padStart(4, '0')
    const mon = String(m).padStart(2, '0')
    const day = String(d).padStart(2, '0')
    const hour = String(hh).padStart(2, '0')
    const min = String(mm).padStart(2, '0')
    const manilaTimestamp = `${yyyy}-${mon}-${day}T${hour}:${min}:00+08:00`

    await set(dbRef(db, `clinic-visits/${visitId}`), {
      patientId: selectedPatientForVisit.value.id,
      patientName: selectedPatientForVisit.value.name,
      reason: visitForm.value.reason,
      timestamp: manilaTimestamp,
      recordedBy: currentUser.uid
    })

    visitSuccess.value = `Visit logged successfully for ${selectedPatientForVisit.value.name}`
    
    // Close modal after success
    setTimeout(() => {
      closeLogVisitModal()
    }, 2000)

  } catch (err: any) {
    visitError.value = err.message || 'Failed to log visit'
  } finally {
    visitLoading.value = false
  }
}

const fetchPatientDispenseHistory = async (patientId: string) => {
  try {
    historyLoading.value = true
    const dispensesRef = dbRef(db, 'dispenses')
    const snapshot = await get(dispensesRef)
    
    if (snapshot.exists()) {
      const data = snapshot.val()
      patientDispenseHistory.value = Object.entries(data)
        .map(([id, dispense]: [string, any]) => ({ id, ...dispense }))
        .filter((dispense: any) => dispense.patientId === patientId)
        .sort((a: any, b: any) => new Date(b.dispensedAt).getTime() - new Date(a.dispensedAt).getTime())
    } else {
      patientDispenseHistory.value = []
    }
  } catch (err) {
    console.error('Failed to fetch dispense history:', err)
    patientDispenseHistory.value = []
  } finally {
    historyLoading.value = false
  }
}

// Row action menu control
const openActionMenuId = ref<string | null>(null)
const actionMenuPos = ref<{ top: number; left: number } | null>(null)
const toggleActionMenu = (patientId: string, event?: MouseEvent) => {
  if (openActionMenuId.value === patientId) {
    closeActionMenu()
    return
  }
  openActionMenuId.value = patientId
  if (event) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    actionMenuPos.value = { top: rect.bottom + 8, left: rect.right - 176 } // 176 ~ menu width
  }
}
const closeActionMenu = () => { openActionMenuId.value = null; actionMenuPos.value = null }

// Close menu on outside click / scroll / resize
if (typeof window !== 'undefined') {
  window.addEventListener('click', closeActionMenu)
  window.addEventListener('scroll', closeActionMenu, true)
  window.addEventListener('resize', closeActionMenu)
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