import { db, storage } from '../firebase/config';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Vehicle } from '../types/vehicle';

const COLLECTION_NAME = 'vehicles';

export const createVehicle = async (
  vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>,
  tarjetaImageFile: File,
  bannerImageFile: File,
  galleryImageFiles: File[]
): Promise<Vehicle> => {
  try {
    // Upload tarjeta image
    const tarjetaImageRef = ref(storage, `vehicles/tarjeta/${Date.now()}_${tarjetaImageFile.name}`);
    await uploadBytes(tarjetaImageRef, tarjetaImageFile);
    const tarjetaImageUrl = await getDownloadURL(tarjetaImageRef);

    // Upload banner image
    const bannerImageRef = ref(storage, `vehicles/banner/${Date.now()}_${bannerImageFile.name}`);
    await uploadBytes(bannerImageRef, bannerImageFile);
    const bannerImageUrl = await getDownloadURL(bannerImageRef);

    // Upload gallery images
    const galleryImageUrls = await Promise.all(
      galleryImageFiles.map(async (file) => {
        const imageRef = ref(storage, `vehicles/gallery/${Date.now()}_${file.name}`);
        await uploadBytes(imageRef, file);
        return getDownloadURL(imageRef);
      })
    );

    // Create vehicle document
    const vehicleData = {
      ...vehicle,
      tarjetaImageUrl,
      bannerImageUrl,
      galleryImageUrls,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), vehicleData);
    return { id: docRef.id, ...vehicleData };
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
};

export const getAllVehicles = async (): Promise<Vehicle[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as Vehicle[];
  } catch (error) {
    console.error('Error getting vehicles:', error);
    throw error;
  }
};

export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
        updatedAt: docSnap.data().updatedAt.toDate()
      } as Vehicle;
    }
    return null;
  } catch (error) {
    console.error('Error getting vehicle:', error);
    throw error;
  }
};

export const updateVehicle = async (
  id: string,
  vehicle: Partial<Vehicle>,
  tarjetaImageFile?: File,
  bannerImageFile?: File,
  galleryImageFiles?: File[]
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData: any = {
      ...vehicle,
      updatedAt: new Date()
    };

    const oldDoc = await getDoc(docRef);
    if (!oldDoc.exists()) throw new Error('Vehicle not found');

    // Handle tarjeta image update
    if (tarjetaImageFile) {
      if (oldDoc.data().tarjetaImageUrl) {
        const oldImageRef = ref(storage, oldDoc.data().tarjetaImageUrl);
        await deleteObject(oldImageRef);
      }
      const imageRef = ref(storage, `vehicles/tarjeta/${Date.now()}_${tarjetaImageFile.name}`);
      await uploadBytes(imageRef, tarjetaImageFile);
      updateData.tarjetaImageUrl = await getDownloadURL(imageRef);
    }

    // Handle banner image update
    if (bannerImageFile) {
      if (oldDoc.data().bannerImageUrl) {
        const oldImageRef = ref(storage, oldDoc.data().bannerImageUrl);
        await deleteObject(oldImageRef);
      }
      const imageRef = ref(storage, `vehicles/banner/${Date.now()}_${bannerImageFile.name}`);
      await uploadBytes(imageRef, bannerImageFile);
      updateData.bannerImageUrl = await getDownloadURL(imageRef);
    }

    // Handle gallery images update
    if (galleryImageFiles && galleryImageFiles.length > 0) {
      // Delete old gallery images
      if (oldDoc.data().galleryImageUrls) {
        await Promise.all(
          oldDoc.data().galleryImageUrls.map(async (url: string) => {
            const oldImageRef = ref(storage, url);
            await deleteObject(oldImageRef);
          })
        );
      }

      // Upload new gallery images
      const newGalleryUrls = await Promise.all(
        galleryImageFiles.map(async (file) => {
          const imageRef = ref(storage, `vehicles/gallery/${Date.now()}_${file.name}`);
          await uploadBytes(imageRef, file);
          return getDownloadURL(imageRef);
        })
      );
      updateData.galleryImageUrls = newGalleryUrls;
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
};

export const deleteVehicle = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Delete all images
      const deletePromises = [];
      
      if (data.tarjetaImageUrl) {
        const tarjetaImageRef = ref(storage, data.tarjetaImageUrl);
        deletePromises.push(deleteObject(tarjetaImageRef));
      }
      
      if (data.bannerImageUrl) {
        const bannerImageRef = ref(storage, data.bannerImageUrl);
        deletePromises.push(deleteObject(bannerImageRef));
      }
      
      if (data.galleryImageUrls) {
        data.galleryImageUrls.forEach((url: string) => {
          const imageRef = ref(storage, url);
          deletePromises.push(deleteObject(imageRef));
        });
      }

      await Promise.all(deletePromises);
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }
}; 