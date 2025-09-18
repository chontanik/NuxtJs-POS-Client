<script setup lang="js">
  import Swal from "sweetalert2";

  const loading = ref(false);
  const tables = ref([]);
  const isOrderModalActive = ref(false);

  onMounted(() => {
    const tableData = JSON.parse(localStorage.getItem("tableManagementData")) || [];
    tables.value = tableData;
  });

  const isOnSelectFoodPage = ref(true);
  const menuList = ref([]);
  async function activeOrderFoodModal(tableId) {
    loading.value = true;
  
    await new Promise(resolve => setTimeout(resolve, 1000));

    const menu = JSON.parse(localStorage.getItem("menuList")) || [];
    menuList.value = menu;
    console.log(tableId);
    
    loading.value = false;
    isOrderModalActive.value = true;
  }

  async function selectFood(foodId) {
    isOnSelectFoodPage.value = false;
    console.log(foodId);
  }
</script>

<template>
  <v-app>
    <NavBar />

    <v-main>
      <v-container fluid class="pa-4">
        <div class="overflow-x-scroll">
          <div class="relative bg-gray-100 border" style="height: 700px; width: 900px;">
            <div v-for="table in tables" :key="table.id" class="absolute bg-white text-black flex items-center justify-center rounded shadow cursor-pointer" :style="{ left: table.x + 'px', top: table.y + 'px', width: table.width + 'px', height: table.height + 'px',
              }" @click="activeOrderFoodModal(table.id)">
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

  <Modal :show="isOrderModalActive" title="สั่งรายการอาหาร">
    <div class="flex justify-between pb-3 border-b border-[#121212]">
      <div class="my-auto">
        <h1 class="text-xl">เลือกเมนูอาหาร</h1>
      </div>
      <div>
        <v-btn icon variant="text">
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </div>
    </div>

    <div v-if="isOnSelectFoodPage">
      <v-hover v-for="(menuItem, menuIndex) in menuList">
        <template v-slot:default="{ isHovering, props }">
          <v-card elevation="0" v-bind="props" :color="isHovering ? 'blue-lighten-5' : ''" class="w-full border-b border-[#121212] rounded-0 pa-3" @click="selectFood(menuItem._id)">
            <div class="flex flex-wrap cursor-pointer">
              <div class="w-[120px] h-[120px] flex-shrink-0 mb-3 lg:mb-0">
                <img src="https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg" alt="เนื้อหมู" class="w-full h-full object-cover rounded" />
              </div>
  
              <div class="ml-3">
                <p class="bg-green-200 rounded w-fit px-3">#สถานะ</p>
                <p class="text-lg font-bold">{{ menuItem.title }}</p>
                <p>{{ menuItem.detail }}</p>
                <p>หมวดหมู่: 
                  <span>{{ menuItem.category }}</span>
                </p>
                <p><span class="font-bold text-lg">{{ Number(menuItem.price).toLocaleString("TH-th") }}</span> บาท</p>
              </div>
            </div>
          </v-card>
        </template>
      </v-hover>
    </div>
  </Modal>
</template>
