<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const patientsOpen = ref(false);
const medicinesOpen = ref(false);
const reportsOpen = ref(false);
const route = useRoute();

const currentUser = computed(() => authStore.getCurrentUser());
const displayName = computed(() => currentUser.value?.displayName || currentUser.value?.email || 'User');

const isNewPrescriptionActive = computed(() => route.path === '/new-prescription');
const isAddPatientActive = computed(() => route.path === '/add-patient');
const isPatientHistoryActive = computed(() => route.path === '/patient-history');
const isAddMedicineActive = computed(() => route.path === '/add-medicine');
const isMedicineDetailsActive = computed(() => route.path === '/medicine-details');
const isReportsActive = computed(() => route.path === '/reports');
const isMedicinesMenuActive = computed(() => isAddMedicineActive.value || isMedicineDetailsActive.value);
const isPatientsMenuActive = computed(() => isNewPrescriptionActive.value || isAddPatientActive.value || isPatientHistoryActive.value);
const isReportsMenuActive = computed(() => isReportsActive.value);

const handleLogout = async () => {
  try {
    await authStore.signOut();
    router.push('/login');
  } catch (error) {
    console.error('Failed to sign out:', error);
  }
};
</script>

<template>
  <div class="flex h-screen bg-[#454c53]">
    <!-- Sidebar -->
    <aside class="w-[250px] bg-[#800000] text-white flex flex-col">
      <div class="flex flex-col items-center border-b border-[#FFB81C] py-5">
        <div class="text-2xl font-bold text-[#FFB81C] tracking-wider">DHVSU</div>
        <div class="flex items-center mt-2">
          <div class="text-4xl mr-2 text-[#FFB81C]">
            <span class="material-icons">{{ currentUser?.photoURL ? 'account_circle' : 'account_circle' }}</span>
          </div>
          <div class="text-base text-[#FFB81C]">{{ displayName }}</div>
        </div>
      </div>
      <nav class="flex-1 mt-5">
        <ul class="space-y-1">
          <li>
            <router-link to="/" class="flex items-center px-8 py-3 rounded-md text-white hover:bg-[#FFB81C] hover:text-[#800000] transition-all sidebar-link"
              :class="{ 'bg-[#FFB81C] text-[#800000] font-semibold': route.path === '/' }">
              <span class="material-icons mr-4"  >dashboard</span> Dashboard
            </router-link>
          </li>
          <li @click="patientsOpen = !patientsOpen"
            :class="[{'bg-[#FFB81C] text-[#800000] font-semibold': isPatientsMenuActive, 'hover:bg-[#FFB81C] hover:text-[#800000]': patientsOpen && !isPatientsMenuActive}, 'rounded-md mx-2 transition-all cursor-pointer flex items-center px-8 py-3']">
            <span class="material-icons mr-4" :class="{ 'text-[#800000]': isPatientsMenuActive }">person</span> Patients
            <span class="material-icons ml-auto" :class="{ 'text-[#800000]': isPatientsMenuActive }">{{ patientsOpen ? 'expand_less' : 'expand_more' }}</span>
          </li>
          <transition name="submenu">
            <ul v-if="patientsOpen || isPatientsMenuActive" class="flex flex-col ml-8">
              <li>
                <router-link to="/new-prescription"
                  class="flex items-center w-full px-4 py-2 rounded-md transition-all submenu-link"
                  :class="isNewPrescriptionActive ? 'bg-[#FFB81C] text-[#800000] font-semibold' : 'text-white hover:text-[#800000] hover:bg-[#FFB81C]'">
                  <span class="material-icons submenu-icon mr-3"
                    :class="isNewPrescriptionActive ? 'text-[#800000]' : ''">radio_button_unchecked</span>
                  New Prescription
                </router-link>
              </li>
              <li>
                <router-link to="/add-patient"
                  class="flex items-center w-full px-4 py-2 rounded-md transition-all submenu-link"
                  :class="isAddPatientActive ? 'bg-[#FFB81C] text-[#800000] font-semibold' : 'text-white hover:text-[#800000] hover:bg-[#FFB81C]'">
                  <span class="material-icons submenu-icon mr-3"
                    :class="isAddPatientActive ? 'text-[#800000]' : ''">radio_button_unchecked</span>
                  Add Patients
                </router-link>
              </li>
              <li>
                <router-link to="/patient-history"
                  class="flex items-center w-full px-4 py-2 rounded-md transition-all submenu-link"
                  :class="isPatientHistoryActive ? 'bg-[#FFB81C] text-[#800000] font-semibold' : 'text-white hover:text-[#800000] hover:bg-[#FFB81C]'">
                  <span class="material-icons submenu-icon mr-3"
                    :class="isPatientHistoryActive ? 'text-[#800000]' : ''">radio_button_unchecked</span>
                  Patient History
                </router-link>
              </li>
            </ul>
          </transition>
          <li @click="medicinesOpen = !medicinesOpen"
            :class="[{'bg-[#FFB81C] text-[#800000] font-semibold': isMedicinesMenuActive, 'hover:bg-[#FFB81C] hover:text-[#800000]': medicinesOpen && !isMedicinesMenuActive}, 'rounded-md mx-2 transition-all cursor-pointer flex items-center px-8 py-3']">
            <span class="material-icons mr-4" :class="{ 'text-[#800000]': isMedicinesMenuActive }">medication</span> Medicines
            <span class="material-icons ml-auto" :class="{ 'text-[#800000]': isMedicinesMenuActive }">{{ medicinesOpen ? 'expand_less' : 'expand_more' }}</span>
          </li>
          <transition name="submenu">
            <ul v-if="medicinesOpen || isMedicinesMenuActive" class="flex flex-col ml-8">
              <li>
                <router-link to="/add-medicine"
                  class="flex items-center w-full px-4 py-2 rounded-md transition-all submenu-link"
                  :class="isAddMedicineActive ? 'bg-[#FFB81C] text-[#800000] font-semibold' : 'text-white hover:text-[#800000] hover:bg-[#FFB81C]'">
                  <span class="material-icons submenu-icon mr-3"
                    :class="isAddMedicineActive ? 'text-[#800000]' : ''">radio_button_unchecked</span>
                  Add Medicine
                </router-link>
              </li>
              <li>
                <router-link to="/medicine-details"
                  class="flex items-center w-full px-4 py-2 rounded-md transition-all submenu-link"
                  :class="isMedicineDetailsActive ? 'bg-[#FFB81C] text-[#800000] font-semibold' : 'text-white hover:text-[#800000] hover:bg-[#FFB81C]'">
                  <span class="material-icons submenu-icon mr-3"
                    :class="isMedicineDetailsActive ? 'text-[#800000]' : ''">radio_button_unchecked</span>
                  Medicine Details
                </router-link>
              </li>
            </ul>
          </transition>
          <li @click="reportsOpen = !reportsOpen"
            :class="[{'bg-[#FFB81C] text-[#800000] font-semibold': isReportsMenuActive, 'hover:bg-[#FFB81C] hover:text-[#800000]': reportsOpen && !isReportsMenuActive}, 'rounded-md mx-2 transition-all cursor-pointer flex items-center px-8 py-3']">
            <span class="material-icons mr-4" :class="{ 'text-[#800000]': isReportsMenuActive }">edit</span> Reports
            <span class="material-icons ml-auto" :class="{ 'text-[#800000]': isReportsMenuActive }">{{ reportsOpen ? 'expand_less' : 'expand_more' }}</span>
          </li>
          <transition name="submenu">
            <ul v-if="reportsOpen || isReportsMenuActive" class="flex flex-col ml-8">
              <li>
                <router-link to="/reports"
                  class="flex items-center w-full px-4 py-2 rounded-md transition-all submenu-link"
                  :class="isReportsActive ? 'bg-[#FFB81C] text-[#800000] font-semibold' : 'text-white hover:text-[#800000] hover:bg-[#FFB81C]'">
                  <span class="material-icons submenu-icon mr-3"
                    :class="isReportsActive ? 'text-[#800000]' : ''">radio_button_unchecked</span>
                  Reports
                </router-link>
              </li>
            </ul>
          </transition>
          <li>
            <router-link to="/users" class="flex items-center px-8 py-3 rounded-md text-white hover:bg-[#FFB81C] hover:text-[#800000] transition-all sidebar-link"
              :class="{ 'bg-[#FFB81C] text-[#800000] font-semibold': route.path === '/users' }">
              <span class="material-icons mr-4" :class="{ 'text-[#800000]': route.path === '/users' }">group</span> Users
            </router-link>
          </li>
          <li>
            <span @click="handleLogout" class="flex items-center px-8 py-3 rounded-md text-white hover:bg-[#FFB81C] hover:text-[#800000] transition-all cursor-pointer">
              <span class="material-icons mr-4">logout</span> Logout
            </span>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col bg-[#fff]">
      <!-- Top Bar -->
      <header class="flex justify-between items-center bg-[#800000] text-white px-8 h-14 text-lg font-medium">
        <div class="text-[#FFB81C]">Clinic Management System</div>
        <div class="text-base">Welcome {{ displayName }}!</div>
      </header>
      <!-- Child view will be rendered here -->
      <div class="flex-1 overflow-y-auto">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
