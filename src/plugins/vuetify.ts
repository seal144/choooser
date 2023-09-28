/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

const LightPalette = {
  primary: "#284B63",
  secondary: "#3C6E71",
  background: "#EEE",
  surface: "#DDD",
};

const borderStyle = "border: 2px solid rgb(var(--v-theme-primary));";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: LightPalette.primary,
          "on-primary": LightPalette.background,
          secondary: LightPalette.secondary,
          background: LightPalette.background,
          "on-background": LightPalette.primary,
          surface: LightPalette.surface,
          "on-surface": LightPalette.primary,
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: "0",
      class: ["v-btn--primary"],
      color: "rgb(var(--v-theme-primary))",
      style: "color: rgb(var(--v-theme-on-primary)); text-transform: none;",
    },
    VCard: {
      rounded: "0",
      style: `${borderStyle} padding: .25rem 1rem;`,
    },
    VToolbar: {
      style: `${borderStyle}`,
    },
  },
});
