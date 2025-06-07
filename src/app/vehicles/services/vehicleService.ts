import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Vehicle } from '../types/Vehicle';

const VEHICLES_COLLECTION = 'vehicles';

// Función auxiliar para transformar los datos del documento
const transformVehicleDoc = (doc: any): Vehicle => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    // Asegurarse de que imagenGaleria sea siempre un array
    imagenGaleria: data.imagenGaleria || []
  } as Vehicle;
};

// Obtener un vehículo por ID
export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  try {
    const vehicleDoc = await getDoc(doc(db, VEHICLES_COLLECTION, id));
    if (!vehicleDoc.exists()) return null;
    
    return transformVehicleDoc(vehicleDoc);
  } catch (error) {
    console.error('Error getting vehicle:', error);
    throw error;
  }
};

// Obtener todos los vehículos
export const getAllVehicles = async (): Promise<Vehicle[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, VEHICLES_COLLECTION));
    return querySnapshot.docs.map(transformVehicleDoc);
  } catch (error) {
    console.error('Error getting vehicles:', error);
    throw error;
  }
};

// Crear un nuevo vehículo
export const createVehicle = async (vehicle: Omit<Vehicle, 'id'>): Promise<string> => {
  try {
    // Asegurarse de que imagenGaleria sea un array si no está definido
    const vehicleData = {
      ...vehicle,
      imagenGaleria: vehicle.imagenGaleria || []
    };
    const docRef = await addDoc(collection(db, VEHICLES_COLLECTION), vehicleData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
};

// Actualizar un vehículo existente
export const updateVehicle = async (id: string, vehicle: Partial<Vehicle>): Promise<void> => {
  try {
    await updateDoc(doc(db, VEHICLES_COLLECTION, id), vehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
};

// Eliminar un vehículo
export const deleteVehicle = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, VEHICLES_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }
};

// Actualizar las imágenes de un vehículo
export const updateVehicleImages = async (id: string, imageUrls: string[]): Promise<void> => {
  try {
    await updateDoc(doc(db, VEHICLES_COLLECTION, id), {
      imageUrls: imageUrls || [] // Asegurarse de que siempre sea un array
    });
  } catch (error) {
    console.error('Error updating vehicle images:', error);
    throw error;
  }
}; 