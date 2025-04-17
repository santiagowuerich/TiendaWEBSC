import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Esta función se ejecuta antes de cada petición a rutas que coincidan con el matcher
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(`[Middleware] Request received for: ${pathname}`); // Log inicial

  // Permitir acceso a studio-debug siempre
  if (pathname === '/studio-debug') {
    console.log(`[Middleware] Path is /studio-debug, allowing access.`);
    return NextResponse.next();
  }
  
  // Aplicar lógica de protección solo a rutas que comienzan con /studio
  if (pathname.startsWith('/studio')) {
    console.log(`[Middleware] Processing /studio path: ${pathname}`);
    const adminKeyEnv = process.env.ADMIN_ACCESS_KEY;
    const accessKeyParam = request.nextUrl.searchParams.get('access_key');
    const authCookie = request.cookies.get('studio_auth')?.value;
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const isDevelopment = process.env.NODE_ENV === 'development';

    console.log(`[Middleware] Values: adminKeyEnv=${adminKeyEnv ? 'SET' : 'NOT SET'}, accessKeyParam=${accessKeyParam}, authCookie=${authCookie ? 'SET' : 'NOT SET'}, isLocalhost=${isLocalhost}, isDevelopment=${isDevelopment}`);

    // 1. Verificar si la clave ADMIN_ACCESS_KEY está configurada
    if (!adminKeyEnv) {
      console.error('[Middleware] ADMIN_ACCESS_KEY env var is not set! Redirecting to /.');
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. Determinar si el usuario está autorizado
    const isAuthorizedByCookie = authCookie === adminKeyEnv;
    const isAuthorizedByParam = accessKeyParam === adminKeyEnv;
    const isAuthorizedByLocalDev = isLocalhost && isDevelopment;
    const isAuthorized = isAuthorizedByCookie || isAuthorizedByParam || isAuthorizedByLocalDev;

    console.log(`[Middleware] Authorization check: isAuthorizedByCookie=${isAuthorizedByCookie}, isAuthorizedByParam=${isAuthorizedByParam}, isAuthorizedByLocalDev=${isAuthorizedByLocalDev} => isAuthorized=${isAuthorized}`);

    // 3. Si no está autorizado, redirigir a la página principal
    if (!isAuthorized) {
      console.log(`[Middleware] Result: Access DENIED. Redirecting to /`);
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 4. Si está autorizado por parámetro pero NO por cookie, establecer cookie y redirigir
    if (isAuthorizedByParam && !isAuthorizedByCookie) {
      console.log(`[Middleware] Result: Authorized by param, cookie MISSING/INVALID. Setting cookie and redirecting.`);
      const redirectUrl = new URL(pathname, request.url);
      redirectUrl.searchParams.delete('access_key');
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set({
        name: 'studio_auth',
        value: adminKeyEnv,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: !isLocalhost, // Secure=true excepto en localhost
        sameSite: 'lax'
      });
      console.log(`[Middleware] Redirecting to cleaned URL: ${redirectUrl.toString()}`);
      return response;
    }

    // 5. Si está autorizado (por cookie, localhost dev, o ya se estableció la cookie), permitir acceso
    console.log(`[Middleware] Result: Access ALLOWED for ${pathname}.`);
    return NextResponse.next();
  }
  
  // Para todas las demás rutas, no hacer nada
  console.log(`[Middleware] Path does not start with /studio or /studio-debug. Allowing.`);
  return NextResponse.next();
}

// Especificar las rutas a las que se aplicará este middleware
export const config = {
  matcher: ['/studio/:path*', '/studio-debug'],
} 