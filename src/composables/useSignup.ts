import { ref } from "vue";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/config";

const parseErrorMessage = (message: string) => {
  if (message.includes("email-already-in-use")) {
    return "Email already in use";
  }
  return message;
};

const error = ref<string | null>(null);
const loading = ref(false);

const signup = async (email: string, password: string, displayName: string) => {
  error.value = null;
  loading.value = true;

  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (!response) {
      throw new Error("Could not complete sign up");
    }

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName });
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

const useSignup = () => {
  return { error, loading, signup };
};

export default useSignup;
