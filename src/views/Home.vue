<template>
  <v-responsive class="text-center fill-height home-view">
    <v-card>Hello {{ mockedUser }}</v-card>
    <v-btn>
      <v-icon icon="mdi-login" size="large" start />
      Join room
    </v-btn>
    <v-btn>
      <v-icon icon="mdi-plus" size="large" start />
      Add new room
    </v-btn>
    <v-card>Your Rooms</v-card>
    <v-btn v-for="room in mockedRooms" :key="room.id">{{ room.name }}</v-btn>
  </v-responsive>
</template>

<script lang="ts" setup>
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
