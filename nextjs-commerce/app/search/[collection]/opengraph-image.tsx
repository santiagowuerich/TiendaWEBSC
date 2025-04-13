import { ImageResponse } from 'next/og';
import { sanityClient } from '../../../lib/sanity';

export const runtime = 'edge';
export const contentType = 'image/png';

export default async function OpenGraphImage({ params }: { params: { collection: string } }) {
  const collection = await sanityClient.fetch(
    `*[_type == "category" && slug.current == $slug][0]`,
    { slug: params.collection }
  );

  if (!collection) {
    return new Response('Not Found', { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          color: '#fff'
        }}
      >
        <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>{collection.title}</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
