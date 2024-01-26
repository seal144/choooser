import { ref } from "vue";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { getDocs } from "@/firebase/docs";
import getUser from "./getUser";
import CryptoJS from "crypto-js";
import { CommonErrors, RoomData, RoomField, Collection } from "@/types";

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
    const { user } = getUser();
    if (!user.value) {
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

    const room: RoomData = {
      createTime: Timestamp.now(),
      groupId: groupId,
      name: roomFormData.name,
      ownerId: user.value.uid,
      guestsIds: [],
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
