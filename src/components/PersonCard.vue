<template>
  <HeaderCard left>
    <v-icon icon="mdi-account" size="20" />{{ name }}
  </HeaderCard>
</template>

<script lang="ts" setup>
import { HeaderCard } from "@/components";

defineProps({
  name: {
    type: String,
    required: true,
  },
});
</script>

<style scoped lang="scss"></style>
