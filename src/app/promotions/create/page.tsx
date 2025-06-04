'use client';

import { useRouter } from 'next/navigation';
import { createPromotion } from '../../../services/promotionService';
import PromotionForm from '../../../components/PromotionForm';

export default function CreatePromotionPage() {
  const router = useRouter();

  const handleSubmit = async (imageFile: File) => {
    try {
      await createPromotion(imageFile);
      router.push('/promotions');
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Subir Nueva Promoción
          </h1>
          <p className="text-gray-600">Selecciona una imagen para subir.</p>
        </div>
        <PromotionForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
} 