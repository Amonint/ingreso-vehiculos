'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getVehicles, deleteVehicle, deleteVehicleImage } from './services/vehicleService';
import { Vehicle } from './types/vehicle';
import VehicleCard from './components/VehicleCard';

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Error loading vehicles:', err);
      setError('No se pudieron cargar los vehículos. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      // Find the vehicle to delete
      const vehicleToDelete = vehicles.find(v => v.id === id);
      if (!vehicleToDelete) return;
      
      // Delete the images first
      if (vehicleToDelete.imageUrls && vehicleToDelete.imageUrls.length > 0) {
        for (const imageUrl of vehicleToDelete.imageUrls) {
          await deleteVehicleImage(imageUrl);
        }
      }
      
      // Delete the vehicle document
      await deleteVehicle(id);
      
      // Update local state
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      setError('No se pudo eliminar el vehículo. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Vehículos</h1>
          <Link 
            href="/vehicles/add" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Agregar Vehículo
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No hay vehículos registrados</h3>
            <p className="text-gray-500 mb-6">Comienza agregando tu primer vehículo</p>
            <Link 
              href="/vehicles/add" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Agregar Vehículo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map(vehicle => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
                onDelete={handleDeleteVehicle} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
