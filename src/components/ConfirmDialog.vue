<template>
  <Dialog
    :identification="dialogIdentification"
    :title="title"
    :close-label="closeLabel"
    small
  >
    <template v-slot:ActivatorButtonLabel>
      <slot name="activatorButton" class="activatorButton"></slot>
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
import { PropType } from "vue";

import { Dialog } from "@/components";
import { Dialogs } from "@/types";

defineProps({
  title: {
    type: String,
    required: false,
  },
  closeLabel: {
    type: String,
    default: "Cancel",
  },
  text: {
    type: String,
    required: true,
  },
  dialogIdentification: {
    type: String as PropType<Dialogs>,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
