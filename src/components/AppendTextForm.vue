<template>
  <v-form
    class="form-wrapper"
    @submit.prevent="onSubmit"
    validate-on="input lazy"
    v-click-outside="cancelEdit"
  >
    <TextField
      v-model.trim="text"
      :label="label"
      @keydown.enter="onSubmit"
      @keydown.esc="cancelEdit"
      :rules="validation"
    />
    <ButtonIcon type="submit" :icon="buttonIcon" />
  </v-form>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue";
import { ButtonIcon, TextField } from "@/components";
import { maxChars } from "@/utils/validation";

const props = defineProps({
  defaultValue: {
    type: String,
    default: "",
  },
  editMode: {
    type: Boolean,
    default: false,
  },
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

const emit = defineEmits(["appendText", "cancelEdit"]);

const text = ref(props.defaultValue);
const buttonIcon = props.editMode ? "mdi-check-bold" : "mdi-plus-thick";

const maxOptionsValidation = () =>
  props.textList.length < props.maxListLength ||
  text.value === "" ||
  `Max ${props.maxListLength} options`;
const duplicatesValidation = (value: string) =>
  !props.textList.includes(value) || "No duplicates allowed";

const validation = [
  maxChars(props.maxTextLength),
  maxOptionsValidation,
  duplicatesValidation,
];

const cancelEdit = () => {
  if (props.editMode) {
    emit("cancelEdit");
  }
};

const onSubmit = () => {
  const isValid = validation.every((rule) => {
    return rule(text.value) === true;
  });
  if (!isValid || text.value === "") return;
  emit("appendText", text.value);
  text.value = "";
};
</script>

<style scoped lang="scss">
.form-wrapper {
  width: 100%;
  display: flex;
  gap: 0.5rem;
}
</style>
