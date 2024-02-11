<template>
  <div class="message-wrapper" :class="{ loggedUser: isLoggedUser, smAndDown }">
    <div class="message-header">
      <span>{{ displayName }}</span>
      <span>{{ " " }}{{ formattedTime }}</span>
    </div>
    <div class="message-body">
      <p v-for="(paragraph, index) in paragraphs" :key="index">
        {{ paragraph }}
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, PropType, ref } from "vue";
import { useDisplay } from "vuetify";
import { format } from "date-fns";

import getUser from "@/composables/getUser";
import { Message, User } from "@/types";

const props = defineProps({
  message: {
    type: Object as PropType<Message>,
    required: true,
  },
  participantsList: {
    type: Array as PropType<User[]>,
    required: true,
  },
});

const { user } = getUser();
const { smAndDown } = useDisplay();

const isLoggedUser = ref(props.message.authorId === user.value?.uid);

const paragraphs = computed(() => {
  return props.message.message.split("\n");
});

const displayName = computed(() => {
  return props.participantsList.find(
    (participant) => participant.id === props.message.authorId
  )?.displayName;
});

const formattedTime = computed(() => {
  const createDate = props.message.createTime.toDate();
  const currentDate = new Date();

  if (createDate.getDate() === currentDate.getDate()) {
    return format(createDate, "HH:mm");
  }

  if (createDate.getFullYear() === currentDate.getFullYear()) {
    return format(createDate, "dd.MM|HH:mm");
  }
  return format(createDate, "dd.MM.yyy|HH:mm");
});
</script>
<style scoped lang="scss">
.message-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 3rem;

  .message-header {
    font-size: 14px;
    opacity: 0.6;
    margin-top: 0.5rem;
  }
  .message-body {
    position: relative;
    background: rgb(var(--v-theme-surface-variant));
    padding: 0.5rem 1rem;
    width: fit-content;

    &::after {
      position: absolute;
      content: "";
      bottom: 0;
      left: -0.9rem;
      border-width: 0.5rem;
      border-style: solid;
      border-color: transparent rgb(var(--v-theme-surface-variant))
        rgb(var(--v-theme-surface-variant)) transparent;
    }
  }
  &.loggedUser {
    align-items: flex-end;
    margin-right: 0;
    margin-left: 3rem;

    & .message-body {
      background: rgb(var(--v-theme-surface-variant2));

      &::after {
        left: unset;
        right: -0.9rem;
        border-color: transparent transparent
          rgb(var(--v-theme-surface-variant2))
          rgb(var(--v-theme-surface-variant2));
      }
    }
  }

  &.smAndDown {
    margin-right: 1rem;

    .message-header {
      font-size: 12px;
    }
    .message-body {
      font-size: 14px;
      padding: 0.3rem 0.6rem;

      &::after {
        left: -0.5rem;
      }
    }

    &.loggedUser {
      margin-right: 0;
      margin-left: 1rem;

      & .message-body {
        &::after {
          left: unset;
          right: -0.5rem;
        }
      }
    }
  }
}
</style>
