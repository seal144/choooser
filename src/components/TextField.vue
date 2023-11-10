<template>
  <v-text-field
    class="component-text-field"
    :label="props.label"
    variant="outlined"
    validate-on="blur"
    :rules="rules"
    rounded="0"
    :readonly="loading"
  ></v-text-field>
</template>

<script setup lang="ts">
import { PropType } from "vue";

type ValidationRule = (value: string) => true | string;

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  rules: {
    type: Array as PropType<ValidationRule[]>,
    required: false,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<style lang="scss">
div.component-text-field input.v-field__input {
  min-height: 0;
  height: 36px;
}
</style>
