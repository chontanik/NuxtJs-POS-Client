<script setup lang="js">
  import langPack from '~/assets/lang/langPack.json';

  const lang = langPack.th
</script>

<template>
  <v-app>
    <v-app-bar :elevation="2" color="primary">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>MyPOS</v-app-bar-title>

      <template v-slot:append>
        <v-btn icon="mdi-magnify"></v-btn>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">lang</v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>ภาษาไทย</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>English</v-list-item-title>
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
          
          <v-form class="w-[380px]">
            <v-text-field class="w-full" color="primary" :label="lang.txtUsernameInputLable" required></v-text-field>
            <v-text-field type="password" class="w-full" color="primary" :label="lang.txtPasswordInputLable" required></v-text-field>

            <v-btn class="mt-2" color="primary" type="submit" block>{{ lang.txtLoginSubmitBtn }}</v-btn>
          </v-form>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>