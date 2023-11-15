import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCRvkWfvsyYeasdpWkJtaOitWB_MQMTZfE",
  authDomain: "chooser-d0ebc.firebaseapp.com",
  projectId: "chooser-d0ebc",
  storageBucket: "chooser-d0ebc.appspot.com",
  messagingSenderId: "97787911271",
  appId: "1:97787911271:web:5ad385cf1d1e31644088c2",
  measurementId: "G-DY8CRGDB0Q"
};

const app = initializeApp(firebaseConfig);
// TODO use analytics, for now just initialized
const analytics = getAnalytics(app);
const db = getFirestore();

export { db };
