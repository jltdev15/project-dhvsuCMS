<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const route = useRoute();

const currentUser = computed(() => authStore.getCurrentUser());
const displayName = computed(() => currentUser.value?.displayName || currentUser.value?.email || 'User');

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
    <aside class="w-[260px] bg-[#800000] text-white flex flex-col shadow-lg">
      <div class="flex flex-col items-center border-b border-[#FFB81C]/30 py-6">
        <div class="text-2xl font-bold text-[#FFB81C] tracking-wider">DHVSU</div>
      </div>
      <nav class="flex-1 mt-6 px-3">
        <div class="text-xs uppercase text-[#FFB81C]/70 font-semibold tracking-wider px-4 mb-2">Main Menu</div>
        <ul class="space-y-1.5">
          <li>
            <router-link to="/" 
              class="flex items-center px-4 py-2.5 rounded-lg text-white hover:bg-[#FFB81C]/10 transition-all sidebar-link"
              :class="{ 'bg-[#FFB81C] text-[#800000] font-semibold shadow-md': route.path === '/' }">
              <span class="material-icons text-[22px] mr-3">dashboard</span> 
              <span>Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/patients" 
              class="flex items-center px-4 py-2.5 rounded-lg text-white hover:bg-[#FFB81C]/10 transition-all sidebar-link"
              :class="{ 'bg-[#FFB81C] text-[#800000] font-semibold shadow-md': route.path.includes('/patient') }">
              <span class="material-icons text-[22px] mr-3">person</span> 
              <span>Patients</span>
            </router-link>
          </li>
          <li>
            <router-link to="/medicines" 
              class="flex items-center px-4 py-2.5 rounded-lg text-white hover:bg-[#FFB81C]/10 transition-all sidebar-link"
              :class="{ 'bg-[#FFB81C] text-[#800000] font-semibold shadow-md': route.path.includes('/medicine') }">
              <span class="material-icons text-[22px] mr-3">medication</span> 
              <span>Medicines</span>
            </router-link>
          </li>
          <li>
            <router-link to="/reports" 
              class="flex items-center px-4 py-2.5 rounded-lg text-white hover:bg-[#FFB81C]/10 transition-all sidebar-link"
              :class="{ 'bg-[#FFB81C] text-[#800000] font-semibold shadow-md': route.path.includes('/report') }">
              <span class="material-icons text-[22px] mr-3">edit</span> 
              <span>Reports</span>
            </router-link>
          </li>
        </ul>
        
        <div class="text-xs uppercase text-[#FFB81C]/70 font-semibold tracking-wider px-4 mb-2 mt-6">Administration</div>
        <ul class="space-y-1.5">
          <li>
            <router-link to="/users" 
              class="flex items-center px-4 py-2.5 rounded-lg text-white hover:bg-[#FFB81C]/10 transition-all sidebar-link"
              :class="{ 'bg-[#FFB81C] text-[#800000] font-semibold shadow-md': route.path === '/users' }">
              <span class="material-icons text-[22px] mr-3">group</span> 
              <span>Users</span>
            </router-link>
          </li>
          <li class="mt-6">
            <span @click="handleLogout" 
              class="flex items-center px-4 py-2.5 rounded-lg text-white hover:bg-red-500/20 transition-all cursor-pointer border border-red-400/30">
              <span class="material-icons text-[22px] mr-3">logout</span> 
              <span>Logout</span>
            </span>
          </li>
        </ul>
      </nav>
      <div class="p-4 text-xs text-[#FFB81C]/50 mt-auto text-center">
        Clinic Management System v1.0
      </div>
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
