<template>
  <v-form v-model="form" @submit.prevent="onSubmit" >
    <HeaderCard class="header"><b>Log in</b> or <router-link to="/"><b>Sign&nbsp;up</b></router-link> if new </HeaderCard>
    <TextField
      v-model.trim="email"
      label="Email"
      :rules="[required, emailValidation]"
      :loading="loading"
    />
    <TextField
      v-model.trim="password"
      label="Password"
      :rules="[required]"
      :loading="loading"
    />
    <v-btn
    @click="onSubmit"
    :disabled="!form"
    :loading="loading"
    >
      Log in
    </v-btn>
  </v-form>
  <router-link class="guest-link" to="/">Continue as guest</router-link>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TextField from "@/components/TextField.vue";
import HeaderCard from "@/components/HeaderCard.vue";

const form = ref(false);
const email = ref("");
const password = ref("");
const loading = ref(false);

const required = (value: string) => !!value || "Required";
const emailValidation = (value: string) => value.match(/^[\w-.]+@([\w-]+\.)[\w]{2,4}$/) || "incorrect email format";

const onSubmit = () => {
  if (!form.value) return;

  loading.value = true;

  setTimeout(() => (loading.value = false), 2000);
  console.log({ roomName: email.value, password: password.value });
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
