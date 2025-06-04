import { getAllVehicles } from '../../services/vehicleService';
import VehicleDetailClient from './VehicleDetailClient';

// Esta función le dice a Next.js qué páginas generar estáticamente
export async function generateStaticParams() {
  const vehicles = await getAllVehicles();
  return vehicles.map((vehicle) => ({
    id: vehicle.id,
  }));
}

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <VehicleDetailClient id={params.id} />
      </div>
    </div>
  );
} 