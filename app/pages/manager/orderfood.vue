<script setup lang="js">
  import Swal from "sweetalert2";

  const loading = ref(false);
  const tables = ref([]);
  const isOrderModalActive = ref(false);

  onMounted(() => {
    const tableData = JSON.parse(localStorage.getItem("tableManagementData")) || [];
    tables.value = tableData;
  });

  // Show food order modal
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

  // Get food detail for ordering food
  const isFoodDetailPage = ref(false);
  const orderFoodDetai = ref({});
  async function selectFood(foodId) {
    isOnSelectFoodPage.value = false;
    isFoodDetailPage.value = true;
    console.log(foodId);

    const menu = JSON.parse(localStorage.getItem("menuList")) || [];
    orderFoodDetai.value = menu[foodId];
  }

  // Ordering food
  async function orderFood() {

  }

  async function modalBack() {
    if (isFoodDetailPage.value) {
      isFoodDetailPage.value = false;
      isOnSelectFoodPage.value = true;
    }
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
      <div class="my-auto flex gap-2">
        <v-btn v-if="!isOnSelectFoodPage" elevation="0" @click="modalBack">
          <v-icon icon="mdi-arrow-left" start></v-icon>
          <span>กลับ</span>
        </v-btn>
        <h1 class="text-xl my-auto">เลือกเมนูอาหาร</h1>
      </div>
      <div>
        <v-btn icon variant="text">
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Food selection box -->
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

    <div v-if="isFoodDetailPage">
      <v-row>
        <v-col col="6">
          <img :src="orderFoodDetai.img" class="w-full object-cover mx-auto mt-2 rounded" alt="foodPreview">
        </v-col>
        <v-col col="6">
          <h1 class="text-2xl font-bold">{{ orderFoodDetai.title }}</h1>
          <p>{{ orderFoodDetai.detail }}</p>
          <p class="mb-3">ราคาเริ่มต้น {{ orderFoodDetai.price }} บาท</p>
          <h2 class="text-xl mb-3 font-bold">ตัวเลือก</h2>
          <div v-for="(optionItem, optionIndex) in orderFoodDetai.option">
            <h3 class="text-lg">{{ optionItem.mainTitle }}</h3>
            <div v-if="optionItem.type == 1">
              <v-checkbox v-for="(subOptionItem, subItemIndex) in optionItem.subTitle" :label="subOptionItem.title" :value="subOptionItem.title" color="primary"></v-checkbox>
            </div>
            <div v-else-if="optionItem.type == 2">
              <v-radio-group>
                <v-radio v-for="(subOptionItem, subItemIndex) in optionItem.subTitle" :label="subOptionItem.title" :value="subOptionItem.title" color="primary"></v-radio>
              </v-radio-group>
            </div>
          </div>
          <v-number-input controlVariant="split" label="จำนวน" variant="outlined" color="primary"></v-number-input>
          <p class="text-xl">ราคาสุทธิ <span class="font-bold">{{ Number(orderFoodDetai.price).toLocaleString("TH-th") }}</span> บาท</p>
        </v-col>
      </v-row>
    </div>
    <div class="flex justify-end gap-3 border-t border-[#121212] mt-3 pt-3">
      <v-dialog v-if="!isOnSelectFoodPage" max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" color="primary">สั่งอาหาร</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card title="ยืนยันการทำรายการ">
            <v-card-text>
              ยืนยันการทำรายการนี้หรือไม่
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="onUpdateMenuItemSubmit(updateMenuPayload._id); isActive.value = false" class="text-primary">ตกลง</v-btn>
              <v-btn @click="isActive.value = false" class="text-red-accent-4">ยกเลิก</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-btn @click="isOrderModalActive = false">ปิดหน้าต่าง</v-btn>
    </div>
  </Modal>
</template>
