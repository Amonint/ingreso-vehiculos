import { getAllVehicles } from '../../services/vehicleService';
import EditVehicleClient from './EditVehicleClient';

// Esta función es requerida para páginas dinámicas con output: export
export async function generateStaticParams() {
  try {
    const vehicles = await getAllVehicles();
    return vehicles.map((vehicle) => ({
      id: vehicle.id,
    }));
  } catch (error) {
    // Si falla al obtener vehículos (ej: durante build), devolver array vacío
    console.warn('No se pudieron obtener vehículos para generateStaticParams:', error);
    return [];
  }
}

export default function EditVehiclePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <EditVehicleClient id={params.id} />
      </div>
    </div>
  );
} 