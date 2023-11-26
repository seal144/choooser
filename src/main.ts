/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import Application from "./App.vue";
// Composables
import { createApp, App } from "vue";
// Plugins
import { registerPlugins } from "@/plugins";
//firebase
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";

let app: App<Element>;

// wait for auth to mount the app
onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(Application);
    registerPlugins(app);
    app.mount("#app");
  }
});
