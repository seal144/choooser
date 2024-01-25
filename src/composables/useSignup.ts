import { ref } from "vue";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useUserStore } from "@/store/userStore";

const parseErrorMessage = (message: string) => {
  if (message.includes("email-already-in-use")) {
    return "Email already in use";
  }
  return message;
};

const error = ref<string | null>(null);
const loading = ref(false);
const userStore = useUserStore();

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

      userStore.displayName = auth.currentUser.displayName;
    }

    loading.value = false;
  } catch (err) {
    const { message } = err as Error;
    console.error(message);
    error.value = parseErrorMessage(message);
    loading.value = false;
  }
};

const useSignup = () => {
  return { error, loading, signup };
};

export default useSignup;
