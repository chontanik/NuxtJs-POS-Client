<script setup lang="js">
  const loading = ref(false);
  const tables = ref([]);

  onMounted(() => {
    const tableData = JSON.parse(localStorage.getItem("tableManagementData")) || [];
    tables.value = tableData;
  });

  async function goToOrderMenu(tableId) {
    await navigateTo(`/manager/orderMenu?tableId=${tableId}`);
  }

  // Get menu in cart amount
  const menuInCartAmount = ref(0);
  async function getMenuInCartAmount() {
    const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
  
    menuInCartAmount.value = cartList.length;
  }
  onMounted(() => {
    getMenuInCartAmount();
  });
</script>

<template>
  <v-app>
    <NavBar />
    <v-main>
      <v-container fluid class="pa-4">
        <div class="flex justify-between gap-3 mb-3 py-3 border-b border-[#121212]">
          <div class="flex justify-start gap-2">
            <h1 class="text-2xl font-bold">สั่งอาหาร</h1>
          </div>

          <div class="flex justify-start">
            <v-btn link to="/manager/menuCart" prepend-icon="mdi-cart" class="me-3">ตะกร้า <span v-if="menuInCartAmount > 0">({{ menuInCartAmount }})</span></v-btn>
            
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" prepend-icon="mdi-filter">เลือกหมวดหมู่</v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title><v-btn variant="text" class="w-full">เนื้อสัตว์</v-btn></v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title><v-btn variant="text" class="w-full">เครื่องดื่ม</v-btn></v-list-item-title>
                  <v-list-item-title><v-btn variant="text" class="w-full">ผัก</v-btn></v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>

        <div class="overflow-x-scroll">
          <div class="relative bg-gray-100 border" style="height: 700px; width: 900px;">
            <div v-for="table in tables" :key="table.id" class="absolute bg-white text-black flex items-center justify-center rounded shadow cursor-pointer" :style="{ left: table.x + 'px', top: table.y + 'px', width: table.width + 'px', height: table.height + 'px',
              }" @click="goToOrderMenu(table.id)">
              {{ table.name }}
            </div>
          </div>
        </div>
      </v-container>
    </v-main>

    <v-overlay v-model="loading" class="d-flex align-center justify-center" persistent>
      <v-progress-circular indeterminate size="64" color="primary"/>
    </v-overlay>
  </v-app>
</template>
