import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAB_ar0XTZIGfsNEcQK-LuQ5P7H2SK0bL0",
    authDomain: "instagram-clone-5b2d2.firebaseapp.com",
    databaseURL: "https://instagram-clone-5b2d2-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-5b2d2",
    storageBucket: "instagram-clone-5b2d2.appspot.com",
    messagingSenderId: "960229464166",
    appId: "1:960229464166:web:7818651769f060e922b5a7",
    measurementId: "G-3K3FTP77LS"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };