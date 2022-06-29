import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { app } from './getApp';
import { db } from './getDb';

const storage = getStorage(app);

export async function uploadFile(file, videoId, commentId) {
    const name = `${Date.now()}_${videoId}_${commentId}_${file.name}`;
    const storageRef = ref(storage, name);
    const snapshot = await uploadBytes(storageRef, file);
    return snapshot.metadata;
}

async function addFileToComment(fileSnapshot, videoId, commentId) {
    
}
