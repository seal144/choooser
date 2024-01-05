<template>
  <v-responsive class="text-center fill-height home-view">
    <HeaderCard
      >&#128075; Hello {{ displayName ? displayName : "Traveler" }}</HeaderCard
    >
    <v-progress-circular
      v-if="showProgress"
      indeterminate
      size="36"
      :width="lineThickness"
    ></v-progress-circular>
    <template v-else>
      <JoinCreateRoomDialog variant="join" />
      <JoinCreateRoomDialog variant="create" />
      <HeaderCard v-if="ownedRooms.length">Owned Rooms</HeaderCard>
      <Button v-for="room in ownedRooms" :key="room.id">{{ room.name }}</Button>
      <HeaderCard v-if="guestedRooms.length">Joined Rooms</HeaderCard>
      <Button v-for="room in guestedRooms" :key="room.id">{{
        room.name
      }}</Button>
    </template>
  </v-responsive>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, toRef, onBeforeUnmount } from "vue";
import Button from "@/components/Button.vue";
import JoinCreateRoomDialog from "@/components/JoinCreateRoomDialog.vue";
import HeaderCard from "@/components/HeaderCard.vue";
import getOwnedRooms from "@/composables/subscribeOwnedRooms";
import getGuestRooms from "@/composables/subscribeGuestedRooms";
import { useUserStore } from "@/store/userStore";
import { lineThickness } from "@/plugins/vuetify";

const displayName = toRef(useUserStore(), "displayName");
const { ownedRooms } = getOwnedRooms();
const { guestedRooms } = getGuestRooms();
const hideLoading = ref(false);
let delayedHideLoading: NodeJS.Timeout;

onMounted(() => {
  delayedHideLoading = setTimeout(() => {
    hideLoading.value = true;
  }, 1500);
});

onBeforeUnmount(() => {
  clearTimeout(delayedHideLoading);
});

const showProgress = computed(() => {
  if (
    !ownedRooms.value.length &&
    !guestedRooms.value.length &&
    !hideLoading.value
  ) {
    return true;
  }
  return false;
});
</script>

<style lang="scss">
.home-view.v-responsive {
  max-width: 400px;
  margin: 0 auto;

  .v-responsive__content {
    display: flex;
    gap: 1rem;
    flex-direction: column;

    .v-progress-circular {
      margin: 0 auto;
    }
  }
}
</style>
