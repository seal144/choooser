<template>
  <v-form v-model="form" @submit.prevent="onSubmit" validate-on="blur lazy">
    <HeaderCard class="header">
      <template v-if="props.variant === 'login'">
        <b>Log in</b> or
        <router-link :to="{ name: 'Signup' }"><b>Sign&nbsp;up</b></router-link>
        if you are new
      </template>
      <template v-else>
        <b>Sign up</b> or
        <router-link :to="{ name: 'Login' }"><b>Log&nbsp;in</b></router-link> if
        you have an account
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
    <Button
      @click="handleContinueAsGuest"
      :loading="loadingAnonymous"
      size="small"
      secondary
    >
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
    <FormError v-else-if="errorAnonymous" :error-message="errorAnonymous" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, PropType } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

import { Button, FormError, HeaderCard, TextField } from "@/components";
import useSignup from "@/composables/useSignup";
import useLogin from "@/composables/useLogin";
import useAnonymousAuth from "@/composables/useAnonymousAuth";
import useLoginGoogle from "@/composables/useloginGoogle";
import {
  emailValidation,
  displayNameValidation,
  authPasswordValidation,
} from "@/utils/validation";

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
  login: loginAnonymous,
  error: errorAnonymous,
  loading: loadingAnonymous,
} = useAnonymousAuth();
const {
  login: loginGoogle,
  error: errorGoogle,
  loading: loadingGoogle,
} = useLoginGoogle();
const router = useRouter();

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
  errorAnonymous. value = null;
  errorGoogle.value = null;
}

const submitLogin = async () => {
  if (!form.value) return;

  await login(email.value, password.value);

  if (!errorLogin.value) {
    router.push({ name: "Home" });
    resetErrors();
  }
};

const submitSignup = async () => {
  if (!form.value) return;

  await signup(email.value, password.value, name.value);

  if (!errorSignup.value) {
    router.push({ name: "Home" });
    resetErrors();
  }
};

const handleContinueAsGuest = async () => {
  await loginAnonymous();

  if (!errorAnonymous.value) {
    router.push({ name: "Home" });
    resetErrors();
  }
};

const handleUseGoogle = async () => {
  await loginGoogle();

  if (!errorGoogle.value) {
    router.push({ name: "Home" });
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
