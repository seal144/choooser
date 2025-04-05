import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useUserStore } from "@/store/userStore";
import { generateRandomName } from "@/utils/generateRandomName";
import { Collection } from "@/types";

const initDisplayName = async (displayName?: string) => {
  if (auth.currentUser) {
    const userStore = useUserStore();
    // the display name can be undefined, on example for google login, than it is generated randomly
    displayName = displayName ? displayName : generateRandomName();

    await updateProfile(auth.currentUser, { displayName });

    userStore.displayName = auth.currentUser.displayName;

    const docRef = doc(db, Collection.Users, auth.currentUser.uid);
    await setDoc(docRef, { displayName });
  }
};

export default initDisplayName;
