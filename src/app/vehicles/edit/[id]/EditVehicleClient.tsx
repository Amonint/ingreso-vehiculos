'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getVehicleById, updateVehicle } from '../../../services/vehicleService';
import { Vehicle } from '../../../types/vehicle';
import VehicleForm from '../../../components/VehicleForm';

export default function EditVehicleClient({ id }: { id: string }) {
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

  const handleSubmit = async (vehicleData: Omit<Vehicle, 'id'>) => {
    if (!vehicle || !vehicle.id) return;
    
    try {
      setError(null);
      await updateVehicle(vehicle.id, vehicleData);
      router.push(`/vehicles/${vehicle.id}`);
    } catch (err) {
      console.error('Error updating vehicle:', err);
      setError('No se pudo actualizar el vehículo. Por favor, intenta de nuevo.');
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
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Editar Vehículo: {vehicle.marca} {vehicle.modelo}
      </h1>
      <p className="text-gray-600">Actualiza la información del vehículo.</p>
      <VehicleForm
        vehicle={vehicle}
        onSubmit={handleSubmit}
        isEditMode={true}
      />
    </div>
  ) : null;
} 