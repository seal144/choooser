import { useLocalStorage } from "@vueuse/core";

const defaultTheme = useLocalStorage(
  "defaultTheme",
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
);

const useDefaultTheme = () => ({
  defaultTheme,
});

export default useDefaultTheme;
