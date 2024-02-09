<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        {{ title }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <slot></slot>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
