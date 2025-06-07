'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getNewsById, deleteNews } from '../../../services/newsService';
import { News } from '../../../types/news';
import Link from 'next/link';

export default function NewsDetailClient({ id }: { id: string }) {
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

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
      try {
        await deleteNews(id);
        router.push('/news');
      } catch (err) {
        console.error('Error deleting news:', err);
        setError('No se pudo eliminar la noticia. Por favor, intenta de nuevo.');
      }
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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">{news.title}</h1>
            <div className="flex space-x-4">
              <Link
                href={`/news/edit/${news.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Editar
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Creado el {news.createdAt.toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <p className="text-gray-700 whitespace-pre-wrap">{news.description}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;
} 