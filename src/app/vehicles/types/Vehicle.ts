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
  imageUrls: string[]; // URLs de las imágenes
} 