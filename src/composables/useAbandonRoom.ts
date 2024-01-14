import { ref } from "vue";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import getUser from "./getUser";
import { CommonErrors, Room, RoomField } from "@/types";

const loading = ref(false);
const error = ref<string | null>(null);

const abandonRoom = async (roomId: string) => {
  loading.value = true;
  error.value = null;

  try {
    const { user } = getUser();
    if (!user.value) {
      throw new Error(CommonErrors.LoginAsAValidUser);
    }

    const docRef = doc(db, "rooms", roomId);

    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      throw new Error("The document did not found");
    }

    const currentGuestsList: Room[RoomField.Guests] = snapshot.get(
      RoomField.Guests
    );
    const newGuestsList = currentGuestsList.filter(
      (guestId) => guestId !== user.value?.uid
    );

    await updateDoc(docRef, {
      guests: [...newGuestsList],
    });

    loading.value = false;
  } catch (err) {
    const { message } = err as Error;
    console.error(message);
    loading.value = false;
    error.value = message;
  }
};

const useAbandonRoom = () => {
  return { abandonRoom, loading, error };
};

export default useAbandonRoom;
