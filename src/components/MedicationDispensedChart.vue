<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-lg font-semibold text-gray-700 mb-2">Medications Dispensed by Medicine</h3>
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
    const medicationData = ref<number[]>([])
    const medicineNames = ref<string[]>([])

    const generateDummyData = () => {
      // Generate dummy medicine names and quantities
      const dummyMedicines = [
        'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Cetirizine', 
        'Omeprazole', 'Aspirin', 'Loratadine', 'Metformin'
      ]
      return {
        names: dummyMedicines,
        quantities: dummyMedicines.map(() => Math.floor(Math.random() * 20) + 5)
      }
    }

    const fetchMedicationData = () => {
      const dispensesRef = dbRef(db, 'dispenses')
      onValue(dispensesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          // Count medicines by name and quantity
          const medicineCounts: { [key: string]: number } = {}
          
          // Process each dispense record
          Object.values(data).forEach((dispense: any) => {
            if (dispense.medicines && Array.isArray(dispense.medicines)) {
              dispense.medicines.forEach((medicine: any) => {
                const medicineName = medicine.medicineName
                const quantity = medicine.quantity || 1
                
                if (medicineCounts[medicineName]) {
                  medicineCounts[medicineName] += quantity
                } else {
                  medicineCounts[medicineName] = quantity
                }
              })
            }
          })
          
          // Convert to arrays for chart
          const names = Object.keys(medicineCounts)
          const quantities = Object.values(medicineCounts)
          
          // Sort by quantity (descending) and limit to top 10 medicines
          const sortedData = names
            .map((name, index) => ({ name, quantity: quantities[index] }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10)
          
          medicineNames.value = sortedData.map(item => item.name)
          medicationData.value = sortedData.map(item => item.quantity)
        } else {
          // Use dummy data if no Firebase data is available
          const dummyData = generateDummyData()
          medicineNames.value = dummyData.names
          medicationData.value = dummyData.quantities
        }
        updateChart()
      }, (error) => {
        // Use dummy data if there's an error fetching from Firebase
        console.error('Error fetching dispense data:', error)
        const dummyData = generateDummyData()
        medicineNames.value = dummyData.names
        medicationData.value = dummyData.quantities
        updateChart()
      })
    }

    const updateChart = () => {
      if (chartInstance && dispensedChart.value) {
        // Generate colors dynamically based on number of medicines
        const generateColors = (count: number) => {
          const baseColors = [
            '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722', 
            '#607D8B', '#E91E63', '#00BCD4', '#8BC34A', '#FF9800',
            '#795548', '#9E9E9E', '#3F51B5', '#009688', '#CDDC39'
          ]
          const colors = []
          for (let i = 0; i < count; i++) {
            colors.push(baseColors[i % baseColors.length])
          }
          return colors
        }

        chartInstance.data.labels = medicineNames.value
        chartInstance.data.datasets[0].data = medicationData.value
        chartInstance.data.datasets[0].backgroundColor = generateColors(medicineNames.value.length)
        chartInstance.update()
      }
    }

    const initializeDispensedChart = () => {
      if (dispensedChart.value) {
        // Generate colors dynamically based on number of medicines
        const generateColors = (count: number) => {
          const baseColors = [
            '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722', 
            '#607D8B', '#E91E63', '#00BCD4', '#8BC34A', '#FF9800',
            '#795548', '#9E9E9E', '#3F51B5', '#009688', '#CDDC39'
          ]
          const colors = []
          for (let i = 0; i < count; i++) {
            colors.push(baseColors[i % baseColors.length])
          }
          return colors
        }

        chartInstance = new Chart(dispensedChart.value, {
          type: 'doughnut',
          data: {
            labels: medicineNames.value,
            datasets: [{
              data: medicationData.value,
              backgroundColor: generateColors(medicineNames.value.length),
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
                text: 'Top Medicines Dispensed',
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
            },
            cutout: '60%'
          }
        })
      }
    }

    onMounted(() => {
      initializeDispensedChart()
      fetchMedicationData()
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