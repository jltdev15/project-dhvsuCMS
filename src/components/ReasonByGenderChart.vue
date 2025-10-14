<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-lg font-semibold text-gray-700 mb-2">Top Visit Reasons by Gender</h3>
    <div class="mb-3 flex items-center gap-2">
      <label class="text-sm text-gray-600">Month:</label>
      <select v-model="selectedMonth" class="border rounded px-2 py-1 text-sm">
        <option value="All">All Months</option>
        <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
      </select>
    </div>
    <div class="h-[300px]">
      <canvas ref="reasonChart"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'
import { app } from '../firebase'
import Chart from 'chart.js/auto'
import { useRouter } from 'vue-router'

export default {
  name: 'ReasonByGenderChart',
  setup() {
    const db = getDatabase(app)
    const router = useRouter()
    const reasonChart = ref<HTMLCanvasElement | null>(null)
    let chartInstance: Chart | null = null

    // Local caches so we can recompute when either source changes
    let visitsData: Record<string, any> | null = null
    let patientsData: Record<string, any> | null = null

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const selectedMonth = ref<string>('All')

    const reasonLabels = ref<string[]>([])
    const maleCounts = ref<number[]>([])
    const femaleCounts = ref<number[]>([])

    const TOP_N = 10

    const generateDummy = () => {
      const labels = ['Headache', 'Fever', 'Cough', 'Stomachache', 'Injury', 'Allergy']
      const male = labels.map(() => Math.floor(Math.random() * 20) + 3)
      const female = labels.map(() => Math.floor(Math.random() * 20) + 3)
      return { labels, male, female }
    }

    const recompute = () => {
      const counts: Record<string, { Male: number; Female: number }> = {}

      if (visitsData && patientsData && Object.keys(visitsData).length > 0 && Object.keys(patientsData).length > 0) {
        Object.values(visitsData).forEach((v: any) => {
          if (!v) return
          // Filter by selected month if set
          if (selectedMonth.value !== 'All') {
            const ts = v.timestamp
            const d = ts ? new Date(ts) : null
            if (!d || isNaN(d.getTime())) return
            const monthIdx = d.getMonth()
            if (months[monthIdx] !== selectedMonth.value) return
          }
          const patientId = v.patientId
          // Use a local alias to help TS with nullability and indexing
          const patientsLookup = patientsData as Record<string, any>
          const gender = patientId && patientsLookup[patientId] ? patientsLookup[patientId].gender : undefined
          if (gender !== 'Male' && gender !== 'Female') return
          const r = (v.reason || '').toString().trim() || 'Unknown'
          if (!counts[r]) counts[r] = { Male: 0, Female: 0 }
          counts[r][gender as 'Male' | 'Female']++
        })

        // Sort reasons by total desc and take top N
        const entries = Object.entries(counts)
          .map(([reason, g]) => ({ reason, male: g.Male, female: g.Female, total: g.Male + g.Female }))
          .sort((a, b) => b.total - a.total)
          .slice(0, TOP_N)

        reasonLabels.value = entries.map(e => e.reason)
        maleCounts.value = entries.map(e => e.male)
        femaleCounts.value = entries.map(e => e.female)
      } else if (visitsData === null || patientsData === null) {
        // still loading at least one
        return
      } else {
        const d = generateDummy()
        reasonLabels.value = d.labels
        maleCounts.value = d.male
        femaleCounts.value = d.female
      }

      updateChart()
    }

    const subscribePatients = () => {
      const patientsRef = dbRef(db, 'patients')
      onValue(patientsRef, (snapshot) => {
        patientsData = snapshot.val() || {}
        recompute()
      }, () => {
        patientsData = {}
        recompute()
      })
    }

    const subscribeVisits = () => {
      const visitsRef = dbRef(db, 'clinic-visits')
      onValue(visitsRef, (snapshot) => {
        visitsData = snapshot.val() || {}
        recompute()
      }, () => {
        visitsData = {}
        recompute()
      })
    }

    const handleChartClick = (event: any) => {
      if (!chartInstance) return
      const active = chartInstance.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true)
      if (!active.length) return
      const idx = active[0].index
      const label = reasonLabels.value[idx]
      if (!label) return
      router.push({ name: 'visit-logs', query: { reason: label } })
    }

    const initChart = () => {
      if (!reasonChart.value) return
      chartInstance = new Chart(reasonChart.value, {
        type: 'bar',
        data: {
          labels: reasonLabels.value,
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
          plugins: {
            title: {
              display: true,
              text: 'Top Visit Reasons by Gender',
              font: { size: 16 }
            },
            legend: { display: true },
            tooltip: {
              callbacks: {
                title: (items: any[]) => {
                  return items?.[0]?.label || ''
                },
                label: (ctx: any) => {
                  const value = ctx.raw as number
                  return `${ctx.dataset.label}: ${value}`
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Number of Visits' }
            },
            x: {
              title: { display: true, text: 'Reason' }
            }
          }
        }
      })
    }

    const updateChart = () => {
      if (!chartInstance) return
      chartInstance.data.labels = reasonLabels.value
      chartInstance.data.datasets[0].data = maleCounts.value
      chartInstance.data.datasets[1].data = femaleCounts.value
      chartInstance.update()
    }

    onMounted(() => {
      // Initialize selected month from route if provided
      const q = router.currentRoute.value.query
      const qMonth = typeof q.month === 'string' ? q.month : Array.isArray(q.month) ? q.month[0] : undefined
      const normalized = qMonth ? qMonth.slice(0, 3).toUpperCase() : undefined
      const found = months.find(m => m.toUpperCase() === normalized)
      if (found) selectedMonth.value = found

      initChart()
      subscribePatients()
      subscribeVisits()
    })

    // Recompute when month changes and sync to route query
    watch(selectedMonth, () => {
      recompute()
      const route = router.currentRoute.value
      const currentQueryMonth = typeof route.query.month === 'string'
        ? route.query.month
        : Array.isArray(route.query.month)
          ? route.query.month[0]
          : undefined
      const desiredQueryMonth = selectedMonth.value === 'All'
        ? undefined
        : selectedMonth.value.slice(0, 3).toLowerCase()

      if ((currentQueryMonth || undefined) === desiredQueryMonth) return

      const newQuery: Record<string, any> = { ...route.query }
      if (desiredQueryMonth) newQuery.month = desiredQueryMonth
      else delete newQuery.month
      router.replace({ query: newQuery })
    })

    onUnmounted(() => {
      if (chartInstance) chartInstance.destroy()
    })

    return { reasonChart, months, selectedMonth }
  }
}
</script>


