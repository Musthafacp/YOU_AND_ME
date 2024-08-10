import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import firebasevariables from "../../../env";

const firebaseConfig = {
  apiKey: firebasevariables.apiKey,
  authDomain: firebasevariables.authDomain,
  projectId: firebasevariables.projectId,
  storageBucket: firebasevariables.storageBucket,
  messagingSenderId: firebasevariables.messagingSenderId,
  appId: firebasevariables.appId,
  measurementId: firebasevariables.measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const imDB = getStorage(app);
const analytics = getAnalytics(app);

export { imDB };
