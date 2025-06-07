'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getNewsById, updateNews } from '../../../../services/newsService';
import NewsForm from '../../../../components/NewsForm';
import { News } from '../../../../types/news';

export default function NewsEditClient({ id }: { id: string }) {
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, [id]);

  const loadNews = async () => {
    try {
      const data = await getNewsById(id);
      if (data) {
        setNews(data);
      } else {
        setError('No se encontró la noticia solicitada.');
        setTimeout(() => router.push('/news'), 2000);
      }
    } catch (err) {
      console.error('Error loading news:', err);
      setError('No se pudo cargar la noticia. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (newsData: Omit<News, 'id' | 'createdAt' | 'updatedAt'>, imageFile: File) => {
    try {
      await updateNews(id, newsData, imageFile);
      router.push('/news');
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return news ? (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Editar Noticia: {news.title}
          </h1>
          <p className="text-gray-600">Actualiza la información de la noticia.</p>
        </div>
        <NewsForm
          news={news}
          onSubmit={handleSubmit}
          isEditMode={true}
        />
      </div>
    </div>
  ) : null;
} 