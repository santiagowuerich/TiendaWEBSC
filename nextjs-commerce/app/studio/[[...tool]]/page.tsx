/**
 * This route is responsiblse for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <NextStudio config={config} />;
}
