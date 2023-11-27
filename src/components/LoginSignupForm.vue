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
      :rules="[required, minCharsRequired(3)]"
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
    <v-btn type="submit" :loading="submitLoading">
      <template v-if="props.variant === 'login'">Log in</template>
      <template v-else>Sign up</template>
    </v-btn>
  </v-form>
  <!-- TODO consider change style after gmail authentication implementation -->
  <v-btn
    @click="handleContinueAsGuest"
    class="guest-link"
    :loading="loadingLoginAnonymous"
  >
    Continue as guest
  </v-btn>
  <!-- TODO create error component handle errors: "invalid-login-credentials error", "email-already-in-use"-->
  <div class="error-box" v-if="errorLogin && props.variant === 'login'">
    {{ errorLogin }}
  </div>
  <div class="error-box" v-if="errorSignup && props.variant === 'signup'">
    {{ errorSignup }}
  </div>
  <div class="error-box" v-if="errorLoginAnonymous">
    {{ errorLoginAnonymous }}
  </div>
</template>

<script setup lang="ts">
import { computed, ref, PropType } from "vue";
import { useRouter } from "vue-router";
import TextField from "@/components/TextField.vue";
import HeaderCard from "@/components/HeaderCard.vue";
import useSignup from "@/composables/useSignup";
import useLogin from "@/composables/useLogin";
import useAnonymousAuth from "@/composables/useAnonymousAuth";

const props = defineProps({
  variant: {
    type: String as PropType<"login" | "signup">,
    required: true,
  },
});

const { signup, error: errorSignup, loading: loadingSignup } = useSignup();
const { login, error: errorLogin, loading: loadingLogin } = useLogin();
const {
  login: loginAnonymous,
  error: errorLoginAnonymous,
  loading: loadingLoginAnonymous,
} = useAnonymousAuth();
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

  if (!errorLoginAnonymous.value) {
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
.v-btn {
  width: 100%;
  margin-bottom: 1.2rem;
}
.guest-link {
  display: block;
  text-align: center;
}
.error-box {
  margin-top: 1rem;
  color: rgb(var(--v-theme-error));
}
</style>
