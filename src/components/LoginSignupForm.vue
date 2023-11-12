<template>
  <v-form v-model="form" @submit.prevent="onSubmit" >
    <HeaderCard
     class="header"
    >
      <template v-if="props.variant === 'login'">
        <b>Log in</b> or <router-link to="Signup"><b>Sign&nbsp;up</b></router-link> if you are new
      </template>
      <template v-else>
        <b>Sign up</b> or <router-link to="Login"><b>Log&nbsp;in</b></router-link> if you have an account
      </template>
    </HeaderCard>
    <TextField
      v-model.trim="email"
      label="Email"
      :rules="[required, emailValidation]"
      :readonly="loading"
    />
    <TextField
      v-if="props.variant === 'signup'"
      v-model.trim="name"
      label="Display name"
      :rules="[required]"
      :readonly="loading"
    />
    <TextField
      v-model.trim="password"
      label="Password"
      :rules="[required]"
      :readonly="loading"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="showPassword = !showPassword"
      :type="showPassword ? 'text' : 'password'"
    />
    <v-btn
      type="submit"
      :loading="loading"
    >
      <template v-if="props.variant === 'login'">Log in</template>
      <template v-else>Sign up</template>
    </v-btn>
  </v-form>
  <router-link class="guest-link" to="/">Continue as guest</router-link>
</template>

<script setup lang="ts">
import { computed, ref, PropType } from "vue";
import TextField from "@/components/TextField.vue";
import HeaderCard from "@/components/HeaderCard.vue";

const props = defineProps({
  variant: {
    type: String as PropType<"login" | "signup">,
    required: true,
  },
});

const form = ref(false);
const email = ref("");
const name = ref("");
const password = ref("");
const loading = ref(false);
const showPassword = ref(false);

const required = (value: string) => !!value || "Required";
const emailValidation = (value: string) => Boolean(value.match(/^[\w-.]+@([\w-]+\.)[\w]{2,4}$/)) || "incorrect email format";

const onSubmit = computed(() => {
  return props.variant === "login"? submitLogin : submitSignup;
})

const submitLogin = () => {
  if (!form.value) return;
  console.log(form.value)

  loading.value = true;

  setTimeout(() => (loading.value = false), 2000);
  console.log('submitLogin', { email: email.value, password: password.value });
};

const submitSignup = () => {
  if (!form.value) return;

  loading.value = true;

  setTimeout(() => (loading.value = false), 2000);
  console.log('submitSignup', { email: email.value, name: name.value, password: password.value });
};
</script>

<style lang="scss" scoped>
  .header {
    margin-bottom: 1.75rem;
  }
  .v-input {
    margin: 0 0 0.5rem;
  }
  .v-btn{
    width: 100%;
    margin-bottom: 1.2rem;
  }
  .guest-link {
    display: block;
    text-align: center;
  }
</style>