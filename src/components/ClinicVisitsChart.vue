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

export default {
  name: 'ClinicVisitsChart',
  setup() {
    const db = getDatabase(app)
    const visitsChart = ref<HTMLCanvasElement | null>(null)
    let chartInstance: Chart | null = null
    const visitsData = ref<number[]>([])
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
          updateChart()
        }
      })
    }

    const updateChart = () => {
      if (chartInstance && visitsChart.value) {
        chartInstance.data.datasets[0].data = visitsData.value
        chartInstance.update()
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