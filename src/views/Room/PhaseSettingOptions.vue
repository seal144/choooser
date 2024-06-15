<template>
  <v-form v-if="isOwner" @submit.prevent="onSubmit">
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
      createListMode
      class="options-list"
    />
    <Button
      v-if="options.length >= 2"
      type="submit"
      block
      :loading="loading"
      class="mt-4"
      >Confirm options</Button
    >
    <Snackbar
      v-model="snackbarSubmitError"
      :text="`Confirming options ${CommonErrors.DefaultSuffix}`"
    />
  </v-form>
  <div class="loading" v-else>
    <v-progress-circular
      indeterminate
      :size="defaultCircularProgressSize"
      :width="lineThickness"
    ></v-progress-circular>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, toRef } from "vue";

import { defaultCircularProgressSize, lineThickness } from "@/plugins/vuetify";
import { useRoomStore } from "@/store/roomStore";
import { AppendTextForm, Button, OptionsList, Snackbar } from "@/components";
import useConfirmOptions from "@/composables/useConfirmOptions";
import { maxOptionsInRoom, maxOptionLength } from "@/utils/validation";
import { CommonErrors, Phase } from "@/types";

defineProps({
  isOwner: {
    type: Boolean,
    required: true,
  },
});

const room = toRef(useRoomStore(), "room");

const { saveOptions, confirmOptions, loading, error } = useConfirmOptions();

const options = ref<string[]>(room.value ? room.value.options : []);
const snackbarSubmitError = ref(false);

onUnmounted(() => {
  if (
    room.value?.phase === Phase.Choosing ||
    room.value?.phase === Phase.Result
  ) {
    return;
  }
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
.options-list {
  margin-top: 0.5rem;
}
.loading {
  width: fit-content;
  margin: 0 auto;
}
</style>
