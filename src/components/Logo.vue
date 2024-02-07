<template>
  <div class="logo-container" :class="{ 'big-logo': big }">
    <div class="logo-squere"></div>
    <div class="logo-text" v-if="!props.collapse">{{ appName }}</div>
  </div>
</template>

<script lang="ts" setup>
// const appName = "CHOOSER";
const appName = "COMMUNICATOR";

const props = defineProps({
  collapse: {
    type: Boolean,
    required: false,
    default: false,
  },
  big: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<style scoped lang="scss">
@use "@/styles/settings.scss" as *;

.logo-container {
  display: flex;
  gap: 0.25rem;
  width: fit-content;
  border: 3px solid rgb(var(--v-theme-primary));
  padding: 0.25rem 0.25rem;
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 1.25rem;

  .logo-squere {
    width: 1.25rem;
    height: 1.25rem;
    border: 5px solid rgb(var(--v-theme-primary));
  }

  &.big-logo {
    gap: 0.375rem;
    border-width: 4.5px;
    padding: 0.375rem 0.375rem;
    font-size: 1.875rem;
    line-height: 1.875rem;

    .logo-squere {
      width: 1.875rem;
      height: 1.875rem;
      border-width: 7.5px;
    }
  }
}
</style>
