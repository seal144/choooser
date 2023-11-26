import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

const error = ref<string | null>(null);
const loading = ref(false);

const login = async (email: string, password: string) => {
  error.value = null;
  loading.value = true;

  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    if (!response) {
      throw new Error("Could not login");
    }

    error.value = null;
    loading.value = false;
  } catch (err) {
    console.log((err as Error).message);
    error.value = (err as Error).message;
    loading.value = false;
  }
};

const useLogin = () => {
  return { login, error, loading };
};

export default useLogin;
