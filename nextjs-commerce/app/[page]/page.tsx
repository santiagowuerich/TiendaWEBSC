import type { Metadata } from 'next';
import Prose from '../../components/prose';
import { sanityClient } from '../../lib/sanity';
import { notFound } from 'next/navigation';

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await sanityClient.fetch(
    `*[_type == "page" && slug.current == $slug][0]`,
    { slug: params.page }
  );

  if (!page) return notFound();

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      type: 'article'
    }
  };
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params;
  const page = await sanityClient.fetch(
    `*[_type == "page" && slug.current == $slug][0]`,
    { slug: params.page }
  );

  if (!page) return notFound();

  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
      <Prose className="mb-8" html={page.content} />
      <p className="text-sm italic">
        {`Esta página fue actualizada el ${new Intl.DateTimeFormat('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(new Date())}.`}
      </p>
    </>
  );
}
