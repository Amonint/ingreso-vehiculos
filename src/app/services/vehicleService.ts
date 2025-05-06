import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { Vehicle } from '../types/vehicle';

const VEHICLES_COLLECTION = 'vehicles';

// Get all vehicles
export const getVehicles = async (): Promise<Vehicle[]> => {
  const vehiclesQuery = query(collection(db, VEHICLES_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(vehiclesQuery);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Vehicle[];
};

// Get a single vehicle by ID
export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  const docRef = doc(db, VEHICLES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Vehicle;
  } else {
    return null;
  }
};

// Add a new vehicle
export const addVehicle = async (vehicle: Omit<Vehicle, 'id'>, files: File[]): Promise<string> => {
  try {
    // Initialize image URLs array
    const imageUrls: string[] = [];
    
    // Upload images if any
    if (files && files.length > 0) {
      for (const file of files) {
        const fileRef = ref(storage, `vehicles/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        imageUrls.push(downloadURL);
      }
    }
    
    // Prepare the structure for Firestore
    const vehicleData = {
      ...vehicle,
      imageUrls,
      // Ensure the specifications and characteristics structure is correct
      especificaciones: {
        motor: {
          principal: vehicle.especificaciones.motor.principal || "",
          adicionales: vehicle.especificaciones.motor.adicionales || []
        },
        transmision: {
          principal: vehicle.especificaciones.transmision.principal || "",
          adicionales: vehicle.especificaciones.transmision.adicionales || []
        },
        consumo: {
          principal: vehicle.especificaciones.consumo.principal || "",
          adicionales: vehicle.especificaciones.consumo.adicionales || []
        },
        potencia: {
          principal: vehicle.especificaciones.potencia.principal || "",
          adicionales: vehicle.especificaciones.potencia.adicionales || []
        }
      },
      caracteristicas: {
        seguridad: {
          principal: vehicle.caracteristicas.seguridad.principal || "",
          adicionales: vehicle.caracteristicas.seguridad.adicionales || []
        },
        confort: {
          principal: vehicle.caracteristicas.confort.principal || "",
          adicionales: vehicle.caracteristicas.confort.adicionales || []
        },
        exterior: {
          principal: vehicle.caracteristicas.exterior.principal || "",
          adicionales: vehicle.caracteristicas.exterior.adicionales || []
        }
      }
    };
    
    // Add vehicle to Firestore
    const docRef = await addDoc(collection(db, VEHICLES_COLLECTION), vehicleData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding vehicle:", error);
    throw new Error("Failed to add vehicle");
  }
};

// Update an existing vehicle
export const updateVehicle = async (id: string, updatedVehicle: Partial<Vehicle>, files?: File[]): Promise<void> => {
  try {
    const docRef = doc(db, VEHICLES_COLLECTION, id);
    
    // Get existing vehicle to access existing image URLs
    const vehicleDoc = await getDoc(docRef);
    if (!vehicleDoc.exists()) {
      throw new Error(`Vehicle with ID ${id} not found`);
    }
    
    const currentVehicle = vehicleDoc.data() as Vehicle;
    let imageUrls = currentVehicle.imageUrls || [];
    
    // Upload new images if any
    if (files && files.length > 0) {
      for (const file of files) {
        const fileRef = ref(storage, `vehicles/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        imageUrls.push(downloadURL);
      }
    }
    
    // Build the object with changes normalizing the structure
    const vehicleData = {
      ...updatedVehicle,
      imageUrls,
      // Ensure nested structures are correct
      especificaciones: {
        motor: {
          principal: updatedVehicle.especificaciones?.motor?.principal || currentVehicle.especificaciones?.motor?.principal || "",
          adicionales: updatedVehicle.especificaciones?.motor?.adicionales || currentVehicle.especificaciones?.motor?.adicionales || []
        },
        transmision: {
          principal: updatedVehicle.especificaciones?.transmision?.principal || currentVehicle.especificaciones?.transmision?.principal || "",
          adicionales: updatedVehicle.especificaciones?.transmision?.adicionales || currentVehicle.especificaciones?.transmision?.adicionales || []
        },
        consumo: {
          principal: updatedVehicle.especificaciones?.consumo?.principal || currentVehicle.especificaciones?.consumo?.principal || "",
          adicionales: updatedVehicle.especificaciones?.consumo?.adicionales || currentVehicle.especificaciones?.consumo?.adicionales || []
        },
        potencia: {
          principal: updatedVehicle.especificaciones?.potencia?.principal || currentVehicle.especificaciones?.potencia?.principal || "",
          adicionales: updatedVehicle.especificaciones?.potencia?.adicionales || currentVehicle.especificaciones?.potencia?.adicionales || []
        }
      },
      caracteristicas: {
        seguridad: {
          principal: updatedVehicle.caracteristicas?.seguridad?.principal || currentVehicle.caracteristicas?.seguridad?.principal || "",
          adicionales: updatedVehicle.caracteristicas?.seguridad?.adicionales || currentVehicle.caracteristicas?.seguridad?.adicionales || []
        },
        confort: {
          principal: updatedVehicle.caracteristicas?.confort?.principal || currentVehicle.caracteristicas?.confort?.principal || "",
          adicionales: updatedVehicle.caracteristicas?.confort?.adicionales || currentVehicle.caracteristicas?.confort?.adicionales || []
        },
        exterior: {
          principal: updatedVehicle.caracteristicas?.exterior?.principal || currentVehicle.caracteristicas?.exterior?.principal || "",
          adicionales: updatedVehicle.caracteristicas?.exterior?.adicionales || currentVehicle.caracteristicas?.exterior?.adicionales || []
        }
      }
    };
    
    // Update document in Firestore
    await updateDoc(docRef, vehicleData);
  } catch (error) {
    console.error(`Error updating vehicle with ID ${id}:`, error);
    throw new Error(`Failed to update vehicle with ID ${id}`);
  }
};

// Delete a vehicle
export const deleteVehicle = async (id: string): Promise<void> => {
  try {
    // First get the vehicle to access image URLs
    const docRef = doc(db, VEHICLES_COLLECTION, id);
    const vehicleDoc = await getDoc(docRef);
    
    if (!vehicleDoc.exists()) {
      throw new Error(`Vehicle with ID ${id} not found`);
    }
    
    const vehicle = vehicleDoc.data() as Vehicle;
    
    // Delete images from Storage if any
    if (vehicle.imageUrls && vehicle.imageUrls.length > 0) {
      for (const imageUrl of vehicle.imageUrls) {
        try {
          // Extract the path from the URL
          const fileRef = ref(storage, decodeURIComponent(imageUrl.split('?')[0].split('/o/')[1]));
          await deleteObject(fileRef);
        } catch (error) {
          console.error("Error deleting image:", error);
          // Continue with other images even if one fails
        }
      }
    }
    
    // Delete document from Firestore
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting vehicle with ID ${id}:`, error);
    throw new Error(`Failed to delete vehicle with ID ${id}`);
  }
};

// Delete a specific image from a vehicle
export const deleteImage = async (vehicleId: string, imageUrl: string): Promise<void> => {
  try {
    const docRef = doc(db, VEHICLES_COLLECTION, vehicleId);
    const vehicleDoc = await getDoc(docRef);
    
    if (!vehicleDoc.exists()) {
      throw new Error(`Vehicle with ID ${vehicleId} not found`);
    }
    
    const vehicle = vehicleDoc.data() as Vehicle;
    
    // Filter out the image URL to be deleted
    const updatedImageUrls = vehicle.imageUrls?.filter(url => url !== imageUrl) || [];
    
    // Update document without the deleted image
    await updateDoc(docRef, { imageUrls: updatedImageUrls });
    
    // Delete image from Storage
    try {
      // Extract the path from the URL
      const fileRef = ref(storage, decodeURIComponent(imageUrl.split('?')[0].split('/o/')[1]));
      await deleteObject(fileRef);
    } catch (error) {
      console.error("Error deleting image from storage:", error);
      // Continue even if there's an error deleting the image
    }
  } catch (error) {
    console.error(`Error deleting image from vehicle ${vehicleId}:`, error);
    throw new Error(`Failed to delete image from vehicle ${vehicleId}`);
  }
};

// Upload image to Firebase Storage
export const uploadVehicleImage = async (file: File, vehicleId: string): Promise<string> => {
  const storageRef = ref(storage, `vehicles/${vehicleId}/${file.name}_${Date.now()}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Delete image from Firebase Storage
export const deleteVehicleImage = async (imageUrl: string): Promise<void> => {
  // Extract the path from the URL
  const imageRef = ref(storage, imageUrl);
  try {
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}; 