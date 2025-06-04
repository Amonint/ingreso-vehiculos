import { db, storage } from '../firebase/config';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { News } from '../types/news';

const COLLECTION_NAME = 'news';

export const createNews = async (news: Omit<News, 'id' | 'createdAt' | 'updatedAt'>, imageFile: File): Promise<News> => {
  try {
    // Upload image
    const imageRef = ref(storage, `news/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    // Create news document
    const newsData = {
      ...news,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), newsData);
    return { id: docRef.id, ...newsData };
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

export const getAllNews = async (): Promise<News[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as News[];
  } catch (error) {
    console.error('Error getting news:', error);
    throw error;
  }
};

export const getNewsById = async (id: string): Promise<News | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
        updatedAt: docSnap.data().updatedAt.toDate()
      } as News;
    }
    return null;
  } catch (error) {
    console.error('Error getting news:', error);
    throw error;
  }
};

export const updateNews = async (id: string, news: Partial<News>, imageFile?: File): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData: any = {
      ...news,
      updatedAt: new Date()
    };

    if (imageFile) {
      // Delete old image if exists
      const oldDoc = await getDoc(docRef);
      if (oldDoc.exists() && oldDoc.data().imageUrl) {
        const oldImageRef = ref(storage, oldDoc.data().imageUrl);
        await deleteObject(oldImageRef);
      }

      // Upload new image
      const imageRef = ref(storage, `news/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      updateData.imageUrl = await getDownloadURL(imageRef);
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
};

export const deleteNews = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().imageUrl) {
      const imageRef = ref(storage, docSnap.data().imageUrl);
      await deleteObject(imageRef);
    }

    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
}; 