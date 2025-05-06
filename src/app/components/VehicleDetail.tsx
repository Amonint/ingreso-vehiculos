'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Vehicle } from '../types/vehicle';

interface VehicleDetailProps {
  vehicle: Vehicle;
  onDelete: (id: string) => Promise<void>;
}

export default function VehicleDetail({ vehicle, onDelete }: VehicleDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDelete = async () => {
    if (!vehicle.id) return;
    
    try {
      setIsDeleting(true);
      await onDelete(vehicle.id);
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      setIsDeleting(false);
    }
  };

  const nextImage = () => {
    if (vehicle.imageUrls && vehicle.imageUrls.length > 0) {
      setCurrentImageIndex((currentImageIndex + 1) % vehicle.imageUrls.length);
    }
  };

  const prevImage = () => {
    if (vehicle.imageUrls && vehicle.imageUrls.length > 0) {
      setCurrentImageIndex((currentImageIndex - 1 + vehicle.imageUrls.length) % vehicle.imageUrls.length);
    }
  };

  const currentImage = vehicle.imageUrls && vehicle.imageUrls.length > 0
    ? vehicle.imageUrls[currentImageIndex]
    : 'https://via.placeholder.com/800x500?text=Sin+Imagen';
    
  // Helper function to check if hay campos adicionales
  const hasAdditionalFields = (category: any) => {
    return category.adicionales && category.adicionales.length > 0;
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Image Gallery */}
      <div className="relative h-96">
        <img 
          src={currentImage} 
          alt={`${vehicle.marca} ${vehicle.modelo}`} 
          className="w-full h-full object-cover"
        />
        
        {vehicle.imageUrls && vehicle.imageUrls.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </>
        )}
        
        {/* Thumbnails */}
        {vehicle.imageUrls && vehicle.imageUrls.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {vehicle.imageUrls.map((img, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{vehicle.marca} {vehicle.modelo}</h1>
            <p className="text-gray-600">{vehicle.año} • {vehicle.tipoVehiculo}</p>
          </div>
          
          <div className="flex space-x-3">
            <Link 
              href={`/vehicles/edit/${vehicle.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Editar
            </Link>
            
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            ) : (
              <div className="flex items-center space-x-2 bg-red-50 p-2 rounded-md">
                <span className="text-sm text-red-600">¿Confirmar?</span>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? 'Eliminando...' : 'Sí'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Descripción</h2>
          <p className="text-gray-700">{vehicle.descripcion}</p>
        </div>
        
        {/* Specifications */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Especificaciones Técnicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Motor */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-blue-700">Motor</h3>
              <div className="mb-2">
                <p className="text-gray-700">{vehicle.especificaciones.motor.principal}</p>
              </div>
              
              {hasAdditionalFields(vehicle.especificaciones.motor) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Características adicionales:</h4>
                  <ul className="space-y-1">
                    {vehicle.especificaciones.motor.adicionales.map((valor, index) => (
                      <li key={`motor_${index}`} className="text-gray-700">
                        {valor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Transmisión */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-blue-700">Transmisión</h3>
              <div className="mb-2">
                <p className="text-gray-700">{vehicle.especificaciones.transmision.principal}</p>
              </div>
              
              {hasAdditionalFields(vehicle.especificaciones.transmision) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Características adicionales:</h4>
                  <ul className="space-y-1">
                    {vehicle.especificaciones.transmision.adicionales.map((valor, index) => (
                      <li key={`transmision_${index}`} className="text-gray-700">
                        {valor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Consumo */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-blue-700">Consumo</h3>
              <div className="mb-2">
                <p className="text-gray-700">{vehicle.especificaciones.consumo.principal}</p>
              </div>
              
              {hasAdditionalFields(vehicle.especificaciones.consumo) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Características adicionales:</h4>
                  <ul className="space-y-1">
                    {vehicle.especificaciones.consumo.adicionales.map((valor, index) => (
                      <li key={`consumo_${index}`} className="text-gray-700">
                        {valor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Potencia */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-blue-700">Potencia</h3>
              <div className="mb-2">
                <p className="text-gray-700">{vehicle.especificaciones.potencia.principal}</p>
              </div>
              
              {hasAdditionalFields(vehicle.especificaciones.potencia) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Características adicionales:</h4>
                  <ul className="space-y-1">
                    {vehicle.especificaciones.potencia.adicionales.map((valor, index) => (
                      <li key={`potencia_${index}`} className="text-gray-700">
                        {valor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Features */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Características</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Seguridad */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-green-700">Seguridad</h3>
              <div className="mb-2">
                <p className="text-gray-700">{vehicle.caracteristicas.seguridad.principal}</p>
              </div>
              
              {hasAdditionalFields(vehicle.caracteristicas.seguridad) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Características adicionales:</h4>
                  <ul className="space-y-1">
                    {vehicle.caracteristicas.seguridad.adicionales.map((valor, index) => (
                      <li key={`seguridad_${index}`} className="text-gray-700">
                        {valor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Confort */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-green-700">Confort</h3>
              <div className="mb-2">
                <p className="text-gray-700">{vehicle.caracteristicas.confort.principal}</p>
              </div>
              
              {hasAdditionalFields(vehicle.caracteristicas.confort) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Características adicionales:</h4>
                  <ul className="space-y-1">
                    {vehicle.caracteristicas.confort.adicionales.map((valor, index) => (
                      <li key={`confort_${index}`} className="text-gray-700">
                        {valor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Exterior */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-green-700">Exterior</h3>
              <div className="mb-2">
                <p className="text-gray-700">{vehicle.caracteristicas.exterior.principal}</p>
              </div>
              
              {hasAdditionalFields(vehicle.caracteristicas.exterior) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Características adicionales:</h4>
                  <ul className="space-y-1">
                    {vehicle.caracteristicas.exterior.adicionales.map((valor, index) => (
                      <li key={`exterior_${index}`} className="text-gray-700">
                        {valor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Colors */}
        {vehicle.coloresDisponibles && vehicle.coloresDisponibles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Colores Disponibles</h2>
            <div className="flex flex-wrap gap-3">
              {vehicle.coloresDisponibles.map(color => (
                <div key={color} className="flex items-center space-x-2">
                  <span 
                    className="w-6 h-6 rounded-full border border-gray-300" 
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                  <span className="text-gray-700">{color}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Back Button */}
        <div className="mt-10">
          <Link href="/" className="text-blue-600 hover:underline flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Volver a la lista
          </Link>
        </div>
      </div>
    </div>
  );
} 