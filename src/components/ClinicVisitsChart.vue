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

    const initializeVisitsChart = () => {
      if (visitsChart.value) {
        chartInstance = new Chart(visitsChart.value, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
              label: 'Number of Visits',
              data: [65, 59, 80, 81, 56, 55, 40, 45, 70, 75, 85, 90],
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