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

export default {
  name: 'MedicationExpiryChart',
  setup() {
    const db = getDatabase(app)
    const expiryChart = ref<HTMLCanvasElement | null>(null)
    let chartInstance: Chart | null = null

    const initializeExpiryChart = () => {
      if (expiryChart.value) {
        chartInstance = new Chart(expiryChart.value, {
          type: 'pie',
          data: {
            labels: [
              'Expiring in 1 Month',
              'Expiring in 2 Months',
              'Expiring in 3 Months',
              'Safe Stock'
            ],
            datasets: [{
              data: [15, 25, 30, 130],
              backgroundColor: [
                '#F44336', // Red for immediate expiry
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
            plugins: {
              title: {
                display: true,
                text: 'Medication Stock by Expiry Timeline',
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
                    return `${label}: ${value} units (${percentage}%)`;
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