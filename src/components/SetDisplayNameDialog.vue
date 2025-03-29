<template>
  <Dialog
    :identification="identification"
    title="Set your display name"
    close-label="cancel"
    class="room-dialog"
    @close="resetForm"
    :prevent-close="loading"
  >
    <template v-slot:content>
      <v-form v-model="form" @submit.prevent="onSubmit" validate-on="blur lazy">
        <button type="submit" v-show="false" ref="submitButton"></button>
        <TextField
          v-model.trim="displayName"
          label="Display name"
          :rules="[...displayNameValidation]"
          :readonly="loading"
          :error-messages="error ?? []"
          @change="resetError"
        />
      </v-form>
    </template>
    <template v-slot:action>
      <Button @click="actionButtonClick" :loading="loading"> submit </Button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, PropType } from "vue";
import { useDialogsStore } from "@/store/dialogs";
import useAnonymousAuth from "@/composables/useAnonymousAuth";
import { Button, Dialog, TextField } from "@/components";
import { Dialogs } from "@/types";
import { displayNameValidation } from "@/utils/validation";

const props = defineProps({
  identification: {
    type: String as PropType<Dialogs>,
    required: true,
  },
  submitCallback: {
    type: Function as PropType<() => void>,
    required: false,
  },
});

const form = ref(false);
const submitButton = ref<HTMLButtonElement | null>(null);
const displayName = ref("");

const { login, error, loading, resetError } = useAnonymousAuth();
const dialogs = useDialogsStore();

const actionButtonClick = () => {
  submitButton.value?.click();
};

const resetForm = () => {
  form.value = false;
  displayName.value = "";
  resetError();
};

const onSubmit = async () => {
  if (!form.value) return;
  await login(displayName.value);

  if (!error.value) {
    dialogs.isOpen[props.identification] = false;

    props.submitCallback?.();
  }
};
</script>

<style lang="scss" scoped></style>
