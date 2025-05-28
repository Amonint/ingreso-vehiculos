import { NextResponse } from 'next/server';

export function middleware(request) {
  const authCookie = request.cookies.get('auth');
  const isAuthPage = request.nextUrl.pathname === '/';
  const isVehiclesRoute = request.nextUrl.pathname.startsWith('/vehicles');

  // Si no está autenticado y trata de acceder a rutas protegidas
  if (!authCookie && (isVehiclesRoute || !isAuthPage)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si está autenticado y trata de acceder a la página de login
  if (authCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/vehicles', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/vehicles/:path*',
    '/vehicles/add',
    '/vehicles/edit/:path*'
  ]
}; 