/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

import { createVuetify } from "vuetify";
import { mdi } from "vuetify/iconsets/mdi";

import useDefaultTheme from "@/composables/useDefaultTheme";
import { customSVGs } from "@/assets/customSVGs/customSVGs";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

const { defaultTheme } = useDefaultTheme();

const LightPalette = {
  primary: "#3b3d4a",
  background: "#fff",
  surface: "#ededf5",
  surface2: "#ccdddd",
  surface3: "#fffffd",
};

const DarkPalette = {
  primary: "#74b0ab",
  background: "#3b3d4a",
  surface: "#3f404a",
  surface2: "#455550",
  surface3: "#606060",
};

export const lineThickness = "3";

const borderStyle = `border: ${lineThickness}px solid rgb(var(--v-theme-primary));`;

enum Breakpoints {
  xs = 0,
  sm = 480,
  md = 600,
  lg = 960,
  xl = 1280,
  xxl = 1920,
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const vuetify = createVuetify({
  display: {
    thresholds: { ...Breakpoints },
  },
  defaults: {
    VBtn: {
      rounded: "0",
      style: "text-transform: none;",
    },
    VCard: {
      rounded: "0",
      style: `${borderStyle}`,
    },
    VContainer: {
      style: "max-width: 1200px;",
    },
    VToolbar: {
      style: `${borderStyle}`,
    },
    VDivider: {
      thickness: `${lineThickness}px`,
      style: "opacity: 1",
    },
    VInput: {
      "input.v-field__input": {
        style: "padding: .5rem 1rem",
      },
    },
    VList: {
      rounded: "0",
      style: `${borderStyle} padding: .25rem 0;`,
    },
    VTextarea: {
      rounded: "0",
    },
    VListItem: {
      style: "padding: .25rem .5rem; min-height: 40px;",
    },
    VAlert: {
      style: "border-radius: 0;",
    },
    VNavigationDrawer: {
      style: `${borderStyle}`,
    },
  },
  theme: {
    defaultTheme: defaultTheme.value,
    themes: {
      light: {
        dark: false,
        colors: {
          primary: LightPalette.primary,
          "on-primary": LightPalette.background,
          background: LightPalette.background,
          "on-background": LightPalette.primary,
          surface: LightPalette.surface,
          "on-surface": LightPalette.primary,
          surface2: LightPalette.surface2,
          surface3: LightPalette.surface3,
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: DarkPalette.primary,
          "on-primary": DarkPalette.background,
          background: DarkPalette.background,
          "on-background": DarkPalette.primary,
          surface: DarkPalette.surface,
          "on-surface": DarkPalette.primary,
          surface2: DarkPalette.surface2,
          surface3: DarkPalette.surface3,
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
    sets: {
      mdi,
      custom: customSVGs,
    },
  },
});

export default vuetify;
