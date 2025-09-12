<script setup lang="js">
import langPack from '~/assets/lang/langPack.json';
import { ref } from 'vue';
import { useDisplay } from 'vuetify';

const lang = langPack.th;
const loading = ref(false);

const drawer = ref(true); // state ของ navigation drawer
const { smAndDown } = useDisplay(); // detect จอเล็ก (mobile/tablet)

// ปุ่มกด burger toggle drawer
function toggleDrawer() {
  drawer.value = !drawer.value;
}
</script>

<template>
  <v-app>
    <!-- App Bar -->
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
    <v-navigation-drawer v-model="drawer" :permanent="!smAndDown" :temporary="smAndDown" >
      <v-list-item title="Manager" subtitle="เมนูการจัดการร้าน"></v-list-item>
      <v-divider></v-divider>
      <v-list-item prepend-icon="mdi-view-dashboard" link title="ข้อมูลภาพรวม"></v-list-item>
      <v-list-item prepend-icon="mdi-warehouse" link title="สินค้าในคลัง"></v-list-item>
      <v-list-item prepend-icon="mdi-food" link title="เมนูอาหาร"></v-list-item>
      <v-list-item prepend-icon="mdi-table-chair" link title="จัดการโต๊ะ"></v-list-item>
      <v-list-item prepend-icon="mdi-account-group" link title="พนักงาน"></v-list-item>
      <!-- <v-list-item link title="ออกจากระบบ"></v-list-item> -->
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container>
        asdasdasdasd
      </v-container>
    </v-main>

    <!-- Overlay Loading -->
    <v-overlay v-model="loading" class="d-flex align-center justify-center" persistent>
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>
