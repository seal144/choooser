<template>
  <HeaderCard class="mt-4">Admin panel</HeaderCard>
  <v-form v-model="form" @submit.prevent="onSubmit" class="form">
    <TextField
      v-model.trim="uid"
      label="User id to delete"
      :rules="[required]"
      :readonly="false"
      :error-messages="[]"
    />
    <TextField
      v-model.trim="password"
      label="Admin password"
      :rules="[required]"
      :readonly="false"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="showPassword = !showPassword"
      :type="showPassword ? 'text' : 'password'"
      :error-messages="[]"
    />
    <Button size="small" type="submit" danger
      ><v-icon icon="mdi-exclamation-thick" />Delete User</Button
    >
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Button, HeaderCard, TextField } from "./";
import { required } from "@/utils/validation";

const form = ref(false);
const uid = ref("");
const password = ref("");
const showPassword = ref(false);

const onSubmit = () => {};
</script>

<style lang="scss" scoped>
@import "../styles/settings.scss";

.form {
  padding: 1rem 0.5rem 0.5rem;
  border-right: $border-style;
  border-bottom: $border-style;
  border-left: $border-style;
}
</style>
