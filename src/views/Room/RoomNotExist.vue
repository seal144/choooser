<template>
  <div class="container">
    <HeaderCard
      >&#128550; {{ CommonErrors.Default }} Such a room doesn't
      exist.</HeaderCard
    >
    <Button @click="goHome">
      <v-icon icon="mdi-exit-run" size="large" />
      Go Home
    </Button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { RoutesNames } from "@/router";
import { Button, HeaderCard } from "@/components";
import { CommonErrors } from "@/types";

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
