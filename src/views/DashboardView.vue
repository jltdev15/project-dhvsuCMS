<template>
  <section class="dashboard">
    <h2>Dashboard</h2>
    <div class="cards">
      <div class="card card-blue">
        <div class="card-content">
          <div class="card-number">{{ todayCount }}</div>
          <div class="card-label">Today's Patients</div>
        </div>
        <span class="material-icons card-icon">event</span>
      </div>
      <div class="card card-purple">
        <div class="card-content">
          <div class="card-number">{{ weekCount }}</div>
          <div class="card-label">Current Week</div>
        </div>
        <span class="material-icons card-icon">event</span>
      </div>
      <div class="card card-pink">
        <div class="card-content">
          <div class="card-number">{{ monthCount }}</div>
          <div class="card-label">Current Month</div>
        </div>
        <span class="material-icons card-icon">event</span>
      </div>
      <div class="card card-red">
        <div class="card-content">
          <div class="card-number">{{ yearCount }}</div>
          <div class="card-label">Current Year</div>
        </div>
        <span class="material-icons card-icon">person</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'
import { app } from '../firebase'

const db = getDatabase(app)
const todayCount = ref(0)
const weekCount = ref(0)
const monthCount = ref(0)
const yearCount = ref(0)

const calculatePatientCounts = (patients: any[]) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const yearStart = new Date(now.getFullYear(), 0, 1)

  todayCount.value = patients.filter(patient => {
    const patientDate = new Date(patient.createdAt)
    return patientDate >= today
  }).length

  weekCount.value = patients.filter(patient => {
    const patientDate = new Date(patient.createdAt)
    return patientDate >= weekStart
  }).length

  monthCount.value = patients.filter(patient => {
    const patientDate = new Date(patient.createdAt)
    return patientDate >= monthStart
  }).length

  yearCount.value = patients.filter(patient => {
    const patientDate = new Date(patient.createdAt)
    return patientDate >= yearStart
  }).length
}

onMounted(() => {
  const patientsRef = dbRef(db, 'patients')
  onValue(patientsRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      const patients = Object.values(data)
      calculatePatientCounts(patients)
    } else {
      todayCount.value = 0
      weekCount.value = 0
      monthCount.value = 0
      yearCount.value = 0
    }
  })
})
</script>

<style scoped>
.dashboard {
  padding: 32px;
}
.dashboard h2 {
  color: #fff;
  margin-bottom: 24px;
}
.cards {
  display: flex;
  gap: 20px;
}
.card {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-radius: 8px;
  color: #fff;
  min-width: 200px;
  min-height: 110px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.card-content {
  display: flex;
  flex-direction: column;
}
.card-number {
  font-size: 2.2rem;
  font-weight: bold;
}
.card-label {
  font-size: 1.1rem;
  margin-top: 4px;
}
.card-icon {
  font-size: 3.5rem;
  opacity: 0.18;
}
.card-blue {
  background: #4a90e2;
}
.card-purple {
  background: #7b3ff2;
}
.card-pink {
  background: #e26ee5;
}
.card-red {
  background: #e26e7a;
}
</style> 