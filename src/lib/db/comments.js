import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './getDb';
import { uploadFile } from './file';

/**
 * @return {Promise<{
 *     attachments: {path: string, contentType: string}[]
 *     createdAt: number
 *     id: string
 *     text: string
 *     timestamp: number
 *     userId: string
 * }>}
 */
export async function getComments(videoId) {
    const docRef = doc(db, 'comments', videoId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        let comments = addAttachments(data.comments, data.attachments);
        comments = addLikes(comments, data.likes);
        return groupCommentsByTimestamp(comments);
    }
    return {};
}

/**
 * @param {string} videoId
 * @param {string} userId
 * @param {number} timestamp
 * @param {string} text
 * @param {FileList} files
 */
export async function addComment(videoId, userId, timestamp, text, files = [], timestampRounding = 10) {
    const commentsRef = doc(db, 'comments', videoId);
    const commentsSnap = await getDoc(commentsRef);

    if (!commentsSnap.exists()) {
        await setDoc(doc(db, 'comments', videoId), {
            comments: [],
            attachments: [],
            likes: [],
        });
    }

    const comment = {
        timestamp: Math.round(timestamp / timestampRounding) * timestampRounding,
        text,
        userId,
        createdAt: Date.now(),
        id: `${Date.now()}_${Math.random()
            .toString(36)
            .slice(2)}`,
    };

    let filesData = [];
    if ([...files].length) {
        const promises = [];
        [...files].forEach(file => {
            promises.push(uploadFile(file, videoId, comment.id));
        });

        const uploadedFiles = await Promise.all(promises);
        filesData = uploadedFiles.map(file => ({
            commentId: comment.id,
            path: file.fullPath,
            contentType: file.contentType,
        }));
    }

    await updateDoc(commentsRef, {
        comments: arrayUnion(comment),
        attachments: arrayUnion(...filesData),
    });

    comment.attachments = filesData;

    return comment;
}

export async function removeComment(videoId, commentId) {
    const commentsRef = doc(db, 'comments', videoId);
    const commentsSnap = await getDoc(commentsRef);

    if (commentsSnap.exists()) {
        const comment = commentsSnap.data().comments.find(c => c.id === commentId);
        if (comment) {
            await updateDoc(commentsRef, {
                comments: arrayRemove(comment),
            });
        }
    }
}

export async function addLike(videoId, commentId, userId) {
    const commentsRef = doc(db, 'comments', videoId);

    await updateDoc(commentsRef, {
        likes: arrayUnion({ userId, commentId }),
    });
}

export async function removeLike(videoId, commentId, userId) {
    const commentsRef = doc(db, 'comments', videoId);

    await updateDoc(commentsRef, {
        likes: arrayRemove({ userId, commentId }),
    });
}

function groupCommentsByTimestamp(comments) {
    return comments.reduce((result, comment) => {
        if (!result[comment.timestamp]) {
            result[comment.timestamp] = [];
        }
        result[comment.timestamp].push(comment);
        return result;
    }, {});
}

function addAttachments(comments, attachments) {
    for (const comment of comments) {
        comment.attachments = [];
        if (attachments) {
            for (const attachment of attachments) {
                if (attachment.commentId === comment.id) {
                    comment.attachments.push(attachment);
                }
            }
        }
    }
    return comments;
}

function addLikes(comments, likes) {
    for (const comment of comments) {
        comment.likeAmount = 0;
        comment.likes = [];
        if (likes) {
            for (const like of likes) {
                if (like.commentId === comment.id) {
                    comment.likes.push(like);
                    comment.likeAmount++;
                }
            }
        }
    }
    return comments;
}
