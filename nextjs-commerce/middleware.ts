import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Esta función se ejecuta antes de cada petición a rutas que coincidan con el matcher
export function middleware(request: NextRequest) {
  // Verificar si la ruta comienza con /studio
  if (request.nextUrl.pathname.startsWith('/studio')) {
    // Obtener la clave de acceso de la query string (ideal para desarrollo y pruebas iniciales)
    const adminKey = request.nextUrl.searchParams.get('access_key')
    
    // Verificar si la clave proporcionada coincide con la definida en las variables de entorno
    // O si la petición proviene de localhost (para desarrollo)
    const isLocalhost = request.headers.get('host')?.includes('localhost')
    const isCorrectKey = adminKey === process.env.ADMIN_ACCESS_KEY
    
    // Si no es localhost y la clave no es correcta
    if (!isLocalhost && !isCorrectKey) {
      // Redirigir a la página principal
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  // Si la validación pasa o la ruta no es /studio, continuar con la petición normal
  return NextResponse.next()
}

// Especificar las rutas a las que se aplicará este middleware
export const config = {
  matcher: ['/studio/:path*'],
} 