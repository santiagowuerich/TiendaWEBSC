import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { TAGS } from 'lib/constants';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Verificar el token de acceso
    const token = req.headers.get('authorization')?.split(' ')[1];
    const adminKey = process.env.ADMIN_ACCESS_KEY;

    if (!token || token !== adminKey) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Revalidar las etiquetas necesarias
    revalidateTag(TAGS.products);
    revalidateTag(TAGS.collections);

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error('Error durante la revalidación:', err);
    return NextResponse.json(
      { message: 'Error durante la revalidación', error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
