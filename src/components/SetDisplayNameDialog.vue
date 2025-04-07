<template>
  <Dialog
    :identification="identification"
    :title="isEditNameDialog ? 'Edit display name' : 'Set your display name'"
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
          @update:model-value="resetError"
        />
      </v-form>
    </template>
    <template v-slot:action>
      <Button @click="actionButtonClick" :loading="loading"> submit </Button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, PropType, computed } from "vue";
import { useDialogsStore } from "@/store/dialogs";
import useAnonymousAuth from "@/composables/useAnonymousAuth";
import useUser from "@/composables/useUser";
import getUser from "@/composables/getUser";
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

const { user } = getUser();
const form = ref(false);
const submitButton = ref<HTMLButtonElement | null>(null);
const isEditNameDialog = props.identification === Dialogs.EditNameRoom;
const defaultDisplayName = isEditNameDialog
  ? user.value?.displayName ?? ""
  : "";
const displayName = ref(defaultDisplayName);
const dialogs = useDialogsStore();

const {
  login,
  error: errorLogin,
  loading: loadingLogin,
  resetError: resetErrorLogin,
} = useAnonymousAuth();
const {
  updateDisplayName,
  error: errorUpdateDisplayName,
  loadingUpdateDisplayName,
  resetError: resetErrorUpdateDisplayName,
} = useUser();

const submitAction = isEditNameDialog ? updateDisplayName : login;
const error = computed(() =>
  isEditNameDialog ? errorUpdateDisplayName.value : errorLogin.value
);
const loading = computed(() =>
  isEditNameDialog ? loadingUpdateDisplayName.value : loadingLogin.value
);
const resetError = isEditNameDialog
  ? resetErrorUpdateDisplayName
  : resetErrorLogin;

const actionButtonClick = () => {
  submitButton.value?.click();
};

const resetForm = () => {
  form.value = false;
  displayName.value = user.value?.displayName ?? "";
  resetError();
};

const onSubmit = async () => {
  if (!form.value) return;
  await submitAction(displayName.value);
  if (!error.value) {
    dialogs.isOpen[props.identification] = false;
    props.submitCallback?.();
  }
};
</script>

<style lang="scss" scoped></style>
