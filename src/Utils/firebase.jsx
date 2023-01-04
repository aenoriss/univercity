import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, update } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDxb98jz8B5TiB76r7RTKEkOQENR-BRpo4",
    authDomain: "sideworld-93e4c.firebaseapp.com",
    projectId: "sideworld-93e4c",
    storageBucket: "sideworld-93e4c.appspot.com",
    messagingSenderId: "983344652417",
    appId: "1:983344652417:web:6a96d3e14255a924bc6d80",
    databaseURL: "https://sideworld-93e4c-default-rtdb.firebaseio.com/"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let user;

//Signup
export const FirebaseSignup = async(email, password)=> {
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
        console.log(error)
    })
}

//Signin
export const FirebaseSignin = async(email, password)=> {
    return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        //Signed In
        user = userCredential.user;
        console.log("USER CREDENTIALS", user);
        return user;
    })
    .catch((error) => {
        const errorCode = error.code;  
        const errorMessage = error.message;
        console.log(error)
    })
}

const db = getDatabase(app);

//Database
export const FirebaseDB =async(path, data) => {
    console.log("path", path)
    return set(ref(db, path + '/' + user.uid), data);
}

