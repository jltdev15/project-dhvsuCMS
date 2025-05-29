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
import { getDatabase, ref as dbRef, onValue, off } from 'firebase/database'
import { app } from '../firebase'
import Chart from 'chart.js/auto'

export default {
  name: 'MedicationInventoryChart',
  setup() {
    const db = getDatabase(app)
    const inventoryChart = ref<HTMLCanvasElement | null>(null)
    let chartInstance: Chart | null = null
    const medicinesRef = dbRef(db, 'medicines')

    const updateChart = (medicineData: any[]) => {
      // Extract medicine names and quantities for the chart
      const labels = medicineData.map(med => med.name)
      const quantities = medicineData.map(med => med.quantity)
      
      // Generate background colors based on stock levels
      const backgroundColors = quantities.map(quantity => {
        if (quantity >= 100) return '#4CAF50' // Green for good stock
        else if (quantity >= 50) return '#FFC107' // Yellow for moderate
        else return '#F44336' // Red for low stock
      })

      if (chartInstance) {
        chartInstance.destroy()
      }

      if (inventoryChart.value) {
        chartInstance = new Chart(inventoryChart.value, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Current Stock',
              data: quantities,
              backgroundColor: backgroundColors,
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

    const fetchMedicineData = () => {
      onValue(medicinesRef, (snapshot) => {
        const data = snapshot.val()
        const medicineData = []
        
        // Convert Firebase object to array of medicines
        if (data) {
          for (const key in data) {
            medicineData.push({
              id: key,
              ...data[key]
            })
          }
        }
        
        updateChart(medicineData)
      })
    }

    onMounted(() => {
      fetchMedicineData()
    })

    onUnmounted(() => {
      // Clean up Firebase listeners
      off(medicinesRef)
      
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