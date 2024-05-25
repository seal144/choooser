<template>
  <OptionsResult v-if="room?.result" :ranking="room.result.ranking" />
</template>

<script setup lang="ts">
import { OptionsResult } from "@/components";
import { useRoomStore } from "@/store/roomStore";

const { room } = useRoomStore();
</script>

<style></style>
