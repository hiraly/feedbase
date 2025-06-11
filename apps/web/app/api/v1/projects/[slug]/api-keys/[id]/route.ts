import { NextResponse } from 'next/server';
import { deleteProjectApiKey } from '@/lib/api/projects';

/*
  Delete api key for a project
  DELETE /api/v1/projects/:slug/config/api/:token
*/
export async function DELETE(req: Request, context: { params: Promise<{ slug: string; id: string }> }) {
  const resolvedParams = await context.params;
  const { error } = await deleteProjectApiKey(resolvedParams.slug, resolvedParams.id, 'route');

  if (error) {
    return NextResponse.json({ error }, { status: error.status });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
