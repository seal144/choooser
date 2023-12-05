<template>
  <Dialog
    title="Settings"
    close-label="cancel"
    @close="onClose"
    class="settings-dialog"
  >
    <template v-slot:ActivatorButtonLabel>
      <Button class="activator-button" :icon="!smAndUp">
        <v-icon icon="mdi-cog" /><span v-if="smAndUp">settings</span>
      </Button>
    </template>
    <template v-slot:content>
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-switch
          v-model="darkTheme"
          hide-details
          :label="`Theme: ${darkTheme ? 'dark' : 'light'}`"
        ></v-switch>
        <TextField
          v-model="displayName"
          label="Display Name"
          :rules="[...displayNameValidation]"
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
import { displayNameValidation } from "@/utils/validation";

const { smAndUp } = useDisplay();
const { user } = getUser();

const form = ref(false);
const displayName = ref(user?.value?.displayName);
const darkTheme = ref(false);
const loading = ref(false);

const isDirty = computed(() => {
  if (displayName.value !== user?.value?.displayName) {
    return true;
  }
  return false;
});

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

<style lang="scss">
.settings-dialog {
  div.v-card-text {
    padding-top: 0.5rem !important;
  }

  .v-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .v-switch {
      & div.v-switch__thumb {
        background-color: rgb(var(--v-theme-primary));
      }
    }
  }

  .activator-button {
    height: 34px;

    &.v-btn--icon {
      width: 34px;
    }
  }
}
</style>
