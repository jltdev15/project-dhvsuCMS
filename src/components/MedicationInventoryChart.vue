<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-lg font-semibold text-gray-700 mb-2">Medication Inventory Levels</h3>
    <div class="h-[300px]">
      <canvas ref="inventoryChart"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'
import { app } from '../firebase'
import Chart from 'chart.js/auto'

export default {
  name: 'MedicationInventoryChart',
  setup() {
    const db = getDatabase(app)
    const inventoryChart = ref<HTMLCanvasElement | null>(null)
    let chartInstance: Chart | null = null

    const initializeInventoryChart = () => {
      if (inventoryChart.value) {
        chartInstance = new Chart(inventoryChart.value, {
          type: 'bar',
          data: {
            labels: ['Paracetamol', 'Amoxicillin', 'Omeprazole', 'Cetirizine', 'Ibuprofen', 'Metformin'],
            datasets: [{
              label: 'Current Stock',
              data: [150, 80, 45, 120, 90, 60],
              backgroundColor: [
                '#4CAF50', // Green for good stock
                '#FFC107', // Yellow for moderate
                '#F44336', // Red for low
                '#4CAF50',
                '#FFC107',
                '#F44336'
              ],
              borderRadius: 4,
              barThickness: 30
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Current Medication Stock Levels',
                font: {
                  size: 16
                }
              },
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.raw as number;
                    let status = '';
                    if (value >= 100) status = 'Good Stock';
                    else if (value >= 50) status = 'Moderate';
                    else status = 'Low Stock';
                    return `Quantity: ${value} (${status})`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Quantity in Stock'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Medication'
                }
              }
            }
          }
        })
      }
    }

    onMounted(() => {
      initializeInventoryChart()
    })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    })

    return {
      inventoryChart
    }
  }
}
</script> 