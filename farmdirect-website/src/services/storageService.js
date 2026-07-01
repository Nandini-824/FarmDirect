import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

export async function uploadCropImage(file, farmerId) {
  const ext = file.name.split('.').pop();
  const path = `crops/${farmerId}/${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

export async function deleteCropImage(path) {
  if (!path) return;
  try {
    await deleteObject(ref(storage, path));
  } catch {
    // image may already be deleted
  }
}
