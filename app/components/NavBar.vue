<script setup lang="js">
  import langPack from '~/assets/lang/langPack.json';
  import { ref } from 'vue';
  import { useDisplay } from 'vuetify';
  const drawer = ref(true); // state ของ navigation drawer
  const { smAndDown } = useDisplay(); // detect จอเล็ก (mobile/tablet)

  const lang = langPack.th;

  // ปุ่มกด burger toggle drawer
  function toggleDrawer() {
    drawer.value = !drawer.value;
  }

  async function openBilling() {
    console.log("asdasd");
  }
</script>

<template>
  <v-app-bar :elevation="2" color="primary">
      <template v-slot:prepend>
        <!-- burger icon กดเพื่อ toggle drawer -->
        <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>MyPOS</v-app-bar-title>

      <template v-slot:append>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">เปลี่ยนภาษา</v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title><v-btn>ภาษาไทย</v-btn></v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title><v-btn>English</v-btn></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" :permanent="!smAndDown" :temporary="smAndDown">
      <v-list-item title="Manager" subtitle="เมนูการจัดการร้าน"></v-list-item>
      <v-divider></v-divider>
      <v-list-item to="/manager/dashboard" prepend-icon="mdi-view-dashboard" link title="ข้อมูลภาพรวม"></v-list-item>
      <v-list-item prepend-icon="mdi-point-of-sale" link title="เปิดรอบบิล" @click="openBilling"></v-list-item>
      <v-list-item to="/manager/cash-drawer" prepend-icon="mdi-cash-register" link title="ลิ้นชักเก็บ"></v-list-item>
      <v-list-item to="/manager/category" prepend-icon="mdi-tag-multiple" link title="หมวดหมู่"></v-list-item>
      <v-list-item to="/manager/stock" prepend-icon="mdi-warehouse" link title="สินค้าคงคลัง"></v-list-item>
      <v-list-item to="/manager/menu" prepend-icon="mdi-food" link title="เมนูอาหาร"></v-list-item>
      <v-list-item to="/manager/tables" prepend-icon="mdi-table-furniture" link title="จัดการโต๊ะ"></v-list-item>
      <v-list-item to="/manager/employees" prepend-icon="mdi-account-group" link title="พนักงาน"></v-list-item>
      <v-list-item to="/manager/kitchen" prepend-icon="mdi-chef-hat" link title="ครัว"></v-list-item>
      <v-list-item>
        <v-btn variant="text" class="w-full text-red-accent-4" prepend-icon="mdi-logout">
          ออกจากระบบ
        </v-btn>
      </v-list-item>
      <!-- <v-list-item link title="ออกจากระบบ"></v-list-item> -->
    </v-navigation-drawer>
</template>