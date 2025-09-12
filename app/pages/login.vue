<script setup lang="js">
import langPack from '~/assets/lang/langPack.json';
import { ref } from 'vue';

const lang = langPack.th;

const loginPayload = ref({
  username: null,
  password: null
});

const loading = ref(false);

async function onLoginSubmit() {
  loading.value = true; // เปิดโหลดก่อน
  console.log(loginPayload.value);

  // สมมุติว่ามีการเรียก API
  await new Promise(resolve => setTimeout(resolve, 2000)); 

  if (loginPayload.value.username == "Manager") {
    await navigateTo("/manager/dashboard");
  }

  loading.value = false; // ปิดโหลดเมื่อเสร็จ
}
</script>

<template>
  <v-app>
    <v-app-bar :elevation="2" color="primary">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
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

    <v-main>
      <v-container>
        <div class="mx-auto w-fit">
          <div class="text-center mb-5">
            <h1 class="text-4xl font-bold text-[#0c44bd]">MyPOS</h1>
            <h2 class="text-xl">{{ lang.txtLoginHeader }}</h2>
          </div>
          
          <v-form @submit.prevent="onLoginSubmit" class="w-[380px]">
            <v-text-field v-model="loginPayload.username" class="w-full" color="primary" :label="lang.txtUsernameInputLable" required></v-text-field>
            <v-text-field v-model="loginPayload.password" type="password" class="w-full" color="primary" :label="lang.txtPasswordInputLable" required></v-text-field>

            <v-btn class="mt-2 w-full" color="primary" type="submit" block:loading="loading">
              {{ lang.txtLoginSubmitBtn }}
            </v-btn>
          </v-form>
        </div>
      </v-container>
    </v-main>

    <!-- Overlay Loading -->
    <v-overlay v-model="loading" class="d-flex align-center justify-center" persistent>
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>
