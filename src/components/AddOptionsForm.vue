<template>
  <v-form @submit.prevent="onSubmit" validate-on="blur lazy">
    <v-form
      v-model="formOption"
      class="form-option"
      @submit.prevent="onSubmitOption"
      validate-on="blur lazy"
    >
      <TextField
        v-model.trim="option"
        label="Option"
        :rules="[
          ...optionValidation,
          maxOptionsValidation,
          duplicatesValidation,
        ]"
      />
      <ButtonIcon type="submit" icon="mdi-plus" />
    </v-form>
    {{ options }}
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ButtonIcon, TextField } from "@/components";
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

const onSubmitOption = () => {
  if (!formOption.value || option.value === "") return;
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
