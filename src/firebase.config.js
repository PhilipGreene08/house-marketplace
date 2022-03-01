// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD5PIb6NereBZTLM9UwXHVcPElS90xTKr0',
  authDomain: 'house-marketplace-app-2fbab.firebaseapp.com',
  projectId: 'house-marketplace-app-2fbab',
  storageBucket: 'house-marketplace-app-2fbab.appspot.com',
  messagingSenderId: '495167558563',
  appId: '1:495167558563:web:316876445f6654bc828016',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
