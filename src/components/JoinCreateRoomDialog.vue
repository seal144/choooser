<template>
  <Dialog
    :identification="identification"
    :title="title"
    close-label="close"
    class="room-dialog"
  >
    <template v-slot:ActivatorButtonLabel>
      <Button class="room-dialog--activator-button">
        <v-icon :icon="activatorButtonIcon" size="large" />
        {{ title }}
      </Button>
    </template>
    <template v-slot:content>
      <v-form v-model="form" @submit.prevent="onSubmit">
        <TextField
          v-model.trim="roomName"
          label="Room name"
          :rules="[required]"
          :readonly="loading"
        />
        <TextField
          v-model.trim="password"
          label="Password"
          :readonly="loading"
          type="password"
        />
      </v-form>
    </template>
    <template v-slot:action>
      <Button :disabled="!form" @click="onSubmit" :loading="loading">{{
        actionButtonLabel
      }}</Button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref, PropType } from "vue";

import Button from "./Button.vue";
import Dialog from "./Dialog.vue";
import TextField from "./TextField.vue";
import { Dialogs } from "@/types";

const props = defineProps({
  variant: {
    type: String as PropType<"join" | "create">,
    required: true,
  },
});

const DialogData = computed(() => {
  switch (props.variant) {
    case "join":
      return {
        identification: Dialogs.JoinRoom,
        title: "Join room",
        activatorButtonIcon: "mdi-login",
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
const form = ref(false);
const roomName = ref("");
const password = ref("");
const loading = ref(false);

const required = (value: string) => !!value || "Required";

const onSubmit = () => {
  if (!form.value) return;

  loading.value = true;

  setTimeout(() => (loading.value = false), 2000);
  console.log({ roomName: roomName.value, password: password.value });
};
</script>

<style lang="scss">
.room-dialog {
  div.v-card-text {
    padding-bottom: 0.25rem !important;
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
