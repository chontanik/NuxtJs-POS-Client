<script setup lang="js">
  import Swal from "sweetalert2";

  const route = useRoute();
  const loading = ref(false);
  const tables = ref([]);
  const isOrderModalActive = ref(false);

  onMounted(() => {
    const tableData = JSON.parse(localStorage.getItem("tableManagementData")) || [];
    tables.value = tableData;
  });

  // Get menu list
  const menuList = ref([]);
  async function getMenuList() {
    const menu = JSON.parse(localStorage.getItem("menuList")) || [];
    menuList.value = menu;
  }
  onMounted(async () => {
    await getMenuList();
  });

  // Active order menu detail modal
  const menuDetail = ref({});
  async function onMenuDetailModalActive(foodId) {
    isOrderModalActive.value = true;

    const menu = JSON.parse(localStorage.getItem("menuList")) || [];
    console.log(menu[foodId]);

    menuDetail.value = menu[foodId];
  }

  // เก็บค่าที่เลือก
  const selectedCheckbox = ref([]); // array ของ checkbox ที่เลือก
  const selectedRadio = ref([]);  // ค่าที่เลือกจาก radio
  const quantity = ref(1);

  // คำนวณราคาสุทธิ
  const totalPrice = computed(() => {
    let base = Number(menuDetail.value.price);

    // checkbox option
    menuDetail.value.option
      .filter(opt => opt.type === 1)
      .forEach(opt => {
        opt.subTitle.forEach(sub => {
          if (selectedCheckbox.value.includes(sub.title)) {
            base += sub.price;
          }
        });
      });

    // radio option
    menuDetail.value.option
      .filter(opt => opt.type === 2)
      .forEach((opt, optionIndex) => {
        const selected = opt.subTitle.find(
          sub => sub.title === selectedRadio.value[optionIndex]
        );
        if (selected) {
          base += selected.price;
        }
      });

    return base * quantity.value;
  });

  // Add order to cart
  const addOrderToCartPayload = ref({
    _id: Date.now(),
    tableId: route.query.tableId,
    foodId: null,
    option: [],
    amount: null,
    totalPrice: null
  });
  async function addOrderToCart(foodId) {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    addOrderToCartPayload.value.foodId = foodId;
    addOrderToCartPayload.value.totalPrice = totalPrice.value;
    addOrderToCartPayload.value.option = [...selectedCheckbox.value, ...selectedRadio.value];
    addOrderToCartPayload.value.amount = quantity.value;

    const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
    cartList.push(addOrderToCartPayload.value);
    localStorage.setItem("cartList", JSON.stringify(cartList));
    console.log(addOrderToCartPayload.value);

    await getMenuInCartAmount();

    Swal.fire({
      title: "เพิ่มสินค้าใส่ตะกร้าแล้ว",
      icon: "success",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#f44336",
    });

    // Clear form to empty
    addOrderToCartPayload.value = {
      _id: Date.now(),
      tableId: route.query.tableId,
      foodId: null,
      option: [],
      amount: null,
      totalPrice: null
    };
    selectedCheckbox.value = [];
    selectedRadio.value = [];
    quantity.value = 1;

    loading.value = false;
    isOrderModalActive.value = false;
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
      <v-container>
        <div class="flex justify-between gap-3 mb-3 py-3 border-b border-[#121212]">
          <div class="flex justify-start gap-2">
            <h1 class="text-2xl font-bold">เลือกเมนูอาหาร</h1>
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

        <div>
          <v-hover v-for="(menuItem, menuIndex) in menuList">
            <template v-slot:default="{ isHovering, props }">
              <v-card elevation="0" v-bind="props" :color="isHovering ? 'blue-lighten-5' : ''" class="w-full border-b border-[#121212] rounded-0 pa-3" @click="onMenuDetailModalActive(menuIndex)">
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
      </v-container>
    </v-main>

    <v-overlay v-model="loading" class="d-flex align-center justify-center" persistent>
      <v-progress-circular indeterminate size="64" color="primary"/>
    </v-overlay>
  </v-app>

  <Modal :show="isOrderModalActive" title="ตัวเลือกอาหาร">
    <v-row>
      <v-col cols="6">
        <img
          src="https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg"
          class="rounded"
          alt="menu image preview"
        />
      </v-col>

      <v-col cols="6">
        <div class="mb-3">
          <h1 class="text-xl font-bold">{{ menuDetail.title }}</h1>
          <p>{{ menuDetail.detail }}</p>
        </div>

        <!-- Checkbox group -->
        <div v-for="(optionItem, optionIndex) in menuDetail.option" :key="optionIndex">
          <div v-if="optionItem.type == 1" class="mb-6">
            <v-label class="ml-3">{{ optionItem.mainTitle }}</v-label>
            <div v-for="(subOptionItem, subOptionIndex) in optionItem.subTitle" :key="subOptionIndex" class="ml-3 relative">
              <v-checkbox v-model="selectedCheckbox" :label="subOptionItem.title" :value="subOptionItem.title" color="primary" density="compact" hide-details/>
              <span class="absolute right-0 top-0 text-warning">+{{ subOptionItem.price }}</span>
            </div>
          </div>

          <!-- Radio group -->
          <v-radio-group v-else-if="optionItem.type == 2" v-model="selectedRadio[optionIndex]" :label="optionItem.mainTitle">
            <div v-for="(subOptionItem, subOptionIndex) in optionItem.subTitle" :key="subOptionIndex" class="relative">
              <v-radio :label="subOptionItem.title" :value="subOptionItem.title" color="primary"/>
              <span class="absolute right-0 top-0 text-warning">+{{ subOptionItem.price }}</span>
            </div>
          </v-radio-group>
        </div>

        <!-- จำนวน -->
        <v-number-input v-model="quantity" label="จำนวน" variant="outlined" control-variant="split" color="primary"/>

        <!-- ราคารวม -->
        <span class="text-lg">
          ราคาสุทธิ
          <span class="text-2xl font-bold text-warning">
            {{ totalPrice.toLocaleString("th-TH") }}
          </span>
          บาท
        </span>
      </v-col>
    </v-row>

    <v-divider class="my-3"></v-divider>
    <div class="flex justify-end gap-3">
      <v-dialog max-width="500">
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
              <v-btn @click="addOrderToCart(menuDetail._id); isActive.value = false" class="text-primary">ตกลง</v-btn>
              <v-btn @click="isActive.value = false" class="text-red-accent-4">ยกเลิก</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      
      <v-btn @click="isOrderModalActive = false">ปิดหน้าต่าง</v-btn>
    </div>
  </Modal>
</template>
