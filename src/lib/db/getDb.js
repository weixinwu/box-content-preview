import { app } from "./getApp";
import { getFirestore } from 'firebase/firestore';

export const db = getFirestore(app);
