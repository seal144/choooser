<template>
  <v-form v-model="form" @submit.prevent="onSubmit" class="form">
    <HeaderCard>Admin panel</HeaderCard>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { HeaderCard } from "./";

const form = ref(false);

const onSubmit = () => {};
</script>

<style scoped lang="scss">
.form {
  margin-top: 2rem;
}
</style>
