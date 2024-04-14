<template>
  <v-form
    v-model="form"
    class="form-wrapper"
    @submit.prevent="onSubmit"
    validate-on="input lazy"
  >
    <TextField
      v-model.trim="text"
      :label="label"
      keydown.enter="submit"
      :rules="[
        maxChars(props.maxTextLength),
        maxOptionsValidation,
        duplicatesValidation,
      ]"
    />
    <ButtonIcon type="submit" icon="mdi-plus" />
  </v-form>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";
import { ButtonIcon, TextField } from "@/components";
import { maxChars } from "@/utils/validation";

const props = defineProps({
  textList: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  label: {
    type: String,
    default: "",
  },
  maxListLength: {
    type: Number,
    default: 10,
  },
  maxTextLength: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["appendText"]);

const form = ref(false);
const text = ref("");

const maxOptionsValidation = () =>
  props.textList.length < props.maxListLength ||
  text.value === "" ||
  `Max ${props.maxListLength} options`;
const duplicatesValidation = (value: string) =>
  !props.textList.includes(value) || "No duplicates allowed";

const onSubmit = () => {
  if (!form.value || text.value === "") return;
  emit("appendText", text.value);
  text.value = "";
};
</script>

<style scoped lang="scss">
.form-wrapper {
  display: flex;
  gap: 1rem;
}
</style>
