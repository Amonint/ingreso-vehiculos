export interface Vehicle {
  id?: string;
  marca: string;
  modelo: string;
  año: string;
  tipoVehiculo: string;
  descripcion: string;
  precio: number;
  fichaTecnicaUrl?: string;
  imagenBanner: string;
  imagenTarjeta: string;
  imagenGaleria: string[];
  especificaciones: {
    motor: {
      principal: string;
      adicionales: string[];
    };
    transmision: {
      principal: string;
      adicionales: string[];
    };
    consumo: {
      principal: string;
      adicionales: string[];
    };
    potencia: {
      principal: string;
      adicionales: string[];
    };
  };
  caracteristicas: {
    seguridad: {
      principal: string;
      adicionales: string[];
    };
    confort: {
      principal: string;
      adicionales: string[];
    };
    exterior: {
      principal: string;
      adicionales: string[];
    };
  };
  coloresDisponibles: string[]; // colores en formato hexadecimal (#RRGGBB)
  createdAt?: number;
  updatedAt?: number;
} 