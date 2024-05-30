<template>
  <v-lazy
    transition="fade-transition"
    v-if="isMounted"
    @vue:updated="emit('updated')"
  >
    <div>
      <Message
        v-for="(message, index) in messagesChunk"
        :key="index"
        :message="message"
        :allParticipants="allParticipants"
      />
    </div>
  </v-lazy>
</template>

<script setup lang="ts">
import { PropType } from "vue";

import Message from "./Message.vue";
import { Message as IMessage, User } from "@/types";

defineProps({
  messagesChunk: {
    type: Array as PropType<IMessage[]>,
    required: true,
  },
  allParticipants: {
    type: Array as PropType<User[]>,
    required: true,
  },
  isMounted: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["updated"]);
</script>

<style scoped lang="scss"></style>
