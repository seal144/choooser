<template>
  <v-form v-model="form" @submit.prevent="onSubmit" validate-on="blur lazy">
    <HeaderCard class="header">
      <template v-if="props.variant === 'login'">
        <b>Log in</b> or
        <router-link
          :to="{ name: 'Signup', query: { redirect: route.query.redirect } }"
          ><b>Sign&nbsp;up</b></router-link
        >
        if you are new
      </template>
      <template v-else>
        <b>Sign up</b> or
        <router-link
          :to="{ name: 'Login', query: { redirect: route.query.redirect } }"
          ><b>Log&nbsp;in</b></router-link
        >
        if you have an account
      </template>
    </HeaderCard>
    <TextField
      v-model.trim="email"
      label="Email"
      :rules="[...emailValidation]"
      :readonly="submitLoading"
    />
    <TextField
      v-if="props.variant === 'signup'"
      v-model.trim="name"
      label="Display name"
      :rules="[...displayNameValidation]"
      :readonly="submitLoading"
    />
    <TextField
      v-model.trim="password"
      label="Password"
      :rules="[...authPasswordValidation]"
      :readonly="submitLoading"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="showPassword = !showPassword"
      :type="showPassword ? 'text' : 'password'"
    />
    <Button class="submit" type="submit" :loading="submitLoading">
      <template v-if="props.variant === 'login'">Log in</template>
      <template v-else>Sign up</template>
    </Button>
  </v-form>
  <div class="alternative-auth-container" :class="{ md: md, xs: xs }">
    <Button
      @click="handleUseGoogle"
      :loading="loadingGoogle"
      size="small"
      secondary
    >
      <v-icon icon="mdi-google" class="mr-1" />use Google
    </Button>
    <Button @click="handleContinueAsGuest" size="small" secondary>
      Continue as guest
    </Button>
  </div>
  <div class="submit-errors">
    <FormError
      v-if="errorLogin && props.variant === 'login'"
      :error-message="errorLogin"
    />
    <FormError
      v-else-if="errorSignup && props.variant === 'signup'"
      :error-message="errorSignup"
    />
    <FormError v-else-if="errorGoogle" :error-message="errorGoogle" />
  </div>
  <SetDisplayNameDialog
    :identification="Dialogs.SetNameAnonymousLogin"
    :submit-callback="onAnonymousLogin"
  />
</template>

<script setup lang="ts">
import { computed, ref, PropType } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";

import {
  Button,
  FormError,
  HeaderCard,
  TextField,
  SetDisplayNameDialog,
} from "@/components";
import useSignup from "@/composables/useSignup";
import useLogin from "@/composables/useLogin";
import useLoginGoogle from "@/composables/useloginGoogle";
import { useDialogsStore } from "@/store/dialogs";
import {
  emailValidation,
  displayNameValidation,
  authPasswordValidation,
} from "@/utils/validation";
import { RoutesNames } from "@/router";
import { Dialogs } from "@/types";

const props = defineProps({
  variant: {
    type: String as PropType<"login" | "signup">,
    required: true,
  },
});

const { md, xs } = useDisplay();

const { signup, error: errorSignup, loading: loadingSignup } = useSignup();
const { login, error: errorLogin, loading: loadingLogin } = useLogin();
const {
  login: loginGoogle,
  error: errorGoogle,
  loading: loadingGoogle,
} = useLoginGoogle();
const router = useRouter();
const route = useRoute();
const dialogs = useDialogsStore();

const form = ref(false);
const email = ref("");
const name = ref("");
const password = ref("");
const showPassword = ref(false);
const submitLoading = computed(() => {
  if (loadingSignup.value || loadingLogin.value) {
    return true;
  }
  return false;
});

const onSubmit = computed(() => {
  return props.variant === "login" ? submitLogin : submitSignup;
});

const resetErrors = () => {
  errorSignup.value = null;
  errorLogin.value = null;
  errorGoogle.value = null;
};

const submitLogin = async () => {
  if (!form.value) return;

  await login(email.value, password.value);

  if (!errorLogin.value) {
    if (route.query.redirect) {
      router.push({
        name: RoutesNames.Room,
        params: { id: route.query.redirect as string },
      });
    } else {
      router.push({ name: RoutesNames.Home });
    }
    resetErrors();
  }
};

const submitSignup = async () => {
  if (!form.value) return;

  await signup(email.value, password.value, name.value);

  if (!errorSignup.value) {
    if (route.query.redirect) {
      router.push({
        name: RoutesNames.Room,
        params: { id: route.query.redirect as string },
      });
    } else {
      router.push({ name: RoutesNames.Home });
    }
    resetErrors();
  }
};

const handleContinueAsGuest = async () => {
  dialogs.isOpen[Dialogs.SetNameAnonymousLogin] = true;
};

const onAnonymousLogin = () => {
  if (route.query.redirect) {
    router.push({
      name: RoutesNames.Room,
      params: { id: route.query.redirect as string },
    });
  } else {
    router.push({ name: RoutesNames.Home });
  }
};

const handleUseGoogle = async () => {
  await loginGoogle();

  if (!errorGoogle.value) {
    if (route.query.redirect) {
      router.push({
        name: RoutesNames.Room,
        params: { id: route.query.redirect as string },
      });
    } else {
      router.push({ name: RoutesNames.Home });
    }
    resetErrors();
  }
};
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 1.75rem;
}
.v-input {
  margin: 0 0 0.5rem;
}
.v-btn.submit {
  width: 100%;
  margin-bottom: 1.2rem;
}

.alternative-auth-container {
  display: flex;
  gap: 0.5rem;

  & .v-btn {
    flex: 1;
  }

  &.md,
  &.xs {
    flex-direction: column;

    & .v-btn {
      flex: none;
    }
  }
}

.submit-errors {
  position: relative;
}
</style>
