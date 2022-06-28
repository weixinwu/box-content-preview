import 'babel-polyfill';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyBbxuL_tjrQyituxWMRE4CSyndz1rMPD88',
    authDomain: 'hackathon-7c63e.firebaseapp.com',
    projectId: 'hackathon-7c63e',
    storageBucket: 'hackathon-7c63e.appspot.com',
    messagingSenderId: '672250605436',
    appId: '1:672250605436:web:ff3fb86d592c65aa283ef9',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// const { initializeApp } = require('firebase/app');
// const { getFirestore } = require('firebase/firestore');

// const firebaseConfig = {
//     apiKey: 'AIzaSyBbxuL_tjrQyituxWMRE4CSyndz1rMPD88',
//     authDomain: 'hackathon-7c63e.firebaseapp.com',
//     projectId: 'hackathon-7c63e',
//     storageBucket: 'hackathon-7c63e.appspot.com',
//     messagingSenderId: '672250605436',
//     appId: '1:672250605436:web:ff3fb86d592c65aa283ef9',
// };

// const app = initializeApp(firebaseConfig);
// exports.db = getFirestore(app);
