import { NextResponse } from 'next/server';
import { getPublicProjectChangelogs } from '@/lib/api/public';

/*
    Get project changelogs
    GET /api/v1/projects/[slug]/changelogs
*/
export async function GET(req: Request, context: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await context.params;
  const { data: changelogs, error } = await getPublicProjectChangelogs(
    resolvedParams.slug,
    'route',
    true,
    false
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return changelogs
  return NextResponse.json(changelogs, { status: 200 });
}
