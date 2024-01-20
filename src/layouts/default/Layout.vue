<template>
  <v-app>
    <AppBar :isRoom="isRoom" />

    <View />
  </v-app>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import AppBar from "./AppBar.vue";
import View from "./View.vue";
import { useRoute } from "vue-router";
import { RoutesNames } from "@/router";

const route = useRoute();

const isRoom = computed(() => {
  if (route.name === RoutesNames.Room) return true;
  return false;
});
</script>
