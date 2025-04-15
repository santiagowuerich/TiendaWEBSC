/**
 * This route is responsiblse for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

'use client';

// Asegurarse de que esta página se procese en el lado del cliente
export const dynamic = 'force-dynamic';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';
import { Suspense } from 'react';

// Dynamic route segment for Sanity Studio
// https://www.sanity.io/docs/next-js-studio-page
export default function StudioPage() {
  return (
    <Suspense fallback={<div>Cargando Sanity Studio...</div>}>
      <div className="h-full">
        <NextStudio config={config} />
      </div>
    </Suspense>
  );
}
