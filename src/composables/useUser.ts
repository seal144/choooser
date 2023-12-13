import { ref } from "vue";
import { updateProfile, deleteUser as deleteUserFirebase } from "firebase/auth";

import { auth } from "@/firebase/config";
import { useUserStore } from "@/store/userStore";

const error = ref<string | null>(null);
const loadingUpdateDisplayName = ref(false);
const loadingDeleteUser = ref(false);
const userStore = useUserStore();

const updateDisplayName = async (displayName: string) => {
  error.value = null;
  loadingUpdateDisplayName.value = true;

  if (auth.currentUser) {
    try {
      await updateProfile(auth.currentUser, { displayName });

      userStore.displayName = auth.currentUser.displayName;

      loadingUpdateDisplayName.value = false;
    } catch (err) {
      const { message } = err as Error;
      console.log(message);
      error.value = message;
      loadingUpdateDisplayName.value = false;
    }
  }
};

const deleteUser = async () => {
  error.value = null;
  loadingDeleteUser.value = true;

  if (auth.currentUser) {
    try {
      await deleteUserFirebase(auth.currentUser);

      loadingDeleteUser.value = false;
    } catch (err) {
      const { message } = err as Error;
      console.log(message);
      error.value = message;
      loadingDeleteUser.value = false;
    }
  }
};

const useUser = () => ({
  updateDisplayName,
  deleteUser,
  error,
  loadingUpdateDisplayName,
  loadingDeleteUser,
});

export default useUser;
