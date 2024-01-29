<template>
  <Button icon :class="{ rotate }"><v-icon :icon="icon" size="large" /></Button>
</template>

<script setup lang="ts">
import Button from "./Button.vue";

defineProps({
  icon: {
    type: String,
    required: true,
  },
  rotate: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.v-btn--icon {
  height: 38px;
  width: 38px;
  padding-top: 1px;

  &.rotate {
    transform: rotate(180deg);
  }

  &--icon {
    width: 38px;
  }
}
</style>
