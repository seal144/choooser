<template>
  <Dialog
    :identification="Dialogs.ConfirmDeleteAccount"
    :title="title"
    :close-label="closeLabel"
    small
  >
    <template v-slot:ActivatorButtonLabel>
      <slot name="activatorButton"></slot>
    </template>
    <template v-slot:content>
      {{ text }}
    </template>
    <template v-slot:action>
      <slot name="confirmButton"></slot>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import Dialog from "./Dialog.vue";
import { Dialogs } from "@/types";

defineProps({
  title: {
    type: String,
    required: false,
  },
  closeLabel: {
    type: String,
    default: "cancel",
  },
  text: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
