<template>
  <HeaderCard class="phase-description">
    {{ phaseDescription }}
  </HeaderCard>
  <CreateOptionsList v-if="room?.phase === Phase.SettingOptions && isOwner" />
  <div v-else-if="options.length && room?.phase === Phase.Choosing">
    <OptionsList :options="options" @updateOptions="updateOptions" />
    <Button v-if="options.length >= 2" type="submit" block :loading="false"
      >Confirm choice</Button
    >
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from "vue";

import { useRoomStore } from "@/store/roomStore";
import CreateOptionsList from "./CreateOptionsList.vue";
import { Button, HeaderCard, OptionsList } from "@/components";
import getUser from "@/composables/getUser";
import { Phase } from "@/types";

const room = toRef(useRoomStore(), "room");
//TO DO - handle situation when admin reverse the phase and edit some options
const options = ref<string[]>(room.value ? room.value.options : []);

const { user } = getUser();

const isOwner = room.value?.owner.id === user.value?.uid;

const phaseDescription = computed(() => {
  if (room.value) {
    switch (room.value.phase) {
      case Phase.SettingOptions:
        if (isOwner) {
          return "Firstly, as the room host, provide options for choosing.";
        } else return "Wait for the room host to provide options for choosing";
      case Phase.Choosing:
        return "Please, rank the options from best to worst according to your personal preferences and confirm.";
      case Phase.Results:
        return "The choosing is done. These are the results.";
    }
  }
  return "Oops, the unexpected error has occurred! There is no room data please try again later.";
});

const updateOptions = (newOptions: string[]) => {
  options.value = newOptions;
};
</script>

<style scoped lang="scss">
.phase-description {
  margin-bottom: 1rem;
}
</style>
