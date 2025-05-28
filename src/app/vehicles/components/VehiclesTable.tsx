'use client';

import { useState } from 'react';
import { Vehicle } from '../types/Vehicle';
import Link from 'next/link';
import { VehicleImageUploader } from './VehicleImageUploader';

interface VehiclesTableProps {
  vehicles: Vehicle[];
  onDelete?: (id: string) => void;
}

export const VehiclesTable = ({ vehicles, onDelete }: VehiclesTableProps) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (vehicleId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [vehicleId]: true
    }));
  };

  const renderVehicleImage = (vehicle: Vehicle) => {
    if (!vehicle.imageUrls || vehicle.imageUrls.length === 0 || imageErrors[vehicle.id!]) {
      return (
        <div className="relative group">
          <div className="h-16 w-20 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs text-gray-500">Sin imagen</span>
          </div>
          {vehicle.id && (
            <button
              onClick={() => setSelectedVehicle(vehicle.id)}
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center rounded transition-all duration-200"
            >
              <span className="text-white opacity-0 group-hover:opacity-100 text-xs">
                Subir imagen
              </span>
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="relative group">
        <img
          src={vehicle.imageUrls[0]}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          className="h-16 w-20 object-cover rounded"
          onError={() => vehicle.id && handleImageError(vehicle.id)}
        />
        {vehicle.id && (
          <button
            onClick={() => setSelectedVehicle(vehicle.id)}
            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center rounded transition-all duration-200"
          >
            <span className="text-white opacity-0 group-hover:opacity-100 text-xs">
              Cambiar imagen
            </span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderVehicleImage(vehicle)}
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
                  <div className="text-sm text-gray-900">{vehicle.tipoVehiculo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/vehicles/edit/${vehicle.id}`}
                      className="text-green-600 hover:text-green-900 transition-colors"
                    >
                      Editar
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(vehicle.id!)}
                        className="text-red-600 hover:text-red-900 transition-colors"
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

      {/* Modal de subida de imágenes */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Subir Imagen</h3>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <VehicleImageUploader
              vehicleId={selectedVehicle}
              currentImages={vehicles.find(v => v.id === selectedVehicle)?.imageUrls}
              onImagesUploaded={() => {
                setSelectedVehicle(null);
                // Recargar la página para ver los cambios
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}; 