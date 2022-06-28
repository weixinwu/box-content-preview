import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './getDb';

export async function getComments(videoId) {
    const docRef = doc(db, 'comments', videoId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    }
    return {};
}

export async function addComment(videoId, userId, timestamp, text) {
    const docRef = doc(db, 'comments', videoId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        await setDoc(doc(db, 'comments', videoId), {
            timestamps: [],
        });
    }

    const commentsRef = doc(db, 'comments', videoId);
    await updateDoc(commentsRef, {
        timestamps: arrayUnion({
            timestamp,
            text,
            userId,
            createdAt: Date.now(),
        }),
    });
}
