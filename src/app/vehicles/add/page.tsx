'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VehicleForm from '../../components/VehicleForm';
import { addVehicle } from '../../services/vehicleService';
import { Vehicle } from '../../types/vehicle';

export default function AddVehiclePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (vehicle: Omit<Vehicle, 'id'>) => {
    try {
      setError(null);
      // Crear un nuevo ID temporal para el vehículo
      const tempId = `temp_${Date.now()}`;
      
      // Mover las imágenes de la carpeta temporal a la carpeta permanente
      const imageUrls = vehicle.imagenGaleria || [];
      const permanentImageUrls = await Promise.all(
        imageUrls.map(async (url: string) => {
          if (url.includes('/temp/')) {
            // Obtener el nombre del archivo de la URL
            const fileName = url.split('/').pop()?.split('?')[0] || '';
            // Crear una nueva referencia en la carpeta permanente
            const newUrl = url.replace('/temp/', '/');
            return newUrl;
          }
          return url;
        })
      );

      // Actualizar el vehículo con las URLs permanentes
      const vehicleData = {
        ...vehicle,
        imagenGaleria: permanentImageUrls
      };

      const newId = await addVehicle(vehicleData);
      router.push(`/vehicles/${newId}`);
    } catch (err) {
      console.error('Error adding vehicle:', err);
      setError('No se pudo guardar el vehículo. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Agregar Nuevo Vehículo</h1>
          <p className="text-gray-600">Completa el formulario para agregar un nuevo vehículo al inventario.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <VehicleForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
} 