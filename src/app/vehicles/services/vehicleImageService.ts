import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { updateVehicle } from './vehicleService';

export const uploadVehicleImage = async (file: File, vehicleId: string): Promise<string> => {
  try {
    // Create a unique file name
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    
    // Store in vehicles directory in Firebase Storage
    const storageRef = ref(storage, `vehicles/${vehicleId}/${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Solo actualizar el documento si no es un ID temporal
    if (!vehicleId.startsWith('temp_')) {
      await updateVehicle(vehicleId, {
        imageUrls: [downloadURL]
      });
    }
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading vehicle image:', error);
    throw error;
  }
};

// Function to handle multiple images
export const uploadVehicleImages = async (files: File[], vehicleId: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map(async (file) => {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `vehicles/${vehicleId}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      return getDownloadURL(snapshot.ref);
    });

    const urls = await Promise.all(uploadPromises);
    
    // Solo actualizar el documento si no es un ID temporal
    if (!vehicleId.startsWith('temp_')) {
      await updateVehicle(vehicleId, {
        imageUrls: urls
      });
    }

    return urls;
  } catch (error) {
    console.error('Error uploading vehicle images:', error);
    throw error;
  }
}; 