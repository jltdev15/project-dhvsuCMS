<template>
  <section class="p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="md:col-span-2">
        <MedicationInventoryChart />
      </div>
      <ClinicVisitsChart />
      <MedicationDispensedChart />
      <MedicationExpiryChart />
      <ClinicVisitsTrendChart />
      <GenderVisitsChart />
      <ReasonByGenderChart />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'
import { app } from '../firebase'
// @ts-ignore
import ClinicVisitsChart from '../components/ClinicVisitsChart.vue'
// @ts-ignore
import MedicationInventoryChart from '../components/MedicationInventoryChart.vue'
// @ts-ignore
import MedicationDispensedChart from '../components/MedicationDispensedChart.vue'
// @ts-ignore
import MedicationExpiryChart from '../components/MedicationExpiryChart.vue'
// @ts-ignore
import ClinicVisitsTrendChart from '../components/ClinicVisitsTrendChart.vue'
// @ts-ignore
import GenderVisitsChart from '../components/GenderVisitsChart.vue'
// @ts-ignore
import ReasonByGenderChart from '../components/ReasonByGenderChart.vue'

const db = getDatabase(app)

onMounted(() => {
  // Initialize dashboard
})
</script> 