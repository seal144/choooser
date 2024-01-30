<template>
  <ConfirmDialog
    :dialogIdentification="DialogData.identification"
    title="Are you sure?"
    :text="text ? text : DialogData.defaultText"
  >
    <template v-slot:confirmButton>
      <Button :danger="variant === 'delete'" @click="confirm" :loading="loading"
        ><v-icon :icon="DialogData.ButtonIcon" size="large" v-if="smAndUp" />{{
          DialogData.ButtonLabel
        }}</Button
      >
    </template>
  </ConfirmDialog>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
import { useDisplay } from "vuetify";

import { Button, ConfirmDialog } from "@/components";
import { Dialogs } from "@/types";

const props = defineProps({
  variant: {
    type: String as PropType<"delete" | "abandon">,
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

const { smAndUp } = useDisplay();

const DialogData = computed(() => {
  switch (props.variant) {
    case "delete":
      return {
        identification: Dialogs.ConfirmDeleteRoom,
        defaultText:
          "Do you want to delete this room? This action is irreversible.",
        ButtonIcon: "mdi-exclamation-thick",
        ButtonLabel: "Delete",
      };
    default:
      return {
        identification: Dialogs.ConfirmAbandonRoom,
        defaultText: "Do you want to abandon this room?",
        ButtonIcon: "mdi-exit-run",
        ButtonLabel: "Abandon",
      };
  }
});
</script>

<style lang="scss" scoped></style>
