import { Promotion } from '../types/promotion';
import { db, storage } from '../firebase/config';
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const COLLECTION_NAME = 'promotions';

export const getAllPromotions = async (): Promise<Promotion[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as Promotion[];
  } catch (error) {
    console.error('Error getting promotions:', error);
    throw error;
  }
};

export const createPromotion = async (imageFile: File): Promise<Promotion> => {
  try {
    // Upload image
    const imageRef = ref(storage, `promotions/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    // Create promotion document
    const promotionData = {
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), promotionData);
    return { id: docRef.id, ...promotionData };
  } catch (error) {
    console.error('Error creating promotion:', error);
    throw error;
  }
};

export const deletePromotion = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().imageUrl) {
      const imageRef = ref(storage, docSnap.data().imageUrl);
      await deleteObject(imageRef);
    }

    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting promotion:', error);
    throw error;
  }
}; 