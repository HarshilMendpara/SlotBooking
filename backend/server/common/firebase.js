import firebaseAdmin from "firebase-admin";
import { firebaseConfig } from "./constants";

const firesbaseApp = firebaseAdmin.initializeApp(firebaseConfig);

const database = firesbaseApp.firestore();

export { database };
