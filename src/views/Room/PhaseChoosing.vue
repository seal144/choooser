<template>
  <div>
    <OptionsList
      :options="options"
      @updateOptions="updateOptions"
      :readOnlyMode="isChoiceConfirmed"
    />
    <div v-if="options.length >= 2">
      <Button
        v-if="!isChoiceConfirmed"
        @click="handleConfirmChoice(true)"
        block
        :loading="loading"
        >Confirm choice</Button
      >
      <Button v-else @click="handleConfirmChoice(false)" block :loading="false">
        Correct choice
      </Button>
    </div>
  </div>
  <Snackbar
    v-model="snackbarConfirmError"
    :text="`Saving choice ${CommonErrors.DefaultSuffix}`"
  />
</template>

<script setup lang="ts">
import { onUnmounted, ref, PropType, toRef } from "vue";

import { useRoomStore } from "@/store/roomStore";
import getUser from "@/composables/getUser";
import useConfirmChoice from "@/composables/useConfirmChoice";
import { Button, OptionsList, Snackbar } from "@/components";
import { CommonErrors, Phase } from "@/types";

defineProps({
  isChoiceConfirmed: {
    type: Boolean as PropType<boolean | undefined>,
    required: false,
  },
});

const room = toRef(useRoomStore(), "room");
const { user } = getUser();
const { saveChoice, confirmChoice, loading, error } = useConfirmChoice();

const setInitialOptions = () => {
  const userChoice = room.value?.choices.find(
    (choice) => choice.userId === user.value?.uid
  );
  if (userChoice) {
    return userChoice.ranking;
  } else if (room.value) {
    return room.value.options;
  }
  return [];
};

const options = ref(setInitialOptions());
const snackbarConfirmError = ref(false);

const updateOptions = (newOptions: string[]) => {
  options.value = newOptions;
};

const handleConfirmChoice = async (confirm: boolean) => {
  await confirmChoice(options.value, confirm);

  if (error.value) {
    snackbarConfirmError.value = true;
  }
};

onUnmounted(() => {
  if (
    room.value?.phase === Phase.SettingOptions ||
    room.value?.phase === Phase.Results
  ) {
    return;
  }
  saveChoice(options.value);
});
</script>

<style scope lang="scss"></style>
