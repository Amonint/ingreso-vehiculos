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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-stone-50 to-slate-100">
      {/* Header con branding Go-Motors */}
      <div className="bg-gradient-to-r from-neutral-900 via-gray-900 to-stone-900 shadow-2xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-light text-white tracking-wide">
                  Go-Motors
                </h1>
                <p className="text-neutral-300 text-sm font-light">
                  Ingreso de Vehículos
                </p>
              </div>
            </div>
            <Link
              href="/vehicles/add"
              className="group bg-white hover:bg-neutral-50 text-neutral-900 font-medium py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center space-x-2 border border-neutral-200"
            >
              <svg className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Nuevo Vehículo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div>
            </div>
            <p className="text-neutral-600 font-light mt-6 text-lg">Cargando vehículos registrados...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto bg-white border border-neutral-200 rounded-lg p-8 text-center shadow-sm">
            <div className="bg-neutral-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-800 mb-2">Error de conexión</h3>
            <p className="text-neutral-600 font-light">{error}</p>
            <button 
              onClick={loadVehicles}
              className="mt-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Reintentar
            </button>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-20">
            <div className="bg-neutral-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <svg className="h-10 w-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
            <h3 className="text-2xl font-light text-neutral-800 mb-3">Sin vehículos registrados</h3>
            <p className="text-neutral-500 mb-8 leading-relaxed font-light">
              Comience registrando su primer vehículo en el sistema
            </p>
            <Link
              href="/vehicles/add"
              className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-8 rounded-lg shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Registrar vehículo</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
            <div className="bg-neutral-50 px-8 py-6 border-b border-neutral-200">
              <h2 className="text-xl font-light text-neutral-800 flex items-center space-x-3">
                <svg className="h-5 w-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
                <span>Vehículos Registrados</span>
              </h2>
            </div>
            
            <div className="p-8">
              <VehiclesTable vehicles={vehicles} onDelete={handleDelete} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}