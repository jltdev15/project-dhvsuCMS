<template>
  <section class="p-8">
    <h2 class="text-3xl text-gray-900 mb-6 font-semibold">Users</h2>
    <div class="bg-white rounded-md shadow mb-8 p-6 border-t-4 border-[#FFB81C]">
      <div class="text-lg text-gray-900 font-semibold mb-4">Add User</div>
      <form class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-2">
        <div>
          <label class="block text-gray-700 font-semibold mb-1">Display Name</label>
          <input class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000]" type="text" />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-1">Username</label>
          <input class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000]" type="text" value="admin" />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-1">Password</label>
          <input class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000]" type="password" value="......." />
        </div>
        <div class="md:col-span-2">
          <label class="block text-gray-700 font-semibold mb-1">Picture</label>
          <input type="file" class="block w-full text-gray-700" />
        </div>
        <div class="flex items-end">
          <button type="submit" class="bg-[#800000] hover:bg-[#660000] text-white px-8 py-2 rounded-md transition-colors">Save</button>
        </div>
      </form>
    </div>
    <div class="bg-white rounded-md shadow p-6 border-t-4 border-[#800000]">
      <div class="text-lg text-gray-900 font-semibold mb-4">All Users</div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm text-gray-700">
          <thead>
            <tr class="bg-[#800000] text-white">
              <th class="px-3 py-2 text-left">S.No</th>
              <th class="px-3 py-2 text-left">Picture</th>
              <th class="px-3 py-2 text-left">Display Name</th>
              <th class="px-3 py-2 text-left">Username</th>
              <th class="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-200 hover:bg-gray-50">
              <td class="px-3 py-2">1</td>
              <td class="px-3 py-2"><img src="https://randomuser.me/api/portraits/men/1.jpg" class="w-10 h-10 rounded-full object-cover" /></td>
              <td class="px-3 py-2">Administrator</td>
              <td class="px-3 py-2">admin</td>
              <td class="px-3 py-2">
                <button class="bg-[#FFB81C] text-[#800000] rounded p-1 hover:opacity-90 transition"><span class="material-icons text-base">edit</span></button>
              </td>
            </tr>
            <tr class="border-b border-gray-200 hover:bg-gray-50">
              <td class="px-3 py-2">2</td>
              <td class="px-3 py-2"><img src="https://randomuser.me/api/portraits/men/2.jpg" class="w-10 h-10 rounded-full object-cover" /></td>
              <td class="px-3 py-2">Bossing</td>
              <td class="px-3 py-2">admin1</td>
              <td class="px-3 py-2">
                <button class="bg-[#FFB81C] text-[#800000] rounded p-1 hover:opacity-90 transition"><span class="material-icons text-base">edit</span></button>
              </td>
            </tr>
            <tr class="hover:bg-gray-50">
              <td class="px-3 py-2">3</td>
              <td class="px-3 py-2"><img src="https://randomuser.me/api/portraits/men/3.jpg" class="w-10 h-10 rounded-full object-cover" /></td>
              <td class="px-3 py-2">John Doe</td>
              <td class="px-3 py-2">jdoe</td>
              <td class="px-3 py-2">
                <button class="bg-[#FFB81C] text-[#800000] rounded p-1 hover:opacity-90 transition"><span class="material-icons text-base">edit</span></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No logic for now
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style> 