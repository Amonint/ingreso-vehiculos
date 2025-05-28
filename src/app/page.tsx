'use client';

import { useState, useEffect } from 'react';
import { getVehicles, deleteVehicle, deleteVehicleImage } from './services/vehicleService';
import { Vehicle } from './types/vehicle';
import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from './firebase/config';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useRequireAuth } from './hooks/useRequireAuth';

export default function Home() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useRequireAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      setIsAuthenticated(!!user);
      if (user) {
        // Set auth cookie
        Cookies.set('auth', 'true', { expires: 7 }); // Cookie expires in 7 days
        router.push('/vehicles');
      } else {
        // Remove auth cookie
        Cookies.remove('auth');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        // Set auth cookie
        Cookies.set('auth', 'true', { expires: 7 }); // Cookie expires in 7 days
        router.push('/vehicles');
      }
    } catch (err) {
      console.error('Error signing in:', err);
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  if (isAuthenticated) {
    return null; // No need to render anything if authenticated as we'll redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
