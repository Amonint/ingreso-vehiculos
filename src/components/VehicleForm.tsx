'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Vehicle } from '../types/vehicle';

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (
    vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>,
    tarjetaImageFile: File,
    bannerImageFile: File,
    galleryImageFiles: File[]
  ) => Promise<void>;
  isEditMode?: boolean;
}

export default function VehicleForm({ vehicle, onSubmit, isEditMode = false }: VehicleFormProps) {
  const [marca, setMarca] = useState(vehicle?.marca || '');
  const [modelo, setModelo] = useState(vehicle?.modelo || '');
  const [año, setAño] = useState(vehicle?.año || new Date().getFullYear());
  const [color, setColor] = useState(vehicle?.color || '');
  const [placa, setPlaca] = useState(vehicle?.placa || '');
  const [tarjetaImageFile, setTarjetaImageFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [tarjetaPreviewUrl, setTarjetaPreviewUrl] = useState<string | null>(vehicle?.tarjetaImageUrl || null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(vehicle?.bannerImageUrl || null);
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>(vehicle?.galleryImageUrls || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTarjetaImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTarjetaImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTarjetaPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      if (files.length > 5) {
        setError('Solo puedes subir hasta 5 imágenes en la galería');
        return;
      }
      setGalleryImageFiles(files);
      const readers = files.map(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviewUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
        return reader;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if ((!tarjetaImageFile || !bannerImageFile || galleryImageFiles.length === 0) && !isEditMode) {
      setError('Por favor, selecciona todas las imágenes requeridas');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(
        {
          marca,
          modelo,
          año,
          color,
          placa,
          tarjetaImageUrl: tarjetaPreviewUrl || '',
          bannerImageUrl: bannerPreviewUrl || '',
          galleryImageUrls: galleryPreviewUrls
        },
        tarjetaImageFile || new File([], ''),
        bannerImageFile || new File([], ''),
        galleryImageFiles
      );
    } catch (err) {
      console.error('Error submitting vehicle:', err);
      setError('Error al guardar el vehículo. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
            Marca
          </label>
          <input
            type="text"
            id="marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
            Modelo
          </label>
          <input
            type="text"
            id="modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="año" className="block text-sm font-medium text-gray-700">
            Año
          </label>
          <input
            type="number"
            id="año"
            value={año}
            onChange={(e) => setAño(parseInt(e.target.value))}
            required
            min={1900}
            max={new Date().getFullYear() + 1}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            type="text"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="placa" className="block text-sm font-medium text-gray-700">
            Placa
          </label>
          <input
            type="text"
            id="placa"
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Imagen Tarjeta
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleTarjetaImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {tarjetaPreviewUrl && (
              <div className="relative w-20 h-20">
                <img
                  src={tarjetaPreviewUrl}
                  alt="Tarjeta Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Imagen Banner
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {bannerPreviewUrl && (
              <div className="relative w-20 h-20">
                <img
                  src={bannerPreviewUrl}
                  alt="Banner Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Imágenes Galería (máximo 5)
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryImagesChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="flex space-x-2">
              {galleryPreviewUrls.map((url, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={url}
                    alt={`Gallery Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : isEditMode ? 'Actualizar Vehículo' : 'Crear Vehículo'}
        </button>
      </div>
    </form>
  );
} 