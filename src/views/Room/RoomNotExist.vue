<template>
  <div class="container">
    <HeaderCard>Something went wrong! Such a room doesn't exist.</HeaderCard>
    <Button @click="goHome">
      <v-icon icon="mdi-exit-run" size="large" />
      Go Home
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button, HeaderCard } from "@/components";
import { useRouter } from "vue-router";

import { RoutesNames } from "@/router";

const router = useRouter();

const goHome = () => {
  router.push({ name: RoutesNames.Home });
};
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
