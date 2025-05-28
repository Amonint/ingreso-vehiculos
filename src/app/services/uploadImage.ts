import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Create a unique file name
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    
    // Create a reference to the file location
    const storageRef = ref(storage, `vehicles/${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}; 