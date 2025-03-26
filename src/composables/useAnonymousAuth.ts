import { ref } from "vue";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase/config";
import initDisplayName from "@/firebase/initDisplayName";
import isUserNameInUse from "@/firebase/isUserNameInUse";
import { CommonErrors } from "@/types";

const error = ref<string | null>(null);
const loading = ref(false);

const login = async (displayName?: string) => {
  error.value = null;
  loading.value = true;

  try {
    if (displayName) {
      const userNameInUse = await isUserNameInUse(displayName);

      if (userNameInUse) {
        throw new Error(CommonErrors.DisplayNameInUse);
      }
    }

    const response = await signInAnonymously(auth);

    if (!response) {
      throw new Error("Something went wrong");
    }

    await initDisplayName(displayName ?? undefined);

    loading.value = false;
  } catch (err) {
    const { message } = err as Error;
    console.error(message);
    error.value = message;
    loading.value = false;
  }
};

const resetError = () => {
  error.value = null;
};

const useAnonymousAuth = () => {
  return { login, error, loading, resetError };
};

export default useAnonymousAuth;
