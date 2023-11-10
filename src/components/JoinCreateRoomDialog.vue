<template>
  <Dialog :title="title" close-label="close">
    <template v-slot:ActivatorButtonLabel>
      <v-icon :icon="activatorButtonIcon" size="large" start />
      {{ title }}
    </template>
    <template v-slot:content>
      <v-form v-model="form" @submit.prevent="onSubmit">
        <TextField
          v-model.trim="roomName"
          label="Room name"
          :rules="[required]"
          :loading="loading"
        />
        <TextField
          v-model.trim="password"
          label="Password"
          :loading="loading"
        />
      </v-form>
    </template>
    <template v-slot:action>
      <v-btn
        :text="actionButtonLabel"
        :disabled="!form"
        @click="onSubmit"
        :loading="loading"
      ></v-btn>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref, PropType } from "vue";
import Dialog from "./Dialog.vue";
import TextField from "./TextField.vue";

const props = defineProps({
  variant: {
    type: String as PropType<"join" | "create">,
    required: true,
  },
});

const DialogData = computed(() => {
  switch (props.variant) {
    case "join":
      return {
        title: "Join room",
        activatorButtonIcon: "mdi-login",
        actionButtonLabel: "Join",
      };
    default:
      return {
        title: "Create room",
        activatorButtonIcon: "mdi-plus",
        actionButtonLabel: "Create",
      };
  }
});

const { title, activatorButtonIcon, actionButtonLabel } = DialogData.value;
const form = ref(false);
const roomName = ref("");
const password = ref("");
const loading = ref(false);

const required = (value: string) => !!value || "Required";

const onSubmit = () => {
  if (!form.value) return;

  loading.value = true;

  setTimeout(() => (loading.value = false), 2000);
  console.log({ roomName: roomName.value, password: password.value });
};
</script>

<style lang="scss" scoped>
.v-input {
  margin: 0 0 0.5rem;

  &:last-child {
    margin: 0;
  }
}
</style>
