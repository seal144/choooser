<template>
  <Dialog
    :identification="Dialogs.Settings"
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
          v-model="themeSwitchIsDark"
          hide-details
          :label="`Theme: ${themeSwitchIsDark ? 'dark' : 'light'}`"
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
import { computed, ref, watchEffect } from "vue";
import { useDisplay, useTheme } from "vuetify";

import { useDialogsStore } from "@/store/dialogs";
import Button from "./Button.vue";
import Dialog from "./Dialog.vue";
import TextField from "./TextField.vue";
import getUser from "@/composables/getUser";
import useDefaultTheme from "@/composables/useDefaultTheme";
import { Dialogs } from "@/types";
import { displayNameValidation } from "@/utils/validation";

const { defaultTheme } = useDefaultTheme();
const { smAndUp } = useDisplay();
const dialogs = useDialogsStore();
const { user } = getUser();
const theme = useTheme();

const form = ref(false);
const displayName = ref(user?.value?.displayName);
const themeInitialIsDark = ref(theme.global.current.value.dark);
const themeSwitchIsDark = ref(themeInitialIsDark.value);
const loading = ref(false);
const submitting = ref(false);

watchEffect(() => {
  if (themeSwitchIsDark.value) {
    theme.global.name.value = "dark";
  } else {
    theme.global.name.value = "light";
  }
});

const ThemeIsDirty = computed(
  () => themeInitialIsDark.value !== themeSwitchIsDark.value
);

const displayNameIsDirty = computed(
  () => displayName.value !== user?.value?.displayName
);

const isDirty = computed(() => {
  return ThemeIsDirty.value || displayNameIsDirty.value;
});

const resetValues = () => {
  displayName.value = user?.value?.displayName;
  if (themeInitialIsDark.value !== themeSwitchIsDark.value) {
    themeSwitchIsDark.value = !themeSwitchIsDark.value;
  }
};

const onClose = () => {
  if (submitting.value) {
    return (submitting.value = false);
  }
  resetValues();
};

const onSubmit = () => {
  if (!form.value) return;
  submitting.value = true;
  console.log({ displayName: displayName.value });
  if (ThemeIsDirty.value) {
    themeInitialIsDark.value = theme.global.current.value.dark;
    defaultTheme.value = theme.global.current.value.dark ? "dark" : "light";
  }
  dialogs.isOpen[Dialogs.Settings] = false;
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
