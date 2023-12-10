import { ref } from "vue";
import { updateProfile } from "firebase/auth";

import { auth } from "@/firebase/config";
import { useUserStore } from "@/store/userStore";

const error = ref<string | null>(null);
const loading = ref(false);
const userStore = useUserStore();

const updateDisplayName = async (displayName: string) => {
  error.value = null;
  loading.value = true;

  if (auth.currentUser) {
    try {
      await updateProfile(auth.currentUser, { displayName });

      userStore.displayName = auth.currentUser.displayName;

      loading.value = false;
    } catch (err) {
      const { message } = err as Error;
      console.log(message);
      error.value = message;
      loading.value = false;
    }
  }
};

const useUser = () => ({
  updateDisplayName,
  error,
  loading,
});

export default useUser;
