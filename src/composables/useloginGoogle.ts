import { ref } from "vue";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "@/firebase/config";
import initDisplayName from "@/firebase/initDisplayName";
import { Collection, CommonErrors } from "@/types";

const parseErrorMessage = (message: string) => {
  if (message.includes("popup-closed-by-user")) {
    return "To be authorized by Google, please do not close the popup.";
  }
  return message;
};

const error = ref<string | null>(null);
const loading = ref(false);

const login = async () => {
  error.value = null;
  loading.value = true;

  try {
    const provider = new GoogleAuthProvider();
    const response = await signInWithPopup(auth, provider);

    if (!response) {
      throw new Error(CommonErrors.CouldNotLogin);
    }

    if (auth.currentUser) {
      const userRef = doc(db, Collection.Users, auth.currentUser.uid);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        await initDisplayName();
      }
    }

    loading.value = false;
  } catch (err) {
    const { message } = err as Error;
    console.error(message);
    error.value = parseErrorMessage(message);
    loading.value = false;
  }
};

const useLogin = () => {
  return { error, loading, login };
};

export default useLogin;
