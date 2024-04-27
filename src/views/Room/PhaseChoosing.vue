<template>
  <div>
    <OptionsList :options="options" @updateOptions="updateOptions" />
    <Button v-if="options.length >= 2" type="submit" block :loading="loading"
      >Confirm choice</Button
    >
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, toRef } from "vue";

import { useRoomStore } from "@/store/roomStore";
import getUser from "@/composables/getUser";
import useConfirmChoice from "@/composables/useConfirmChoice";
import { Button, OptionsList } from "@/components";
import { Phase } from "@/types";

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

const updateOptions = (newOptions: string[]) => {
  options.value = newOptions;
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
