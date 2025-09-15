<script setup lang="js">
  import Swal from 'sweetalert2'
  import langPack from '~/assets/lang/langPack.json';
  import { ref } from 'vue';
  import { useDisplay } from 'vuetify';
  const drawer = ref(true); // state ของ navigation drawer
  const { smAndDown } = useDisplay(); // detect จอเล็ก (mobile/tablet)

  const lang = langPack.th;
  const loading = ref(false);

  // ปุ่มกด burger toggle drawer
  function toggleDrawer() {
    drawer.value = !drawer.value;
  }

  const isOpenForSalesModalActive = ref(false);

  const openForSalesPayload = ref({
    amount: null
  });

  async function onOpenForSalesSubmit() {
    console.log("opening for sales");

    isOpenForSalesModalActive.value = false;
    loading.value = true;

    await new Promise(resolve => setTimeout(resolve, 1000)); 

    // Dummy request api with local storage
    localStorage.setItem("isOpenForSales", true);
    localStorage.setItem("openForSalesAmount", openForSalesPayload.value.amount);

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "เปิดรอบการขายแล้ว"
    });

    loading.value = false;

    console.log("opened for sales!");
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
    <v-list-item prepend-icon="mdi-point-of-sale" link title="เปิดรอบบิล" @click="isOpenForSalesModalActive = true"></v-list-item>
    <v-list-item to="/manager/cash-drawer" prepend-icon="mdi-cash-register" link title="ลิ้นชักเก็บ"></v-list-item>
    <v-list-item to="/manager/category" prepend-icon="mdi-tag-multiple" link title="หมวดหมู่"></v-list-item>
    <v-list-item to="/manager/stock" prepend-icon="mdi-warehouse" link title="สินค้าคงคลัง"></v-list-item>
    <v-list-item to="/manager/menu" prepend-icon="mdi-food" link title="เมนูอาหาร"></v-list-item>
    <v-list-item to="/manager/tables" prepend-icon="mdi-table-furniture" link title="จัดการโต๊ะ"></v-list-item>
    <v-list-item to="/manager/employees" prepend-icon="mdi-account-group" link title="พนักงาน"></v-list-item>
    <v-list-item to="/manager/kitchen" prepend-icon="mdi-chef-hat" link title="ครัว"></v-list-item>
    <v-list-item>
      <v-btn variant="text" class="w-full text-red-accent-4" prepend-icon="mdi-logout" @click="() => navigateTo('/login')">
        ออกจากระบบ
      </v-btn>
    </v-list-item>
  </v-navigation-drawer>

  <Modal :show="isOpenForSalesModalActive" title="เปิดรอบการขาย">
    <div>
      <p class="text-center mb-3">ระบบจำนวนเงินสำหรับเป็นจำนวยเงินเริ่มต้น</p>
      <v-number-input v-model="openForSalesPayload.amount" controlVariant="split" label="จำนวนเงินเริ่มต้น" variant="outlined" color="primary"></v-number-input>
    </div>
    <div class="flex justify-end gap-2">
      <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" color="primary">เปิดรอบการขาย</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card title="ยืนยันเปิดรอบการขาย">
            <v-card-text>
              ยืนยันการเปิดรอบการขาย
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="onOpenForSalesSubmit(); isActive.value = false" class="text-primary">ตกลง</v-btn>
              <v-btn @click="isActive.value = false" class="text-red-accent-4">ยกเลิก</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-btn @click="isOpenForSalesModalActive = false">ปิดหน้าต่าง</v-btn>
    </div>
  </Modal>

  <v-overlay v-model="loading" class="d-flex align-center justify-center" persistent>
    <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
  </v-overlay>
</template>