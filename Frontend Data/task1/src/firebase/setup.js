
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyB1l0k0uN2g8U1sQsOZvYeAO-kie9pPmM8",
  authDomain: "myproject-3b0da.firebaseapp.com",
  projectId: "myproject-3b0da",
  storageBucket: "myproject-3b0da.appspot.com",
  messagingSenderId: "462849833563",
  appId: "1:462849833563:web:41f4eb5d8d4f45e7281d7e"
};



const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const auth2=getAuth(app);
export {auth,auth2}
