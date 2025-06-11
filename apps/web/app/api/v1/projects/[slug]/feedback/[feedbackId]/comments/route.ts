import { NextResponse } from 'next/server';
import { createCommentForFeedbackById, getCommentsForFeedbackById } from '@/lib/api/comments';
import { FeedbackCommentProps } from '@/lib/types';

/* 
    Create feedback comment
    POST /api/v1/projects/[slug]/feedback/[id]/comments
    {
        content: string
    }
*/
export async function POST(req: Request, context: { params: Promise<{ slug: string; feedbackId: string }> }) {
  const resolvedParams = await context.params;
  const { content, reply_to_id: replyToId } = (await req.json()) as FeedbackCommentProps['Insert'];

  if (!content) {
    return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
  }

  const { data: comment, error } = await createCommentForFeedbackById(
    {
      feedback_id: resolvedParams.feedbackId,
      content: content || '',
      user_id: 'dummy-id',
      reply_to_id: replyToId || null,
    },
    resolvedParams.slug,
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return comment
  return NextResponse.json(comment, { status: 200 });
}

/*
    Get feedback comments
    GET /api/v1/projects/[slug]/feedback/[id]/comments
*/
export async function GET(req: Request, context: { params: Promise<{ slug: string; feedbackId: string }> }) {
  const resolvedParams = await context.params;
  const { data: comments, error } = await getCommentsForFeedbackById(
    resolvedParams.feedbackId,
    resolvedParams.slug,
    'route'
  );

  // If any errors thrown, return error
  if (error) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  // Return comments
  return NextResponse.json(comments, { status: 200 });
}
