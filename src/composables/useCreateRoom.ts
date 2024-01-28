import { ref } from "vue";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { getDocs } from "@/firebase/docs";
import CryptoJS from "crypto-js";
import { CommonErrors, RoomDataDB, RoomField, Collection } from "@/types";

type RoomFormData = {
  name: string;
  password: string;
};

const loading = ref(false);
const error = ref<string | null>(null);

const createRoom = async (roomFormData: RoomFormData) => {
  loading.value = true;
  error.value = null;

  try {
    if (!auth.currentUser) {
      throw new Error(CommonErrors.LoginAsAValidUser);
    }

    const snapshot = await getDocs(Collection.Rooms, [
      RoomField.Name,
      "==",
      roomFormData.name,
    ]);

    if (!snapshot.empty) {
      throw new Error("Name already in use");
    }

    const groupId = roomFormData.password
      ? CryptoJS.AES.encrypt(
          roomFormData.password,
          import.meta.env.VITE_CRYPTO_JS_SECRET_KEY
        ).toString()
      : "";

    const room: RoomDataDB = {
      createTime: Timestamp.now(),
      groupId: groupId,
      name: roomFormData.name,
      guestsIds: [],
      owner: {
        id: auth.currentUser.uid,
        displayName: auth.currentUser.displayName
          ? auth.currentUser.displayName
          : "",
      },
      guests: [],
    };

    await addDoc(collection(db, Collection.Rooms), room);
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
