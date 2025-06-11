import { NextResponse } from 'next/server';
import { deleteChangelog, updateChangelog } from '@/lib/api/changelogs';

/*
    Update project changelog
    PUT /api/v1/projects/[slug]/changelogs/[id]
    {
        title: string;
        summary: string;
        content: string;
        image?: string;
        publish_date?: Date;
        published: boolean;
    }
*/
export async function PUT(req: Request, context: { params: Promise<{ slug: string; id: string }> }) {
  const resolvedParams = await context.params;
  const { title, summary, content, image, publishDate, published } = await req.json();

  const { data: changelog, error } = await updateChangelog(
    resolvedParams.id,
    resolvedParams.slug,
    { title, summary, content, image, publish_date: publishDate, published },
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return changelog
  return NextResponse.json(changelog, { status: 200 });
}

/*
    Delete project changelog
    DELETE /api/v1/projects/[slug]/changelogs/[id]
*/
export async function DELETE(req: Request, context: { params: Promise<{ slug: string; id: string }> }) {
  const resolvedParams = await context.params;
  const { data, error } = await deleteChangelog(resolvedParams.id, resolvedParams.slug, 'route');

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return success
  return NextResponse.json(data, { status: 200 });
}
