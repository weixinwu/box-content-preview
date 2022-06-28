import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './getDb';

export async function getComments(videoId) {
    const docRef = doc(db, 'comments', videoId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return groupCommentsByTimestamp(docSnap.data().comments);
    }
    return {};
}

export async function addComment(videoId, userId, timestamp, text, timestampRounding = 10) {
    const docRef = doc(db, 'comments', videoId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        await setDoc(doc(db, 'comments', videoId), {
            comments: [],
        });
    }

    const commentsRef = doc(db, 'comments', videoId);
    await updateDoc(commentsRef, {
        comments: arrayUnion({
            timestamp: Math.round(timestamp / timestampRounding) * timestampRounding,
            text,
            userId,
            createdAt: Date.now(),
        }),
    });
}

function groupCommentsByTimestamp(comments) {
    return comments.reduce((result, comment) => {
        if (!result[comment.timestamp]) {
            result[comment.timestamp] = [];
        }
        result[comment.timestamp].push({
            timestamp: comment.timestamp,
            text: comment.text,
            createdAt: comment.createdAt,
            userId: comment.userId,
        });
        return result;
    }, {});
}
