import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './getApp';
import { db } from './getDb';

const storage = getStorage(app);

export async function uploadFile(file, videoId, commentId) {
    const name = `${Date.now()}_${videoId}_${commentId}_${file.name}`;
    const storageRef = ref(storage, name);
    const snapshot = await uploadBytes(storageRef, file);
    return snapshot.metadata;
}

export async function getUrl(path) {
    return await getDownloadURL(ref(storage, path));
}

async function addFileToComment(fileSnapshot, videoId, commentId) {
    
}
