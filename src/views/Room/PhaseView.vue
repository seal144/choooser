<template>
  <HeaderCard class="phase-description">
    {{ phaseDescription }}
  </HeaderCard>
  <PhaseSettingOptions
    v-if="room?.phase === Phase.SettingOptions"
    :isOwner="isOwner"
  />
  <PhaseChoosing
    v-else-if="room?.phase === Phase.Choosing"
    :isChoiceConfirmed="isUserConfirmedChoice"
    :isOwner="isOwner"
  />
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";

import { useRoomStore } from "@/store/roomStore";
import PhaseSettingOptions from "./PhaseSettingOptions.vue";
import PhaseChoosing from "./PhaseChoosing.vue";
import { HeaderCard } from "@/components";
import getUser from "@/composables/getUser";
import { Phase } from "@/types";

const room = toRef(useRoomStore(), "room");
const { user } = getUser();

const isOwner = room.value?.owner.id === user.value?.uid;
const isUserConfirmedChoice = computed(() => {
  return room.value?.choices.find((choice) => choice.userId === user.value?.uid)
    ?.confirmed;
});

const phaseDescription = computed(() => {
  if (room.value) {
    switch (room.value.phase) {
      case Phase.SettingOptions:
        if (isOwner) {
          return "Firstly, as the room host, provide options for choosing.";
        } else return "Wait for the room host to provide options for choosing";
      case Phase.Choosing:
        if (!isUserConfirmedChoice.value) {
          return "Please, rank the options from best to worst according to your personal preferences and confirm.";
        } else return "Your choice is saved. Now wait for other participants.";
      case Phase.Result:
        return "The choosing is done 🙌 This is the result.";
    }
  }
  return "Oops, the unexpected error has occurred! There is no room data please try again later.";
});
</script>

<style scoped lang="scss">
.phase-description {
  margin-bottom: 3rem;
}
</style>
