<script setup>
  defineProps({
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "title"
    }
  });
</script>

<template>
  <div v-if="show" class="bg-black/60 fixed top-0 h-screen w-screen px-3 z-[1006] overflow-y-scroll">
    <div class="bg-white shadow-lg max-w-[800px] mx-auto mt-12 mb-12 rounded">
      <div class="w-full bg-primary py-3 px-3 rounded-t">
        <span class="font-bold text-lg">{{ title }}</span>
      </div>
      <div class="py-3 px-3">
        <slot></slot>
      </div>
    </div>
  </div>
</template>