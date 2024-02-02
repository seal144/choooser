import { ref } from "vue";
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";

import { auth, db } from "@/firebase/config";
import { CommonErrors, Collection, Message, MessageField } from "@/types";

const error = ref<string | null>(null);
const loading = ref(false);

const sendMessage = async (roomId: string, text: string) => {
  error.value = null;
  loading.value = true;

  try {
    if (!auth.currentUser) {
      throw new Error(CommonErrors.LoginAsAValidUser);
    }

    const message: Message = {
      [MessageField.AuthorId]: auth.currentUser.uid,
      [MessageField.CreateTime]: Timestamp.now(),
      [MessageField.Message]: text,
    };

    const docRef = doc(db, Collection.Chats, roomId);

    await updateDoc(docRef, { chat: arrayUnion(message) });

    loading.value = false;
  } catch (err) {
    const { message } = err as Error;
    console.error(message);
    error.value = message;
    loading.value = false;
  }
};

const useSendMessage = () => ({
  sendMessage,
  loading,
  error,
});

export default useSendMessage;
