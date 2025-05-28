'use client';

import { useEffect, useState } from 'react';
import { Vehicle } from './types/Vehicle';
import { VehiclesTable } from './components/VehiclesTable';
import { getAllVehicles, deleteVehicle } from './services/vehicleService';
import Link from 'next/link';

export default function VehiclesPage() {
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Vehículos</h1>
        <Link
          href="/vehicles/add"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Agregar Vehículo
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-4">Cargando vehículos...</div>
      ) : error ? (
        <div className="text-red-600 text-center py-4">{error}</div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-4">
          No hay vehículos registrados.
        </div>
      ) : (
        <>
          <VehiclesTable vehicles={vehicles} onDelete={handleDelete} />
          
          {/* Panel de depuración - Solo visible en desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-100 rounded">
              <h3 className="text-lg font-semibold mb-2">Datos de depuración:</h3>
              <pre className="whitespace-pre-wrap text-sm">
                {debug}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
} 