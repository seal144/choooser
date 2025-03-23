<template>
  <Dialog
    :identification="Dialogs.SetDisplayName"
    title="Set your display name"
    close-label="cancel"
    class="room-dialog"
    @close="resetForm"
  >
    <template v-slot:content>
      <v-form v-model="form" @submit.prevent="onSubmit" validate-on="blur lazy">
        <button type="submit" v-show="false" ref="submitButton"></button>
        <TextField
          v-model.trim="displayName"
          label="Display name"
          :rules="[required]"
          :readonly="loading"
        />
      </v-form>
    </template>
    <template v-slot:action>
      <Button @click="actionButtonClick" :loading="loading"> submit </Button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
// TODO - handle error-messages in TextField
import { ref } from "vue";
import { Button, Dialog, TextField } from "@/components";
import { Dialogs } from "@/types";
import { required } from "@/utils/validation";

const form = ref(false);
const submitButton = ref<HTMLButtonElement | null>(null);
const displayName = ref("");
//TODO - replace with actual loading
const loading = ref(false);

const actionButtonClick = () => {
  submitButton.value?.click();
};

const resetForm = () => {
  form.value = false;
  displayName.value = "";
};

const onSubmit = async () => {
  if (!form.value) return;
  // TODO - handle submit
  console.log("on submit");
};
</script>

<style lang="scss" scoped></style>
