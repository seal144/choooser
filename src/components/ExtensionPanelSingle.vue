<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title class="title" :class="{ xs }">
        {{ title }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <slot></slot>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const { xs } = useDisplay();

defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 18px;
  padding: 0.5rem 1rem;
  min-height: unset;

  &.xs {
    padding: 0.5rem;
  }
}

.v-expansion-panel--active > .v-expansion-panel-title {
  min-height: 2.75rem;
}
</style>
