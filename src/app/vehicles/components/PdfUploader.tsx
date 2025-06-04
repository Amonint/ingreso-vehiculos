'use client';

import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase/config';

interface PdfUploaderProps {
  vehicleId: string;
  onPdfUploaded?: (url: string) => void;
  currentPdfUrl?: string;
  className?: string;
}

export const PdfUploader = ({
  vehicleId,
  onPdfUploaded,
  currentPdfUrl,
  className = ''
}: PdfUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(currentPdfUrl);

  useEffect(() => {
    setPdfUrl(currentPdfUrl);
  }, [currentPdfUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea un archivo PDF
    if (file.type !== 'application/pdf') {
      setError('Por favor, selecciona un archivo PDF');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Crear nombre único para el archivo
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      
      // Crear referencia en Firebase Storage
      const storageRef = ref(storage, `vehicles/${vehicleId}/ficha_tecnica/${fileName}`);
      
      // Subir el archivo
      const snapshot = await uploadBytes(storageRef, file);
      
      // Obtener la URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Actualizar estado y notificar al componente padre
      setPdfUrl(downloadURL);
      onPdfUploaded?.(downloadURL);

      // Limpiar el input
      event.target.value = '';
    } catch (err) {
      setError('Error al subir el archivo. Por favor, intenta de nuevo.');
      console.error('Error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePdf = () => {
    setPdfUrl(undefined);
    onPdfUploaded?.('');
  };

  return (
    <div className={`max-w-md mx-auto p-4 ${className}`}>
      <div className="mb-4">
        <label className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg h-32 px-6 cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="text-center">
            <div className="mt-2 flex flex-col items-center">
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p className="mt-1 text-sm text-gray-600">
                Hacer clic para seleccionar ficha técnica (PDF)
              </p>
            </div>
          </div>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {uploading && (
        <div className="mb-4 text-center">
          <p className="text-blue-600">Subiendo archivo...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {pdfUrl && (
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <a 
              href={pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Ver ficha técnica
            </a>
          </div>
          <button
            type="button"
            onClick={handleRemovePdf}
            className="text-red-500 hover:text-red-700"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}; 