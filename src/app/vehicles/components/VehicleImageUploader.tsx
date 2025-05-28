'use client';

import { useState } from 'react';
import { uploadVehicleImage, uploadVehicleImages } from '../services/vehicleImageService';

interface VehicleImageUploaderProps {
  vehicleId: string;
  onImagesUploaded?: (urls: string[]) => void;
  multiple?: boolean;
  className?: string;
  currentImages?: string[];
}

export const VehicleImageUploader = ({ 
  vehicleId,
  onImagesUploaded, 
  multiple = false,
  className = '',
  currentImages = []
}: VehicleImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(currentImages);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      setError(null);

      let newUrls: string[] = [];
      if (multiple) {
        const fileArray = Array.from(files);
        newUrls = await uploadVehicleImages(fileArray, vehicleId);
      } else {
        const url = await uploadVehicleImage(files[0], vehicleId);
        newUrls = [url];
      }

      // Actualizar las URLs de imágenes
      const updatedUrls = [...imageUrls, ...newUrls];
      setImageUrls(updatedUrls);
      onImagesUploaded?.(updatedUrls);

      // Limpiar el input de archivo
      event.target.value = '';
    } catch (err) {
      setError('Error al subir la(s) imagen(es). Por favor, intenta de nuevo.');
      console.error('Error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedUrls);
    onImagesUploaded?.(updatedUrls);
  };

  return (
    <div className={`max-w-md mx-auto p-4 ${className}`}>
      <div className="mb-4">
        <label className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg h-32 px-6 cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="text-center">
            <div className="mt-2 flex flex-col items-center">
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p className="mt-1 text-sm text-gray-600">
                {multiple ? 'Hacer clic para seleccionar imágenes' : 'Hacer clic para seleccionar una imagen'}
              </p>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {uploading && (
        <div className="mb-4 text-center">
          <p className="text-blue-600">Subiendo imagen(es)...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Imagen ${index + 1}`}
                className="w-full h-32 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/200x150?text=Error+de+imagen';
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 