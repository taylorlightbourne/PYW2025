import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { getFirestore } from '@firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || "AIzaSyDDkk3CPc-F5Nq1JMPaw2Yk6WcuIwX_GTc",
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || "prompt-your-way.firebaseapp.com",
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || "prompt-your-way",
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || "prompt-your-way.firebasestorage.app",
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || "211906981774",
  appId: Constants.expoConfig?.extra?.firebaseAppId || "1:211906981774:web:feec8e6cc582c82cbb3edf",
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId || "G-X5KTGY7T76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with web SDK
const auth = getAuth(app);

// Set persistence to LOCAL (this works in Expo Go)
setPersistence(auth, browserLocalPersistence);

// Initialize Firestore
const db = getFirestore(app);

// Export auth instance and functions
export { 
  app,
  auth, 
  db,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  firebaseSignOut as signOut, 
  updateProfile, 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  updatePassword,
  User
};
