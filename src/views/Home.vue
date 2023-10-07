<template>
  <v-responsive class="text-center fill-height home-view">
    <HeaderCard>Hello {{ mockedUser }}</HeaderCard>
    <JoinCreateRoomDialog variant="join" />
    <JoinCreateRoomDialog variant="create" />
    <HeaderCard>Your Rooms</HeaderCard>
    <v-btn v-for="room in mockedRooms" :key="room.id">{{ room.name }}</v-btn>
  </v-responsive>
</template>

<script lang="ts" setup>
import JoinCreateRoomDialog from "@/components/JoinCreateRoomDialog.vue";
import HeaderCard from "@/components/HeaderCard.vue";

const mockedUser = "Rafał";
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
