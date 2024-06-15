import { ref } from "vue";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/firebase/config";
import useUser from "@/composables/useUser";
import { CommonErrors, Collection } from "@/types";

const loading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const { deleteUserData } = useUser();

const prepareUserToDelete = async (userId: string, adminPassword: string) => {
  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    const passwordRef = doc(db, Collection.AdminPassword, adminPassword);

    const password = await getDoc(passwordRef);

    if (!password.exists()) {
      throw new Error(CommonErrors.InvalidPassword);
    }

    const userRef = doc(db, Collection.Users, userId);

    const user = await getDoc(userRef);

    if (!user.exists()) {
      throw new Error(CommonErrors.TheUserNotFound);
    }

    deleteUserData(userId);
    loading.value = false;
    successMessage.value = `User "${userId}" data cleared, the User Account is ready to delete in the Firebase console.`;
  } catch (err) {
    const { message } = err as Error;
    console.error(message);
    error.value = message;
    loading.value = false;
  }
};

const resetError = () => {
  error.value = "";
};

const useAdmin = () => {
  return { prepareUserToDelete, loading, error, successMessage, resetError };
};

export default useAdmin;
