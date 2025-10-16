// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push} from "firebase/database";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDvVnhiFsffdy5VOSF70Cg8uB78aK_ylkI",
  authDomain: "yemekne-f8742.firebaseapp.com",
  databaseURL: "https://yemekne-f8742-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "yemekne-f8742",
  storageBucket: "yemekne-f8742.firebasestorage.app",
  messagingSenderId: "196061803481",
  appId: "1:196061803481:web:eaf73cc74ef701ce2fdfc8",
};

// 🔹 Firebase başlat
const app = initializeApp(firebaseConfig);

// 🔹 Auth yapılandırması (kalıcı oturum için)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// 🔹 Realtime Database
const db = getDatabase(app);

export { app, db, auth, ref, set, onValue, push};
