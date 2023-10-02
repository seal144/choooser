/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";

const app = createApp(App);

registerPlugins(app);

app.mount("#app");

// TODO:
// - przy pierwszym uruchomieniu projekt się nie załaduje, trzeba odświeżyć stronę (naprawić)
// - problem z importowaniem composables (naprawić)
