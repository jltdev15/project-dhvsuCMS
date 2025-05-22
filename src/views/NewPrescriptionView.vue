<template>
  <section class="p-8">
    <h2 class="text-red-500 mb-4">New Prescription</h2>
    <div class="bg-[#232a2f] rounded-md shadow-md p-6">
      <div class="text-[#cfd8dc] text-xl font-medium mb-4 border-b-2 border-[#3973a5] pb-2">Add New Prescription</div>
      <form class="flex flex-col gap-4">
        <div class="flex gap-4">
          <div class="flex flex-col flex-1 min-w-[120px]">
            <label class="text-[#cfd8dc] text-base font-semibold mb-1.5">Select Patient</label>
            <select class="bg-[#232a2f] border border-[#6fa3d9] rounded text-[#cfd8dc] p-2 text-base outline-none">
              <option>Select Patient</option>
            </select>
          </div>
          <div class="flex flex-col flex-1 min-w-[120px]">
            <label class="text-[#cfd8dc] text-base font-semibold mb-1.5">Visit Date</label>
            <input type="date" class="bg-[#232a2f] border border-[#6fa3d9] rounded text-[#cfd8dc] p-2 text-base outline-none" />
          </div>
          <div class="flex flex-col flex-1 min-w-[120px]">
            <label class="text-[#cfd8dc] text-base font-semibold mb-1.5">Next Visit Date</label>
            <input type="date" class="bg-[#232a2f] border border-[#6fa3d9] rounded text-[#cfd8dc] p-2 text-base outline-none" />
          </div>
        </div>
        <div class="flex gap-4">
          <div class="flex flex-col flex-1 min-w-[120px]">
            <label class="text-[#cfd8dc] text-base font-semibold mb-1.5">BP</label>
            <input type="text" class="bg-[#232a2f] border border-[#6fa3d9] rounded text-[#cfd8dc] p-2 text-base outline-none" />
          </div>
          <div class="flex flex-col flex-1 min-w-[120px]">
            <label class="text-[#cfd8dc] text-base font-semibold mb-1.5">Weight</label>
            <input type="text" class="bg-[#232a2f] border border-[#6fa3d9] rounded text-[#cfd8dc] p-2 text-base outline-none" />
          </div>
          <div class="flex flex-col flex-1 min-w-[120px]">
            <label class="text-[#cfd8dc] text-base font-semibold mb-1.5">Disease</label>
            <input type="text" class="bg-[#232a2f] border border-[#6fa3d9] rounded text-[#cfd8dc] p-2 text-base outline-none" />
          </div>
        </div>
        <div class="flex gap-4">
          <div class="flex flex-col flex-1 min-w-[120px]">
            <label class="text-[#cfd8dc] text-base font-semibold mb-1.5">Select Medicine</label>
            <select class="bg-[#232a2f] border border-[#6fa3d9] rounded text-[#cfd8dc] p-2 text-base outline-none">
              <option>Select Medicine</option>
            </select>
          </div>
          <div class="flex flex-col flex-1 min-w-[120px]">
            <label class="text-[#cfd8dc] text-base font-semibold mb-1.5">Select Packing</label>
            <select class="bg-[#232a2f] border border-[#6fa3d9] rounded text-[#cfd8dc] p-2 text-base outline-none">
              <option></option>
            </select>
          </div>
          <div class="flex flex-col flex-1 min-w-[120px]">
            <label class="text-[#cfd8dc] text-base font-semibold mb-1.5">Quantity</label>
            <input type="text" class="bg-[#232a2f] border border-[#6fa3d9] rounded text-[#cfd8dc] p-2 text-base outline-none" />
          </div>
          <div class="flex flex-col flex-1 min-w-[120px]">
            <label class="text-[#cfd8dc] text-base font-semibold mb-1.5">Dosage</label>
            <input type="text" class="bg-[#232a2f] border border-[#6fa3d9] rounded text-[#cfd8dc] p-2 text-base outline-none" />
          </div>
          <div class="flex items-end min-w-[50px]">
            <button type="button" class="bg-[#3973a5] text-white rounded text-2xl w-[38px] h-[38px] cursor-pointer">+</button>
          </div>
        </div>
        <div class="mt-4">
          <table class="w-full bg-[#232a2f]">
            <thead>
              <tr>
                <th class="bg-[#800000] text-white font-semibold py-2">S.No</th>
                <th class="bg-[#800000] text-white font-semibold py-2">Medicine Name</th>
                <th class="bg-[#800000] text-white font-semibold py-2">Packing</th>
                <th class="bg-[#800000] text-white font-semibold py-2">QTY</th>
                <th class="bg-[#800000] text-white font-semibold py-2">Dosage</th>
                <th class="bg-[#800000] text-white font-semibold py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <!-- Table rows go here -->
            </tbody>
          </table>
        </div>
        <div class="flex justify-end mt-4">
          <button type="submit" class="bg-[#800000] text-white rounded text-lg px-10 py-2.5 cursor-pointer">Save</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
// No logic for now
</script> 