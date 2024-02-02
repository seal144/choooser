import { ref, watchEffect } from "vue";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "@/firebase/config";
import { ChatField, Collection, CommonErrors, Message } from "@/types";

const subscribeChat = (roomId: string) => {
  const chat = ref<Message[] | null>(null);
  const error = ref<string | null>(null);

  const docRef = doc(db, Collection.Chats, roomId);

  const unsubscribe = onSnapshot(
    docRef,
    async (snapshot) => {
      chat.value = [...snapshot.get(ChatField.Chat)];
      error.value = null;
    },
    (err) => {
      console.error(err.message);
      chat.value = null;
      error.value = CommonErrors.CouldNotFetch;
    }
  );

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsubscribe());
  });

  return { chat, error };
};

export default subscribeChat;
