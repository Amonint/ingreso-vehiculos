'use client';

import React from 'react';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Vehicle } from '../vehicles/types/Vehicle';
import { uploadVehicleImage } from '../vehicles/services/vehicleImageService';
import { VehicleImageUploader } from '../vehicles/components/VehicleImageUploader';
import { PdfUploader } from '../vehicles/components/PdfUploader';

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (vehicle: Omit<Vehicle, 'id'>) => Promise<string | void>;
  isEditMode?: boolean;
}

interface CampoAdicional {
  id: string;
  valor: string;
}

// Interfaces para almacenar los campos adicionales agrupados por categoría
interface CamposAdicionalesPorCategoria {
  motor: CampoAdicional[];
  transmision: CampoAdicional[];
  consumo: CampoAdicional[];
  potencia: CampoAdicional[];
}

interface CamposCaracteristicasPorCategoria {
  seguridad: CampoAdicional[];
  confort: CampoAdicional[];
  exterior: CampoAdicional[];
}

const initialVehicle: Omit<Vehicle, 'id'> = {
  marca: '',
  modelo: '',
  año: '',
  tipoVehiculo: '',
  descripcion: '',
  precio: 0,
  fichaTecnicaUrl: '',
  imageUrls: [],
  especificaciones: {
    motor: {
      principal: '',
      adicionales: []
    },
    transmision: {
      principal: '',
      adicionales: []
    },
    consumo: {
      principal: '',
      adicionales: []
    },
    potencia: {
      principal: '',
      adicionales: []
    }
  },
  caracteristicas: {
    seguridad: {
      principal: '',
      adicionales: []
    },
    confort: {
      principal: '',
      adicionales: []
    },
    exterior: {
      principal: '',
      adicionales: []
    }
  },
  coloresDisponibles: []
};

// Colores predefinidos en hexadecimal
const colorOptions = [
  { name: 'Blanco', value: '#FFFFFF' },
  { name: 'Negro', value: '#000000' },
  { name: 'Gris', value: '#808080' },
  { name: 'Plata', value: '#C0C0C0' },
  { name: 'Rojo', value: '#FF0000' },
  { name: 'Azul', value: '#0000FF' },
  { name: 'Verde', value: '#008000' },
  { name: 'Amarillo', value: '#FFFF00' },
  { name: 'Naranja', value: '#FFA500' },
  { name: 'Marrón', value: '#A52A2A' }
];

export default function VehicleForm({ vehicle, onSubmit, isEditMode = false }: VehicleFormProps) {
  const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>(initialVehicle);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handlePdfUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      fichaTecnicaUrl: url
    }));
  };
  
  // Estado para campos adicionales de especificaciones agrupados por categoría
  const [camposEspecificaciones, setCamposEspecificaciones] = useState<CamposAdicionalesPorCategoria>({
    motor: [],
    transmision: [],
    consumo: [],
    potencia: []
  });
  
  // Estado para campos adicionales de características agrupados por categoría
  const [camposCaracteristicas, setCamposCaracteristicas] = useState<CamposCaracteristicasPorCategoria>({
    seguridad: [],
    confort: [],
    exterior: []
  });
  
  const [colorPersonalizado, setColorPersonalizado] = useState('#000000');

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
      
      // Convertir campos adicionales de array a array para el formulario
      // Especificaciones
      const especificacionesTemp: CamposAdicionalesPorCategoria = {
        motor: [],
        transmision: [],
        consumo: [],
        potencia: []
      };
      
      // Motor
      if (vehicle.especificaciones.motor.adicionales) {
        especificacionesTemp.motor = vehicle.especificaciones.motor.adicionales.map(
          (valor, index) => ({
            id: `motor_${index}`,
            valor
          })
        );
      }
      
      // Transmisión
      if (vehicle.especificaciones.transmision.adicionales) {
        especificacionesTemp.transmision = vehicle.especificaciones.transmision.adicionales.map(
          (valor, index) => ({
            id: `transmision_${index}`,
            valor
          })
        );
      }
      
      // Consumo
      if (vehicle.especificaciones.consumo.adicionales) {
        especificacionesTemp.consumo = vehicle.especificaciones.consumo.adicionales.map(
          (valor, index) => ({
            id: `consumo_${index}`,
            valor
          })
        );
      }
      
      // Potencia
      if (vehicle.especificaciones.potencia.adicionales) {
        especificacionesTemp.potencia = vehicle.especificaciones.potencia.adicionales.map(
          (valor, index) => ({
            id: `potencia_${index}`,
            valor
          })
        );
      }
      
      setCamposEspecificaciones(especificacionesTemp);
      
      // Características
      const caracteristicasTemp: CamposCaracteristicasPorCategoria = {
        seguridad: [],
        confort: [],
        exterior: []
      };
      
      // Seguridad
      if (vehicle.caracteristicas.seguridad.adicionales) {
        caracteristicasTemp.seguridad = vehicle.caracteristicas.seguridad.adicionales.map(
          (valor, index) => ({
            id: `seguridad_${index}`,
            valor
          })
        );
      }
      
      // Confort
      if (vehicle.caracteristicas.confort.adicionales) {
        caracteristicasTemp.confort = vehicle.caracteristicas.confort.adicionales.map(
          (valor, index) => ({
            id: `confort_${index}`,
            valor
          })
        );
      }
      
      // Exterior
      if (vehicle.caracteristicas.exterior.adicionales) {
        caracteristicasTemp.exterior = vehicle.caracteristicas.exterior.adicionales.map(
          (valor, index) => ({
            id: `exterior_${index}`,
            valor
          })
        );
      }
      
      setCamposCaracteristicas(caracteristicasTemp);
    }
  }, [vehicle]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const parts = name.split('.');
      
      if (parts.length === 2) {
        // Manejo de campos simples como marca, modelo, etc.
        const [section, field] = parts;
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section as keyof typeof prev],
            [field]: value
          }
        }));
      } else if (parts.length === 3) {
        // Manejo de campos anidados como especificaciones.motor.principal
        const [section, subsection, field] = parts;
        
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section as keyof typeof prev],
            [subsection]: {
              ...prev[section as keyof typeof prev][subsection as keyof typeof prev[keyof typeof prev]],
              [field]: value
            }
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Métodos para manejar campos adicionales por categoría
  const agregarCampoAdicional = (
    categoria: keyof CamposAdicionalesPorCategoria | keyof CamposCaracteristicasPorCategoria,
    tipo: 'especificaciones' | 'caracteristicas'
  ) => {
    if (tipo === 'especificaciones') {
      setCamposEspecificaciones(prev => ({
        ...prev,
        [categoria]: [
          ...prev[categoria as keyof CamposAdicionalesPorCategoria],
          {
            id: `${categoria}_${Date.now()}`,
            valor: ''
          }
        ]
      }));
    } else {
      setCamposCaracteristicas(prev => ({
        ...prev,
        [categoria]: [
          ...prev[categoria as keyof CamposCaracteristicasPorCategoria],
          {
            id: `${categoria}_${Date.now()}`,
            valor: ''
          }
        ]
      }));
    }
  };

  const actualizarCampoAdicional = (
    id: string,
    value: string,
    categoria: keyof CamposAdicionalesPorCategoria | keyof CamposCaracteristicasPorCategoria,
    tipo: 'especificaciones' | 'caracteristicas'
  ) => {
    if (tipo === 'especificaciones') {
      setCamposEspecificaciones(prev => {
        const categoriaUpdated = prev[categoria as keyof CamposAdicionalesPorCategoria].map(campo => 
          campo.id === id ? {...campo, valor: value} : campo
        );
        
        return {
          ...prev,
          [categoria]: categoriaUpdated
        };
      });
    } else {
      setCamposCaracteristicas(prev => {
        const categoriaUpdated = prev[categoria as keyof CamposCaracteristicasPorCategoria].map(campo => 
          campo.id === id ? {...campo, valor: value} : campo
        );
        
        return {
          ...prev,
          [categoria]: categoriaUpdated
        };
      });
    }
  };

  const eliminarCampoAdicional = (
    id: string,
    categoria: keyof CamposAdicionalesPorCategoria | keyof CamposCaracteristicasPorCategoria,
    tipo: 'especificaciones' | 'caracteristicas'
  ) => {
    if (tipo === 'especificaciones') {
      setCamposEspecificaciones(prev => {
        const categoriaUpdated = prev[categoria as keyof CamposAdicionalesPorCategoria].filter(campo => campo.id !== id);
        
        return {
          ...prev,
          [categoria]: categoriaUpdated
        };
      });
    } else {
      setCamposCaracteristicas(prev => {
        const categoriaUpdated = prev[categoria as keyof CamposCaracteristicasPorCategoria].filter(campo => campo.id !== id);
        
        return {
          ...prev,
          [categoria]: categoriaUpdated
        };
      });
    }
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => {
      const colores = prev.coloresDisponibles || [];
      if (colores.includes(color)) {
        return {
          ...prev,
          coloresDisponibles: colores.filter(c => c !== color)
        };
      } else {
        return {
          ...prev,
          coloresDisponibles: [...colores, color]
        };
      }
    });
  };

  const handleColorPersonalizadoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setColorPersonalizado(e.target.value);
  };

  const agregarColorPersonalizado = () => {
    if (colorPersonalizado && !formData.coloresDisponibles.includes(colorPersonalizado)) {
      setFormData(prev => ({
        ...prev,
        coloresDisponibles: [...prev.coloresDisponibles, colorPersonalizado]
      }));
    }
  };

  const handleImageUpload = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: urls
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Convertir campos adicionales de array a objeto por categoría
      
      // Especificaciones
      const especificacionesActualizadas = {
        motor: {
          principal: formData.especificaciones.motor.principal,
          adicionales: [] as string[]
        },
        transmision: {
          principal: formData.especificaciones.transmision.principal,
          adicionales: [] as string[]
        },
        consumo: {
          principal: formData.especificaciones.consumo.principal,
          adicionales: [] as string[]
        },
        potencia: {
          principal: formData.especificaciones.potencia.principal,
          adicionales: [] as string[]
        }
      };
      
      // Procesar campos adicionales de motor
      camposEspecificaciones.motor.forEach(campo => {
        if (campo.valor.trim()) {
          especificacionesActualizadas.motor.adicionales.push(campo.valor);
        }
      });
      
      // Procesar campos adicionales de transmisión
      camposEspecificaciones.transmision.forEach(campo => {
        if (campo.valor.trim()) {
          especificacionesActualizadas.transmision.adicionales.push(campo.valor);
        }
      });
      
      // Procesar campos adicionales de consumo
      camposEspecificaciones.consumo.forEach(campo => {
        if (campo.valor.trim()) {
          especificacionesActualizadas.consumo.adicionales.push(campo.valor);
        }
      });
      
      // Procesar campos adicionales de potencia
      camposEspecificaciones.potencia.forEach(campo => {
        if (campo.valor.trim()) {
          especificacionesActualizadas.potencia.adicionales.push(campo.valor);
        }
      });
      
      // Características
      const caracteristicasActualizadas = {
        seguridad: {
          principal: formData.caracteristicas.seguridad.principal,
          adicionales: [] as string[]
        },
        confort: {
          principal: formData.caracteristicas.confort.principal,
          adicionales: [] as string[]
        },
        exterior: {
          principal: formData.caracteristicas.exterior.principal,
          adicionales: [] as string[]
        }
      };
      
      // Procesar campos adicionales de seguridad
      camposCaracteristicas.seguridad.forEach(campo => {
        if (campo.valor.trim()) {
          caracteristicasActualizadas.seguridad.adicionales.push(campo.valor);
        }
      });
      
      // Procesar campos adicionales de confort
      camposCaracteristicas.confort.forEach(campo => {
        if (campo.valor.trim()) {
          caracteristicasActualizadas.confort.adicionales.push(campo.valor);
        }
      });
      
      // Procesar campos adicionales de exterior
      camposCaracteristicas.exterior.forEach(campo => {
        if (campo.valor.trim()) {
          caracteristicasActualizadas.exterior.adicionales.push(campo.valor);
        }
      });
      
      // Actualizar el formData con los campos adicionales
      const formDataActualizado = {
        ...formData,
        especificaciones: especificacionesActualizadas,
        caracteristicas: caracteristicasActualizadas,
        imageUrls: formData.imageUrls || [],
        fichaTecnicaUrl: formData.fichaTecnicaUrl || ''
      };
      
      // Submit the form
      await onSubmit(formDataActualizado);
      
      // Reset form if not in edit mode
      if (!isEditMode) {
        setFormData(initialVehicle);
        setFiles([]);
        setUploadProgress(0);
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
        </h2>
        
        {/* Información General */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Información General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="año" className="block text-sm font-medium text-gray-700 mb-1">Año</label>
              <input
                type="text"
                id="año"
                name="año"
                value={formData.año}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="tipoVehiculo" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo</label>
              <input
                type="text"
                id="tipoVehiculo"
                name="tipoVehiculo"
                value={formData.tipoVehiculo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="SUV, Sedán, Pickup, etc."
              />
            </div>

            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Breve descripción del vehículo"
            />
          </div>
        </div>

        {/* Ficha Técnica */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Ficha Técnica (PDF)</h3>
          <PdfUploader
            vehicleId={vehicle?.id || `temp_${Date.now()}`}
            currentPdfUrl={formData.fichaTecnicaUrl}
            onPdfUploaded={handlePdfUpload}
          />
        </div>
        
        {/* Imágenes */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Imágenes</h3>
          <VehicleImageUploader
            vehicleId={vehicle?.id || `temp_${Date.now()}`}
            multiple={true}
            currentImages={formData.imageUrls}
            onImagesUploaded={handleImageUpload}
          />
        </div>
        
        {/* Especificaciones Técnicas */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Especificaciones Técnicas</h3>
          
          {/* MOTOR */}
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <h4 className="text-lg font-medium mb-2 text-blue-700">Motor</h4>
            
            <div className="mb-3">
              <label htmlFor="especificaciones.motor.principal" className="block text-sm font-medium text-gray-700 mb-1">
                Característica principal <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="especificaciones.motor.principal"
                name="especificaciones.motor.principal"
                value={formData.especificaciones.motor.principal}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2.0L Turbo"
              />
            </div>
            
            {/* Campos adicionales de motor */}
            {camposEspecificaciones.motor.length > 0 && (
              <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700">Características adicionales:</p>
                {camposEspecificaciones.motor.map((campo) => (
                  <div key={campo.id} className="flex items-start space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={campo.valor}
                        onChange={(e) => actualizarCampoAdicional(campo.id, e.target.value, 'motor', 'especificaciones')}
                        placeholder="Escribe otra característica"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarCampoAdicional(campo.id, 'motor', 'especificaciones')}
                      className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-200"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button
              type="button"
              onClick={() => agregarCampoAdicional('motor', 'especificaciones')}
              className="mt-3 flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Agregar característica adicional
            </button>
          </div>
          
          {/* TRANSMISIÓN */}
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <h4 className="text-lg font-medium mb-2 text-blue-700">Transmisión</h4>
            
            <div className="mb-3">
              <label htmlFor="especificaciones.transmision.principal" className="block text-sm font-medium text-gray-700 mb-1">
                Característica principal
              </label>
              <input
                type="text"
                id="especificaciones.transmision.principal"
                name="especificaciones.transmision.principal"
                value={formData.especificaciones.transmision.principal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Automática de 7 velocidades"
              />
            </div>
            
            {/* Campos adicionales de transmisión */}
            {camposEspecificaciones.transmision.length > 0 && (
              <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700">Características adicionales:</p>
                {camposEspecificaciones.transmision.map((campo) => (
                  <div key={campo.id} className="flex items-start space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={campo.valor}
                        onChange={(e) => actualizarCampoAdicional(campo.id, e.target.value, 'transmision', 'especificaciones')}
                        placeholder="Escribe otra característica"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarCampoAdicional(campo.id, 'transmision', 'especificaciones')}
                      className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-200"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button
              type="button"
              onClick={() => agregarCampoAdicional('transmision', 'especificaciones')}
              className="mt-3 flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Agregar característica adicional
            </button>
          </div>
          
          {/* CONSUMO */}
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <h4 className="text-lg font-medium mb-2 text-blue-700">Consumo</h4>
            
            <div className="mb-3">
              <label htmlFor="especificaciones.consumo.principal" className="block text-sm font-medium text-gray-700 mb-1">
                Característica principal
              </label>
              <input
                type="text"
                id="especificaciones.consumo.principal"
                name="especificaciones.consumo.principal"
                value={formData.especificaciones.consumo.principal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="8.2L/100km"
              />
            </div>
            
            {/* Campos adicionales de consumo */}
            {camposEspecificaciones.consumo.length > 0 && (
              <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700">Características adicionales:</p>
                {camposEspecificaciones.consumo.map((campo) => (
                  <div key={campo.id} className="flex items-start space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={campo.valor}
                        onChange={(e) => actualizarCampoAdicional(campo.id, e.target.value, 'consumo', 'especificaciones')}
                        placeholder="Escribe otra característica"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarCampoAdicional(campo.id, 'consumo', 'especificaciones')}
                      className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-200"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button
              type="button"
              onClick={() => agregarCampoAdicional('consumo', 'especificaciones')}
              className="mt-3 flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Agregar característica adicional
            </button>
          </div>
          
          {/* POTENCIA */}
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <h4 className="text-lg font-medium mb-2 text-blue-700">Potencia</h4>
            
            <div className="mb-3">
              <label htmlFor="especificaciones.potencia.principal" className="block text-sm font-medium text-gray-700 mb-1">
                Característica principal
              </label>
              <input
                type="text"
                id="especificaciones.potencia.principal"
                name="especificaciones.potencia.principal"
                value={formData.especificaciones.potencia.principal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="211HP"
              />
            </div>
            
            {/* Campos adicionales de potencia */}
            {camposEspecificaciones.potencia.length > 0 && (
              <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700">Características adicionales:</p>
                {camposEspecificaciones.potencia.map((campo) => (
                  <div key={campo.id} className="flex items-start space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={campo.valor}
                        onChange={(e) => actualizarCampoAdicional(campo.id, e.target.value, 'potencia', 'especificaciones')}
                        placeholder="Escribe otra característica"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarCampoAdicional(campo.id, 'potencia', 'especificaciones')}
                      className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-200"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button
              type="button"
              onClick={() => agregarCampoAdicional('potencia', 'especificaciones')}
              className="mt-3 flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Agregar característica adicional
            </button>
          </div>
        </div>
        
        {/* Características */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Características</h3>
          
          {/* SEGURIDAD */}
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <h4 className="text-lg font-medium mb-2 text-green-700">Seguridad</h4>
            
            <div className="mb-3">
              <label htmlFor="caracteristicas.seguridad.principal" className="block text-sm font-medium text-gray-700 mb-1">
                Característica principal
              </label>
              <input
                type="text"
                id="caracteristicas.seguridad.principal"
                name="caracteristicas.seguridad.principal"
                value={formData.caracteristicas.seguridad.principal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="6 airbags"
              />
            </div>
            
            {/* Campos adicionales de seguridad */}
            {camposCaracteristicas.seguridad.length > 0 && (
              <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700">Características adicionales:</p>
                {camposCaracteristicas.seguridad.map((campo) => (
                  <div key={campo.id} className="flex items-start space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={campo.valor}
                        onChange={(e) => actualizarCampoAdicional(campo.id, e.target.value, 'seguridad', 'caracteristicas')}
                        placeholder="Escribe otra característica"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarCampoAdicional(campo.id, 'seguridad', 'caracteristicas')}
                      className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-200"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button
              type="button"
              onClick={() => agregarCampoAdicional('seguridad', 'caracteristicas')}
              className="mt-3 flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Agregar característica adicional
            </button>
          </div>
          
          {/* CONFORT */}
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <h4 className="text-lg font-medium mb-2 text-green-700">Confort</h4>
            
            <div className="mb-3">
              <label htmlFor="caracteristicas.confort.principal" className="block text-sm font-medium text-gray-700 mb-1">
                Característica principal
              </label>
              <input
                type="text"
                id="caracteristicas.confort.principal"
                name="caracteristicas.confort.principal"
                value={formData.caracteristicas.confort.principal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pantalla táctil"
              />
            </div>
            
            {/* Campos adicionales de confort */}
            {camposCaracteristicas.confort.length > 0 && (
              <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700">Características adicionales:</p>
                {camposCaracteristicas.confort.map((campo) => (
                  <div key={campo.id} className="flex items-start space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={campo.valor}
                        onChange={(e) => actualizarCampoAdicional(campo.id, e.target.value, 'confort', 'caracteristicas')}
                        placeholder="Escribe otra característica"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarCampoAdicional(campo.id, 'confort', 'caracteristicas')}
                      className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-200"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button
              type="button"
              onClick={() => agregarCampoAdicional('confort', 'caracteristicas')}
              className="mt-3 flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Agregar característica adicional
            </button>
          </div>
          
          {/* EXTERIOR */}
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <h4 className="text-lg font-medium mb-2 text-green-700">Exterior</h4>
            
            <div className="mb-3">
              <label htmlFor="caracteristicas.exterior.principal" className="block text-sm font-medium text-gray-700 mb-1">
                Característica principal
              </label>
              <input
                type="text"
                id="caracteristicas.exterior.principal"
                name="caracteristicas.exterior.principal"
                value={formData.caracteristicas.exterior.principal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Faros LED"
              />
            </div>
            
            {/* Campos adicionales de exterior */}
            {camposCaracteristicas.exterior.length > 0 && (
              <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700">Características adicionales:</p>
                {camposCaracteristicas.exterior.map((campo) => (
                  <div key={campo.id} className="flex items-start space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={campo.valor}
                        onChange={(e) => actualizarCampoAdicional(campo.id, e.target.value, 'exterior', 'caracteristicas')}
                        placeholder="Escribe otra característica"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarCampoAdicional(campo.id, 'exterior', 'caracteristicas')}
                      className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-200"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button
              type="button"
              onClick={() => agregarCampoAdicional('exterior', 'caracteristicas')}
              className="mt-3 flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Agregar característica adicional
            </button>
          </div>
        </div>
        
        {/* Colores disponibles */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Colores Disponibles</h3>
          
          {/* Color picker personalizado */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-3">Seleccionar color personalizado:</p>
            <div className="flex items-center space-x-4">
              <input
                type="color"
                id="colorPicker"
                value={colorPersonalizado}
                onChange={handleColorPersonalizadoChange}
                className="h-10 w-20 cursor-pointer"
              />
              <span className="text-gray-700 text-sm">{colorPersonalizado}</span>
              <button
                type="button"
                onClick={agregarColorPersonalizado}
                className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-200 text-sm flex items-center"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Agregar
              </button>
            </div>
          </div>
          
          {/* Colores predefinidos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
            {colorOptions.map(color => (
              <div key={color.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${color.value}`}
                  checked={formData.coloresDisponibles.includes(color.value)}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor={`${color.value}`} className="ml-2 text-sm font-medium text-gray-900">
                  {color.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </form>
  );
}