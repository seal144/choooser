<template>
  <v-form @submit.prevent="onSubmit" validate-on="blur lazy">
    <v-form
      v-model="formOption"
      class="form-option"
      @submit.prevent="onSubmitOption"
      validate-on="submit lazy"
    >
      <TextField
        v-model.trim="option"
        label="Option"
        keydown.enter="submit"
        :rules="optionInputValidation"
      />
      <ButtonIcon type="submit" icon="mdi-plus" />
    </v-form>
    <OptionsList
      v-if="options.length"
      :options="options"
      @updateOptions="updateOption"
    />
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ButtonIcon, OptionsList, TextField } from "@/components";
import { maxOptionsInRoom, optionValidation } from "@/utils/validation";

const formOption = ref(false);
const option = ref("");
const options = ref<string[]>([]);

const maxOptionsValidation = () =>
  options.value.length < maxOptionsInRoom ||
  option.value === "" ||
  `Max ${maxOptionsInRoom} options`;
const duplicatesValidation = (value: string) =>
  !options.value.includes(value) || "No duplicates allowed";

const optionInputValidation = [
  ...optionValidation,
  maxOptionsValidation,
  duplicatesValidation,
];

const updateOption = (newOptions: string[]) => {
  options.value = newOptions;
};

const onSubmitOption = () => {
  const isValid = optionInputValidation.every((validation) => {
    return validation(option.value) === true;
  });
  if (!isValid || option.value === "") return;
  options.value.push(option.value);
  option.value = "";
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
