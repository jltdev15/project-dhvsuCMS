<template>
  <section class="p-8">
    <h2 class="text-3xl text-gray-200 mb-6 font-semibold">Patient History</h2>
    <div class="bg-[#232a2f] rounded-md shadow-md mb-10 p-6 border-t-4 border-[#800000]">
      <div class="text-lg text-gray-200 font-semibold mb-4">Search Patient History</div>
      <form class="mb-6">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <select 
            v-model="selectedPatient"
            class="w-full md:w-1/3 bg-[#232a2f] border border-[#FFB81C] rounded px-3 py-2 text-gray-200"
          >
            <option value="">Select Patient</option>
            <option 
              v-for="patient in patients" 
              :key="patient.id" 
              :value="patient.id"
            >
              {{ patient.name }}
            </option>
          </select>
          <button 
            type="button" 
            class="bg-[#800000] text-white px-8 py-2 rounded"
            @click="searchPatientHistory"
            :disabled="!selectedPatient"
          >
            Search
          </button>
        </div>
      </form>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm text-gray-200">
          <thead>
            <tr class="bg-[#3973a5] text-white">
              <th class="px-3 py-2 text-left">S.No</th>
              <th class="px-3 py-2 text-left">Visit Date</th>
              <th class="px-3 py-2 text-left">Disease</th>
              <th class="px-3 py-2 text-left">Medicine</th>
              <th class="px-3 py-2 text-left">Packing</th>
              <th class="px-3 py-2 text-left">QTY</th>
              <th class="px-3 py-2 text-left">Dosage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(history, index) in patientHistory" :key="index" class="border-b border-gray-700">
              <td class="px-3 py-2">{{ index + 1 }}</td>
              <td class="px-3 py-2">{{ formatDate(history.visitDate) }}</td>
              <td class="px-3 py-2">{{ history.disease }}</td>
              <td class="px-3 py-2">{{ history.medicine }}</td>
              <td class="px-3 py-2">{{ history.packing }}</td>
              <td class="px-3 py-2">{{ history.quantity }}</td>
              <td class="px-3 py-2">{{ history.dosage }}</td>
            </tr>
            <tr v-if="patientHistory.length === 0">
              <td colspan="7" class="px-3 py-4 text-center text-gray-400">
                {{ selectedPatient ? 'No history found for this patient' : 'Please select a patient to view history' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDatabase, ref as dbRef, onValue, query, orderByChild, equalTo } from 'firebase/database'
import { app } from '../firebase'

interface Patient {
  id: string
  name: string
  address: string
  cnic: string
  dateOfBirth: string
  phoneNumber: string
  gender: string
}

interface PatientHistory {
  visitDate: string
  disease: string
  medicine: string
  packing: string
  quantity: string
  dosage: string
}

const db = getDatabase(app)
const patients = ref<Patient[]>([])
const selectedPatient = ref('')
const patientHistory = ref<PatientHistory[]>([])

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

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

const searchPatientHistory = () => {
  if (!selectedPatient.value) return

  const historyRef = dbRef(db, 'patientHistory')
  const historyQuery = query(historyRef, orderByChild('patientId'), equalTo(selectedPatient.value))
  
  onValue(historyQuery, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      patientHistory.value = Object.values(data)
    } else {
      patientHistory.value = []
    }
  })
}

onMounted(() => {
  fetchPatients()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style> 