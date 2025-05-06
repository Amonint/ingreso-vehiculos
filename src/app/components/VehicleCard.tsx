'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Vehicle } from '../types/vehicle';

interface VehicleCardProps {
  vehicle: Vehicle;
  onDelete: (id: string) => Promise<void>;
}

export default function VehicleCard({ vehicle, onDelete }: VehicleCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Imagen principal o placeholder
  const mainImage = vehicle.imageUrls && vehicle.imageUrls.length > 0
    ? vehicle.imageUrls[0]
    : 'https://via.placeholder.com/800x400?text=Sin+Imagen';
    
  // Extraer especificaciones principales para mostrar
  const specs = [
    { label: 'Motor', value: vehicle.especificaciones.motor.principal },
    { label: 'Transmisión', value: vehicle.especificaciones.transmision.principal },
  ];
  
  // Extraer características principales para mostrar
  const features = [
    { label: 'Seguridad', value: vehicle.caracteristicas.seguridad.principal },
    { label: 'Confort', value: vehicle.caracteristicas.confort.principal },
  ];

  const handleDelete = async () => {
    if (!vehicle.id) return;
    
    try {
      setIsDeleting(true);
      await onDelete(vehicle.id);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={mainImage} 
          alt={`${vehicle.marca} ${vehicle.modelo}`} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
          {vehicle.tipoVehiculo}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold text-gray-800 mb-1">{vehicle.marca} {vehicle.modelo}</h2>
          <span className="text-gray-600">{vehicle.año}</span>
        </div>
        
        <div className="mb-4">
          <div className="text-sm line-clamp-2 text-gray-600 mb-2">
            {vehicle.descripcion}
          </div>
          
          {/* Mostrar los colores disponibles como pequeños círculos */}
          {vehicle.coloresDisponibles && vehicle.coloresDisponibles.length > 0 && (
            <div className="flex mt-2 space-x-1">
              {vehicle.coloresDisponibles.slice(0, 5).map((color, index) => (
                <span 
                  key={index} 
                  className="w-4 h-4 rounded-full border border-gray-300" 
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {vehicle.coloresDisponibles.length > 5 && (
                <span className="text-xs text-gray-500 flex items-center">
                  +{vehicle.coloresDisponibles.length - 5} más
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-100 pt-3 mb-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Especificaciones</h3>
          <ul className="text-sm space-y-1">
            {specs.map((spec, index) => (
              <li key={index} className="text-gray-600">
                <span className="font-medium">{spec.label}:</span> {spec.value}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border-t border-gray-100 pt-3 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Características</h3>
          <ul className="text-sm space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="text-gray-600">
                <span className="font-medium">{feature.label}:</span> {feature.value}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-between mt-4">
          <Link 
            href={`/vehicles/${vehicle.id}`} 
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors duration-300"
          >
            Ver Detalles
          </Link>
          
          <div className="flex space-x-2">
            <Link
              href={`/vehicles/edit/${vehicle.id}`}
              className="px-3 py-1 bg-gray-50 text-gray-600 rounded-md text-sm hover:bg-gray-100"
            >
              Editar
            </Link>
            
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100"
              >
                Eliminar
              </button>
            ) : (
              <div className="flex space-x-1">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-2 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? '...' : 'Sí'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md text-xs hover:bg-gray-300"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 