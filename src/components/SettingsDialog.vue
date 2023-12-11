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
          v-model="displayNameInput"
          label="Display Name"
          :rules="[...displayNameValidation]"
        />
      </v-form>
      <FormError
        extends-layout
        align-right
        v-if="error"
        :error-message="error"
      />
    </template>
    <template v-slot:action>
      <Button :disabled="!form || !isDirty" @click="onSubmit" :loading="loading"
        >apply</Button
      >
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref, toRef, watchEffect } from "vue";
import { useDisplay, useTheme } from "vuetify";

import { useDialogsStore } from "@/store/dialogs";
import Button from "./Button.vue";
import Dialog from "./Dialog.vue";
import TextField from "./TextField.vue";
import FormError from "./FormError.vue";
import useUser from "@/composables/useUser";
import useDefaultTheme from "@/composables/useDefaultTheme";
import { useUserStore } from "@/store/userStore";
import { Dialogs } from "@/types";
import { displayNameValidation } from "@/utils/validation";

const { defaultTheme } = useDefaultTheme();
const { smAndUp } = useDisplay();
const dialogs = useDialogsStore();
const displayName = toRef(useUserStore(), "displayName");
const { updateDisplayName, error, loading } = useUser();
const theme = useTheme();

const form = ref(false);
const displayNameInput = ref(displayName.value);
const themeInitialIsDark = ref(theme.global.current.value.dark);
const themeSwitchIsDark = ref(themeInitialIsDark.value);
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
  () => displayNameInput.value !== displayName.value
);

const isDirty = computed(() => {
  return ThemeIsDirty.value || displayNameIsDirty.value;
});

const resetValues = () => {
  displayNameInput.value = displayName.value;
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

const onSubmit = async () => {
  if (!form.value) return;
  submitting.value = true;
  if (displayNameIsDirty.value && displayNameInput.value) {
    await updateDisplayName(displayNameInput.value);
  }
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
