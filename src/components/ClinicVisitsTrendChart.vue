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

    const initializeTrendChart = () => {
      if (trendChart.value) {
        chartInstance = new Chart(trendChart.value, {
          type: 'line',
          data: {
            labels: [
              'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
              'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'
            ],
            datasets: [{
              label: 'Clinic Visits',
              data: [45, 52, 48, 55, 42, 38, 45, 50, 55, 60, 58, 52],
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