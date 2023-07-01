import { initializeApp } from "firebase/app";
import {
  getDatabase,
  set,
  get,
  ref,
  update,
  off,
  push,
  onValue,
} from "firebase/database";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as sRef } from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAq8lOdn0ymXfqE4JvtvssasvAGGcRi8E8",
  authDomain: "univercity-73841.firebaseapp.com",
  databaseURL: "https://univercity-73841-default-rtdb.firebaseio.com",
  projectId: "univercity-73841",
  messagingSenderId: "1008219884566",
  appId: "1:1008219884566:web:14a343f514b816164e7937",
  storageBucket: "gs://univercity-73841.appspot.com",
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
  let newReverie = data;
  const reverieListRef = ref(db, "posts");
  const newPostRef = push(reverieListRef);
  newReverie.id = newPostRef.key;
  return await set(newPostRef, newReverie);
};

export const DBRetrieveRev = async(callback) => {
  const reverieRef = ref(db, "posts");
  onValue(reverieRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

export const FirebaseStorage = async (file, user) => {
  //Create a root reference
  const storage = getStorage();

  //Create a reference to the image path
  const imgRef = sRef(storage, "img/" + file.name);

  return await uploadBytes(imgRef, file).then((snapshot) => {
    return snapshot["ref"]["_location"];
  });
};

export const getFile = async (file) => {
  const storage = getStorage();
  return getDownloadURL(sRef(storage, file))
    .then((url) => {
      // `url` is the download URL for 'images/stars.jpg'


      return url;
    })
    .catch((error) => {
      // Handle any errors
    });
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  return signInWithPopup(auth, provider).then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;

    return user;
  });
};

export const DBAddReply = async (reverieID, newReply) => {
  let newReplyFinal = {
    text: newReply.text,
    date: newReply.date,
  };
  const reverieRef = ref(db, `posts/${reverieID}/replies`);
  let newReplyRef = push(reverieRef);
  newReply.id = newReplyRef.key;

  await set(newReplyRef, newReplyFinal);
};

export const DBRetrieveRevReplies = async (reverieID, callback) => {
  const reverieRef = ref(db, `posts/${reverieID}/replies`);
  onValue(reverieRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

export const closeListener = async (path) => {
  const refListener = await ref(db, path);
  off(refListener)
};
