<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-lg font-semibold text-gray-700 mb-2">Clinic Visits Trend</h3>
    <div class="h-[300px]">
      <canvas ref="trendChart"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'
import { app } from '../firebase'
import Chart from 'chart.js/auto'

export default {
  name: 'ClinicVisitsTrendChart',
  setup() {
    const db = getDatabase(app)
    const trendChart = ref<HTMLCanvasElement | null>(null)
    let chartInstance: Chart | null = null
    const visitsData = ref<number[]>([])
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    const generateDummyData = () => {
      // Generate a realistic trend pattern for clinic visits
      // Base numbers with some seasonal variation and random fluctuation
      const baseNumbers = [
        25,  // Jan (Start of new semester)
        40,  // Feb (Peak)
        45,  // Mar (Peak)
        40,  // Apr
        35,  // May
        30,  // Jun (End of semester)
        25,  // Jul (Summer break)
        35,  // Aug (Start of semester)
        45,  // Sep (Peak)
        40,  // Oct
        35,  // Nov
        30   // Dec (Holiday break)
      ]

      // Add some random variation (±5) to make it look more natural
      return baseNumbers.map(num => {
        const variation = Math.floor(Math.random() * 11) - 5 // Random number between -5 and +5
        return Math.max(0, num + variation) // Ensure we don't get negative numbers
      })
    }

    const fetchClinicVisitsData = () => {
      const visitsRef = dbRef(db, 'clinic-visits')
      onValue(visitsRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          // Process the data to get monthly counts
          // Chart labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          // Array indices:  [0,    1,    2,    3,    4,    5,    6,    7,    8,    9,    10,   11]
          // JS month indices: Jan=0, Feb=1, Mar=2, Apr=3, May=4, Jun=5, Jul=6, Aug=7, Sep=8, Oct=9, Nov=10, Dec=11
          const monthlyCounts = new Array(12).fill(0)
          Object.values(data).forEach((visit: any) => {
            const visitDate = new Date(visit.timestamp)
            const monthIndex = visitDate.getMonth() // 0-11 (Jan=0, Dec=11)
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
        console.error('Error fetching clinic visits data:', error)
        visitsData.value = generateDummyData()
        updateChart()
      })
    }

    const updateChart = () => {
      if (chartInstance && trendChart.value) {
        chartInstance.data.datasets[0].data = visitsData.value
        chartInstance.update()
      }
    }

    const initializeTrendChart = () => {
      if (trendChart.value) {
        chartInstance = new Chart(trendChart.value, {
          type: 'line',
          data: {
            labels: months,
            datasets: [{
              label: 'Clinic Visits',
              data: visitsData.value,
              borderColor: '#4F46E5',
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#4F46E5',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Monthly Clinic Visits Trend',
                font: {
                  size: 16
                }
              },
              legend: {
                display: false
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                  size: 14
                },
                bodyFont: {
                  size: 13
                },
                callbacks: {
                  label: function(context) {
                    return `Visits: ${context.raw}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                  stepSize: 10
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            },
            interaction: {
              mode: 'nearest',
              axis: 'x',
              intersect: false
            }
          }
        })
      }
    }

    onMounted(() => {
      initializeTrendChart()
      fetchClinicVisitsData()
    })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    })

    return {
      trendChart
    }
  }
}
</script> 