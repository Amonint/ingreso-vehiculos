'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getVehicleById, deleteVehicle, deleteVehicleImage } from '../services/vehicleService';
import { Vehicle } from '../types/Vehicle';
import { VehicleDetails } from '../components/VehicleDetails';

export default function VehicleDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const data = await getVehicleById(id);
        if (data) {
          setVehicle(data);
        } else {
          setError('No se encontró el vehículo solicitado.');
          setTimeout(() => router.push('/'), 2000);
        }
      } catch (err) {
        console.error('Error loading vehicle:', err);
        setError('No se pudo cargar el vehículo. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicle();
  }, [id, router]);

  const handleDeleteVehicle = async (id: string) => {
    if (!vehicle) return;
    
    try {
      // Delete the images first
      if (vehicle.imagenBanner) {
        await deleteVehicleImage(vehicle.imagenBanner);
      }
      if (vehicle.imagenTarjeta) {
        await deleteVehicleImage(vehicle.imagenTarjeta);
      }
      if (vehicle.imagenGaleria && vehicle.imagenGaleria.length > 0) {
        for (const imageUrl of vehicle.imagenGaleria) {
          await deleteVehicleImage(imageUrl);
        }
      }
      
      // Delete the vehicle document
      await deleteVehicle(id);
      router.push('/');
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      setError('No se pudo eliminar el vehículo. Por favor, intenta de nuevo.');
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
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return vehicle ? (
    <div className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push('/vehicles')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Volver a vehículos
        </button>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push(`/vehicles/edit/${vehicle.id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150"
          >
            Editar
          </button>
          <button
            onClick={() => handleDeleteVehicle(vehicle.id!)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-150"
          >
            Eliminar
          </button>
        </div>
      </div>
      
      {/* Componente de detalles */}
      <VehicleDetails vehicle={vehicle} />
    </div>
  ) : null;
} 