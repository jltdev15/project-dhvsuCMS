<template>
  <section class="p-8">
    <h2 class="text-3xl text-gray-200 mb-6 font-semibold">Reports</h2>
    <div class="bg-[#232a2f] rounded-md shadow-md mb-8 p-6 border-t-4 border-[#3973a5]">
      <div class="text-lg text-gray-200 font-semibold mb-4">Patient Visits Between Two Dates</div>
      <form class="flex flex-col md:flex-row gap-4 items-center mb-2">
        <div class="flex-1 w-full">
          <label class="block text-gray-200 font-semibold mb-1">From</label>
          <input class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" type="date" />
        </div>
        <div class="flex-1 w-full">
          <label class="block text-gray-200 font-semibold mb-1">To</label>
          <input class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" type="date" />
        </div>
        <button type="button" class="bg-[#3973a5] text-white px-8 py-2 rounded mt-6 md:mt-0">Generate PDF</button>
      </form>
    </div>
    <div class="bg-[#232a2f] rounded-md shadow-md p-6 border-t-4 border-[#3973a5]">
      <div class="text-lg text-gray-200 font-semibold mb-4">Disease Based Report Between Two Dates</div>
      <form class="flex flex-col md:flex-row gap-4 items-center mb-2">
        <div class="flex-1 w-full">
          <label class="block text-gray-200 font-semibold mb-1">Disease</label>
          <input class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" type="text" />
        </div>
        <div class="flex-1 w-full">
          <label class="block text-gray-200 font-semibold mb-1">From</label>
          <input class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" type="date" />
        </div>
        <div class="flex-1 w-full">
          <label class="block text-gray-200 font-semibold mb-1">To</label>
          <input class="w-full bg-[#232a2f] border border-[#6fa3d9] rounded px-3 py-2 text-gray-200" type="date" />
        </div>
        <button type="button" class="bg-[#3973a5] text-white px-8 py-2 rounded mt-6 md:mt-0">Generate PDF</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
// No logic for now
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style> 