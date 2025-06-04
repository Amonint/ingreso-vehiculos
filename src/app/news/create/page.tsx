'use client';

import { useRouter } from 'next/navigation';
import { createNews } from '../../../services/newsService';
import NewsForm from '../../../components/NewsForm';
import { News } from '../../../types/news';

export default function CreateNewsPage() {
  const router = useRouter();

  const handleSubmit = async (news: Omit<News, 'id' | 'createdAt' | 'updatedAt'>, imageFile: File) => {
    try {
      await createNews(news, imageFile);
      router.push('/news');
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Crear Nueva Noticia
          </h1>
          <p className="text-gray-600">Ingresa la información de la noticia.</p>
        </div>
        <NewsForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
} 