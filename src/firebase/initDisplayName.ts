import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useUserStore } from "@/store/userStore";
import { generateRandomName } from "@/utils/generateRandomName";

const initDisplayName = async (displayName?: string) => {
  if (auth.currentUser) {
    const userStore = useUserStore();
    displayName = displayName ? displayName : generateRandomName();

    await updateProfile(auth.currentUser, { displayName });

    userStore.displayName = auth.currentUser.displayName;

    const docRef = doc(db, "users", auth.currentUser.uid);
    await setDoc(docRef, { displayName });
  }
};

export default initDisplayName;
