<template>
  <v-responsive class="text-center fill-height home-view">
    <HeaderCard
      >&#128075; Hello {{ user ? user.displayName : "traveler" }}</HeaderCard
    >
    <JoinCreateRoomDialog variant="join" />
    <JoinCreateRoomDialog variant="create" />
    <HeaderCard>Your Rooms</HeaderCard>
    <Button v-for="room in mockedRooms" :key="room.id">{{ room.name }}</Button>
  </v-responsive>
</template>

<script lang="ts" setup>
import Button from "@/components/Button.vue";
import JoinCreateRoomDialog from "@/components/JoinCreateRoomDialog.vue";
import HeaderCard from "@/components/HeaderCard.vue";
import getUser from "@/composables/getUser";

const { user } = getUser();

const mockedRooms = [
  { id: "1", name: "room1" },
  { id: "2", name: "room2" },
];
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
