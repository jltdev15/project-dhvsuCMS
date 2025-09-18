<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-lg font-semibold text-gray-700 mb-2">Monthly Clinic Visits</h3>
    <div class="h-[300px]">
      <canvas ref="visitsChart"></canvas>
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
  name: 'ClinicVisitsChart',
  setup() {
    const db = getDatabase(app)
    const router = useRouter()
    const visitsChart = ref<HTMLCanvasElement | null>(null)
    let chartInstance: Chart | null = null
    const visitsData = ref<number[]>([])
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const generateDummyData = () => {
      // Generate random numbers between 10 and 50 for each month
      return Array.from({ length: 12 }, () => Math.floor(Math.random() * 41) + 10)
    }

    const fetchVisitsData = () => {
      const visitsRef = dbRef(db, 'clinic-visits')
      onValue(visitsRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          // Initialize monthly counts
          const monthlyCounts = new Array(12).fill(0)
          
          // Count visits by month
          Object.values(data).forEach((visit: any) => {
            const visitDate = new Date(visit.timestamp)
            const monthIndex = visitDate.getMonth()
            monthlyCounts[monthIndex]++
          })
          
          visitsData.value = monthlyCounts
        } else {
          // Use dummy data if no Firebase data is available
          visitsData.value = generateDummyData()
        }
        updateChart()
      }, (error) => {
        // Use dummy data if there's an error fetching from Firebase
        console.error('Error fetching visits data:', error)
        visitsData.value = generateDummyData()
        updateChart()
      })
    }

    const updateChart = () => {
      if (chartInstance && visitsChart.value) {
        chartInstance.data.datasets[0].data = visitsData.value
        chartInstance.update()
      }
    }

    const handleChartClick = (event: any) => {
      if (chartInstance) {
        const activePoints = chartInstance.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true)
        if (activePoints.length > 0) {
          const clickedIndex = activePoints[0].index
          const monthLabel = months[clickedIndex]
          router.push({
            name: 'visit-logs',
            query: { month: monthLabel.toLowerCase() }
          })
        }
      }
    }

    const initializeVisitsChart = () => {
      if (visitsChart.value) {
        chartInstance = new Chart(visitsChart.value, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [{
              label: 'Number of Visits',
              data: visitsData.value,
              backgroundColor: '#4a90e2',
              borderRadius: 4,
              barThickness: 20
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: handleChartClick,
            onHover: (event: any, activeElements: any[]) => {
              if (event.native && visitsChart.value) {
                visitsChart.value.style.cursor = activeElements.length > 0 ? 'pointer' : 'default'
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'Student Clinic Visits by Month',
                font: {
                  size: 16
                }
              },
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Visits'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Month'
                }
              }
            }
          }
        })
      }
    }

    onMounted(() => {
      initializeVisitsChart()
      fetchVisitsData()
    })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    })

    return {
      visitsChart
    }
  }
}
</script> 