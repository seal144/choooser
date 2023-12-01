import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";
import googleIcon from "./googleIcon.vue";

const customSVGNameToComponent = {
  googleIcon,
};

type CustomSVGName = keyof typeof customSVGNameToComponent;

const customSVGs: IconSet = {
  component: (props: IconProps) =>
    h(customSVGNameToComponent[props.icon as CustomSVGName]),
};

export { customSVGs };

// usage:
// <v-icon icon="custom:googleIcon" />
