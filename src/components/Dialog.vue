<template>
  <v-dialog
    v-model="isOpen"
    width="500"
    transition="dialog-top-transition"
    class="default-dialog"
  >
    <template v-slot:activator>
      <div @click="isOpen = true">
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
          <Button @click="isOpen = false" v-if="closeLabel">{{
            closeLabel
          }}</Button>
          <slot name="action"></slot>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useDisplay } from "vuetify";

import Button from "./Button.vue";

const emit = defineEmits(["close"]);

const isOpen = ref(false);

watch(isOpen, () => {
  if (!isOpen.value) {
    emit("close");
  }
});

const { xs } = useDisplay();

defineProps({
  title: {
    type: String,
    required: false,
  },
  closeLabel: {
    type: String,
    required: false,
  },
});
</script>

<style lang="scss">
.default-dialog {
  div.v-card-title {
    padding: 0.125rem 2rem;

    &.xs {
      padding: 0.125rem 0.5rem;
    }
  }

  div.v-card-text {
    padding: 1.5rem 2rem 0rem !important;

    &.xs {
      padding: 1.5rem 0.5rem 0rem !important;
    }
  }

  div.v-card-actions {
    padding: 0.5rem 2rem 1.5rem;
    gap: 1.875rem;

    &.xs {
      gap: 0.5rem;
      padding: 0.5rem;
    }

    & .v-btn {
      flex: 1;
    }
  }
}
</style>
