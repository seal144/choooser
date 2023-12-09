import { ref } from "vue";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../firebase/config";

const error = ref<string | null>(null);
const loading = ref(false);

const login = async () => {
  error.value = null;
  loading.value = true;

  try {
    const response = await signInAnonymously(auth);

    if (!response) {
      throw new Error("Something went wrong");
    }

    loading.value = false;
  } catch (err) {
    const { message } = err as Error;
    console.log(message);
    error.value = message;
    loading.value = false;
  }
};

const useAnonymousAuth = () => {
  return { login, error, loading };
};

export default useAnonymousAuth;
