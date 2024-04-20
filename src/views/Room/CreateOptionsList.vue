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
    <Button v-if="options.length >= 2" type="submit" block :loading="loading"
      >Confirm options</Button
    >
  </v-form>
  <Snackbar
    v-model="snackbarSubmitError"
    :text="`Confirming options ${CommonErrors.DefaultSuffix}`"
  />
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue";

import { useRoomStore } from "@/store/roomStore";
import { AppendTextForm, Button, OptionsList, Snackbar } from "@/components";
import useConfirmOptions from "@/composables/useConfirmOptions";
import { maxOptionsInRoom, maxOptionLength } from "@/utils/validation";
import { CommonErrors } from "@/types";

const { room } = useRoomStore();

const { saveOptions, confirmOptions, loading, error } = useConfirmOptions();

const options = ref<string[]>(room ? room.options : []);
const snackbarSubmitError = ref(false);

onUnmounted(() => {
  saveOptions(options.value);
});

const appendOption = (newOption: string) => {
  options.value.push(newOption);
};

const updateOptions = (newOptions: string[]) => {
  options.value = newOptions;
};

const onSubmit = async () => {
  await confirmOptions(options.value);

  if (error.value) {
    snackbarSubmitError.value = true;
  }
};
</script>

<style scoped lang="scss">
.form-option {
  display: flex;
  gap: 1rem;
}
</style>
