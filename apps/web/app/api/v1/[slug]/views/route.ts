import { NextRequest, NextResponse } from 'next/server';
import { recordClick } from '@/lib/tinybird';

/*
  Record page view
  POST /api/v1/[project]/views
  {
    "feedbackId": "string",
    "changelogId": "string",
  }
*/
export async function POST(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await context.params;
  const { feedbackId, changelogId } = await req.json();

  // Check for Tinybird env vars
  if (!process.env.TINYBIRD_API_URL || !process.env.TINYBIRD_API_KEY) {
    return NextResponse.json({ error: 'Tinybird environment variables not set' }, { status: 500 });
  }

  const data = await recordClick({
    req,
    projectId: resolvedParams.slug,
    feedbackId,
    changelogId,
  });

  return NextResponse.json({ data }, { status: 200 });
}
