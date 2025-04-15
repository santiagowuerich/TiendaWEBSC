import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Esta función se ejecuta antes de cada petición a rutas que coincidan con el matcher
export function middleware(request: NextRequest) {
  // Permitir acceso a studio-debug siempre
  if (request.nextUrl.pathname === '/studio-debug') {
    return NextResponse.next();
  }
  
  // Si es el Studio pero sin clave de acceso en la URL, permitir (la autenticación 
  // se maneja ahora en el componente cliente con localStorage)
  if (request.nextUrl.pathname.startsWith('/studio')) {
    // Si tiene la clave en los parámetros, permitir
    if (request.nextUrl.searchParams.has('access_key')) {
      return NextResponse.next();
    }
    
    // Si es localhost en desarrollo, permitir siempre
    const host = request.headers.get('host') || '';
    if ((host.includes('localhost') || host.includes('127.0.0.1')) && 
        process.env.NODE_ENV === 'development') {
      return NextResponse.next();
    }
    
    // Para todas las demás peticiones al Studio, permitir y dejar que
    // el componente cliente maneje la autenticación con localStorage
    return NextResponse.next();
  }
  
  // Para todas las demás rutas, permitir
  return NextResponse.next();
}

// Especificar las rutas a las que se aplicará este middleware
export const config = {
  matcher: ['/studio/:path*', '/studio-debug'],
} 