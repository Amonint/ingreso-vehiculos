'use client';

import { useState } from 'react';
import { uploadImage } from '../services/uploadImage';

export const ImageUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      setError('Error al subir la imagen. Por favor, intenta de nuevo.');
      console.error('Error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Seleccionar Imagen
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {uploading && (
        <div className="mb-4 text-center">
          <p className="text-blue-600">Subiendo imagen...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {imageUrl && (
        <div className="mb-4">
          <p className="text-green-600 mb-2">Imagen subida exitosamente!</p>
          <img src={imageUrl} alt="Imagen subida" className="max-w-full h-auto rounded" />
        </div>
      )}
    </div>
  );
}; 