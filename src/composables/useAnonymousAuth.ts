import { ref } from "vue";
import { signInAnonymously, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import { generateRandomName } from "@/utils/generateRandomName";
import { useUserStore } from "@/store/userStore";

const error = ref<string | null>(null);
const loading = ref(false);
const userStore = useUserStore();

const login = async () => {
  error.value = null;
  loading.value = true;

  try {
    const response = await signInAnonymously(auth);

    if (!response) {
      throw new Error("Something went wrong");
    }

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: generateRandomName(),
      });

      userStore.displayName = auth.currentUser.displayName;
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
