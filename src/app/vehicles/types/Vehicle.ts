interface FeatureSection {
  principal: string;
  adicionales: string[];
}

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
    motor: FeatureSection;
    transmision: FeatureSection;
    consumo: FeatureSection;
    potencia: FeatureSection;
  };
  caracteristicas: {
    seguridad: FeatureSection;
    confort: FeatureSection;
    exterior: FeatureSection;
  };
  coloresDisponibles: string[];
  createdAt?: number;
  updatedAt?: number;
} 