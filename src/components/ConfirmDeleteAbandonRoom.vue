<template>
  <ConfirmDialog
    :dialogIdentification="identification"
    title="Are you sure?"
    :text="text ? text : DialogData.defaultText"
    :confirmLabel="DialogData.ButtonLabel"
    :confirmIcon="DialogData.ButtonIcon"
    :confirmAction="confirm"
    :loading="loading"
    :danger="variant === 'delete'"
  />
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";

import { ConfirmDialog } from "@/components";
import { Dialogs } from "@/types";

const props = defineProps({
  variant: {
    type: String as PropType<"delete" | "abandon" | "kickUser">,
    required: true,
  },
  identification: {
    type: String as PropType<Dialogs>,
    required: true,
  },
  text: {
    type: String,
    required: false,
  },
  confirm: {
    type: Function as PropType<() => void>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
  },
});

const DialogData = computed(() => {
  switch (props.variant) {
    case "delete":
      return {
        defaultText:
          "Do you want to delete this room? This action is irreversible.",
        ButtonIcon: "mdi-exclamation-thick",
        ButtonLabel: "Delete",
      };
    case "kickUser":
      return {
        defaultText: "Do you want to kick the user out of the room?",
        ButtonIcon: "mdi-karate",
        ButtonLabel: "Kick",
      };
    default:
      return {
        defaultText: "Do you want to abandon this room?",
        ButtonIcon: "mdi-exit-run",
        ButtonLabel: "Abandon",
      };
  }
});
</script>

<style lang="scss" scoped></style>
