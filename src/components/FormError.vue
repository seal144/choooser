<template>
  <div class="error-container">
    {{ errorMessage }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  errorMessage: {
    type: String,
    required: true,
  },
});
</script>

<style>
.error-container {
  position: absolute;
  bottom: -0.5rem;
  color: rgb(var(--v-theme-error));
}
</style>
