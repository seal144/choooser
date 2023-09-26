<template>
  <v-app-bar>
    <v-app-bar-title> <Logo /> </v-app-bar-title>
  </v-app-bar>
</template>

<script lang="ts" setup>
import Logo from "@/components/Logo.vue";
//
</script>

<style scoped lang="scss">
@use "@/styles/settings.scss" as *;

.v-toolbar {
  border: $border-style;
}
</style>
