<template>
  <v-main>
    <v-container :class="{ ['fill-height']: mdAndUp }">
      <div class="content-wrapper" :class="{ smAndDown: smAndDown }">
        <v-responsive class="align-center">
          <div
            class="left-content"
            :class="{ mdAndDown: mdAndDown, smAndDown: smAndDown }"
          >
            <v-card class="text-center">
              <h3 class="mb-3">
                &#128525; Hello Traveler. Welcome to CHOOOSER!
              </h3>
              <p>
                This App is for choosing from a variety of options for a group
                of people the best choice for all. Host a room and invite your
                friends for some choosing. You can use the app with a guest
                account, but for the best experience, it is recommended to
                create a user account.
              </p>
            </v-card>
          </div>
        </v-responsive>
        <v-divider vertical />
        <v-responsive class="align-center">
          <div
            class="right-content"
            :class="{ mdAndDown: mdAndDown, smAndDown: smAndDown }"
          >
            <router-view />
          </div>
        </v-responsive>
      </div>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";

const { mdAndUp, mdAndDown, smAndDown } = useDisplay();
</script>

<style scoped lang="scss">
.v-container {
  padding: 2rem 1rem;

  .content-wrapper {
    display: flex;
    width: 100%;

    &.smAndDown {
      flex-direction: column;
    }

    .v-responsive {
      padding: 3rem 0;
      flex: 1;
    }
  }

  .left-content {
    margin-right: 6rem;

    &.mdAndDown {
      margin-right: 1rem;
    }

    &.smAndDown {
      margin: 0;
    }

    .v-card {
      padding: 1rem;
    }
  }
  .right-content {
    margin-left: 6rem;

    &.mdAndDown {
      margin-left: 1rem;
    }

    &.smAndDown {
      max-width: 400px;
      margin: 0 auto;
    }
  }
}
</style>
