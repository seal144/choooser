<template>
  <Dialog title="Settings" close-label="cancel" @close="onClose">
    <template v-slot:ActivatorButtonLabel>
      <Button class="activator-button" :icon="!smAndUp">
        <v-icon icon="mdi-cog" /><span v-if="smAndUp">settings</span>
      </Button>
    </template>
    <template v-slot:content>
      <v-form v-model="form" @submit.prevent="onSubmit">
        <TextField
          v-model="displayName"
          label="Display Name"
          :rules="[required]"
        />
      </v-form>
    </template>
    <template v-slot:action>
      <Button :disabled="!form || !isDirty" @click="onSubmit" :loading="loading"
        >apply</Button
      >
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";

import Button from "./Button.vue";
import Dialog from "./Dialog.vue";
import TextField from "./TextField.vue";
import getUser from "@/composables/getUser";

const { smAndUp } = useDisplay();
const { user } = getUser();

const form = ref(false);
const displayName = ref(user?.value?.displayName);
const loading = ref(false);

const isDirty = computed(() => {
  if (displayName.value !== user?.value?.displayName) {
    return true;
  }
  return false;
});

const required = (value: string) => !!value || "Required";

const onClose = () => {
  displayName.value = user?.value?.displayName;
};

const onSubmit = () => {
  if (!form.value) return;

  loading.value = true;

  setTimeout(() => (loading.value = false), 2000);
  console.log({ displayName: displayName.value });
};
</script>

<style lang="scss" scoped>
.activator-button {
  height: 34px;

  &.v-btn--icon {
    width: 34px;
  }
}
</style>
