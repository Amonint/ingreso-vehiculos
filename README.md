# Sistema de Gestión de Vehículos

Un sistema CRUD completo para la gestión de vehículos, desarrollado con Next.js, Firebase y Tailwind CSS.

## Características

- Interfaz de usuario moderna y responsive usando Tailwind CSS
- Sistema CRUD completo (Crear, Leer, Actualizar, Eliminar) para vehículos
- Gestión de imágenes con Firebase Storage
- Formulario de vehículos con campos organizados por categorías
- Campos dinámicos para especificaciones y características
- Selección visual de colores disponibles
- Galería de imágenes de vehículos
- Filtrado y búsqueda de vehículos
- Validación de formularios

## Estructura de Datos

Los vehículos tienen una estructura organizada por categorías:

- **Datos Básicos**: marca, modelo, año, tipo de vehículo
- **Especificaciones Técnicas**: 
  - Motor (principal y adicionales)
  - Transmisión (principal y adicionales)
  - Consumo (principal y adicionales)
  - Potencia (principal y adicionales)
- **Características**: 
  - Seguridad (principal y adicionales)
  - Confort (principal y adicionales)
  - Exterior (principal y adicionales)
- **Colores Disponibles**: Selección visual de colores
- **Imágenes**: Múltiples imágenes por vehículo con vista previa

## Tecnologías Utilizadas

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Firebase (Firestore, Storage)
- **Autenticación**: Firebase Authentication
- **Despliegue**: Vercel (opcional)

## Requisitos Previos

- Node.js (v18 o superior)
- Cuenta de Firebase
- Git

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd ingreso-vehiculos
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   - Crea un archivo `.env.local` en la raíz del proyecto
   - Añade las credenciales de Firebase:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
   ```

4. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Configuración de Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Activar Firestore Database (modo prueba o producción)
3. Activar Storage para almacenamiento de imágenes
4. Copiar las credenciales desde la configuración del proyecto para el archivo `.env.local`

## Estructura del Proyecto

```
/src
  /app
    /components          # Componentes reutilizables
    /firebase            # Configuración de Firebase
    /pages               # Páginas de la aplicación
    /services            # Servicios de Firebase
    /types               # Definiciones de tipos TypeScript
    /utils               # Utilidades
    layout.tsx           # Layout principal
    page.tsx             # Página principal
  /public                # Archivos estáticos
```

## Uso

1. **Lista de Vehículos**: La página principal muestra todos los vehículos registrados.
2. **Agregar Vehículo**: Haz clic en "Agregar Vehículo" para abrir el formulario.
3. **Ver Detalles**: Haz clic en "Ver Detalles" en una tarjeta de vehículo para ver información completa.
4. **Editar Vehículo**: En la página de detalles, haz clic en "Editar" para modificar la información.
5. **Eliminar Vehículo**: En la página de detalles, haz clic en "Eliminar" y confirma para borrar el vehículo.

## Despliegue

Para desplegar en Vercel:

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Conecta tu repositorio
3. Configura las variables de entorno igual que en `.env.local`
4. Despliega la aplicación

## Licencia

MIT

## Contacto

Desarrollado como parte de un proyecto de práctica.