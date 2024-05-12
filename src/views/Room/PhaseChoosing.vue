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
        :loading="loadingConfirmChoice"
        >Confirm choice</Button
      >
      <Button
        v-else
        @click="handleConfirmChoice(false)"
        block
        :loading="loadingConfirmChoice"
      >
        <v-icon icon="mdi-pencil" size="large" />Correct choice
      </Button>
    </div>
    <div v-if="room && isChoiceConfirmed">
      <HeaderCard
        v-if="room.participantsIdsStillChoosing.length"
        class="mt-12 mb-4"
        >Participants still choosing:</HeaderCard
      >
      <HeaderCard v-else class="mt-12 mb-4"
        >All of the participants have made their choices.
        {{
          isOwner
            ? "To continue proceed to the result."
            : "Wait for the host to proceed to the result."
        }}</HeaderCard
      >
      <PersonCard
        v-for="participant in room.currentParticipants.filter((participant) =>
          room?.participantsIdsStillChoosing.includes(participant.id)
        )"
        :key="participant.id"
        :name="participant.displayName"
        :isPending="true"
        class="mb-4"
      />
      <Button
        v-if="isOwner"
        block
        :onClick="handleProceedToResult"
        :loading="loadingProceedToResult"
        >Proceed to result<v-icon icon="mdi-forward" size="large"
      /></Button>
    </div>
  </div>
  <ConfirmDialog
    :dialogIdentification="Dialogs.ConfirmProceedToResult"
    title="Are you sure?"
    text="Not all of the participants have confirmed their choice. As the host you can proceed, but the result will be calculated only based on the confirmed choices."
    confirmLabel="Proceed"
    confirmIcon="mdi-forward"
    :confirmAction="proceed"
    :loading="loadingProceedToResult"
  />
  <Snackbar
    v-model="snackbarConfirmError"
    :text="`Saving choice ${CommonErrors.DefaultSuffix}`"
  />
  <Snackbar
    v-model="snackbarProceedError"
    :text="`Proceeding to result ${CommonErrors.DefaultSuffix}`"
  />
</template>

<script setup lang="ts">
import { onUnmounted, ref, PropType, toRef } from "vue";

import { useRoomStore } from "@/store/roomStore";
import { useDialogsStore } from "@/store/dialogs";
import getUser from "@/composables/getUser";
import useConfirmChoice from "@/composables/useConfirmChoice";
import useProceedToResult from "@/composables/useProceedToResult";
import {
  Button,
  ConfirmDialog,
  HeaderCard,
  OptionsList,
  PersonCard,
  Snackbar,
} from "@/components";
import { CommonErrors, Phase, Dialogs } from "@/types";

const props = defineProps({
  isChoiceConfirmed: {
    type: Boolean as PropType<boolean | undefined>,
    required: false,
  },
  isOwner: {
    type: Boolean,
    required: true,
  },
});

const room = toRef(useRoomStore(), "room");
const { user } = getUser();
const {
  saveChoice,
  confirmChoice,
  loading: loadingConfirmChoice,
  error: errorConfirmChoice,
} = useConfirmChoice();
const {
  proceedToResult,
  loading: loadingProceedToResult,
  error: errorProceedToResult,
} = useProceedToResult();
const dialogs = useDialogsStore();

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
const snackbarProceedError = ref(false);

const updateOptions = (newOptions: string[]) => {
  options.value = newOptions;
};

const handleConfirmChoice = async (confirm: boolean) => {
  await confirmChoice(options.value, confirm);

  if (errorConfirmChoice.value) {
    snackbarConfirmError.value = true;
  }
};

const proceed = async () => {
  await proceedToResult();

  if (errorProceedToResult.value) {
    snackbarProceedError.value = true;
  } else {
    dialogs.isOpen[Dialogs.ConfirmProceedToResult] = false;
  }
};

const handleProceedToResult = async () => {
  if (room.value?.participantsIdsStillChoosing.length) {
    dialogs.isOpen[Dialogs.ConfirmProceedToResult] = true;
  } else {
    await proceed();
  }
};

onUnmounted(() => {
  if (
    room.value?.phase === Phase.SettingOptions ||
    room.value?.phase === Phase.Result ||
    props.isChoiceConfirmed ||
    !room.value?.guestsIds.includes(user.value?.uid ? user.value?.uid : "")
  ) {
    return;
  }
  saveChoice(options.value);
});
</script>

<style scope lang="scss"></style>
