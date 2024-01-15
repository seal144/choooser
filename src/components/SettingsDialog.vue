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
        <v-icon icon="mdi-cog" size="large" /><span v-if="smAndUp"
          >settings</span
        >
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
        <div class="danger-zone" :class="{ xs }">
          <ConfirmDialog
            :dialogIdentification="Dialogs.ConfirmDeleteAccount"
            title="Are you sure?"
            text="Do you want to delete your account? This action is irreversible."
          >
            <template v-slot:activatorButton>
              <Button size="small" danger
                ><v-icon icon="mdi-exclamation-thick" />delete account</Button
              >
            </template>
            <template v-slot:confirmButton>
              <Button danger @click="deleteAccount" :loading="loadingDeleteUser"
                ><v-icon
                  icon="mdi-exclamation-thick"
                  size="large"
                  v-if="smAndUp"
                />delete</Button
              >
            </template>
          </ConfirmDialog>
          <div>Danger zone</div>
        </div>
      </v-form>
      <FormError
        extends-layout
        align-right
        v-if="error"
        :error-message="error"
      />
    </template>
    <template v-slot:action>
      <Button
        :disabled="!form || !isDirty"
        @click="onSubmit"
        :loading="loadingUpdateDisplayName"
        >apply</Button
      >
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref, toRef, watchEffect } from "vue";
import { useDisplay, useTheme } from "vuetify";

import { useDialogsStore } from "@/store/dialogs";
import { useUserStore } from "@/store/userStore";
import {
  Button,
  ConfirmDialog,
  Dialog,
  FormError,
  TextField,
} from "@/components";
import useUser from "@/composables/useUser";
import useDefaultTheme from "@/composables/useDefaultTheme";
import { displayNameValidation } from "@/utils/validation";
import { Dialogs } from "@/types";

const { defaultTheme } = useDefaultTheme();
const { smAndUp, xs } = useDisplay();
const dialogs = useDialogsStore();
const displayName = toRef(useUserStore(), "displayName");
const {
  updateDisplayName,
  deleteUser,
  error,
  loadingUpdateDisplayName,
  loadingDeleteUser,
} = useUser();
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

const deleteAccount = async () => {
  await deleteUser();
  dialogs.isOpen[Dialogs.ConfirmDeleteAccount] = false;
  dialogs.isOpen[Dialogs.Settings] = false;
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

    &.xs {
      padding-top: 0.5rem !important;
    }
  }

  .v-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .v-switch {
      margin-bottom: 0.4rem;

      & div.v-switch__thumb {
        background-color: rgb(var(--v-theme-primary));
      }

      & .v-label {
        opacity: 1;
      }
    }

    div.danger-zone {
      padding: 0.2rem 0.5rem 0.2rem 0.2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: rgb(var(--v-theme-error));
      border: 1px solid rgb(var(--v-theme-error));

      &.xs {
        padding: 0.5rem 1rem;
        flex-direction: column-reverse;
        align-items: start;
        gap: 0.2rem;
      }
    }
  }
}
</style>
