<template>
  <v-btn :class="{ secondary, danger }">
    <slot></slot>
  </v-btn>
</template>

<script lang="ts" setup>
defineProps({
  secondary: {
    type: Boolean,
    default: false,
  },
  danger: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.v-btn {
  color: rgb(var(--v-theme-on-primary));
  background-color: rgb(var(--v-theme-primary));

  &.secondary {
    background-color: rgba(var(--v-theme-primary), 0.65);
  }

  &.danger {
    background-color: rgb(var(--v-theme-error));
  }
}
</style>
