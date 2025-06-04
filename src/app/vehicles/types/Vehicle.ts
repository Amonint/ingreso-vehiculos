interface FeatureSection {
  principal: string;
  adicionales: string[];
}

export interface Vehicle {
  id?: string;
  año: string;
  marca: string;
  modelo: string;
  tipoVehiculo: string;
  descripcion: string;
  precio: number;
  fichaTecnicaUrl?: string;
  coloresDisponibles: string[];
  caracteristicas: {
    confort: FeatureSection;
    exterior: FeatureSection;
    seguridad: FeatureSection;
  };
  especificaciones: {
    consumo: FeatureSection;
    motor: FeatureSection;
    potencia: FeatureSection;
    transmision: FeatureSection;
  };
  imagenBanner: string; // URL de la imagen del banner
  imagenTarjeta: string; // URL de la imagen de la tarjeta
  imagenGaleria: string[]; // URLs de las imágenes de la galería
  createdAt?: number;
  updatedAt?: number;
} 