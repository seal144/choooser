<template>
  <Dialog
    :identification="identification"
    :title="title"
    close-label="close"
    class="room-dialog"
    @close="resetForm"
  >
    <template v-if="variant !== 'joinFromUrl'" v-slot:ActivatorButtonLabel>
      <Button class="room-dialog--activator-button">
        <v-icon :icon="activatorButtonIcon" size="large" />
        {{ title }}
      </Button>
    </template>
    <template v-slot:content>
      <v-form v-model="form" @submit.prevent="onSubmit" validate-on="blur lazy">
        <button type="submit" v-show="false" ref="submitButton"></button>
        <p v-if="variant === 'joinFromUrl'" class="note">
          The room requires a password
        </p>
        <TextField
          v-model.trim="name"
          label="Room name"
          :disabled="!!props.roomName"
          :rules="[...displayNameValidation]"
          :readonly="loading"
          :error-messages="
            error && error !== ErrorJoinRoom.InvalidPassword ? error : []
          "
        />
        <TextField
          v-model.trim="password"
          label="Password"
          :rules="[...roomPasswordValidation]"
          :readonly="loading"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
          :type="showPassword ? 'text' : 'password'"
          :error-messages="error === ErrorJoinRoom.InvalidPassword ? error : []"
        />
      </v-form>
    </template>
    <template v-slot:action>
      <Button @click="actionButtonClick" :loading="loading">{{
        actionButtonLabel
      }}</Button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref, PropType } from "vue";
import { useRouter } from "vue-router";

import { useDialogsStore } from "@/store/dialogs";
import { Button, Dialog, TextField } from "@/components";
import useCreateRoom from "@/composables/useCreateRoom";
import useJoinRoom from "@/composables/useJoinRoom";
import { ErrorJoinRoom } from "@/composables/useJoinRoom";
import {
  displayNameValidation,
  roomPasswordValidation,
} from "@/utils/validation";
import { Dialogs } from "@/types";

const props = defineProps({
  variant: {
    type: String as PropType<"join" | "create" | "joinFromUrl">,
    required: true,
  },
  //roomName is required on "joinFromUrl" variant
  roomName: {
    type: String,
    required: false,
  },
});

const router = useRouter();

const DialogData = computed(() => {
  switch (props.variant) {
    case "join":
      return {
        identification: Dialogs.JoinRoom,
        title: "Join room",
        activatorButtonIcon: "mdi-login",
        actionButtonLabel: "Join",
      };
    case "joinFromUrl":
      return {
        identification: Dialogs.JoinRoomFromURL,
        title: "Join room",
        actionButtonLabel: "Join",
      };
    default:
      return {
        identification: Dialogs.CreateRoom,
        title: "Create room",
        activatorButtonIcon: "mdi-plus",
        actionButtonLabel: "Create",
      };
  }
});
const { identification, title, activatorButtonIcon, actionButtonLabel } =
  DialogData.value;

const useAction = computed(() => {
  if (props.variant === "create") {
    const { createRoom, error, loading, resetError } = useCreateRoom();

    return {
      submitAction: createRoom,
      loading,
      error,
      resetError,
    };
  }

  const { joinRoom, error, loading, resetError } = useJoinRoom();

  return {
    submitAction: joinRoom,
    loading,
    error,
    resetError,
  };
});
const { submitAction, loading, error, resetError } = useAction.value;

const form = ref(false);
const name = ref(props.roomName ? props.roomName : "");
const password = ref("");
const showPassword = ref(false);
const submitButton = ref<HTMLButtonElement | null>(null);
const dialogs = useDialogsStore();

const actionButtonClick = () => {
  submitButton.value?.click();
};

const resetForm = () => {
  form.value = false;
  name.value = "";
  password.value = "";
  resetError();
};

const onSubmit = async () => {
  const isNameValid = [...displayNameValidation].every((validation) => {
    return validation(name.value) === true;
  });
  const isPasswordValid = [...roomPasswordValidation].every((validation) => {
    return validation(password.value) === true;
  });
  // below code doesn't work on first submit when password input is not touched
  // if (!form.value) return;
  if (!isNameValid || !isPasswordValid) return;

  const newRoomId = await submitAction({
    name: name.value,
    password: password.value,
  });

  if (!error.value) {
    dialogs.isOpen[identification] = false;
    router.push(`/room/${newRoomId}`);
  }
};
</script>

<style lang="scss">
.room-dialog {
  div.v-card-text {
    padding-bottom: 0.75rem !important;

    &.xs {
      padding-bottom: 0.25rem !important;
    }
  }

  .note {
    margin-top: -1rem;
    margin-bottom: 1rem;
  }

  .v-input {
    margin: 0 0 0.5rem;

    &:last-child {
      margin: 0;
    }
  }
}

.room-dialog--activator-button {
  width: 100%;
}
</style>
