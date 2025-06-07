import { NextResponse } from 'next/server';

export function middleware(request) {
  const authCookie = request.cookies.get('auth');
  const isAuthPage = request.nextUrl.pathname === '/';
  const isVehiclesRoute = request.nextUrl.pathname.startsWith('/vehicles');
  const isNewsRoute = request.nextUrl.pathname.startsWith('/news');
  const isPromotionsRoute = request.nextUrl.pathname.startsWith('/promotions');

  // Si no está autenticado y trata de acceder a rutas protegidas
  if (!authCookie && (isVehiclesRoute || isNewsRoute || isPromotionsRoute || !isAuthPage)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si está autenticado y trata de acceder a la página de login
  if (authCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/vehicles', request.url));
  }

  // Permitir la navegación a las rutas de vehículos
  if (isVehiclesRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/vehicles/:path*',
    '/vehicles/add',
    '/vehicles/edit/:path*',
    '/news/:path*',
    '/promotions/:path*'
  ]
}; 