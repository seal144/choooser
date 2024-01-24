<template>
  <v-card :class="{ left: left }"><slot></slot></v-card>
</template>

<script lang="ts" setup>
defineProps({
  left: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.v-card {
  padding: 0.25rem 0.5rem;
  text-align: center;

  &.left {
    text-align: left;
  }
}
</style>
