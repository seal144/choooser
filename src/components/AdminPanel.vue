<template>
  <HeaderCard class="mt-4">Admin panel</HeaderCard>
  <v-form v-model="form" @submit.prevent="onSubmit" class="form">
    <TextField
      v-model.trim="userId"
      label="User id to delete data"
      :rules="[required]"
      :readonly="loading"
      :error-messages="
        error && error === CommonErrors.TheUserNotFound ? [error] : []
      "
    />
    <TextField
      v-model.trim="password"
      label="Admin password"
      :rules="[required]"
      :readonly="loading"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="showPassword = !showPassword"
      :type="showPassword ? 'text' : 'password'"
      :error-messages="
        error && error === CommonErrors.InvalidPassword ? [error] : []
      "
    />
    <Button size="small" type="submit" danger :loading="loading"
      ><v-icon icon="mdi-exclamation-thick" />Delete user data</Button
    >
  </v-form>
  <ConfirmDialog
    :dialogIdentification="Dialogs.ConfirmDeleteUser"
    title="Are you sure?"
    :text="`Do you want to delete user '${userId}' data? This action is irreversible.`"
    confirmLabel="delete"
    confirmIcon="mdi-exclamation-thick"
    :confirmAction="deleteUserData"
    :loading="loading"
    danger
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import { Button, ConfirmDialog, HeaderCard, TextField } from "./";
import { useDialogsStore } from "@/store/dialogs";
import useAdmin from "@/composables/useAdmin";
import { required } from "@/utils/validation";
import { CommonErrors, Dialogs } from "@/types";

const dialogs = useDialogsStore();
const { prepareUserToDelete, loading, error, successMessage, resetError } =
  useAdmin();

const form = ref(false);
const userId = ref("");
const password = ref("");
const showPassword = ref(false);

watch([userId, password], () => {
  if (error.value) {
    resetError();
  }
});

const onSubmit = () => {
  const isUserIdValid = required(userId.value) === true;
  const isPasswordValid = required(password.value) === true;
  if (!isUserIdValid || !isPasswordValid) return;
  dialogs.isOpen[Dialogs.ConfirmDeleteUser] = true;
};

const deleteUserData = async () => {
  dialogs.isOpen[Dialogs.ConfirmDeleteUser] = false;

  await prepareUserToDelete(userId.value, password.value);

  if (!error.value) {
    userId.value = "";
    password.value = "";
  }
};
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
