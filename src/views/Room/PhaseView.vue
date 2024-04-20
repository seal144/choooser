<template>
  <HeaderCard class="phase-description">
    {{ phaseDescription }}
  </HeaderCard>
  <CreateOptionsList v-if="isOwner" />
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";

import { useRoomStore } from "@/store/roomStore";
import { HeaderCard, CreateOptionsList } from "@/components";
import getUser from "@/composables/getUser";
import { Phase } from "@/types";

const room = toRef(useRoomStore(), "room");

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
</script>

<style scoped lang="scss">
.phase-description {
  margin-bottom: 1rem;
}
</style>
