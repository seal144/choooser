import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

const parseErrorMessage = (message: string) => {
  if (message.includes("invalid-login-credentials")) {
    return "Invalid login credentials";
  }
  if (message.includes("too-many-requests")) {
    return "Account has been temporarily disabled due to many failed login attempts";
  }
  return message;
};

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
    const { message } = err as Error;
    console.log(message);
    error.value = parseErrorMessage(message);
    loading.value = false;
  }
};

const useLogin = () => {
  return { login, error, loading };
};

export default useLogin;
