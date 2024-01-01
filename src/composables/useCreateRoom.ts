import { ref } from "vue";
import { db } from "@/firebase/config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Room } from "@/types";
import getUser from "./getUser";
import CryptoJS from 'crypto-js';

type RoomData = Omit<Room, "id">;
type RoomFormData = {
  name: string;
  password: string;
};

const loading = ref(false);
const error = ref<string | null>(null);

const createRoom = async (roomFormData: RoomFormData) => {
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

    if (!snapshot.empty) {
      throw new Error("Name already in use");
    }

    const groupId = CryptoJS.AES.encrypt(roomFormData.password, import.meta.env.VITE_CRYPTO_JS_SECRET_KEY).toString();
    // TODO implement decrypt on joining room and delete this commented code.
    // const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, import.meta.env.VITE_CRYPTO_JS_SECRET_KEY).toString(CryptoJS.enc.Utf8);

    const room: RoomData = {
      groupId: groupId,
      name: roomFormData.name,
      owner: user.value.uid,
      guests: [],
    };

    await addDoc(collectionRef, room);
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

const useCreateRoom = () => {
  return { createRoom, loading, error, resetError };
};

export default useCreateRoom;
