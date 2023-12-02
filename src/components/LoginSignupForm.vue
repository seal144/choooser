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
      :rules="[required, emailValidation]"
      :readonly="submitLoading"
    />
    <TextField
      v-if="props.variant === 'signup'"
      v-model.trim="name"
      label="Display name"
      :rules="[required, minCharsRequired(3), maxChars(30)]"
      :readonly="submitLoading"
    />
    <TextField
      v-model.trim="password"
      label="Password"
      :rules="[required, minCharsRequired(6)]"
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
  <!-- TODO create error component handle errors: "invalid-login-credentials error", "email-already-in-use"-->
  <div class="error-box" v-if="errorLogin && props.variant === 'login'">
    {{ errorLogin }}
  </div>
  <div class="error-box" v-if="errorSignup && props.variant === 'signup'">
    {{ errorSignup }}
  </div>
  <div class="error-box" v-if="errorAnonymous">
    {{ errorAnonymous }}
  </div>
  <div class="error-box" v-if="errorGoogle">
    {{ errorGoogle }}
  </div>
</template>

<script setup lang="ts">
import { computed, ref, PropType } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

import Button from "@/components/Button.vue";
import TextField from "@/components/TextField.vue";
import HeaderCard from "@/components/HeaderCard.vue";
import useSignup from "@/composables/useSignup";
import useLogin from "@/composables/useLogin";
import useAnonymousAuth from "@/composables/useAnonymousAuth";
import useLoginGoogle from "@/composables/useloginGoogle";

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

const required = (value: string) => !!value || "Required";
const emailValidation = (value: string) =>
  Boolean(value.match(/^[\w-.]+@([\w-]+\.)[\w]{2,4}$/)) ||
  "incorrect email format";
const minCharsRequired = (minChars: number) => (value: string) =>
  Number(value.length) >= minChars ||
  `at least ${minChars} characters required`;
const maxChars = (maxChars: number) => (value: string) =>
  Number(value.length) <= maxChars || `max ${maxChars} characters`;

const onSubmit = computed(() => {
  return props.variant === "login" ? submitLogin : submitSignup;
});

const submitLogin = async () => {
  if (!form.value) return;

  await login(email.value, password.value);

  if (!errorLogin.value) {
    router.push({ name: "Home" });
  }
};

const submitSignup = async () => {
  if (!form.value) return;

  await signup(email.value, password.value, name.value);

  if (!errorSignup.value) {
    router.push({ name: "Home" });
  }
};

const handleContinueAsGuest = async () => {
  await loginAnonymous();

  if (!errorAnonymous.value) {
    router.push({ name: "Home" });
  }
};

const handleUseGoogle = async () => {
  await loginGoogle();

  if (!errorGoogle.value) {
    router.push({ name: "Home" });
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

.error-box {
  margin-top: 1rem;
  color: rgb(var(--v-theme-error));
}
</style>
