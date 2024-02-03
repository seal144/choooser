<template>
  <div>
    <span>{{ displayName }}</span>
    <span>{{ " " }}{{ formattedTime }}</span>
  </div>
  <div>{{ message.message }}</div>
</template>
<script lang="ts" setup>
import { computed, PropType, ref } from "vue";
import { format } from "date-fns";

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

const displayName = ref(
  props.participantsList.find(
    (participant) => participant.id === props.message.authorId
  )?.displayName
);

const formattedTime = computed(() => {
  const createDate = props.message.createTime.toDate();
  const currentDate = new Date();

  if (createDate.getDate() === currentDate.getDate()) {
    return format(createDate, "HH:mm");
  }

  if (createDate.getFullYear() === currentDate.getFullYear()) {
    return format(createDate, "dd.MM, HH:mm");
  }
  return format(createDate, "dd.MM.yyy, HH:mm");
});
</script>
<style scoped lang="scss"></style>
