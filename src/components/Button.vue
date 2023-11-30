<template>
  <v-btn :class="{ secondary: secondary }">
    <slot></slot>
  </v-btn>
</template>

<script lang="ts" setup>
defineProps({
  secondary: {
    type: Boolean,
    required: false,
  },
});
</script>

<style lang="scss" scoped>
.v-btn {
  color: rgb(var(--v-theme-on-primary));
  background-color: rgb(var(--v-theme-primary));
}
.v-btn.secondary {
  background-color: rgba(var(--v-theme-primary), 0.65);
}
</style>
