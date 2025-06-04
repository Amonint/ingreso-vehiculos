export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  año: number;
  color: string;
  placa: string;
  tarjetaImageUrl: string; // Nueva imagen para tarjeta
  bannerImageUrl: string; // Nueva imagen para banner
  galleryImageUrls: string[]; // Nuevo array para imágenes de galería (máximo 5)
  createdAt: Date;
  updatedAt: Date;
} 