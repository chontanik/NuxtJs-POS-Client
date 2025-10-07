<script setup lang="js">
  import Swal from "sweetalert2";

  const loading = ref(false);

  // Get cart list
  const menuCartList = ref([]);
  function groupByTableId(cartList, tableList, menuList) {
    const grouped = cartList.reduce((acc, item) => {
      let group = acc.find(g => g.tableId === item.tableId);
      if (!group) {
        // หาโต๊ะจาก tableList
        const table = tableList.find(t => String(t.id) === String(item.tableId));
        group = { 
          tableId: item.tableId, 
          tableName: table ? table.name : null, 
          items: [] 
        };
        acc.push(group);
      }

      // หาเมนูจาก menuList
      const menu = menuList.find(m => m._id === item.foodId);

      group.items.push({
        ...item,
        menuDetail: menu ? { _id: menu._id, title: menu.title, price: menu.price } : null
      });

      return acc;
    }, []);
    return grouped;
  }
  onMounted(async () => {
    const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
    const tableList = JSON.parse(localStorage.getItem("tableManagementData")) || [];
    const menuList = JSON.parse(localStorage.getItem("menuList")) || [];

    menuCartList.value = groupByTableId(cartList, tableList, menuList);
    console.log(menuCartList.value);
  });
</script>

<template>
  <v-app>
    <NavBar />

    <v-main>
      <v-container>
        <div class="flex justify-between gap-3 mb-3 py-3 border-b border-[#121212]">
          <div class="flex justify-start gap-2">
            <h1 class="text-2xl font-bold">ตะกร้าอาหาร</h1>
          </div>

          <div class="flex justify-start">
            <v-btn link to="/manager/orderfood" prepend-icon="mdi-food-variant" class="me-3">สั่งอาหารใหม่</v-btn>
          </div>
        </div>

        <div v-for="(tableItem, tableIndex) in menuCartList" class="mb-3">
          <h2 class="text-xl font-bold">โต๊ะ {{ tableItem.tableName }}</h2>
          <v-hover v-for="(menuItem, menuIndex) in tableItem.items">
            <template v-slot:default="{ isHovering, props }">
              <v-card elevation="0" v-bind="props" :color="isHovering ? 'blue-lighten-5' : ''" class="w-full border-b border-[#121212] rounded-0 pa-3" @click="onMenuDetailModalActive(menuIndex)">
                <div class="flex flex-wrap cursor-pointer">
                  <div class="w-[120px] h-[120px] flex-shrink-0 mb-3 lg:mb-0">
                    <img src="https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg" alt="เนื้อหมู" class="w-full h-full object-cover rounded" />
                  </div>
                  <div class="ml-3">
                    <!-- <p class="bg-green-200 rounded w-fit px-3">#สถานะ</p> -->
                    <p class="text-lg font-bold">{{ menuItem.menuDetail.title }}</p>
                    <p>{{ menuItem.menuDetail.note }}</p>
                    <p class="underline">เพิ่มเติม: <span v-for="(optionItem, optionIndex) in menuItem.option" :key="optionIndex">{{ optionItem }}, </span></p>
                    <p><span class="font-bold text-lg">{{ Number(menuItem.totalPrice).toLocaleString("TH-th") }}</span> บาท</p>
                  </div>
                </div>
              </v-card>
            </template>
          </v-hover>
          <div class="flex justify-end gap-3">
            <v-btn class="mt-3" color="primary">สั่งอาหารทั้งหมด</v-btn>
            <v-btn class="mt-3" color="error">ยกเลิกทั้งหมด</v-btn>
          </div>
        </div>
      </v-container>
    </v-main>

    <v-overlay v-model="loading" class="d-flex align-center justify-center" persistent>
      <v-progress-circular indeterminate size="64" color="primary"/>
    </v-overlay>
  </v-app>
</template>
