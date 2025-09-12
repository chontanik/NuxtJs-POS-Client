<script setup lang="js">
import langPack from '~/assets/lang/langPack.json';
import { ref } from 'vue';
import { useDisplay } from 'vuetify';

const lang = langPack.th;
const loading = ref(false);
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <NavBar></NavBar>

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
