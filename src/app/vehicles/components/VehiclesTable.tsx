'use client';

import { useState } from 'react';
import { Vehicle } from '../types/Vehicle';
import { useRouter } from 'next/navigation';
import { VehicleImageUploader } from './VehicleImageUploader';

interface VehiclesTableProps {
  vehicles: Vehicle[];
  onDelete?: (id: string) => void;
}

export default function VehiclesTable({ vehicles, onDelete }: VehiclesTableProps) {
  const router = useRouter();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (vehicleId: string) => {
    setImageErrors(prev => ({ ...prev, [vehicleId]: true }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Imagen
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marca
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modelo
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Año
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative w-20 h-20">
                    {!imageErrors[vehicle.id!] ? (
                      <img
                        src={vehicle.imagenTarjeta}
                        alt={`${vehicle.marca} ${vehicle.modelo}`}
                        className="w-full h-full object-cover rounded-md"
                        onError={() => handleImageError(vehicle.id!)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Sin imagen</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{vehicle.marca}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{vehicle.modelo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{vehicle.año}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${vehicle.precio.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                      className="text-blue-600 hover:text-blue-900 transition-colors duration-150 font-medium"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => router.push(`/vehicles/edit/${vehicle.id}`)}
                      className="text-green-600 hover:text-green-900 transition-colors duration-150 font-medium"
                    >
                      Editar
                    </button>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(vehicle.id!)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-150 font-medium"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 