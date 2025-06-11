import { NextResponse } from 'next/server';
import { deleteFeedbackTagByName } from '@/lib/api/feedback';

/*
    Delete tag by name
    DELETE /api/v1/projects/:slug/feedback/tags/:name
*/
export async function DELETE(req: Request, context: { params: Promise<{ slug: string; name: string }> }) {
  const resolvedParams = await context.params;
  const { data: tag, error } = await deleteFeedbackTagByName(
    resolvedParams.slug,
    resolvedParams.name,
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return tag
  return NextResponse.json(tag, { status: 200 });
}
