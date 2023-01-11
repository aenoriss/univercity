import { initializeApp } from "firebase/app";
import {
  getDatabase,
  set,
  ref,
  update,
  push,
  onValue,
} from "firebase/database";
import { getStorage, uploadBytes } from "firebase/storage";
import { ref as sRef } from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxb98jz8B5TiB76r7RTKEkOQENR-BRpo4",
  authDomain: "sideworld-93e4c.firebaseapp.com",
  projectId: "sideworld-93e4c",
  storageBucket: "sideworld-93e4c.appspot.com",
  messagingSenderId: "983344652417",
  appId: "1:983344652417:web:6a96d3e14255a924bc6d80",
  databaseURL: "https://sideworld-93e4c-default-rtdb.firebaseio.com/",
  storageBucket: "gs://sideworld-93e4c.appspot.com/",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let user;

//Signup
export const FirebaseSignup = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      //Signed In
      user = userCredential.user;
      console.log("USER CREDENTIALS", user);
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
    });
};

//Signin
export const FirebaseSignin = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      //Signed In
      user = userCredential.user;
      // console.log("USER CREDENTIALS", user);
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
    });
};

const db = getDatabase(app);

//Database
export const DBAddUserData = async (data) => {
  return set(ref(db, "users" + "/" + user.uid), data);
};

export const DBAddReverie = async (data) => {
  const reverieListRef = ref(db, "posts");
  const newPostRef = push(reverieListRef);
  return set(newPostRef, data);
};

export const DBRetrieveRev = async (callback) => {
  const reverieRef = ref(db, "posts");
  return await onValue(reverieRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

export const FirebaseStorage = async (file, user) => {
  //Create a root reference
  const storage = getStorage();

  //Create a reference to the image path
  const imgRef = sRef(storage, "user/" + user.uid + "/" + file.name);
  console.log("IMG REF", imgRef["_location"]["path_"]);

  return await uploadBytes(imgRef, file).then((snapshot) => {
    console.log("snapshot", snapshot);
    return snapshot["ref"]["_location"];
  });
};
