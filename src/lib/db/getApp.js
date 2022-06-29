import 'babel-polyfill';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: 'AIzaSyBbxuL_tjrQyituxWMRE4CSyndz1rMPD88',
    authDomain: 'hackathon-7c63e.firebaseapp.com',
    projectId: 'hackathon-7c63e',
    storageBucket: 'hackathon-7c63e.appspot.com',
    messagingSenderId: '672250605436',
    appId: '1:672250605436:web:ff3fb86d592c65aa283ef9',
};

export const app = initializeApp(firebaseConfig);

