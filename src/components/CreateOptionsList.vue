<template>
  <v-form @submit.prevent="onSubmit">
    <AppendTextForm
      :textList="options"
      label="Option"
      :maxListLength="maxOptionsInRoom"
      :maxTextLength="maxOptionLength"
      @appendText="appendOption"
    />
    <OptionsList
      v-if="options.length"
      :options="options"
      @updateOptions="updateOptions"
    />
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { AppendTextForm, OptionsList } from "@/components";
import { maxOptionsInRoom, maxOptionLength } from "@/utils/validation";

const options = ref<string[]>([]);

const appendOption = (newOption: string) => {
  options.value.push(newOption);
};

const updateOptions = (newOptions: string[]) => {
  options.value = newOptions;
};

const onSubmit = () => {
  console.log("onSubmit");
};
</script>

<style scoped lang="scss">
.form-option {
  display: flex;
  gap: 1rem;
}
</style>
