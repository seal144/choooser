<template>
  <v-responsive class="text-center fill-height home-view">
    <HeaderCard
      >&#128075; Hello {{ displayName ? displayName : "Traveler" }}</HeaderCard
    >
    <JoinCreateRoomDialog variant="join" />
    <JoinCreateRoomDialog variant="create" />
    <HeaderCard v-if="ownedRooms.length || guestRooms.length"
      >Your Rooms</HeaderCard
    >
    <Button v-for="room in ownedRooms" :key="room.id"
      >{{ room.name }} (hosted)</Button
    >
    <Button v-for="room in guestRooms" :key="room.id">{{ room.name }}</Button>
  </v-responsive>
</template>

<script lang="ts" setup>
import { toRef } from "vue";
import Button from "@/components/Button.vue";
import JoinCreateRoomDialog from "@/components/JoinCreateRoomDialog.vue";
import HeaderCard from "@/components/HeaderCard.vue";
import getOwnedRooms from "@/composables/getOwnedRooms";
import getGuestRooms from "@/composables/getGuestedRooms";
import { useUserStore } from "@/store/userStore";

const displayName = toRef(useUserStore(), "displayName");
const { ownedRooms } = getOwnedRooms();
const { guestRooms } = getGuestRooms();
</script>

<style lang="scss">
.home-view.v-responsive {
  max-width: 400px;
  margin: 0 auto;

  .v-responsive__content {
    display: flex;
    gap: 1rem;
    flex-direction: column;
  }
}
</style>
