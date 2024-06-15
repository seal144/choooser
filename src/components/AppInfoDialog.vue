<template>
  <Dialog
    :identification="Dialogs.AppInfo"
    title="App info"
    close-label="close"
    size="large"
    actionsWithBorder
  >
    <template v-slot:content>
      <div class="app-info-content">
        <ExtensionPanelSingle title="INTRO">
          <p class="description" :class="{ xs }">
            CHOOOSER is a web application designed to help groups make the best
            choice from multiple options. Users rank the available options based
            on their personal preferences, and the app calculates the scores to
            determine the winning option.
          </p>
        </ExtensionPanelSingle>
        <ExtensionPanelSingle title="HOW TO USE">
          <ul class="description list" :class="{ xs }">
            <li>
              To use the app, you can either create a room or join an existing
              one.
            </li>
            <li>
              To invite others to a room, share its name and password (if it has
              one), or simply share the room URL.
            </li>
            <li>
              In rooms, there are two roles: host and guest. The host, who
              created the room, can delete the room, remove other users, and
              manage the choosing flow. The guest is just a participant.
            </li>
            <li>
              The choosing process in a room is divided into three phases:
              <ol class="sublist">
                <li>Setting the options - by the host</li>
                <li>Ranking the options - by all participants</li>
                <li>Viewing the result</li>
              </ol>
            </li>
          </ul>
        </ExtensionPanelSingle>
        <ExtensionPanelSingle title="NOTES">
          <ul class="description list" :class="{ xs }">
            <li>Apart from choosing, rooms also have a chat feature.</li>
            <li>
              Rooms are temporary and will be automatically deleted after 14
              days.
            </li>
            <li>
              {{
                `Each room has a participant limit of ${
                  maxGuestsInRoom + 1
                } users.`
              }}
            </li>
            <li>
              You can use a guest account, but it is tied to the specific
              browser where it was created. Therefore, it cannot be accessed
              from another browser. It is not possible to log out from a guest
              account; you have to delete it in settings to create a regular
              user account. (Plans are in place to create a process for
              transitioning guest accounts into regular accounts.) For a better
              user experience, we recommend using other forms of authentication
              instead of a guest account.
            </li>
          </ul>
        </ExtensionPanelSingle>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import Dialog from "./Dialog.vue";
import ExtensionPanelSingle from "./ExtensionPanelSingle.vue";
import { maxGuestsInRoom } from "@/utils/validation";
import { Dialogs } from "@/types";

const { xs } = useDisplay();
</script>

<style scoped lang="scss">
.app-info-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.description {
  text-align: justify;
  margin-left: -0.5rem;
  margin-right: -0.5rem;

  &.xs {
    text-align: left;
    font-size: 14px;
    margin-left: -1rem;
    margin-right: -1rem;
  }

  &.list {
    margin-left: 0;

    &.xs {
      margin-left: -0.25rem;

      & .sublist {
        margin-left: 1rem;
      }
    }

    & .sublist {
      margin-left: 1.5rem;
    }
  }
}
</style>
