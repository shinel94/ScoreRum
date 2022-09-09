import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { UserInfo } from "../definition/primary";

const firebaseConfig = {
    apiKey: "AIzaSyBJiW33umtnZireJC4892GR3Vh7d279y5E",
    authDomain: "score-rum.firebaseapp.com",
    databaseURL: "https://score-rum-default-rtdb.firebaseio.com",
    projectId: "score-rum",
    storageBucket: "score-rum.appspot.com",
    messagingSenderId: "750807055882",
    appId: "1:750807055882:web:b34b5204999b6b16d329f3"
  };

const app = initializeApp(firebaseConfig, 'score-rum');
const db = getDatabase(app);
export function writeUser(userInfo: UserInfo) {
    const dbRef = ref(db);
  return set(child(dbRef, `users`), {
    id: userInfo.id,
    name: userInfo.name,
    gender: userInfo.gender,
    age: userInfo.age,
    token: userInfo.token,
  });
}

export function readUser(userId: string) {
  const dbRef = ref(db);
  return get(child(dbRef, `users/${userId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
