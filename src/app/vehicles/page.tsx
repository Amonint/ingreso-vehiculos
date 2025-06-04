'use client';

import { useEffect, useState } from 'react';
import { Vehicle } from './types/Vehicle';
import { VehiclesTable } from './components/VehiclesTable';
import { getAllVehicles, deleteVehicle } from './services/vehicleService';
import Link from 'next/link';
import { useRequireAuth } from '../hooks/useRequireAuth';

export default function VehiclesPage() {
  useRequireAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<string>('');

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const data = await getAllVehicles();
      setVehicles(data);
      // Información de depuración
      setDebug(JSON.stringify(data, null, 2));
      setError(null);
    } catch (err) {
      setError('Error al cargar los vehículos');
      console.error('Error loading vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      try {
        await deleteVehicle(id);
        await loadVehicles();
      } catch (err) {
        console.error('Error deleting vehicle:', err);
        alert('Error al eliminar el vehículo');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Swiss Design - Grid System */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Logo/Brand - Spans 6 columns */}
            <div className="col-span-6">
              <div className="border-l-4 border-red-600 pl-6">
                <h1 className="text-4xl font-black text-white tracking-tight uppercase">
                  GO-MOTORS
                </h1>
                <p className="text-red-600 text-sm font-medium uppercase tracking-widest mt-2">
                  INGRESO DE VEHÍCULOS
                </p>
              </div>
            </div>
            
            {/* CTA Button - Spans 6 columns, right aligned */}
            <div className="col-span-6 flex justify-end">
              <Link
                href="/vehicles/add"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 uppercase tracking-wider text-sm transition-colors duration-150"
              >
                + NUEVO VEHÍCULO
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Swiss Grid */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block">
              <div className="w-2 h-16 bg-black animate-pulse"></div>
            </div>
            <p className="text-black font-medium uppercase tracking-wider text-sm mt-8">
              CARGANDO VEHÍCULOS REGISTRADOS
            </p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto py-16">
            <div className="bg-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-red-600 mx-auto mb-8"></div>
              <h3 className="text-xl font-black text-black uppercase tracking-wide mb-4">
                ERROR DE CONEXIÓN
              </h3>
              <p className="text-gray-700 font-medium mb-8">{error}</p>
              <button 
                onClick={loadVehicles}
                className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 uppercase tracking-wider text-sm transition-colors duration-150"
              >
                REINTENTAR
              </button>
            </div>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-32">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-200 mx-auto mb-12"></div>
              <h3 className="text-3xl font-black text-black uppercase tracking-wide mb-6">
                SIN VEHÍCULOS
                <br />
                REGISTRADOS
              </h3>
              <p className="text-gray-600 font-medium mb-12 leading-relaxed">
                Comience registrando su primer vehículo en el sistema
              </p>
              <Link
                href="/vehicles/add"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 uppercase tracking-wider text-sm transition-colors duration-150"
              >
                + REGISTRAR VEHÍCULO
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Section Header - Swiss Typography */}
            <div className="mb-12 border-b-2 border-black pb-6">
              <h2 className="text-2xl font-black text-black uppercase tracking-wide">
                VEHÍCULOS REGISTRADOS
              </h2>
              <div className="w-16 h-1 bg-red-600 mt-3"></div>
            </div>
            
            {/* Table Container */}
            <div className="bg-white border-2 border-black">
              <div className="p-8">
                <VehiclesTable vehicles={vehicles} onDelete={handleDelete} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}