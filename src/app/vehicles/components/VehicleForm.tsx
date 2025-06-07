'use client';

import { useState } from 'react';
import { Vehicle } from '../types/Vehicle';
import { VehicleImageUploader } from './VehicleImageUploader';

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (vehicle: Omit<Vehicle, 'id'>) => void;
  isEditMode?: boolean;
}

export default function VehicleForm({ vehicle, onSubmit, isEditMode = false }: VehicleFormProps) {
  const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>(
    vehicle || {
      marca: '',
      modelo: '',
      anio: new Date().getFullYear(),
      precio: 0,
      kilometraje: 0,
      tipoVehiculo: 'sedan',
      transmision: 'automatico',
      combustible: 'gasolina',
      descripcion: '',
      caracteristicas: [],
      imagenPrincipal: '',
      imagenGaleria: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'kilometraje' ? Number(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Marca */}
          <div>
            <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
              Marca
            </label>
            <input
              type="text"
              name="marca"
              id="marca"
              value={formData.marca}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* Modelo */}
          <div>
            <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
              Modelo
            </label>
            <input
              type="text"
              name="modelo"
              id="modelo"
              value={formData.modelo}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* Año */}
          <div>
            <label htmlFor="anio" className="block text-sm font-medium text-gray-700">
              Año
            </label>
            <input
              type="number"
              name="anio"
              id="anio"
              value={formData.anio}
              onChange={handleChange}
              required
              min="1900"
              max={new Date().getFullYear() + 1}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
              Precio
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="precio"
                id="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                min="0"
                className="block w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Kilometraje */}
          <div>
            <label htmlFor="kilometraje" className="block text-sm font-medium text-gray-700">
              Kilometraje
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                name="kilometraje"
                id="kilometraje"
                value={formData.kilometraje}
                onChange={handleChange}
                required
                min="0"
                className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">km</span>
              </div>
            </div>
          </div>

          {/* Tipo de Vehículo */}
          <div>
            <label htmlFor="tipoVehiculo" className="block text-sm font-medium text-gray-700">
              Tipo de Vehículo
            </label>
            <select
              name="tipoVehiculo"
              id="tipoVehiculo"
              value={formData.tipoVehiculo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="sedan">Sedán</option>
              <option value="suv">SUV</option>
              <option value="pickup">Pickup</option>
              <option value="van">Van</option>
              <option value="deportivo">Deportivo</option>
            </select>
          </div>

          {/* Transmisión */}
          <div>
            <label htmlFor="transmision" className="block text-sm font-medium text-gray-700">
              Transmisión
            </label>
            <select
              name="transmision"
              id="transmision"
              value={formData.transmision}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="automatico">Automático</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          {/* Combustible */}
          <div>
            <label htmlFor="combustible" className="block text-sm font-medium text-gray-700">
              Combustible
            </label>
            <select
              name="combustible"
              id="combustible"
              value={formData.combustible}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="gasolina">Gasolina</option>
              <option value="diesel">Diesel</option>
              <option value="electrico">Eléctrico</option>
              <option value="hibrido">Híbrido</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div className="mt-6">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="descripcion"
            id="descripcion"
            rows={4}
            value={formData.descripcion}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* Imágenes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imágenes
          </label>
          <VehicleImageUploader
            vehicleId={vehicle?.id || 'temp'}
            currentImages={formData.imagenGaleria}
            onImagesUploaded={(urls) => {
              setFormData(prev => ({
                ...prev,
                imagenGaleria: urls,
                imagenPrincipal: urls[0] || ''
              }));
            }}
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEditMode ? 'Actualizar' : 'Crear'} Vehículo
        </button>
      </div>
    </form>
  );
} 