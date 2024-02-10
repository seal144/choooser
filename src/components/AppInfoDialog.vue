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
            The COMMUNICATOR is a web app for chatting with other people in
            groups (rooms). This app is a development phase of a bigger
            application where the possibility to chat is a side feature. The
            target application is called CHOOSER and its main goal is to provide
            a system for choosing the best choice from multiple options in a
            group of people.
          </p>
        </ExtensionPanelSingle>
        <ExtensionPanelSingle title="HOW TO USE">
          <ul class="description list" :class="{ xs }">
            <li>
              To use the app, you can either create a room or join an existing
              one
            </li>
            <li>
              To invite others to a room, share its name and password (if
              exists), or simply the room URL.
            </li>
            <li>
              In rooms, there are two roles: host and guest. The host is a
              person who created the room, can delete a room, and throw out
              other users, also he is considered a participant. The guest is
              just a participant.
            </li>
          </ul>
        </ExtensionPanelSingle>
        <ExtensionPanelSingle title="NOTES">
          <ul class="description list" :class="{ xs }">
            <li>
              Rooms are temporary and will be automatically deleted after 14
              days.
            </li>
            <li>
              {{
                `The rooms have a limit of participants of ${
                  maxGuestsInRoom + 1
                } users.`
              }}
            </li>
            <li>
              You can use a guest account, but it is tied to the specific
              browser where it was created. Therefore, it cannot be accessed
              from another browser. It is not possible to logout from a guest
              account, you have to delete it in settings, to be able to create a
              regular user account (there are plans to create a process of
              transitioning guest accounts into regular user accounts). For a
              better user experience, it is recommended to use other forms of
              authentication than a guest account.
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
  gap: 0.5rem;
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
    }
  }
}
</style>
