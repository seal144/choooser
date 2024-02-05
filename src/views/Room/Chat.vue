<template>
  <div class="chat-wrapper">
    <div
      class="chat-window"
      :class="{ smAndDown }"
      ref="chatWindow"
      @click="focusChatWindow"
      v-click-outside="unFocusChatWindow"
    >
      <div v-if="errorChat" class="chat-error">
        {{ errorChat }}
      </div>
      <v-progress-circular
        class="chat-loading"
        v-else-if="chat === null"
        indeterminate
        size="48"
        :width="lineThickness"
      ></v-progress-circular>
      <Message
        v-else
        v-for="message in chat"
        :key="message.createTime.nanoseconds"
        :message="message"
        :participantsList="[...room.guests, ...room.pastGuests, room.owner]"
      />
    </div>
    <div>
      <v-form v-model="form" @submit.prevent="submitMessage">
        <Textarea
          :rules="[...messageValidation]"
          v-model="message"
          placeholder="Write some nice 😉"
          @keypress.enter.exact.prevent="submitMessage"
          :error-messages="errorSendMessage ? errorSendMessage : []"
        />
        <div class="actions">
          <ButtonIcon icon="mdi-send" type="submit" />
        </div>
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType, watch } from "vue";
import { useDisplay } from "vuetify";

import { lineThickness } from "@/plugins/vuetify";
import { ButtonIcon, Textarea } from "@/components";
import Message from "./Message.vue";
import useSendMessage from "@/composables/useSendMessage";
import subscribeChat from "@/composables/subscribeChat";
import { messageValidation } from "@/utils/validation";
import { RoomDetailsData } from "@/types";

const props = defineProps({
  room: {
    type: Object as PropType<RoomDetailsData>,
    required: true,
  },
});

const { smAndDown } = useDisplay();
const { sendMessage, error: errorSendMessage } = useSendMessage();
const { chat, error: errorChat } = subscribeChat(props.room.id);

const form = ref(false);
const message = ref("");
const chatWindow = ref<HTMLDivElement | null>(null);
const isChatWindowFocused = ref(false);

const focusChatWindow = () => {
  isChatWindowFocused.value = true;
};
const unFocusChatWindow = () => {
  isChatWindowFocused.value = false;
};

watch(chat, async () => {
  // Not working properly without this await
  await (() => {})();
  scrollToBottom();
});

const scrollToBottom = () => {
  if (chatWindow.value && !isChatWindowFocused.value) {
    chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
  }
};

const submitMessage = () => {
  if (!form.value || !message.value.trim()) return;
  sendMessage(props.room.id, message.value);
  message.value = "";
};
</script>

<style scoped lang="scss">
@import "../../styles/settings.scss";
.chat-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .chat-window {
    border: $border-style;
    background: rgb(var(--v-theme-surface));
    flex: 1;
    position: relative;
    overflow: auto;
    padding: 1.5rem;

    &.smAndDown {
      padding: 0.8rem;
    }

    .chat-error {
      text-align: center;
      margin-top: 3rem;
      padding: 1rem;
      color: rgb(var(--v-theme-error));
    }

    .chat-loading {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .actions {
    width: fit-content;
    margin-left: auto;
    margin-top: -0.8rem;
  }
}
</style>
