<template>
  <v-dialog
    v-model="dialogs.isOpen[props.identification]"
    :width="dialogWidth"
    transition="dialog-top-transition"
    class="default-dialog"
    :class="{ small: size === 'small' }"
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
        <v-card-actions :class="{ xs, 'actions-bordered': actionsWithBorder }">
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
import { computed, watchEffect, PropType } from "vue";
import { useDisplay } from "vuetify";

import { useDialogsStore } from "@/store/dialogs";
import { Button } from "@/components";
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
  size: {
    type: String as PropType<"small" | "large">,
    required: false,
  },
  actionsWithBorder: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const dialogs = useDialogsStore();

const dialogWidth = computed(() => {
  switch (props.size) {
    case "small":
      return 380;
    case "large":
      return 800;
    default:
      return 500;
  }
});

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
@import "../styles/settings.scss";

$vertical-actions-padding: 1rem;
$vertical-actions-padding-xs: 0.5rem;

// overwrites default Dialog width to be wider on small screens
.v-dialog > div.v-overlay__content {
  margin: 0.5rem;
  max-width: calc(100% - 1rem);
}

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
    max-height: 90vh;
    overflow: auto;

    &.xs {
      padding: 1.5rem 0.5rem 1.5rem !important;
    }
  }

  .v-card-actions {
    padding: 0 2rem $vertical-actions-padding;
    gap: 1.875rem;
    min-height: unset;

    &.xs {
      gap: 0.5rem;
      padding: 0 0.5rem $vertical-actions-padding-xs;
    }

    &.actions-bordered {
      border-top: $border-style;
      padding-top: $vertical-actions-padding;

      &.xs {
        padding-top: $vertical-actions-padding-xs;
      }
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
