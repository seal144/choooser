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
    <Button v-if="options.length >= 2" type="submit" block
      >Confirm options</Button
    >
  </v-form>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue";

import { useRoomStore } from "@/store/roomStore";
import { AppendTextForm, Button, OptionsList } from "@/components";
import useConfirmOptions from "@/composables/useConfirmOptions";
import { maxOptionsInRoom, maxOptionLength } from "@/utils/validation";

const { room } = useRoomStore();

const { saveOptions } = useConfirmOptions();

const options = ref<string[]>(room ? room.options : []);

onUnmounted(() => {
  saveOptions(options.value);
});

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
