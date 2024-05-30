<template>
  <Dialog
    v-if="room?.result"
    :identification="Dialogs.ResultDetails"
    title="Confirmed choices"
    close-label="close"
    size="large"
    actionsWithBorder
  >
    <template v-slot:content>
      <div class="dialog-content">
        <ExtensionPanelSingle
          v-for="choice in confirmedChoicesSorted"
          :key="choice.userId"
          :title="getUserDisplayName(choice.userId)"
          small
        >
          <div class="options-list-wrapper">
            <OptionsList :options="choice.ranking" readOnlyMode />
          </div>
        </ExtensionPanelSingle>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, toRef } from "vue";
import { useRoomStore } from "@/store/roomStore";
import { Dialog, ExtensionPanelSingle, OptionsList } from "./";
import { Dialogs } from "@/types";

const room = toRef(useRoomStore(), "room");

const confirmedChoicesSorted = computed(() => {
  if (room.value && room.value.result?.confirmedChoices) {
    const idOrderMap = room.value.allParticipants.map((user) => user.id);

    return [...room.value.result.confirmedChoices].sort((a, b) => {
      const aPosition = idOrderMap.findIndex((id) => id === a.userId);
      const bPosition = idOrderMap.findIndex((id) => id === b.userId);
      return aPosition - bPosition;
    });
  }

  return [];
});

const getUserDisplayName = (userId: string): string => {
  const user = room.value?.allParticipants.find(
    (participant) => participant.id === userId
  );

  return user?.displayName || "";
};
</script>

<style scoped lang="scss">
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.options-list-wrapper {
  margin: 0 -1rem -0.5rem;
}
</style>
