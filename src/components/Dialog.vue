<template>
  <v-dialog
    v-model="dialogs.isOpen[props.identification]"
    :width="small ? '400' : '500'"
    transition="dialog-top-transition"
    class="default-dialog"
    :class="{ small }"
  >
    <template v-slot:activator>
      <div @click="openDialog" class="activator-container">
        <slot name="ActivatorButtonLabel"></slot>
      </div>
    </template>

    <template v-slot:default>
      <v-card>
        <v-card-title v-if="title" :class="{ xs: xs }">{{
          title
        }}</v-card-title>
        <v-divider v-if="title"></v-divider>
        <v-card-text :class="{ xs: xs }">
          <slot name="content"></slot>
        </v-card-text>
        <v-card-actions :class="{ xs: xs }">
          <Button @click="closeDialog" v-if="closeLabel">{{
            closeLabel
          }}</Button>
          <slot name="action"></slot>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import { watchEffect, PropType } from "vue";
import { useDisplay } from "vuetify";

import { useDialogsStore } from "@/store/dialogs";
import Button from "./Button.vue";
import { Dialogs } from "@/types";

const { xs } = useDisplay();

const props = defineProps({
  identification: {
    type: String as PropType<Dialogs>,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  closeLabel: {
    type: String,
    required: false,
  },
  small: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const dialogs = useDialogsStore();

const openDialog = () => {
  dialogs.isOpen[props.identification] = true;
};

const closeDialog = () => {
  dialogs.isOpen[props.identification] = false;
};

watchEffect(() => {
  if (!dialogs.isOpen[props.identification]) {
    emit("close");
  }
});
</script>

<style lang="scss">
.default-dialog {
  .activator-container {
    width: fit-content;
  }

  .v-card-title {
    padding: 0.125rem 2rem;

    &.xs {
      padding: 0.125rem 0.5rem;
    }
  }

  .v-card-text {
    padding: 2rem !important;

    &.xs {
      padding: 1.5rem 0.5rem 1.5rem !important;
    }
  }

  .v-card-actions {
    padding: 0 2rem 1.5rem;
    gap: 1.875rem;
    min-height: unset;

    &.xs {
      gap: 0.5rem;
      padding: 0 0.5rem 0.5rem;
    }

    & .v-btn {
      flex: 1;
      margin-inline-start: 0 !important;
    }
  }
}

.default-dialog.small {
  margin: 0 1rem;

  .v-card-title {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .v-card-text {
    padding: 1rem !important;

    &.xs {
      padding: 0.5rem !important;
    }
  }

  .v-card-actions {
    padding: 0 1rem 1rem;
    gap: 1rem;

    &.xs {
      gap: 0.5rem;
      padding: 0.5rem;
    }
  }
}
</style>
