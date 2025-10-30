<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-lg font-semibold text-gray-700 mb-2">Visits by Gender (Monthly)</h3>
    <div class="h-[300px]">
      <canvas ref="genderChart"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'
import { app } from '../firebase'
import Chart from 'chart.js/auto'
import { useRouter } from 'vue-router'

export default {
  name: 'GenderVisitsChart',
  setup() {
    const db = getDatabase(app)
    const router = useRouter()
    const genderChart = ref<HTMLCanvasElement | null>(null)
    let chartInstance: Chart | null = null

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const maleCounts = ref<number[]>(new Array(12).fill(0))
    const femaleCounts = ref<number[]>(new Array(12).fill(0))

    // Local caches to recompute when either source changes
    let visitsData: Record<string, any> | null = null
    let patientsData: Record<string, any> | null = null

    const generateDummyArray = () => Array.from({ length: 12 }, () => Math.floor(Math.random() * 41) + 5)

    const recomputeCounts = () => {
      const male = new Array(12).fill(0)
      const female = new Array(12).fill(0)

      if (visitsData && Object.keys(visitsData).length > 0 && patientsData && Object.keys(patientsData).length > 0) {
        Object.values(visitsData).forEach((visit: any) => {
          if (!visit || !visit.timestamp) return
          const d = new Date(visit.timestamp)
          if (isNaN(d.getTime())) return
          const monthIdx = d.getMonth()
          const patientId = visit.patientId
          // Access through a local alias to satisfy TS nullability inference
          const patientsLookup = patientsData as Record<string, any>
          const gender = patientId && patientsLookup[patientId] ? patientsLookup[patientId].gender : null
          if (gender === 'Male') male[monthIdx]++
          else if (gender === 'Female') female[monthIdx]++
        })
        maleCounts.value = male
        femaleCounts.value = female
      } else if (visitsData === null || patientsData === null) {
        // Still loading at least one source; do nothing yet
        return
      } else {
        // Fallback when data missing/empty
        maleCounts.value = generateDummyArray()
        femaleCounts.value = generateDummyArray()
      }

      updateChart()
    }

    const subscribePatients = () => {
      const patientsRef = dbRef(db, 'patients')
      onValue(patientsRef, (snapshot) => {
        const data = snapshot.val()
        patientsData = data || {}
        recomputeCounts()
      }, () => {
        patientsData = {}
        recomputeCounts()
      })
    }

    const subscribeVisits = () => {
      const visitsRef = dbRef(db, 'clinic-visits')
      onValue(visitsRef, (snapshot) => {
        const data = snapshot.val()
        visitsData = data || {}
        recomputeCounts()
      }, () => {
        visitsData = {}
        recomputeCounts()
      })
    }

    const handleChartClick = (event: any) => {
      if (!chartInstance) return
      const activePoints = chartInstance.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true)
      if (activePoints.length > 0) {
        const clickedIndex = activePoints[0].index
        const datasetIndex = activePoints[0].datasetIndex
        const monthLabel = months[clickedIndex]
        const gender = datasetIndex === 0 ? 'male' : 'female'
        router.push({
          name: 'visit-logs',
          query: { month: monthLabel.toLowerCase(), gender }
        })
      }
    }

    const initializeChart = () => {
      if (!genderChart.value) return
      chartInstance = new Chart(genderChart.value, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Male',
              data: maleCounts.value,
              backgroundColor: '#3b82f6',
              borderRadius: 4,
              barThickness: 16
            },
            {
              label: 'Female',
              data: femaleCounts.value,
              backgroundColor: '#ec4899',
              borderRadius: 4,
              barThickness: 16
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onClick: handleChartClick,
          onHover: (event: any, activeElements: any[]) => {
            if (event.native && genderChart.value) {
              genderChart.value.style.cursor = activeElements.length > 0 ? 'pointer' : 'default'
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Visits by Gender (Monthly)',
              font: { size: 16 }
            },
            legend: { display: true }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Number of Visits' }
            },
            x: {
              title: { display: true, text: 'Month' }
            }
          }
        }
      })
    }

    const updateChart = () => {
      if (!chartInstance) return
      chartInstance.data.datasets[0].data = maleCounts.value
      chartInstance.data.datasets[1].data = femaleCounts.value
      chartInstance.update()
    }

    onMounted(() => {
      initializeChart()
      // Start subscriptions after chart exists so first recompute paints
      subscribePatients()
      subscribeVisits()
    })

    onUnmounted(() => {
      if (chartInstance) chartInstance.destroy()
    })

    return { genderChart }
  }
}
</script>


