<template>
  <Dialog
    :identification="dialogIdentification"
    :title="title"
    :close-label="closeLabel"
    size="small"
  >
    <template v-slot:ActivatorButtonLabel>
      <slot name="activatorButton" class="activatorButton"></slot>
    </template>
    <template v-slot:content>
      {{ text }}
    </template>
    <template v-slot:action>
      <Button
        v-if="confirmLabel"
        @click="confirmAction"
        :loading="loading"
        :danger="danger"
        ><v-icon
          :icon="confirmIcon"
          size="large"
          v-if="smAndUp && confirmIcon"
        />{{ confirmLabel }}</Button
      >
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { useDisplay } from "vuetify";

import { Button, Dialog } from "@/components";
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
  confirmLabel: {
    type: String,
    required: false,
  },
  confirmIcon: {
    type: String,
    required: false,
  },
  confirmAction: {
    type: Function as PropType<() => void>,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  danger: {
    type: Boolean,
    default: false,
  },
});

const { smAndUp } = useDisplay();
</script>

<style lang="scss" scoped></style>
