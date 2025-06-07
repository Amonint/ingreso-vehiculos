'use client';

import { useEffect, useState } from 'react';
import { Vehicle } from './types/Vehicle';
import VehiclesTable from './components/VehiclesTable';
import { getAllVehicles, deleteVehicle } from './services/vehicleService';
import Link from 'next/link';
import { useRequireAuth } from '../hooks/useRequireAuth';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useRequireAuth();

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await getAllVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Error loading vehicles:', err);
      setError('No se pudieron cargar los vehículos. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      try {
        await deleteVehicle(id);
        setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      } catch (err) {
        console.error('Error deleting vehicle:', err);
        setError('No se pudo eliminar el vehículo. Por favor, intenta de nuevo.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Vehículos
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Gestiona el inventario de vehículos
              </p>
            </div>
            <Link
              href="/vehicles/add"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
            >
              Agregar Vehículo
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <VehiclesTable vehicles={vehicles} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}