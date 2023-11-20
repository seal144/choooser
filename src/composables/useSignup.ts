import { ref } from 'vue';
import { auth } from '@/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const error = ref<string|null>(null);
const loading = ref(false);

const signup = async (email: string, password: string) => {
  error.value = null;
  loading.value = true;

  try {
    const response = await createUserWithEmailAndPassword(auth, email, password);

    if (!response) {
      throw new Error('Could not complete sign up')
    }

    error.value = null;
    loading.value = false;
  } catch (err) {
    console.log((err as Error).message);
    error.value = (err as Error).message;
    loading.value = false;
  }
}

const useSignup = () => {
  return {error, loading, signup}
}

export default useSignup;
