'use client';

import { useState } from 'react';
import { Vehicle } from '../types/Vehicle';

interface VehicleDetailsProps {
  vehicle: Vehicle;
  className?: string;
}

export const VehicleDetails = ({ vehicle, className = '' }: VehicleDetailsProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    vehicle.imagenGaleria && vehicle.imagenGaleria.length > 0 ? vehicle.imagenGaleria[0] : null
  );

  const renderFeatureSection = (section: { principal: string; adicionales: string[] }) => (
    <div className="space-y-2">
      {section.principal && (
        <p className="font-medium">{section.principal}</p>
      )}
      {section.adicionales && section.adicionales.length > 0 && (
        <ul className="list-disc list-inside space-y-1">
          {section.adicionales.map((item, index) => (
            <li key={index} className="text-sm">{item}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Galería de imágenes */}
      {vehicle.imagenGaleria && vehicle.imagenGaleria.length > 0 && (
        <div className="mb-6">
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <img
              src={selectedImage || vehicle.imagenGaleria[0]}
              alt={`${vehicle.marca} ${vehicle.modelo}`}
              className="object-cover rounded-lg w-full h-full"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {vehicle.imagenGaleria.map((url: string, index: number) => (
              <img
                key={index}
                src={url}
                alt={`${vehicle.marca} ${vehicle.modelo} - ${index + 1}`}
                className={`cursor-pointer rounded-lg w-full h-20 object-cover 
                  ${selectedImage === url ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Información básica */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{vehicle.marca} {vehicle.modelo}</h1>
        <p className="text-gray-600 mb-2">Año: {vehicle.año}</p>
        <p className="text-gray-600 mb-4">Tipo: {vehicle.tipoVehiculo}</p>
        <p className="text-gray-700">{vehicle.descripcion}</p>
      </div>

      {/* Colores disponibles */}
      {vehicle.coloresDisponibles && vehicle.coloresDisponibles.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Colores Disponibles</h2>
          <div className="flex gap-2">
            {vehicle.coloresDisponibles.map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Características */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Características</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Confort</h3>
              {renderFeatureSection(vehicle.caracteristicas.confort)}
            </div>
            <div>
              <h3 className="font-medium mb-2">Exterior</h3>
              {renderFeatureSection(vehicle.caracteristicas.exterior)}
            </div>
            <div>
              <h3 className="font-medium mb-2">Seguridad</h3>
              {renderFeatureSection(vehicle.caracteristicas.seguridad)}
            </div>
          </div>
        </div>

        {/* Especificaciones */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Especificaciones</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Motor</h3>
              {renderFeatureSection(vehicle.especificaciones.motor)}
            </div>
            <div>
              <h3 className="font-medium mb-2">Potencia</h3>
              {renderFeatureSection(vehicle.especificaciones.potencia)}
            </div>
            <div>
              <h3 className="font-medium mb-2">Transmisión</h3>
              {renderFeatureSection(vehicle.especificaciones.transmision)}
            </div>
            <div>
              <h3 className="font-medium mb-2">Consumo</h3>
              {renderFeatureSection(vehicle.especificaciones.consumo)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 