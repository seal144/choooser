import { ref } from "vue";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import getUser from "./getUser";
import CryptoJS from "crypto-js";

type RoomFormData = {
  name: string;
  password: string;
};

const loading = ref(false);
const error = ref<string | null>(null);

const validateParticipants = (userId: string, guests: string[]) => {
  if (guests.includes(userId)) {
    throw new Error("You are already a participant of this room");
  }
  if (guests.length >= 10) {
    throw new Error("The room is full (max 10 participants)");
  }
};

const validateRoom = (roomGroupId: string, passedGroupId: string) => {
  if (!roomGroupId) {
    return;
  }
  const parsedRoomGroupId = CryptoJS.AES.decrypt(
    roomGroupId,
    import.meta.env.VITE_CRYPTO_JS_SECRET_KEY
  ).toString(CryptoJS.enc.Utf8);

  if (parsedRoomGroupId !== passedGroupId) {
    throw new Error("Invalid password");
  }
};

const joinRoom = async (roomFormData: RoomFormData) => {
  const { user } = getUser();
  loading.value = true;
  error.value = null;

  const collectionRef = collection(db, "rooms");

  const queryRoomByName = query(
    collectionRef,
    where("name", "==", roomFormData.name)
  );

  try {
    if (!user.value) {
      throw new Error("Login as a valid user");
    }

    const snapshot = await getDocs(queryRoomByName);

    if (snapshot.empty) {
      throw new Error("No room with such a name");
    }

    const { groupId, guests, owner } = snapshot.docs[0].data();
    const roomId = snapshot.docs[0].id;

    validateParticipants(user.value.uid, [...guests, owner]);
    validateRoom(groupId, roomFormData.password);

    const roomRef = doc(db, "rooms", roomId);

    await updateDoc(roomRef, {
      guests: [...guests, user.value.uid],
    });

    loading.value = false;
  } catch (err) {
    const { message } = err as Error;
    console.error(message);
    loading.value = false;
    error.value = message;
  }
};

const resetError = () => {
  error.value = null;
};

const useJoinNewRoom = () => {
  return { joinRoom, loading, error, resetError };
};

export default useJoinNewRoom;
