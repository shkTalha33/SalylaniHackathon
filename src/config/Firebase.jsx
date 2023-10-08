// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage} from "firebase/storage"
import { getAuth} from "firebase/auth"
import { getFirestore} from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyB3Ybwjww1S5WvYdRZxuFtfQblFCYfR3ZY",
  authDomain: "adminsaylani.firebaseapp.com",
  projectId: "adminsaylani",
  storageBucket: "adminsaylani.appspot.com",
  messagingSenderId: "612310108274",
  appId: "1:612310108274:web:2465e0aa88bf796b14daeb",
  measurementId: "G-W5DTLNMRYZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app)
const firestore = getFirestore(app)
const auth = getAuth(app)
export {analytics,auth,firestore,storage}