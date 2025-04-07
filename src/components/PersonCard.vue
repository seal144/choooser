<template>
  <HeaderCard left class="person-card">
    <div class="card-content">
      <div
        :class="isCurrentUser && 'editable-name'"
        @click="handleNameClick"
        @mouseover="isNameHovered = true"
        @mouseleave="isNameHovered = false"
      >
        <v-icon
          :icon="isNameHovered && isCurrentUser ? 'mdi-pencil' : 'mdi-account'"
          size="20"
        />{{ name }}
      </div>
      <div class="actions">
        <v-icon v-if="check" icon="mdi-check-bold" size="20" />
        <v-progress-circular
          v-if="isPending"
          indeterminate
          size="20"
          width="2"
        ></v-progress-circular>
        <ButtonIcon
          v-if="kickButton"
          icon="mdi-shoe-formal"
          size="small"
          @click="kickCallback"
        />
      </div>
    </div>
  </HeaderCard>
  <SetDisplayNameDialog
    v-if="isCurrentUser"
    :identification="Dialogs.EditNameRoom"
  />
</template>

<script lang="ts" setup>
import { ButtonIcon, HeaderCard } from "@/components";
import { PropType, ref } from "vue";
import getUser from "@/composables/getUser";
import { useDialogsStore } from "@/store/dialogs";
import { Dialogs } from "@/types";
import SetDisplayNameDialog from "./SetDisplayNameDialog.vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  kickButton: {
    type: Boolean,
    default: false,
  },
  kickCallback: {
    type: Function as PropType<() => void>,
    default: () => {},
  },
  isPending: {
    type: Boolean,
    default: false,
  },
  check: {
    type: Boolean,
    default: false,
  },
});

const { user } = getUser();
const isNameHovered = ref(false);
const isCurrentUser = user.value?.uid === props.userId;
const dialogs = useDialogsStore();

const handleNameClick = () => {
  if (isCurrentUser) {
    dialogs.isOpen[Dialogs.EditNameRoom] = true;
  }
};
</script>

<style scoped lang="scss">
.person-card {
  padding-right: 4px;
  padding-left: 4px;
  .card-content {
    display: flex;
    justify-content: space-between;

    .editable-name {
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }

    .actions {
      display: flex;
      gap: 0.25rem;
      justify-content: end;
      align-items: center;
    }
  }
}
</style>
