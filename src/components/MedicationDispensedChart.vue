<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-lg font-semibold text-gray-700 mb-2">Medications Dispensed by Type</h3>
    <div class="h-[300px]">
      <canvas ref="dispensedChart"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'
import { app } from '../firebase'
import Chart from 'chart.js/auto'

export default {
  name: 'MedicationDispensedChart',
  setup() {
    const db = getDatabase(app)
    const dispensedChart = ref<HTMLCanvasElement | null>(null)
    let chartInstance: Chart | null = null

    const initializeDispensedChart = () => {
      if (dispensedChart.value) {
        chartInstance = new Chart(dispensedChart.value, {
          type: 'doughnut',
          data: {
            labels: [
              'Pain Relievers',
              'Antibiotics',
              'Antihistamines',
              'Antacids',
              'Anti-inflammatory',
              'Other'
            ],
            datasets: [{
              data: [35, 25, 15, 10, 10, 5],
              backgroundColor: [
                '#4CAF50', // Green
                '#2196F3', // Blue
                '#FFC107', // Yellow
                '#9C27B0', // Purple
                '#FF5722', // Orange
                '#607D8B'  // Grey
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
                text: 'Distribution of Medications Dispensed',
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
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            },
            cutout: '60%'
          }
        })
      }
    }

    onMounted(() => {
      initializeDispensedChart()
    })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    })

    return {
      dispensedChart
    }
  }
}
</script> 