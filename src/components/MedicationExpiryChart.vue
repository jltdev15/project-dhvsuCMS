<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-lg font-semibold text-gray-700 mb-2">Medications Nearing Expiry</h3>
    <div class="h-[300px]">
      <canvas ref="expiryChart"></canvas>
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
  name: 'MedicationExpiryChart',
  setup() {
    const db = getDatabase(app)
    const router = useRouter()
    const expiryChart = ref<HTMLCanvasElement | null>(null)
    let chartInstance: Chart | null = null
    const expiryData = ref<number[]>([])
    const expiryLabels = [
      'Expired',
      'Expiring in 1 Month',
      'Expiring in 2 Months',
      'Expiring in 3 Months',
      'Safe Stock'
    ]

    const generateDummyData = () => {
      // Generate random numbers between 5 and 50 for each expiry category
      // Make expiring soon categories have higher numbers to simulate urgency
      return [
        Math.floor(Math.random() * 16) + 5,  // Expired (5-20)
        Math.floor(Math.random() * 46) + 5,  // Expiring in 1 month (5-50)
        Math.floor(Math.random() * 41) + 10, // Expiring in 2 months (10-50)
        Math.floor(Math.random() * 36) + 15, // Expiring in 3 months (15-50)
        Math.floor(Math.random() * 31) + 20  // Safe stock (20-50)
      ]
    }

    const fetchExpiryData = () => {
      const medicationsRef = dbRef(db, 'medicines')
      onValue(medicationsRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          // Initialize counts for each expiry category (now 5 categories including expired)
          const expiryCounts = new Array(5).fill(0)
          const now = new Date()
          const oneMonthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
          const twoMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate())
          const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate())
          
          // Debug: Log current date and sample medication data
          console.log('Current date:', now.toISOString())
          console.log('Sample medication data:', Object.values(data)[0])
          
          // Count medications by expiry date
          Object.values(data).forEach((medication: any) => {
            // Check for different possible field names for expiry date
            const expiryDateString = medication.expirationDate || medication.expiryDate || medication.expiry
            const quantity = medication.quantity || 1

            if (!expiryDateString) {
              // If no expiry date, consider it safe stock
              expiryCounts[4] += quantity
              return
            }

            // Debug: Log expiry date processing
            console.log('Processing medication:', medication.name, 'Expiry:', expiryDateString)

            // Parse the expiry date - handle different formats
            let expiryDate: Date
            if (expiryDateString.includes('-') && !expiryDateString.includes('T')) {
              // Format like "2024-12" - add day to make it first of month
              expiryDate = new Date(expiryDateString + '-01')
            } else {
              // Try parsing as is
              expiryDate = new Date(expiryDateString)
            }

            // Check if date is valid
            if (isNaN(expiryDate.getTime())) {
              // Invalid date, consider it safe stock
              expiryCounts[4] += quantity
              return
            }

            if (expiryDate <= now) {
              expiryCounts[0] += quantity // Expired
            } else if (expiryDate <= oneMonthFromNow) {
              expiryCounts[1] += quantity // Expiring in 1 month
            } else if (expiryDate <= twoMonthsFromNow) {
              expiryCounts[2] += quantity // Expiring in 2 months
            } else if (expiryDate <= threeMonthsFromNow) {
              expiryCounts[3] += quantity // Expiring in 3 months
            } else {
              expiryCounts[4] += quantity // Safe stock
            }
          })
          
          // Debug: Log final counts
          console.log('Expiry counts:', expiryCounts)
          console.log('Categories:', ['Expired', '1 Month', '2 Months', '3 Months', 'Safe Stock'])
          
          expiryData.value = expiryCounts
        } else {
          // Use dummy data if no Firebase data is available
          expiryData.value = generateDummyData()
        }
        updateChart()
      }, (error) => {
        // Use dummy data if there's an error fetching from Firebase
        console.error('Error fetching expiry data:', error)
        expiryData.value = generateDummyData()
        updateChart()
      })
    }

    const updateChart = () => {
      if (chartInstance && expiryChart.value) {
        chartInstance.data.datasets[0].data = expiryData.value
        chartInstance.update()
      }
    }

    const handleChartClick = (event: any) => {
      if (chartInstance) {
        const activePoints = chartInstance.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true)
        if (activePoints.length > 0) {
          const clickedIndex = activePoints[0].index
          const category = expiryLabels[clickedIndex]
          
          // Navigate to medicine view with filter parameter
          router.push({
            name: 'medicines',
            query: { filter: category.toLowerCase().replace(/\s+/g, '-') }
          })
        }
      }
    }

    const initializeExpiryChart = () => {
      if (expiryChart.value) {
        chartInstance = new Chart(expiryChart.value, {
          type: 'pie',
          data: {
            labels: expiryLabels,
            datasets: [{
              data: expiryData.value,
              backgroundColor: [
                '#8B0000', // Dark maroon for expired
                '#FF1744', // Bright red for expiring in 1 month
                '#FF9800', // Orange for 2 months
                '#FFC107', // Yellow for 3 months
                '#4CAF50'  // Green for safe
              ],
              borderWidth: 2,
              borderColor: '#fff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: handleChartClick,
            onHover: (event: any, activeElements: any[]) => {
              if (event.native && expiryChart.value) {
                expiryChart.value.style.cursor = activeElements.length > 0 ? 'pointer' : 'default'
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'Medication Stock by Expiry Timeline (Click to filter)',
                font: {
                  size: 16
                }
              },
              legend: {
                position: 'right',
                labels: {
                  padding: 20,
                  font: {
                    size: 12
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw as number;
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} units (${percentage}%) - Click to view details`;
                  }
                }
              }
            }
          }
        })
      }
    }

    onMounted(() => {
      initializeExpiryChart()
      fetchExpiryData()
    })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    })

    return {
      expiryChart
    }
  }
}
</script> 