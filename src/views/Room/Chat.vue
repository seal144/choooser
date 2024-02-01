<template>
  <div class="chat-wrapper">
    <v-card class="chat-window"></v-card>
    <div>
      <v-form v-model="form" @submit.prevent="sendMessage">
        <Textarea
          :rules="[...messageValidation]"
          v-model="message"
          placeholder="Write some nice 😉"
        />
        <div class="actions">
          <ButtonIcon icon="mdi-send" type="submit" />
        </div>
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { ButtonIcon, Textarea } from "@/components";
import { messageValidation } from "@/utils/validation";

const form = ref(false);
const message = ref("");

const sendMessage = () => {
  if (!form.value || !message.value.trim()) return;
  console.log(message.value);
};
</script>

<style scoped lang="scss">
.chat-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .chat-window {
    flex: 1;
  }

  .actions {
    width: fit-content;
    margin-left: auto;
    margin-top: -0.8rem;
  }
}
</style>
